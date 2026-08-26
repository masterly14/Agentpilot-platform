import { NextResponse } from "next/server"
import { Prisma } from "@/prisma/generated/client"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import {
  DIAGNOSIS_LIST_INCLUDE,
  resolveDiagnosisLead,
  toSavedDiagnosis,
} from "@/lib/admin/diagnosis-leads"
import { hydrateLeakMap, uniqueDiagnosisSlug } from "@/lib/admin/leak-map"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const rows = await prisma.operationalDiagnosis.findMany({
    orderBy: { updatedAt: "desc" },
    include: DIAGNOSIS_LIST_INCLUDE,
  })

  return NextResponse.json({ diagnoses: rows.map(toSavedDiagnosis) })
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = (await request.json()) as {
    id?: unknown
    state?: unknown
    submissionId?: unknown
    airbnbLeadId?: unknown
  }
  const state = hydrateLeakMap(body.state)
  const clientName = state.snapshot.cliente.trim()
  if (!clientName) {
    return NextResponse.json({ error: "Escribe el nombre del cliente antes de guardar." }, { status: 400 })
  }

  const id = typeof body.id === "string" && body.id ? body.id : null
  const submissionId = typeof body.submissionId === "string" && body.submissionId ? body.submissionId : null
  const airbnbLeadId = typeof body.airbnbLeadId === "string" && body.airbnbLeadId ? body.airbnbLeadId : null

  if (submissionId && airbnbLeadId) {
    return NextResponse.json({ error: "El diagnóstico solo puede ligarse a un lead." }, { status: 400 })
  }

  if (!id && !submissionId && !airbnbLeadId) {
    return NextResponse.json(
      { error: "Selecciona el lead de esta reunión antes de guardar." },
      { status: 400 },
    )
  }

  const lead = await resolveDiagnosisLead({ submissionId, airbnbLeadId })
  if ((submissionId || airbnbLeadId) && !lead) {
    return NextResponse.json({ error: "No se encontró ese lead." }, { status: 404 })
  }

  const payload = state as unknown as Prisma.InputJsonValue
  const meetingTime = lead?.meetingTime ? new Date(lead.meetingTime) : null
  const data = {
    clientName,
    payload,
    submissionId,
    airbnbLeadId,
    meetingTime,
  }

  try {
    const row = id
      ? await prisma.operationalDiagnosis.update({
          where: { id },
          data,
          include: DIAGNOSIS_LIST_INCLUDE,
        })
      : await prisma.operationalDiagnosis.create({
          data: {
            ...data,
            slug: uniqueDiagnosisSlug(clientName),
          },
          include: DIAGNOSIS_LIST_INCLUDE,
        })

    return NextResponse.json({ success: true, diagnosis: toSavedDiagnosis(row) })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "No se encontró ese diagnóstico." }, { status: 404 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const row = await prisma.operationalDiagnosis.create({
        data: {
          ...data,
          slug: uniqueDiagnosisSlug(`${clientName}-${Math.random().toString(36).slice(2, 6)}`),
        },
        include: DIAGNOSIS_LIST_INCLUDE,
      })
      return NextResponse.json({ success: true, diagnosis: toSavedDiagnosis(row) })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo guardar." },
      { status: 400 },
    )
  }
}
