"use client"

import { useCallback, useEffect, useRef } from "react"
import type { BookingFormData } from "@/lib/booking/types"
import { collectAttribution } from "@/lib/marketing/attribution-client"

const CHOICE_FIELDS = new Set([
  "usesPms",
  "propertyCount",
  "revenueRange",
  "isTodero",
  "usesAi",
  "wantsToScale",
  "industryTime",
])

export type PartialEntrySource = "EBOOK" | "DIAGNOSIS" | "DIRECT_BOOKING"
export type PartialBookingFlow = "DIAGNOSIS_PUBLIC" | "DIRECT_BOOKING"

const STORAGE_PREFIX = "ap.partialLead.v1."

type UsePartialSubmissionOptions = {
  entrySource: PartialEntrySource
  bookingFlow?: PartialBookingFlow
  enabled?: boolean
}

type PartialLeadResponse = {
  token?: string
}

function storageKey(entrySource: PartialEntrySource) {
  return `${STORAGE_PREFIX}${entrySource}`
}

function readStoredToken(entrySource: PartialEntrySource) {
  if (typeof window === "undefined") return ""
  try {
    return window.localStorage.getItem(storageKey(entrySource))?.trim() ?? ""
  } catch {
    return ""
  }
}

function writeStoredToken(entrySource: PartialEntrySource, token: string) {
  try {
    window.localStorage.setItem(storageKey(entrySource), token)
  } catch {
    // Ignore quota / private mode failures; in-memory token still works for the session.
  }
}

function clearStoredToken(entrySource: PartialEntrySource) {
  try {
    window.localStorage.removeItem(storageKey(entrySource))
  } catch {
    // Ignore storage failures.
  }
}

export function usePartialSubmission({
  entrySource,
  bookingFlow,
  enabled = true,
}: UsePartialSubmissionOptions) {
  const tokenRef = useRef("")
  const latestFormRef = useRef<BookingFormData | null>(null)
  const timerRef = useRef<number | null>(null)
  const chainRef = useRef(Promise.resolve())

  useEffect(() => {
    if (!enabled) return
    tokenRef.current = readStoredToken(entrySource)
  }, [enabled, entrySource])

  const send = useCallback(
    (form: BookingFormData, keepalive = false) => {
      if (!enabled) return Promise.resolve()

      const run = async () => {
        try {
          const response = await fetch("/api/leads/partial", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: tokenRef.current || undefined,
              entrySource,
              bookingFlow,
              fields: form,
              attribution: collectAttribution(),
            }),
            keepalive,
          })

          if (!response.ok) return

          const payload = (await response.json()) as PartialLeadResponse
          if (payload.token) {
            tokenRef.current = payload.token
            writeStoredToken(entrySource, payload.token)
          }
        } catch (error) {
          console.error("[partial-submission]", error)
        }
      }

      chainRef.current = chainRef.current.then(run, run)
      return chainRef.current
    },
    [bookingFlow, enabled, entrySource]
  )

  const sync = useCallback(
    (form: BookingFormData, field?: keyof BookingFormData) => {
      if (!enabled) return
      latestFormRef.current = form

      const immediate = field ? CHOICE_FIELDS.has(field) : false
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }

      if (immediate) {
        void send(form)
        return
      }

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        void send(form)
      }, 700)
    },
    [enabled, send]
  )

  const flush = useCallback(async () => {
    if (!enabled) return
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (latestFormRef.current) {
      await send(latestFormRef.current, true)
    } else {
      await chainRef.current
    }
  }, [enabled, send])

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    latestFormRef.current = null
    tokenRef.current = ""
    clearStoredToken(entrySource)
  }, [entrySource])

  useEffect(() => {
    if (!enabled) return

    const onHide = () => {
      void flush()
    }
    const onVisibility = () => {
      if (document.visibilityState === "hidden") onHide()
    }

    window.addEventListener("pagehide", onHide)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      window.removeEventListener("pagehide", onHide)
      document.removeEventListener("visibilitychange", onVisibility)
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [enabled, flush])

  return {
    getToken: () => tokenRef.current,
    sync,
    flush,
    clear,
  }
}
