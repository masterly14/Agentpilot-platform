const VISITOR_KEY = "ap.visitor.v1"
const LEGACY_VIDEO_KEY = "ap.video.visitor.v1"

export function getVisitorId() {
  if (typeof window === "undefined") return ""
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY)
    if (existing) return existing
    const legacy = window.localStorage.getItem(LEGACY_VIDEO_KEY)
    if (legacy) {
      window.localStorage.setItem(VISITOR_KEY, legacy)
      return legacy
    }
    const id = crypto.randomUUID()
    window.localStorage.setItem(VISITOR_KEY, id)
    return id
  } catch {
    return crypto.randomUUID()
  }
}

export function readVisitorId(value: unknown) {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  if (trimmed.length < 8 || trimmed.length > 80) return undefined
  return trimmed
}
