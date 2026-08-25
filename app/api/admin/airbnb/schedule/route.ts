import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { scheduleAirbnbMeeting } from "@/lib/admin/airbnb-commercial"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = (await request.json()) as {
    airbnbLeadId?: unknown
    meetingTime?: unknown
    meetLink?: unknown
    hostEmail?: unknown
  }

  const airbnbLeadId = typeof body.airbnbLeadId === "string" ? body.airbnbLeadId : ""
  const meetLink = typeof body.meetLink === "string" ? body.meetLink : ""
  const meetingTime =
    typeof body.meetingTime === "string" ? new Date(body.meetingTime) : null
  const hostEmail = typeof body.hostEmail === "string" ? body.hostEmail : null

  if (!airbnbLeadId || !meetLink || !meetingTime || Number.isNaN(meetingTime.getTime())) {
    return NextResponse.json({ error: "airbnbLeadId, meetingTime y meetLink son requeridos" }, { status: 400 })
  }

  try {
    const lead = await scheduleAirbnbMeeting({
      airbnbLeadId,
      meetingTime,
      meetLink,
      hostEmail,
    })
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo agendar" },
      { status: 400 },
    )
  }
}
