import type { FormData } from "@/components/multi-step-form"

const PROJECT_STAGE: Record<Exclude<FormData["projectStage"], "">, string> = {
  concept: "Solo es un concepto",
  plan: "Tengo bocetos o un plan",
  built: "Ya tengo algo funcionando",
}

const PRODUCT_TYPE: Record<Exclude<FormData["productType"], "">, string> = {
  mobile: "App móvil",
  web: "Plataforma web",
  marketplace: "Marketplace",
  saas: "SaaS",
  other: "Otro",
}

const BUSINESS_PROBLEM: Record<Exclude<FormData["businessProblem"], "">, string> = {
  automate: "Automatizar procesos",
  custom: "Sistema a medida",
  integrate: "Integrar herramientas",
  modernize: "Modernizar algo existente",
}

const COMPANY_SIZE: Record<Exclude<FormData["companySize"], "">, string> = {
  "1-10": "1–10",
  "11-50": "11–50",
  "50+": "50+",
}

export function formatFormDataForEmail(data: FormData): string {
  const lines: string[] = [
    `<li><strong>Nombre:</strong> ${data.fullName}</li>`,
    `<li><strong>Correo:</strong> ${data.email || "No proporcionado"}</li>`,
    `<li><strong>Tipo de proyecto:</strong> ${data.projectType === "company" ? "Empresa" : "Personal"}</li>`,
  ]

  if (data.projectStage) {
    lines.push(`<li><strong>Etapa de la idea:</strong> ${PROJECT_STAGE[data.projectStage]}</li>`)
  }
  if (data.productType) {
    lines.push(`<li><strong>Tipo de producto:</strong> ${PRODUCT_TYPE[data.productType]}</li>`)
  }
  if (data.businessProblem) {
    lines.push(`<li><strong>Qué resolver:</strong> ${BUSINESS_PROBLEM[data.businessProblem]}</li>`)
  }
  if (data.companyName) {
    lines.push(`<li><strong>Empresa:</strong> ${data.companyName}</li>`)
  }
  if (data.companyWebsite) {
    lines.push(`<li><strong>Sitio web:</strong> ${data.companyWebsite}</li>`)
  }
  if (data.companySocialMedia) {
    lines.push(`<li><strong>Redes sociales:</strong> ${data.companySocialMedia}</li>`)
  }
  if (data.companySize) {
    lines.push(`<li><strong>Tamaño de empresa:</strong> ${COMPANY_SIZE[data.companySize]}</li>`)
  }

  return lines.join("\n            ")
}
