import { redirect } from "next/navigation"
import { MapaDeFugas } from "@/components/admin/mapa-de-fugas"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { DIAGNOSIS_LIST_INCLUDE, listDiagnosisLeads, toSavedDiagnosis } from "@/lib/admin/diagnosis-leads"
import { todayBogotaDate } from "@/lib/admin/leak-map"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Diagnóstico operativo | Panel interno",
}

export default async function AdminDiagnosticoPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const [rows, leads] = await Promise.all([
    prisma.operationalDiagnosis.findMany({
      orderBy: { updatedAt: "desc" },
      include: DIAGNOSIS_LIST_INCLUDE,
    }),
    listDiagnosisLeads(),
  ])

  return (
    <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth print:overflow-visible print:bg-white" style={{ background: "#F6F7F4" }}>
      <MapaDeFugas
        initialFecha={todayBogotaDate()}
        initialSaved={rows.map(toSavedDiagnosis)}
        initialLeads={leads}
      />
    </div>
  )
}
