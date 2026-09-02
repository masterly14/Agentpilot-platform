import { DEFAULT_PHONE_COUNTRY_CODE } from "@/lib/booking/phone-countries"
import type { BookingFormData } from "@/lib/booking/types"

export const INITIAL_BOOKING_FORM: BookingFormData = {
  usesPms: "",
  propertyCount: "",
  revenueRange: "",
  isTodero: "",
  teamSize: "",
  usesAi: "",
  wantsToScale: "",
  industryTime: "",
  fullName: "",
  email: "",
  phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
  phoneNumber: "",
  companyName: "",
  websiteUrl: "",
  instagramUrl: "",
}

export const PMS_OPTIONS = [
  { value: "yes", label: "Sí, uso un PMS actualmente" },
  { value: "no", label: "No, no uso PMS" },
  { value: "evaluating", label: "Estoy evaluando opciones" },
] as const

export const PROPERTY_OPTIONS = [
  { value: "under-5", label: "Menos de 5" },
  { value: "5-15", label: "Entre 5 y 15" },
  { value: "16-25", label: "Entre 16 y 25" },
  { value: "25+", label: "+25" },
] as const

export const REVENUE_OPTIONS = [
  { value: "under-10m", label: "Menos de 10 millones" },
  { value: "10m-20m", label: "Entre 10 y 20 millones" },
  { value: "21m-50m", label: "Entre 21 millones y 50 millones" },
  { value: "50m+", label: "Más de 50 millones" },
] as const

export const YES_NO_OPTIONS = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
] as const

export const TEAM_SIZE_OPTIONS = [
  { value: "one", label: "Solo yo" },
  { value: "two", label: "2 personas" },
  { value: "three-or-more", label: "3 o más personas" },
] as const

export const INDUSTRY_TIME_OPTIONS = [
  { value: "under-5", label: "Menos de 5 años" },
  { value: "5-10", label: "Entre 5 y 10 años" },
  { value: "over-10", label: "Más de 10 años" },
] as const

export const PROPERTY_COUNT_DB = {
  "under-5": "UNDER_5",
  "5-15": "FIVE_TO_FIFTEEN",
  "16-25": "SIXTEEN_TO_TWENTY_FIVE",
  "25+": "OVER_25",
} as const

export const REVENUE_RANGE_DB = {
  "under-10m": "UNDER_10M",
  "10m-20m": "TEN_TO_TWENTY_M",
  "21m-50m": "TWENTY_ONE_TO_FIFTY_M",
  "50m+": "OVER_50M",
} as const

export const PMS_USAGE_DB = {
  yes: "YES",
  no: "NO",
  evaluating: "EVALUATING",
} as const

export const YES_NO_DB = {
  yes: "YES",
  no: "NO",
} as const

export const TEAM_SIZE_DB = {
  one: "ONE",
  two: "TWO",
  "three-or-more": "THREE_OR_MORE",
} as const

export const INDUSTRY_TIME_DB = {
  "under-5": "UNDER_5",
  "5-10": "FIVE_TO_TEN",
  "over-10": "OVER_10",
} as const

export function invertOptionMap<T extends Record<string, string>>(map: T) {
  return Object.fromEntries(
    Object.entries(map).map(([value, dbValue]) => [dbValue, value])
  ) as { [K in T[keyof T]]: keyof T }
}

export const PROPERTY_COUNT_FORM = invertOptionMap(PROPERTY_COUNT_DB)
export const REVENUE_RANGE_FORM = invertOptionMap(REVENUE_RANGE_DB)
export const PMS_USAGE_FORM = invertOptionMap(PMS_USAGE_DB)
export const YES_NO_FORM = invertOptionMap(YES_NO_DB)
export const TEAM_SIZE_FORM = invertOptionMap(TEAM_SIZE_DB)
export const INDUSTRY_TIME_FORM = invertOptionMap(INDUSTRY_TIME_DB)

export type FormOption = { readonly value: string; readonly label: string }

export function isOptionValue<T extends FormOption>(
  options: readonly T[],
  value: string
): value is T["value"] {
  return options.some((option) => option.value === value)
}

