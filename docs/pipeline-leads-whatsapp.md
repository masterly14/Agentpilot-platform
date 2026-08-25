# Pipeline de Leads y Secuencias WhatsApp — Agent Pilot

Modelo de estados, transiciones y arquitectura técnica para las secuencias de nutrición SQL/MQL descritas en "Plan de inicio y visión Q3".

---

## 1. Conceptos base

Un **Lead** entra al sistema por uno de dos caminos:

- **Lead Magnet**: descarga la guía → se cualifica por formulario → se etiqueta `SQL` o `MQL`.
- **Direct Booking**: agenda directo desde la landing → no pasa por nutrición pre-reunión, entra directo a la secuencia de follow-ups de reunión.

A partir de ahí, el lead atraviesa hasta tres pipelines distintos (no excluyentes, son secuenciales en el tiempo):

1. **Pipeline de Nutrición** (SQL o MQL) — recuperar intención tras el lead magnet.
2. **Pipeline de Pre-Reunión** — reducir no-show antes del diagnóstico.
3. **Pipeline de Pre-Demo** — reducir no-show antes de la demo, con contexto del diagnóstico.
4. **Pipeline de Post-Demo** — cerrar o mantener en seguimiento tras la cotización.

Cada uno tiene su propia máquina de estados, pero comparten la misma arquitectura de scheduling (QStash) y las mismas reglas de invalidación.

---

## 2. Máquina de estados — Pipeline de Nutrición SQL

```
LEAD_MAGNET_DOWNLOADED
        │
        ▼
AWAITING_CONFIRMATION ──(responde / no responde, no bloquea)──▶ VIDEO_SENT
        │                                                            │
        │                                                  (pixel: vio / no vio)
        │                                                            │
        │                                              ┌─────────────┴──────────────┐
        │                                              ▼                            ▼
        │                                        CTA_SENT_SAW_VIDEO          CTA_SENT_NO_VIDEO
        │                                              │                            │
        │                                              └─────────────┬──────────────┘
        │                                                             ▼
        │                                                    LAST_NURTURE_SENT
        │                                                             │
        │                                                             ▼
        │                                                    COLD_CALL_QUEUED
        │                                                             │
        │                                              ┌──────────────┴──────────────┐
        │                                              ▼                             ▼
        │                                         SCHEDULED                   LONG_TERM_NURTURE
        │
        └─(en cualquier punto)──▶ SCHEDULED   [salida inmediata, cancela jobs pendientes]
```

### Tabla de estados — SQL

| Estado | Trigger de entrada | Acción al entrar | Trigger de salida | Timeout / delay |
|---|---|---|---|---|
| `LEAD_MAGNET_DOWNLOADED` | Formulario completado, clasificado SQL | Crear registro de pipeline | Inmediato | — |
| `AWAITING_CONFIRMATION` | Automático tras descarga | Enviar Paso 0 (confirmación + botones) | Respuesta a botones (no bloqueante) o timeout | 24h → avanza igual |
| `VIDEO_SENT` | Timeout de `AWAITING_CONFIRMATION` o respuesta | Enviar Paso 1 (video + UTM + pixel) | Evento de pixel o timeout | 24h |
| `CTA_SENT_SAW_VIDEO` | Pixel confirma apertura de video | Enviar Paso 2 (CTA directo) | Agendamiento o timeout | 24h |
| `CTA_SENT_NO_VIDEO` | Timeout sin señal de pixel | Enviar Paso 2b (link directo) | Agendamiento o timeout | 24h |
| `LAST_NURTURE_SENT` | Timeout de CTA (cualquiera) | Enviar Paso 3 (última nutrición + salida fácil) | Agendamiento, "no es el momento", o timeout | 24-48h |
| `COLD_CALL_QUEUED` | Timeout de `LAST_NURTURE_SENT` | Encolar tarea humana de llamada | Resultado de la llamada (manual) | — |
| `SCHEDULED` | Agendamiento en cualquier punto | Cancelar todos los jobs pendientes, mover a Pipeline Pre-Reunión | — | Estado terminal (éxito) |
| `LOST` | "No es el momento" explícito en Paso 3, o resultado negativo de Cold Call | Cancelar jobs pendientes | — | Estado terminal |
| `LONG_TERM_NURTURE` | Sin respuesta tras Cold Call, o corte de 20 días (regla general del funnel) | Mover a lista de nurture pasivo | — | Estado terminal (no descartado) |

---

## 3. Máquina de estados — Pipeline de Nutrición MQL

Comparte estructura con SQL pero inserta un bloque de cualificación conversacional antes del embudo de video.

