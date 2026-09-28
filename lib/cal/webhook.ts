import { createHmac, timingSafeEqual } from "node:crypto"
import { getCalConfig } from "@/lib/cal/client"

export type CalWebhookTrigger =
  | "BOOKING_CREATED"
  | "BOOKING_RESCHEDULED"
  | "BOOKING_CANCELLED"
  | string

export type CalWebhookBooking = {
  triggerEvent: CalWebhookTrigger
  uid: string | null
  startTime: Date | null
  meetLink: string | null
  attendeeEmail: string | null
  attendeeName: string | null
  hashedLink: string | null
  metadata: Record<string, string>
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function parseDate(value: unknown) {
  const raw = asString(value)
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

function parseMetadata(value: unknown): Record<string, string> {
  const record = asRecord(value)
  if (!record) return {}
  const out: Record<string, string> = {}
  for (const [key, entry] of Object.entries(record)) {
    if (typeof entry === "string" && entry.trim()) out[key] = entry.trim()
    else if (typeof entry === "number" || typeof entry === "boolean") out[key] = String(entry)
  }
  return out
}

function hashedLinkId(value: unknown) {
  const raw = asString(value)
  if (!raw) return null
  try {
    const url = new URL(raw)
    const parts = url.pathname.split("/").filter(Boolean)
    return parts.at(-1) || raw
  } catch {
    return raw.replace(/^\/+|\/+$/g, "").split("/").at(-1) || raw
  }
}

function firstAttendee(payload: Record<string, unknown>) {
  const attendees = payload.attendees
  if (!Array.isArray(attendees) || attendees.length === 0) return null
  return asRecord(attendees[0])
}

export function verifyCalWebhookSignature(signature: string | null, body: string) {
  const secret = getCalConfig().webhookSecret
  if (!secret) return false
  if (!signature) return false

  const expected = createHmac("sha256", secret).update(body).digest("hex")
  const incoming = signature.replace(/^sha256=/i, "").trim()
  const left = Buffer.from(expected)
  const right = Buffer.from(incoming)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function parseCalWebhook(body: unknown): CalWebhookBooking | null {
  const root = asRecord(body)
  if (!root) return null

  const payload = asRecord(root.payload) ?? asRecord(root.data) ?? root
  const triggerEvent =
    asString(root.triggerEvent) ||
    asString(root.trigger) ||
    asString(payload.triggerEvent) ||
    "BOOKING_CREATED"

  const attendee = firstAttendee(payload)
  const video = asRecord(payload.videoCallData)
  const location = asString(payload.location)
  const meetLink =
    asString(video?.url) ||
    (location && /^https?:\/\//i.test(location) ? location : null) ||
    asString(payload.meetingUrl)

  const metadata = parseMetadata(payload.metadata) ?? parseMetadata(root.metadata)
  const uid = asString(payload.uid) || asString(root.uid)
  const startTime = parseDate(payload.startTime) ?? parseDate(payload.start)

  if (!uid && !metadata.campaignSendId && !startTime) return null

  return {
    triggerEvent,
    uid,
    startTime,
    meetLink,
    attendeeEmail: asString(attendee?.email) || asString(payload.attendeeEmail),
    attendeeName: asString(attendee?.name) || asString(payload.attendeeName),
    hashedLink: hashedLinkId(payload.hashedLink) ?? hashedLinkId(root.hashedLink),
    metadata,
  }
}
