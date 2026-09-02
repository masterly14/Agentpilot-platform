import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import type { SubmissionStatus } from "@/prisma/generated/client"
import { STATUS_COLUMNS } from "@/lib/submission-status"
import { getLeadRecord } from "@/lib/admin/lead-record"
import { isContractPlan } from "@/lib/marketing/types"
import { MARKETING_TRIGGERED_BY, recordMarketingStage } from "@/lib/marketing/events"

const VALID_STATUSES = new Set(STATUS_COLUMNS.map((column) => column.id))

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const { id } = await params
  const body = await request.json()

  if (!body.status || !VALID_STATUSES.has(body.status as SubmissionStatus)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
  }

  const status = body.status as SubmissionStatus
  const contractValueUsd =
    body.contractValueUsd != null ? Number(body.contractValueUsd) : undefined
  const contractPlan = isContractPlan(body.contractPlan) ? body.contractPlan : undefined

  if (status === "CLOSED_WON") {
    if (!Number.isFinite(contractValueUsd) || (contractValueUsd ?? 0) <= 0) {
      return NextResponse.json(
        { error: "Monto del contrato en USD requerido" },
        { status: 400 },
      )
    }
  }

  await prisma.formSubmission.update({
    where: { id },
    data: {
      status,
      ...(status === "CLOSED_WON"
        ? {
            contractValueUsd,
            ...(contractPlan ? { contractPlan } : {}),
          }
        : {}),
    },
  })

  if (status === "CLOSED_WON") {
    await recordMarketingStage({
      submissionId: id,
      to: "PURCHASED",
      triggeredBy: MARKETING_TRIGGERED_BY.admin,
      contractValueUsd,
      contractPlan,
    })
  }

  const submission = await getLeadRecord(id)
  return NextResponse.json({ submission })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const { id } = await params
  const existing = await prisma.formSubmission.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
  }

  await prisma.formSubmission.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
