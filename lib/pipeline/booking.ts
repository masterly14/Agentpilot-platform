import type { BookingFlow, FunnelOrigin } from "@/prisma/generated/client"
import { upsertContactFromLead } from "@/lib/pipeline/contact"
import { enterPreMeeting } from "@/lib/pipeline/engine"
import { prisma } from "@/lib/prisma"

export async function attachBookingToPipeline(input: {
  submissionId: string
  fullName: string
  email: string
  phoneCountryCode: string
  phoneNumber: string
  companyName?: string | null
  websiteUrl?: string | null
  instagramUrl?: string | null
  bookingFlow: BookingFlow
  qualification?: "SQL" | "MQL" | "DISQUALIFIED" | null
  meetingTime: Date
  meetingId?: string | null
  meetLink?: string | null
  visitorTimezone?: string | null
}) {
  const contact = await upsertContactFromLead({
    fullName: input.fullName,
    email: input.email,
    phoneCountryCode: input.phoneCountryCode,
    phoneNumber: input.phoneNumber,
    companyName: input.companyName,
    websiteUrl: input.websiteUrl,
    instagramUrl: input.instagramUrl,
  })

  await prisma.formSubmission.update({
    where: { id: input.submissionId },
    data: { contactId: contact.id },
  })

  const funnelOrigin: FunnelOrigin =
    input.bookingFlow === "DIAGNOSIS_PUBLIC" || input.bookingFlow === "DIRECT_BOOKING"
      ? "DIRECT_BOOKING"
      : input.qualification === "MQL"
        ? "MQL"
        : input.qualification === "SQL"
          ? "SQL"
          : "DIRECT_BOOKING"

  await enterPreMeeting({
    contactId: contact.id,
    funnelOrigin,
    meetingId: input.meetingId,
    meetingTime: input.meetingTime,
    meetLink: input.meetLink,
    visitorTimezone: input.visitorTimezone,
  })

  return contact
}
