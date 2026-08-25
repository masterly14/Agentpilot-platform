import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_COOKIE, isValidSessionValue } from "@/lib/admin-auth"
import { stampAttributionCookies } from "@/lib/marketing/middleware"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedPage = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")
  const isProtectedApi =
    pathname.startsWith("/api/submissions") ||
    (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login"))

  if (!isProtectedPage && !isProtectedApi) {
    return stampAttributionCookies(request, NextResponse.next())
  }

  const session = request.cookies.get(ADMIN_COOKIE)
  if (!(await isValidSessionValue(session?.value))) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/submissions/:path*",
    "/api/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|api/).*)",
  ],
}
