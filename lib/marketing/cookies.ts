export type AttributionPayload = {
  fbclid?: string
  fbp?: string
  fbc?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  landingPath?: string
  referrer?: string
}

export const ATTRIBUTION_COOKIE_MAX_AGE = 90 * 24 * 60 * 60

export const ATTRIBUTION_COOKIES = {
  fbclid: "ap_fbclid",
  fbp: "ap_fbp",
  fbc: "ap_fbc",
  utmSource: "ap_utm_source",
  utmMedium: "ap_utm_medium",
  utmCampaign: "ap_utm_campaign",
  utmContent: "ap_utm_content",
  utmTerm: "ap_utm_term",
  landingPath: "ap_landing",
  referrer: "ap_referrer",
} as const satisfies Record<keyof AttributionPayload, string>

const COOKIE_TO_FIELD = Object.fromEntries(
  Object.entries(ATTRIBUTION_COOKIES).map(([field, cookie]) => [cookie, field]),
) as Record<string, keyof AttributionPayload>

export function deriveFbc(fbclid: string, timestampSeconds = Math.floor(Date.now() / 1000)) {
  return `fb.1.${timestampSeconds}.${fbclid}`
}

export function parseCookieHeader(header: string | null | undefined) {
  const result: Record<string, string> = {}
  if (!header) return result
  for (const part of header.split(";")) {
    const index = part.indexOf("=")
    if (index < 0) continue
    const key = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    if (!key) continue
    try {
      result[key] = decodeURIComponent(value)
    } catch {
      result[key] = value
    }
  }
  return result
}

export function attributionFromCookies(header: string | null | undefined): AttributionPayload {
  const cookies = parseCookieHeader(header)
  const payload: AttributionPayload = {}

  for (const [cookieName, field] of Object.entries(COOKIE_TO_FIELD)) {
    const value = trimToUndefined(cookies[cookieName])
    if (value) payload[field] = value
  }

  if (!payload.fbp) payload.fbp = trimToUndefined(cookies._fbp)
  if (!payload.fbc) payload.fbc = trimToUndefined(cookies._fbc)
  if (!payload.fbclid) payload.fbclid = trimToUndefined(cookies.fbclid)
  if (payload.fbclid && !payload.fbc) payload.fbc = deriveFbc(payload.fbclid)

  return compactAttribution(payload)
}

export function attributionFromSearchParams(params: URLSearchParams): AttributionPayload {
  const fbclid = trimToUndefined(params.get("fbclid"))
  const payload: AttributionPayload = {
    fbclid,
    utmSource: trimToUndefined(params.get("utm_source")),
    utmMedium: trimToUndefined(params.get("utm_medium")),
    utmCampaign: trimToUndefined(params.get("utm_campaign")),
    utmContent: trimToUndefined(params.get("utm_content")),
    utmTerm: trimToUndefined(params.get("utm_term")),
  }
  if (fbclid) payload.fbc = deriveFbc(fbclid)
  return compactAttribution(payload)
}

export function mergeAttribution(
  primary: AttributionPayload | null | undefined,
  fallback: AttributionPayload | null | undefined,
): AttributionPayload {
  const merged: AttributionPayload = { ...compactAttribution(fallback ?? {}) }
  for (const [key, value] of Object.entries(compactAttribution(primary ?? {}))) {
    if (value) merged[key as keyof AttributionPayload] = value
  }
  if (merged.fbclid && !merged.fbc) merged.fbc = deriveFbc(merged.fbclid)
  return merged
}

export function compactAttribution(payload: AttributionPayload): AttributionPayload {
  const result: AttributionPayload = {}
  for (const [key, value] of Object.entries(payload) as [keyof AttributionPayload, string | undefined][]) {
    const trimmed = trimToUndefined(value)
    if (trimmed) result[key] = trimmed
  }
  return result
}

export function trimToUndefined(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export function serializeCookieValue(value: string) {
  return encodeURIComponent(value)
}
