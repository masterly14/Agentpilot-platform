import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { rescheduleMeeting } from "@/lib/pipeline/engine"
import { getLeadRecord } from "@/lib/admin/lead-record"
import { getSubmissionTitle } from "@/lib/submission-display"
import {
  buildCalendarEventCopy,
  updateCalendarEventTime,
} from "@/lib/booking/composio-calendar"
import { sanitizeVisitorTimezone } from "@/lib/booking/timezone"
import {
  formatBookingAnswersForDescription,
  INDUSTRY_TIME_FORM,
  PMS_USAGE_FORM,
  PROPERTY_COUNT_FORM,
  REVENUE_RANGE_FORM,
  YES_NO_FORM,
} from "@/lib/booking/form-options"
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

  if (pipeline.meetingId) {
    const isDemo = pipeline.currentStage === "PRE_DEMO"
    const fullName =
      pipeline.contact.fullName.trim() ||
      lead?.contact?.fullName?.trim() ||
      lead?.fullName?.trim() ||
      getSubmissionTitle({
        companyName: lead?.companyName ?? null,
        fullName: lead?.fullName ?? null,
        email: lead?.email ?? null,
      })
    const attendeeEmail =
      pipeline.contact.email?.trim() ||
      lead?.contact?.email?.trim() ||
      lead?.email?.trim() ||
      null
    const descriptionBody = isDemo
      ? pipeline.painPoint
        ? `Dolor principal: ${pipeline.painPoint}`
        : undefined
      : formatBookingAnswersForDescription({
          usesPms: (lead?.usesPms && PMS_USAGE_FORM[lead.usesPms]) || "",
          propertyCount: (lead?.propertyCount && PROPERTY_COUNT_FORM[lead.propertyCount]) || "",
          revenueRange: (lead?.revenueRange && REVENUE_RANGE_FORM[lead.revenueRange]) || "",
          isTodero: (lead?.isTodero && YES_NO_FORM[lead.isTodero]) || "",
          usesAi: (lead?.usesAi && YES_NO_FORM[lead.usesAi]) || "",
          wantsToScale: (lead?.wantsToScale && YES_NO_FORM[lead.wantsToScale]) || "",
          industryTime: (lead?.industryTime && INDUSTRY_TIME_FORM[lead.industryTime]) || "",
          phoneCountryCode: lead?.phoneCountryCode ?? pipeline.contact.phoneCountryCode,
          phoneNumber: lead?.phoneNumber ?? pipeline.contact.phoneNumber,
          companyName: lead?.companyName ?? pipeline.contact.companyName ?? undefined,
          websiteUrl: lead?.websiteUrl ?? pipeline.contact.websiteUrl ?? undefined,
          instagramUrl: lead?.instagramUrl ?? pipeline.contact.instagramUrl ?? undefined,
        })
    const copy = buildCalendarEventCopy({
      fullName,
      kind: isDemo ? "demo" : "meeting",
      meetingTime,
      visitorTimezone: pipeline.visitorTimezone,
      descriptionBody,
    })

    await updateCalendarEventTime({
      eventId: pipeline.meetingId,
      meetingTime,
      durationMinutes: isDemo ? 60 : undefined,
      summary: copy.summary,
      description: copy.description,
      attendeeEmail,
    })
  }

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
