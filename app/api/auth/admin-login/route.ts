import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUsers, verifyPassword } from '@/lib/store/user-store';

// Rate limiting: track failed attempts per IP
const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Check rate limit
    const attempts = loginAttempts[ip];
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - attempts.lastAttempt;
      if (elapsed < LOCKOUT_DURATION) {
        const remaining = Math.ceil((LOCKOUT_DURATION - elapsed) / 60000);
        return NextResponse.json(
          { error: `Too many failed attempts. Try again in ${remaining} minute(s).` },
          { status: 429 }
        );
      }
      delete loginAttempts[ip];
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    const users = getUsers();
    const user = users[username.toLowerCase()];

    if (!user || !verifyPassword(password, user.password)) {
      // Track failed attempt
      if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, lastAttempt: 0 };
      loginAttempts[ip].count++;
      loginAttempts[ip].lastAttempt = Date.now();

      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Reset attempts on success
    delete loginAttempts[ip];

    const token = crypto.randomBytes(32).toString('hex');

    const response = NextResponse.json({
      token,
      username: username.toLowerCase(),
      role: user.role,
      message: 'Login successful',
    });

    response.cookies.set('c21_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
