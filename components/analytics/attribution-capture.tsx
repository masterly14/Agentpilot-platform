"use client"

import { useEffect } from "react"
import { collectAttribution } from "@/lib/marketing/attribution-client"

export function AttributionCapture() {
  useEffect(() => {
    collectAttribution()
    const timeouts = [800, 2500].map((ms) => window.setTimeout(() => collectAttribution(), ms))
    return () => {
      for (const timeout of timeouts) window.clearTimeout(timeout)
    }
  }, [])

  return null
}
