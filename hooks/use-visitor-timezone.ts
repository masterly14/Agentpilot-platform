"use client"

import { useCallback, useState, useSyncExternalStore } from "react"
import { bookingConfig } from "@/lib/booking/config"
import { isValidTimeZone } from "@/lib/booking/timezone"

const emptySubscribe = () => () => {}

function getBrowserTimezone() {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return isValidTimeZone(timeZone) ? timeZone : bookingConfig.timezone
  } catch {
    return bookingConfig.timezone
  }
}

export function useVisitorTimezone() {
  const detectedTimeZone = useSyncExternalStore(
    emptySubscribe,
    getBrowserTimezone,
    () => bookingConfig.timezone
  )
  const [override, setOverride] = useState<string | null>(null)
  const timeZone = override ?? detectedTimeZone

  const setTimeZone = useCallback((next: string) => {
    if (isValidTimeZone(next)) setOverride(next)
  }, [])

  return { timeZone, detectedTimeZone, setTimeZone }
}
