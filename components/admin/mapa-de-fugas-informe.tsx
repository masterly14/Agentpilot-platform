"use client"

import {
  buildDiagnosisInforme,
  DIAGNOSIS_INFORME_CSS,
  formatInformeMoney,
  type DiagnosisInformeModel,
} from "@/lib/admin/diagnosis-informe"
import type { LeakMapState } from "@/lib/admin/leak-map"

type InformeProps = {
  state: LeakMapState
}

export function MapaDeFugasInforme({ state }: InformeProps) {
  const model = buildDiagnosisInforme(state)

  return (
    <div className="diagnostico-informe">
      <style>{DIAGNOSIS_INFORME_CSS}</style>
      <DiagnosticoInformeHoja model={model} />
    </div>
  )
}

export function DiagnosticoCifras({ model }: { model: DiagnosisInformeModel }) {
  const m = (value: number, approx = false) => formatInformeMoney(value, model.moneda, approx)

  return (
    <div className="cifras">
      <div className="caja medido">
        <span className="mono">Costo medido</span>
        <div className="grande">{model.medidoAnio > 0 ? m(model.medidoAnio) : "—"}</div>
        <span className="mono sub">Al año · calculado sobre tus propias cifras</span>
      </div>
      <div className="caja estimado">
        <span className="mono">Costo estimado</span>
        <div className="grande">{model.estimadoAnio > 0 ? m(model.estimadoAnio, true) : "—"}</div>
        <span className="mono sub">Al año · aproximado, pendiente de confirmar con tus datos</span>
      </div>
      <div className="caja potencial">
        <span className="mono">Potencial no capturado</span>
        <div className="grande">{model.potencialAnio > 0 ? m(model.potencialAnio) : "—"}</div>
        <span className="mono sub">Al año · crecimiento que la operación actual no soporta</span>
      </div>
    </div>
  )
}

function DiagnosticoInformeHoja({ model }: { model: DiagnosisInformeModel }) {
  const m = (value: number, approx = false) => formatInformeMoney(value, model.moneda, approx)

  return (
    <article className="hoja">
      <div className="cab">
        <div>
          <div className="eyebrow">Diagnóstico operativo</div>
          <h1>{model.cliente}</h1>
        </div>
        {model.meta.length > 0 ? (
          <div className="mono meta">
            {model.meta.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <p className="intro">{model.intro}</p>

      <DiagnosticoCifras model={model} />

      <p className="separador">
        Estas tres cifras están separadas a propósito y en orden de certeza. La primera es aritmética
        sobre tus números. La segunda es una aproximación que hay que confirmar. La tercera no es un
        gasto: es lo que la operación no puede capturar hoy.
      </p>

      {model.medidoRows.length > 0 ? (
        <>
          <h2>Dónde está el costo medido</h2>
          <table>
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Cómo se calcula</th>
                <th className="der">Al mes</th>
                <th className="der">Al año</th>
              </tr>
            </thead>
            <tbody>
              {model.medidoRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.concepto}</strong>
                  </td>
                  <td className="gris">{row.como}</td>
                  <td className="der num">{m(row.mes)}</td>
                  <td className="der num fuerte">{m(row.anio)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Total verificable</td>
                <td className="der num">{m(model.medidoMes)}</td>
                <td className="der num">{m(model.medidoAnio)}</td>
              </tr>
            </tfoot>
          </table>
        </>
      ) : null}

      {model.estimadoRows.length > 0 ? (
        <>
          <h2>Costo estimado — pendiente de confirmar</h2>
          <p className="gris" style={{ margin: "0 0 16px", maxWidth: "68ch" }}>
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
                <th className="der">Al año</th>
                <th>Para confirmarlo</th>
              </tr>
            </thead>
            <tbody>
              {model.estimadoRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.punto}</strong>
                  </td>
                  <td className="gris">{row.como}</td>
                  <td className="der num">{m(row.anio, true)}</td>
                  <td className="pendiente">{row.paraConfirmar}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Total estimado</td>
                <td className="der num">{m(model.estimadoAnio, true)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </>
      ) : null}

      {model.requerimientos.length > 0 ? (
        <>
          <h2>Lo que hoy no pueden hacer</h2>
          {model.requerimientos.map((item) => (
            <div className="req" key={item.id}>
              <h3>{item.nombre}</h3>
              {item.queNoPueden ? <p>{item.queNoPueden}</p> : null}
              {item.potencialAnio ? (
                <p>
                  <strong>Potencial estimado: {m(item.potencialAnio)} al año.</strong> No es un gasto
                  que se pueda recortar, es ingreso que la estructura actual no permite capturar.
                </p>
              ) : null}
              <span className="mono tag">{item.tag}</span>
            </div>
          ))}
        </>
      ) : null}

      {model.prioridades.length > 0 ? (
        <>
          <h2>Por dónde empezar</h2>
          <ol className="orden">
            {model.prioridades.map((item, index) => (
              <li key={item.id}>
                <span className="n">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{item.titulo}</strong>
                  <p>{item.descripcion}</p>
                  <span className="modulo">{item.modulo}</span>
                </div>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      <div className="nota-metodo">
        <span className="mono" style={{ color: "var(--senal)" }}>
          Nota sobre el método
        </span>
        {model.notas.map((nota) => (
          <p key={nota}>{nota}</p>
        ))}
      </div>

      <div className="pie">
        <h2 style={{ marginTop: 0 }}>Siguiente paso</h2>
        <p>{model.siguientePaso}</p>
        <div className="firma">Agent Pilot · Real Estate Pilot</div>
      </div>
    </article>
  )
}
