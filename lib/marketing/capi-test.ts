import { createHash } from "node:crypto"
import { getAppUrl } from "../ebook/app-url.ts"

const DEFAULT_GRAPH_VERSION = "v23.0"

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

function hashNormalized(value: string) {
  return sha256(value.trim().toLowerCase())
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return { first: parts[0], last: parts.length > 1 ? parts.slice(1).join(" ") : undefined }
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

/** Evento Lead de prueba para Events Manager. Exige META_TEST_EVENT_CODE. No escribe en DB. */
export async function sendTestLeadEventToMeta() {
  const testEventCode = process.env.META_TEST_EVENT_CODE?.trim() || ""
  const pixelId = getCapiPixelId()
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim() || ""

  if (!testEventCode) {
    throw new Error("META_TEST_EVENT_CODE es requerido para mandar el evento de prueba")
  }
  if (!pixelId || !accessToken) {
    throw new Error("CAPI no configurada: faltan META_CAPI_ACCESS_TOKEN y PIXEL ID")
  }

  const leadId = `capi-test-${Date.now()}`
  const eventId = `${leadId}-Lead`
  const eventSourceUrl = `${getAppUrl()}/ebook`
  const { first, last } = splitName("Test Capi Lead")

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: {
          em: [hashNormalized("test.capi@example.com")],
          ...(first ? { fn: [hashNormalized(first)] } : {}),
          ...(last ? { ln: [hashNormalized(last)] } : {}),
          external_id: [leadId],
        },
        custom_data: {
          value: 0,
          currency: "USD",
          content_name: "Guía gratuita",
          content_category: "ebook",
        },
      },
    ],
    test_event_code: testEventCode,
  }

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

  if (!response.ok || graphError) {
    const details = raw && typeof raw === "object" ? JSON.stringify(raw) : String(raw)
    throw new Error(`Meta CAPI ${response.status}: ${details}`)
  }

  return {
    eventId,
    leadId,
    pixelId,
    testEventCode,
    eventSourceUrl,
    raw,
  }
}
