import type {
  IndustryTime,
  LeadEntrySource,
  PmsUsage,
  PropertyCount,
  RevenueRange,
  SubmissionStatus,
  YesNo,
} from "@/prisma/generated/client"

export const FUNNEL_FIELD_IDS = [
  "propertyCount",
  "usesPms",
  "isTodero",
  "wantsToScale",
  "usesAi",
  "revenueRange",
  "industryTime",
  "fullName",
  "email",
  "companyName",
  "phoneNumber",
  "submit",
] as const

export type FunnelFieldId = (typeof FUNNEL_FIELD_IDS)[number]

export const FUNNEL_FIELD_LABELS: Record<FunnelFieldId, string> = {
  propertyCount: "Propiedades",
  revenueRange: "Facturación",
  usesPms: "PMS",
  isTodero: "Todero",
  wantsToScale: "Escalar",
  usesAi: "Uso de IA",
  industryTime: "Tiempo en industria",
  fullName: "Nombre",
  email: "Correo",
  companyName: "Empresa",
  phoneNumber: "Teléfono",
  submit: "Confirmación final",
}

export type FunnelSourceKey = "all" | "DIRECT_BOOKING" | "DIAGNOSIS" | "EBOOK"

export type FunnelStepStat = {
  id: FunnelFieldId
  label: string
  reached: number
  completed: number
  dropped: number
  dropRate: number
}

export type FunnelFrictionReport = {
  partialCount: number
  completedCount: number
  steps: FunnelStepStat[]
  bottleneck: FunnelStepStat | null
}

export type FunnelFrictionBySource = Record<FunnelSourceKey, FunnelFrictionReport>

export type FunnelSubmission = {
  status: SubmissionStatus
  entrySource: LeadEntrySource
  fullName: string | null
  email: string | null
  companyName: string | null
  phoneNumber: string | null
  usesPms: PmsUsage | null
  propertyCount: PropertyCount | null
  revenueRange: RevenueRange | null
  isTodero: YesNo | null
  usesAi: YesNo | null
  wantsToScale: YesNo | null
  industryTime: IndustryTime | null
}

const BOOKING_FUNNEL: FunnelFieldId[] = [
  "propertyCount",
  "usesPms",
  "isTodero",
  "wantsToScale",
  "usesAi",
  "revenueRange",
  "fullName",
  "email",
  "phoneNumber",
  "submit",
]

const EBOOK_FUNNEL: FunnelFieldId[] = [
  "propertyCount",
  "usesPms",
  "isTodero",
  "wantsToScale",
  "usesAi",
  "revenueRange",
  "fullName",
  "email",
  "companyName",
  "phoneNumber",
  "submit",
]

function sequenceFor(source: LeadEntrySource): FunnelFieldId[] {
  return source === "EBOOK" ? EBOOK_FUNNEL : BOOKING_FUNNEL
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim())
}

function isFieldFilled(submission: FunnelSubmission, field: FunnelFieldId) {
  switch (field) {
    case "propertyCount":
      return submission.propertyCount != null
    case "revenueRange":
      return submission.revenueRange != null
    case "usesPms":
      return submission.usesPms != null
    case "isTodero":
      return submission.isTodero != null
    case "wantsToScale":
      return submission.wantsToScale != null
    case "usesAi":
      return submission.usesAi != null
    case "industryTime":
      return submission.industryTime != null
    case "fullName":
      return hasText(submission.fullName)
    case "email":
      return hasText(submission.email)
    case "companyName":
      return hasText(submission.companyName)
    case "phoneNumber":
      return hasText(submission.phoneNumber)
    case "submit":
      return submission.status !== "PARTIAL"
  }
}

function emptyAcc(ids: readonly FunnelFieldId[]) {
  return Object.fromEntries(
    ids.map((id) => [
      id,
      { reached: 0, completed: 0, dropped: 0 },
    ])
  ) as Record<FunnelFieldId, { reached: number; completed: number; dropped: number }>
}

function pickBottleneck(steps: FunnelStepStat[]) {
  const candidates = steps.filter((step) => step.dropped > 0)
  if (candidates.length === 0) return null

  return [...candidates].sort((a, b) => {
    if (b.dropRate !== a.dropRate) return b.dropRate - a.dropRate
    return b.dropped - a.dropped
  })[0]
}

function toSteps(
  acc: Record<FunnelFieldId, { reached: number; completed: number; dropped: number }>,
  order: readonly FunnelFieldId[],
  sortByFriction: boolean
) {
  const steps = order
    .map((id) => {
      const counts = acc[id]
      const dropRate = counts.reached === 0 ? 0 : counts.dropped / counts.reached
      return {
        id,
        label: FUNNEL_FIELD_LABELS[id],
        reached: counts.reached,
        completed: counts.completed,
        dropped: counts.dropped,
        dropRate,
      }
    })
    .filter((step) => step.reached > 0)

  if (!sortByFriction) return steps

  return [...steps].sort((a, b) => {
    if (b.dropped !== a.dropped) return b.dropped - a.dropped
    return b.dropRate - a.dropRate
  })
}

function buildReport(
  submissions: FunnelSubmission[],
  order: readonly FunnelFieldId[],
  sortByFriction: boolean
): FunnelFrictionReport {
  const acc = emptyAcc(FUNNEL_FIELD_IDS)

  for (const submission of submissions) {
    const sequence = sequenceFor(submission.entrySource)
    let blocked = false
    for (const field of sequence) {
      if (blocked) break
      acc[field].reached += 1
      if (isFieldFilled(submission, field)) {
        acc[field].completed += 1
      } else {
        acc[field].dropped += 1
        blocked = true
      }
    }
  }

  const steps = toSteps(acc, order, sortByFriction)
  return {
    partialCount: submissions.filter((submission) => submission.status === "PARTIAL").length,
    completedCount: submissions.filter((submission) => submission.status !== "PARTIAL").length,
    steps,
    bottleneck: pickBottleneck(steps),
  }
}

export function buildFunnelFriction(submissions: FunnelSubmission[]): FunnelFrictionBySource {
  const bySource = {
    DIRECT_BOOKING: submissions.filter((submission) => submission.entrySource === "DIRECT_BOOKING"),
    DIAGNOSIS: submissions.filter((submission) => submission.entrySource === "DIAGNOSIS"),
    EBOOK: submissions.filter((submission) => submission.entrySource === "EBOOK"),
  }

  return {
    all: buildReport(submissions, FUNNEL_FIELD_IDS, true),
    DIRECT_BOOKING: buildReport(bySource.DIRECT_BOOKING, BOOKING_FUNNEL, false),
    DIAGNOSIS: buildReport(bySource.DIAGNOSIS, BOOKING_FUNNEL, false),
    EBOOK: buildReport(bySource.EBOOK, EBOOK_FUNNEL, false),
  }
}
