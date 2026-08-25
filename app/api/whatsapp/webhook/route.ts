import { NextResponse } from "next/server"
import { parseWhatsAppWebhook, verifyWhatsAppSignature } from "@/lib/whatsapp/webhook"
import { handleInboundWhatsApp, handleWhatsAppStatus } from "@/lib/pipeline/inbound"

export const runtime = "nodejs"
export const maxDuration = 30

export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get("hub.mode")
  const token = url.searchParams.get("hub.verify_token")
  const challenge = url.searchParams.get("hub.challenge")
  const expected = process.env.WHATSAPP_VERIFY_TOKEN

  if (mode === "subscribe" && expected && token === expected && challenge) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: "Verificación fallida" }, { status: 403 })
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get("x-hub-signature-256")

  if (process.env.WHATSAPP_APP_SECRET && !verifyWhatsAppSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const parsed = parseWhatsAppWebhook(payload)

  try {
    for (const message of parsed.messages) {
      await handleInboundWhatsApp({
        ...message,
        raw: message.raw as never,
      })
    }
    for (const status of parsed.statuses) {
      await handleWhatsAppStatus(status.waMessageId, status.status, status.errors)
    }
  } catch (error) {
    console.error("[whatsapp/webhook]", error)
  }

  return NextResponse.json({ success: true })
}
