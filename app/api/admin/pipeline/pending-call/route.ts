import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { getLeadRecord } from "@/lib/admin/lead-record"
import { cancelPendingPipelineJobs } from "@/lib/pipeline/schedule"
import {
  findLatestSubmissionIdByContact,
  MARKETING_TRIGGERED_BY,
  recordMarketingStage,
} from "@/lib/marketing/events"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const body = (await request.json()) as { contactId?: unknown; submissionId?: unknown }
  let contactId = typeof body.contactId === "string" ? body.contactId : ""
  let submissionId = typeof body.submissionId === "string" ? body.submissionId : ""

  if (!contactId && submissionId) {
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
      select: { contactId: true },
    })
    contactId = submission?.contactId ?? ""
  }

  if (!submissionId && contactId) {
    submissionId = (await findLatestSubmissionIdByContact(contactId)) ?? ""
  }

  if (!submissionId) {
    return NextResponse.json({ error: "submissionId requerido" }, { status: 400 })
  }

  const moved = await recordMarketingStage({
    submissionId,
    to: "PENDING_CALL",
    triggeredBy: MARKETING_TRIGGERED_BY.admin,
  })
  if (moved?.submission.marketingFunnelStage !== "PENDING_CALL") {
    return NextResponse.json({ error: "No se pudo mover a pendiente por llamar" }, { status: 409 })
  }

  if (contactId) {
    const pipeline = await prisma.leadPipeline.findUnique({
      where: { contactId },
      select: { id: true },
    })
    if (pipeline) {
      await cancelPendingPipelineJobs(pipeline.id)
      await prisma.leadPipeline.update({
        where: { id: pipeline.id },
        data: {
          currentStage: "NURTURING",
          currentState: "COLD_CALL_QUEUED",
          meetingTime: null,
          meetingId: null,
          meetLink: null,
        },
      })
    }
  }

  const submission = await getLeadRecord(submissionId)
  return NextResponse.json({ success: true, submission })
}
