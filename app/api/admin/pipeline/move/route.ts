import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { getLeadRecord } from "@/lib/admin/lead-record"
import { cancelPendingPipelineJobs } from "@/lib/pipeline/schedule"
import { canDropOnFunnelStage, FUNNEL_COLUMNS } from "@/lib/marketing/funnel-ui"
import { MARKETING_TRIGGERED_BY, recordMarketingStage } from "@/lib/marketing/events"
import type { MarketingFunnelStage } from "@/prisma/generated/client"

export const runtime = "nodejs"

/** Etapas que piden datos extra (valor del contrato, reunión) y tienen su propio flujo. */
const DEDICATED_FLOW: MarketingFunnelStage[] = ["PURCHASED", "DEMO_SCHEDULED"]

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const body = (await request.json()) as { submissionId?: unknown; to?: unknown }
  const submissionId = typeof body.submissionId === "string" ? body.submissionId : ""
  const to = FUNNEL_COLUMNS.find((column) => column.id === body.to)?.id

  if (!submissionId || !to) {
    return NextResponse.json({ error: "submissionId y to requeridos" }, { status: 400 })
  }
  if (DEDICATED_FLOW.includes(to)) {
    return NextResponse.json({ error: "Esta etapa tiene su propio flujo" }, { status: 400 })
  }

  const current = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    select: { marketingFunnelStage: true, contactId: true },
  })
  if (!current) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
  }
  if (current.marketingFunnelStage && !canDropOnFunnelStage(current.marketingFunnelStage, to)) {
    return NextResponse.json({ error: "Movimiento no permitido" }, { status: 409 })
  }

  // Si avanza en el embudo se envía el evento a Meta; si retrocede, solo se mueve la tarjeta.
  await recordMarketingStage({
    submissionId,
    to,
    triggeredBy: MARKETING_TRIGGERED_BY.admin,
  })
  await prisma.formSubmission.update({
    where: { id: submissionId },
    data: { marketingFunnelStage: to },
  })

  if (current.contactId) {
    const pipeline = await prisma.leadPipeline.findUnique({
      where: { contactId: current.contactId },
      select: { id: true },
    })
    if (pipeline) await cancelPendingPipelineJobs(pipeline.id)
  }

  const submission = await getLeadRecord(submissionId)
  return NextResponse.json({ success: true, submission })
}
