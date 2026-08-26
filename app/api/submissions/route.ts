import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { toLeadRecord } from "@/lib/admin/lead-record"

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const submissions = await prisma.formSubmission.findMany({
    orderBy: { createdAt: "desc" },
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

  return NextResponse.json({
    submissions: submissions.map(toLeadRecord),
  })
}
