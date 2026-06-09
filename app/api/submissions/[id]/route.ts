import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { serializeSubmission } from "@/lib/submission-display"
import type { SubmissionStatus } from "@/prisma/generated/client"
import { STATUS_COLUMNS } from "@/lib/submission-status"

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

  const submission = await prisma.formSubmission.update({
    where: { id },
    data: { status: body.status as SubmissionStatus },
  })

  return NextResponse.json({ submission: serializeSubmission(submission) })
}