```
LEAD_MAGNET_DOWNLOADED
        │
        ▼
AWAITING_CONFIRMATION
        │
        ▼
QUALIFICATION_OFFERED ──(elige "agendar directo")──▶ SCHEDULED
        │
   (elige "dale, pregunta")
        │
        ▼
QUALIFYING_Q1 ──▶ QUALIFYING_Q2 ──▶ QUALIFYING_Q3
                                        │
                              ┌─────────┴─────────┐
                              ▼                   ▼
                        FIT_CONFIRMED       DISQUALIFIED
                              │                   │
                              ▼                (terminal)
                          VIDEO_SENT
                              │
                        (mismo embudo que SQL desde aquí)
                              │
                              ▼
                     CTA_SENT_SAW_VIDEO / CTA_SENT_NO_VIDEO
                              │
                              ▼
                     LAST_NURTURE_SENT
                              │
                              ▼
                     COLD_CALL_QUEUED
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              SCHEDULED           LONG_TERM_NURTURE
```

### Tabla de estados — MQL (solo lo que difiere de SQL)

| Estado | Trigger de entrada | Acción al entrar | Trigger de salida |
|---|---|---|---|
| `QUALIFICATION_OFFERED` | Timeout de `AWAITING_CONFIRMATION` | Enviar Paso 1 (oferta de cualificación, botones) | Elección del lead (bloqueante — no hay timeout de avance automático, si no responde se reintenta o pasa a `VIDEO_SENT` tras N horas como fallback) |
| `QUALIFYING_Q1/Q2/Q3` | Elige "dale, pregunta" | Agente IA hace pregunta secuencial | Respuesta del lead (bloqueante, una pregunta a la vez) |
| `FIT_CONFIRMED` | Respuestas indican fit | Enviar mensaje de cierre con link de agendamiento | Agendamiento o continúa a `VIDEO_SENT` |
| `DISQUALIFIED` | Respuestas indican no-fit | Enviar mensaje de descalificación | — (estado terminal, no más nutrición) |

**Nota de diseño**: a partir de `FIT_CONFIRMED`/`VIDEO_SENT`, el MQL entra al mismo sub-grafo de estados que el SQL (`CTA_SENT_*` → `LAST_NURTURE_SENT` → `COLD_CALL_QUEUED` → `SCHEDULED`/`LONG_TERM_NURTURE`). Conviene modelarlo como el mismo enum de estados compartido, con un campo `funnelOrigin: "SQL" | "MQL"` para trazabilidad, en vez de duplicar los estados del embudo común.

---

## 4. Máquina de estados — Pipeline Pre-Reunión (Discovery)

Aplica tanto a leads que agendaron por Direct Booking como a los que llegaron por nutrición SQL/MQL y agendaron.

```
MEETING_SCHEDULED
      │
      ▼
CONFIRMATION_SENT (inmediato)
      │
      ▼
REMINDER_48H
      │
      ▼
REMINDER_24H
      │
      ▼
REMINDER_8AM_DAY_OF
      │
      ▼
REMINDER_30MIN
      │
      ▼
┌─────┴─────┐
▼           ▼
ATTENDED   NO_SHOW ──▶ RESCHEDULE_OFFERED ──▶ (vuelve a MEETING_SCHEDULED o LOST)
```

| Estado | Delay desde el evento ancla (hora de reunión) |
|---|---|
| `CONFIRMATION_SENT` | Inmediato al agendar |
| `REMINDER_48H` | T-48h |
| `REMINDER_24H` | T-24h |
| `REMINDER_8AM_DAY_OF` | 8:00am del día de reunión (hora fija, no relativa) |
| `REMINDER_30MIN` | T-30min |
| `NO_SHOW` | Detectado post-hora de reunión sin marca de asistencia |
| `RESCHEDULE_OFFERED` | Inmediato tras `NO_SHOW` |

**Importante**: `REMINDER_8AM_DAY_OF` es el único paso con ancla de reloj (hora fija) en vez de offset relativo a la hora de la reunión. Todos los demás jobs de QStash se calculan como `meetingTime - offset`; este se calcula como `dateOnly(meetingTime) + "08:00"`.

---

## 5. Máquina de estados — Pipeline Pre-Demo (Autoridad + Discovery → Demo)

Estructuralmente idéntico al Pre-Reunión (mismos 5 timings: confirmación, 48h, 24h, 8am, 30min, no-show), pero:

- Se activa tras completar el diagnóstico, no tras el formulario.
- Cada mensaje debe interpolar el **dolor específico** identificado en la llamada anterior (campo `painPoint` en el registro del lead).
- El resumen de la reunión (2h después del diagnóstico) es un paso adicional antes de este pipeline: `DISCOVERY_SUMMARY_SENT`.

