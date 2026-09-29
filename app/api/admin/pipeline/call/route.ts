import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { getLeadRecord } from "@/lib/admin/lead-record"
import type { CallOutcome } from "@/prisma/generated/client"

export const runtime = "nodejs"

const ACTION_OUTCOME: Record<string, CallOutcome> = {
  start: "CALLING",
  no_answer: "NO_ANSWER",
  answered: "ANSWERED",
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const body = (await request.json()) as { submissionId?: unknown; action?: unknown }
  const submissionId = typeof body.submissionId === "string" ? body.submissionId : ""
  const outcome = typeof body.action === "string" ? ACTION_OUTCOME[body.action] : undefined

  if (!submissionId || !outcome) {
    return NextResponse.json({ error: "submissionId y action requeridos" }, { status: 400 })
  }

  const exists = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    select: { id: true },
  })
  if (!exists) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
  }

  try {
    await prisma.leadCall.create({ data: { submissionId, outcome } })
  } catch (error) {
    console.error("[calls] no se pudo registrar la llamada", error)
    return NextResponse.json(
      { error: "No se pudo registrar la llamada. ¿Se aplicó la migración LeadCall?" },
      { status: 500 },
    )
  }

  const submission = await getLeadRecord(submissionId)
  return NextResponse.json({ success: true, submission })
}
