"use client"

import {
  TRAZAS,
  accOf,
  anualLeak,
  boxOf,
  cuentaLeak,
  explicaLeak,
  formatLeakMoney,
  horasMesEquipo,
  leakDisplayValue,
  markKey,
  num,
  oriOf,
  pasosRevisados,
  tarifaHora,
  type DiagnosticoLeak,
  type DiagnosticoMark,
  type LeakMapState,
  type PasoMark,
} from "@/lib/admin/leak-map"
import {
  LeakCampos,
  SegmentosAccion,
  SegmentosOrigen,
  SegmentosTipo,
} from "@/components/admin/diagnostico-leak-fields"

type RecorridoProps = {
  state: LeakMapState
  openLeakId: string | null
  reveal: boolean
  onField: (key: keyof LeakMapState, value: string) => void
  onMark: (key: string, s: PasoMark) => void
  onNote: (key: string, n: string) => void
  onFromStep: (key: string, nombre: string) => void
  onToggleLeak: (id: string) => void
  onChangeLeak: (id: string, key: keyof DiagnosticoLeak, value: string) => void
  onRotacion: (id: string, value: string) => void
  onAddLeak: () => void
  onAddSire: () => void
  onDeleteLeak: (id: string) => void
  onReveal: () => void
}

export function MapaDeFugasConsulta({
  state,
  openLeakId,
  reveal,
  onField,
  onMark,
  onNote,
  onFromStep,
  onToggleLeak,
  onChangeLeak,
  onRotacion,
  onAddLeak,
  onAddSire,
  onDeleteLeak,
  onReveal,
}: RecorridoProps) {
  const tarifa = tarifaHora(state)
  const personas = Math.max(1, num(state.personas))
  const horas = Math.max(1, num(state.horas))
  const money = (value: number) => formatLeakMoney(value, state.moneda)
  const mask = reveal ? "" : " masked"

  let proceso = 0
  let decision = 0
  let potencial = 0
  let exposicion = 0
  for (const leak of state.leaks.filter(cuentaLeak)) {
    if (leak.tipo === "co") exposicion += num(leak.tope)
    else {
      const box = boxOf(leak)
      if (box === "proceso") proceso += anualLeak(leak, tarifa)
      if (box === "decision") decision += anualLeak(leak, tarifa)
      if (box === "potencial") potencial += anualLeak(leak, tarifa)
    }
  }

  return (
    <div className="cols">
      <div>
        <section className="block">
          <h2>Tu operación</h2>
          <p className="lede">Los datos generales, para dimensionar todo lo que sigue.</p>
          <div className="panel">
            <div className="grid g4">
              <label className="f">
                <span>Empresa</span>
                <input value={state.cliente} onChange={(event) => onField("cliente", event.target.value)} />
              </label>
              <label className="f">
                <span>Fecha</span>
                <input
                  type="date"
                  value={state.fecha}
                  onChange={(event) => onField("fecha", event.target.value)}
                />
              </label>
              <label className="f">
                <span>Unidades</span>
                <input
                  value={state.unidades}
                  placeholder="27 apartamentos"
                  onChange={(event) => onField("unidades", event.target.value)}
                />
              </label>
              <label className="f">
                <span>Moneda</span>
                <select value={state.moneda} onChange={(event) => onField("moneda", event.target.value)}>
                  <option value="COP">COP</option>
                  <option value="USD">USD</option>
                </select>
              </label>
            </div>
            <div className="grid g3" style={{ marginTop: 12 }}>
              <label className="f">
                <span>Ciudades</span>
                <input value={state.ciudades} onChange={(event) => onField("ciudades", event.target.value)} />
              </label>
              <label className="f">
                <span>Canales de venta</span>
                <input
                  value={state.canales}
                  placeholder="Airbnb, Booking, directo"
                  onChange={(event) => onField("canales", event.target.value)}
                />
              </label>
              <label className="f">
                <span>Herramientas que usas</span>
                <input
                  value={state.software}
                  placeholder="Excel, WhatsApp, un PMS…"
                  onChange={(event) => onField("software", event.target.value)}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="block">
          <h2>Cuánto cuesta una hora de tu equipo</h2>
          <p className="lede">Sirve para convertir a dinero el tiempo que se va en tareas repetitivas.</p>
          <div className="panel">
            <div className="grid g3">
              <label className="f">
                <span>Lo que pagas al mes en total</span>
                <input
                  type="number"
                  min={0}
                  value={state.pago}
                  placeholder="0"
                  onChange={(event) => onField("pago", event.target.value)}
                />
                <span className="hint">Nómina, freelancers y contratos de servicio.</span>
              </label>
              <label className="f">
                <span>Cuántas personas cubre</span>
                <input
                  type="number"
                  min={1}
                  value={state.personas}
                  onChange={(event) => onField("personas", event.target.value)}
                />
              </label>
              <label className="f">
                <span>Horas por persona a la semana</span>
                <input
                  type="number"
                  min={1}
                  value={state.horas}
                  onChange={(event) => onField("horas", event.target.value)}
                />
                <span className="hint">48 es jornada completa. Si cubren 10 horas al día los 7 días, son 70.</span>
              </label>
            </div>
            <div className="out">
              <div className="num">{tarifa > 0 ? `${money(tarifa)} por hora` : "—"}</div>
              <div className="math">
                {tarifa > 0
                  ? `${money(num(state.pago))} entre ${personas} persona${personas > 1 ? "s" : ""} × ${horas} horas a la semana = ${horasMesEquipo(state)} horas al mes`
                  : ""}
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <h2>Dónde se traba el trabajo</h2>
          <p className="lede">
            Tres recorridos: por dónde pasa un huésped, por dónde pasa el dinero y por dónde pasa una
            propiedad. En cada paso, marca si funciona con esfuerzo o si sencillamente no existe.
          </p>
          {TRAZAS.map((traza) => (
            <div className="traza" key={traza.id}>
              <h3>
                {traza.titulo}
                <small>
                  {pasosRevisados(state, traza)} de {traza.pasos.length} revisados · {traza.sub}
                </small>
              </h3>
              {traza.pasos.map((paso, index) => {
                const key = markKey(traza.id, index)
                const mark: DiagnosticoMark = state.marks[key] ?? { s: "", n: "" }
                return (
                  <div className="step" key={key}>
                    <div className="step-top">
                      <span className="name">{paso.nombre}</span>
                      <span className="q">{paso.pregunta}</span>
                      <span className="mark">
                        <MarkButton current={mark.s} value="ok" onClick={() => onMark(key, "ok")}>
                          Funciona bien
                        </MarkButton>
                        <MarkButton current={mark.s} value="mal" onClick={() => onMark(key, "mal")}>
                          Cuesta trabajo
                        </MarkButton>
                        <MarkButton current={mark.s} value="no" onClick={() => onMark(key, "no")}>
                          No existe
                        </MarkButton>
                      </span>
                    </div>
                    {mark.s ? (
                      <div className="step-more">
                        <input
                          value={mark.n}
                          placeholder={mark.s === "ok" ? "Cómo lo resuelven" : "Qué pasa aquí"}
                          onChange={(event) => onNote(key, event.target.value)}
                        />
                        {mark.s === "ok" ? null : (
                          <button type="button" onClick={() => onFromStep(key, paso.nombre)}>
                            Ponerle número
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ))}
        </section>

        <section className="block">
          <h2>Lo que eso cuesta</h2>
          <p className="lede">
            Cada punto que marcaste puede traerse aquí para ponerle un número. Nada se estima por ti:
            sale de un precio que ya pagas, de un dato tuyo o de una norma.
          </p>
          {state.leaks.length === 0 ? (
            <div className="panel" style={{ color: "var(--ink-3)" }}>
              Todavía sin nada aquí. Cada punto marcado arriba puede traerse con “Ponerle número”.
            </div>
          ) : (
            state.leaks.map((leak) => {
              const accion = accOf(leak.accion)
              const origen = oriOf(leak.origen)
              const val = leakDisplayValue(leak, tarifa, state.moneda)
              const abierto = openLeakId === leak.id
              return (
                <div className="leak" data-b={boxOf(leak)} key={leak.id}>
                  <div className="lh" onClick={() => onToggleLeak(leak.id)}>
                    <span className={`nm${leak.nombre ? "" : " e"}`}>{leak.nombre || "Sin nombre"}</span>
                    <span className={`tag ${origen.c}`}>{origen.l}</span>
                    <span className="tag pl">{accion.l}</span>
                    <span className="amt">{val}</span>
                  </div>
                  {abierto ? (
                    <div className="lb">
                      <div className="row">
                        <label className="f">
                          <span>Qué es</span>
                          <input
                            value={leak.nombre}
                            onChange={(event) => onChangeLeak(leak.id, "nombre", event.target.value)}
                          />
                        </label>
                      </div>
                      <div className="row">
                        <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>Cómo sale el dinero</span>
                        <SegmentosTipo
                          value={leak.tipo}
                          onChange={(tipo) => onChangeLeak(leak.id, "tipo", tipo)}
                        />
                      </div>
                      <div className="row">
                        <LeakCampos leak={leak} onChange={onChangeLeak} onRotacion={onRotacion} />
                      </div>
                      <div className="row">
                        <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>De dónde sale el dato</span>
                        <SegmentosOrigen
                          value={leak.origen}
                          onChange={(origenId) => onChangeLeak(leak.id, "origen", origenId)}
                        />
                        <div className="hint">{origen.n}</div>
                      </div>
                      <div className="row">
                        <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
                          Qué haría falta para que deje de irse
                        </span>
                        <SegmentosAccion
                          value={leak.accion}
                          onChange={(accionId) => onChangeLeak(leak.id, "accion", accionId)}
                        />
                      </div>
                      <div className="row">
                        <label className="f">
                          <span>Nota</span>
                          <input
                            value={leak.nota}
                            placeholder="En tus palabras"
                            onChange={(event) => onChangeLeak(leak.id, "nota", event.target.value)}
                          />
                        </label>
                      </div>
                      {cuentaLeak(leak) ? (
                        <div className="calc">
                          {explicaLeak(leak, tarifa, state.moneda)} ={" "}
                          <strong>
                            {leak.tipo === "co"
                              ? num(leak.tope)
                                ? `hasta ${money(num(leak.tope))}`
                                : "—"
                              : money(anualLeak(leak, tarifa))}
                          </strong>{" "}
                          al año
                        </div>
                      ) : (
                        <div className="warn">Queda anotado, pero fuera de las cifras hasta confirmarlo.</div>
                      )}
                      <div className="rowbtn">
                        <button type="button" onClick={() => onDeleteLeak(leak.id)}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })
          )}
          <div className="rowbtn">
            <button type="button" onClick={onAddLeak}>
              Agregar
            </button>
            <button type="button" onClick={onAddSire}>
              Registro de huéspedes extranjeros
            </button>
          </div>
        </section>
      </div>

      <aside className="tot-wrap">
        <div className="tot">
          <h3>Resultado</h3>
          <div className="it">
            <div className="l">Se corrige con un proceso</div>
            <div className={`v${mask}`}>{money(proceso)}</div>
            <div className="s">Nada que cancelar ni negociar.</div>
          </div>
          <div className="it">
            <div className="l">Depende de una decisión tuya</div>
            <div className={`v${mask}`}>{money(decision)}</div>
            <div className="s">Cancelar, renegociar o salir.</div>
          </div>
          <div className="it">
            <div className="l">Exposición</div>
            <div className={`v${mask}`}>{exposicion ? `hasta ${money(exposicion)}` : "—"}</div>
            <div className="s">No es un gasto de hoy. Va aparte.</div>
          </div>
          <div className="it">
            <div className="l">Ingreso que no entra</div>
            <div className={`v${mask}`}>{money(potencial)}</div>
            <div className="s">Va aparte, no se suma.</div>
          </div>
        </div>
        <div className="rowbtn">
          <button className="solid" style={{ flex: 1 }} type="button" onClick={onReveal}>
            {reveal ? "Ocultar" : "Ver el resultado"}
          </button>
        </div>
      </aside>
    </div>
  )
}

function MarkButton({
  current,
  value,
  onClick,
  children,
}: {
  current: PasoMark
  value: Exclude<PasoMark, "">
  onClick: () => void
  children: string
}) {
  return (
    <button type="button" data-s={value} aria-pressed={current === value} onClick={onClick}>
      {children}
    </button>
  )
}
