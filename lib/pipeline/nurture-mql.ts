import type { LeadPipeline, PipelineState } from "@/prisma/generated/client"

/**
 * Nutrición MQL — pendiente de construir.
 *
 * El bloque de cualificación conversacional (preguntas, fit/no-fit) se retiró.
 * Un MQL ya sale cualificado del formulario; este hook es el único avance
 * automático de su pipeline de nutrición.
 *
 * Devolver un estado desde LEAD_MAGNET_DOWNLOADED arranca la secuencia.
 */
export function nextMqlNurtureState(_pipeline: LeadPipeline): PipelineState | null {
  return null
}
