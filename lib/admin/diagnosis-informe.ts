import {
  accOf,
  anualLeak,
  boxOf,
  cuentaLeak,
  explicaLeak,
  formatLeakMoney,
  markKey,
  num,
  tarifaHora,
  TRAZAS,
  type DiagnosticoLeak,
  type LeakMapMoneda,
  type LeakMapState,
} from "@/lib/admin/leak-map"

export type InformePaso = {
  traza: string
  paso: string
  s: "ok" | "mal" | "no"
  n: string
}

export type InformeLeakRow = {
  id: string
  nombre: string
  nota: string
  como: string
  accion: string
  anio: number
}

export type InformeExposicion = {
  id: string
  nombre: string
  piso: number
  tope: number
  norma: string
  casos: string
  nota: string
}

export type DiagnosisInformeModel = {
  title: string
  cliente: string
  meta: string
  moneda: LeakMapMoneda
  revisados: number
  totalPasos: number
  sanos: InformePaso[]
  huecos: InformePaso[]
  procesoAnio: number
  decisionAnio: number
  proceso: InformeLeakRow[]
  decision: InformeLeakRow[]
  exposicion: InformeExposicion[]
  potencial: InformeLeakRow[]
  orden: Array<{ id: string; nombre: string; anio: number; accion: string }>
}

function cap(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}

function leakRow(leak: DiagnosticoLeak, tarifa: number, moneda: LeakMapMoneda): InformeLeakRow {
  return {
    id: leak.id,
    nombre: leak.nombre.trim() || "Sin nombre",
    nota: leak.nota.trim(),
    como: explicaLeak(leak, tarifa, moneda),
    accion: cap(accOf(leak.accion).v),
    anio: anualLeak(leak, tarifa),
  }
}

export function buildDiagnosisInforme(state: LeakMapState): DiagnosisInformeModel {
  const tarifa = tarifaHora(state)
  const moneda = state.moneda
  const counted = state.leaks.filter(cuentaLeak)
  const procesoLeaks = counted.filter((leak) => boxOf(leak) === "proceso")
  const decisionLeaks = counted.filter((leak) => boxOf(leak) === "decision")
  const exposicionLeaks = counted.filter((leak) => boxOf(leak) === "exposicion")
  const potencialLeaks = counted.filter((leak) => boxOf(leak) === "potencial")

  const sanos: InformePaso[] = []
  const huecos: InformePaso[] = []
  let revisados = 0
  let totalPasos = 0
  for (const traza of TRAZAS) {
    for (const [index, paso] of traza.pasos.entries()) {
      totalPasos += 1
      const mark = state.marks[markKey(traza.id, index)]
      if (!mark?.s) continue
      revisados += 1
      const item: InformePaso = { traza: traza.titulo, paso: paso.nombre, s: mark.s, n: mark.n }
      if (mark.s === "ok") sanos.push(item)
      else huecos.push(item)
    }
  }

  const proceso = procesoLeaks.map((leak) => leakRow(leak, tarifa, moneda)).sort((a, b) => b.anio - a.anio)
  const decision = decisionLeaks.map((leak) => leakRow(leak, tarifa, moneda)).sort((a, b) => b.anio - a.anio)
  const potencial = potencialLeaks.map((leak) => leakRow(leak, tarifa, moneda)).sort((a, b) => b.anio - a.anio)

  const orden = [...procesoLeaks, ...decisionLeaks]
    .sort((a, b) => {
      const ap = accOf(a.accion).b === "proceso" ? 0 : 1
      const bp = accOf(b.accion).b === "proceso" ? 0 : 1
      return ap - bp || anualLeak(b, tarifa) - anualLeak(a, tarifa)
    })
    .slice(0, 3)
    .map((leak) => ({
      id: leak.id,
      nombre: leak.nombre.trim() || "Sin nombre",
      anio: anualLeak(leak, tarifa),
      accion: accOf(leak.accion).v,
    }))

  const meta = [state.ciudades, state.unidades, state.canales].filter(Boolean).join(" · ")
  const cliente = state.cliente.trim() || "—"

  return {
    title: `Diagnóstico operativo${state.cliente.trim() ? ` · ${state.cliente.trim()}` : ""}`,
    cliente,
    meta: [meta, state.fecha].filter(Boolean).join(" · "),
    moneda,
    revisados,
    totalPasos,
    sanos,
    huecos,
    procesoAnio: proceso.reduce((sum, row) => sum + row.anio, 0),
    decisionAnio: decision.reduce((sum, row) => sum + row.anio, 0),
    proceso,
    decision,
    exposicion: exposicionLeaks.map((leak) => ({
      id: leak.id,
      nombre: leak.nombre.trim() || "Sin nombre",
      piso: num(leak.piso),
      tope: num(leak.tope),
      norma: leak.norma.trim(),
      casos: leak.casos.trim(),
      nota: leak.nota.trim(),
    })),
    potencial,
    orden,
  }
}

