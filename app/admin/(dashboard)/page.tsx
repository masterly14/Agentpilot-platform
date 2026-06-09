import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { serializeSubmission } from "@/lib/submission-display"
import { SubmissionsKanban } from "@/components/admin/submissions-kanban"

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const submissions = await prisma.formSubmission.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <SubmissionsKanban
      initialSubmissions={submissions.map(serializeSubmission)}
    />
  )
}
