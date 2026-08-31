import assert from "node:assert/strict"
import { Agent } from "@mastra/core/agent"
import { z } from "zod"
import { rescheduleAgent } from "../lib/agents/mastra/agents/reschedule.ts"

const decisionSchema = z.object({
  intent: z.enum(["reschedule", "confirm", "other", "preference", "unknown"]),
  proposedSlot: z.string().optional(),
  preference: z.enum(["morning", "afternoon", "any"]).optional(),
  avoidWindow: z.enum(["morning", "afternoon"]).optional(),
})

const reviewSchema = z.object({
  correct: z.boolean(),
  rationale: z.string(),
})

const evaluator = new Agent({
  id: "reschedule-evaluator",
  name: "Evaluador de reprogramación",
  model: process.env.OPENAI_MODEL?.trim() || "openai/gpt-4.1",
  instructions: "Evalúas decisiones de clasificación para reprogramar citas. Responde solo el JSON solicitado.",
})

const scenarios = [
  {
    message: "Santiago, no puedo asistir porque me surgió un inconveniente en la tarde.",
    expected: "reschedule",
  },
  { message: "Sí, queda bien ese horario.", expected: "confirm" },
  { message: "No, muéstrame otro horario por favor.", expected: "other" },
]

for (const scenario of scenarios) {
  const decision = await rescheduleAgent.generate(
    `Analiza este mensaje. Devuelve JSON con intent, proposedSlot opcional, preference opcional y avoidWindow opcional.
Mensaje: ${scenario.message}`,
    { structuredOutput: { schema: decisionSchema } },
  )
  const parsed = decisionSchema.parse(decision.object)
  const review = await evaluator.generate(
    `Mensaje: ${scenario.message}
Decisión del agente: ${JSON.stringify(parsed)}
La intención esperada es: ${scenario.expected}
¿La decisión es correcta?`,
    { structuredOutput: { schema: reviewSchema } },
  )
  const verdict = reviewSchema.parse(review.object)
  assert.equal(parsed.intent, scenario.expected, `intent incorrecto: ${scenario.message}`)
  assert.equal(verdict.correct, true, verdict.rationale)
  console.log(JSON.stringify({ message: scenario.message, decision: parsed, review: verdict }))
}

console.log("reschedule-agent live evaluation passed")
