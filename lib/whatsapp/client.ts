const DEFAULT_GRAPH_VERSION = "v23.0"

export type WhatsAppGraphSendResult = {
  messageId: string
  raw: unknown
}

function getWhatsAppConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const apiVersion = process.env.WHATSAPP_GRAPH_API_VERSION || DEFAULT_GRAPH_VERSION
  return { accessToken, phoneNumberId, apiVersion }
}

export function isWhatsAppSendConfigured() {
  const { accessToken, phoneNumberId } = getWhatsAppConfig()
  return Boolean(accessToken && phoneNumberId)
}

export type WhatsAppMediaDownload = {
  buffer: ArrayBuffer
  mimeType: string
}

export async function getWhatsAppMediaBuffer(mediaId: string): Promise<WhatsAppMediaDownload | null> {
  const { accessToken, apiVersion } = getWhatsAppConfig()
  if (!accessToken) return null

  const metaResponse = await fetch(`https://graph.facebook.com/${apiVersion}/${mediaId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "AgentPilotAdmin/1.0",
    },
  })
  if (!metaResponse.ok) return null

  const meta = (await metaResponse.json().catch(() => null)) as
    | { url?: string; mime_type?: string }
    | null
  if (!meta?.url) return null

  const fileResponse = await fetch(meta.url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "AgentPilotAdmin/1.0",
    },
  })
  if (!fileResponse.ok) return null

  return {
    buffer: await fileResponse.arrayBuffer(),
    mimeType:
      meta.mime_type ||
      fileResponse.headers.get("content-type") ||
      "application/octet-stream",
  }
}

export async function uploadWhatsAppMedia(input: {
  bytes: Uint8Array
  filename: string
  mimeType: string
}) {
  const { accessToken, phoneNumberId, apiVersion } = getWhatsAppConfig()
  if (!accessToken || !phoneNumberId) {
    throw new Error("WhatsApp Cloud API no está configurada (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID)")
  }

  const copy = Uint8Array.from(input.bytes)
  const form = new FormData()
  form.set("messaging_product", "whatsapp")
  form.set("type", input.mimeType)
  form.set("file", new File([copy], input.filename, { type: input.mimeType }))

  const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  })
  const raw = (await response.json().catch(() => null)) as { id?: string } | null
  if (!response.ok || !raw?.id) {
    const details = raw && typeof raw === "object" ? JSON.stringify(raw) : String(raw)
    throw new Error(`WhatsApp media ${response.status}: ${details}`)
  }
  return raw.id
}

export async function sendWhatsAppGraphMessage(payload: unknown): Promise<WhatsAppGraphSendResult> {
  const { accessToken, phoneNumberId, apiVersion } = getWhatsAppConfig()
  if (!accessToken || !phoneNumberId) {
    throw new Error("WhatsApp Cloud API no está configurada (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID)")
  }

  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  )

  const raw = await response.json().catch(() => null)
  if (!response.ok) {
    const details = raw && typeof raw === "object" ? JSON.stringify(raw) : String(raw)
    throw new Error(`WhatsApp Graph ${response.status}: ${details}`)
  }

  const messages = raw && typeof raw === "object" ? (raw as { messages?: Array<{ id?: string }> }).messages : null
  const messageId = messages?.[0]?.id
  if (!messageId) {
    throw new Error("WhatsApp Graph no devolvió message id")
  }

  return { messageId, raw }
}