```
DISCOVERY_COMPLETED
      │
      ▼
DISCOVERY_SUMMARY_SENT (T+2h, incluye: dolores, próximos pasos, fecha demo)
      │
      ▼
DEMO_CONFIRMATION_SENT
      │
      ▼
DEMO_REMINDER_48H (con painPoint interpolado)
      │
      ▼
DEMO_REMINDER_24H (con painPoint interpolado)
      │
      ▼
DEMO_REMINDER_8AM
      │
      ▼
DEMO_REMINDER_30MIN
      │
      ▼
┌─────┴─────┐
▼           ▼
ATTENDED   NO_SHOW ──▶ RESCHEDULE_OFFERED
```

---

## 6. Máquina de estados — Pipeline Post-Demo

```
DEMO_COMPLETED
      │
      ▼
QUOTE_PRESENTED
      │
   (¿cierre inmediato?)
      │
   ┌──┴──┐
   ▼     ▼
 WON   FORMAL_PROPOSAL_SENT
         │
         ▼
   FOLLOWUP_48H
         │
         ▼
   FOLLOWUP_5_7_DAYS (debe incluir valor nuevo: caso de éxito, no solo "¿ya decidiste?")
         │
         ▼
   CUTOFF_20_DAYS
         │
      ┌──┴──┐
      ▼     ▼
    WON   LONG_TERM_NURTURE / LOST
```

| Estado | Delay | Regla de contenido |
|---|---|---|
| `QUOTE_PRESENTED` | Inmediato tras demo | — |
| `WON` | Evento de cierre (cualquier punto) | Estado terminal, cancela jobs pendientes |
| `FORMAL_PROPOSAL_SENT` | Si no hay cierre inmediato | Envío de PDF |
| `FOLLOWUP_48H` | T+48h desde propuesta | Recordatorio simple |
| `FOLLOWUP_5_7_DIAS` | T+5 a 7 días | **Debe llevar contenido nuevo** (caso de éxito), no solo insistencia |
| `CUTOFF_20_DIAS` | T+20 días desde propuesta | Punto de corte: pasa a nurture de largo plazo, sale de seguimiento activo |

---

## 7. Reglas transversales (aplican a todos los pipelines)

1. **Toda transición de estado que ocurra por un evento externo (respuesta de WhatsApp, agendamiento, pixel) debe cancelar el job de QStash pendiente antes de programar el siguiente.** Nunca dejar dos jobs viables para el mismo lead al mismo tiempo.
2. **Todo endpoint disparado por QStash valida el estado actual en DB antes de ejecutar.** Si el estado ya no corresponde al paso que el job representa, el job es un no-op (se marca `stale`, se loggea, no se envía nada).
3. **Idempotencia**: cada job de QStash lleva un `dedupKey` (ej. `${leadId}:${state}:${attempt}`). Si el endpoint recibe el mismo dedupKey ya procesado, responde 200 sin reprocesar.
4. **Distinción time-triggered vs event-triggered**:
   - Time-triggered (ej. Paso 1 SQL a las 24h): se programa el delay exacto al entrar al estado anterior.
   - Event-triggered (ej. Paso 2 según pixel): se programa un job de "evaluar y decidir" al momento correspondiente, que lee el estado (`videoWatched`) y elige la rama en tiempo de ejecución — no se decide la rama al momento de programar.
5. **Toda plantilla de WhatsApp fuera de ventana de 24h de sesión activa requiere Template ID de Meta aprobado.** El modelo de plantilla debe versionar el `metaTemplateId`, no solo el copy libre.
6. **El punto de corte de 20 días (mencionado en Estructura Comercial, punto 6) es una regla general de todo el pipeline comercial**, no solo del post-demo: cualquier lead sin respuesta tras su Cold Call correspondiente pasa a `LONG_TERM_NURTURE`, nunca se marca `LOST` de forma definitiva salvo rechazo explícito.

---

## 8. Modelo de datos sugerido (TypeScript)

