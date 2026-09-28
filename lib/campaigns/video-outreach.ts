import type { Contact, FormSubmission, MarketingFunnelStage, OutreachSend } from "@/prisma/generated/client"
import {
  buildPersonalizedCalUrl,
  createCalPrivateLink,
  isCalApiConfigured,
  publicCalBookingUrl,
} from "@/lib/cal/client"
import type { CalWebhookBooking } from "@/lib/cal/webhook"
import {
  VIDEO_OUTREACH_CAMPAIGN_KEY,
  VIDEO_OUTREACH_EMAIL_DELAY_SECONDS,
  WHATSAPP_VIDEO_MAX_BYTES,
} from "@/lib/campaigns/constants"
import { sendVideoOutreachEmail } from "@/lib/emails/send-video-outreach"
import { FUNNEL_STAGE_LABEL } from "@/lib/marketing/funnel-ui"
import { MARKETING_TRIGGERED_BY, recordMarketingStage } from "@/lib/marketing/events"
import { attachBookingToPipeline } from "@/lib/pipeline/booking"
import { upsertContactFromLead } from "@/lib/pipeline/contact"
import { prisma } from "@/lib/prisma"
import { getPipelineBaseUrl, getQstashClient, isQstashConfigured } from "@/lib/qstash/client"
import { firstNameFromFullName } from "@/lib/whatsapp/phone"
import { sendMarketingVideoTemplate } from "@/lib/whatsapp/send-template"
import { uploadWhatsAppMedia } from "@/lib/whatsapp/client"

const EMAIL_PATH = "/api/campaigns/video/email"

export type VideoOutreachLead = {
  leadId: string
  contactId: string | null
  name: string | null
  email: string | null
  phone: string | null
  companyName: string | null
  qualification: string | null
  funnelStage: string | null
  funnelStageId: MarketingFunnelStage | null
  videoOutreachAt: string | null
  videoOutreachBookedAt: string | null
  createdAt: string
}

function pickText(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const trimmed = value?.trim()
    if (trimmed) return trimmed
  }
  return null
}

function phoneOf(row: {
  phoneCountryCode: string | null
  phoneNumber: string | null
  contact: { phoneE164: string } | null
}) {
  if (row.contact?.phoneE164?.trim()) return row.contact.phoneE164.trim()
  const country = row.phoneCountryCode?.replace(/\D/g, "") ?? ""
  const number = row.phoneNumber?.replace(/\D/g, "") ?? ""
  if (!country || !number) return null
  return `${country}${number}`
}

function hasWhatsAppPhone(row: {
  phoneCountryCode: string | null
  phoneNumber: string | null
  contactId: string | null
  contact: { phoneE164: string } | null
}) {
  return Boolean(phoneOf(row))
}

