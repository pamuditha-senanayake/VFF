import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for Supabase auth cookie or generic token cookie.
  const hasAuthCookie = request.cookies.getAll().some(c => 
    (c.name.includes('sb-') && c.name.includes('-auth-token')) || 
    c.name === 'token' || 
    c.name === 'vff-auth-storage'
  );

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  
  if (!hasAuthCookie && !isAuthRoute && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/hr/:path*',
    '/finance/:path*',
    '/inventory/:path*',
    '/programs/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/support/:path*',
  ],
};
