import type {
  FunnelOrigin,
  LeadQualification,
  MarketingFunnelStage,
  PmsUsage,
  Prisma,
  PropertyCount,
  RevenueRange,
} from "@/prisma/generated/client"
import { META_CAMPAIGN_SOURCES } from "@/lib/ad-landing"
import { FUNNEL_STAGE_LABEL } from "@/lib/marketing/funnel-ui"
import { prisma } from "@/lib/prisma"

const PROPERTY_COUNT_LABEL: Record<PropertyCount, string> = {
  UNDER_5: "Menos de 5 propiedades",
  FIVE_TO_FIFTEEN: "Entre 5 y 15 propiedades",
  SIXTEEN_TO_TWENTY_FIVE: "Entre 16 y 25 propiedades",
  OVER_25: "+25 propiedades",
}

const REVENUE_RANGE_LABEL: Record<RevenueRange, string> = {
  UNDER_10M: "Menos de 10 millones",
  TEN_TO_TWENTY_M: "Entre 10 y 20 millones",
  TWENTY_ONE_TO_FIFTY_M: "Entre 21 millones y 50 millones",
  OVER_50M: "Más de 50 millones",
}

const PMS_USAGE_LABEL: Record<PmsUsage, string> = {
  YES: "Sí, usa PMS",
  NO: "No usa PMS",
  EVALUATING: "Evaluando PMS",
}

export const META_LEAD_QUALIFICATIONS = ["SQL", "MQL", "DISQUALIFIED", "UNCLASSIFIED"] as const
export type MetaLeadQualificationFilter = (typeof META_LEAD_QUALIFICATIONS)[number]

const META_LEAD_INCLUDE = {
  contact: {
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneE164: true,
      companyName: true,
      websiteUrl: true,
      instagramUrl: true,
      pipeline: {
        select: {
          funnelOrigin: true,
          currentStage: true,
          currentState: true,
          meetingTime: true,
        },
      },
    },
  },
} as const

type MetaLeadRow = Prisma.FormSubmissionGetPayload<{ include: typeof META_LEAD_INCLUDE }>

export type MetaCampaignLead = {
  leadId: string
  leadToken: string
  contactId: string | null
  name: string | null
  email: string | null
  phone: string | null
  qualification: LeadQualification | null
  qualificationScore: number | null
  funnelOrigin: FunnelOrigin | null
  company: {
    name: string | null
    website: string | null
    instagram: string | null
    propertyCount: string | null
    revenueRange: string | null
    usesPms: string | null
  }
  campaign: {
    source: string | null
    medium: string | null
    name: string | null
    content: string | null
    term: string | null
    landingPath: string | null
    hasFbclid: boolean
  }
  funnelStage: string | null
  bookedAt: string | null
  meetingTime: string | null
  createdAt: string
}

export type ListMetaCampaignLeadsInput = {
  qualification?: MetaLeadQualificationFilter
  campaign?: string
  query?: string
  since?: string
  until?: string
  booked?: boolean
  limit?: number
  offset?: number
}

function notEmpty<T>(value: T | null | undefined | false): value is T {
  return Boolean(value)
}

export function metaCampaignLeadWhere(): Prisma.FormSubmissionWhereInput {
  return {
    OR: [
      { fbclid: { not: null } },
      { fbc: { startsWith: "fb.1." } },
      ...META_CAMPAIGN_SOURCES.map((source) => ({
        utmSource: { equals: source, mode: "insensitive" as const },
      })),
    ],
  }
}

function qualificationWhere(
  qualification?: MetaLeadQualificationFilter,
): Prisma.FormSubmissionWhereInput | undefined {
  if (!qualification) return undefined
  if (qualification === "UNCLASSIFIED") return { qualification: null }
  return { qualification }
}

function textContains(value: string): Prisma.StringFilter {
  return { contains: value, mode: "insensitive" }
}

function queryWhere(query?: string): Prisma.FormSubmissionWhereInput | undefined {
  const value = query?.trim()
  if (!value) return undefined
  return {
    OR: [
      { id: value },
      { pdfToken: value },
      { fullName: textContains(value) },
      { email: textContains(value) },
      { companyName: textContains(value) },
      { contact: { is: { fullName: textContains(value) } } },
      { contact: { is: { email: textContains(value) } } },
      { contact: { is: { companyName: textContains(value) } } },
    ],
  }
}

function campaignWhere(campaign?: string): Prisma.FormSubmissionWhereInput | undefined {
  const value = campaign?.trim()
  if (!value) return undefined
  return { utmCampaign: textContains(value) }
}

