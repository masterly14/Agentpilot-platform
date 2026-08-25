import { getPipelineBaseUrl, getQstashClient, isQstashConfigured } from "@/lib/qstash/client"
import { processCallAnalysis, type CallAnalysisResult } from "@/lib/fathom/pipeline"
import type { FathomMeeting } from "@/lib/fathom/payload"

const ANALYZE_PATH = "/api/fathom/analyze"

function pipelineBaseIsLocal() {
  return /localhost|127\.0\.0\.1/i.test(getPipelineBaseUrl())
}

export type EnqueuedAnalysis =
  | CallAnalysisResult
  | { queued: true; messageId: string }

export async function enqueueCallAnalysis(input: {
  meeting: FathomMeeting
  meetingPageUrl?: string
}): Promise<EnqueuedAnalysis> {
  const useQueue =
    isQstashConfigured() &&
    process.env.NODE_ENV === "production" &&
    !pipelineBaseIsLocal()

  if (!useQueue) {
    return processCallAnalysis(input)
  }

  const qstash = getQstashClient()
  if (!qstash) return processCallAnalysis(input)

  const published = await qstash.publishJSON({
    url: `${getPipelineBaseUrl()}${ANALYZE_PATH}`,
    body: {
      meeting: input.meeting,
      meetingPageUrl: input.meetingPageUrl || "",
    },
    retries: 3,
    deduplicationId: `fathom-analysis-${input.meeting.recording_id}`.slice(0, 128),
  })

  return { queued: true, messageId: published.messageId }
}
