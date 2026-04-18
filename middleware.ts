import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — required so server components get a valid user
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // /account sub-pages are protected — /account itself is the sign-in page
  const isProtectedAccount = pathname.startsWith("/account/")
  if (isProtectedAccount && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/account"
    return NextResponse.redirect(url)
  }

  // /admin and /api/admin are restricted to the site owner only
  const adminEmail = process.env.ADMIN_EMAIL
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin")
  if (isAdminRoute) {
    const authorized = user && adminEmail && user.email === adminEmail
    if (!authorized) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
      }
      const url = request.nextUrl.clone()
      url.pathname = "/account"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/account/:path+", "/admin", "/admin/:path*", "/api/admin/:path*"],
}
