import { analysisToken, type FathomMeeting } from "@/lib/fathom/payload"
import { escapeHtml, markdownToStorage, meetingPageTitle } from "@/lib/fathom/page-body"
import type { CallAnalysis } from "@/lib/fathom/analysis-schema"

function scoreCell(value: number) {
  return escapeHtml(value.toFixed(1))
}

function itemList(
  items: Array<{ title: string; detail: string; quote?: string; suggestedScript?: string }>,
) {
  if (!items.length) return "<p>—</p>"
  return `<ul>${items
    .map((item) => {
      const quote = item.quote ? `<p><em>“${escapeHtml(item.quote)}”</em></p>` : ""
      const script = item.suggestedScript
        ? `<p><strong>Script sugerido:</strong> ${escapeHtml(item.suggestedScript)}</p>`
        : ""
      return `<li><p><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.detail)}</p>${quote}${script}</li>`
    })
    .join("")}</ul>`
}

export function analysisPageTitle(meeting: FathomMeeting) {
  return meetingPageTitle(meeting).replace(/^(\d{4}-\d{2}-\d{2}) /, "$1 Análisis · ")
}

export function analysisPageBody(input: {
  meeting: FathomMeeting
  analysis: CallAnalysis
  meetingPageUrl?: string
}) {
  const { meeting, analysis, meetingPageUrl } = input
  const token = analysisToken(meeting.recording_id)
  const scoreRows = [
    ["Descubrimiento", analysis.scores.discovery],
    ["Pitch / producto", analysis.scores.pitch],
    ["Objeciones", analysis.scores.objections],
    ["Cierre", analysis.scores.close],
    ["Escucha", analysis.scores.listening],
    ["Next step", analysis.scores.nextStep],
  ]
    .map(([label, value]) => `<tr><th>${label}</th><td>${scoreCell(Number(value))}</td></tr>`)
    .join("")

  const objections = analysis.objectionsHandled.length
    ? `<ul>${analysis.objectionsHandled
        .map(
          (item) =>
            `<li><p><strong>${escapeHtml(item.objection)}</strong></p><p>Cómo lo manejó: ${escapeHtml(item.howHandled)}</p><p>Mejor enfoque: ${escapeHtml(item.betterApproach)}</p></li>`,
        )
        .join("")}</ul>`
    : "<p>No se identificaron objeciones explícitas.</p>"

  const notesLink = meetingPageUrl
    ? `<p><a href="${escapeHtml(meetingPageUrl)}">Notas de la reunión</a> · <a href="${escapeHtml(meeting.url)}">Grabación Fathom</a></p>`
    : `<p><a href="${escapeHtml(meeting.url)}">Grabación Fathom</a></p>`

  return [
    `<!-- ${token} -->`,
    `<p>${escapeHtml(token)}</p>`,
    "<h2>Puntaje</h2>",
    `<p><strong>Overall: ${scoreCell(analysis.overallScore)} / 10</strong> — ${escapeHtml(analysis.verdict)}</p>`,
    `<table><tbody><tr><th>Dimensión</th><th>Nota</th></tr>${scoreRows}</tbody></table>`,
    notesLink,
    "<h2>Resumen para el vendedor</h2>",
    markdownToStorage(analysis.summary),
    "<h2>Qué hizo bien</h2>",
    itemList(analysis.positives),
    "<h2>Puntos de mejora</h2>",
    itemList(analysis.improvements),
    "<h2>Objeciones</h2>",
    objections,
    "<h2>Estructura de la llamada</h2>",
    markdownToStorage(analysis.structureNotes),
    "<h2>Foco de coaching (próxima llamada)</h2>",
    markdownToStorage(analysis.nextCoachingFocus),
  ].join("")
}
