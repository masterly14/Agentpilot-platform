import type { FathomMeeting } from "@/lib/fathom/payload"

const LLM_TRANSCRIPT_LIMIT = 60_000

export function formatMeetingTranscript(meeting: FathomMeeting) {
  const items = meeting.transcript
  if (!items?.length) return ""

  const lines: string[] = []
  let used = 0
  for (const item of items) {
    const stamp = item.timestamp ? `[${item.timestamp}] ` : ""
    const line = `${stamp}${item.speaker.display_name}: ${item.text}`
    if (used + line.length + 1 > LLM_TRANSCRIPT_LIMIT) {
      lines.push("[Transcripción truncada para el análisis]")
      break
    }
    lines.push(line)
    used += line.length + 1
  }
  return lines.join("\n")
}
