export type LeakMapMoneda = "COP" | "USD"
export type LeakMapVista = "recorrido" | "informe"
export type PasoMark = "ok" | "mal" | "no" | ""
export type LeakTipo = "rec" | "ev" | "ti" | "co"
export type LeakOrigen = "tercero" | "reunion" | "sin"
export type LeakAccion = "proceso" | "cancelar" | "renegociar" | "terminar" | "salir" | "capturar"
export type LeakBox = "proceso" | "decision" | "potencial" | "exposicion"

export type DiagnosticoMark = {
  s: PasoMark
  n: string
}

export type DiagnosticoLeak = {
  id: string
  nombre: string
  tipo: LeakTipo
  mes: string
  eventos: string
  costo: string
  hsem: string
  piso: string
  tope: string
  casos: string
  norma: string
  origen: LeakOrigen
  accion: LeakAccion
  nota: string
  ay: string
}

export type LeakMapState = {
  cliente: string
  fecha: string
  unidades: string
  moneda: LeakMapMoneda
  ciudades: string
  canales: string
  software: string
  pago: string
  personas: string
  horas: string
  marks: Record<string, DiagnosticoMark>
  leaks: DiagnosticoLeak[]
}

export type SavedDiagnosis = {
  id: string
  clientName: string
  updatedAt: string
  meetingTime: string | null
  source: "inbound" | "airbnb" | null
  leadLabel: string | null
  submissionId: string | null
  airbnbLeadId: string | null
}

export type TrazaPasoDef = {
  nombre: string
  pregunta: string
}

export type TrazaDef = {
  id: string
  titulo: string
  sub: string
  pasos: TrazaPasoDef[]
}

export const TRAZAS: TrazaDef[] = [
  {
    id: "h",
    titulo: "El huésped",
    sub: "desde que te busca hasta que vuelve",
    pasos: [
      { nombre: "Te encuentra", pregunta: "¿Por dónde llega la gente hoy?" },
      { nombre: "Pregunta", pregunta: "¿Quién responde los mensajes y a qué horas?" },
      { nombre: "Precio", pregunta: "¿Cómo decides lo que cobras cada noche?" },
      { nombre: "Reserva", pregunta: "¿Qué pasa entre que reserva y que llega?" },
      { nombre: "Entrada", pregunta: "¿Cómo recoges documentos y entregas el acceso?" },
      { nombre: "Estadía", pregunta: "¿Qué pasa si escribe a las once de la noche?" },
      { nombre: "Salida", pregunta: "¿Cómo te enteras de que ya se fue?" },
      { nombre: "Reseña y regreso", pregunta: "¿Sabes cuántos vuelven?" },
    ],
  },
  {
    id: "d",
    titulo: "El dinero",
    sub: "desde que entra hasta que cuadra",
    pasos: [
      { nombre: "Entra el pago", pregunta: "¿Por dónde entra y quién lo confirma?" },
      { nombre: "Comisiones", pregunta: "¿Cuánto se queda cada canal?" },
      { nombre: "Gastos", pregunta: "¿Cómo se registra una compra pequeña?" },
      { nombre: "Facturas y servicios", pregunta: "¿Quién revisa lo que llega cada mes?" },
      { nombre: "Propietarios e inversionistas", pregunta: "¿Cómo armas lo que les entregas?" },
      { nombre: "Cuadre", pregunta: "¿Cuándo sabes si el mes cerró bien?" },
    ],
  },
  {
    id: "p",
    titulo: "La propiedad",
    sub: "desde que entra al inventario",
    pasos: [
      { nombre: "Alta", pregunta: "¿Qué hay que hacer para poner una nueva a producir?" },
      { nombre: "Publicación", pregunta: "¿Quién la sube y la mantiene actualizada?" },
      { nombre: "Limpieza", pregunta: "¿Cómo se asigna y cómo sabes que quedó lista?" },
      { nombre: "Mantenimiento", pregunta: "¿Esperas a que se dañe o está programado?" },
      { nombre: "Inventario y lencería", pregunta: "¿Sabes qué hay hoy en cada propiedad?" },
      { nombre: "Cierre del mes", pregunta: "¿Cuánto tiempo te toma saber cómo fue el mes?" },
    ],
  },
]