```typescript
type FunnelOrigin = "SQL" | "MQL" | "DIRECT_BOOKING";

type PipelineStage =
  | "NUTURING"
  | "PRE_MEETING"
  | "PRE_DEMO"
  | "POST_DEMO";

type NurturingState =
  | "LEAD_MAGNET_DOWNLOADED"
  | "AWAITING_CONFIRMATION"
  | "QUALIFICATION_OFFERED"   // solo MQL
  | "QUALIFYING_Q1" | "QUALIFYING_Q2" | "QUALIFYING_Q3"  // solo MQL
  | "DISQUALIFIED"            // solo MQL, terminal
  | "VIDEO_SENT"
  | "CTA_SENT_SAW_VIDEO"
  | "CTA_SENT_NO_VIDEO"
  | "LAST_NURTURE_SENT"
  | "COLD_CALL_QUEUED"
  | "SCHEDULED"               // terminal, éxito
  | "LOST"                    // terminal
  | "LONG_TERM_NURTURE";      // terminal, pasivo

type PreMeetingState =
  | "MEETING_SCHEDULED"
  | "CONFIRMATION_SENT"
  | "REMINDER_48H"
  | "REMINDER_24H"
  | "REMINDER_8AM_DAY_OF"
  | "REMINDER_30MIN"
  | "ATTENDED"
  | "NO_SHOW"
  | "RESCHEDULE_OFFERED";

type PreDemoState =
  | "DISCOVERY_COMPLETED"
  | "DISCOVERY_SUMMARY_SENT"
  | "DEMO_CONFIRMATION_SENT"
  | "DEMO_REMINDER_48H"
  | "DEMO_REMINDER_24H"
  | "DEMO_REMINDER_8AM"
  | "DEMO_REMINDER_30MIN"
  | "ATTENDED"
  | "NO_SHOW"
  | "RESCHEDULE_OFFERED";

type PostDemoState =
  | "QUOTE_PRESENTED"
  | "WON"
  | "FORMAL_PROPOSAL_SENT"
  | "FOLLOWUP_48H"
  | "FOLLOWUP_5_7_DAYS"
  | "CUTOFF_20_DAYS"
  | "LONG_TERM_NURTURE"
  | "LOST";

type AnyPipelineState =
  | NurturingState
  | PreMeetingState
  | PreDemoState
  | PostDemoState;

interface LeadPipelineRecord {
  leadId: string;
  funnelOrigin: FunnelOrigin;
  currentStage: PipelineStage;
  currentState: AnyPipelineState;

  // Scheduling / QStash
  scheduledJobId: string | null;      // messageId de QStash del próximo paso pendiente
  scheduledJobDedupKey: string | null;

  // Señales de tracking
  videoWatched: boolean;
  utmSource: string | null;
  pixelFiredAt: Date | null;

  // Contexto de negocio
  painPoint: string | null;           // capturado en Discovery, usado en Pre-Demo
  qualificationAnswers: {
    properties?: string;
    biggestTimeSink?: string;
    hasSystem?: string;
  } | null;

  // Meeting refs
  meetingId: string | null;           // referencia a Google Calendar event
  meetingTime: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

interface MessageTemplate {
  state: AnyPipelineState;
  funnelOrigin: FunnelOrigin | "ANY";
  metaTemplateId: string;             // template aprobado en WhatsApp Cloud API
  buildBody: (lead: LeadPipelineRecord) => string;
  buttons?: string[];
  triggerType: "TIME" | "EVENT";
  delayFromAnchor?: {
    anchor: "STATE_ENTRY" | "MEETING_TIME";
    offsetSeconds: number;            // negativo si es antes del ancla (ej. reminders)
  };
}
```

---

## 9. Catálogo de plantillas de mensaje

Todas las plantillas usan `[Nombre]` como placeholder del nombre del lead. Los campos entre `[corchetes]` son variables a interpolar en tiempo de ejecución. Donde se indica `Botones:`, el mensaje debe enviarse como template de WhatsApp con Quick Reply Buttons (no texto libre), para poder capturar la respuesta como evento estructurado en vez de parsear texto libre.

### 9.1 Confirmación de reunión (Descubrimiento mediante Anuncio)

**Estado**: `CONFIRMATION_SENT` (Pre-Reunión) — se envía junto con el email, inmediatamente al agendar.

```
Hola [Nombre], te habla Santiago Varón, founder de Agent Pilot 👋

Vi que agendaste tu diagnóstico para entender cómo liberar +50 horas
semanales, recuperar dinero que hoy se pierde y aumentar la capacidad
operativa de tu negocio, sin que dependa de que tú estés encima todo el día.

Antes de la llamada, 3 cosas importantes:

1. El objetivo es entender tu operación actual y evaluar si tiene sentido
   implementar nuestro sistema en tu negocio.
2. Al ser un diagnóstico, dura 60 min o más, así que asegúrate de estar
   100% presente ese rato.
3. Conéctate desde computador, en un lugar tranquilo, para aprovechar el
   tiempo al máximo.

Nos vemos el [fecha] a las [hora], [Nombre]. Te iré enviando recordatorios
antes de la fecha. ¡Nos vemos pronto! 🚀
```

- **Botones**: ninguno (mensaje informativo, no requiere respuesta estructurada).
- **Variables**: `[Nombre]`, `[fecha]`, `[hora]`.

---

### 9.2 Follow-ups Pre-Reunión (antes del Diagnóstico)

**Pipeline**: Pre-Meeting. Mismo lead, 5 mensajes en cadena.

