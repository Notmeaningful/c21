import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUsers } from '@/lib/store/user-store';
import { resetTokens } from '@/lib/store/reset-tokens';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const users = getUsers();
    const user = users[username.toLowerCase()];

    // Always return success to prevent user enumeration
    if (!user) {
      return NextResponse.json({ message: 'If the account exists, a reset link has been generated.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    resetTokens[token] = {
      username: username.toLowerCase(),
      expires: Date.now() + 30 * 60 * 1000, // 30 minutes
    };

    // In production, send this via email. For now, log it and show the token.
    console.log(`[Password Reset] Token for ${username}: ${token}`);
    console.log(`[Password Reset] URL: /admin/reset-password?token=${token}`);

    return NextResponse.json({
      message: 'If the account exists, a reset link has been generated.',
      // Only in development: show the token
      ...(process.env.NODE_ENV !== 'production' && { resetToken: token }),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
