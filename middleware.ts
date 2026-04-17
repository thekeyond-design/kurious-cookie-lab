import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /account and /admin — redirect to login when no session cookie present
  const isProtected = pathname.startsWith("/account") || pathname.startsWith("/admin")
  if (isProtected) {
    const hasSession = request.cookies.has("sb-access-token") ||
      request.cookies.getAll().some((c) => c.name.startsWith("sb-"))

    if (!hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/account/:path*"],
}
