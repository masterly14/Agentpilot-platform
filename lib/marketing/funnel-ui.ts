import type { ContractPlan, MarketingFunnelStage } from "@/prisma/generated/client"

export type FunnelColumnId = MarketingFunnelStage

export type FunnelColumn<TId extends string = string> = {
  id: TId
  label: string
  description: string
  hint?: string
  droppable: boolean
  automatic: boolean
  accent: string
}

export const FUNNEL_COLUMNS: FunnelColumn<FunnelColumnId>[] = [
  {
    id: "LEAD_MAGNET_SENT",
    label: "Guía enviada",
    description: "Descargó el lead magnet",
    hint: "Se actualiza solo",
    droppable: false,
    automatic: true,
    accent: "bg-[#0972d3]",
  },
  {
    id: "VIDEO_SENT",
    label: "Video enviado",
    description: "Abrió el video de nutrición",
    hint: "Se actualiza solo",
    droppable: false,
    automatic: true,
    accent: "bg-[#8c4fff]",
  },
  {
    id: "PENDING_CALL",
    label: "Pendiente por llamar",
    description: "Gestionar diagnóstico o descualificar",
    droppable: true,
    automatic: false,
    accent: "bg-[#b45309]",
  },
  {
    id: "SCHEDULED",
    label: "Agendado",
    description: "Reunión confirmada",
    hint: "Se actualiza solo",
    droppable: false,
    automatic: true,
    accent: "bg-[#ec7211]",
  },
  {
    id: "SHOWED_UP",
    label: "Show-up",
    description: "Asistió a la llamada",
    droppable: true,
    automatic: false,
    accent: "bg-[#037f0c]",
  },
  {
    id: "NO_SHOW",
    label: "No-show",
    description: "No se presentó",
    droppable: true,
    automatic: false,
    accent: "bg-[#7d8998]",
  },
  {
    id: "DEMO_SCHEDULED",
    label: "Demo",
    description: "Demo agendada",
    droppable: true,
    automatic: false,
    accent: "bg-[#0d9488]",
  },
  {
    id: "DISCARDED",
    label: "Descartado",
    description: "Sin fit o sin siguiente paso",
    droppable: true,
    automatic: false,
    accent: "bg-[#445566]",
  },
  {
    id: "PURCHASED",
    label: "Comprado",
    description: "Contrato cerrado",
    droppable: true,
    automatic: false,
    accent: "bg-[#033160]",
  },
]

export const FUNNEL_STAGE_LABEL: Record<MarketingFunnelStage, string> = {
  LEAD_MAGNET_SENT: "Guía enviada",
  VIDEO_SENT: "Video enviado",
  PENDING_CALL: "Pendiente por llamar",
  SCHEDULED: "Agendado",
  SHOWED_UP: "Show-up",
  NO_SHOW: "No-show",
  DEMO_SCHEDULED: "Demo",
  DISCARDED: "Descartado",
  PURCHASED: "Comprado",
}

const ALLOWED_DROPS: Record<MarketingFunnelStage, MarketingFunnelStage[]> = {
  LEAD_MAGNET_SENT: [],
  VIDEO_SENT: [],
  PENDING_CALL: ["SCHEDULED", "DISCARDED"],
  SCHEDULED: ["SHOWED_UP", "NO_SHOW", "PENDING_CALL", "PURCHASED"],
  SHOWED_UP: ["NO_SHOW", "PENDING_CALL", "DEMO_SCHEDULED", "DISCARDED", "PURCHASED"],
  NO_SHOW: ["SHOWED_UP", "PENDING_CALL"],
  DEMO_SCHEDULED: ["PURCHASED", "DISCARDED"],
  DISCARDED: [],
  PURCHASED: [],
}

export function canDropOnFunnelStage(
  from: MarketingFunnelStage | null | undefined,
  to: MarketingFunnelStage,
) {
  if (!from || from === to) return false
  return ALLOWED_DROPS[from].includes(to)
}

export function isFunnelCardDraggable(stage: MarketingFunnelStage | null | undefined) {
  return Boolean(stage && ALLOWED_DROPS[stage].length > 0)
}

export function isInboxLead(input: {
  status: string
  marketingFunnelStage: MarketingFunnelStage | null
}) {
  return input.status === "PARTIAL" || !input.marketingFunnelStage
}

export function hasInboxContact(input: {
  email?: string | null
  phoneNumber?: string | null
}) {
  return Boolean(input.email?.trim() || input.phoneNumber?.replace(/\D/g, ""))
}

export function compareInboxLeads<T extends {
  email?: string | null
  phoneNumber?: string | null
  updatedAt: string
}>(a: T, b: T) {
  const rank = inboxContactScore(b) - inboxContactScore(a)
  if (rank !== 0) return rank
  return b.updatedAt.localeCompare(a.updatedAt)
}

function inboxContactScore(input: {
  email?: string | null
  phoneNumber?: string | null
}) {
  return Number(Boolean(input.phoneNumber?.replace(/\D/g, ""))) + Number(Boolean(input.email?.trim()))
}

export const PLAN_OPTIONS: Array<{
  id: ContractPlan
  label: string
  amount: number | null
  hint: string
}> = [
  { id: "THREE_MONTH", label: "$3,000", amount: 3000, hint: "3 meses" },
  { id: "FIVE_MONTH", label: "$5,000", amount: 5000, hint: "5 meses" },
  { id: "OTHER", label: "Otro", amount: null, hint: "Monto libre" },
]
