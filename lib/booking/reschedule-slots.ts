import { addDays, format } from "date-fns"
import { getDayAvailability } from "@/lib/booking/composio-calendar"
import { getBookingToday, isBookableDay } from "@/lib/booking/rules"
import type { BookingSlot } from "@/lib/booking/types"

export type ReschedulePreference = "morning" | "afternoon" | "any"

export type NearbySlotsInput = {
  fromDate?: string
  preference?: ReschedulePreference
  avoidWindow?: ReschedulePreference
  excludeStarts?: string[]
  daysToSearch?: number
}

function preferenceMatches(slot: BookingSlot, preference: ReschedulePreference) {
  if (preference === "any") return true
  const hour = Number(slot.start.slice(11, 13))
  return preference === "morning" ? hour < 13 : hour >= 13
}

export async function findNearbyRescheduleSlots(input: NearbySlotsInput = {}) {
  const start = input.fromDate ?? getBookingToday()
  const excluded = new Set(input.excludeStarts ?? [])
  const preference = input.preference ?? "any"
  const avoid = input.avoidWindow
  const days = input.daysToSearch ?? 14
  const candidates: BookingSlot[] = []

  for (let offset = 0; offset < days && candidates.length < 3; offset += 1) {
    const date = format(addDays(new Date(`${start}T12:00:00`), offset), "yyyy-MM-dd")
    if (!isBookableDay(date)) continue
    const { slots } = await getDayAvailability(date)
    const available = slots.filter((slot) => slot.available && !excluded.has(slot.start))
    const preferred = available.filter((slot) => preferenceMatches(slot, preference))
    const nonAvoided = preferred.filter((slot) => !avoid || !preferenceMatches(slot, avoid))
    candidates.push(...(nonAvoided.length ? nonAvoided : preferred).slice(0, 3 - candidates.length))
  }

  return candidates
}

export function preferredWindowFromText(value: string): ReschedulePreference | undefined {
  const normalized = value.toLowerCase()
  if (/\b(mañana|manana|am|temprano)\b/.test(normalized)) return "morning"
  if (/\b(tarde|pm|después de almuerzo|despues de almuerzo)\b/.test(normalized)) return "afternoon"
  return undefined
}
