import {
  calculateLeakMap,
  diagnosisSlug,
  findPasoDef,
  FRECUENCIAS,
  impactoLabel,
  trazaNombre,
  type LeakMapMoneda,
  type LeakMapState,
} from "@/lib/admin/leak-map"

export type DiagnosisInformeModel = {
  title: string
  cliente: string
  meta: string[]
  intro: string
  moneda: LeakMapMoneda
  medidoAnio: number
  estimadoAnio: number
  potencialAnio: number
  medidoMes: number
  medidoRows: Array<{ id: string; concepto: string; como: string; mes: number; anio: number }>
  estimadoRows: Array<{ id: string; punto: string; como: string; anio: number; paraConfirmar: string }>
  requerimientos: Array<{
    id: string
    nombre: string
    queNoPueden: string
    tag: string
    potencialAnio: number | null
  }>
  prioridades: Array<{ id: string; titulo: string; descripcion: string; modulo: string }>
  notas: string[]
  siguientePaso: string
}

export function formatInformeMoney(value: number, moneda: LeakMapMoneda, approx = false) {
  const n = Math.round(value).toLocaleString("es-CO")
  const prefix = moneda === "USD" ? "US$" : "$"
  return `${approx ? "~" : ""}${prefix}${n}`
}

function propiedadesMeta(value: string) {
  const text = value.trim()
  if (!text) return ""
  if (/[a-záéíóúñ]/i.test(text)) return text
  return `${text} propiedades`
}

function sentence(value: string) {
  const text = value.trim()
  if (!text) return ""
  return /[.!?…]$/.test(text) ? text : `${text}.`
}

function reqTag(item: LeakMapState["requerimientos"][number]) {
  const impacto = impactoLabel(item.impacto) || "Capacidad que hoy no existe"
  const origen = item.origenPasoId ? findPasoDef(item.origenPasoId) : null
  const traza = item.origenTrazaId
    ? trazaNombre(item.origenTrazaId)
    : origen
      ? origen.traza.nombre
      : null
  return traza ? `${impacto} · ${traza}` : impacto
}

