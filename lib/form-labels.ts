import {
  getOptionLabel,
  INDUSTRY_TIME_OPTIONS,
  PMS_OPTIONS,
  PROPERTY_OPTIONS,
  REVENUE_OPTIONS,
  YES_NO_OPTIONS,
} from "@/lib/booking/form-options"
import type { LeadFormPayload } from "@/lib/booking/types"

export function formatLeadFormDataForEmail(data: LeadFormPayload): string {
  const lines: string[] = [
    `<li><strong>Nombre:</strong> ${data.fullName}</li>`,
    `<li><strong>Correo:</strong> ${data.email}</li>`,
  ]

  if (data.companyName.trim()) {
    lines.push(`<li><strong>Empresa:</strong> ${data.companyName}</li>`)
  }

  const phone = `${data.phoneCountryCode} ${data.phoneNumber}`.trim()
  if (phone) {
    lines.push(`<li><strong>Teléfono:</strong> ${phone}</li>`)
  }

  lines.push(
    `<li><strong>Propiedades:</strong> ${getOptionLabel(PROPERTY_OPTIONS, data.propertyCount)}</li>`,
    `<li><strong>Facturación:</strong> ${getOptionLabel(REVENUE_OPTIONS, data.revenueRange)}</li>`,
    `<li><strong>PMS:</strong> ${getOptionLabel(PMS_OPTIONS, data.usesPms)}</li>`,
    `<li><strong>Todero / todo depende de él:</strong> ${getOptionLabel(YES_NO_OPTIONS, data.isTodero)}</li>`,
    `<li><strong>Quiere escalar propiedades:</strong> ${getOptionLabel(YES_NO_OPTIONS, data.wantsToScale)}</li>`,
    `<li><strong>Usa IA en el negocio:</strong> ${getOptionLabel(YES_NO_OPTIONS, data.usesAi)}</li>`,
    `<li><strong>Tiempo en la industria:</strong> ${getOptionLabel(INDUSTRY_TIME_OPTIONS, data.industryTime)}</li>`
  )

  if (data.instagramUrl.trim()) {
    lines.push(`<li><strong>Instagram:</strong> ${data.instagramUrl}</li>`)
  }
  if (data.websiteUrl.trim()) {
    lines.push(`<li><strong>Sitio web:</strong> ${data.websiteUrl}</li>`)
  }

  return lines.join("\n            ")
}