**`REMINDER_48H`**
```
Hola [Nombre] 👋 Nos vemos en 2 días para tu diagnóstico.

En la llamada vamos a mapear exactamente cuales son los cuellos de botella
de tu empresa y el por qué la gran mayoría de Property Managers son los
toderos del negocio.

Nos vemos pronto 🚀
```

**`REMINDER_24H`**
```
Hola [Nombre], mañana a las [hora] es nuestra reunión.

Antes de vernos, ve pensando la razón por la que agendaste el diagnóstico
y lo que falla hoy en tu operación.

Piénsalo y tenlo listo para la llamada. Nos vemos mañana 👋
```

**`REMINDER_8AM_DAY_OF`**
```
Hola [Nombre], nos vemos hoy a las [hora] 🙌

Recuerda conectarte desde computador, en un lugar tranquilo. ¡Nos vemos
en un rato!
```

**`REMINDER_30MIN`**
```
[Nombre], en 30 minutos empezamos 🚀

Aquí el link para conectarte: [link]

Nos vemos ya mismo.
```

**`NO_SHOW` → `RESCHEDULE_OFFERED`**
```
Hola [Nombre], te esperé en la llamada pero no logramos coincidir 😅

Sé que el día a día de la operación absorbe todo el tiempo, pasa mucho.
¿Prefieres que reagendemos ahora mismo? Aquí tienes mi calendario: [link]

Cuando quieras, ahí estaré.
```

- **Botones**: ninguno en esta cadena (son recordatorios unidireccionales; el link de reagendamiento va directo, no por botón).
- **Variables**: `[Nombre]`, `[hora]`, `[link]`.

---

### 9.3 Follow-ups Pre-Demo (Autoridad + Discovery → Demo)

**Pipeline**: Pre-Demo. Mismo esqueleto de timing que Pre-Reunión, pero cada mensaje interpola `[dolor específico]` capturado en el diagnóstico anterior.

**`DEMO_REMINDER_48H`**
```
Hola [Nombre] 👋 En 2 días te muestro cómo resolvemos [dolor específico],
lo que hablamos en nuestra última llamada.

Ya con la información que me compartiste, armamos algo 100% aterrizado a
tu operación, no una demo genérica. Vas a ver exactamente cómo funcionaría
en tu día a día.

Nos vemos pronto 🚀
```

**`DEMO_REMINDER_24H`**
```
Hola [Nombre], mañana a las [hora] te muestro la propuesta completa,
incluyendo cómo resolvemos [dolor específico].

¿Quieres que alguien más de tu equipo esté en la llamada? Recuerda invitar
a todos los tomadores de decisión.

Nos vemos mañana 👋
```

**`DEMO_REMINDER_8AM`**
```
Hola [Nombre], hoy a las [hora] te muestro cómo resolvemos
[dolor específico] en tu operación 🙌

Conéctate desde computador, en un lugar tranquilo. ¡Nos vemos en un rato!
```

**`DEMO_REMINDER_30MIN`**
```
[Nombre], en 30 minutos te muestro todo el sistema para resolver lo que
hemos hablado 🚀

Aquí el link: [link]

Nos vemos ya mismo.
```

**`NO_SHOW` → `RESCHEDULE_OFFERED`**
```
Hola [Nombre], te esperé pero no logramos coincidir.

Ya tengo lista la demo enfocada en [dolor específico], no quiero que se
quede en el aire. ¿Reagendamos ahora mismo? Aquí mi calendario: [link]
```

- **Botones**: ninguno.
- **Variables**: `[Nombre]`, `[hora]`, `[link]`, `[dolor específico]`.

---

### 9.4 Nutrición SQL

**Paso 0 — `AWAITING_CONFIRMATION`**
```
Hola [Nombre] 👋 Soy Santiago, founder de Agent Pilot.

Ya tienes tu guía para aprender como poner celular en modo avión y que
tu renta corta siga operando. 📩

¿La recibiste bien?
```
- **Botones**: `Sí, la recibí` / `No me llegó` / `Tengo dudas`
- **Comportamiento**: la respuesta **no bloquea** el avance (el job de 24h hacia `VIDEO_SENT` sigue). Se contesta en la ventana de 24h con texto libre:
  - `Sí, la recibí` → ack; el video sale igual en el timer.
  - `No me llegó` → reenvía el link de la guía y notifica a `NOTIFICATION_EMAIL`.
  - `Tengo dudas` → invita a escribir la duda y notifica a `NOTIFICATION_EMAIL`.
  - Texto libre no reconocido → ack + “el siguiente paso te llega igual”.

