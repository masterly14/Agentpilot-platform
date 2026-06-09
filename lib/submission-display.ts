import type {
  BusinessProblem,
  CompanySize,
  ProductType,
  ProjectStage,
  ProjectType,
  SubmissionStatus,
} from "@/prisma/generated/client"
import { STATUS_LABELS } from "@/lib/submission-status"

const PROJECT_TYPE: Record<ProjectType, string> = {
  PERSONAL: "Personal",
  COMPANY: "Empresa",
}

const PROJECT_STAGE: Record<ProjectStage, string> = {
  CONCEPT: "Solo es un concepto",
  PLAN: "Tengo bocetos o un plan",
  BUILT: "Ya tengo algo funcionando",
}

const PRODUCT_TYPE: Record<ProductType, string> = {
  MOBILE: "App móvil",
  WEB: "Plataforma web",
  MARKETPLACE: "Marketplace",
  SAAS: "SaaS",
  OTHER: "Otro",
}

const BUSINESS_PROBLEM: Record<BusinessProblem, string> = {
  AUTOMATE: "Automatizar procesos",
  CUSTOM: "Sistema a medida",
  INTEGRATE: "Integrar herramientas",
  MODERNIZE: "Modernizar algo existente",
}

const COMPANY_SIZE: Record<CompanySize, string> = {
  SMALL: "1–10",
  MEDIUM: "11–50",
  LARGE: "50+",
}

export type SubmissionRecord = {
  id: string
  fullName: string
  email: string | null
  projectType: ProjectType
  projectStage: ProjectStage | null
  productType: ProductType | null
  businessProblem: BusinessProblem | null
  companyName: string | null
  companyWebsite: string | null
  companySocialMedia: string | null
  companySize: CompanySize | null
  projectDescription: string | null
  status: SubmissionStatus
  createdAt: string
  updatedAt: string
}

export function serializeSubmission<T extends {
  createdAt: Date
  updatedAt: Date
}>(submission: T): Omit<T, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string } {
  return {
    ...submission,
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
  }
}

export function getSubmissionTitle(submission: Pick<SubmissionRecord, "companyName" | "fullName" | "projectType">) {
  if (submission.projectType === "COMPANY" && submission.companyName) {
    return submission.companyName
  }
  return submission.fullName
}

export function getSubmissionSubtitle(submission: Pick<SubmissionRecord, "companyName" | "fullName" | "projectType">) {
  if (submission.projectType === "COMPANY" && submission.companyName) {
    return submission.fullName
  }
  return PROJECT_TYPE[submission.projectType]
}

export function getSubmissionSummary(submission: SubmissionRecord) {
  const parts: string[] = [PROJECT_TYPE[submission.projectType]]

  if (submission.projectStage) parts.push(PROJECT_STAGE[submission.projectStage])
  if (submission.productType) parts.push(PRODUCT_TYPE[submission.productType])
  if (submission.businessProblem) parts.push(BUSINESS_PROBLEM[submission.businessProblem])
  if (submission.companySize) parts.push(COMPANY_SIZE[submission.companySize])

  return parts.join(" · ")
}

export function getSubmissionDetails(submission: SubmissionRecord) {
  return [
    { label: "Estado", value: STATUS_LABELS[submission.status] },
    { label: "Tipo", value: PROJECT_TYPE[submission.projectType] },
    { label: "Nombre", value: submission.fullName },
    { label: "Correo", value: submission.email ?? "—" },
    submission.projectStage ? { label: "Etapa", value: PROJECT_STAGE[submission.projectStage] } : null,
    submission.productType ? { label: "Producto", value: PRODUCT_TYPE[submission.productType] } : null,
    submission.businessProblem ? { label: "Objetivo", value: BUSINESS_PROBLEM[submission.businessProblem] } : null,
    submission.companyName ? { label: "Empresa", value: submission.companyName } : null,
    submission.companyWebsite ? { label: "Sitio web", value: submission.companyWebsite } : null,
    submission.companySocialMedia ? { label: "Redes", value: submission.companySocialMedia } : null,
    submission.companySize ? { label: "Tamaño", value: COMPANY_SIZE[submission.companySize] } : null,
  ].filter((item): item is { label: string; value: string } => item !== null)
}