export async function listVideoOutreachLeads(input: {
  stage?: string
  query?: string
}) {
  const stage = input.stage?.trim() || "all"
  const query = input.query?.trim()
  const stageWhere =
    stage === "all"
      ? undefined
      : stage === "inbox"
        ? { OR: [{ marketingFunnelStage: null }, { status: "PARTIAL" as const }] }
        : { marketingFunnelStage: stage as MarketingFunnelStage }

  const queryWhere = query
    ? {
        OR: [
          { fullName: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
          { companyName: { contains: query, mode: "insensitive" as const } },
          { contact: { is: { fullName: { contains: query, mode: "insensitive" as const } } } },
          { contact: { is: { email: { contains: query, mode: "insensitive" as const } } } },
          { contact: { is: { companyName: { contains: query, mode: "insensitive" as const } } } },
        ],
      }
    : undefined

  const rows = await prisma.formSubmission.findMany({
    where: {
      AND: [
        stageWhere ?? {},
        queryWhere ?? {},
        {
          OR: [
            { contactId: { not: null } },
            {
              AND: [{ phoneCountryCode: { not: null } }, { phoneNumber: { not: null } }],
            },
          ],
        },
      ],
    },
    include: {
      contact: { select: { id: true, fullName: true, email: true, phoneE164: true, companyName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  const leads: VideoOutreachLead[] = rows.filter(hasWhatsAppPhone).map((row) => {
    const name = pickText(row.fullName, row.contact?.fullName)
    return {
      leadId: row.id,
      contactId: row.contactId ?? row.contact?.id ?? null,
      name,
      email: pickText(row.email, row.contact?.email),
      phone: phoneOf(row),
      companyName: pickText(row.companyName, row.contact?.companyName),
      qualification: row.qualification,
      funnelStage: row.marketingFunnelStage ? FUNNEL_STAGE_LABEL[row.marketingFunnelStage] : "Bandeja",
      funnelStageId: row.marketingFunnelStage,
      videoOutreachAt: row.videoOutreachAt?.toISOString() ?? null,
      videoOutreachBookedAt: row.videoOutreachBookedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    }
  })

  return leads
}

async function resolveContact(submission: FormSubmission & { contact: Contact | null }) {
  if (submission.contact) return submission.contact

  const country = submission.phoneCountryCode?.replace(/\D/g, "") ?? ""
  const number = submission.phoneNumber?.replace(/\D/g, "") ?? ""
  if (!country || !number) {
    throw new Error("Este lead no tiene un número de WhatsApp registrado.")
  }

  const contact = await upsertContactFromLead({
    fullName: submission.fullName?.trim() || "Lead",
    email: submission.email,
    phoneCountryCode: country,
    phoneNumber: number,
    companyName: submission.companyName,
    websiteUrl: submission.websiteUrl,
    instagramUrl: submission.instagramUrl,
  })

  await prisma.formSubmission.update({
    where: { id: submission.id },
    data: { contactId: contact.id },
  })

  return contact
}

async function resolveCalBookingUrl(input: {
  sendId: string
  contactId: string
  leadId: string
  name: string
  email: string | null
}) {
  if (!isCalApiConfigured()) {
    throw new Error("Cal.com no está configurado (CAL_API_KEY).")
  }

  let privateLinkId: string | null = null
  let bookingUrl = await publicCalBookingUrl()
  try {
    const created = await createCalPrivateLink()
    if (created) {
      privateLinkId = created.linkId || null
      bookingUrl = created.bookingUrl
    }
  } catch (error) {
    console.warn("[cal] no se pudo crear private link, se usa URL pública", error)
  }
  if (!bookingUrl) {
    throw new Error("No se pudo construir el link de Cal.com.")
  }

  return {
    calPrivateLinkId: privateLinkId,
    calBookingUrl: buildPersonalizedCalUrl({
      bookingUrl,
      name: input.name,
      email: input.email,
      campaignSendId: input.sendId,
      contactId: input.contactId,
      leadId: input.leadId,
    }),
  }
}

async function queueVideoOutreachEmail(sendId: string) {
  if (!isQstashConfigured()) {
    return { queued: false as const, reason: "QStash no está configurado." }
  }
  const qstash = getQstashClient()
  if (!qstash) {
    return { queued: false as const, reason: "QStash no está configurado." }
  }

  const published = await qstash.publishJSON({
    url: `${getPipelineBaseUrl()}${EMAIL_PATH}`,
    body: { outreachSendId: sendId },
    delay: VIDEO_OUTREACH_EMAIL_DELAY_SECONDS,
    deduplicationId: `video-outreach-email-${sendId}`.slice(0, 128),
  })

  return { queued: true as const, messageId: published.messageId }
}

export async function sendVideoOutreach(input: {
  leadId: string
  video: { bytes: Uint8Array; filename: string; mimeType: string }
}) {
  if (input.video.bytes.byteLength > WHATSAPP_VIDEO_MAX_BYTES) {
    throw new Error("El video supera el límite de 16 MB de WhatsApp.")
  }
  if (!input.video.mimeType.startsWith("video/")) {
    throw new Error("Adjunta un archivo de video.")
  }

  const submission = await prisma.formSubmission.findUnique({
    where: { id: input.leadId },
    include: { contact: true },
  })
  if (!submission) throw new Error("No se encontró el lead.")

  const contact = await resolveContact(submission)
  const fullName = pickText(submission.fullName, contact.fullName) || "Lead"
  const firstName = firstNameFromFullName(fullName)
  const email = pickText(submission.email, contact.email)

  const send = await prisma.outreachSend.create({
    data: {
      campaignKey: VIDEO_OUTREACH_CAMPAIGN_KEY,
      contactId: contact.id,
      submissionId: submission.id,
      firstName,
      email,
      emailStatus: email ? "PENDING" : "SKIPPED",
      emailError: email ? null : "El lead no tiene correo.",
      calBookingUrl: (await publicCalBookingUrl().catch(() => null)) || "https://cal.com",
      waStatus: "PENDING",
    },
  })

  try {
    const cal = await resolveCalBookingUrl({
      sendId: send.id,
      contactId: contact.id,
      leadId: submission.id,
      name: fullName,
      email,
    })
    await prisma.outreachSend.update({
      where: { id: send.id },
      data: {
        calPrivateLinkId: cal.calPrivateLinkId,
        calBookingUrl: cal.calBookingUrl,
      },
    })

    const videoMediaId = await uploadWhatsAppMedia({
      bytes: input.video.bytes,
      filename: input.video.filename,
      mimeType: input.video.mimeType || "video/mp4",
    })

    const wa = await sendMarketingVideoTemplate({
      contact,
      firstName,
      videoMediaId,
    })

    const emailed = email ? await queueVideoOutreachEmail(send.id) : { queued: false as const, reason: "Sin correo" }

    const updated = await prisma.outreachSend.update({
      where: { id: send.id },
      data: {
        videoMediaId,
        waMessageId: wa.messageId,
        waStatus: "SENT",
        sentAt: new Date(),
        qstashMessageId: emailed.queued ? emailed.messageId : null,
        emailStatus: email ? (emailed.queued ? "PENDING" : "FAILED") : "SKIPPED",
        emailError: emailed.queued ? null : emailed.reason,
      },
    })

    await prisma.formSubmission.update({
      where: { id: submission.id },
      data: {
        contactId: contact.id,
        videoOutreachAt: updated.sentAt,
      },
    })

    return {
      outreachSendId: updated.id,
      waMessageId: wa.messageId,
      emailQueued: Boolean(emailed.queued),
      emailStatus: updated.emailStatus,
      calBookingUrl: cal.calBookingUrl,
      alreadyContacted: Boolean(submission.videoOutreachAt),
    }
  } catch (error) {
    await prisma.outreachSend.update({
      where: { id: send.id },
      data: {
        waStatus: "FAILED",
        emailStatus: email ? "FAILED" : "SKIPPED",
        emailError: error instanceof Error ? error.message : String(error),
      },
    })
    throw error
  }
}

export async function deliverVideoOutreachEmail(outreachSendId: string) {
  const send = await prisma.outreachSend.findUnique({
    where: { id: outreachSendId },
  })
  if (!send) throw new Error("No se encontró el envío.")
  if (send.emailStatus === "SENT") return { skipped: true as const, reason: "already_sent" }
  if (send.emailStatus === "SKIPPED" || !send.email) {
    await prisma.outreachSend.update({
      where: { id: send.id },
      data: { emailStatus: "SKIPPED", emailError: send.emailError || "El lead no tiene correo." },
    })
    return { skipped: true as const, reason: "no_email" }
  }

  try {
    await sendVideoOutreachEmail({
      email: send.email,
      firstName: send.firstName,
      bookingUrl: send.calBookingUrl,
    })
    await prisma.outreachSend.update({
      where: { id: send.id },
      data: {
        emailStatus: "SENT",
        emailSentAt: new Date(),
        emailError: null,
      },
    })
    return { skipped: false as const }
  } catch (error) {
    await prisma.outreachSend.update({
      where: { id: send.id },
      data: {
        emailStatus: "FAILED",
        emailError: error instanceof Error ? error.message : String(error),
      },
    })
    throw error
  }
}

async function findOutreachSendForBooking(booking: CalWebhookBooking) {
  const campaignSendId = booking.metadata.campaignSendId
  if (campaignSendId) {
    const byId = await prisma.outreachSend.findUnique({ where: { id: campaignSendId } })
    if (byId) return byId
  }

  if (booking.hashedLink) {
    const byLink = await prisma.outreachSend.findFirst({
      where: { calPrivateLinkId: booking.hashedLink, campaignKey: VIDEO_OUTREACH_CAMPAIGN_KEY },
      orderBy: { createdAt: "desc" },
    })
    if (byLink) return byLink
  }

  if (booking.uid) {
    const byUid = await prisma.outreachSend.findFirst({
      where: { calBookingUid: booking.uid },
      orderBy: { createdAt: "desc" },
    })
    if (byUid) return byUid
  }

  if (booking.attendeeEmail) {
    const email = booking.attendeeEmail
    return prisma.outreachSend.findFirst({
      where: {
        campaignKey: VIDEO_OUTREACH_CAMPAIGN_KEY,
        email: { equals: email, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  return null
}

export async function applyCalBookingToOutreach(booking: CalWebhookBooking) {
  const send = await findOutreachSendForBooking(booking)
  if (!send) {
    return { matched: false as const, reason: "outreach_not_found" }
  }

  if (booking.triggerEvent === "BOOKING_CANCELLED") {
    await prisma.outreachSend.update({
      where: { id: send.id },
      data: {
        calBookingUid: booking.uid ?? send.calBookingUid,
      },
    })
    return { matched: true as const, outreachSendId: send.id, action: "cancelled" as const }
  }

  const meetingTime = booking.startTime
  const bookedAt = new Date()
  const updated = await prisma.outreachSend.update({
    where: { id: send.id },
    data: {
      calBookingUid: booking.uid ?? send.calBookingUid,
      bookedAt: send.bookedAt ?? bookedAt,
      meetingTime: meetingTime ?? send.meetingTime,
    },
  })

  if (send.submissionId) {
    const submission = await prisma.formSubmission.findUnique({
      where: { id: send.submissionId },
      include: { contact: true },
    })
    if (submission) {
      await prisma.formSubmission.update({
        where: { id: submission.id },
        data: {
          videoOutreachBookedAt: updated.bookedAt,
          videoOutreachCalUid: updated.calBookingUid,
          bookedAt: submission.bookedAt ?? bookedAt,
          status: "MEETING_SCHEDULED",
        },
      })
      await recordMarketingStage({
        submissionId: submission.id,
        to: "SCHEDULED",
        triggeredBy: MARKETING_TRIGGERED_BY.system,
      })

      const contact = submission.contact
      const country = contact?.phoneCountryCode || submission.phoneCountryCode
      const number = contact?.phoneNumber || submission.phoneNumber
      if (meetingTime && country && number) {
        await attachBookingToPipeline({
          submissionId: submission.id,
          fullName: pickText(submission.fullName, contact?.fullName, booking.attendeeName) || "Lead",
          email: pickText(submission.email, contact?.email, booking.attendeeEmail) || send.email || "",
          phoneCountryCode: country,
          phoneNumber: number,
          companyName: submission.companyName,
          websiteUrl: submission.websiteUrl,
          instagramUrl: submission.instagramUrl,
          bookingFlow: submission.bookingFlow ?? "DIRECT_BOOKING",
          qualification: submission.qualification,
          meetingTime,
          meetingId: booking.uid,
          meetLink: booking.meetLink,
        })
      }
    }
  }

  return { matched: true as const, outreachSendId: send.id, action: "booked" as const }
}

export type { OutreachSend }
