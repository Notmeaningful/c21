import { NextRequest, NextResponse } from 'next/server';
import { getUsers, hashPassword } from '@/lib/store/user-store';
import { resetTokens } from '@/lib/store/reset-tokens';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password required' }, { status: 400 });
    }

    if (newPassword.length < 3) {
      return NextResponse.json({ error: 'Password must be at least 3 characters' }, { status: 400 });
    }

    const resetData = resetTokens[token];
    if (!resetData) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    if (Date.now() > resetData.expires) {
      delete resetTokens[token];
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    const users = getUsers();
    const user = users[resetData.username];
    if (!user) {
      delete resetTokens[token];
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.password = hashPassword(newPassword);
    delete resetTokens[token];

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
