"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChatContactPanel } from "@/components/admin/chat/chat-contact-panel"
import { ChatConversationList } from "@/components/admin/chat/chat-conversation-list"
import { ChatThread } from "@/components/admin/chat/chat-thread"
import type { ChatConversationSummary, ChatThreadRecord } from "@/lib/admin/chat-record"

const POLL_MS = 8000

export function ChatWorkspace({
  initialConversations,
  initialThread,
  initialContactId,
}: {
  initialConversations: ChatConversationSummary[]
  initialThread: ChatThreadRecord | null
  initialContactId: string | null
}) {
  const router = useRouter()
  const [conversations, setConversations] = useState(initialConversations)
  const [thread, setThread] = useState(initialThread)
  const [selectedContactId, setSelectedContactId] = useState(initialContactId)

  const selectContact = useCallback(
    (contactId: string | null) => {
      setSelectedContactId(contactId)
      const href = contactId ? `/admin/chat?contactId=${contactId}` : "/admin/chat"
      router.replace(href, { scroll: false })
    },
    [router],
  )

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      try {
        const listResponse = await fetch("/api/admin/chat/conversations")
        if (!listResponse.ok) return
        const listJson = (await listResponse.json()) as { conversations?: ChatConversationSummary[] }
        if (!cancelled && Array.isArray(listJson.conversations)) {
          setConversations(listJson.conversations)
        }

        if (!selectedContactId) return
        const threadResponse = await fetch(`/api/admin/chat/conversations/${selectedContactId}`)
        if (!threadResponse.ok) {
          if (threadResponse.status === 404 && !cancelled) setThread(null)
          return
        }
        const nextThread = (await threadResponse.json()) as ChatThreadRecord
        if (!cancelled) setThread(nextThread)
      } catch {
        // El poll es best-effort; el primer paint ya trae datos del servidor.
      }
    }

    const interval = window.setInterval(() => {
      void refresh()
    }, POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [selectedContactId])

  useEffect(() => {
    if (!selectedContactId) {
      setThread(null)
      return
    }
    if (thread?.contact.contactId === selectedContactId) return

    let cancelled = false
    void fetch(`/api/admin/chat/conversations/${selectedContactId}`)
      .then(async (response) => {
        if (!response.ok) {
          if (!cancelled) setThread(null)
          return
        }
        const nextThread = (await response.json()) as ChatThreadRecord
        if (!cancelled) setThread(nextThread)
      })
      .catch(() => {
        if (!cancelled) setThread(null)
      })

    return () => {
      cancelled = true
    }
  }, [selectedContactId, thread?.contact.contactId])

  const showList = !selectedContactId
  const showThread = Boolean(selectedContactId)

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden border-t border-border md:border-t-0">
      <div className={showList ? "flex min-h-0 w-full md:w-80 md:shrink-0" : "hidden min-h-0 md:flex md:w-80 md:shrink-0"}>
        <ChatConversationList
          conversations={conversations}
          selectedContactId={selectedContactId}
          onSelect={selectContact}
        />
      </div>
      <div className={showThread || !showList ? "flex min-h-0 min-w-0 flex-1" : "hidden min-h-0 min-w-0 flex-1 md:flex"}>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ChatThread
            thread={thread}
            onBack={selectedContactId ? () => selectContact(null) : undefined}
          />
        </div>
        <ChatContactPanel contact={thread?.contact ?? null} />
      </div>
    </div>
  )
}