**Paso 1 — `VIDEO_SENT` (Día 1)**
```
[Nombre], vi que descargaste la guía, bien ahí 🙌

Si quieres ver cómo se ve esto aplicado a un negocio como el tuyo, grabé
un video corto explicando exactamente el proceso de diagnóstico y cómo
funcionaría en tu operación: [link con UTM]

Son solo 4-5 min.
```
- **Botones**: ninguno.
- **Variables**: `[link con UTM]` (debe incluir UTM de origen + pixel de tracking embebido en la página destino).

**Paso 2 — `CTA_SENT_SAW_VIDEO` (Día 2, si vio el video)**
```
[Nombre], ¿qué te pareció el video? 👀

Si tiene sentido para tu operación, agenda aquí tu diagnóstico, dura 60
min y salimos con claridad de qué cuellos de botella tiene tu negocio:
[link de agendamiento]
```

**Paso 2b — `CTA_SENT_NO_VIDEO` (Día 2, si NO vio el video)**
```
[Nombre], entiendo que el día a día es pesado 😅

Te dejo por si acaso el link directo para agendar, a veces es más rápido
que ver el video completo: [link de agendamiento]
```
- **Botones**: ninguno en ambas variantes (el CTA es un link directo, no un botón de WhatsApp).

**Paso 3 — `LAST_NURTURE_SENT` (Día 3-4)**
```
[Nombre], última vez que te escribo por aquí antes de intentar llamarte.
Sé que suena a mucho compromiso agendar 60 min, pero la mayoría de
Property Managers con los que hablo salen de esa llamada con al menos
2-3 cosas concretas para dejar de hacer manualmente, agenden con nosotros
o no.

Si te interesa, aquí el link: [link]

Si no es el momento, cuéntame y no te sigo escribiendo por aquí.
```
- **Botones**: `Sí, quiero agendar` / `No es el momento`.
- **Respuestas**: `Sí, quiero agendar` reenvía el link (no pasa a `SCHEDULED` hasta que agenden de verdad). `No es el momento` envía cierre y pasa a `LOST`. Texto libre no reconocido reenvía el link y ofrece parar.

**Paso 4 — `COLD_CALL_QUEUED` (Día 5-6, guión de llamada, no WhatsApp)**
```
"Hola [Nombre], habla Santiago de Agent Pilot, te escribí hace unos días
sobre la guía de renta corta que descargaste. ¿Tienes 2 minutos? Quería
entender rápido si esto te sigue interesando o si el momento no es el
indicado."
```
- **Canal**: llamada telefónica humana, no template de WhatsApp.

---

### 9.5 Nutrición MQL (por Chat, con agente de IA)

**Paso 0 — `AWAITING_CONFIRMATION`** (idéntico a SQL Paso 0)
```
Hola [Nombre] 👋 Soy Santiago, founder de Agent Pilot.

Ya tienes tu guía para aprender como poner celular en modo avión y que
tu renta corta siga operando. 📩

¿La recibiste bien?
```
- **Botones**: `Sí, la recibí` / `No me llegó` / `Tengo dudas`
- **Comportamiento**: idéntico al Paso 0 SQL (overlay no bloqueante; `No me llegó` / `Tengo dudas` notifican a un humano).

**Paso 1 — `QUALIFICATION_OFFERED` (Día 0-1)**
```
[Nombre], antes de mostrarte algo aterrizado a tu operación, quiero
entenderte un poco mejor, así la sesión de diagnóstico va directo a lo
que de verdad te sirve.

¿Te hago 3 preguntas rápidas por aquí? Toma menos de 2 minutos.
```
- **Botones**: `Dale, pregunta` / `Prefiero agendar directo`
- **Comportamiento**: si elige "Prefiero agendar directo" → transición directa a `SCHEDULED`-flow (link de agendamiento), saltando todo el bloque de cualificación. La puerta directa siempre queda abierta.

**Paso 2 — Secuencia de cualificación (`QUALIFYING_Q1` → `Q2` → `Q3`)**, una pregunta a la vez, agente de IA:

```
Q1: "¿Cuántas propiedades manejas actualmente?"
```
```
Q2: "¿Qué es lo que más tiempo te quita hoy en el día a día? (reportes,
     comunicación con huéspedes, limpieza, cobros...)"
```
```
Q3: "¿Hoy usas algún sistema para gestionar reservas o todo lo haces
     manual / en Excel?"
```
- **Botones**: ninguno — son preguntas abiertas, respuesta en texto libre que el agente IA interpreta.

**Cierre con fit — `FIT_CONFIRMED`**
```
Con esto que me cuentas, tiene mucho sentido que hables conmigo
directamente. Te dejo el link para que agendes cuando te quede mejor:
[link]
```

