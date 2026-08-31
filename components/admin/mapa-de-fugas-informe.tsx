"use client"

import { buildDiagnosisInforme, formatInformeMoney, type InformeLeakRow } from "@/lib/admin/diagnosis-informe"
import type { LeakMapState } from "@/lib/admin/leak-map"

type InformeProps = {
  state: LeakMapState
  sending?: boolean
  onSendWhatsApp?: () => void
}

export function MapaDeFugasInforme({ state, sending = false, onSendWhatsApp }: InformeProps) {
  const model = buildDiagnosisInforme(state)
  const money = (value: number) => formatInformeMoney(value, model.moneda)
  const meta = [model.cliente, model.meta].filter(Boolean).join(" · ")

  return (
    <div className="informe">
      {onSendWhatsApp ? (
        <div className="rowbtn noprint" style={{ marginBottom: 14 }}>
          <button type="button" className="solid" onClick={onSendWhatsApp} disabled={sending}>
            {sending ? "Enviando…" : "Enviar por WhatsApp"}
          </button>
        </div>
      ) : null}
      <div className="doc">
        <h1>Diagnóstico operativo</h1>
        <p className="meta">{meta}</p>
        <p className="note">
          Este documento es tuyo. Recoge lo que revisamos: por dónde se traba el trabajo hoy, qué está
          costando eso y qué haría falta para que deje de costarlo. Las cifras van separadas porque cada
          una depende de algo distinto; sumarlas daría un número que no significa nada.
        </p>

        {model.revisados ? (
          <p className="note">
            Recorrimos {model.totalPasos} puntos de la operación y revisamos {model.revisados}. De esos,{" "}
            {model.sanos.length} están resueltos y {model.huecos.length} se traban.
          </p>
        ) : null}

        {model.sanos.length > 0 ? (
          <>
            <h2>Lo que ya funciona</h2>
            <p className="note">
              Queda registrado a propósito: es la parte de la operación que no hay que tocar, y sirve de
              referencia si más adelante alguien propone cambiarla.
            </p>
            <table className="led">
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>Recorrido</th>
                  <th style={{ width: "24%" }}>Paso</th>
                  <th>Cómo lo resuelven</th>
                </tr>
              </thead>
              <tbody>
                {model.sanos.map((paso) => (
                  <tr key={`${paso.traza}-${paso.paso}`}>
                    <td>{paso.traza}</td>
                    <td>{paso.paso}</td>
                    <td style={{ color: "var(--ink-2)" }}>{paso.n || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}

        {model.huecos.length > 0 ? (
          <>
            <h2>Dónde se traba hoy</h2>
            <table className="led">
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>Recorrido</th>
                  <th style={{ width: "24%" }}>Paso</th>
                  <th>Qué pasa</th>
                </tr>
              </thead>
              <tbody>
                {model.huecos.map((paso) => (
                  <tr key={`${paso.traza}-${paso.paso}`}>
                    <td>{paso.traza}</td>
                    <td>
                      {paso.paso}
                      <br />
                      <span style={{ color: "var(--ink-2)", fontSize: 12.5 }}>
                        {paso.s === "no" ? "No existe" : "Cuesta trabajo"}
                      </span>
                    </td>
                    <td style={{ color: "var(--ink-2)" }}>{paso.n || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}

        {model.proceso.length > 0 ? (
          <>
            <div className="fig">
              <div className="cap">Se corrige poniendo un proceso</div>
              <div className="big">{money(model.procesoAnio)} al año</div>
              <div className="exp">
                No hay que cancelar nada ni negociar con nadie. Es trabajo que hoy se hace a mano o que
                no se hace.
              </div>
            </div>
            <LeakTable rows={model.proceso} money={money} />
          </>
        ) : null}

        {model.decision.length > 0 ? (
          <>
            <div className="fig">
              <div className="cap">Depende de una decisión tuya</div>
              <div className="big">{money(model.decisionAnio)} al año</div>
              <div className="exp">
                Este dinero sale de contratos y suscripciones vigentes. Deja de salir el día que decidas
                cancelarlos, renegociarlos o salirte.
              </div>
            </div>
            <LeakTable rows={model.decision} money={money} conAccion />
          </>
        ) : null}

        {model.exposicion.length > 0 ? (
          <>
            <h2>Exposición</h2>
            <p className="note">
              No es un gasto de hoy. Es lo que puede costar si se materializa, y por eso va aparte.
            </p>
            {model.exposicion.map((item) => (
              <div className="fig" key={item.id}>
                <div className="cap">{item.nombre}</div>
                <div className="big">
                  {money(item.piso)} a {money(item.tope)}
                </div>
                <div className="exp">
                  {item.norma || "—"}
                  {item.casos ? ` Casos expuestos: ${item.casos}.` : ""}
                  {item.nota ? ` ${item.nota}` : ""}
                </div>
              </div>
            ))}
          </>
        ) : null}

        {model.potencial.length > 0 ? (
          <>
            <h2>Ingreso que hoy no entra</h2>
            <p className="note">No es un ahorro. Es dinero que la operación actual no alcanza a capturar.</p>
            <LeakTable rows={model.potencial} money={money} />
          </>
        ) : null}

        <h2>Por dónde empezaría</h2>
        <p className="note">
          Ordenado por lo que se puede mover más rápido, no por el tamaño de la cifra. Lo más grande
          casi siempre es lo que más cuesta destrabar.
        </p>
        <ol>
          {model.orden.length > 0 ? (
            model.orden.map((item) => (
              <li key={item.id}>
                <strong>{item.nombre}</strong> — {money(item.anio)} al año. Haría falta {item.accion}.
              </li>
            ))
          ) : (
            <li>—</li>
          )}
        </ol>

        <h2>De dónde salen las cifras</h2>
        <p className="note">
          Cada línea sale de un precio que ya pagas, de un dato que diste en la reunión o de una norma
          citada. No se usaron promedios de industria ni supuestos sobre tu operación. Lo que quedó
          marcado como dato de la reunión conviene contrastarlo contra facturas o extractos de los
          últimos meses antes de tomar cualquier decisión con estos números.
        </p>
        <div className="sig">Agent Pilot · Real Estate Pilot</div>
      </div>
    </div>
  )
}

function LeakTable({
  rows,
  money,
  conAccion = false,
}: {
  rows: InformeLeakRow[]
  money: (value: number) => string
  conAccion?: boolean
}) {
  return (
    <table className="led">
      <thead>
        <tr>
          <th style={{ width: "32%" }}>Concepto</th>
          <th>Cómo se calcula</th>
          {conAccion ? <th style={{ width: "22%" }}>Qué haría falta</th> : null}
          <th className="n">Al año</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>
              {row.nombre}
              {row.nota ? (
                <>
                  <br />
                  <span style={{ color: "var(--ink-2)", fontSize: 12.5 }}>{row.nota}</span>
                </>
              ) : null}
            </td>
            <td style={{ color: "var(--ink-2)" }}>{row.como}</td>
            {conAccion ? <td style={{ color: "var(--ink-2)" }}>{row.accion}</td> : null}
            <td className="n">{money(row.anio)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
