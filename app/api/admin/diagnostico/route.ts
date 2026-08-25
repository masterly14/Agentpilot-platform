import { NextResponse } from "next/server"
import { Prisma } from "@/prisma/generated/client"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import {
  diagnosisSlug,
  hydrateLeakMap,
  type SavedDiagnosis,
} from "@/lib/admin/leak-map"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

function toSaved(row: { id: string; clientName: string; updatedAt: Date }): SavedDiagnosis {
  return {
    id: row.id,
    clientName: row.clientName,
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const rows = await prisma.operationalDiagnosis.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, clientName: true, updatedAt: true },
  })

  return NextResponse.json({ diagnoses: rows.map(toSaved) })
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = (await request.json()) as { id?: unknown; state?: unknown }
  const state = hydrateLeakMap(body.state)
  const clientName = state.snapshot.cliente.trim()
  if (!clientName) {
    return NextResponse.json({ error: "Escribe el nombre del cliente antes de guardar." }, { status: 400 })
  }

  const slug = diagnosisSlug(clientName)
  if (!slug) {
    return NextResponse.json({ error: "El nombre del cliente no es válido." }, { status: 400 })
  }

  const id = typeof body.id === "string" && body.id ? body.id : null
  const payload = state as unknown as Prisma.InputJsonValue

  try {
    const row = id
      ? await prisma.operationalDiagnosis.update({
          where: { id },
          data: { slug, clientName, payload },
          select: { id: true, clientName: true, updatedAt: true },
        })
      : await prisma.operationalDiagnosis.upsert({
          where: { slug },
          create: { slug, clientName, payload },
          update: { clientName, payload },
          select: { id: true, clientName: true, updatedAt: true },
        })

    return NextResponse.json({ success: true, diagnosis: toSaved(row) })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "No se encontró ese diagnóstico." }, { status: 404 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const row = await prisma.operationalDiagnosis.update({
        where: { slug },
        data: { clientName, payload },
        select: { id: true, clientName: true, updatedAt: true },
      })
      return NextResponse.json({ success: true, diagnosis: toSaved(row) })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo guardar." },
      { status: 400 },
    )
  }
}
