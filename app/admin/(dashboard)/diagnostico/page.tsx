import { redirect } from "next/navigation"
import { MapaDeFugas } from "@/components/admin/mapa-de-fugas"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { todayBogotaDate } from "@/lib/admin/leak-map"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Mapa de fugas | Panel interno",
}

export default async function AdminDiagnosticoPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const rows = await prisma.operationalDiagnosis.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, clientName: true, updatedAt: true },
  })

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <MapaDeFugas
          initialFecha={todayBogotaDate()}
          initialSaved={rows.map((row) => ({
            id: row.id,
            clientName: row.clientName,
            updatedAt: row.updatedAt.toISOString(),
          }))}
        />
      </div>
    </div>
  )
}