**Cierre sin fit — `DISQUALIFIED`**
```
Por ahora no creo que seamos el mejor aliado para tu operación, pero te
dejo la guía por si te sirve más adelante. ¡Éxitos!
```
- **Botones**: ninguno en ambos cierres.

**Paso 3 — `VIDEO_SENT` (Día 1-2, si no agendó tras cualificar)**
```
[Nombre], te dejo un video corto (4-5 min) donde te explico exactamente
cómo funciona el proceso de diagnóstico y qué te llevas de la sesión:
[link con UTM]
```

**Paso 4 — CTA según pixel (Día 2-3)**

`CTA_SENT_SAW_VIDEO`:
```
[Nombre], ¿qué te pareció el video? Si tiene sentido para tu operación,
aquí puedes agendar directo: [link de agendamiento]
```

`CTA_SENT_NO_VIDEO`:
```
[Nombre], sé que el día a día es pesado 😅 Te dejo el link directo para
agendar cuando tengas un espacio: [link de agendamiento]
```

**Paso 5 — `LAST_NURTURE_SENT` + Cold Call (Día 4-5)**
```
[Nombre], última vez que te escribo por aquí 📞 Si te interesa seguir
la conversación, aquí el link: [link]

Si no es el momento, cuéntame y no te sigo escribiendo.
```
```
Cold Call: "Hola [Nombre], habla Santiago de Agent Pilot. Estuvimos
conversando hace unos días por WhatsApp sobre tu operación, quería
retomarlo directamente. ¿Tienes 2 minutos?"
```
- **Botones**: `Sí, quiero agendar` / `No es el momento` (mismo overlay que SQL Paso 3).
- **Canal Cold Call**: llamada telefónica humana. Si el lead escribe por WhatsApp en `COLD_CALL_QUEUED`, se reenvía el link o se pasa a `LOST` si dice que no es el momento.

---

### 9.5.1 Respuestas inbound de nutrición (SQL y MQL, sin cualificación)

Las plantillas salen por tiempo (QStash). La respuesta del lead es un **overlay en sesión** (texto libre dentro de la ventana de 24h de WhatsApp, no un template nuevo). No adelanta ni cancela el siguiente paso, salvo `not_now` en `LAST_NURTURE_SENT` / `COLD_CALL_QUEUED` → `LOST`. `SCHEDULED` solo ocurre cuando agendan de verdad.

`QUALIFICATION_OFFERED` y `QUALIFYING_Q1/Q2/Q3` no usan este catálogo: siguen el flujo de botones / preguntas ya cableado.

| Estado | Intención | Efecto |
|---|---|---|
| `AWAITING_CONFIRMATION` | `guide_received` | Ack. Job 24h intacto. |
| `AWAITING_CONFIRMATION` | `guide_missing` | Reenvía guía. Email a `NOTIFICATION_EMAIL`. |
| `AWAITING_CONFIRMATION` | `guide_questions` | Invita a escribir la duda. Email a `NOTIFICATION_EMAIL`. |
| `AWAITING_CONFIRMATION` | `unknown` | Ack; el siguiente paso sale igual. |
| `VIDEO_SENT` | `watched_video` | Marca `videoWatched`. Ofrece link de diagnóstico. |
| `VIDEO_SENT` | `book_now` | Reenvía link de diagnóstico. |
| `VIDEO_SENT` | `not_now` | Ack sin `LOST`. |
| `VIDEO_SENT` | `unknown` | Ofrece video/diagnóstico. |
| `CTA_SENT_SAW_VIDEO` / `CTA_SENT_NO_VIDEO` | `book_now` | Reenvía link. |
| `CTA_SENT_*` | `not_now` | Ack sin cortar nutrición. |
| `CTA_SENT_NO_VIDEO` | `watched_video` | Marca `videoWatched`. Ofrece link. |
| `CTA_SENT_*` | `unknown` | Reenvía el CTA del paso. |
| `LAST_NURTURE_SENT` | `book_now` | Reenvía link. |
| `LAST_NURTURE_SENT` | `not_now` | Cierre → `LOST`. |
| `LAST_NURTURE_SENT` | `unknown` | Link + ofrece parar. |
| `FIT_CONFIRMED` | `book_now` / `unknown` | Reenvía link. |
| `FIT_CONFIRMED` | `not_now` | Ack; el timeout sigue a `VIDEO_SENT`. |
| `DISQUALIFIED` | cualquiera | Cierre amable, sin reabrir nutrición. |
| `COLD_CALL_QUEUED` | `book_now` | Reenvía link. |
| `COLD_CALL_QUEUED` | `not_now` | Cierre → `LOST`. |
| `COLD_CALL_QUEUED` | `unknown` | Ofrece agendar o parar. |

---

### 9.6 Resumen de plantillas por canal y estructura

