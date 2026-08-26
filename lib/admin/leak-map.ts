export const AREA_IDS = [
  "comunicacion",
  "housekeeping",
  "inventario",
  "finanzas",
  "admin",
  "datos",
  "documentacion",
  "reportes",
] as const

export type AreaId = (typeof AREA_IDS)[number]
export type FrecuenciaId = "dia" | "semana" | "mes"
export type LeakMapMoneda = "COP" | "USD"
export type LeakMapVista = "consulta" | "informe"

export type AreaBase = {
  id: AreaId
  nombre: string
  modulo: string
  pregunta: string
}

export type AreaState = AreaBase & {
  activo: boolean
  hoy: string
  quien: string
  horas: string
  frecuencia: FrecuenciaId
  rompe: string
  indirecto: string
  severidad: number
  velocidad: number
}

export type LeakMapSnapshot = {
  cliente: string
  fecha: string
  propiedades: string
  ciudades: string
  canales: string
  equipo: string
  software: string
  ocupacion: string
  adr: string
}

export type LeakMapConfig = {
  moneda: LeakMapMoneda
  tarifa: string
}

export type TrazaId = "huesped" | "dinero" | "propiedad"
export type PasoEstado = "" | "friccion" | "hueco"
export type RequerimientoImpacto = "ingreso" | "crecimiento" | "legal" | "propietarios"
export type RequerimientoClasificacion = "base" | "adicional" | "fuera"

export type TrazaPasoDef = {
  id: string
  label: string
  areaId?: AreaId
}

export type TrazaDef = {
  id: TrazaId
  nombre: string
  pasos: TrazaPasoDef[]
}

export type TrazaPasoState = {
  id: string
  estado: PasoEstado
  nota: string
  requerimientoId: string | null
}

export type TrazaState = {
  id: TrazaId
  pasos: TrazaPasoState[]
}

export type Requerimiento = {
  id: string
  nombre: string
  queNoPueden: string
  impacto: RequerimientoImpacto | ""
  valorMes: string
  clasificacion: RequerimientoClasificacion | ""
  origenTrazaId: TrazaId | null
  origenPasoId: string | null
}

export type LeakMapState = {
  snapshot: LeakMapSnapshot
  config: LeakMapConfig
  areas: AreaState[]
  trazas: TrazaState[]
  requerimientos: Requerimiento[]
}

export type LeakMapRow = AreaState & {
  horasMes: number
  directo: number
  fugaMes: number
  indirectoMes: number
}

