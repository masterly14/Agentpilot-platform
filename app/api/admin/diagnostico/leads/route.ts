import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { listDiagnosisLeads } from "@/lib/admin/diagnosis-leads"

export const runtime = "nodejs"

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()
  const leads = await listDiagnosisLeads()
  return NextResponse.json({ leads })
}
