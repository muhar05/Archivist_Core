import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // 1. Unauthenticated users handling
  if (!token) {
    const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/staff') || (pathname === '/');
    
    // Check if it's NOT the login page to avoid infinite redirect
    if (isProtectedRoute && !pathname.startsWith('/auth/login')) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  }

  // 2. Authenticated users handling (RBAC)
  if (token) {
    const role = (token as { role: string }).role;

    // If user is logged in and trying to access login page, redirect based on role
    if (pathname.startsWith('/auth/login')) {
      const url = request.nextUrl.clone();
      url.pathname = role === 'admin' ? '/admin' : '/staff';
      return NextResponse.redirect(url);
    }

    // Admin Route Protection
    if (pathname.startsWith('/admin') && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = role === 'staff' ? '/staff' : '/';
      return NextResponse.redirect(url);
    }

    // Staff Route Protection
    if (pathname.startsWith('/staff') && role !== 'staff') {
      const url = request.nextUrl.clone();
      url.pathname = role === 'admin' ? '/admin' : '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

