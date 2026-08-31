import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { commitMeetingReschedule } from "@/lib/pipeline/commit-reschedule"
import { getLeadRecord } from "@/lib/admin/lead-record"
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

  const pipeline = await commitMeetingReschedule({
    contactId,
    meetingTime,
    visitorTimezone: sanitizeVisitorTimezone(body.visitorTimezone) ?? null,
  })
  await prisma.leadPipeline.update({
    where: { id: pipeline.id },
    data: { rescheduleContext: { status: "paused", pausedReason: "admin_reschedule" } },
  })

  const lead = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    select: {
      marketingFunnelStage: true,
      fullName: true,
      email: true,
      companyName: true,
      usesPms: true,
      propertyCount: true,
      revenueRange: true,
      isTodero: true,
      usesAi: true,
      wantsToScale: true,
      industryTime: true,
      phoneCountryCode: true,
      phoneNumber: true,
      websiteUrl: true,
      instagramUrl: true,
      contact: { select: { fullName: true, email: true } },
    },
  })

  if (lead?.marketingFunnelStage !== "DEMO_SCHEDULED") {
    await recordMarketingStage({
      submissionId,
      to: "SCHEDULED",
      triggeredBy: MARKETING_TRIGGERED_BY.admin,
    })
  }

  const submission = await getLeadRecord(submissionId)
  return NextResponse.json({ success: true, submission })
}