export type LeakMapCalc = {
  filas: LeakMapRow[]
  horas: number
  directo: number
  indirecto: number
  total: number
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

export const AREAS_BASE: AreaBase[] = [
  {
    id: "comunicacion",
    nombre: "Comunicación con huéspedes",
    modulo: "Chatbot omnicanal",
    pregunta:
      "¿Quién responde los mensajes? ¿A qué horas entran? ¿Qué pasa cuando nadie contesta en 20 minutos?",
  },
  {
    id: "housekeeping",
    nombre: "Housekeeping y mantenimiento",
    modulo: "Sistema de housekeeping",
    pregunta:
      "¿Cómo se asignan las limpiezas? ¿Cómo sabes que quedó lista? ¿Cuántas veces al mes se cruza un check-in con una limpieza sin terminar?",
  },
  {
    id: "inventario",
    nombre: "Inventario y lencería",
    modulo: "Mini-ERP de bodega",
    pregunta:
      "¿Sabes hoy cuántos juegos de sábanas tienes y dónde están? ¿Cuánto reponen al año por pérdida o descuadre?",
  },
  {
    id: "finanzas",
    nombre: "Facturación, gastos y proveedores",
    modulo: "Finanzas automáticas",
    pregunta:
      "¿Cómo se registra un gasto hoy? ¿Cuándo se enteran de que un gasto se salió de presupuesto: el mismo día o a fin de mes?",
  },
  {
    id: "admin",
    nombre: "Gestión administrativa diaria",
    modulo: "Asistente administrativo",
    pregunta:
      "¿Cuántas veces al día alguien tiene que abrir el computador para hacer algo que podría hacer desde el celular?",
  },
  {
    id: "datos",
    nombre: "Datos y decisiones",
    modulo: "Business Intelligence",
    pregunta:
      "¿Sabes cuál de tus propiedades es la más rentable? ¿Con qué dato tomaste tu última decisión de precio?",
  },
  {
    id: "documentacion",
    nombre: "Documentación y cumplimiento",
    modulo: "App de huésped + regulatorio",
    pregunta:
      "¿Cómo recogen los documentos del huésped? ¿Qué pasa si les cae una revisión y falta un registro?",
  },
  {
    id: "reportes",
    nombre: "Reportes a propietarios",
    modulo: "Reportes automáticos",
    pregunta:
      "¿Cuántos días del mes se van armando reportes? ¿Has perdido un propietario por falta de claridad?",
  },
]

export const FRECUENCIAS: Array<{ id: FrecuenciaId; label: string; mult: number }> = [
  { id: "dia", label: "al día", mult: 30 },
  { id: "semana", label: "a la semana", mult: 4.33 },
  { id: "mes", label: "al mes", mult: 1 },
]

export const TRAZAS_BASE: TrazaDef[] = [
  {
    id: "huesped",
    nombre: "Traza del huésped",
    pasos: [
      { id: "huesped:encuentra", label: "Cómo te encuentra", areaId: "datos" },
      { id: "huesped:consulta", label: "Consulta", areaId: "comunicacion" },
      { id: "huesped:cotizacion", label: "Cotización", areaId: "comunicacion" },
      { id: "huesped:reserva", label: "Reserva", areaId: "admin" },
      { id: "huesped:pago", label: "Pago", areaId: "finanzas" },
      { id: "huesped:checkin", label: "Check-in", areaId: "documentacion" },
      { id: "huesped:estadia", label: "Estadía", areaId: "comunicacion" },
      { id: "huesped:checkout", label: "Checkout", areaId: "housekeeping" },
      { id: "huesped:resena", label: "Reseña", areaId: "comunicacion" },
      { id: "huesped:recompra", label: "Recompra", areaId: "datos" },
    ],
  },
  {
    id: "dinero",
    nombre: "Traza del dinero",
    pasos: [
      { id: "dinero:entra-reserva", label: "Entra la reserva", areaId: "admin" },
      { id: "dinero:quien-cobra", label: "Quién cobra", areaId: "finanzas" },
      { id: "dinero:entra-plata", label: "Por dónde entra la plata", areaId: "finanzas" },
      { id: "dinero:comisiones", label: "Comisiones", areaId: "finanzas" },
      { id: "dinero:gastos", label: "Gastos", areaId: "finanzas" },
      { id: "dinero:liquidacion", label: "Liquidación al propietario", areaId: "reportes" },
      { id: "dinero:impuestos", label: "Impuestos", areaId: "finanzas" },
      { id: "dinero:conciliacion", label: "Conciliación", areaId: "finanzas" },
    ],
  },
  {
    id: "propiedad",
    nombre: "Traza de la propiedad",
    pasos: [
      { id: "propiedad:firma", label: "Propietario firma", areaId: "documentacion" },
      { id: "propiedad:onboarding", label: "Onboarding", areaId: "admin" },
      { id: "propiedad:publicacion", label: "Publicación", areaId: "admin" },
      { id: "propiedad:operacion", label: "Operación diaria", areaId: "housekeeping" },
      { id: "propiedad:reporte", label: "Reporte mensual", areaId: "reportes" },
      { id: "propiedad:renovacion", label: "Renovación o salida", areaId: "reportes" },
    ],
  },
]

export const IMPACTO_OPTIONS: Array<{ id: RequerimientoImpacto; label: string }> = [
  { id: "ingreso", label: "Ingreso no capturado" },
  { id: "crecimiento", label: "Bloquea crecimiento" },
  { id: "legal", label: "Riesgo legal o regulatorio" },
  { id: "propietarios", label: "Fricción con propietarios" },
]

export const CLASIFICACION_OPTIONS: Array<{ id: RequerimientoClasificacion; label: string }> = [
  { id: "base", label: "Dentro del base" },
  { id: "adicional", label: "Desarrollo adicional" },
  { id: "fuera", label: "Fuera de alcance" },
]

export const CLASIFICACION_ORDER: RequerimientoClasificacion[] = ["base", "adicional", "fuera"]

const TRAZA_ID_SET = new Set<string>(TRAZAS_BASE.map((item) => item.id))
const PASO_DEF_BY_ID = new Map(
  TRAZAS_BASE.flatMap((traza) => traza.pasos.map((paso) => [paso.id, { traza, paso }] as const)),
)

const FRECUENCIA_MULT = new Map(FRECUENCIAS.map((item) => [item.id, item.mult]))
const AREA_ID_SET = new Set<string>(AREA_IDS)

export function todayBogotaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

function emptyAreaFields(): Omit<AreaState, keyof AreaBase> {
  return {
    activo: false,
    hoy: "",
    quien: "",
    horas: "",
    frecuencia: "semana",
    rompe: "",
    indirecto: "",
    severidad: 0,
    velocidad: 3,
  }
}

function emptyPaso(id: string): TrazaPasoState {
  return { id, estado: "", nota: "", requerimientoId: null }
}

function emptyTrazas(): TrazaState[] {
  return TRAZAS_BASE.map((traza) => ({
    id: traza.id,
    pasos: traza.pasos.map((paso) => emptyPaso(paso.id)),
  }))
}

export function createEmptyLeakMap(): LeakMapState {
  return {
    snapshot: {
      cliente: "",
      fecha: todayBogotaDate(),
      propiedades: "",
      ciudades: "",
      canales: "",
      equipo: "",
      software: "",
      ocupacion: "",
      adr: "",
    },
    config: { moneda: "COP", tarifa: "25000" },
    areas: AREAS_BASE.map((area) => ({ ...area, ...emptyAreaFields() })),
    trazas: emptyTrazas(),
    requerimientos: [],
  }
}

export function newLeakId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  return `${prefix}-${random}`
}

