"use client"

import type { ChatMessageRecord } from "@/lib/admin/chat-record"
import { ChatMediaBubble } from "@/components/admin/chat/chat-media-bubble"
import {
  ChatDeliveryTicks,
  ChatMessageBody,
  ChatTemplateBubble,
} from "@/components/admin/chat/chat-template-bubble"
import { cn } from "@/lib/utils"

const MEDIA_TYPES = new Set(["AUDIO", "IMAGE", "VIDEO", "DOCUMENT", "STICKER", "LOCATION"])

function formatTime(iso: string) {
  return new Date(iso)
    .toLocaleTimeString("es-CO", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Bogota",
    })
    .replace(/[\u00A0\u202F\u2009]/g, " ")
}

export function ChatMessageBubble({ message }: { message: ChatMessageRecord }) {
  const outbound = message.direction === "OUTBOUND"
  const isButton = message.type === "BUTTON" || message.type === "INTERACTIVE"

  return (
    <div className={cn("flex", outbound ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[min(100%,420px)] rounded-2xl px-3 py-2 shadow-sm",
          outbound
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground",
        )}
      >
        {isButton ? (
          <div className="space-y-1">
            <p className={cn("text-[10px] font-semibold uppercase tracking-wide", outbound ? "opacity-80" : "text-muted-foreground")}>
              Tocó
            </p>
            <p className="text-sm font-medium">{message.body || message.buttonId || "Botón"}</p>
          </div>
        ) : message.type === "TEMPLATE" ? (
          <ChatTemplateBubble message={message} />
        ) : MEDIA_TYPES.has(message.type) ? (
          <ChatMediaBubble message={message} inverted={outbound} />
        ) : message.body ? (
          <ChatMessageBody text={message.body} />
        ) : (
          <p className="text-sm opacity-80">Mensaje</p>
        )}

        <div className={cn("mt-1 flex items-center gap-1.5", outbound ? "justify-end" : "justify-start")}>
          <time className={cn("text-[10px]", outbound ? "text-primary-foreground/70" : "text-muted-foreground")}>
            {formatTime(message.createdAt)}
          </time>
          <ChatDeliveryTicks message={message} />
        </div>
      </div>
    </div>
  )
}
