import type {
  DisqualificationReason,
  IndustryTime,
  LeadQualification,
  PmsUsage,
  PropertyCount,
  RevenueRange,
  YesNo,
} from "@/prisma/generated/client"
import {
  INDUSTRY_TIME_DB,
  INDUSTRY_TIME_OPTIONS,
  isOptionValue,
  isValidOptionalUrl,
  normalizeInstagram,
  normalizeWebsiteUrl,
  PMS_OPTIONS,
  PMS_USAGE_DB,
  PROPERTY_COUNT_DB,
  PROPERTY_OPTIONS,
  REVENUE_OPTIONS,
  REVENUE_RANGE_DB,
  YES_NO_DB,
  YES_NO_OPTIONS,
} from "@/lib/booking/form-options"
import { isValidPhoneNumber } from "@/lib/booking/phone-countries"
import type { BookingFormData } from "@/lib/booking/types"
import {
  canClassifyLead,
  classifyLead,
  type QualificationScoreBreakdown,
} from "@/lib/lead-qualification"

export type LeadPrismaFields = {
  fullName?: string
  email?: string
  companyName?: string
  phoneCountryCode?: string
  phoneNumber?: string
  websiteUrl?: string
  instagramUrl?: string
  usesPms?: PmsUsage
  propertyCount?: PropertyCount
  revenueRange?: RevenueRange
  isTodero?: YesNo
  usesAi?: YesNo
  wantsToScale?: YesNo
  industryTime?: IndustryTime
  qualification?: LeadQualification
  qualificationScore?: number | null
  disqualificationReason?: DisqualificationReason | null
  scoreBreakdown?: QualificationScoreBreakdown
}

export const PARTIAL_ENTRY_SOURCES = ["EBOOK", "DIAGNOSIS", "DIRECT_BOOKING"] as const
export const PARTIAL_BOOKING_FLOWS = ["DIAGNOSIS_PUBLIC", "DIRECT_BOOKING"] as const

export type PartialEntrySource = (typeof PARTIAL_ENTRY_SOURCES)[number]
export type PartialBookingFlow = (typeof PARTIAL_BOOKING_FLOWS)[number]

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function readString(value: unknown) {
  return typeof value === "string" ? value : ""
}

export function isPartialEntrySource(value: unknown): value is PartialEntrySource {
  return typeof value === "string" && PARTIAL_ENTRY_SOURCES.includes(value as PartialEntrySource)
}

export function isPartialBookingFlow(value: unknown): value is PartialBookingFlow {
  return typeof value === "string" && PARTIAL_BOOKING_FLOWS.includes(value as PartialBookingFlow)
}

export function leadFormToPrismaData(form: Partial<BookingFormData>): LeadPrismaFields {
  const data: LeadPrismaFields = {}

  const fullName = readString(form.fullName).trim()
  if (fullName) data.fullName = fullName

  const email = readString(form.email).trim()
  if (isValidEmail(email)) data.email = email

  const companyName = readString(form.companyName).trim()
  if (companyName) data.companyName = companyName

  const websiteUrl = readString(form.websiteUrl)
  if (websiteUrl.trim() && isValidOptionalUrl(websiteUrl)) {
    data.websiteUrl = normalizeWebsiteUrl(websiteUrl)
  }

  const instagramUrl = readString(form.instagramUrl)
  if (instagramUrl.trim()) data.instagramUrl = normalizeInstagram(instagramUrl)

  const phoneNumber = readString(form.phoneNumber)
  if (isValidPhoneNumber(phoneNumber)) {
    data.phoneNumber = phoneNumber.replace(/\D/g, "")
    const phoneCountryCode = readString(form.phoneCountryCode).trim()
    if (phoneCountryCode) data.phoneCountryCode = phoneCountryCode
  }

  if (isOptionValue(PMS_OPTIONS, readString(form.usesPms))) {
    data.usesPms = PMS_USAGE_DB[form.usesPms as keyof typeof PMS_USAGE_DB]
  }
  if (isOptionValue(PROPERTY_OPTIONS, readString(form.propertyCount))) {
    data.propertyCount = PROPERTY_COUNT_DB[form.propertyCount as keyof typeof PROPERTY_COUNT_DB]
  }
  if (isOptionValue(REVENUE_OPTIONS, readString(form.revenueRange))) {
    data.revenueRange = REVENUE_RANGE_DB[form.revenueRange as keyof typeof REVENUE_RANGE_DB]
  }
  if (isOptionValue(YES_NO_OPTIONS, readString(form.isTodero))) {
    data.isTodero = YES_NO_DB[form.isTodero as keyof typeof YES_NO_DB]
  }
  if (isOptionValue(YES_NO_OPTIONS, readString(form.usesAi))) {
    data.usesAi = YES_NO_DB[form.usesAi as keyof typeof YES_NO_DB]
  }
  if (isOptionValue(YES_NO_OPTIONS, readString(form.wantsToScale))) {
    data.wantsToScale = YES_NO_DB[form.wantsToScale as keyof typeof YES_NO_DB]
  }
  if (isOptionValue(INDUSTRY_TIME_OPTIONS, readString(form.industryTime))) {
    data.industryTime = INDUSTRY_TIME_DB[form.industryTime as keyof typeof INDUSTRY_TIME_DB]
  }

  const classificationInput = {
    propertyCount: readString(form.propertyCount),
    revenueRange: readString(form.revenueRange),
    isTodero: readString(form.isTodero),
    usesAi: readString(form.usesAi),
    wantsToScale: readString(form.wantsToScale),
  }

  if (canClassifyLead(classificationInput)) {
    const classification = classifyLead(classificationInput)
    data.qualification = classification.qualification
    data.qualificationScore = classification.qualificationScore
    data.disqualificationReason = classification.disqualificationReason
    data.scoreBreakdown = classification.scoreBreakdown ?? undefined
  }

  return data
}

export function hasPersistableLeadData(data: LeadPrismaFields) {
  return Object.keys(data).length > 0
}

export function parsePartialLeadFields(value: unknown): Partial<BookingFormData> {
  if (!value || typeof value !== "object") return {}
  const record = value as Record<string, unknown>
  const fields: Partial<BookingFormData> = {}

  for (const key of [
    "fullName",
    "email",
    "companyName",
    "phoneCountryCode",
    "phoneNumber",
    "websiteUrl",
    "instagramUrl",
    "usesPms",
    "propertyCount",
    "revenueRange",
    "isTodero",
    "usesAi",
    "wantsToScale",
    "industryTime",
  ] as const) {
    if (typeof record[key] === "string") {
      fields[key] = record[key]
    }
  }

  return fields
}