export function formatInformeMoney(value: number, moneda: LeakMapMoneda) {
  return formatLeakMoney(value, moneda)
}

export const DIAGNOSIS_INFORME_CSS = `
:root{
  --paper:#F6F7F4; --card:#FFF; --ink:#1B211E; --ink-2:#525C57; --ink-3:#8A938E;
  --rule:#D9DED8; --soft:#E9EDE7;
}
.diagnostico-informe{background:var(--paper);color:var(--ink);
  font-family:ui-sans-serif,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  font-size:15px;line-height:1.5;font-feature-settings:"tnum" 1}
.diagnostico-informe .doc{background:var(--card);border:1px solid var(--rule);border-radius:5px;padding:44px 48px;max-width:760px;margin:22px auto 80px}
.diagnostico-informe .doc h1{font-family:Georgia,serif;font-size:27px;font-weight:600;margin:0 0 4px;letter-spacing:-.01em}
.diagnostico-informe .doc .meta{color:var(--ink-2);font-size:13.5px;margin:0 0 28px}
.diagnostico-informe .doc h2{font-family:Georgia,serif;font-size:17px;font-weight:600;margin:32px 0 4px}
.diagnostico-informe .doc .note{color:var(--ink-2);font-size:13.5px;margin:0 0 13px;max-width:64ch}
.diagnostico-informe .fig{border:1px solid var(--rule);border-radius:4px;padding:16px 18px;margin:14px 0}
.diagnostico-informe .fig .cap{font-size:13px;color:var(--ink-2)}
.diagnostico-informe .fig .big{font-family:Georgia,serif;font-size:29px;font-weight:600;margin:3px 0 5px;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.diagnostico-informe .fig .exp{font-size:13px;color:var(--ink-2);max-width:60ch}
.diagnostico-informe table.led{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:10px}
.diagnostico-informe table.led th{text-align:left;font-weight:600;color:var(--ink-2);font-size:12.5px;border-bottom:1px solid var(--rule);padding:6px 8px 6px 0}
.diagnostico-informe table.led td{border-bottom:1px solid var(--soft);padding:8px 8px 8px 0;vertical-align:top}
.diagnostico-informe table.led td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;padding-right:0}
.diagnostico-informe .doc ol,.diagnostico-informe .doc ul{padding-left:18px;max-width:64ch}
.diagnostico-informe .doc li{margin-bottom:6px}
.diagnostico-informe .sig{margin-top:36px;padding-top:14px;border-top:1px solid var(--rule);font-size:13px;color:var(--ink-2)}
@media(max-width:640px){.diagnostico-informe .doc{padding:26px 22px}}
@media print{
  .diagnostico-informe{background:#fff;font-size:11.5pt}
  .diagnostico-informe .doc{border:0;padding:0;max-width:none;margin:0}
}
`

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function money(model: DiagnosisInformeModel, value: number) {
  return escapeHtml(formatInformeMoney(value, model.moneda))
}

function tabla(rows: InformeLeakRow[], model: DiagnosisInformeModel, conAccion = false) {
  return `<table class="led"><thead><tr><th style="width:32%">Concepto</th><th>Cómo se calcula</th>
  ${conAccion ? '<th style="width:22%">Qué haría falta</th>' : ""}<th class="n">Al año</th></tr></thead><tbody>
  ${rows
    .map(
      (row) => `<tr>
   <td>${escapeHtml(row.nombre)}${row.nota ? `<br><span style="color:var(--ink-2);font-size:12.5px">${escapeHtml(row.nota)}</span>` : ""}</td>
   <td style="color:var(--ink-2)">${escapeHtml(row.como)}</td>
   ${conAccion ? `<td style="color:var(--ink-2)">${escapeHtml(row.accion)}</td>` : ""}
   <td class="n">${money(model, row.anio)}</td></tr>`,
    )
    .join("")}</tbody></table>`
}

