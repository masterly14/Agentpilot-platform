import type { FormSubmission, LeadPipeline } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import { serializeSubmission, type SubmissionRecord } from "@/lib/submission-display"

type LeadWithPipeline = FormSubmission & {
  contact?: {
    pipeline?: Pick<LeadPipeline, "meetingTime" | "meetLink" | "visitorTimezone" | "painPoint"> | null
  } | null
}

export function toLeadRecord(submission: LeadWithPipeline): SubmissionRecord {
  const { contact, ...fields } = submission
  return serializeSubmission({
    ...fields,
    meetingTime: contact?.pipeline?.meetingTime ?? null,
    meetLink: contact?.pipeline?.meetLink ?? null,
    visitorTimezone: contact?.pipeline?.visitorTimezone ?? null,
    painPoint: contact?.pipeline?.painPoint ?? null,
  }) as SubmissionRecord
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
  return toLeadRecord(submission)
}
