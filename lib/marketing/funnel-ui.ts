import type { ContractPlan, MarketingFunnelStage } from "@/prisma/generated/client"

export type FunnelColumnId = MarketingFunnelStage

export type FunnelColumn = {
  id: string
  label: string
  description: string
  hint?: string
  droppable: boolean
  automatic: boolean
  accent: string
}

export const FUNNEL_COLUMNS: FunnelColumn[] = [
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
  SCHEDULED: "Agendado",
  SHOWED_UP: "Show-up",
  NO_SHOW: "No-show",
  PURCHASED: "Comprado",
}

const ALLOWED_DROPS: Record<MarketingFunnelStage, MarketingFunnelStage[]> = {
  LEAD_MAGNET_SENT: [],
  VIDEO_SENT: [],
  SCHEDULED: ["SHOWED_UP", "NO_SHOW", "PURCHASED"],
  SHOWED_UP: ["NO_SHOW", "PURCHASED"],
  NO_SHOW: ["SHOWED_UP"],
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
