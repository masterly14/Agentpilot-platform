"use client"

import { useEffect } from "react"
import type { AdLandingPath } from "@/lib/ad-landing"
import { collectAttribution } from "@/lib/marketing/attribution-client"
import { getVisitorId } from "@/lib/visitor-id"

export function LandingVisitTracker({ landingPath }: { landingPath: AdLandingPath }) {
  useEffect(() => {
    const visitorId = getVisitorId()
    if (!visitorId) return

    void fetch("/api/landing/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        landingPath,
        attribution: collectAttribution(),
      }),
      keepalive: true,
    }).catch(() => {
      // El dashboard tolera visitas perdidas; no interrumpir la landing.
    })
  }, [landingPath])

  return null
}
