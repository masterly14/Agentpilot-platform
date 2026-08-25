import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { toLeadRecord } from "@/lib/admin/lead-record"
import { SubmissionsKanban } from "@/components/admin/submissions-kanban"

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const { lead } = await searchParams
  const submissions = await prisma.formSubmission.findMany({
    orderBy: { createdAt: "desc" },
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

  return (
    <div className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 md:px-8">
      <SubmissionsKanban
        initialSubmissions={submissions.map(toLeadRecord)}
        initialSelectedId={lead ?? null}
      />
    </div>
  )
}
