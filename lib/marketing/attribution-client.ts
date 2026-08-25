import {
  ATTRIBUTION_COOKIE_MAX_AGE,
  ATTRIBUTION_COOKIES,
  attributionFromCookies,
  attributionFromSearchParams,
  compactAttribution,
  deriveFbc,
  mergeAttribution,
  serializeCookieValue,
  trimToUndefined,
  type AttributionPayload,
} from "@/lib/marketing/cookies"

function readBrowserCookies() {
  if (typeof document === "undefined") return {}
  return attributionFromCookies(document.cookie)
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${serializeCookieValue(value)}; Path=/; Max-Age=${ATTRIBUTION_COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

function stampFirstTouchCookies(payload: AttributionPayload) {
  const existing = readBrowserCookies()
  for (const [field, cookieName] of Object.entries(ATTRIBUTION_COOKIES) as [
    keyof AttributionPayload,
    string,
  ][]) {
    const value = payload[field]
    if (!value || existing[field]) continue
    writeCookie(cookieName, value)
  }
}

export function collectAttribution(): AttributionPayload {
  if (typeof window === "undefined") return {}

  const fromUrl = attributionFromSearchParams(new URLSearchParams(window.location.search))
  const fromCookies = readBrowserCookies()
  const fbp = trimToUndefined(fromCookies.fbp)
  const fbc =
    trimToUndefined(fromCookies.fbc) ||
    (fromUrl.fbclid ? deriveFbc(fromUrl.fbclid) : undefined)

  const fromPage: AttributionPayload = {
    landingPath: window.location.pathname,
    referrer: trimToUndefined(document.referrer),
    fbp,
    fbc,
  }

  const merged = mergeAttribution(fromUrl, mergeAttribution(fromCookies, fromPage))
  stampFirstTouchCookies(merged)
  return compactAttribution(merged)
}
