import { NextResponse } from "next/server"
import { z } from "zod"
import { isAdLandingPath, recordLandingVisit } from "@/lib/ad-landing"
import { parseAttributionInput } from "@/lib/marketing/attribution"
import { readVisitorId } from "@/lib/visitor-id"

export const runtime = "nodejs"

const visitSchema = z.object({
  visitorId: z.string().trim().min(8).max(80),
  landingPath: z.string().trim().min(1).max(64),
  attribution: z.unknown().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const parsed = visitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const visitorId = readVisitorId(parsed.data.visitorId)
    if (!visitorId || !isAdLandingPath(parsed.data.landingPath)) {
      return NextResponse.json({ error: "Landing desconocida" }, { status: 400 })
    }

    const visit = await recordLandingVisit({
      visitorId,
      landingPath: parsed.data.landingPath,
      attribution: parseAttributionInput(parsed.data.attribution),
    })

    return NextResponse.json({ id: visit.id })
  } catch (error) {
    console.error("[landing/visit]", error)
    return NextResponse.json({ error: "No se pudo registrar" }, { status: 500 })
  }
}
