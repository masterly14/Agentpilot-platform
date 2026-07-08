export const PMS_OPTIONS = [
  { value: "yes", label: "Sí, uso un PMS actualmente" },
  { value: "no", label: "No, no uso PMS" },
  { value: "evaluating", label: "Estoy evaluando opciones" },
] as const

export const PROPERTY_OPTIONS = [
  { value: "1-5", label: "1 a 5 propiedades" },
  { value: "6-15", label: "6 a 15 propiedades" },
  { value: "16-50", label: "16 a 50 propiedades" },
  { value: "51+", label: "Más de 50 propiedades" },
] as const

export const REVENUE_OPTIONS = [
  { value: "under-10m", label: "Menos de $10 millones / mes" },
  { value: "10m-50m", label: "$10M – $50M / mes" },
  { value: "50m-200m", label: "$50M – $200M / mes" },
  { value: "200m+", label: "Más de $200M / mes" },
] as const

function getOptionLabel(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}

export function formatBookingAnswersForDescription(answers: {
  usesPms: string
  propertyCount: string
  revenueRange: string
  phoneCountryCode?: string
  phoneNumber?: string
  companyName?: string
  websiteUrl?: string
}) {
  const lines = [
    `PMS: ${getOptionLabel(PMS_OPTIONS, answers.usesPms)}`,
    `Propiedades: ${getOptionLabel(PROPERTY_OPTIONS, answers.propertyCount)}`,
    `Facturación: ${getOptionLabel(REVENUE_OPTIONS, answers.revenueRange)}`,
  ]

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

  return lines.join("\n")
}
