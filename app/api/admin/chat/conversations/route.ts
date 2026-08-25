import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { listChatConversations } from "@/lib/admin/chat-record"

export const runtime = "nodejs"

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const conversations = await listChatConversations()
  return NextResponse.json({ conversations })
}
