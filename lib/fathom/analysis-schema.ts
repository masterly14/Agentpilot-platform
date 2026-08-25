import { z } from "zod"

const scoredItem = z.object({
  title: z.string(),
  detail: z.string(),
  quote: z.string().optional(),
})

export const callAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(10),
  scores: z.object({
    discovery: z.number().min(0).max(10).describe("Preguntas, dolor, ICP, contexto del negocio"),
    pitch: z.number().min(0).max(10).describe("Claridad y exactitud del producto vs. la ficha de Confluence"),
    objections: z.number().min(0).max(10).describe("Cómo manejó precio, timing, 'ya tengo PMS', etc."),
    close: z.number().min(0).max(10).describe("Pedido de siguiente paso, urgencia, compromiso"),
    listening: z.number().min(0).max(10).describe("Si escuchó o habló de más"),
    nextStep: z.number().min(0).max(10).describe("Claridad del next step acordado"),
  }),
  verdict: z.string().describe("Una frase: qué tan cerca estuvo de cerrar o avanzar el deal"),
  summary: z.string().describe("Resumen ejecutivo de 2-4 oraciones para el vendedor"),
  positives: z.array(scoredItem).min(1).max(6),
  improvements: z
    .array(
      scoredItem.extend({
        suggestedScript: z.string().optional().describe("Frase concreta que debió decir"),
      }),
    )
    .min(1)
    .max(6),
  objectionsHandled: z.array(
    z.object({
      objection: z.string(),
      howHandled: z.string(),
      betterApproach: z.string(),
    }),
  ),
  structureNotes: z.string().describe("Qué etapas de la llamada estuvieron y cuáles faltaron"),
  nextCoachingFocus: z.string().describe("Una sola prioridad de práctica para la próxima llamada"),
})

export type CallAnalysis = z.infer<typeof callAnalysisSchema>
