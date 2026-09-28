import { NextResponse } from "next/server"
import { verifyQstashSignature } from "@/lib/qstash/client"
import { deliverVideoOutreachEmail } from "@/lib/campaigns/video-outreach"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get("upstash-signature")
  const valid = await verifyQstashSignature(signature, rawBody)
  if (!valid) {
    return NextResponse.json({ error: "Firma QStash inválida" }, { status: 401 })
  }

  let body: { outreachSendId?: unknown }
  try {
    body = JSON.parse(rawBody) as { outreachSendId?: unknown }
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  if (typeof body.outreachSendId !== "string" || !body.outreachSendId.trim()) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 })
  }

  try {
    const result = await deliverVideoOutreachEmail(body.outreachSendId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[campaigns/video/email]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 },
    )
  }
}
