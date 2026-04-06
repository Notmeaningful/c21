import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
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

  if (!token) {
    // API routes return 401, pages redirect to login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/submissions/export/:path*'],
};
