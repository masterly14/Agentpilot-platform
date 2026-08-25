import type { AirbnbCommercialStage, ContractPlan } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import { canAdvanceAirbnbStage } from "@/lib/admin/airbnb-funnel"
import { getAirbnbLeadRecord } from "@/lib/admin/airbnb-lead-record"
import { MARKETING_TRIGGERED_BY, recordAirbnbMarketingStage } from "@/lib/marketing/events"

function normalizeEmail(value: string | null | undefined) {
  const trimmed = value?.trim().toLowerCase() ?? ""
  return trimmed || null
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export async function ensureAirbnbCommercial(leadId: string) {
  const existing = await prisma.airbnbCommercial.findUnique({ where: { leadId } })
  if (existing) return existing
  return prisma.airbnbCommercial.create({
    data: { leadId, stage: "HANDOFF" },
  })
}

export async function scheduleAirbnbMeeting(input: {
  airbnbLeadId: string
  meetingTime: Date
  meetLink: string
  hostEmail?: string | null
}) {
  const meetLink = input.meetLink.trim()
  if (!isHttpUrl(meetLink)) {
    throw new Error("El link de Meet no es válido")
  }

  const lead = await prisma.airbnbLead.findUnique({
    where: { id: input.airbnbLeadId },
    include: { commercial: true },
  })
  if (!lead) throw new Error("Lead no encontrado")

  const hostEmail = normalizeEmail(input.hostEmail) ?? lead.hostEmail
  const current = lead.commercial?.stage ?? (lead.status === "HUMAN_TAKEOVER" ? "HANDOFF" : null)
  if (!canAdvanceAirbnbStage(current, "SCHEDULED")) {
    throw new Error("No se puede agendar desde esta etapa")
  }

  await prisma.$transaction([
    prisma.airbnbLead.update({
      where: { id: lead.id },
      data: { hostEmail },
    }),
    prisma.airbnbCommercial.upsert({
      where: { leadId: lead.id },
      create: {
        leadId: lead.id,
        stage: "SCHEDULED",
        hostEmail,
        meetingTime: input.meetingTime,
        meetLink,
      },
      update: {
        stage: "SCHEDULED",
        hostEmail,
        meetingTime: input.meetingTime,
        meetLink,
      },
    }),
  ])

  await recordAirbnbMarketingStage({
    airbnbLeadId: lead.id,
    to: "SCHEDULED",
    triggeredBy: MARKETING_TRIGGERED_BY.admin,
  })

  return getAirbnbLeadRecord(lead.id)
}

export async function setAirbnbHostEmail(airbnbLeadId: string, hostEmail: string) {
  const email = normalizeEmail(hostEmail)
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Correo inválido")
  }

  const lead = await prisma.airbnbLead.findUnique({
    where: { id: airbnbLeadId },
    include: { commercial: true },
  })
  if (!lead) throw new Error("Lead no encontrado")

  await prisma.$transaction([
    prisma.airbnbLead.update({
      where: { id: lead.id },
      data: { hostEmail: email },
    }),
    ...(lead.commercial
      ? [
          prisma.airbnbCommercial.update({
            where: { leadId: lead.id },
            data: { hostEmail: email },
          }),
        ]
      : []),
  ])

  return getAirbnbLeadRecord(lead.id)
}

export async function setAirbnbCommercialStage(input: {
  airbnbLeadId: string
  stage: AirbnbCommercialStage
  contractValueUsd?: number
  contractPlan?: ContractPlan | null
}) {
  const lead = await prisma.airbnbLead.findUnique({
    where: { id: input.airbnbLeadId },
    include: { commercial: true },
  })
  if (!lead) throw new Error("Lead no encontrado")

  const current = lead.commercial?.stage ?? (lead.status === "HUMAN_TAKEOVER" ? "HANDOFF" : null)
  if (!canAdvanceAirbnbStage(current, input.stage)) {
    throw new Error("Transición de etapa no permitida")
  }

  if (input.stage === "PURCHASED") {
    if (!input.contractValueUsd || input.contractValueUsd <= 0) {
      throw new Error("Purchase requiere contractValueUsd")
    }
  }

  await ensureAirbnbCommercial(lead.id)
  await prisma.airbnbCommercial.update({
    where: { leadId: lead.id },
    data: {
      stage: input.stage,
      ...(input.stage === "PURCHASED"
        ? {
            contractValueUsd: input.contractValueUsd,
            ...(input.contractPlan ? { contractPlan: input.contractPlan } : {}),
          }
        : {}),
    },
  })

  if (input.stage === "SCHEDULED" || input.stage === "SHOWED_UP" || input.stage === "PURCHASED") {
    await recordAirbnbMarketingStage({
      airbnbLeadId: lead.id,
      to: input.stage,
      triggeredBy: MARKETING_TRIGGERED_BY.admin,
      contractValueUsd: input.contractValueUsd,
    })
  }

  return getAirbnbLeadRecord(lead.id)
}