export function buildDiagnosisHtml(state: LeakMapState) {
  const model = buildDiagnosisInforme(state)
  const m = (value: number) => money(model, value)
  const metaLine = [escapeHtml(model.cliente), model.meta ? escapeHtml(model.meta) : ""].filter(Boolean).join(" · ")

  const sanos =
    model.sanos.length === 0
      ? ""
      : `<h2>Lo que ya funciona</h2>
   <p class="note">Queda registrado a propósito: es la parte de la operación que no hay que tocar, y sirve de referencia si más adelante alguien propone cambiarla.</p>
   <table class="led"><thead><tr><th style="width:22%">Recorrido</th><th style="width:24%">Paso</th><th>Cómo lo resuelven</th></tr></thead><tbody>
   ${model.sanos.map((h) => `<tr><td>${escapeHtml(h.traza)}</td><td>${escapeHtml(h.paso)}</td><td style="color:var(--ink-2)">${escapeHtml(h.n) || "—"}</td></tr>`).join("")}</tbody></table>`

  const huecos =
    model.huecos.length === 0
      ? ""
      : `<h2>Dónde se traba hoy</h2>
   <table class="led"><thead><tr><th style="width:22%">Recorrido</th><th style="width:24%">Paso</th><th>Qué pasa</th></tr></thead><tbody>
   ${model.huecos
     .map(
       (h) => `<tr><td>${escapeHtml(h.traza)}</td><td>${escapeHtml(h.paso)}<br><span style="color:var(--ink-2);font-size:12.5px">${h.s === "no" ? "No existe" : "Cuesta trabajo"}</span></td>
     <td style="color:var(--ink-2)">${escapeHtml(h.n) || "—"}</td></tr>`,
     )
     .join("")}</tbody></table>`

  const proceso = model.proceso.length
    ? `<div class="fig"><div class="cap">Se corrige poniendo un proceso</div>
     <div class="big">${m(model.procesoAnio)} al año</div>
     <div class="exp">No hay que cancelar nada ni negociar con nadie. Es trabajo que hoy se hace a mano o que no se hace.</div></div>
     ${tabla(model.proceso, model)}`
    : ""

  const decision = model.decision.length
    ? `<div class="fig"><div class="cap">Depende de una decisión tuya</div>
     <div class="big">${m(model.decisionAnio)} al año</div>
     <div class="exp">Este dinero sale de contratos y suscripciones vigentes. Deja de salir el día que decidas cancelarlos, renegociarlos o salirte.</div></div>
     ${tabla(model.decision, model, true)}`
    : ""

  const exposicion = model.exposicion.length
    ? `<h2>Exposición</h2><p class="note">No es un gasto de hoy. Es lo que puede costar si se materializa, y por eso va aparte.</p>
     ${model.exposicion
       .map(
         (L) => `<div class="fig"><div class="cap">${escapeHtml(L.nombre)}</div>
      <div class="big">${m(L.piso)} a ${m(L.tope)}</div>
      <div class="exp">${escapeHtml(L.norma) || "—"}${L.casos ? ` Casos expuestos: ${escapeHtml(L.casos)}.` : ""}${L.nota ? ` ${escapeHtml(L.nota)}` : ""}</div></div>`,
       )
       .join("")}`
    : ""

  const potencial = model.potencial.length
    ? `<h2>Ingreso que hoy no entra</h2><p class="note">No es un ahorro. Es dinero que la operación actual no alcanza a capturar.</p>${tabla(model.potencial, model)}`
    : ""

  const orden = model.orden.length
    ? model.orden
        .map(
          (L) =>
            `<li><strong>${escapeHtml(L.nombre)}</strong> — ${m(L.anio)} al año. Haría falta ${escapeHtml(L.accion)}.</li>`,
        )
        .join("")
    : "<li>—</li>"

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(model.title)}</title>
<style>
@page{size:A4;margin:15mm 14mm 16mm 14mm}
html,body{margin:0;background:#F6F7F4}
${DIAGNOSIS_INFORME_CSS}
</style>
</head>
<body>
<div class="diagnostico-informe"><div class="doc">
   <h1>Diagnóstico operativo</h1>
   <p class="meta">${metaLine}</p>
   <p class="note">Este documento es tuyo. Recoge lo que revisamos: por dónde se traba el trabajo hoy, qué está costando eso y qué haría falta para que deje de costarlo. Las cifras van separadas porque cada una depende de algo distinto; sumarlas daría un número que no significa nada.</p>
   ${model.revisados ? `<p class="note">Recorrimos ${model.totalPasos} puntos de la operación y revisamos ${model.revisados}. De esos, ${model.sanos.length} están resueltos y ${model.huecos.length} se traban.</p>` : ""}
   ${sanos}
   ${huecos}
   ${proceso}
   ${decision}
   ${exposicion}
   ${potencial}
   <h2>Por dónde empezaría</h2>
   <p class="note">Ordenado por lo que se puede mover más rápido, no por el tamaño de la cifra. Lo más grande casi siempre es lo que más cuesta destrabar.</p>
   <ol>${orden}</ol>
   <h2>De dónde salen las cifras</h2>
   <p class="note">Cada línea sale de un precio que ya pagas, de un dato que diste en la reunión o de una norma citada. No se usaron promedios de industria ni supuestos sobre tu operación. Lo que quedó marcado como dato de la reunión conviene contrastarlo contra facturas o extractos de los últimos meses antes de tomar cualquier decisión con estos números.</p>
   <div class="sig">Agent Pilot · Real Estate Pilot</div>
</div></div>
</body>
</html>`
}
