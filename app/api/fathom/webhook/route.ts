import { NextResponse } from "next/server"
import { isConfluenceConfigured } from "@/lib/confluence/config"
import { publishMeetingToConfluence } from "@/lib/confluence/client"
import { enqueueCallAnalysis } from "@/lib/fathom/enqueue"
import { parseFathomMeeting } from "@/lib/fathom/payload"
import { verifyFathomWebhook } from "@/lib/fathom/verify"

export const runtime = "nodejs"
export const maxDuration = 120

export async function POST(request: Request) {
  const rawBody = await request.text()
  const secret = process.env.FATHOM_WEBHOOK_SECRET?.trim()

  if (secret && !verifyFathomWebhook(secret, request.headers, rawBody)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const meeting = parseFathomMeeting(payload)
  if (!meeting) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 })
  }

  if (!isConfluenceConfigured()) {
    return NextResponse.json({ error: "Confluence no configurado" }, { status: 503 })
  }

  try {
    const notes = await publishMeetingToConfluence(meeting)
    let analysis: Awaited<ReturnType<typeof enqueueCallAnalysis>> | { skipped: "analysis_error"; error: string }
    try {
      analysis = await enqueueCallAnalysis({ meeting, meetingPageUrl: notes.url })
    } catch (error) {
      console.error("[fathom/webhook] análisis", error)
      analysis = {
        skipped: "analysis_error",
        error: error instanceof Error ? error.message : "Error de análisis",
      }
    }
    return NextResponse.json({ success: true, notes, analysis })
  } catch (error) {
    console.error("[fathom/webhook]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error de Confluence" },
      { status: 502 },
    )
  }
}
