const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

declare global {
  interface Window {
    fbq?: (
      command: "init" | "track" | "trackCustom",
      eventName: string,
      params?: Record<string, unknown>,
      options?: Record<string, unknown>
    ) => void
  }
}

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0]?.toLowerCase() ?? ""
}

export function isFacebookPixelEnabled() {
  return Boolean(PIXEL_ID)
}

function initAdvancedMatching(email: string, fullName: string) {
  if (typeof window === "undefined" || !window.fbq || !PIXEL_ID) return false
  const normalizedEmail = email.trim().toLowerCase()
  const firstName = getFirstName(fullName)
  window.fbq("init", PIXEL_ID, {
    em: normalizedEmail,
    ...(firstName ? { fn: firstName } : {}),
  })
  return true
}

/** Fires when a visitor successfully books a meeting. Deduped with CAPI via eventID. */
export function trackSchedule(params: {
  email: string
  fullName: string
  eventID: string
}) {
  if (!params.eventID || !initAdvancedMatching(params.email, params.fullName) || !window.fbq) return

  window.fbq(
    "trackCustom",
    "Schedule",
    {
      content_name: "Reunión agendada",
      content_category: "booking",
      value: 25,
      currency: "USD",
      status: "confirmed",
    },
    { eventID: params.eventID },
  )
}

/** Fires when a visitor submits the guide download form. Deduped with CAPI via eventID. */
export function trackEbookLead(params: { email: string; fullName: string; eventID: string }) {
  if (!params.eventID || !initAdvancedMatching(params.email, params.fullName) || !window.fbq) return

  window.fbq(
    "track",
    "Lead",
    {
      content_name: "Guía gratuita",
      content_category: "ebook",
      value: 0,
      currency: "USD",
      status: "submitted",
    },
    { eventID: params.eventID },
  )
}