export function getOptionLabel(options: readonly FormOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}

export function isValidOptionalUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return true

  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(normalized)
    return Boolean(url.hostname.includes("."))
  } catch {
    return false
  }
}

export function normalizeWebsiteUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function normalizeInstagram(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return trimmed.replace(/^@/, "")
}

export const CONTACT_SURVEY_THANKS = "Gracias por llenar la encuesta."
export const CONTACT_PROMPT_DIAGNOSIS = "Déjanos tus datos para confirmar el Diagnóstico"
export const CONTACT_PROMPT_EBOOK = "Haznos saber a dónde te enviamos el Ebook"

export const BOOKING_FORM_STEPS = [
  { id: "propertyCount", question: "¿Con cuántas propiedades trabajas?" },
  { id: "usesPms", question: "¿Usas actualmente un PMS?" },
  { id: "isTodero", question: "¿Sientes que eres el todero del negocio o que todo depende de ti?" },
  { id: "teamSize", question: "¿Tienes un equipo que trabaja contigo en la operación diaria?" },
  { id: "wantsToScale", question: "¿Quieres escalar el número de propiedades que operas?" },
  { id: "usesAi", question: "¿Tienes procesos implementados que son ejecutados por software e IA?" },
  { id: "revenueRange", question: "¿Cuál es tu rango de facturación actual?" },
  { id: "contact", question: CONTACT_SURVEY_THANKS },
] as const

export function formProgressPercent(stepIndex: number, totalSteps: number) {
  if (totalSteps <= 0) return 0
  const t = Math.min(1, Math.max(0, (stepIndex + 1) / totalSteps))
  return (1 - (1 - t) ** 2.15) * 100
}

export type BookingFormStepId = (typeof BOOKING_FORM_STEPS)[number]["id"]

export type LeadQualificationAnswers = {
  usesPms: string
  propertyCount: string
  revenueRange: string
  isTodero: string
  teamSize: string
  usesAi: string
  wantsToScale: string
  industryTime: string
  phoneCountryCode?: string
  phoneNumber?: string
  companyName?: string
  websiteUrl?: string
  instagramUrl?: string
  origin?: string
}

export function formatBookingAnswersForDescription(answers: LeadQualificationAnswers) {
  const lines = [
    `Propiedades: ${getOptionLabel(PROPERTY_OPTIONS, answers.propertyCount)}`,
    `PMS: ${getOptionLabel(PMS_OPTIONS, answers.usesPms)}`,
    `Todero / todo depende de él: ${getOptionLabel(YES_NO_OPTIONS, answers.isTodero)}`,
    `Equipo de operación: ${getOptionLabel(TEAM_SIZE_OPTIONS, answers.teamSize)}`,
    `Quiere escalar propiedades: ${getOptionLabel(YES_NO_OPTIONS, answers.wantsToScale)}`,
    `Procesos con software e IA: ${getOptionLabel(YES_NO_OPTIONS, answers.usesAi)}`,
    `Facturación: ${getOptionLabel(REVENUE_OPTIONS, answers.revenueRange)}`,
  ]
  if (answers.industryTime) {
    lines.push(`Tiempo en la industria: ${getOptionLabel(INDUSTRY_TIME_OPTIONS, answers.industryTime)}`)
  }

  const phoneDigits = answers.phoneNumber?.replace(/\D/g, "") ?? ""
  if (phoneDigits) {
    lines.push(`Teléfono: ${answers.phoneCountryCode ?? ""} ${phoneDigits}`.trim())
  }

  const companyName = answers.companyName?.trim()
  if (companyName) {
    lines.push(`Empresa: ${companyName}`)
  }

  const websiteUrl = answers.websiteUrl?.trim()
  if (websiteUrl) {
    lines.push(`Sitio web: ${websiteUrl}`)
  }

  const instagramUrl = answers.instagramUrl?.trim()
  if (instagramUrl) {
    lines.push(`Instagram: ${instagramUrl}`)
  }

  if (answers.origin?.trim()) {
    lines.unshift(`Origen: ${answers.origin.trim()}`)
  }

  return lines.join("\n")
}
