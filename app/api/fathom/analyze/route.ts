import { NextResponse } from "next/server"
import { verifyQstashSignature } from "@/lib/qstash/client"
import { parseAnalysisJob, processCallAnalysis } from "@/lib/fathom/pipeline"

export const runtime = "nodejs"
export const maxDuration = 120

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get("upstash-signature")
  const fromQstash = Boolean(signature)

  if (fromQstash) {
    const valid = await verifyQstashSignature(signature, rawBody)
    if (!valid) {
      return NextResponse.json({ error: "Firma QStash inválida" }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  const job = parseAnalysisJob(payload)
  if (!job) {
    return NextResponse.json({ error: "Payload de análisis inválido" }, { status: 400 })
  }

  try {
    const result = await processCallAnalysis(job)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("[fathom/analyze]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error analizando la llamada" },
      { status: 502 },
    )
  }
}
