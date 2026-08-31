"use client"

import { ACCIONES, ORIGENES, TIPOS } from "@/lib/admin/leak-map"
import type { DiagnosticoLeak, LeakAccion, LeakOrigen, LeakTipo } from "@/lib/admin/leak-map"

type LeakCamposProps = {
  leak: DiagnosticoLeak
  onChange: (id: string, key: keyof DiagnosticoLeak, value: string) => void
  onRotacion: (id: string, value: string) => void
}

export function LeakCampos({ leak, onChange, onRotacion }: LeakCamposProps) {
  if (leak.tipo === "rec") {
    return (
      <label className="f">
        <span>Cuánto al mes</span>
        <input
          type="number"
          min={0}
          value={leak.mes}
          onChange={(event) => onChange(leak.id, "mes", event.target.value)}
        />
      </label>
    )
  }

  if (leak.tipo === "ev") {
    return (
      <div className="grid g3">
        <label className="f">
          <span>Veces al año</span>
          <input
            type="number"
            min={0}
            value={leak.eventos}
            onChange={(event) => onChange(leak.id, "eventos", event.target.value)}
          />
        </label>
        <label className="f">
          <span>Cuánto cuesta cada vez</span>
          <input
            type="number"
            min={0}
            value={leak.costo}
            onChange={(event) => onChange(leak.id, "costo", event.target.value)}
          />
        </label>
        <label className="f">
          <span>Unidades / meses de estadía</span>
          <input
            value={leak.ay}
            onChange={(event) => onRotacion(leak.id, event.target.value)}
            placeholder="18 / 8"
          />
          <span className="hint">Calcula cuántas rotaciones hay al año.</span>
        </label>
      </div>
    )
  }

  if (leak.tipo === "ti") {
    return (
      <label className="f">
        <span>Horas a la semana</span>
        <input
          type="number"
          min={0}
          step={0.5}
          value={leak.hsem}
          onChange={(event) => onChange(leak.id, "hsem", event.target.value)}
        />
        <span className="hint">Veces por semana × cuánto toma cada vez.</span>
      </label>
    )
  }

  return (
    <>
      <div className="grid g3">
        <label className="f">
          <span>Desde</span>
          <input
            type="number"
            min={0}
            value={leak.piso}
            onChange={(event) => onChange(leak.id, "piso", event.target.value)}
          />
        </label>
        <label className="f">
          <span>Hasta</span>
          <input
            type="number"
            min={0}
            value={leak.tope}
            onChange={(event) => onChange(leak.id, "tope", event.target.value)}
          />
        </label>
        <label className="f">
          <span>Casos expuestos</span>
          <input
            value={leak.casos}
            onChange={(event) => onChange(leak.id, "casos", event.target.value)}
          />
        </label>
      </div>
      <label className="f" style={{ marginTop: 12 }}>
        <span>Norma</span>
        <input
          value={leak.norma}
          onChange={(event) => onChange(leak.id, "norma", event.target.value)}
        />
      </label>
    </>
  )
}

export function SegmentosTipo({
  value,
  onChange,
}: {
  value: LeakTipo
  onChange: (id: LeakTipo) => void
}) {
  return (
    <div className="seg">
      {TIPOS.map((tipo) => (
        <button
          key={tipo.id}
          type="button"
          aria-pressed={value === tipo.id}
          onClick={() => onChange(tipo.id)}
        >
          {tipo.l}
        </button>
      ))}
    </div>
  )
}

export function SegmentosOrigen({
  value,
  onChange,
}: {
  value: LeakOrigen
  onChange: (id: LeakOrigen) => void
}) {
  return (
    <div className="seg">
      {ORIGENES.map((origen) => (
        <button
          key={origen.id}
          type="button"
          aria-pressed={value === origen.id}
          onClick={() => onChange(origen.id)}
        >
          {origen.l}
        </button>
      ))}
    </div>
  )
}

export function SegmentosAccion({
  value,
  onChange,
}: {
  value: LeakAccion
  onChange: (id: LeakAccion) => void
}) {
  return (
    <div className="seg">
      {ACCIONES.map((accion) => (
        <button
          key={accion.id}
          type="button"
          aria-pressed={value === accion.id}
          onClick={() => onChange(accion.id)}
        >
          {accion.l}
        </button>
      ))}
    </div>
  )
}
