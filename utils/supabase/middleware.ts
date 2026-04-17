import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const isInvalid = (val: string | undefined) => 
    !val || val === "undefined" || val === "null" || val.trim() === "";

  const supabase = createServerClient(
    isInvalid(supabaseUrl) ? "https://placeholder.supabase.co" : supabaseUrl!,
    isInvalid(supabaseKey) ? "placeholder-key" : supabaseKey!,
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

  // If we are in build/prerender phase without valid env vars, skip the auth checks
  if (isInvalid(supabaseUrl) || isInvalid(supabaseKey)) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes logic
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/auth/login') &&
    !request.nextUrl.pathname.startsWith('/auth/auth-code-error')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Redirect to home if already logged in and trying to access login page
  if (user && request.nextUrl.pathname.startsWith('/auth/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
};