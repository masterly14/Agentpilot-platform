import { NextResponse } from "next/server"
import { processRescheduleTurn } from "@/lib/pipeline/reschedule-agent"
import { verifyQstashSignature } from "@/lib/qstash/client"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: Request) {
  const rawBody = await request.text()
  if (!(await verifyQstashSignature(request.headers.get("upstash-signature"), rawBody))) {
    return NextResponse.json({ error: "Firma QStash inválida" }, { status: 401 })
  }
  try {
    const body = JSON.parse(rawBody) as { contactId?: unknown; body?: unknown; buttonId?: unknown }
    if (typeof body.contactId !== "string") {
      return NextResponse.json({ error: "contactId requerido" }, { status: 400 })
    }
    return NextResponse.json(await processRescheduleTurn({
      contactId: body.contactId,
      body: typeof body.body === "string" ? body.body : undefined,
      buttonId: typeof body.buttonId === "string" ? body.buttonId : undefined,
    }))
  } catch (error) {
    console.error("[pipeline/reschedule-agent]", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error interno" }, { status: 500 })
  }
}
