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

/** Fires when a visitor successfully books a meeting (conversion / lead). */
export function trackBookingLead(params: {
  email: string
  fullName: string
  date: string
  slotStart: string
}) {
  if (typeof window === "undefined" || !window.fbq || !PIXEL_ID) return

  const email = params.email.trim().toLowerCase()
  const firstName = getFirstName(params.fullName)

  window.fbq("init", PIXEL_ID, {
    em: email,
    ...(firstName ? { fn: firstName } : {}),
  })

  window.fbq(
    "track",
    "Lead",
    {
      content_name: "Reunión agendada",
      content_category: "booking",
      status: "confirmed",
    },
    {
      eventID: `booking-${params.slotStart}-${email}`,
    }
  )
}
