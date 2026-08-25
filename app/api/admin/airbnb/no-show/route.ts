import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { setAirbnbCommercialStage } from "@/lib/admin/airbnb-commercial"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = (await request.json()) as { airbnbLeadId?: unknown }
  const airbnbLeadId = typeof body.airbnbLeadId === "string" ? body.airbnbLeadId : ""
  if (!airbnbLeadId) {
    return NextResponse.json({ error: "airbnbLeadId requerido" }, { status: 400 })
  }

  try {
    const lead = await setAirbnbCommercialStage({ airbnbLeadId, stage: "NO_SHOW" })
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo marcar no-show" },
      { status: 400 },
    )
  }
}
