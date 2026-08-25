"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  FUNNEL_ORIGIN_LABEL,
  PIPELINE_STATE_LABEL,
  type ChatConversationSummary,
} from "@/lib/admin/chat-record"
import { cn } from "@/lib/utils"

function formatListTime(iso: string | null) {
  if (!iso) return ""
  return new Date(iso)
    .toLocaleString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Bogota",
    })
    .replace(/[\u00A0\u202F\u2009]/g, " ")
}

export function ChatConversationList({
  conversations,
  selectedContactId,
  onSelect,
}: {
  conversations: ChatConversationSummary[]
  selectedContactId: string | null
  onSelect: (contactId: string) => void
}) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return conversations
    return conversations.filter((conversation) => {
      return (
        conversation.fullName.toLowerCase().includes(needle) ||
        conversation.phoneE164.toLowerCase().includes(needle)
      )
    })
  }, [conversations, query])

  return (
    <div className="flex h-full min-h-0 w-full flex-col border-r border-border bg-card">
      <div className="border-b border-border p-3">
        <p className="mb-2 text-sm font-semibold">Conversaciones</p>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar nombre o teléfono"
            className="h-9 pl-8"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {conversations.length === 0 ? "Aún no hay chats de WhatsApp." : "Sin resultados."}
          </p>
        ) : (
          filtered.map((conversation) => {
            const selected = conversation.contactId === selectedContactId
            const inboundLast = conversation.lastDirection === "INBOUND"
            return (
              <button
                key={conversation.conversationId}
                type="button"
                onClick={() => onSelect(conversation.contactId)}
                className={cn(
                  "flex w-full flex-col gap-1 border-b border-border px-3 py-3 text-left transition-colors",
                  selected ? "bg-sidebar-accent" : "hover:bg-muted/70",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={cn("truncate text-sm", inboundLast ? "font-semibold" : "font-medium")}>
                    {conversation.fullName}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {formatListTime(conversation.lastMessageAt)}
                  </span>
                </div>
                <p className={cn("line-clamp-2 text-xs", inboundLast ? "text-foreground" : "text-muted-foreground")}>
                  {conversation.lastMessagePreview}
                </p>
                <div className="flex items-center gap-1.5">
                  {inboundLast ? (
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                  ) : null}
                  {conversation.funnelOrigin ? (
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {FUNNEL_ORIGIN_LABEL[conversation.funnelOrigin]}
                    </span>
                  ) : null}
                  {conversation.currentState ? (
                    <span className="truncate text-[10px] text-muted-foreground">
                      · {PIPELINE_STATE_LABEL[conversation.currentState]}
                    </span>
                  ) : null}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