export function buildDiagnosisInforme(state: LeakMapState): DiagnosisInformeModel {
  const calc = calculateLeakMap(state)
  const snapshot = state.snapshot
  const cliente = snapshot.cliente.trim() || "Cliente"
  const moneda = state.config.moneda
  const tarifa = parseFloat(state.config.tarifa) || 0

  const medidoRows = calc.filas
    .filter((row) => row.directo > 0)
    .map((row) => {
      const freq = FRECUENCIAS.find((item) => item.id === row.frecuencia)?.label ?? "al mes"
      const parts: string[] = []
      if (row.horas.trim()) {
        parts.push(`${row.horas} h ${freq} × ${formatInformeMoney(tarifa, moneda)} por hora.`)
      }
      if (row.quien.trim()) parts.push(`Lo hace ${row.quien.trim()}.`)
      if (row.hoy.trim()) parts.push(sentence(row.hoy))
      return {
        id: row.id,
        concepto: row.nombre,
        como: parts.join(" ") || "Calculado sobre las horas reportadas en la reunión.",
        mes: row.directo,
        anio: row.directo * 12,
      }
    })

  const estimadoRows = calc.filas
    .filter((row) => row.indirectoMes > 0)
    .map((row) => ({
      id: `${row.id}-estimado`,
      punto: row.nombre,
      como:
        sentence(row.rompe) ||
        sentence(row.hoy) ||
        "Aproximación conservadora a partir de lo descrito en la reunión.",
      anio: row.indirectoMes * 12,
      paraConfirmar: "Dato o gasto de los últimos meses",
    }))

  const potencialItems = state.requerimientos.filter((item) => {
    const valor = parseFloat(item.valorMes) || 0
    return valor > 0 && (item.impacto === "ingreso" || item.impacto === "crecimiento")
  })
  const potencialAnio = potencialItems.reduce((sum, item) => sum + (parseFloat(item.valorMes) || 0) * 12, 0)
  const potencialIds = new Set(potencialItems.map((item) => item.id))

  const medidoMes = medidoRows.reduce((sum, row) => sum + row.mes, 0)
  const medidoAnio = medidoRows.reduce((sum, row) => sum + row.anio, 0)
  const estimadoAnio = estimadoRows.reduce((sum, row) => sum + row.anio, 0)

  const requerimientos = state.requerimientos
    .filter((item) => item.nombre.trim() || item.queNoPueden.trim())
    .map((item) => {
      const valor = parseFloat(item.valorMes) || 0
      return {
        id: item.id,
        nombre: item.nombre.trim() || "Sin nombre",
        queNoPueden: item.queNoPueden.trim(),
        tag: reqTag(item),
        potencialAnio: potencialIds.has(item.id) && valor > 0 ? valor * 12 : null,
      }
    })

  const prioridades = calc.filas.slice(0, 3).map((row) => ({
    id: row.id,
    titulo: row.nombre,
    descripcion:
      sentence(row.rompe) ||
      `Recuperar esta área libera ${row.horasMes.toFixed(0)} horas al mes y ${formatInformeMoney(row.fugaMes * 12, moneda)} al año.`,
    modulo: row.modulo,
  }))

  if (prioridades.length === 0) {
    for (const item of state.requerimientos.filter((req) => req.clasificacion === "base").slice(0, 3)) {
      prioridades.push({
        id: item.id,
        titulo: item.nombre.trim() || "Requerimiento base",
        descripcion: sentence(item.queNoPueden) || "Capacidad que hay que construir para desbloquear la operación.",
        modulo: "Dentro del base",
      })
    }
  }

  const listado = prioridades.map((item) => item.titulo.toLowerCase())
  const foco =
    listado.length === 0
      ? "la solución completa"
      : listado.length === 1
        ? listado[0]
        : `${listado.slice(0, -1).join(", ")} y ${listado[listado.length - 1]}`

  const mix = medidoAnio + estimadoAnio + potencialAnio
  const notas: string[] = [
    medidoRows.length > 0
      ? `Las cifras de la primera tabla son aritmética directa sobre los datos que compartiste. El tiempo se calculó a ${formatInformeMoney(tarifa, moneda)} por hora. Donde hubo rango se tomó el extremo bajo: preferimos un número más pequeño que puedas defender.`
      : "Donde hubo rango se tomó el extremo bajo: preferimos quedarnos cortos y que cada cifra sea defendible.",
  ]
  if (estimadoRows.length > 0) {
    notas.push(
      "Las cifras de la segunda tabla son aproximaciones, no mediciones, y por eso van marcadas con el símbolo de aproximado y separadas del costo medido. Cada supuesto está escrito para que puedas revisarlo y corregirlo. Si alguno te parece optimista, bájalo.",
    )
  }
  if (medidoAnio > 0 && (estimadoAnio > 0 || potencialAnio > 0)) {
    notas.push(
      `Las tres cifras se mantienen separadas a propósito. Sumadas dan una exposición anual cercana a ${formatInformeMoney(mix, moneda)}, pero esa cifra mezcla costo verificado, aproximaciones e ingreso no capturado, que son cosas distintas y se resuelven de forma distinta.`,
    )
  }

  return {
    title: `Diagnóstico operativo — ${cliente}`,
    cliente,
    meta: [snapshot.ciudades.trim(), propiedadesMeta(snapshot.propiedades), snapshot.canales.trim()].filter(Boolean),
    intro:
      "Este documento recoge lo que revisamos juntos sobre tu operación. Las cifras salen de los datos que compartiste en la reunión. Donde diste un rango, se tomó el extremo que resulta en el número más bajo: preferimos quedarnos cortos y que cada cifra sea defendible. Lo que no se pudo medir aparece como aproximación, con el supuesto de cálculo escrito al lado para que puedas revisarlo.",
    moneda,
    medidoAnio,
    estimadoAnio,
    potencialAnio,
    medidoMes,
    medidoRows,
    estimadoRows,
    requerimientos,
    prioridades,
    notas,
    siguientePaso: `En la próxima reunión mostramos ${foco} funcionando con tus propiedades y tus datos, no con los de otro cliente, en el orden de prioridad que aparece arriba. Para tenerlo listo necesitamos la información acordada antes de esa fecha.`,
  }
}

