import { Mastra } from "@mastra/core"
import { salesCoachAgent } from "@/lib/agents/mastra/agents/sales-coach"
import { callAnalysisWorkflow } from "@/lib/agents/mastra/workflows/call-analysis"

const globalForMastra = globalThis as typeof globalThis & { __mastra?: Mastra }

export function getMastra() {
  if (!globalForMastra.__mastra) {
    globalForMastra.__mastra = new Mastra({
      agents: { salesCoachAgent },
      workflows: { callAnalysisWorkflow },
    })
  }
  return globalForMastra.__mastra
}

export function isOpenAiConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}
