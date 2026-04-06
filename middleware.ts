import { NextRequest, NextResponse } from 'next/server';

async function verifyAdminToken(token: string): Promise<boolean> {
  const secret = process.env.AUTH_SECRET;
  if (!secret || !token) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['verify']
    );

    const toBuffer = (b64url: string): ArrayBuffer => {
      const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
      const str = atob(padded);
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
      return arr.buffer as ArrayBuffer;
    };

    const isValid = await crypto.subtle.verify('HMAC', key, toBuffer(sigB64), enc.encode(payloadB64).buffer as ArrayBuffer);
    if (!isValid) return false;

    const b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    return typeof payload.exp === 'number' && Date.now() < payload.exp;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public auth pages and APIs
  const publicPaths = [
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password',
    '/api/auth/admin-login',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/logout',
  ];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Protect all /admin/* and admin API routes
  const token = request.cookies.get('c21_admin_token')?.value;
  const isValid = token ? await verifyAdminToken(token) : false;

  if (!isValid) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/submissions/export/:path*'],
};
