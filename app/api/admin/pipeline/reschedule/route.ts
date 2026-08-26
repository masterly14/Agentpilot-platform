import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { rescheduleMeeting } from "@/lib/pipeline/engine"
import { getLeadRecord } from "@/lib/admin/lead-record"
import { updateCalendarEventTime } from "@/lib/booking/composio-calendar"
import { sanitizeVisitorTimezone } from "@/lib/booking/timezone"
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
    meetLink?: unknown
    visitorTimezone?: unknown
  }

  let contactId = typeof body.contactId === "string" ? body.contactId : ""
  let submissionId = typeof body.submissionId === "string" ? body.submissionId : ""
  const meetingTime =
    typeof body.meetingTime === "string" ? new Date(body.meetingTime) : null
  const meetLink = typeof body.meetLink === "string" ? body.meetLink.trim() : undefined

  if (!meetingTime || Number.isNaN(meetingTime.getTime())) {
    return NextResponse.json({ error: "meetingTime requerido" }, { status: 400 })
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

  const pipeline = await rescheduleMeeting({
    contactId,
    meetingTime,
    meetLink: meetLink || undefined,
    visitorTimezone: sanitizeVisitorTimezone(body.visitorTimezone) ?? null,
  })

  if (pipeline.meetingId) {
    await updateCalendarEventTime({
      eventId: pipeline.meetingId,
      meetingTime,
      durationMinutes: pipeline.currentStage === "PRE_DEMO" ? 60 : undefined,
    })
  }

  const currentLead = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    select: { marketingFunnelStage: true },
  })
  if (currentLead?.marketingFunnelStage !== "DEMO_SCHEDULED") {
    await recordMarketingStage({
      submissionId,
      to: "SCHEDULED",
      triggeredBy: MARKETING_TRIGGERED_BY.admin,
    })
  }

  const submission = await getLeadRecord(submissionId)
  return NextResponse.json({ success: true, submission })
}