export const ACCIONES: Array<{ id: LeakAccion; l: string; b: LeakBox; v: string }> = [
  { id: "proceso", l: "Poner un proceso", b: "proceso", v: "poner un proceso que hoy no existe" },
  { id: "cancelar", l: "Cancelar una herramienta", b: "decision", v: "cancelar la suscripción" },
  { id: "renegociar", l: "Renegociar con el proveedor", b: "decision", v: "renegociar los términos" },
  { id: "terminar", l: "Terminar el contrato", b: "decision", v: "terminar el contrato" },
  { id: "salir", l: "Salir de la plataforma", b: "decision", v: "sacar las propiedades de la plataforma" },
  { id: "capturar", l: "Capturar el ingreso", b: "potencial", v: "salir a capturar ese ingreso" },
]

export const ORIGENES: Array<{ id: LeakOrigen; l: string; c: "ok" | "mid" | "bad"; n: string }> = [
  { id: "tercero", l: "Precio verificable", c: "ok", n: "Contrastable contra una factura, un contrato o una norma." },
  { id: "reunion", l: "Dato de esta reunión", c: "mid", n: "Sale de lo que revisamos hoy. Conviene contrastarlo con los últimos meses." },
  { id: "sin", l: "Sin confirmar", c: "bad", n: "No entra a ninguna cifra mientras siga sin confirmarse." },
]

export const TIPOS: Array<{ id: LeakTipo; l: string }> = [
  { id: "rec", l: "Sale todos los meses" },
  { id: "ev", l: "Sale cada vez que pasa algo" },
  { id: "ti", l: "Es tiempo de tu equipo" },
  { id: "co", l: "Solo sale si ocurre un riesgo" },
]

export const SIRE_LEAK: Omit<DiagnosticoLeak, "id"> = {
  nombre: "Huéspedes extranjeros sin reportar al SIRE",
  tipo: "co",
  mes: "",
  eventos: "",
  costo: "",
  hsem: "",
  piso: "5512000",
  tope: "137812000",
  casos: "",
  norma:
    "Resolución 2357 de 2020, artículo 15, infracción moderada número 10. Entre 105,25 y 2.631,30 UVT; la UVT de 2026 es $52.374. La sanción se agrava según el número de extranjeros no reportados.",
  origen: "tercero",
  accion: "proceso",
  nota: "",
  ay: "",
}

const ACC_BY_ID = new Map(ACCIONES.map((item) => [item.id, item]))
const ORI_BY_ID = new Map(ORIGENES.map((item) => [item.id, item]))
const MARK_KEYS = new Set(
  TRAZAS.flatMap((traza) => traza.pasos.map((_, index) => markKey(traza.id, index))),
)

export function markKey(trazaId: string, index: number) {
  return `${trazaId}${index}`
}

export function todayBogotaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