export function emptyRequerimiento(partial?: Partial<Requerimiento>): Requerimiento {
  return {
    id: partial?.id ?? newLeakId("req"),
    nombre: partial?.nombre ?? "",
    queNoPueden: partial?.queNoPueden ?? "",
    impacto: partial?.impacto ?? "",
    valorMes: partial?.valorMes ?? "",
    clasificacion: partial?.clasificacion ?? "",
    origenTrazaId: partial?.origenTrazaId ?? null,
    origenPasoId: partial?.origenPasoId ?? null,
  }
}

export function findPasoDef(pasoId: string) {
  return PASO_DEF_BY_ID.get(pasoId) ?? null
}

export function trazaNombre(id: TrazaId) {
  return TRAZAS_BASE.find((item) => item.id === id)?.nombre ?? id
}

export function nextPasoEstado(estado: PasoEstado): PasoEstado {
  if (estado === "") return "friccion"
  if (estado === "friccion") return "hueco"
  return ""
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

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function asFrecuencia(value: unknown): FrecuenciaId {
  if (value === "dia" || value === "semana" || value === "mes") return value
  return "semana"
}

function asMoneda(value: unknown): LeakMapMoneda {
  return value === "USD" ? "USD" : "COP"
}

function asTrazaId(value: unknown): TrazaId | null {
  return value === "huesped" || value === "dinero" || value === "propiedad" ? value : null
}

function asPasoEstado(value: unknown): PasoEstado {
  return value === "friccion" || value === "hueco" ? value : ""
}

function asImpacto(value: unknown): RequerimientoImpacto | "" {
  if (value === "ingreso" || value === "crecimiento" || value === "legal" || value === "propietarios") {
    return value
  }
  return ""
}

function asClasificacion(value: unknown): RequerimientoClasificacion | "" {
  if (value === "base" || value === "adicional" || value === "fuera") return value
  return ""
}

function mergeTrazas(raw: unknown): TrazaState[] {
  const saved = Array.isArray(raw) ? raw : []
  const savedByTraza = new Map<string, Map<string, unknown>>()
  for (const item of saved) {
    const record = asRecord(item)
    const trazaId = asString(record?.id)
    if (!TRAZA_ID_SET.has(trazaId)) continue
    const pasos = Array.isArray(record?.pasos) ? record.pasos : []
    const byPaso = new Map<string, unknown>()
    for (const paso of pasos) {
      const pasoRecord = asRecord(paso)
      const pasoId = asString(pasoRecord?.id)
      if (pasoId) byPaso.set(pasoId, paso)
    }
    savedByTraza.set(trazaId, byPaso)
  }

  return TRAZAS_BASE.map((traza) => {
    const byPaso = savedByTraza.get(traza.id)
    return {
      id: traza.id,
      pasos: traza.pasos.map((paso) => {
        const prev = asRecord(byPaso?.get(paso.id))
        if (!prev) return emptyPaso(paso.id)
        return {
          id: paso.id,
          estado: asPasoEstado(prev.estado),
          nota: asString(prev.nota),
          requerimientoId: asString(prev.requerimientoId) || null,
        }
      }),
    }
  })
}

function mergeRequerimientos(raw: unknown): Requerimiento[] {
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
        queNoPueden: asString(record.queNoPueden),
        impacto: asImpacto(record.impacto),
        valorMes: asString(record.valorMes, record.valorMes != null ? String(record.valorMes) : ""),
        clasificacion: asClasificacion(record.clasificacion),
        origenTrazaId: asTrazaId(record.origenTrazaId),
        origenPasoId: asString(record.origenPasoId) || null,
      },
    ]
  })
}

