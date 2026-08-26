import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { discardAfterDiscovery } from "@/lib/pipeline/engine"
import { getLeadRecord } from "@/lib/admin/lead-record"
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

  if (contactId) {
    try {
      await discardAfterDiscovery(contactId)
    } catch (error) {
      console.warn("[pipeline] discard sin pipeline WhatsApp", contactId, error)
    }
  }

  await recordMarketingStage({
    submissionId,
    to: "DISCARDED",
    triggeredBy: MARKETING_TRIGGERED_BY.admin,
  })

  const submission = await getLeadRecord(submissionId)
  return NextResponse.json({ success: true, submission })
}
