import { VIDEO_OUTREACH_CAMPAIGN_KEY } from "@/lib/campaigns/constants"

const CAL_API_BASE = "https://api.cal.com/v2"
const CAL_EVENT_TYPES_VERSION = "2024-06-14"
const CAL_PRIVATE_LINKS_VERSION = "2024-09-04"

function envTrim(name: string) {
  return process.env[name]?.trim() || ""
}

export function getCalConfig() {
  return {
    apiKey: envTrim("CAL_API_KEY"),
    webhookSecret: envTrim("CAL_WEBHOOK_SECRET"),
  }
}

export function isCalApiConfigured() {
  return Boolean(getCalConfig().apiKey)
}

function calHeaders(apiVersion: string) {
  const { apiKey } = getCalConfig()
  if (!apiKey) throw new Error("CAL_API_KEY no está configurada")
  return {
    Authorization: `Bearer ${apiKey}`,
    "cal-api-version": apiVersion,
    "Content-Type": "application/json",
  }
}

type CalEventType = {
  id: number
  slug: string
  title: string
  bookingUrl: string
  lengthInMinutes: number | null
}

type Cache = {
  eventType: CalEventType
  at: number
}

let cache: Cache | null = null
const CACHE_MS = 5 * 60 * 1000

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function parseEventType(value: unknown): CalEventType | null {
  const row = asRecord(value)
  if (!row) return null
  const id = asNumber(row.id)
  if (id == null) return null
  const slug = asString(row.slug) || String(id)
  const title = asString(row.title) || slug
  const users = Array.isArray(row.users) ? row.users : []
  const owner = asRecord(users[0])
  const username = asString(owner?.username) || asString(row.username)
  const bookingUrl =
    asString(row.bookingUrl) ||
    (username ? `https://cal.com/${username}/${slug}` : `https://cal.com/${slug}`)
  return {
    id,
    slug,
    title,
    bookingUrl,
    lengthInMinutes: asNumber(row.lengthInMinutes) ?? asNumber(row.length),
  }
}

function pickEventType(types: CalEventType[]) {
  if (types.length === 0) return null
  if (types.length === 1) return types[0]
  const scored = [...types].sort((a, b) => {
    const score = (item: CalEventType) => {
      const haystack = `${item.slug} ${item.title}`.toLowerCase()
      if (haystack.includes("diagnost")) return 3
      if ((item.lengthInMinutes ?? 0) >= 45) return 2
      return 1
    }
    const delta = score(b) - score(a)
    if (delta !== 0) return delta
    return (b.lengthInMinutes ?? 0) - (a.lengthInMinutes ?? 0)
  })
  return scored[0] ?? types[0]
}

async function calJson(url: string, apiVersion: string) {
  const response = await fetch(url, { headers: calHeaders(apiVersion) })
  const raw = (await response.json().catch(() => null)) as unknown
  return { ok: response.ok, status: response.status, raw }
}

async function fetchMeUsername() {
  const { ok, raw } = await calJson(`${CAL_API_BASE}/me`, CAL_EVENT_TYPES_VERSION)
  if (!ok) return null
  const root = asRecord(raw)
  const data = asRecord(root?.data) ?? root
  return asString(data?.username)
}

function eventTypesFromPayload(raw: unknown): CalEventType[] {
  const root = asRecord(raw)
  const data = root?.data
  const rows = Array.isArray(data) ? data : data ? [data] : Array.isArray(raw) ? raw : []
  return rows.map(parseEventType).filter((item): item is CalEventType => Boolean(item))
}

async function fetchEventTypes(username?: string | null) {
  const url = new URL(`${CAL_API_BASE}/event-types`)
  if (username) url.searchParams.set("username", username)
  const { ok, status, raw } = await calJson(url.toString(), CAL_EVENT_TYPES_VERSION)
  if (!ok) {
    throw new Error(`Cal.com event types ${status}: ${JSON.stringify(raw)}`)
  }
  return eventTypesFromPayload(raw)
}

