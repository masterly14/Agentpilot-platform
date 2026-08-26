"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatMeetingLabel, LeadStageActions } from "@/components/admin/kanban-parts"
import {
  MeetingRescheduleForm,
  type MeetingReschedulePayload,
} from "@/components/admin/meeting-reschedule-form"
import { FUNNEL_STAGE_LABEL } from "@/lib/marketing/funnel-ui"
import {
  getSubmissionDetails,
  getSubmissionSummary,
  getSubmissionTitle,
} from "@/lib/submission-display"
import type { SubmissionRecord } from "@/lib/submission-display"

type SubmissionDetailSheetProps = {
  submission: SubmissionRecord | null
  open: boolean
  isUpdating: boolean
  onOpenChange: (open: boolean) => void
  onShowUp: () => void
  onNoShow: () => void
  onCloseDeal: () => void
  onScheduleDemo?: () => void
  onDiscard?: () => void
  onReschedule: (payload: MeetingReschedulePayload) => Promise<void>
}

export function SubmissionDetailSheet({
  submission,
  open,
  isUpdating,
  onOpenChange,
  onShowUp,
  onNoShow,
  onCloseDeal,
  onScheduleDemo,
  onDiscard,
  onReschedule,
}: SubmissionDetailSheetProps) {
  if (!submission) return null

  const details = getSubmissionDetails(submission)
  const meeting = formatMeetingLabel(submission.meetingTime || submission.bookedAt)
  const stageLabel = submission.marketingFunnelStage
    ? FUNNEL_STAGE_LABEL[submission.marketingFunnelStage]
    : "Bandeja"
  const canReschedule =
    Boolean(submission.contactId) &&
    submission.marketingFunnelStage !== "PURCHASED" &&
    (submission.marketingFunnelStage === "SCHEDULED" ||
      submission.marketingFunnelStage === "NO_SHOW" ||
      submission.marketingFunnelStage === "SHOWED_UP" ||
      submission.marketingFunnelStage === "DEMO_SCHEDULED" ||
      Boolean(submission.meetingTime))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{getSubmissionTitle(submission)}</SheetTitle>
          <SheetDescription>
            {stageLabel}
            {meeting ? ` · ${meeting}` : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-1">
          <LeadStageActions
            submission={submission}
            disabled={isUpdating}
            onShowUp={onShowUp}
            onNoShow={onNoShow}
            onCloseDeal={onCloseDeal}
            onScheduleDemo={onScheduleDemo}
            onDiscard={onDiscard}
          />

          {canReschedule ? (
            <MeetingRescheduleForm
              meetingTime={submission.meetingTime || submission.bookedAt}
              meetLink={submission.meetLink}
              visitorTimezone={submission.visitorTimezone}
              disabled={isUpdating}
              saving={isUpdating}
              onSubmit={onReschedule}
            />
          ) : null}

          {submission.meetLink ? (
            <Button asChild variant="outline" size="sm">
              <a href={submission.meetLink} target="_blank" rel="noreferrer">
                Abrir Meet
              </a>
            </Button>
          ) : null}

          <div className="space-y-3">
            {details.map((detail) => (
              <div key={detail.label} className="grid grid-cols-[120px_1fr] gap-3 text-sm">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className="break-words font-medium">{detail.value}</span>
              </div>
            ))}
          </div>

          {submission.contractValueUsd ? (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              Contrato · ${Number(submission.contractValueUsd).toLocaleString("en-US")} USD
            </div>
          ) : null}

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Resumen
            </p>
            <p className="rounded-xl border bg-muted/50 p-3 text-sm leading-relaxed">
              {getSubmissionSummary(submission)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {submission.contactId ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/chat?contactId=${submission.contactId}`}>Ver chat</Link>
              </Button>
            ) : null}
            {submission.email && (
              <Button asChild variant="outline" size="sm">
                <a href={`mailto:${submission.email}`}>Enviar correo</a>
              </Button>
            )}
            <Badge variant="secondary">ID {submission.id.slice(0, 8)}</Badge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
