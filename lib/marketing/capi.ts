import { createHash } from "node:crypto"
import { prisma } from "@/lib/prisma"
import { toPhoneE164 } from "@/lib/whatsapp/phone"
import { META_EVENT_NAME } from "@/lib/marketing/types"

const DEFAULT_GRAPH_VERSION = "v23.0"

type CapiUserData = {
  em?: string[]
  ph?: string[]
  fn?: string[]
  ln?: string[]
  external_id?: string[]
  fbp?: string
  fbc?: string
  client_ip_address?: string
  client_user_agent?: string
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

function hashNormalized(value: string) {
  return sha256(value.trim().toLowerCase())
}

function splitName(fullName: string | null | undefined) {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? []
  const first = parts[0]
  const last = parts.length > 1 ? parts.slice(1).join(" ") : undefined
  return { first, last }
}

export function isCapiConfigured() {
  return Boolean(getCapiPixelId() && process.env.META_CAPI_ACCESS_TOKEN?.trim())
}

function getCapiPixelId() {
  return (
    process.env.META_PIXEL_ID?.trim() ||
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID?.trim() ||
    ""
  )
}

function getGraphVersion() {
  return (
    process.env.META_GRAPH_API_VERSION?.trim() ||
    process.env.WHATSAPP_GRAPH_API_VERSION?.trim() ||
    DEFAULT_GRAPH_VERSION
  )
}

export async function sendLeadEventToMeta(eventId: string) {
  const event = await prisma.leadEvent.findUnique({
    where: { id: eventId },
    include: { submission: true },
  })

  if (!event) {
    console.error("[marketing] CAPI: evento no encontrado", eventId)
    return { status: "missing" as const }
  }

  if (event.sentToMeta) {
    return { status: "already_sent" as const }
  }

  await prisma.leadEvent.update({
    where: { id: eventId },
    data: {
      attemptCount: { increment: 1 },
      lastAttemptAt: new Date(),
    },
  })

  if (!isCapiConfigured()) {
    console.warn("[marketing] CAPI no configurada: se omite envío de", eventId)
    return { status: "skipped" as const }
  }

  const { submission } = event
  const { first, last } = splitName(submission.fullName)
  const userData: CapiUserData = {
    external_id: [submission.id],
  }

  if (submission.email) userData.em = [hashNormalized(submission.email)]
  if (first) userData.fn = [hashNormalized(first)]
  if (last) userData.ln = [hashNormalized(last)]
  if (submission.fbp) userData.fbp = submission.fbp
  if (submission.fbc) userData.fbc = submission.fbc
  if (event.clientIp) userData.client_ip_address = event.clientIp
  if (event.clientUserAgent) userData.client_user_agent = event.clientUserAgent

  if (submission.phoneCountryCode && submission.phoneNumber) {
    try {
      userData.ph = [hashNormalized(toPhoneE164(submission.phoneCountryCode, submission.phoneNumber))]
    } catch {
      // Teléfono incompleto: se envía el resto de user_data.
    }
  }

  const actionSource =
    event.eventName === "SHOW_UP" || event.eventName === "PURCHASE"
      ? "system_generated"
      : "website"

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: META_EVENT_NAME[event.eventName],
        event_time: Math.floor(event.eventTime.getTime() / 1000),
        event_id: event.id,
        action_source: actionSource,
        ...(event.eventSourceUrl ? { event_source_url: event.eventSourceUrl } : {}),
        user_data: userData,
        custom_data: {
          value: Number(event.value),
          currency: event.currency,
        },
      },
    ],
  }

  const testCode = process.env.META_TEST_EVENT_CODE?.trim()
  if (testCode) payload.test_event_code = testCode

  const pixelId = getCapiPixelId()
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN!.trim()
  const response = await fetch(
    `https://graph.facebook.com/${getGraphVersion()}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  )

  const raw = await response.json().catch(() => null)
  const graphError =
    raw && typeof raw === "object" && "error" in raw ? (raw as { error: unknown }).error : null

  await prisma.leadEvent.update({
    where: { id: eventId },
    data: {
      metaResponse: raw ?? { status: response.status, ok: response.ok },
      sentToMeta: response.ok && !graphError,
    },
  })

  if (!response.ok || graphError) {
    const details = raw && typeof raw === "object" ? JSON.stringify(raw) : String(raw)
    throw new Error(`Meta CAPI ${response.status}: ${details}`)
  }

  return { status: "sent" as const, raw }
}

export async function sendUnsentLeadEvents(limit = 25) {
  const pending = await prisma.leadEvent.findMany({
    where: { sentToMeta: false },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: { id: true },
  })

  const results = []
  for (const row of pending) {
    try {
      results.push({ eventId: row.id, ...(await sendLeadEventToMeta(row.id)) })
    } catch (error) {
      results.push({
        eventId: row.id,
        status: "failed" as const,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
  return results
}
