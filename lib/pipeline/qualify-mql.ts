import type { QualificationAnswers } from "@/lib/pipeline/states"

export const MQL_QUESTIONS = {
  QUALIFYING_Q1: "¿Cuántas propiedades manejas actualmente?",
  QUALIFYING_Q2:
    "¿Qué es lo que más tiempo te quita hoy en el día a día? (reportes, comunicación con huéspedes, limpieza, cobros...)",
  QUALIFYING_Q3:
    "¿Hoy usas algún sistema para gestionar reservas o todo lo haces manual / en Excel?",
} as const

export function parseQualificationAnswers(value: unknown): QualificationAnswers {
  if (!value || typeof value !== "object") return {}
  const record = value as Record<string, unknown>
  return {
    properties: typeof record.properties === "string" ? record.properties : undefined,
    biggestTimeSink: typeof record.biggestTimeSink === "string" ? record.biggestTimeSink : undefined,
    hasSystem: typeof record.hasSystem === "string" ? record.hasSystem : undefined,
  }
}

export function hasLowPropertyFit(answer: string) {
  const digits = answer.match(/\d+/)
  if (digits) {
    const count = Number(digits[0])
    if (Number.isFinite(count) && count < 5) return true
  }
  return /\b(ningun[ao]|cero|una sola|1 o 2|pocas?)\b/i.test(answer)
}
