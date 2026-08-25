import { z } from "zod"

const nullableString = z.string().nullable().optional()

const speakerSchema = z.object({
  display_name: z.string(),
  matched_calendar_invitee_email: nullableString,
})

const transcriptItemSchema = z.object({
  speaker: speakerSchema,
  text: z.string(),
  timestamp: z.string().optional(),
})

const summarySchema = z.object({
  template_name: nullableString,
  markdown_formatted: nullableString,
})

const assigneeSchema = z.object({
  name: nullableString,
  email: nullableString,
  team: nullableString,
})

const actionItemSchema = z.object({
  description: z.string(),
  user_generated: z.boolean().optional(),
  completed: z.boolean().optional(),
  recording_timestamp: nullableString,
  recording_playback_url: nullableString,
  assignee: assigneeSchema.nullable().optional(),
})

const inviteeSchema = z.object({
  name: nullableString,
  matched_speaker_display_name: nullableString,
  email: nullableString,
  email_domain: nullableString,
  is_external: z.boolean().optional(),
})

const recordedBySchema = z.object({
  name: z.string(),
  email: z.string(),
  team: nullableString,
  email_domain: nullableString,
})

export const fathomMeetingSchema = z.object({
  title: z.string(),
  meeting_title: nullableString,
  meeting_type: nullableString,
  recording_id: z.number().int(),
  url: z.string(),
  meeting_url: nullableString,
  share_url: nullableString,
  created_at: z.string(),
  scheduled_start_time: nullableString,
  scheduled_end_time: nullableString,
  recording_start_time: nullableString,
  recording_end_time: nullableString,
  calendar_invitees_domains_type: nullableString,
  shared_with: nullableString,
  transcript_language: nullableString,
  transcript: z.array(transcriptItemSchema).nullable().optional(),
  default_summary: summarySchema.nullable().optional(),
  action_items: z.array(actionItemSchema).nullable().optional(),
  calendar_invitees: z.array(inviteeSchema).optional().default([]),
  recorded_by: recordedBySchema,
})

export type FathomMeeting = z.infer<typeof fathomMeetingSchema>

export function recordingToken(recordingId: number) {
  return `fathom-rec-${recordingId}`
}

export function analysisToken(recordingId: number) {
  return `fathom-analysis-${recordingId}`
}

export function parseFathomMeeting(payload: unknown): FathomMeeting | null {
  const parsed = fathomMeetingSchema.safeParse(payload)
  return parsed.success ? parsed.data : null
}
