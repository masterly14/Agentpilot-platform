import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { serializeSubmission } from "@/lib/submission-display"

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const submissions = await prisma.formSubmission.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    submissions: submissions.map(serializeSubmission),
  })
}
