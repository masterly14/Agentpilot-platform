import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { setAirbnbCommercialStage } from "@/lib/admin/airbnb-commercial"
import { isContractPlan } from "@/lib/marketing/types"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = (await request.json()) as {
    airbnbLeadId?: unknown
    contractValueUsd?: unknown
    contractPlan?: unknown
  }
  const airbnbLeadId = typeof body.airbnbLeadId === "string" ? body.airbnbLeadId : ""
  const contractValueUsd =
    body.contractValueUsd != null ? Number(body.contractValueUsd) : undefined
  const contractPlan = isContractPlan(body.contractPlan) ? body.contractPlan : undefined

  if (!airbnbLeadId) {
    return NextResponse.json({ error: "airbnbLeadId requerido" }, { status: 400 })
  }
  if (!Number.isFinite(contractValueUsd) || (contractValueUsd ?? 0) <= 0) {
    return NextResponse.json({ error: "Monto del contrato en USD requerido" }, { status: 400 })
  }

  try {
    const lead = await setAirbnbCommercialStage({
      airbnbLeadId,
      stage: "PURCHASED",
      contractValueUsd,
      contractPlan,
    })
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo cerrar el trato" },
      { status: 400 },
    )
  }
}
