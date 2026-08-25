import { NextResponse, type NextRequest } from "next/server"
import {
  ATTRIBUTION_COOKIE_MAX_AGE,
  ATTRIBUTION_COOKIES,
  attributionFromCookies,
  attributionFromSearchParams,
  mergeAttribution,
  trimToUndefined,
  type AttributionPayload,
} from "@/lib/marketing/cookies"

function shouldSkipAttribution(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  )
}

function cookieOptions() {
  return {
    path: "/",
    maxAge: ATTRIBUTION_COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  }
}

export function stampAttributionCookies(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl
  if (shouldSkipAttribution(pathname)) return response

  const existing = attributionFromCookies(request.headers.get("cookie"))
  const fromUrl = attributionFromSearchParams(request.nextUrl.searchParams)
  const fromRequest: AttributionPayload = {
    landingPath: pathname,
    referrer: trimToUndefined(request.headers.get("referer")),
  }
  const incoming = mergeAttribution(fromUrl, fromRequest)

  for (const [field, cookieName] of Object.entries(ATTRIBUTION_COOKIES) as [
    keyof AttributionPayload,
    string,
  ][]) {
    const value = incoming[field]
    if (!value || existing[field]) continue
    response.cookies.set(cookieName, value, cookieOptions())
  }

  return response
}
