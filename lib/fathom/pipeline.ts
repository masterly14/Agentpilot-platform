import { getMastra, isOpenAiConfigured } from "@/lib/agents/mastra"
import { isConfluenceConfigured } from "@/lib/confluence/config"
import { parseFathomMeeting, type FathomMeeting } from "@/lib/fathom/payload"

export type CallAnalysisSkipReason = "no_transcript" | "no_openai" | "no_confluence"

export type CallAnalysisResult =
  | { skipped: CallAnalysisSkipReason }
  | {
      pageId: string
      title: string
      url: string
      created: boolean
      overallScore: number
    }

export async function processCallAnalysis(input: {
  meeting: FathomMeeting
  meetingPageUrl?: string
}): Promise<CallAnalysisResult> {
  if (!input.meeting.transcript?.length) return { skipped: "no_transcript" }
  if (!isOpenAiConfigured()) return { skipped: "no_openai" }
  if (!isConfluenceConfigured()) return { skipped: "no_confluence" }

  const workflow = getMastra().getWorkflow("callAnalysisWorkflow")
  const run = await workflow.createRun()
  const result = await run.start({
    inputData: {
      meeting: input.meeting,
      meetingPageUrl: input.meetingPageUrl || "",
    },
  })

  if (result.status !== "success") {
    const detail =
      result.status === "failed"
        ? result.error instanceof Error
          ? result.error.message
          : String(result.error)
        : result.status
    throw new Error(`Workflow de análisis falló: ${detail}`)
  }

  return result.result
}

export function parseAnalysisJob(payload: unknown) {
  if (!payload || typeof payload !== "object") return null
  const record = payload as { meeting?: unknown; meetingPageUrl?: unknown }
  const meeting = parseFathomMeeting(record.meeting)
  if (!meeting) return null
  return {
    meeting,
    meetingPageUrl: typeof record.meetingPageUrl === "string" ? record.meetingPageUrl : "",
  }
}