export function bogotaDateFromIso(iso: string | null | undefined) {
  if (!iso) return todayBogotaDate()
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return todayBogotaDate()
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

export function diagnosisSlug(clientName: string) {
  return clientName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function uniqueDiagnosisSlug(clientName: string) {
  const base = diagnosisSlug(clientName) || "diagnostico"
  return `${base}-${Date.now().toString(36)}`
}

export function newLeakId(prefix = "leak") {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  return `${prefix}-${random}`
}

export function createEmptyLeakMap(fecha = todayBogotaDate()): LeakMapState {
  return {
    cliente: "",
    fecha,
    unidades: "",
    moneda: "COP",
    ciudades: "",
    canales: "",
    software: "",
    pago: "",
    personas: "1",
    horas: "48",
    marks: {},
    leaks: [],
  }
}

export function emptyLeak(partial?: Partial<DiagnosticoLeak>): DiagnosticoLeak {
  return {
    id: partial?.id ?? newLeakId(),
    nombre: partial?.nombre ?? "",
    tipo: partial?.tipo ?? "rec",
    mes: partial?.mes ?? "",
    eventos: partial?.eventos ?? "",
    costo: partial?.costo ?? "",
    hsem: partial?.hsem ?? "",
    piso: partial?.piso ?? "",
    tope: partial?.tope ?? "",
    casos: partial?.casos ?? "",
    norma: partial?.norma ?? "",
    origen: partial?.origen ?? "reunion",
    accion: partial?.accion ?? "proceso",
    nota: partial?.nota ?? "",
    ay: partial?.ay ?? "",
  }
}

export function num(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

export function formatLeakMoney(value: number, moneda: LeakMapMoneda) {
  const rounded = Math.round(Number.isFinite(value) ? value : 0)
  if (moneda === "USD") return `US$${rounded.toLocaleString("en-US")}`
  return `$${rounded.toLocaleString("es-CO")}`
}

export function tarifaHora(state: LeakMapState) {
  const personas = Math.max(1, num(state.personas))
  const horas = Math.max(1, num(state.horas))
  const horasMes = personas * horas * 4.33
  return horasMes > 0 ? num(state.pago) / horasMes : 0
}

export function horasMesEquipo(state: LeakMapState) {
  const personas = Math.max(1, num(state.personas))
  const horas = Math.max(1, num(state.horas))
  return Math.round(personas * horas * 4.33)
}

export function accOf(id: LeakAccion | string) {
  return ACC_BY_ID.get(id as LeakAccion) ?? ACCIONES[0]
}

export function oriOf(id: LeakOrigen | string) {
  return ORI_BY_ID.get(id as LeakOrigen) ?? ORIGENES[1]
}

export function cuentaLeak(leak: DiagnosticoLeak) {
  return leak.origen !== "sin"
}

export function anualLeak(leak: DiagnosticoLeak, tarifa: number) {
  if (leak.tipo === "rec") return num(leak.mes) * 12
  if (leak.tipo === "ev") return num(leak.eventos) * num(leak.costo)
  if (leak.tipo === "ti") return num(leak.hsem) * 4.33 * tarifa * 12
  return 0
}

export function explicaLeak(leak: DiagnosticoLeak, tarifa: number, moneda: LeakMapMoneda) {
  if (leak.tipo === "rec") return `${formatLeakMoney(num(leak.mes), moneda)} al mes × 12`
  if (leak.tipo === "ev") {
    return `${num(leak.eventos)} veces al año × ${formatLeakMoney(num(leak.costo), moneda)}`
  }
  if (leak.tipo === "ti") {
    return `${num(leak.hsem)} h por semana × 4,33 × ${formatLeakMoney(tarifa, moneda)} la hora × 12`
  }
  return "Rango de la norma"
}

export function boxOf(leak: DiagnosticoLeak): LeakBox {
  return leak.tipo === "co" ? "exposicion" : accOf(leak.accion).b
}

export function leakDisplayValue(leak: DiagnosticoLeak, tarifa: number, moneda: LeakMapMoneda) {
  if (!cuentaLeak(leak)) return "—"
  if (leak.tipo === "co") {
    const tope = num(leak.tope)
    return tope ? `hasta ${formatLeakMoney(tope, moneda)}` : "—"
  }
  return formatLeakMoney(anualLeak(leak, tarifa), moneda)
}

export function eventosFromRotacion(ay: string) {
  const match = ay.match(/([\d.]+)\s*\/\s*([\d.]+)/)
  if (!match) return null
  const unidades = Number(match[1])
  const estadia = Number(match[2])
  if (!(unidades > 0 && estadia > 0)) return null
  return Math.round((unidades * 12) / estadia)
}

export type DiagnosticoTotales = {
  tarifa: number
  proceso: number
  decision: number
  potencial: number
  exposicion: number
}

export function calculateDiagnostico(state: LeakMapState): DiagnosticoTotales {
  const tarifa = tarifaHora(state)
  const totals: DiagnosticoTotales = {
    tarifa,
    proceso: 0,
    decision: 0,
    potencial: 0,
    exposicion: 0,
  }
  for (const leak of state.leaks) {
    if (!cuentaLeak(leak)) continue
    if (leak.tipo === "co") {
      totals.exposicion += num(leak.tope)
      continue
    }
    const box = boxOf(leak)
    if (box === "proceso" || box === "decision" || box === "potencial") {
      totals[box] += anualLeak(leak, tarifa)
    }
  }
  return totals
}

export function pasosRevisados(state: LeakMapState, traza: TrazaDef) {
  return traza.pasos.filter((_, index) => Boolean(state.marks[markKey(traza.id, index)]?.s)).length
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function asString(value: unknown, fallback = "") {
  if (typeof value === "string") return value
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return fallback
}

function asMoneda(value: unknown): LeakMapMoneda {
  return value === "USD" ? "USD" : "COP"
}

function asMark(value: unknown): PasoMark {
  return value === "ok" || value === "mal" || value === "no" ? value : ""
}

function asTipo(value: unknown): LeakTipo {
  return value === "rec" || value === "ev" || value === "ti" || value === "co" ? value : "rec"
}

function asOrigen(value: unknown): LeakOrigen {
  return value === "tercero" || value === "reunion" || value === "sin" ? value : "reunion"
}

function asAccion(value: unknown): LeakAccion {
  if (
    value === "proceso" ||
    value === "cancelar" ||
    value === "renegociar" ||
    value === "terminar" ||
    value === "salir" ||
    value === "capturar"
  ) {
    return value
  }
  return "proceso"
}

function mergeMarks(raw: unknown): Record<string, DiagnosticoMark> {
  const data = asRecord(raw)
  if (!data) return {}
  const marks: Record<string, DiagnosticoMark> = {}
  for (const [key, value] of Object.entries(data)) {
    if (!MARK_KEYS.has(key)) continue
    const record = asRecord(value)
    if (!record) continue
    const s = asMark(record.s)
    const n = asString(record.n)
    if (!s && !n) continue
    marks[key] = { s, n }
  }
  return marks
}

function mergeLeaks(raw: unknown): DiagnosticoLeak[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((item) => {
    const record = asRecord(item)
    if (!record) return []
    const id = asString(record.id)
    if (!id) return []
    return [
      {
        id,
        nombre: asString(record.nombre),
        tipo: asTipo(record.tipo),
        mes: asString(record.mes),
        eventos: asString(record.eventos),
        costo: asString(record.costo),
        hsem: asString(record.hsem),
        piso: asString(record.piso),
        tope: asString(record.tope),
        casos: asString(record.casos),
        norma: asString(record.norma),
        origen: asOrigen(record.origen),
        accion: asAccion(record.accion),
        nota: asString(record.nota),
        ay: asString(record.ay),
      },
    ]
  })
}

function snapshotFromLegacy(raw: Record<string, unknown> | null) {
  if (!raw) return null
  return {
    cliente: asString(raw.cliente),
    fecha: asString(raw.fecha),
    unidades: asString(raw.unidades || raw.propiedades),
    ciudades: asString(raw.ciudades),
    canales: asString(raw.canales),
    software: asString(raw.software),
  }
}

export function hydrateLeakMap(raw: unknown): LeakMapState {
  const empty = createEmptyLeakMap()
  const data = asRecord(raw)
  if (!data) return empty

  const legacySnapshot = snapshotFromLegacy(asRecord(data.snapshot))
  const config = asRecord(data.config)
  const isNew = "leaks" in data || "marks" in data || "pago" in data || "cliente" in data

  const cliente = isNew ? asString(data.cliente, legacySnapshot?.cliente) : asString(legacySnapshot?.cliente)
  const fecha = asString(isNew ? data.fecha : legacySnapshot?.fecha, empty.fecha) || empty.fecha

  return {
    cliente,
    fecha,
    unidades: asString(isNew ? data.unidades : legacySnapshot?.unidades),
    moneda: asMoneda(isNew ? data.moneda : config?.moneda),
    ciudades: asString(isNew ? data.ciudades : legacySnapshot?.ciudades),
    canales: asString(isNew ? data.canales : legacySnapshot?.canales),
    software: asString(isNew ? data.software : legacySnapshot?.software),
    pago: asString(data.pago),
    personas: asString(data.personas, empty.personas) || empty.personas,
    horas: asString(data.horas, empty.horas) || empty.horas,
    marks: mergeMarks(data.marks),
    leaks: mergeLeaks(data.leaks),
  }
}
