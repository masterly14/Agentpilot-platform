"use client"

import { useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatMessageBubble } from "@/components/admin/chat/chat-message-bubble"
import type { ChatMessageRecord, ChatThreadRecord } from "@/lib/admin/chat-record"

function bogotaDayKey(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
}

function formatDayHeading(iso: string) {
  const key = bogotaDayKey(iso)
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = yesterdayDate.toLocaleDateString("en-CA", { timeZone: "America/Bogota" })

  if (key === today) return "Hoy"
  if (key === yesterday) return "Ayer"
  return new Date(iso)
    .toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "America/Bogota",
    })
    .replace(/[\u00A0\u202F\u2009]/g, " ")
}

export function ChatThread({
  thread,
  onBack,
}: {
  thread: ChatThreadRecord | null
  onBack?: () => void
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const groups = useMemo(() => {
    if (!thread) return []
    const next: Array<{ label: string; messages: ChatMessageRecord[] }> = []
    for (const message of thread.messages) {
      const label = formatDayHeading(message.createdAt)
      const last = next[next.length - 1]
      if (!last || last.label !== label) {
        next.push({ label, messages: [message] })
      } else {
        last.messages.push(message)
      }
    }
    return next
  }, [thread])

  useEffect(() => {
    const node = scrollerRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [thread?.contact.contactId, thread?.messages.length])

  if (!thread) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center bg-[#f2f3f3] px-6 text-center text-sm text-muted-foreground">
        Selecciona una conversación para ver el historial.
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[#f7f7f7]">
      <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-3">
        {onBack ? (
          <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
            <ArrowLeft className="size-4" />
            <span className="sr-only">Volver</span>
          </Button>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{thread.contact.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{thread.contact.phoneE164}</p>
        </div>
        {thread.contact.submissionId ? (
          <Button asChild variant="outline" size="sm" className="xl:hidden">
            <Link href={`/admin?lead=${thread.contact.submissionId}`}>Pipeline</Link>
          </Button>
        ) : null}
      </div>

      <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {thread.messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Sin mensajes todavía.</p>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {groups.map((group) => (
              <section key={group.label} className="space-y-3">
                <p className="sticky top-0 z-10 mx-auto w-fit rounded-full bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
                  {group.label}
                </p>
                {group.messages.map((message) => (
                  <ChatMessageBubble key={message.id} message={message} />
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
