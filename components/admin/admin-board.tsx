"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AirbnbKanban } from "@/components/admin/airbnb-kanban"
import { SubmissionsKanban } from "@/components/admin/submissions-kanban"
import type { AirbnbLeadRecord } from "@/lib/admin/airbnb-lead-record"
import { AIRBNB_STAGE_LABEL } from "@/lib/admin/airbnb-funnel"
import type { SubmissionRecord } from "@/lib/submission-display"
import { FUNNEL_STAGE_LABEL, hasInboxContact, isInboxLead } from "@/lib/marketing/funnel-ui"
import { getSubmissionTitle } from "@/lib/submission-display"
import { cn } from "@/lib/utils"

export type AdminBoardId = "inbound" | "mql" | "airbnb" | "all"

const BOARDS: Array<{ id: AdminBoardId; label: string }> = [
  { id: "inbound", label: "Inbound" },
  { id: "mql", label: "MQL" },
  { id: "airbnb", label: "Airbnb" },
  { id: "all", label: "Todo" },
]

type UnifiedRow = {
  id: string
  origin: "inbound" | "airbnb"
  title: string
  subtitle: string
  stage: string
  updatedAt: string
}

function inboundStage(submission: SubmissionRecord) {
  if (submission.marketingFunnelStage) return FUNNEL_STAGE_LABEL[submission.marketingFunnelStage]
  return submission.status === "PARTIAL" ? "Bandeja" : "Sin etapa"
}

function boardHref(input: {
  board: AdminBoardId
  leadId?: string | null
  airbnbLeadId?: string | null
}) {
  const params = new URLSearchParams()
  if (input.board !== "inbound") params.set("board", input.board)
  if (input.board === "inbound" && input.leadId) params.set("lead", input.leadId)
  if (input.board === "airbnb" && input.airbnbLeadId) params.set("airbnbLead", input.airbnbLeadId)
  const search = params.toString()
  return search ? `/admin?${search}` : "/admin"
}

type AdminBoardProps = {
  submissions: SubmissionRecord[]
  airbnbLeads: AirbnbLeadRecord[]
  initialBoard: AdminBoardId
  initialLeadId?: string | null
  initialAirbnbLeadId?: string | null
}

export function AdminBoard({
  submissions,
  airbnbLeads,
  initialBoard,
  initialLeadId = null,
  initialAirbnbLeadId = null,
}: AdminBoardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [board, setBoard] = useState<AdminBoardId>(initialBoard)
  const [query, setQuery] = useState("")
  const [inboundSelectedId, setInboundSelectedId] = useState(initialLeadId)
  const [airbnbSelectedId, setAirbnbSelectedId] = useState(initialAirbnbLeadId)

  useEffect(() => {
    setBoard(initialBoard)
    setInboundSelectedId(initialLeadId)
    setAirbnbSelectedId(initialAirbnbLeadId)
  }, [initialBoard, initialLeadId, initialAirbnbLeadId])

  function syncUrl(next: {
    board?: AdminBoardId
    leadId?: string | null
    airbnbLeadId?: string | null
  }) {
    const nextBoard = next.board ?? board
    const leadId = next.leadId === undefined ? inboundSelectedId : next.leadId
    const airbnbLeadId = next.airbnbLeadId === undefined ? airbnbSelectedId : next.airbnbLeadId
    const href = boardHref({ board: nextBoard, leadId, airbnbLeadId })
    const current = `${pathname}${window.location.search}`
    if (href === current) return
    router.replace(href, { scroll: false })
  }

  const rows = useMemo<UnifiedRow[]>(() => {
    const inbound = submissions
      .filter((submission) => !isInboxLead(submission) || hasInboxContact(submission))
      .map((submission) => ({
      id: submission.id,
      origin: "inbound" as const,
      title: getSubmissionTitle(submission),
      subtitle: submission.email || submission.companyName || "Inbound",
      stage: inboundStage(submission),
      updatedAt: submission.updatedAt,
    }))
    const airbnb = airbnbLeads.map((lead) => ({
      id: lead.id,
      origin: "airbnb" as const,
      title: lead.name,
      subtitle: [lead.market, lead.hostEmail, `${lead.totalProperties} props`].filter(Boolean).join(" · "),
      stage: lead.stage ? AIRBNB_STAGE_LABEL[lead.stage] : lead.status === "REPLIED_IN_PROGRESS" ? "En conversación" : lead.status,
      updatedAt: lead.updatedAt,
    }))
    return [...inbound, ...airbnb].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }, [airbnbLeads, submissions])

  const visibleRows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter(
      (row) =>
        row.title.toLowerCase().includes(needle) ||
        row.subtitle.toLowerCase().includes(needle) ||
        row.stage.toLowerCase().includes(needle),
    )
  }, [query, rows])

  function openRow(row: UnifiedRow) {
    if (row.origin === "inbound") {
      setInboundSelectedId(row.id)
      setBoard("inbound")
      syncUrl({ board: "inbound", leadId: row.id, airbnbLeadId: null })
      return
    }
    setAirbnbSelectedId(row.id)
    setBoard("airbnb")
    syncUrl({ board: "airbnb", leadId: null, airbnbLeadId: row.id })
  }

  const subtitle =
    board === "airbnb"
      ? "Handoff, Meet a mano, show-up y cierre. La cadencia sigue en prospección."
      : board === "all"
        ? "Busca inbound y Airbnb. Al abrir un lead vas al tablero de su origen."
        : "Confirma show-up y cierres. Las primeras columnas se mueven solas."

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-4 flex shrink-0 flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BOARDS.map((item) => (
              <Link
                key={item.id}
                href={boardHref({
                  board: item.id,
                  leadId: inboundSelectedId,
                  airbnbLeadId: airbnbSelectedId,
                })}
                scroll={false}
                onClick={() => setBoard(item.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  board === item.id
                    ? "bg-white text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-white/70 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {board === "inbound" || board === "mql" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <SubmissionsKanban
          initialSubmissions={submissions}
          initialFilter={board === "mql" ? "MQL" : "all"}
          initialSelectedId={inboundSelectedId}
          onSelectedIdChange={(id) => {
            setInboundSelectedId(id)
            syncUrl({ board, leadId: id, airbnbLeadId: null })
          }}
          showTitle={false}
        />
        </div>
      ) : null}

      {board === "airbnb" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AirbnbKanban
          initialLeads={airbnbLeads}
          initialSelectedId={airbnbSelectedId}
          onSelectedIdChange={(id) => {
            setAirbnbSelectedId(id)
            syncUrl({ board: "airbnb", leadId: null, airbnbLeadId: id })
          }}
        />
        </div>
      ) : null}

      {board === "all" ? (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, correo, mercado o etapa"
            className="max-w-md bg-white"
          />
          <div className="overflow-hidden rounded-2xl border bg-white">
            {visibleRows.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">Sin coincidencias.</p>
            ) : (
              <ul className="divide-y">
                {visibleRows.map((row) => (
                  <li key={`${row.origin}-${row.id}`}>
                    <button
                      type="button"
                      onClick={() => openRow(row)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50"
                    >
                      <Badge variant="secondary" className="rounded-full shrink-0">
                        {row.origin === "airbnb" ? "Airbnb" : "Inbound"}
                      </Badge>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{row.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{row.subtitle}</span>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{row.stage}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
