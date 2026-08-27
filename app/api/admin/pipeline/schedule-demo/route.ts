import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { createDemoEvent } from "@/lib/booking/composio-calendar"
import { prisma } from "@/lib/prisma"
import { enterPreDemo } from "@/lib/pipeline/engine"
import { getLeadRecord } from "@/lib/admin/lead-record"
import { getSubmissionTitle } from "@/lib/submission-display"
import {
  findLatestSubmissionIdByContact,
  MARKETING_TRIGGERED_BY,
  recordMarketingStage,
} from "@/lib/marketing/events"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const body = (await request.json()) as {
    contactId?: unknown
    submissionId?: unknown
    meetingTime?: unknown
    painPoint?: unknown
  }

  let contactId = typeof body.contactId === "string" ? body.contactId : ""
  let submissionId = typeof body.submissionId === "string" ? body.submissionId : ""
  const meetingTime =
    typeof body.meetingTime === "string" ? new Date(body.meetingTime) : null
  const painPoint = typeof body.painPoint === "string" ? body.painPoint.trim() : ""

  if (!meetingTime || Number.isNaN(meetingTime.getTime())) {
    return NextResponse.json({ error: "meetingTime requerido" }, { status: 400 })
  }
  if (meetingTime.getTime() <= Date.now()) {
    return NextResponse.json({ error: "La demo tiene que ser en el futuro" }, { status: 400 })
  }
  if (!painPoint) {
    return NextResponse.json({ error: "dolor principal requerido" }, { status: 400 })
  }

  if (!contactId && submissionId) {
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
      select: { contactId: true },
    })
    contactId = submission?.contactId ?? ""
  }

  if (!submissionId && contactId) {
    submissionId = (await findLatestSubmissionIdByContact(contactId)) ?? ""
  }

  if (!contactId) {
    return NextResponse.json({ error: "contactId requerido" }, { status: 400 })
  }
  if (!submissionId) {
    return NextResponse.json({ error: "submissionId requerido" }, { status: 400 })
  }

  const lead = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    select: { fullName: true, email: true, contact: { select: { fullName: true, email: true } } },
  })
  const fullName =
    lead?.contact?.fullName?.trim() ||
    lead?.fullName?.trim() ||
    getSubmissionTitle({
      companyName: null,
      fullName: lead?.fullName ?? null,
      email: lead?.email ?? null,
    })
  const email = lead?.contact?.email?.trim() || lead?.email?.trim() || null

  let calendarWarning: string | null = null
  let meetingId: string | null = null
  let meetLink: string | null = null

  try {
    const created = await createDemoEvent({
      fullName,
      email,
      start: meetingTime,
      painPoint,
    })
    meetingId = created.eventId ?? null
    meetLink = created.meetLink ?? null
    if (created.source === "mock") {
      calendarWarning = "Calendario no configurado: la demo se guardó sin evento de Google."
    } else if (!meetingId) {
      calendarWarning =
        "La demo se guardó en el pipeline, pero Calendar no devolvió el evento. Revisa Google Calendar."
    }
  } catch (error) {
    calendarWarning = error instanceof Error ? error.message : "No se pudo crear el evento en Calendar"
    console.error("[pipeline] calendar demo", error)
  }

  try {
    await enterPreDemo({
      contactId,
      meetingTime,
      painPoint,
      meetingId,
      meetLink,
    })
  } catch (error) {
    console.error("[pipeline] enterPreDemo", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo programar la demo" },
      { status: 500 },
    )
  }

  await recordMarketingStage({
    submissionId,
    to: "DEMO_SCHEDULED",
    triggeredBy: MARKETING_TRIGGERED_BY.admin,
  })

  const submission = await getLeadRecord(submissionId)
  return NextResponse.json({
    success: true,
    submission,
    calendarWarning,
  })
}
