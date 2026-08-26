import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { DIAGNOSIS_LIST_INCLUDE, toSavedDiagnosis } from "@/lib/admin/diagnosis-leads"
import { hydrateLeakMap } from "@/lib/admin/leak-map"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const { id } = await params
  const row = await prisma.operationalDiagnosis.findUnique({
    where: { id },
    include: DIAGNOSIS_LIST_INCLUDE,
  })

  if (!row) {
    return NextResponse.json({ error: "No se encontró ese diagnóstico." }, { status: 404 })
  }

  return NextResponse.json({
    state: hydrateLeakMap(row.payload),
    diagnosis: toSavedDiagnosis(row),
  })
}
