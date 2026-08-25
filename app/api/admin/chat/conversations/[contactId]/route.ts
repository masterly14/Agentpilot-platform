import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { getChatThread } from "@/lib/admin/chat-record"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  context: { params: Promise<{ contactId: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const { contactId } = await context.params
  if (!contactId) {
    return NextResponse.json({ error: "contactId requerido" }, { status: 400 })
  }

  const thread = await getChatThread(contactId)
  if (!thread) {
    return NextResponse.json({ error: "Conversación no encontrada" }, { status: 404 })
  }

  return NextResponse.json(thread)
}
