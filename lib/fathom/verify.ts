import { createHmac, timingSafeEqual } from "node:crypto"

const MAX_SKEW_SECONDS = 300

function header(headers: Headers, name: string) {
  return headers.get(name)?.trim() || ""
}

function signaturesFromHeader(value: string) {
  return value.split(/\s+/).map((part) => {
    const comma = part.indexOf(",")
    return comma >= 0 ? part.slice(comma + 1) : part
  })
}

function secretBytes(secret: string) {
  const encoded = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret
  return Buffer.from(encoded, "base64")
}

export function signFathomWebhook(secret: string, webhookId: string, timestamp: number, rawBody: string) {
  const signedContent = `${webhookId}.${timestamp}.${rawBody}`
  const signature = createHmac("sha256", secretBytes(secret)).update(signedContent).digest("base64")
  return `v1,${signature}`
}

export function verifyFathomWebhook(secret: string, headers: Headers, rawBody: string) {
  const webhookId = header(headers, "webhook-id")
  const webhookTimestamp = header(headers, "webhook-timestamp")
  const webhookSignature = header(headers, "webhook-signature")
  if (!webhookId || !webhookTimestamp || !webhookSignature) return false

  const timestamp = Number(webhookTimestamp)
  if (!Number.isFinite(timestamp)) return false
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - timestamp) > MAX_SKEW_SECONDS) return false

  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`
  const expected = createHmac("sha256", secretBytes(secret)).update(signedContent).digest("base64")
  const expectedBuf = Buffer.from(expected)

  return signaturesFromHeader(webhookSignature).some((signature) => {
    const actual = Buffer.from(signature)
    if (actual.length !== expectedBuf.length) return false
    return timingSafeEqual(expectedBuf, actual)
  })
}
