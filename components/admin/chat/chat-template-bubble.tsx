"use client"

import type { ChatMessageRecord } from "@/lib/admin/chat-record"
import { PIPELINE_STATE_LABEL } from "@/lib/admin/chat-record"
import { cn } from "@/lib/utils"

const URL_RE = /(https?:\/\/[^\s]+)/g

export function ChatMessageBody({ text, className }: { text: string; className?: string }) {
  const parts = text.split(URL_RE)
  return (
    <p className={cn("whitespace-pre-wrap break-words text-sm leading-relaxed", className)}>
      {parts.map((part, index) =>
        part.startsWith("http") ? (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            {part}
          </a>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </p>
  )
}

export function ChatDeliveryTicks({ message }: { message: ChatMessageRecord }) {
  if (message.direction !== "OUTBOUND") return null

  const label =
    message.status === "FAILED"
      ? "Falló"
      : message.status === "READ"
        ? "Leído"
        : message.status === "DELIVERED"
          ? "Entregado"
          : message.status === "SENT"
            ? "Enviado"
            : "Pendiente"

  return (
    <span
      className={cn(
        "text-[10px] font-medium",
        message.status === "FAILED"
          ? "text-red-200"
          : message.status === "READ"
            ? "text-sky-200"
            : "text-primary-foreground/70",
      )}
      title={label}
    >
      {message.status === "FAILED" ? "!" : message.status === "PENDING" ? "…" : "✓"}
      {message.status === "DELIVERED" || message.status === "READ" ? "✓" : ""}
    </span>
  )
}

export function ChatTemplateBubble({ message }: { message: ChatMessageRecord }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
          Plantilla
        </span>
        {message.templateName ? (
          <span className="truncate text-[10px] text-primary-foreground/80">{message.templateName}</span>
        ) : null}
        {message.pipelineState ? (
          <span className="truncate text-[10px] text-primary-foreground/70">
            {PIPELINE_STATE_LABEL[message.pipelineState]}
          </span>
        ) : null}
      </div>
      {message.body ? <ChatMessageBody text={message.body} /> : null}
      {message.templateFooter ? (
        <p className="text-xs text-primary-foreground/70">{message.templateFooter}</p>
      ) : null}
      {message.templateButtons.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-white/20">
          {message.templateButtons.map((button) => (
            <div
              key={`${button.type}-${button.text}`}
              className="border-b border-white/15 px-3 py-2 text-center text-sm font-medium last:border-b-0"
            >
              {button.text}
            </div>
          ))}
        </div>
      ) : null}
      {message.status === "FAILED" && message.deliveryError ? (
        <p className="rounded-md bg-red-950/25 px-2 py-1 text-xs text-red-100">
          {message.deliveryError}
        </p>
      ) : null}
    </div>
  )
}