function mergeArea(base: AreaBase, raw: unknown): AreaState {
  const prev = asRecord(raw)
  if (!prev) return { ...base, ...emptyAreaFields() }

  const severidad = Math.min(5, Math.max(0, Math.round(asNumber(prev.severidad, 0))))
  const velocidad = Math.min(5, Math.max(1, Math.round(asNumber(prev.velocidad, 3))))

  return {
    ...base,
    activo: Boolean(prev.activo),
    hoy: asString(prev.hoy),
    quien: asString(prev.quien),
    horas: asString(prev.horas, prev.horas != null ? String(prev.horas) : ""),
    frecuencia: asFrecuencia(prev.frecuencia),
    rompe: asString(prev.rompe),
    indirecto: asString(prev.indirecto, prev.indirecto != null ? String(prev.indirecto) : ""),
    severidad,
    velocidad,
  }
}

export function hydrateLeakMap(raw: unknown): LeakMapState {
  const empty = createEmptyLeakMap()
  const data = asRecord(raw)
  if (!data) return empty

  const snapshotRaw = asRecord(data.snapshot)
  const configRaw = asRecord(data.config)
  const savedAreas = Array.isArray(data.areas) ? data.areas : []
  const byId = new Map<string, unknown>()
  for (const item of savedAreas) {
    const record = asRecord(item)
    const id = asString(record?.id)
    if (AREA_ID_SET.has(id)) byId.set(id, item)
  }

  const tarifaValue = configRaw?.tarifa
  const tarifa =
    typeof tarifaValue === "number" && Number.isFinite(tarifaValue)
      ? String(tarifaValue)
      : asString(tarifaValue, empty.config.tarifa)

  return {
    snapshot: {
      cliente: asString(snapshotRaw?.cliente),
      fecha: asString(snapshotRaw?.fecha, empty.snapshot.fecha),
      propiedades: asString(snapshotRaw?.propiedades),
      ciudades: asString(snapshotRaw?.ciudades),
      canales: asString(snapshotRaw?.canales),
      equipo: asString(snapshotRaw?.equipo),
      software: asString(snapshotRaw?.software),
      ocupacion: asString(snapshotRaw?.ocupacion),
      adr: asString(snapshotRaw?.adr),
    },
    config: {
      moneda: asMoneda(configRaw?.moneda),
      tarifa,
    },
    areas: AREAS_BASE.map((base) => mergeArea(base, byId.get(base.id))),
    trazas: mergeTrazas(data.trazas),
    requerimientos: mergeRequerimientos(data.requerimientos),
  }
}

export function areaHoursMonth(horas: string, frecuencia: FrecuenciaId) {
  const mult = FRECUENCIA_MULT.get(frecuencia) ?? 1
  return (parseFloat(horas) || 0) * mult
}

export function calculateLeakMap(state: LeakMapState): LeakMapCalc {
  const tarifa = parseFloat(state.config.tarifa) || 0
  const filas = state.areas
    .filter((area) => area.activo)
    .map((area) => {
      const horasMes = areaHoursMonth(area.horas, area.frecuencia)
      const directo = horasMes * tarifa
      const indirectoMes = parseFloat(area.indirecto) || 0
      return {
        ...area,
        horasMes,
        directo,
        indirectoMes,
        fugaMes: directo + indirectoMes,
      }
    })
    .sort((a, b) => b.fugaMes - a.fugaMes)

  return {
    filas,
    horas: filas.reduce((sum, row) => sum + row.horasMes, 0),
    directo: filas.reduce((sum, row) => sum + row.directo, 0),
    indirecto: filas.reduce((sum, row) => sum + row.indirectoMes, 0),
    total: filas.reduce((sum, row) => sum + row.fugaMes, 0),
  }
}

export function formatLeakMoney(value: number, moneda: LeakMapMoneda) {
  const rounded = Math.round(value)
  if (moneda === "USD") return `US$${rounded.toLocaleString("en-US")}`
  return `$${rounded.toLocaleString("es-CO")}`
}

export function calculateRequerimientos(requerimientos: Requerimiento[]) {
  const cuantificados = requerimientos.filter((item) => (parseFloat(item.valorMes) || 0) > 0)
  return {
    count: requerimientos.length,
    cuantificados: cuantificados.length,
    mes: cuantificados.reduce((sum, item) => sum + (parseFloat(item.valorMes) || 0), 0),
  }
}

export function hasMarkedPasos(trazas: TrazaState[]) {
  return trazas.some((traza) => traza.pasos.some((paso) => paso.estado !== ""))
}

export function impactoLabel(id: RequerimientoImpacto | "") {
  return IMPACTO_OPTIONS.find((item) => item.id === id)?.label ?? ""
}

export function clasificacionLabel(id: RequerimientoClasificacion | "") {
  return CLASIFICACION_OPTIONS.find((item) => item.id === id)?.label ?? "Sin clasificar"
}