| Plantilla | Estado | Canal | Tiene botones | Requiere Meta Template ID |
|---|---|---|---|---|
| Confirmación de reunión | `CONFIRMATION_SENT` | WhatsApp | No | Sí |
| Reminder 48h/24h/8am/30min (Pre-Reunión) | `REMINDER_*` | WhatsApp | No | Sí |
| No-show reagendamiento (Pre-Reunión) | `RESCHEDULE_OFFERED` | WhatsApp | No | Sí |
| Reminder 48h/24h/8am/30min (Pre-Demo) | `DEMO_REMINDER_*` | WhatsApp | No | Sí |
| No-show reagendamiento (Pre-Demo) | `RESCHEDULE_OFFERED` | WhatsApp | No | Sí |
| Confirmación entrega lead magnet | `AWAITING_CONFIRMATION` | WhatsApp | **Sí** (3 opciones) | Sí |
| Video con UTM (SQL/MQL) | `VIDEO_SENT` | WhatsApp | No | Sí |
| CTA agendar (visto/no visto) | `CTA_SENT_*` | WhatsApp | No | Sí |
| Última nutrición | `LAST_NURTURE_SENT` | WhatsApp | No (recomendado agregar) | Sí |
| Cold Call | `COLD_CALL_QUEUED` | Llamada | N/A | N/A |
| Oferta de cualificación (MQL) | `QUALIFICATION_OFFERED` | WhatsApp | **Sí** (2 opciones) | Sí |
| Preguntas de cualificación (MQL) | `QUALIFYING_Q1/Q2/Q3` | WhatsApp | No (texto libre) | Depende — si es agente conversacional libre, puede no requerir template si está dentro de ventana de 24h de sesión activa |
| Cierre fit / no-fit (MQL) | `FIT_CONFIRMED` / `DISQUALIFIED` | WhatsApp | No | Sí |

**Nota sobre ventana de 24h**: las preguntas del agente IA (`QUALIFYING_Q1/Q2/Q3`) ocurren dentro de una conversación activa iniciada por el lead (respondió al botón del Paso 1), por lo que probablemente caen dentro de la ventana de sesión de 24h de WhatsApp y pueden enviarse como texto libre sin template pre-aprobado. Todo lo demás, al ser mensajes que reinician contacto fuera de esa ventana, sí requiere template aprobado por Meta.

---

## 10. Diagrama general del recorrido completo

```
┌─────────────────┐     ┌─────────────────┐
│   Lead Magnet    │     │  Direct Booking  │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
   (form: SQL/MQL)                │
         │                        │
   ┌─────┴─────┐                  │
   ▼           ▼                  │
 [SQL]       [MQL]                │
   │           │                  │
   └─────┬─────┘                  │
         ▼                        │
  PIPELINE NUTRICIÓN              │
  (agenda en cualquier punto)     │
         │                        │
         └───────────┬────────────┘
                      ▼
          PIPELINE PRE-REUNIÓN (Discovery)
                      │
                (asiste a diagnóstico)
                      ▼
          PIPELINE PRE-DEMO (Autoridad+Discovery→Demo)
                      │
                (asiste a demo)
                      ▼
          PIPELINE POST-DEMO (Cotización)
                      │
              ┌───────┴───────┐
              ▼               ▼
            WON      LONG_TERM_NURTURE / LOST
```

---

## 11. Checklist de implementación

- [ ] Definir tabla `lead_pipeline` con los campos del modelo de la sección 8.
- [ ] Definir tabla `message_templates` versionada, con `metaTemplateId` por estado.
- [ ] Endpoint único de recepción de QStash (`/api/pipeline/execute`) que reciba `{ leadId, expectedState, dedupKey }` y valide antes de ejecutar.
- [ ] Webhook de WhatsApp Cloud API que, en cada respuesta entrante, resuelva la transición correspondiente y cancele el job pendiente en QStash (`qstash.messages.delete`).
- [ ] Webhook de Google Calendar (o del sistema de agendamiento) que dispare la transición a `SCHEDULED` desde cualquier estado de nutrición.
- [ ] Servicio de pixel tracking que actualice `videoWatched`/`pixelFiredAt` y no dispare envío directo — solo actualiza estado, el job "evaluar y decidir" lee esto al ejecutarse.
- [ ] Job de cron (o QStash recurrente) que revise leads en `LONG_TERM_NURTURE` para campañas de reactivación futuras (fuera de alcance de este documento, pero el estado ya queda modelado).
- [ ] Tests de idempotencia: mismo dedupKey ejecutado dos veces no debe duplicar envío.
- [ ] Tests de invalidación: avanzar estado manualmente y confirmar que el job viejo no ejecuta acción.