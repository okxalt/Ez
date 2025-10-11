import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow API routes, Next assets, and the admin login page
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/admin'
  ) {
    return NextResponse.next();
  }

  // Require logged-in session cookie for everything else
  const hasSession = req.cookies.get('whop_app_session')?.value;
  if (!hasSession) {
    const url = new URL('/admin', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
