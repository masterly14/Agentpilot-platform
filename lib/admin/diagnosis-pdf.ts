import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib"
import {
  buildDiagnosisInforme,
  formatInformeMoney,
  type DiagnosisInformeModel,
  type InformeLeakRow,
} from "@/lib/admin/diagnosis-informe"
import { diagnosisSlug, type LeakMapState } from "@/lib/admin/leak-map"

const INK = rgb(0.106, 0.129, 0.118)
const INK2 = rgb(0.322, 0.361, 0.341)
const RULE = rgb(0.851, 0.871, 0.847)
const PAGE_W = 595.28
const PAGE_H = 841.89
const MARGIN = 48
const MAX_W = PAGE_W - MARGIN * 2

function latin(value: string) {
  return value
    .replace(/[—–]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .replace(/×/g, "x")
    .replace(/·/g, " - ")
    .replace(/[^\x20-\x7EáéíóúüñÁÉÍÓÚÜÑ¿¡€$%,.;:()\/+\-'"#@*]/g, " ")
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const clean = latin(text).trim()
  if (!clean) return []
  const words = clean.split(/\s+/)
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(next, size) <= width) {
      current = next
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

export async function buildDiagnosisPdf(state: LeakMapState) {
  const model = buildDiagnosisInforme(state)
  const money = (value: number) => formatInformeMoney(value, model.moneda)
  const pdf = await PDFDocument.create()
  const serif = await pdf.embedFont(StandardFonts.TimesRoman)
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const sans = await pdf.embedFont(StandardFonts.Helvetica)
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  let page = pdf.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - MARGIN

  function ensure(height: number) {
    if (y - height < MARGIN) {
      page = pdf.addPage([PAGE_W, PAGE_H])
      y = PAGE_H - MARGIN
    }
  }

  function drawLines(lines: string[], font: PDFFont, size: number, color = INK2, gap = 3) {
    for (const line of lines) {
      ensure(size + gap)
      page.drawText(line, { x: MARGIN, y: y - size, size, font, color })
      y -= size + gap
    }
  }

  function heading(text: string) {
    y -= 14
    const lines = wrap(text, serifBold, 13, MAX_W)
    drawLines(lines, serifBold, 13, INK, 4)
    y -= 4
  }

  function note(text: string) {
    drawLines(wrap(text, sans, 10, MAX_W), sans, 10, INK2, 3)
    y -= 6
  }

  function rule() {
    ensure(10)
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_W - MARGIN, y },
      thickness: 0.6,
      color: RULE,
    })
    y -= 10
  }

  function fig(cap: string, big: string, exp: string) {
    const capLines = wrap(cap, sans, 10, MAX_W - 24)
    const bigLines = wrap(big, serifBold, 20, MAX_W - 24)
    const expLines = wrap(exp, sans, 10, MAX_W - 24)
    const boxH = 18 + capLines.length * 13 + bigLines.length * 24 + expLines.length * 13 + 12
    ensure(boxH)
    const top = y
    y -= 12
    for (const line of capLines) {
      page.drawText(line, { x: MARGIN + 12, y: y - 10, size: 10, font: sans, color: INK2 })
      y -= 13
    }
    for (const line of bigLines) {
      page.drawText(line, { x: MARGIN + 12, y: y - 18, size: 20, font: serifBold, color: INK })
      y -= 24
    }
    for (const line of expLines) {
      page.drawText(line, { x: MARGIN + 12, y: y - 10, size: 10, font: sans, color: INK2 })
      y -= 13
    }
    y -= 10
    page.drawRectangle({
      x: MARGIN,
      y,
      width: MAX_W,
      height: top - y,
      borderColor: RULE,
      borderWidth: 0.8,
    })
    y -= 10
  }

  function table(headers: string[], rows: string[][], widths: number[]) {
    const headerH = 16
    ensure(headerH + 8)
    let x = MARGIN
    headers.forEach((header, index) => {
      page.drawText(latin(header), { x, y: y - 10, size: 9, font: sansBold, color: INK2 })
      x += widths[index]
    })
    y -= headerH
    rule()
    for (const row of rows) {
      const cellLines = row.map((cell, index) => wrap(cell, sans, 9.5, widths[index] - 6))
      const rowH = Math.max(16, ...cellLines.map((lines) => lines.length * 12)) + 6
      ensure(rowH)
      cellLines.forEach((lines, index) => {
        const cx = MARGIN + widths.slice(0, index).reduce((sum, w) => sum + w, 0)
        lines.forEach((line, lineIndex) => {
          page.drawText(line, {
            x: cx,
            y: y - 11 - lineIndex * 12,
            size: 9.5,
            font: sans,
            color: index === row.length - 1 ? INK : INK2,
          })
        })
      })
      y -= rowH
      page.drawLine({
        start: { x: MARGIN, y: y + 2 },
        end: { x: PAGE_W - MARGIN, y: y + 2 },
        thickness: 0.4,
        color: RULE,
      })
    }
    y -= 8
  }

  function leakTable(rows: InformeLeakRow[], withAccion = false) {
    const widths = withAccion ? [150, 150, 110, 85] : [170, 220, 105]
    const headers = withAccion
      ? ["Concepto", "Como se calcula", "Que haria falta", "Al ano"]
      : ["Concepto", "Como se calcula", "Al ano"]
    table(
      headers,
      rows.map((row) => {
        const concepto = row.nota ? `${row.nombre}\n${row.nota}` : row.nombre
        return withAccion
          ? [concepto, row.como, row.accion, money(row.anio)]
          : [concepto, row.como, money(row.anio)]
      }),
      widths,
    )
  }

  page.drawText("Diagnostico operativo", {
    x: MARGIN,
    y: y - 22,
    size: 22,
    font: serifBold,
    color: INK,
  })
  y -= 30
  const meta = [model.cliente, model.meta].filter(Boolean).join(" - ")
  drawLines(wrap(meta, sans, 10, MAX_W), sans, 10, INK2, 3)
  y -= 8
  note(
    "Este documento es tuyo. Recoge lo que revisamos: por donde se traba el trabajo hoy, que esta costando eso y que haria falta para que deje de costarlo. Las cifras van separadas porque cada una depende de algo distinto; sumarlas daria un numero que no significa nada.",
  )

  if (model.revisados) {
    note(
      `Recorrimos ${model.totalPasos} puntos de la operacion y revisamos ${model.revisados}. De esos, ${model.sanos.length} estan resueltos y ${model.huecos.length} se traban.`,
    )
  }

  if (model.sanos.length) {
    heading("Lo que ya funciona")
    note(
      "Queda registrado a proposito: es la parte de la operacion que no hay que tocar, y sirve de referencia si mas adelante alguien propone cambiarla.",
    )
    table(
      ["Recorrido", "Paso", "Como lo resuelven"],
      model.sanos.map((paso) => [paso.traza, paso.paso, paso.n || "-"]),
      [120, 140, 235],
    )
  }

  if (model.huecos.length) {
    heading("Donde se traba hoy")
    table(
      ["Recorrido", "Paso", "Que pasa"],
      model.huecos.map((paso) => [
        paso.traza,
        `${paso.paso} (${paso.s === "no" ? "No existe" : "Cuesta trabajo"})`,
        paso.n || "-",
      ]),
      [120, 170, 205],
    )
  }

  if (model.proceso.length) {
    fig(
      "Se corrige poniendo un proceso",
      `${money(model.procesoAnio)} al ano`,
      "No hay que cancelar nada ni negociar con nadie. Es trabajo que hoy se hace a mano o que no se hace.",
    )
    leakTable(model.proceso)
  }

  if (model.decision.length) {
    fig(
      "Depende de una decision tuya",
      `${money(model.decisionAnio)} al ano`,
      "Este dinero sale de contratos y suscripciones vigentes. Deja de salir el dia que decidas cancelarlos, renegociarlos o salirte.",
    )
    leakTable(model.decision, true)
  }

  if (model.exposicion.length) {
    heading("Exposicion")
    note("No es un gasto de hoy. Es lo que puede costar si se materializa, y por eso va aparte.")
    for (const item of model.exposicion) {
      const extra = [item.norma || "-", item.casos ? `Casos expuestos: ${item.casos}.` : "", item.nota]
        .filter(Boolean)
        .join(" ")
      fig(item.nombre, `${money(item.piso)} a ${money(item.tope)}`, extra)
    }
  }

  if (model.potencial.length) {
    heading("Ingreso que hoy no entra")
    note("No es un ahorro. Es dinero que la operacion actual no alcanza a capturar.")
    leakTable(model.potencial)
  }

  heading("Por donde empezaria")
  note(
    "Ordenado por lo que se puede mover mas rapido, no por el tamano de la cifra. Lo mas grande casi siempre es lo que mas cuesta destrabar.",
  )
  if (model.orden.length) {
    model.orden.forEach((item, index) => {
      note(`${index + 1}. ${item.nombre} - ${money(item.anio)} al ano. Haria falta ${item.accion}.`)
    })
  } else {
    note("-")
  }

  heading("De donde salen las cifras")
  note(
    "Cada linea sale de un precio que ya pagas, de un dato que diste en la reunion o de una norma citada. No se usaron promedios de industria ni supuestos sobre tu operacion. Lo que quedo marcado como dato de la reunion conviene contrastarlo contra facturas o extractos de los ultimos meses antes de tomar cualquier decision con estos numeros.",
  )

  y -= 16
  rule()
  drawLines(["Agent Pilot - Real Estate Pilot"], sans, 10, INK2, 3)

  const bytes = await pdf.save()
  const filename = `diagnostico-${diagnosisSlug(model.cliente) || "operativo"}.pdf`
  return { bytes, filename, model }
}

export function diagnosisWhatsAppCaption(model: DiagnosisInformeModel) {
  return `Te dejo el diagnóstico operativo de ${model.cliente}. Recoge lo que revisamos: por dónde se traba el trabajo hoy y qué está costando eso. Las cifras van separadas a propósito.`
}
