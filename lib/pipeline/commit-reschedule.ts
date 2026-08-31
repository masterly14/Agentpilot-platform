import {
  assertSlotIsAvailable,
  buildCalendarEventCopy,
  updateCalendarEventTime,
} from "@/lib/booking/composio-calendar"
import { meetingDurationMinutes, meetingKindForPipeline } from "@/lib/booking/duration"
import { getBookingDateTimeParts } from "@/lib/booking/rules"
import { prisma } from "@/lib/prisma"
import { rescheduleMeeting } from "@/lib/pipeline/engine"

export async function commitMeetingReschedule(input: {
  contactId: string
  meetingTime: Date
  visitorTimezone?: string | null
}) {
  const current = await prisma.leadPipeline.findUniqueOrThrow({
    where: { contactId: input.contactId },
    include: {
      contact: {
        include: {
          submissions: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { qualification: true },
          },
        },
      },
    },
  })
  const isDemo = current.currentStage === "PRE_DEMO"
  const durationMinutes = meetingDurationMinutes(
    meetingKindForPipeline({
      currentStage: current.currentStage,
      funnelOrigin: current.funnelOrigin,
      qualification: current.contact.submissions[0]?.qualification,
    })
  )
  const copy = buildCalendarEventCopy({
    fullName: current.contact.fullName,
    kind: isDemo ? "demo" : "meeting",
    meetingTime: input.meetingTime,
    visitorTimezone: input.visitorTimezone ?? current.visitorTimezone,
    descriptionBody: isDemo ? current.painPoint ?? undefined : undefined,
  })

  if (current.meetingId) {
    const { date, time } = getBookingDateTimeParts(input.meetingTime)
    await assertSlotIsAvailable(date, `${date}T${time}`, durationMinutes)
    const calendar = await updateCalendarEventTime({
      eventId: current.meetingId,
      meetingTime: input.meetingTime,
      durationMinutes,
      summary: copy.summary,
      description: copy.description,
      attendeeEmail: current.contact.email,
    })
    if (!calendar.success && calendar.reason !== "not_configured") {
      throw new Error("No se pudo actualizar el evento de Google Calendar")
    }
  }

  return rescheduleMeeting({
    contactId: input.contactId,
    meetingTime: input.meetingTime,
    visitorTimezone: input.visitorTimezone ?? current.visitorTimezone,
  })
}