export async function resolveCalEventType(): Promise<CalEventType> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.eventType
  if (!isCalApiConfigured()) {
    throw new Error("CAL_API_KEY no está configurada")
  }

  let types = await fetchEventTypes()
  if (types.length === 0) {
    const username = await fetchMeUsername()
    if (username) types = await fetchEventTypes(username)
  }
  const eventType = pickEventType(types)
  if (!eventType) {
    throw new Error("La API key de Cal.com no devolvió ningún event type.")
  }

  cache = { eventType, at: Date.now() }
  console.info("[cal] event type resuelto", {
    id: eventType.id,
    slug: eventType.slug,
    bookingUrl: eventType.bookingUrl,
  })
  return eventType
}

export async function publicCalBookingUrl() {
  const eventType = await resolveCalEventType()
  return eventType.bookingUrl
}

export type CalPrivateLink = {
  linkId: string
  bookingUrl: string
}

export async function createCalPrivateLink(): Promise<CalPrivateLink | null> {
  if (!isCalApiConfigured()) return null
  const eventType = await resolveCalEventType()

  const response = await fetch(`${CAL_API_BASE}/event-types/${eventType.id}/private-links`, {
    method: "POST",
    headers: calHeaders(CAL_PRIVATE_LINKS_VERSION),
    body: JSON.stringify({ maxUsageCount: 1 }),
  })
  const raw = (await response.json().catch(() => null)) as {
    status?: string
    data?: { linkId?: string; bookingUrl?: string }
    error?: { message?: string }
    message?: string
  } | null

  if (!response.ok || !raw?.data?.bookingUrl) {
    const details = raw?.error?.message || raw?.message || JSON.stringify(raw)
    throw new Error(`Cal.com private link ${response.status}: ${details}`)
  }

  return {
    linkId: raw.data.linkId || "",
    bookingUrl: raw.data.bookingUrl,
  }
}

export function buildPersonalizedCalUrl(input: {
  bookingUrl: string
  name: string
  email?: string | null
  campaignSendId: string
  contactId: string
  leadId: string
}) {
  const url = new URL(input.bookingUrl)
  if (input.name.trim()) url.searchParams.set("name", input.name.trim())
  if (input.email?.trim()) url.searchParams.set("email", input.email.trim())
  url.searchParams.set("metadata[campaignSendId]", input.campaignSendId)
  url.searchParams.set("metadata[contactId]", input.contactId)
  url.searchParams.set("metadata[leadId]", input.leadId)
  url.searchParams.set("metadata[source]", VIDEO_OUTREACH_CAMPAIGN_KEY)
  return url.toString()
}

export type CalWebhookCreateResult = {
  id: number | string
  subscriberUrl: string
}

export async function createCalEventTypeWebhook(input: {
  subscriberUrl: string
  secret: string
  triggers?: string[]
}) {
  const eventType = await resolveCalEventType()

  const response = await fetch(`${CAL_API_BASE}/event-types/${eventType.id}/webhooks`, {
    method: "POST",
    headers: calHeaders(CAL_PRIVATE_LINKS_VERSION),
    body: JSON.stringify({
      active: true,
      subscriberUrl: input.subscriberUrl,
      secret: input.secret,
      triggers: input.triggers ?? ["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"],
    }),
  })
  const raw = (await response.json().catch(() => null)) as {
    status?: string
    data?: { id?: number | string; subscriberUrl?: string }
    error?: { message?: string }
    message?: string
  } | null

  if (!response.ok || !raw?.data) {
    const details = raw?.error?.message || raw?.message || JSON.stringify(raw)
    throw new Error(`Cal.com webhook ${response.status}: ${details}`)
  }

  return {
    id: raw.data.id ?? "",
    subscriberUrl: raw.data.subscriberUrl ?? input.subscriberUrl,
  } satisfies CalWebhookCreateResult
}

export async function listCalEventTypeWebhooks() {
  if (!isCalApiConfigured()) return []
  const eventType = await resolveCalEventType()

  const response = await fetch(`${CAL_API_BASE}/event-types/${eventType.id}/webhooks`, {
    headers: calHeaders(CAL_PRIVATE_LINKS_VERSION),
  })
  const raw = (await response.json().catch(() => null)) as {
    data?: Array<{ id?: number | string; subscriberUrl?: string }>
  } | null
  if (!response.ok) return []
  return raw?.data ?? []
}
