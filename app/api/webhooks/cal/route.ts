import { NextResponse } from "next/server"
import { applyCalBookingToOutreach } from "@/lib/campaigns/video-outreach"
import { getCalConfig } from "@/lib/cal/client"
import { parseCalWebhook, verifyCalWebhookSignature } from "@/lib/cal/webhook"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature =
    request.headers.get("x-cal-signature-256") ||
    request.headers.get("cal-signature") ||
    request.headers.get("x-cal-signature")

  const { webhookSecret } = getCalConfig()
  if (webhookSecret && !verifyCalWebhookSignature(signature, rawBody)) {
    return NextResponse.json({ error: "Firma Cal.com inválida" }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const booking = parseCalWebhook(payload)
  if (!booking) {
    return NextResponse.json({ error: "Payload de booking inválido" }, { status: 400 })
  }

  try {
    const result = await applyCalBookingToOutreach(booking)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("[webhooks/cal]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 },
    )
  }
}