export const DIAGNOSIS_INFORME_CSS = `
.diagnostico-informe{
  --papel:#F4F5F2; --tinta:#15181A; --tinta2:#4A5257; --linea:#D8DBD4;
  --hondo:#0E3639; --senal:#C86A12; --alerta:#A63D2E; --blanco:#FCFDFB;
  font-family:var(--font-informe-sans,"IBM Plex Sans"),system-ui,sans-serif;
  background:var(--papel); color:var(--tinta);
  padding:40px 20px 70px; font-size:15px; line-height:1.55;
  box-sizing:border-box;
  container-type:inline-size;
  container-name:informe;
}
.diagnostico-informe *,.diagnostico-informe *::before,.diagnostico-informe *::after{box-sizing:border-box}
.diagnostico-informe .hoja{max-width:860px;width:100%;margin:0 auto;background:var(--blanco);
  border:1px solid var(--linea);padding:52px}
.diagnostico-informe .mono{font-family:var(--font-informe-mono,"IBM Plex Mono"),monospace;font-size:11px;
  letter-spacing:.06em;text-transform:uppercase}
.diagnostico-informe .cab{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;
  padding-bottom:22px;border-bottom:2px solid var(--tinta);flex-wrap:wrap}
.diagnostico-informe .eyebrow{font-family:var(--font-informe-mono,"IBM Plex Mono"),monospace;font-size:10px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--senal)}
.diagnostico-informe h1{font-size:34px;font-weight:600;letter-spacing:-.02em;margin:4px 0 0;line-height:1.15;color:var(--tinta)}
.diagnostico-informe .meta{color:var(--tinta2);text-align:right;line-height:1.8;white-space:nowrap}
.diagnostico-informe .intro{font-size:15px;color:var(--tinta2);margin:24px 0 0;max-width:68ch}
.diagnostico-informe .cifras{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:32px 0 8px}
.diagnostico-informe .caja{padding:22px;border-radius:2px}
.diagnostico-informe .caja.medido{background:var(--hondo);color:#EAF0EE;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.diagnostico-informe .caja.medido .mono{color:#9BB5B2}
.diagnostico-informe .caja.estimado{background:var(--blanco);border:2px solid var(--linea);color:var(--tinta)}
.diagnostico-informe .caja.estimado .mono{color:var(--tinta2)}
.diagnostico-informe .caja.potencial{background:var(--blanco);border:2px dashed var(--linea);color:var(--tinta)}
.diagnostico-informe .caja.potencial .mono{color:var(--tinta2)}
.diagnostico-informe .grande{font-family:var(--font-informe-mono,"IBM Plex Mono"),monospace;font-size:31px;font-weight:600;
  letter-spacing:-.03em;line-height:1.05;margin:8px 0 6px}
.diagnostico-informe .caja .sub{display:block;font-size:10px}
.diagnostico-informe .separador{font-size:13.5px;color:var(--tinta2);margin:14px 0 0;font-style:italic}
.diagnostico-informe h2{font-family:var(--font-informe-mono,"IBM Plex Mono"),monospace;font-size:11px;letter-spacing:.1em;
  text-transform:uppercase;color:var(--senal);margin:38px 0 14px;font-weight:600}
.diagnostico-informe table{width:100%;border-collapse:collapse;font-size:14px}
.diagnostico-informe th{text-align:left;font-family:var(--font-informe-mono,"IBM Plex Mono"),monospace;font-size:10px;
  letter-spacing:.06em;text-transform:uppercase;color:var(--tinta2);
  padding:0 10px 9px;border-bottom:1px solid var(--tinta);font-weight:500}
.diagnostico-informe td{padding:13px 10px;border-bottom:1px solid var(--linea);vertical-align:top;color:var(--tinta)}
.diagnostico-informe .der{text-align:right}
.diagnostico-informe .gris{color:var(--tinta2);font-size:13.5px}
.diagnostico-informe .num{font-family:var(--font-informe-mono,"IBM Plex Mono"),monospace;font-size:13.5px}
.diagnostico-informe .fuerte{color:var(--alerta);font-weight:600}
.diagnostico-informe tfoot td{border-bottom:0;border-top:2px solid var(--tinta);font-weight:600;padding-top:14px}
.diagnostico-informe .pendiente{color:var(--senal);font-family:var(--font-informe-mono,"IBM Plex Mono"),monospace;font-size:11px;
  letter-spacing:.05em;text-transform:uppercase}
.diagnostico-informe .req{border-left:3px solid var(--alerta);padding:2px 0 2px 16px;margin-bottom:22px}
.diagnostico-informe .req h3{font-size:17px;font-weight:600;margin:0 0 4px;color:var(--tinta);letter-spacing:0;text-transform:none;font-family:var(--font-informe-sans,"IBM Plex Sans"),system-ui,sans-serif}
.diagnostico-informe .req p{color:var(--tinta2);font-size:14px;margin:0 0 6px;max-width:66ch}
.diagnostico-informe .req .tag{color:var(--tinta2)}
.diagnostico-informe ol.orden{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:20px}
.diagnostico-informe ol.orden li{display:flex;gap:16px}
.diagnostico-informe .n{color:var(--senal);font-family:var(--font-informe-mono,"IBM Plex Mono"),monospace;font-size:15px;
  font-weight:600;padding-top:2px}
.diagnostico-informe ol.orden strong{font-weight:600;color:var(--tinta)}
.diagnostico-informe ol.orden p{margin:4px 0 5px;color:var(--tinta2);font-size:14px;max-width:64ch}
.diagnostico-informe .modulo{font-family:var(--font-informe-mono,"IBM Plex Mono"),monospace;font-size:10px;letter-spacing:.06em;
  text-transform:uppercase;color:var(--senal)}
.diagnostico-informe .nota-metodo{background:var(--papel);border:1px solid var(--linea);padding:20px 22px;
  margin-top:34px;border-radius:2px}
.diagnostico-informe .nota-metodo p{color:var(--tinta2);font-size:13.5px;margin:8px 0 0;max-width:70ch}
.diagnostico-informe .nota-metodo p:first-of-type{margin-top:0}
.diagnostico-informe .pie{margin-top:38px;padding-top:24px;border-top:1px solid var(--linea)}
.diagnostico-informe .pie p{color:var(--tinta2);font-size:14px;max-width:68ch}
.diagnostico-informe .firma{font-family:var(--font-informe-mono,"IBM Plex Mono"),monospace;font-size:11px;letter-spacing:.06em;
  text-transform:uppercase;color:var(--senal);margin-top:26px}
.diagnostico-informe.diagnostico-informe--embed{
  padding:0;
  background:transparent;
}
.diagnostico-informe.diagnostico-informe--embed .cifras{margin-top:0}
@media (max-width:760px){
  .diagnostico-informe{padding:16px 12px 40px}
  .diagnostico-informe .hoja{padding:24px}
  .diagnostico-informe .cifras{grid-template-columns:1fr}
  .diagnostico-informe .grande{font-size:30px}
  .diagnostico-informe h1{font-size:26px}
  .diagnostico-informe .meta{text-align:left;white-space:normal}
}
@container informe (max-width:760px){
  .hoja{padding:24px}
  .cifras{grid-template-columns:1fr}
  .grande{font-size:30px}
  h1{font-size:26px}
  .meta{text-align:left;white-space:normal}
}
@media print{
  .diagnostico-informe{background:#fff;padding:0;font-size:10.5pt;line-height:1.45}
  .diagnostico-informe .hoja{border:0;padding:0;max-width:none}
  .diagnostico-informe .caja.medido{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .diagnostico-informe .cifras{grid-template-columns:repeat(3,1fr);gap:8px;margin:20px 0 6px}
  .diagnostico-informe .caja{padding:13px 12px}
  .diagnostico-informe .grande{font-size:19pt;margin:6px 0 4px}
  .diagnostico-informe .caja .sub{font-size:6.4pt;letter-spacing:.03em;line-height:1.35}
  .diagnostico-informe .caja .mono{font-size:7pt}
  .diagnostico-informe h1{font-size:24pt}
  .diagnostico-informe .meta{font-size:8pt}
  .diagnostico-informe .intro{font-size:10pt;margin-top:16px}
  .diagnostico-informe h2{margin:22px 0 10px}
  .diagnostico-informe table{font-size:9.5pt}
  .diagnostico-informe td{padding:8px 8px}
  .diagnostico-informe th{padding:0 8px 7px}
  .diagnostico-informe .gris,.diagnostico-informe .num{font-size:9pt}
  .diagnostico-informe tr,.diagnostico-informe .req,.diagnostico-informe ol.orden li,.diagnostico-informe .nota-metodo,.diagnostico-informe .pie,.diagnostico-informe .cifras{break-inside:avoid;page-break-inside:avoid}
  .diagnostico-informe h2{break-after:avoid;page-break-after:avoid}
  .diagnostico-informe thead{display:table-header-group}
  .diagnostico-informe tfoot{display:table-row-group}
  .diagnostico-informe .req{margin-bottom:16px}
  .diagnostico-informe ol.orden{gap:14px}
  .diagnostico-informe .nota-metodo{margin-top:24px;padding:14px 16px}
  .diagnostico-informe .pie{margin-top:26px;padding-top:18px}
}
`

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function money(model: DiagnosisInformeModel, value: number, approx = false) {
  return escapeHtml(formatInformeMoney(value, model.moneda, approx))
}