function parseDayBoundary(value: string | undefined, endOfDay: boolean): Date | undefined {
  const raw = value?.trim()
  if (!raw) return undefined
  const isoDay = /^\d{4}-\d{2}-\d{2}$/.test(raw)
  const parsed = new Date(isoDay ? `${raw}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}-05:00` : raw)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Fecha inválida: ${raw}. Usa ISO (2026-08-01) o un datetime ISO.`)
  }
  return parsed
}

function dateWhere(since?: string, until?: string): Prisma.FormSubmissionWhereInput | undefined {
  const gte = parseDayBoundary(since, false)
  const lte = parseDayBoundary(until, true)
  if (!gte && !lte) return undefined
  return { createdAt: { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) } }
}

function bookedWhere(booked?: boolean): Prisma.FormSubmissionWhereInput | undefined {
  if (booked === undefined) return undefined
  return booked ? { bookedAt: { not: null } } : { bookedAt: null }
}

function andWhere(parts: Array<Prisma.FormSubmissionWhereInput | undefined>): Prisma.FormSubmissionWhereInput {
  const clauses = parts.filter(notEmpty)
  if (clauses.length === 0) return {}
  if (clauses.length === 1) return clauses[0]!
  return { AND: clauses }
}

function pickText(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    const trimmed = value?.trim()
    if (trimmed) return trimmed
  }
  return null
}

function phoneOf(row: MetaLeadRow): string | null {
  if (row.contact?.phoneE164?.trim()) return row.contact.phoneE164.trim()
  const country = row.phoneCountryCode?.replace(/\D/g, "") ?? ""
  const number = row.phoneNumber?.replace(/\D/g, "") ?? ""
  if (!country || !number) return null
  return `${country}${number}`
}

function iso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null
}

export function toMetaCampaignLead(row: MetaLeadRow): MetaCampaignLead {
  return {
    leadId: row.id,
    leadToken: row.pdfToken,
    contactId: row.contactId ?? row.contact?.id ?? null,
    name: pickText(row.fullName, row.contact?.fullName),
    email: pickText(row.email, row.contact?.email),
    phone: phoneOf(row),
    qualification: row.qualification,
    qualificationScore: row.qualificationScore,
    funnelOrigin: row.contact?.pipeline?.funnelOrigin ?? null,
    company: {
      name: pickText(row.companyName, row.contact?.companyName),
      website: pickText(row.websiteUrl, row.contact?.websiteUrl),
      instagram: pickText(row.instagramUrl, row.contact?.instagramUrl),
      propertyCount: row.propertyCount ? PROPERTY_COUNT_LABEL[row.propertyCount] : null,
      revenueRange: row.revenueRange ? REVENUE_RANGE_LABEL[row.revenueRange] : null,
      usesPms: row.usesPms ? PMS_USAGE_LABEL[row.usesPms] : null,
    },
    campaign: {
      source: row.utmSource,
      medium: row.utmMedium,
      name: row.utmCampaign,
      content: row.utmContent,
      term: row.utmTerm,
      landingPath: row.landingPath,
      hasFbclid: Boolean(row.fbclid),
    },
    funnelStage: row.marketingFunnelStage
      ? FUNNEL_STAGE_LABEL[row.marketingFunnelStage as MarketingFunnelStage]
      : null,
    bookedAt: iso(row.bookedAt),
    meetingTime: iso(row.contact?.pipeline?.meetingTime),
    createdAt: row.createdAt.toISOString(),
  }
}

export async function listMetaCampaignLeads(input: ListMetaCampaignLeadsInput = {}) {
  const limit = Math.min(Math.max(input.limit ?? 25, 1), 50)
  const offset = Math.max(input.offset ?? 0, 0)
  const where = andWhere([
    metaCampaignLeadWhere(),
    qualificationWhere(input.qualification),
    campaignWhere(input.campaign),
    queryWhere(input.query),
    dateWhere(input.since, input.until),
    bookedWhere(input.booked),
  ])

  const [total, rows] = await Promise.all([
    prisma.formSubmission.count({ where }),
    prisma.formSubmission.findMany({
      where,
      include: META_LEAD_INCLUDE,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
  ])

  return {
    total,
    limit,
    offset,
    leads: rows.map(toMetaCampaignLead),
  }
}

export async function getMetaCampaignLead(input: { leadId?: string; leadToken?: string; email?: string }) {
  const leadId = input.leadId?.trim()
  const leadToken = input.leadToken?.trim()
  const email = input.email?.trim()
  if (!leadId && !leadToken && !email) {
    throw new Error("Indica leadId, leadToken o email.")
  }

  const identityWhere: Prisma.FormSubmissionWhereInput = {
    OR: [
      leadId ? { id: leadId } : undefined,
      leadToken ? { pdfToken: leadToken } : undefined,
      email ? { email: { equals: email, mode: "insensitive" as const } } : undefined,
      email ? { contact: { is: { email: { equals: email, mode: "insensitive" as const } } } } : undefined,
    ].filter(notEmpty),
  }

  const row = await prisma.formSubmission.findFirst({
    where: andWhere([metaCampaignLeadWhere(), identityWhere]),
    include: META_LEAD_INCLUDE,
    orderBy: { createdAt: "desc" },
  })

  if (row) return toMetaCampaignLead(row)

  const fallback = await prisma.formSubmission.findFirst({
    where: identityWhere,
    select: { id: true },
  })

  if (fallback) {
    throw new Error(`El lead ${fallback.id} existe, pero no viene de una campaña de Meta.`)
  }

  throw new Error("No se encontró un lead de Meta con esos datos.")
}
