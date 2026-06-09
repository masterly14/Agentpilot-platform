import type { SubmissionStatus } from "@/prisma/generated/client"

export type StatusColumn = {
  id: SubmissionStatus
  label: string
  description: string
  accent: string
}

export const STATUS_COLUMNS: StatusColumn[] = [
  { id: "NEW", label: "Nuevo", description: "Recién recibido", accent: "border-sky-500/40 bg-sky-500/5" },
  { id: "REVIEWING", label: "En revisión", description: "Evaluando encaje", accent: "border-violet-500/40 bg-violet-500/5" },
  { id: "CONTACTED", label: "Contactado", description: "Primer contacto hecho", accent: "border-amber-500/40 bg-amber-500/5" },
  { id: "MEETING_SCHEDULED", label: "Reunión agendada", description: "Llamada o meet programada", accent: "border-orange-500/40 bg-orange-500/5" },
  { id: "PROPOSAL_SENT", label: "Propuesta enviada", description: "Oferta o alcance compartido", accent: "border-blue-500/40 bg-blue-500/5" },
  { id: "CLOSED_WON", label: "Cerrado", description: "Proyecto confirmado", accent: "border-emerald-500/40 bg-emerald-500/5" },
  { id: "CLOSED_LOST", label: "Descartado", description: "No avanzó", accent: "border-zinc-500/40 bg-zinc-500/5" },
]

export const STATUS_LABELS = Object.fromEntries(
  STATUS_COLUMNS.map((column) => [column.id, column.label])
) as Record<SubmissionStatus, string>
