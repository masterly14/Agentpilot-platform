import type { FormSubmission, LeadPipeline } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import { serializeSubmission, type SubmissionRecord } from "@/lib/submission-display"
import { EMPTY_CALL_SUMMARY, getCallSummaries, type CallSummary } from "@/lib/admin/call-summary"

type LeadWithPipeline = FormSubmission & {
  contact?: {
    pipeline?: Pick<LeadPipeline, "meetingTime" | "meetLink" | "visitorTimezone" | "painPoint"> | null
  } | null
}

export function toLeadRecord(
  submission: LeadWithPipeline,
  calls: CallSummary = EMPTY_CALL_SUMMARY,
): SubmissionRecord {
  const { contact, ...fields } = submission
  return serializeSubmission({
    ...fields,
    meetingTime: contact?.pipeline?.meetingTime ?? null,
    meetLink: contact?.pipeline?.meetLink ?? null,
    visitorTimezone: contact?.pipeline?.visitorTimezone ?? null,
    painPoint: contact?.pipeline?.painPoint ?? null,
    ...calls,
  }) as SubmissionRecord
}

export async function toLeadRecords(submissions: LeadWithPipeline[]): Promise<SubmissionRecord[]> {
  const summaries = await getCallSummaries(submissions.map((submission) => submission.id))
  return submissions.map((submission) => toLeadRecord(submission, summaries.get(submission.id)))
}

export async function getLeadRecord(id: string): Promise<SubmissionRecord | null> {
  const submission = await prisma.formSubmission.findUnique({
    where: { id },
    include: {
      contact: {
        include: {
          pipeline: {
            select: { meetingTime: true, meetLink: true, visitorTimezone: true, painPoint: true },
          },
        },
      },
    },
  })

  if (!submission) return null
  const summaries = await getCallSummaries([id])
  return toLeadRecord(submission, summaries.get(id))
}
