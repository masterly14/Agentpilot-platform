import type { CallOutcome } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"

export type CallSummary = {
  callStatus: CallOutcome | null
  /** Veces que se marcó "Llamando". */
  callAttempts: number
  noAnswerCount: number
  lastCallAt: string | null
}

export const EMPTY_CALL_SUMMARY: CallSummary = {
  callStatus: null,
  callAttempts: 0,
  noAnswerCount: 0,
  lastCallAt: null,
}

export async function getCallSummaries(
  submissionIds: string[],
): Promise<Map<string, CallSummary>> {
  const summaries = new Map<string, CallSummary>()
  if (submissionIds.length === 0) return summaries

  let calls: Array<{ submissionId: string; outcome: CallOutcome; createdAt: Date }>
  try {
    calls = await prisma.leadCall.findMany({
      where: { submissionId: { in: submissionIds } },
      orderBy: { createdAt: "asc" },
      select: { submissionId: true, outcome: true, createdAt: true },
    })
  } catch (error) {
    // Tabla aún sin migrar: el tablero sigue funcionando sin trazabilidad de llamadas.
    console.warn("[calls] no se pudo leer LeadCall", error)
    return summaries
  }

  for (const call of calls) {
    const current = summaries.get(call.submissionId) ?? { ...EMPTY_CALL_SUMMARY }
    summaries.set(call.submissionId, {
      callStatus: call.outcome,
      callAttempts: current.callAttempts + (call.outcome === "CALLING" ? 1 : 0),
      noAnswerCount: current.noAnswerCount + (call.outcome === "NO_ANSWER" ? 1 : 0),
      lastCallAt: call.createdAt.toISOString(),
    })
  }
  return summaries
}
