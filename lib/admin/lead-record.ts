import type { FormSubmission, LeadPipeline } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import { serializeSubmission, type SubmissionRecord } from "@/lib/submission-display"

type LeadWithPipeline = FormSubmission & {
  contact?: {
    pipeline?: Pick<LeadPipeline, "meetingTime" | "meetLink"> | null
  } | null
}

export function toLeadRecord(submission: LeadWithPipeline): SubmissionRecord {
  const { contact, ...fields } = submission
  return serializeSubmission({
    ...fields,
    meetingTime: contact?.pipeline?.meetingTime ?? null,
    meetLink: contact?.pipeline?.meetLink ?? null,
  }) as SubmissionRecord
}

export async function getLeadRecord(id: string): Promise<SubmissionRecord | null> {
  const submission = await prisma.formSubmission.findUnique({
    where: { id },
    include: {
      contact: {
        include: {
          pipeline: {
            select: { meetingTime: true, meetLink: true },
          },
        },
      },
    },
  })

  if (!submission) return null
  return toLeadRecord(submission)
}
