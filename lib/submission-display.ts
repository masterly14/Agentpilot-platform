import type {
  BookingFlow,
  ContractPlan,
  DisqualificationReason,
  IndustryTime,
  LeadEntrySource,
  LeadQualification,
  MarketingFunnelStage,
  PmsUsage,
  PropertyCount,
  RevenueRange,
  SubmissionStatus,
  YesNo,
} from "@/prisma/generated/client"
import { FUNNEL_STAGE_LABEL } from "@/lib/marketing/funnel-ui"

const PMS_USAGE: Record<PmsUsage, string> = {
  YES: "Sí, usa PMS",
  NO: "No usa PMS",
  EVALUATING: "Evaluando PMS",
}

const PROPERTY_COUNT: Record<PropertyCount, string> = {
  UNDER_5: "Menos de 5 propiedades",
  FIVE_TO_FIFTEEN: "Entre 5 y 15 propiedades",
  SIXTEEN_TO_TWENTY_FIVE: "Entre 16 y 25 propiedades",
  OVER_25: "+25 propiedades",
}

const REVENUE_RANGE: Record<RevenueRange, string> = {
  UNDER_10M: "Menos de 10 millones",
  TEN_TO_TWENTY_M: "Entre 10 y 20 millones",
  TWENTY_ONE_TO_FIFTY_M: "Entre 21 millones y 50 millones",
  OVER_50M: "Más de 50 millones",
}

const YES_NO: Record<YesNo, string> = {
  YES: "Sí",
  NO: "No",
}

const INDUSTRY_TIME: Record<IndustryTime, string> = {
  UNDER_5: "Menos de 5 años",
  FIVE_TO_TEN: "Entre 5 y 10 años",
  OVER_10: "Más de 10 años",
}

export const BOOKING_FLOW_LABEL: Record<BookingFlow, string> = {
  EBOOK_SQL: "Ebook → SQL → diagnóstico",
  EBOOK_PDF: "Ebook → PDF → agendar",
  DIAGNOSIS_PUBLIC: "Diagnóstico público",
  DIRECT_BOOKING: "Widget de booking",
}

export const QUALIFICATION_LABEL: Record<LeadQualification, string> = {
  SQL: "SQL",
  MQL: "MQL",
  DISQUALIFIED: "Descalificado",
}

const DISQUALIFICATION_LABEL: Record<DisqualificationReason, string> = {
  REVENUE_VETO: "Veto por facturación",
  LOW_SCORE: "Score bajo",
}

export const ENTRY_SOURCE_LABEL: Record<LeadEntrySource, string> = {
  EBOOK: "Guía (ebook)",
  DIAGNOSIS: "Diagnóstico público",
  DIRECT_BOOKING: "Booking directo",
}

export type SubmissionRecord = {
  id: string
  fullName: string | null
  email: string | null
  companyName: string | null
  phoneCountryCode: string | null
  phoneNumber: string | null
  instagramUrl: string | null
  websiteUrl: string | null
  usesPms: PmsUsage | null
  propertyCount: PropertyCount | null
  revenueRange: RevenueRange | null
  isTodero: YesNo | null
  usesAi: YesNo | null
  wantsToScale: YesNo | null
  industryTime: IndustryTime | null
  qualification: LeadQualification | null
  qualificationScore: number | null
  disqualificationReason: DisqualificationReason | null
  entrySource: LeadEntrySource
  bookingFlow: BookingFlow | null
  bookedAt: string | null
  status: SubmissionStatus
  marketingFunnelStage: MarketingFunnelStage | null
  contractValueUsd: string | null
  contractPlan: ContractPlan | null
  contactId: string | null
  meetingTime: string | null
  meetLink: string | null
  visitorTimezone: string | null
  painPoint: string | null
  createdAt: string
  updatedAt: string
}

export function serializeSubmission<T extends {
  createdAt: Date
  updatedAt: Date
  bookedAt?: Date | null
  contractValueUsd?: unknown
  meetingTime?: Date | null
  meetLink?: string | null
  visitorTimezone?: string | null
  painPoint?: string | null
}>(submission: T) {
  const { contractValueUsd, createdAt, updatedAt, bookedAt, meetingTime, meetLink, visitorTimezone, painPoint, ...rest } =
    submission
  return {
    ...rest,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    bookedAt: bookedAt ? bookedAt.toISOString() : null,
    meetingTime: meetingTime ? meetingTime.toISOString() : null,
    meetLink: meetLink ?? null,
    visitorTimezone: visitorTimezone ?? null,
    painPoint: painPoint ?? null,
    contractValueUsd: contractValueUsd == null ? null : String(contractValueUsd),
  }
}