function cifra(label: string, value: string, sub: string, variant: "medido" | "estimado" | "potencial") {
  return `<div class="caja ${variant}">
      <span class="mono">${escapeHtml(label)}</span>
      <div class="grande">${value}</div>
      <span class="mono sub">${escapeHtml(sub)}</span>
    </div>`
}

export function buildDiagnosisHtml(state: LeakMapState) {
  const model = buildDiagnosisInforme(state)
  const m = (value: number, approx = false) => money(model, value, approx)
  const meta = model.meta.map((line) => escapeHtml(line)).join("<br>\n      ")
  const medidoTable =
    model.medidoRows.length === 0
      ? ""
      : `
  <h2>Dónde está el costo medido</h2>
  <table>
    <thead>
      <tr>
        <th>Concepto</th>
        <th>Cómo se calcula</th>
        <th class="der">Al mes</th>
        <th class="der">Al año</th>
      </tr>
    </thead>
    <tbody>
      ${model.medidoRows
        .map(
          (row) => `<tr>
        <td><strong>${escapeHtml(row.concepto)}</strong></td>
        <td class="gris">${escapeHtml(row.como)}</td>
        <td class="der num">${m(row.mes)}</td>
        <td class="der num fuerte">${m(row.anio)}</td>
      </tr>`,
        )
        .join("\n      ")}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2">Total verificable</td>
        <td class="der num">${m(model.medidoMes)}</td>
        <td class="der num">${m(model.medidoAnio)}</td>
      </tr>
    </tfoot>
  </table>`

  const estimadoTable =
    model.estimadoRows.length === 0
      ? ""
      : `
  <h2>Costo estimado — pendiente de confirmar</h2>
  <p class="gris" style="margin:0 0 16px;max-width:68ch">
    Estos puntos aparecieron en la reunión como problemas confirmados, pero no tenemos
    todavía el dato exacto. Las cifras de abajo son aproximaciones construidas con supuestos
    conservadores y están marcadas como tales. Con la información de la última columna se
    convierten en números reales.
  </p>
  <table>
    <thead>
      <tr>
        <th>Punto</th>
        <th>Cómo se aproximó</th>
        <th class="der">Al año</th>
        <th>Para confirmarlo</th>
      </tr>
    </thead>
    <tbody>
      ${model.estimadoRows
        .map(
          (row) => `<tr>
        <td><strong>${escapeHtml(row.punto)}</strong></td>
        <td class="gris">${escapeHtml(row.como)}</td>
        <td class="der num">${m(row.anio, true)}</td>
        <td class="pendiente">${escapeHtml(row.paraConfirmar)}</td>
      </tr>`,
        )
        .join("\n      ")}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2">Total estimado</td>
        <td class="der num">${m(model.estimadoAnio, true)}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>`

  const reqs =
    model.requerimientos.length === 0
      ? ""
      : `
  <h2>Lo que hoy no pueden hacer</h2>
  ${model.requerimientos
    .map(
      (item) => `<div class="req">
    <h3>${escapeHtml(item.nombre)}</h3>
    ${item.queNoPueden ? `<p>${escapeHtml(item.queNoPueden)}</p>` : ""}
    ${
      item.potencialAnio
        ? `<p><strong>Potencial estimado: ${m(item.potencialAnio)} al año.</strong> No es un gasto que se pueda recortar, es ingreso que la estructura actual no permite capturar.</p>`
        : ""
    }
    <span class="mono tag">${escapeHtml(item.tag)}</span>
  </div>`,
    )
    .join("\n  ")}`

  const orden =
    model.prioridades.length === 0
      ? ""
      : `
  <h2>Por dónde empezar</h2>
  <ol class="orden">
    ${model.prioridades
      .map(
        (item, index) => `<li>
      <span class="n">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${escapeHtml(item.titulo)}</strong>
        <p>${escapeHtml(item.descripcion)}</p>
        <span class="modulo">${escapeHtml(item.modulo)}</span>
      </div>
    </li>`,
      )
      .join("\n    ")}
  </ol>`

  const notas = model.notas.map((nota) => `<p>${escapeHtml(nota)}</p>`).join("\n    ")

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(model.title)}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
@page{size:A4;margin:15mm 14mm 16mm 14mm}
html,body{margin:0;background:#F4F5F2}
${DIAGNOSIS_INFORME_CSS}
</style>
</head>
<body>
<div class="diagnostico-informe">
<div class="hoja">

  <div class="cab">
    <div>
      <div class="eyebrow">Diagnóstico operativo</div>
      <h1>${escapeHtml(model.cliente)}</h1>
    </div>
    ${meta ? `<div class="mono meta">\n      ${meta}\n    </div>` : ""}
  </div>

  <p class="intro">${escapeHtml(model.intro)}</p>

  <div class="cifras">
    ${cifra("Costo medido", model.medidoAnio > 0 ? m(model.medidoAnio) : "—", "Al año · calculado sobre tus propias cifras", "medido")}
    ${cifra("Costo estimado", model.estimadoAnio > 0 ? m(model.estimadoAnio, true) : "—", "Al año · aproximado, pendiente de confirmar con tus datos", "estimado")}
    ${cifra("Potencial no capturado", model.potencialAnio > 0 ? m(model.potencialAnio) : "—", "Al año · crecimiento que la operación actual no soporta", "potencial")}
  </div>

  <p class="separador">
    Estas tres cifras están separadas a propósito y en orden de certeza. La primera es
    aritmética sobre tus números. La segunda es una aproximación que hay que confirmar. La
    tercera no es un gasto: es lo que la operación no puede capturar hoy.
  </p>
  ${medidoTable}
  ${estimadoTable}
  ${reqs}
  ${orden}

  <div class="nota-metodo">
    <span class="mono" style="color:var(--senal)">Nota sobre el método</span>
    ${notas}
  </div>

  <div class="pie">
    <h2 style="margin-top:0">Siguiente paso</h2>
    <p>${escapeHtml(model.siguientePaso)}</p>
    <div class="firma">Agent Pilot · Real Estate Pilot</div>
  </div>

</div>
</div>
</body>
</html>`
}

export function printDiagnosisInforme(state: LeakMapState) {
  if (typeof window === "undefined") return
  const html = buildDiagnosisHtml(state)
  const iframe = document.createElement("iframe")
  iframe.setAttribute("aria-hidden", "true")
  iframe.style.position = "fixed"
  iframe.style.right = "0"
  iframe.style.bottom = "0"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "0"
  document.body.appendChild(iframe)

  const win = iframe.contentWindow
  const doc = iframe.contentDocument
  if (!win || !doc) {
    iframe.remove()
    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${diagnosisSlug(state.snapshot.cliente) || "diagnostico"}.html`
    link.click()
    URL.revokeObjectURL(url)
    return
  }

  doc.open()
  doc.write(html)
  doc.close()

  const cleanup = () => iframe.remove()
  win.addEventListener("afterprint", cleanup)
  const kick = () => {
    win.focus()
    win.print()
  }
  if (doc.fonts?.ready) {
    void doc.fonts.ready.then(kick).catch(kick)
  } else {
    window.setTimeout(kick, 400)
  }
}
