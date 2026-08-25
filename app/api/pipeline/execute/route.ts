import { NextResponse } from "next/server"
import { verifyQstashSignature } from "@/lib/qstash/client"
import { executeScheduledStep } from "@/lib/pipeline/engine"
import type { PipelineState } from "@/prisma/generated/client"

export const runtime = "nodejs"
export const maxDuration = 60

function isPipelineState(value: unknown): value is PipelineState {
  return typeof value === "string" && value.length > 0
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get("upstash-signature")
  const valid = await verifyQstashSignature(signature, rawBody)
  if (!valid) {
    return NextResponse.json({ error: "Firma QStash inválida" }, { status: 401 })
  }

  let body: { contactId?: unknown; expectedState?: unknown; dedupKey?: unknown }
  try {
    body = JSON.parse(rawBody) as { contactId?: unknown; expectedState?: unknown; dedupKey?: unknown }
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  if (
    typeof body.contactId !== "string" ||
    typeof body.dedupKey !== "string" ||
    !isPipelineState(body.expectedState)
  ) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 })
  }

  try {
    const result = await executeScheduledStep({
      contactId: body.contactId,
      expectedState: body.expectedState,
      dedupKey: body.dedupKey,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("[pipeline/execute]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 },
    )
  }
}
