import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { listAirbnbQueue } from "@/lib/admin/airbnb-lead-record"
import { toLeadRecord } from "@/lib/admin/lead-record"
import { AdminBoard, type AdminBoardId } from "@/components/admin/admin-board"

function parseBoard(value: string | undefined, hasAirbnbLead: boolean): AdminBoardId {
  if (value === "airbnb" || value === "all" || value === "inbound") return value
  if (hasAirbnbLead) return "airbnb"
  return "inbound"
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string; board?: string; airbnbLead?: string }>
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const { lead, board, airbnbLead } = await searchParams
  const [submissions, airbnbLeads] = await Promise.all([
    prisma.formSubmission.findMany({
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
    }),
    listAirbnbQueue(),
  ])

  return (
    <div className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 md:px-8">
      <AdminBoard
        submissions={submissions.map(toLeadRecord)}
        airbnbLeads={airbnbLeads}
        initialBoard={parseBoard(board, Boolean(airbnbLead))}
        initialLeadId={lead ?? null}
        initialAirbnbLeadId={airbnbLead ?? null}
      />
    </div>
  )
}
