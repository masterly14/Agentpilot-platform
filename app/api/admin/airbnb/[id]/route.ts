import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const { id } = await params
  const existing = await prisma.airbnbLead.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
  }

  await prisma.airbnbLead.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
