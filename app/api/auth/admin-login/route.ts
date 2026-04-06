import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUsers, verifyPassword } from '@/lib/store/user-store';

// Rate limiting: track failed attempts per IP
const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function createSignedToken(username: string, role: string): string {
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    role,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  })).toString('base64url');
  const secret = process.env.AUTH_SECRET || '';
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

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

    // Enforce sane input lengths to prevent DoS on bcrypt
    if (username.length > 64 || password.length > 128) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const users = getUsers();
    const user = users[username.toLowerCase()];

    if (!user || !verifyPassword(password, user.password)) {
      if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, lastAttempt: 0 };
      loginAttempts[ip].count++;
      loginAttempts[ip].lastAttempt = Date.now();
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    delete loginAttempts[ip];

    const token = createSignedToken(username.toLowerCase(), user.role);

    const response = NextResponse.json({
      username: username.toLowerCase(),
      role: user.role,
      message: 'Login successful',
      // Token is NOT returned in body — it is set only as an httpOnly cookie
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
