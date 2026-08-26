import { getMastra, isOpenAiConfigured } from "@/lib/agents/mastra"
import { isConfluenceConfigured } from "@/lib/confluence/config"
import { parseFathomMeeting, type FathomMeeting } from "@/lib/fathom/payload"
import { processDiscoveryFollowup } from "@/lib/pipeline/discovery-summary"

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

  const discovery = processDiscoveryFollowup(input.meeting).catch((error) => {
    console.error("[fathom] discovery followup", error)
    return { skipped: "error" as const }
  })

  if (!isConfluenceConfigured()) {
    await discovery
    return { skipped: "no_confluence" }
  }

  const workflow = getMastra().getWorkflow("callAnalysisWorkflow")
  const run = await workflow.createRun()
  try {
    const result = await run.start({
      inputData: {
        meeting: input.meeting,
        meetingPageUrl: input.meetingPageUrl || "",
      },
    })

    await discovery

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
  } catch (error) {
    await discovery
    throw error
  }
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