export function getSubmissionTitle(
  submission: Pick<SubmissionRecord, "companyName" | "fullName" | "email">
) {
  return (
    submission.companyName?.trim() ||
    submission.fullName?.trim() ||
    submission.email?.trim() ||
    "Lead incompleto"
  )
}

export function getSubmissionSubtitle(
  submission: Pick<SubmissionRecord, "companyName" | "fullName" | "email">
) {
  if (submission.companyName?.trim() && submission.fullName?.trim()) {
    return submission.fullName.trim()
  }
  if (submission.fullName?.trim() && submission.email?.trim()) {
    return submission.email.trim()
  }
  return "Formulario incompleto"
}

export function getSubmissionSummary(submission: SubmissionRecord) {
  const parts = [
    submission.qualification ? QUALIFICATION_LABEL[submission.qualification] : null,
    submission.qualificationScore != null ? `${submission.qualificationScore} pts` : null,
    submission.propertyCount ? PROPERTY_COUNT[submission.propertyCount] : null,
    submission.revenueRange ? REVENUE_RANGE[submission.revenueRange] : null,
  ].filter((part): part is string => Boolean(part))

  return parts.join(" · ") || "Aún no completa el formulario"
}

export function getSubmissionDetails(submission: SubmissionRecord) {
  const phone =
    submission.phoneNumber
      ? `${submission.phoneCountryCode ?? ""} ${submission.phoneNumber}`.trim()
      : null

  return [
    {
      label: "Etapa",
      value: submission.marketingFunnelStage
        ? FUNNEL_STAGE_LABEL[submission.marketingFunnelStage]
        : "Bandeja",
    },
    {
      label: "Calificación",
      value: submission.qualification
        ? `${QUALIFICATION_LABEL[submission.qualification]}${
            submission.qualificationScore != null ? ` · ${submission.qualificationScore} pts` : ""
          }`
        : "Sin clasificar",
    },
    submission.disqualificationReason
      ? { label: "Motivo", value: DISQUALIFICATION_LABEL[submission.disqualificationReason] }
      : null,
    { label: "Origen", value: ENTRY_SOURCE_LABEL[submission.entrySource] },
    submission.bookingFlow
      ? { label: "Flujo de agendamiento", value: BOOKING_FLOW_LABEL[submission.bookingFlow] }
      : null,
    { label: "Nombre", value: submission.fullName?.trim() || "Sin nombre" },
    { label: "Correo", value: submission.email?.trim() || "Sin correo" },
    submission.companyName ? { label: "Empresa", value: submission.companyName } : null,
    phone ? { label: "Teléfono", value: phone } : null,
    {
      label: "Propiedades",
      value: submission.propertyCount ? PROPERTY_COUNT[submission.propertyCount] : "Sin responder",
    },
    {
      label: "Facturación",
      value: submission.revenueRange ? REVENUE_RANGE[submission.revenueRange] : "Sin responder",
    },
    { label: "PMS", value: submission.usesPms ? PMS_USAGE[submission.usesPms] : "Sin responder" },
    submission.isTodero ? { label: "Todero", value: YES_NO[submission.isTodero] } : null,
    submission.wantsToScale ? { label: "Quiere escalar", value: YES_NO[submission.wantsToScale] } : null,
    submission.usesAi ? { label: "Usa IA", value: YES_NO[submission.usesAi] } : null,
    submission.industryTime ? { label: "Industria", value: INDUSTRY_TIME[submission.industryTime] } : null,
    submission.instagramUrl ? { label: "Instagram", value: submission.instagramUrl } : null,
    submission.websiteUrl ? { label: "Sitio web", value: submission.websiteUrl } : null,
    submission.painPoint ? { label: "Dolor", value: submission.painPoint } : null,
    submission.bookedAt
      ? {
          label: "Agendó",
          value: new Date(submission.bookedAt)
            .toLocaleString("es-CO", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "America/Bogota",
            })
            .replace(/[\u00A0\u202F\u2009]/g, " "),
        }
      : null,
  ].filter((item): item is { label: string; value: string } => item !== null)
}
