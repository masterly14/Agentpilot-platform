"use client"

import { useState } from "react"
import { FileText, MapPin } from "lucide-react"
import type { ChatMessageRecord } from "@/lib/admin/chat-record"
import { ChatMessageBody } from "@/components/admin/chat/chat-template-bubble"

function mediaSrc(messageId: string) {
  return `/api/admin/chat/media/${messageId}`
}

function Unavailable({ label }: { label: string }) {
  return <p className="text-sm opacity-80">{label}</p>
}

export function ChatMediaBubble({
  message,
  inverted,
}: {
  message: ChatMessageRecord
  inverted?: boolean
}) {
  const [unavailable, setUnavailable] = useState(false)
  const caption = message.caption || (message.type !== "LOCATION" ? null : message.body)

  if (message.type === "AUDIO") {
    if (!message.hasMedia || unavailable) {
      return <Unavailable label="Audio no disponible" />
    }
    return (
      <audio
        controls
        className="w-full max-w-[260px]"
        preload="metadata"
        src={mediaSrc(message.id)}
        onError={() => setUnavailable(true)}
      >
        Tu navegador no reproduce audio.
      </audio>
    )
  }

  if (message.type === "IMAGE" || message.type === "STICKER") {
    if (!message.hasMedia || unavailable) {
      return (
        <div className="space-y-2">
          <Unavailable label="Adjunto no disponible" />
          {caption ? <ChatMessageBody text={caption} /> : null}
        </div>
      )
    }
    return (
      <div className="space-y-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaSrc(message.id)}
          alt={caption || "Imagen de WhatsApp"}
          className="max-h-64 max-w-full rounded-lg object-contain"
          onError={() => setUnavailable(true)}
        />
        {caption ? <ChatMessageBody text={caption} /> : null}
      </div>
    )
  }

  if (message.type === "VIDEO") {
    if (!message.hasMedia || unavailable) {
      return (
        <div className="space-y-2">
          <Unavailable label="Video no disponible" />
          {caption ? <ChatMessageBody text={caption} /> : null}
        </div>
      )
    }
    return (
      <div className="space-y-2">
        <video
          controls
          className="max-h-64 max-w-full rounded-lg"
          src={mediaSrc(message.id)}
          onError={() => setUnavailable(true)}
        />
        {caption ? <ChatMessageBody text={caption} /> : null}
      </div>
    )
  }

  if (message.type === "DOCUMENT") {
    if (!message.hasMedia || unavailable) {
      return <Unavailable label="Documento no disponible" />
    }
    return (
      <div className="space-y-2">
        <a
          href={mediaSrc(message.id)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-current/20 px-3 py-2 text-sm font-medium underline-offset-2 hover:underline"
        >
          <FileText className="size-4 shrink-0" />
          {message.mediaFilename || "Documento"}
        </a>
        {caption && caption !== message.mediaFilename ? <ChatMessageBody text={caption} /> : null}
      </div>
    )
  }

  if (message.type === "LOCATION") {
    const mapsQuery = encodeURIComponent(message.body || "")
    return (
      <div className="space-y-2">
        <div className="inline-flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0" />
          <span>{message.body || "Ubicación"}</span>
        </div>
        {message.body ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noreferrer"
            className={inverted ? "text-xs underline" : "text-xs text-primary underline"}
          >
            Abrir en Maps
          </a>
        ) : null}
      </div>
    )
  }

  return caption ? <ChatMessageBody text={caption} /> : null
}
