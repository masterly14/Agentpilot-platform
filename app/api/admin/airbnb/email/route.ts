import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { setAirbnbHostEmail } from "@/lib/admin/airbnb-commercial"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = (await request.json()) as { airbnbLeadId?: unknown; hostEmail?: unknown }
  const airbnbLeadId = typeof body.airbnbLeadId === "string" ? body.airbnbLeadId : ""
  const hostEmail = typeof body.hostEmail === "string" ? body.hostEmail : ""

  if (!airbnbLeadId || !hostEmail) {
    return NextResponse.json({ error: "airbnbLeadId y hostEmail son requeridos" }, { status: 400 })
  }

  try {
    const lead = await setAirbnbHostEmail(airbnbLeadId, hostEmail)
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo guardar el correo" },
      { status: 400 },
    )
  }
}
