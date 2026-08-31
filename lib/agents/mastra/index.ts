import { Mastra } from "@mastra/core"
import { discoverySummaryAgent } from "@/lib/agents/mastra/agents/discovery-summary"
import { salesCoachAgent } from "@/lib/agents/mastra/agents/sales-coach"
import { rescheduleAgent } from "@/lib/agents/mastra/agents/reschedule"
import { callAnalysisWorkflow } from "@/lib/agents/mastra/workflows/call-analysis"

const globalForMastra = globalThis as typeof globalThis & { __mastra?: Mastra }

export function getMastra() {
  if (!globalForMastra.__mastra) {
    globalForMastra.__mastra = new Mastra({
      agents: { salesCoachAgent, discoverySummaryAgent, rescheduleAgent },
      workflows: { callAnalysisWorkflow },
    })
  }
  return globalForMastra.__mastra
}

export function isOpenAiConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}
