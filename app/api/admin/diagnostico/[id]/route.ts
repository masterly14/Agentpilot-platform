import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
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
    select: { payload: true },
  })

  if (!row) {
    return NextResponse.json({ error: "No se encontró ese diagnóstico." }, { status: 404 })
  }

  return NextResponse.json({ state: hydrateLeakMap(row.payload) })
}
