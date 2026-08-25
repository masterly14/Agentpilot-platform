"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatMeetingLabel } from "@/components/admin/kanban-parts"
import {
  FUNNEL_ORIGIN_LABEL,
  PIPELINE_STAGE_LABEL,
  PIPELINE_STATE_LABEL,
  type ChatContactRecord,
} from "@/lib/admin/chat-record"
import { FUNNEL_STAGE_LABEL } from "@/lib/marketing/funnel-ui"

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="break-words font-medium">{value}</span>
    </div>
  )
}

export function ChatContactPanel({ contact }: { contact: ChatContactRecord | null }) {
  if (!contact) {
    return (
      <aside className="hidden h-full w-72 shrink-0 border-l border-border bg-card xl:block" />
    )
  }

  const meeting = formatMeetingLabel(contact.meetingTime)
  const funnelStage = contact.marketingFunnelStage
    ? FUNNEL_STAGE_LABEL[contact.marketingFunnelStage]
    : null

  return (
    <aside className="hidden h-full w-72 shrink-0 overflow-y-auto border-l border-border bg-card p-4 xl:block">
      <p className="text-sm font-semibold">{contact.fullName}</p>
      <p className="mt-1 text-xs text-muted-foreground">{contact.phoneE164}</p>

      <div className="mt-5 space-y-3">
        <Row label="Email" value={contact.email} />
        <Row label="Empresa" value={contact.companyName} />
        <Row
          label="Origen"
          value={contact.funnelOrigin ? FUNNEL_ORIGIN_LABEL[contact.funnelOrigin] : null}
        />
        <Row
          label="Pipeline"
          value={contact.currentStage ? PIPELINE_STAGE_LABEL[contact.currentStage] : null}
        />
        <Row
          label="Estado"
          value={contact.currentState ? PIPELINE_STATE_LABEL[contact.currentState] : null}
        />
        <Row label="Embudo" value={funnelStage} />
        <Row label="Reunión" value={meeting} />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {contact.meetLink ? (
          <Button asChild variant="outline" size="sm">
            <a href={contact.meetLink} target="_blank" rel="noreferrer">
              Abrir Meet
            </a>
          </Button>
        ) : null}
        <Button asChild size="sm">
          <Link href={contact.submissionId ? `/admin?lead=${contact.submissionId}` : "/admin"}>
            Ver en Pipeline
          </Link>
        </Button>
      </div>
    </aside>
  )
}
