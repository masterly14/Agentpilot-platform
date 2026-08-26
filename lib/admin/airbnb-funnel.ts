import type { AirbnbCommercialStage } from "@/prisma/generated/client"
import type { FunnelColumn } from "@/lib/marketing/funnel-ui"
import type { MarketingEventName } from "@/lib/marketing/types"

export const AIRBNB_COLUMNS: FunnelColumn<AirbnbCommercialStage>[] = [
  {
    id: "HANDOFF",
    label: "Handoff",
    description: "Aceptó reunión; pide el correo y agenda Meet",
    hint: "Entra solo",
    droppable: false,
    automatic: true,
    accent: "bg-[#0972d3]",
  },
  {
    id: "SCHEDULED",
    label: "Agendado",
    description: "Meet registrado a mano",
    hint: "Botón en la ficha",
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

export const AIRBNB_STAGE_LABEL: Record<AirbnbCommercialStage, string> = {
  HANDOFF: "Handoff",
  SCHEDULED: "Agendado",
  SHOWED_UP: "Show-up",
  NO_SHOW: "No-show",
  PURCHASED: "Comprado",
}

const STAGE_RANK: Record<AirbnbCommercialStage, number> = {
  HANDOFF: 1,
  SCHEDULED: 2,
  SHOWED_UP: 3,
  NO_SHOW: 3,
  PURCHASED: 4,
}

const ALLOWED_DROPS: Record<AirbnbCommercialStage, AirbnbCommercialStage[]> = {
  HANDOFF: [],
  SCHEDULED: ["SHOWED_UP", "NO_SHOW", "PURCHASED"],
  SHOWED_UP: ["NO_SHOW", "PURCHASED"],
  NO_SHOW: ["SHOWED_UP"],
  PURCHASED: [],
}

export const AIRBNB_STAGE_EVENT: Partial<Record<AirbnbCommercialStage, MarketingEventName>> = {
  SCHEDULED: "SCHEDULE",
  SHOWED_UP: "SHOW_UP",
  PURCHASED: "PURCHASE",
}

export function canDropOnAirbnbStage(
  from: AirbnbCommercialStage | null | undefined,
  to: AirbnbCommercialStage,
) {
  if (!from || from === to) return false
  return ALLOWED_DROPS[from].includes(to)
}

export function isAirbnbCardDraggable(stage: AirbnbCommercialStage | null | undefined) {
  return Boolean(stage && ALLOWED_DROPS[stage].length > 0)
}

export function canAdvanceAirbnbStage(
  current: AirbnbCommercialStage | null | undefined,
  next: AirbnbCommercialStage,
) {
  if (!current) return true
  if (current === next) return true
  if (current === "PURCHASED") return false
  if (
    (current === "NO_SHOW" && next === "SHOWED_UP") ||
    (current === "SHOWED_UP" && next === "NO_SHOW")
  ) {
    return true
  }
  return STAGE_RANK[next] >= STAGE_RANK[current]
}

export function isAirbnbBoardLead(stage: AirbnbCommercialStage | null | undefined) {
  return Boolean(stage)
}
