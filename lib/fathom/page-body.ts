import { recordingToken, type FathomMeeting } from "@/lib/fathom/payload"

const TRANSCRIPT_CHAR_LIMIT = 80_000
const TITLE_MAX = 240
const TIMEZONE = "America/Bogota"

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatBogotaDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}

function formatBogotaDateTime(iso: string | null | undefined) {
  if (!iso) return "—"
  try {
    return new Intl.DateTimeFormat("es-CO", {
      timeZone: TIMEZONE,
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function sanitizeTitle(value: string) {
  return value.replace(/[<>[\]\r\n]+/g, " ").replace(/\s+/g, " ").trim()
}

export function meetingPageTitle(meeting: FathomMeeting, suffix?: string) {
  const date = formatBogotaDate(meeting.recording_start_time || meeting.created_at)
  const name = sanitizeTitle(meeting.meeting_title || meeting.title) || "Reunión"
  const base = `${date} ${name}`
  const withSuffix = suffix ? `${base} · ${suffix}` : base
  if (withSuffix.length <= TITLE_MAX) return withSuffix
  return `${withSuffix.slice(0, TITLE_MAX - 1).trim()}…`
}

function inlineMarkdown(text: string) {
  const links: string[] = []
  const withPlaceholders = text.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (_, label: string, href: string) => {
    const index = links.length
    links.push(`<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
    return `\u0000L${index}\u0000`
  })
  let html = escapeHtml(withPlaceholders)
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")
  return html.replace(/\u0000L(\d+)\u0000/g, (_, index: string) => links[Number(index)] ?? "")
}

export function markdownToStorage(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  const blocks: string[] = []
  let listItems: string[] = []
  let listTag: "ul" | "ol" | null = null

  const flushList = () => {
    if (!listTag || listItems.length === 0) {
      listItems = []
      listTag = null
      return
    }
    blocks.push(`<${listTag}>${listItems.join("")}</${listTag}>`)
    listItems = []
    listTag = null
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    const unordered = line.match(/^[-*]\s+(.+)$/)
    const ordered = line.match(/^\d+\.\s+(.+)$/)

    if (heading) {
      flushList()
      const level = Math.min(heading[1].length + 1, 4)
      blocks.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`)
      continue
    }
    if (unordered) {
      if (listTag !== "ul") flushList()
      listTag = "ul"
      listItems.push(`<li>${inlineMarkdown(unordered[1])}</li>`)
      continue
    }
    if (ordered) {
      if (listTag !== "ol") flushList()
      listTag = "ol"
      listItems.push(`<li>${inlineMarkdown(ordered[1])}</li>`)
      continue
    }
    flushList()
    if (!line.trim()) continue
    blocks.push(`<p>${inlineMarkdown(line.trim())}</p>`)
  }
  flushList()
  return blocks.join("") || "<p>—</p>"
}

function metaRow(label: string, value: string) {
  return `<tr><th>${escapeHtml(label)}</th><td>${value}</td></tr>`
}

function linkCell(href: string | null | undefined, label: string) {
  if (!href) return "—"
  return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`
}

function attendeesHtml(meeting: FathomMeeting) {
  if (!meeting.calendar_invitees.length) return "<p>Sin invitados de calendario.</p>"
  const rows = meeting.calendar_invitees
    .map((invitee) => {
      const name = invitee.name || invitee.matched_speaker_display_name || invitee.email || "Sin nombre"
      const kind = invitee.is_external ? "Externo" : "Interno"
      return `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(invitee.email || "—")}</td><td>${kind}</td></tr>`
    })
    .join("")
  return `<table><tbody><tr><th>Nombre</th><th>Email</th><th>Tipo</th></tr>${rows}</tbody></table>`
}

function actionItemsHtml(meeting: FathomMeeting) {
  const items = meeting.action_items
  if (!items?.length) return "<p>Sin action items.</p>"
  const rows = items
    .map((item) => {
      const status = item.completed ? "Completado" : "Abierto"
      const assignee = item.assignee?.name || item.assignee?.email || "—"
      const stamp = item.recording_timestamp ? ` (${escapeHtml(item.recording_timestamp)})` : ""
      const playback = item.recording_playback_url
        ? ` — ${linkCell(item.recording_playback_url, "Ir al momento")}`
        : ""
      return `<li><strong>${status}:</strong> ${escapeHtml(item.description)} — ${escapeHtml(assignee)}${stamp}${playback}</li>`
    })
    .join("")
  return `<ul>${rows}</ul>`
}

function transcriptHtml(meeting: FathomMeeting) {
  const items = meeting.transcript
  if (!items?.length) {
    return "<p>Sin transcripción en el webhook. Usa el enlace de Fathom.</p>"
  }

  const parts: string[] = []
  let used = 0
  let truncated = false
  for (const item of items) {
    const stamp = item.timestamp ? `${item.timestamp} ` : ""
    const line = `${stamp}${item.speaker.display_name}: ${item.text}`
    if (used + line.length > TRANSCRIPT_CHAR_LIMIT) {
      truncated = true
      break
    }
    used += line.length
    parts.push(
      `<p><strong>${escapeHtml(item.speaker.display_name)}</strong>${item.timestamp ? ` (${escapeHtml(item.timestamp)})` : ""}: ${escapeHtml(item.text)}</p>`,
    )
  }

  const note = truncated
    ? `<p><em>Transcripción truncada. Completa en Fathom: ${linkCell(meeting.url, "abrir grabación")}.</em></p>`
    : ""
  return `${parts.join("")}${note}`
}

function expandMacro(title: string, body: string) {
  return `<ac:structured-macro ac:name="expand" ac:schema-version="1"><ac:parameter ac:name="title">${escapeHtml(title)}</ac:parameter><ac:rich-text-body>${body}</ac:rich-text-body></ac:structured-macro>`
}

export function meetingPageBody(meeting: FathomMeeting) {
  const token = recordingToken(meeting.recording_id)
  const audience =
    meeting.calendar_invitees_domains_type === "one_or_more_external"
      ? "Con externos"
      : meeting.calendar_invitees_domains_type === "only_internal"
        ? "Solo internos"
        : meeting.calendar_invitees_domains_type || "—"
  const summary = meeting.default_summary?.markdown_formatted?.trim()
    ? markdownToStorage(meeting.default_summary.markdown_formatted)
    : "<p>Sin resumen en el webhook.</p>"

  return [
    `<!-- ${token} -->`,
    "<h2>Detalles</h2>",
    "<table><tbody>",
    metaRow("ID Fathom", escapeHtml(`${meeting.recording_id} (${token})`)),
    metaRow("Grabado por", escapeHtml(`${meeting.recorded_by.name} (${meeting.recorded_by.email})`)),
    metaRow("Equipo", escapeHtml(meeting.recorded_by.team || "—")),
    metaRow("Tipo", escapeHtml(meeting.meeting_type || "—")),
    metaRow("Audiencia", escapeHtml(audience)),
    metaRow("Inicio", escapeHtml(formatBogotaDateTime(meeting.recording_start_time || meeting.scheduled_start_time))),
    metaRow("Fin", escapeHtml(formatBogotaDateTime(meeting.recording_end_time || meeting.scheduled_end_time))),
    metaRow("Grabación", linkCell(meeting.url, "Abrir en Fathom")),
    metaRow("Compartir", linkCell(meeting.share_url, "Link de share")),
    metaRow("Reunión", linkCell(meeting.meeting_url, "Zoom / Meet / Teams")),
    "</tbody></table>",
    "<h2>Participantes</h2>",
    attendeesHtml(meeting),
    "<h2>Resumen</h2>",
    summary,
    "<h2>Action items</h2>",
    actionItemsHtml(meeting),
    expandMacro("Transcripción", transcriptHtml(meeting)),
  ].join("")
}
