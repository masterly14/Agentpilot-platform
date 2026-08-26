"use client"

import { useMemo, useState } from "react"
import { formatMeetingLabel } from "@/components/admin/kanban-parts"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { DiagnosisLeadOption } from "@/lib/admin/diagnosis-leads"

type DiagnosticoLeadPickerProps = {
  open: boolean
  leads: DiagnosisLeadOption[]
  onOpenChange: (open: boolean) => void
  onSelect: (lead: DiagnosisLeadOption) => void
}

export function DiagnosticoLeadPicker({
  open,
  leads,
  onOpenChange,
  onSelect,
}: DiagnosticoLeadPickerProps) {
  const [query, setQuery] = useState("")

  const { withMeeting, others } = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = needle
      ? leads.filter((lead) =>
          [lead.clientName, lead.name, lead.subtitle].join(" ").toLowerCase().includes(needle),
        )
      : leads
    return {
      withMeeting: filtered.filter((lead) => lead.meetingTime),
      others: filtered.filter((lead) => !lead.meetingTime),
    }
  }, [leads, query])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setQuery("")
        onOpenChange(next)
      }}
    >
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Lead de esta reunión</DialogTitle>
          <DialogDescription>
            La plantilla queda ligada a este lead. Después puedes abrirla desde la lista de
            diagnósticos.
          </DialogDescription>
        </DialogHeader>
        <Command className="rounded-t-none border-t" shouldFilter={false}>
          <CommandInput
            placeholder="Buscar por nombre, empresa o correo…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-80">
            <CommandEmpty>No hay leads con ese nombre.</CommandEmpty>
            {withMeeting.length > 0 ? (
              <CommandGroup heading="Con reunión">
                {withMeeting.map((lead) => (
                  <LeadItem key={lead.key} lead={lead} onSelect={onSelect} />
                ))}
              </CommandGroup>
            ) : null}
            {others.length > 0 ? (
              <CommandGroup heading="Otros leads">
                {others.map((lead) => (
                  <LeadItem key={lead.key} lead={lead} onSelect={onSelect} />
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function LeadItem({
  lead,
  onSelect,
}: {
  lead: DiagnosisLeadOption
  onSelect: (lead: DiagnosisLeadOption) => void
}) {
  const meeting = formatMeetingLabel(lead.meetingTime)

  return (
    <CommandItem
      value={lead.key}
      onSelect={() => onSelect(lead)}
      className="items-start py-2.5"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{lead.clientName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {[lead.subtitle, meeting, lead.properties ? `${lead.properties} props` : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </CommandItem>
  )
}
