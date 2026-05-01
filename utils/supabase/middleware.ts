import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;

  // 1. Unauthenticated users handling
  if (!user) {
    // List of protected routes that require login
    const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/staff');
    
    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  }

  // 2. Authenticated users handling (RBAC)
  if (user) {
    // If user is logged in and trying to access login page, redirect to home
    if (pathname.startsWith('/auth/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Fetch user role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile ? (profile as { role: string }).role : null;


    // Admin Route Protection
    if (pathname.startsWith('/admin') && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = role === 'staff' ? '/staff' : '/'
      return NextResponse.redirect(url)
    }

    // Staff Route Protection
    if (pathname.startsWith('/staff') && role !== 'staff') {
      const url = request.nextUrl.clone()
      url.pathname = role === 'admin' ? '/admin' : '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
};