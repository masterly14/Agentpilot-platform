import { redirect } from "next/navigation"
import { ChatWorkspace } from "@/components/admin/chat/chat-workspace"
import { getChatThread, listChatConversations } from "@/lib/admin/chat-record"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export const metadata = {
  title: "Chat | Panel interno",
}

export default async function AdminChatPage({
  searchParams,
}: {
  searchParams: Promise<{ contactId?: string }>
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const { contactId } = await searchParams
  const [conversations, thread] = await Promise.all([
    listChatConversations(),
    contactId ? getChatThread(contactId) : Promise.resolve(null),
  ])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatWorkspace
        initialConversations={conversations}
        initialThread={thread}
        initialContactId={contactId ?? null}
      />
    </div>
  )
}
