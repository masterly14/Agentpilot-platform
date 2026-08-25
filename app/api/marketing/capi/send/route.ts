import { NextResponse } from "next/server"
import { verifyQstashSignature } from "@/lib/qstash/client"
import { sendLeadEventToMeta, sendUnsentLeadEvents } from "@/lib/marketing/capi"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get("upstash-signature")
  const valid = await verifyQstashSignature(signature, rawBody)
  if (!valid) {
    return NextResponse.json({ error: "Firma QStash inválida" }, { status: 401 })
  }

  let body: { eventId?: unknown; sweep?: unknown }
  try {
    body = JSON.parse(rawBody) as { eventId?: unknown; sweep?: unknown }
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  if (body.sweep === true) {
    const results = await sendUnsentLeadEvents()
    const failed = results.some((result) => result.status === "failed")
    return NextResponse.json({ results }, { status: failed ? 500 : 200 })
  }

  if (typeof body.eventId !== "string" || !body.eventId.trim()) {
    return NextResponse.json({ error: "eventId requerido" }, { status: 400 })
  }

  try {
    const result = await sendLeadEventToMeta(body.eventId.trim())
    return NextResponse.json(result)
  } catch (error) {
    console.error("[marketing/capi/send]", error)
    const message = error instanceof Error ? error.message : "Error enviando a Meta"
    return NextResponse.json({ error: message }, { status: 503 })
  }
}
