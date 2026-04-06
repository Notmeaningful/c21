import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { getUsers } from '@/lib/store/user-store';
import { resetTokens } from '@/lib/store/reset-tokens';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const users = getUsers();
    const user = users[username.toLowerCase()];

    // Always return same message to prevent user enumeration
    const successResponse = NextResponse.json({ message: 'If the account exists, a reset link has been sent.' });

    if (!user?.email) return successResponse;

    const token = crypto.randomBytes(32).toString('hex');
    resetTokens[token] = {
      username: username.toLowerCase(),
      expires: Date.now() + 30 * 60 * 1000, // 30 minutes
    };

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://c21vasco.com'}/admin/reset-password?token=${token}`;

    // Send reset link via email
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.NOTIFY_FROM || 'onboarding@resend.dev',
        to: user.email,
        subject: 'C21 Admin — Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px;">
            <h2 style="color: #1a1a1a;">Password Reset</h2>
            <p style="color: #555;">A password reset was requested for the <strong>${username.toLowerCase()}</strong> admin account.</p>
            <p style="color: #555;">This link expires in 30 minutes.</p>
            <a href="${resetUrl}" style="display:inline-block;background:#b5985a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin:16px 0;">Reset Password</a>
            <p style="color:#aaa;font-size:12px;">If you did not request this, ignore this email.</p>
          </div>
        `,
      }).catch(e => console.error('Reset email failed:', e));
    }

    return successResponse;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
