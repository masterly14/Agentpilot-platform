# Diagnóstico de duplicación CAPI — 2026-08-31

## Causa raíz identificada

**(d) Otra causa — no es duplicación de `LeadEvent` ni reintento de QStash sobre estos envíos.**

**Confianza: alta** de que **(b)** y **(c)** no explican el 2:1 del 27–31 de agosto. **Alta** de que **(a) no se materializó** en esos registros (el agujero de idempotencia existe en código, pero no se disparó). **Media-baja** sobre el origen exacto de los 16/32 de Events Manager, porque ese volumen **no cuadra con esta base**.

Lo que la base demuestra, rango 27 ago 00:00 – 1 sep 00:00 America/Bogota:

| Métrica | Valor |
|---|---|
| `LeadEvent` `SCHEDULE` | **6** |
| `FormSubmission` con `bookedAt` en el rango | **6** (todas `DIAGNOSIS_PUBLIC`, **cero** `DIRECT_BOOKING`) |
| Emails distintos | 6 |
| `attemptCount` | **1 en los 6** |
| `sentToMeta` | true en los 6 |
| Respuesta Graph `events_received` | **1 en los 6** |
| `triggeredBy` | `system` en los 6 |

Cada reserva real generó **un** `LeadEvent`, **una** llamada HTTP a Meta, y Meta acusó **un** evento. Eso no puede producir `server_received_count = 32` ni `browser_received_count = 16`.

Events Manager está viendo **más eventos de los que este pipeline persistió**. El 2:1 horario es real como síntoma de EM, pero **no es este código enviando dos veces esos 6 CAPI**.

Hay un defecto latente de idempotencia (carrera `sentToMeta` + `retries` default 3 de QStash) que conviene cerrar, pero **no es la causa de estas 6 filas** (`attemptCount` sería ≥2).

---

## Evidencia por punto

### 1. Flujo completo de un `Schedule`

```
POST /api/booking
  → createBooking (Composio / Calendar)
  → recordMarketingStage(to: "SCHEDULED")     solo si source === "composio" && eventId
      → advanceMarketingFunnel
          → leadEvent.create(id: `{submissionId}-Schedule`)
          → enqueueCapiSend(event.id)
              → (prod + QStash) publishJSON → QStash POST /api/marketing/capi/send
              → (else) sendLeadEventToMeta inline
  → JSON { marketingEventId }
Cliente: if (marketingEventId) trackSchedule({ eventID })  → fbq("track","Schedule",…,{eventID})
```

Pasos con archivo y línea:

1. **`app/api/booking/route.ts:206–214, 297–306`** — Tras `createBooking`, si hay evento de calendario Composio llama `recordMarketingStage({ to: "SCHEDULED", eventSourceUrl: …/agendar })`. Si no hay calendario confirmado, `marketingEventId` queda `null` y el Pixel no dispara.

2. **`lib/marketing/events.ts:115–126` (`recordMarketingStage`)** — Atribución first-touch y `advanceMarketingFunnel`.

3. **`lib/marketing/events.ts:41–112` (`advanceMarketingFunnel`)** — `canAdvanceMarketingStage`; actualiza `marketingFunnelStage`; `eventId = eventIdFor(submission.id, "SCHEDULE")` = `{submissionId}-Schedule` (`lib/marketing/types.ts:68–70`); `prisma.leadEvent.create({ id: eventId, … })`; `enqueueCapiSend(event.id)`. Si el create choca `P2002` (único), reencola **solo si** `!existing.sentToMeta`.

4. **Unicidad** — `prisma/schema.prisma:88–112`: `id` es PK; `@@unique([submissionId, eventName])` y `@@unique([airbnbLeadId, eventName])`. No se pueden guardar dos `SCHEDULE` para el mismo submission. No hay `upsert`; el duplicado se absorbe en el `catch P2002`.

5. **`lib/marketing/enqueue.ts:10–36` (`enqueueCapiSend`)** — Payload QStash: `{ eventId }`, URL `{PIPELINE_BASE_URL|/app url}/api/marketing/capi/send`, `deduplicationId: eventId.slice(0, 128)`. **No pasa `retries`.** Inline si QStash no está configurado, si la base URL es localhost, **o si `NODE_ENV !== "production"`**.

6. **QStash** — `deduplicationId` → cabecera `Upstash-Deduplication-Id` (ventana 10 min al publicar). `retries` omitido → **default 3** (`@upstash/qstash`, JSDoc `@default 3`). Fathom sí pone `retries: 3` explícito (`lib/fathom/enqueue.ts:37`); CAPI no. Los reintentos son **del mismo mensaje** si el HTTP no es 2xx; el `deduplicationId` **no** bloquea esos reintentos.

7. **`app/api/marketing/capi/send/route.ts:8–40`** — Verifica firma QStash; `sweep: true` llama `sendUnsentLeadEvents()`; si no, `sendLeadEventToMeta(eventId)`. `maxDuration = 60`.

8. **`lib/marketing/capi.ts:55–166` (`sendLeadEventToMeta`)** — Si `sentToMeta`, sale `already_sent` **sin** llamar a Graph. Si no: incrementa `attemptCount`, POST a `{pixelId}/events` con `event_name: "Schedule"`, `event_id: event.id`. Luego escribe `metaResponse` y `sentToMeta`. Códigos HTTP del route:

| Camino | Status | ¿QStash reintenta? |
|---|---|---|
| Firma inválida | 401 | sí |
| JSON inválido / sin `eventId` | 400 | sí (no 2xx) |
| `sweep` con algún `failed` | 500 | sí |
| `missing` / `already_sent` / `skipped` / `sent` | 200 | no |
| throw tras error Graph | 503 | sí |

`missing` y `skipped` devuelven 200: QStash no reintenta, el evento puede quedar sin enviar.

Carrera: el `if (event.sentToMeta)` no es un lock. Dos invocaciones concurrentes pueden ambas ver `false`, ambas llamar a Graph, ambas poner `sentToMeta: true`. Eso **dejaría `attemptCount` 2**. En el 27–31 está en 1.

Tiempo `createdAt` → `lastAttemptAt` (el increment es **antes** del fetch a Meta): 568–1229 ms. Compatible con inline en el mismo request o con QStash muy rápido. No se puede afirmar cuál path usó producción (hace falta `PIPELINE_BASE_URL` / QStash en Vercel).

Nada en el repo publica `sweep: true`. `vercel.json` no tiene crons. Un schedule creado a mano en Upstash no es visible desde aquí.

### 2. ¿El `LeadEvent` se crea una vez o varias?

Una vez por reserva, y encaja 1:1 con Calendar.

- PK `id` = `{submissionId}-Schedule` + unique `(submissionId, eventName)`.
- 6 `LeadEvent` SCHEDULE = 6 `FormSubmission.bookedAt` en el mismo rango.
- Doble clic: el widget pone `step = "submitting"` (`booking-widget.tsx:718`) pero `setState` no es síncrono; dos POST concurrentes **podrían** crear **dos** submissions (Direct Booking crea fila nueva, `booking/route.ts:237–266`) y **dos** eventos de calendario. En este periodo no ocurrió: 6 filas, 6 emails. Diagnosis con `leadToken` reutiliza el submission; el segundo `create` de `LeadEvent` cae en `P2002`.
- `canAdvanceMarketingStage` (`types.ts:76`) permite `current === next` (reagendar). Admin `reschedule/route.ts:152–157` vuelve a llamar `SCHEDULED`. En estos 6, `triggeredBy` es `system`, no `user:admin`.
- `attachBookingToPipeline` **no** llama CAPI.

**La duplicación no está en la creación.** Los 16 browser de EM no son 16 `LeadEvent`.

### 3. ¿QStash está reintentando de más?

**No en estos 6 envíos.** `attemptCount = 1` y Graph `events_received = 1`. Un reintento que volviera a entrar en `sendLeadEventToMeta` pasaría el increment **o** saldría por `already_sent` sin increment. Nunca quedó en 2.

Configuración real:

- `retries` no se pasa → **3** extra (hasta 4 deliveries si todos fallan).
- `deduplicationId` evita un **segundo publish** en 10 min, no un retry del mensaje ya aceptado.
- Timeout: `maxDuration` 60 s; si QStash corta antes y Graph ya respondió, un retry vería `sentToMeta` (si el update se guardó) y no reenviaría. Esa carrera es posible en abstracto; **no dejó huella aquí**.
- El endpoint **sí** mira `sentToMeta` antes de Graph, pero sin exclusión mutua.

Conclusión: el diseño **no es idempotente bajo concurrencia**. Los datos del 27–31 dicen que esa concurrencia **no ocurrió** para estos eventos.

### 4. ¿Hay dos triggers distintos?

`enqueueCapiSend` solo se llama desde `lib/marketing/events.ts` (create y `P2002` de `advanceMarketingFunnel` y `recordAirbnbMarketingStage`).

Quién llega a `SCHEDULE`:

| Origen | Etapa | ¿Schedule CAPI? |
|---|---|---|
| `app/api/booking/route.ts:298` | `SCHEDULED` | sí |
| `app/api/admin/pipeline/reschedule/route.ts:153` | `SCHEDULED` | sí, si no es demo |
| `app/api/submit-form/route.ts:190` | `LEAD_MAGNET_SENT` | Lead, no Schedule |
| `schedule-demo` | `DEMO_SCHEDULED` | no (no está en `STAGE_EVENT`) |
| Airbnb commercial | `recordAirbnbMarketingStage` | Schedule de Airbnb, no estas 6 (`airbnbLeadId` null) |

No hay cron in-repo ni segundo `publishJSON` de CAPI. Un trigger duplicado **en código de reserva** no aparece. Reagendar admin es un segundo camino, no usado en estas 6 filas.

### 5. Comparación con Lead Magnet

Mismo `enqueueCapiSend` → mismo `sendLeadEventToMeta`.

27–31 ago Bogota: **17** `LeadEvent` LEAD, **17** submissions con evento Lead, `attemptCount` 1, `events_received` 1. Idéntico patrón de envío que Schedule.

Diferencias de código (no de CAPI):

- Lead: `POST /api/submit-form` → `recordMarketingStage(LEAD_MAGNET_SENT)` → cliente `trackEbookLead` / `fbq("track","Lead")`.
- Schedule: `POST /api/booking` → `recordMarketingStage(SCHEDULED)` → `trackSchedule`.

Si Events Manager **no** muestra 2:1 en Lead, la causa del 2:1 de Programar **no es QStash ni `sendLeadEventToMeta`** (compartidos). Si Lead **sí** tiene 2:1, el fenómeno es de dataset/Pixel (conteo received pre-dedup, u otra integración CAPI), no de un bug exclusivo de booking.

No se recibió un export de Lead equivalente a 16/32; no se afirma cómo está Lead en EM.

---

## Comparación con Lead Magnet

En **esta base**, Lead y Schedule se comportan igual: 1 fila, 1 intento, 1 `events_received`. No hay un fork de CAPI que duplique solo Schedule.

El Pixel de Lead (`trackEbookLead`) y el de Schedule (`trackSchedule`) usan el mismo `eventID` de `marketingEventId` / `eventId`. La calidad de coincidencia 9.3/10 encaja con advanced matching + `event_id` compartido; no implica duplicar envíos.

---

## Alcance del impacto

Hay que separar **received (pre-dedup)** de **conversiones únicas (event_id)**.

Para las **6 reservas de esta base**:

- CAPI `event_id` = `{submissionId}-Schedule`.
- El Pixel usa ese mismo id.
- Meta debería **deduplicar** 1 browser + 1 server → **1 conversión** para optimización, no 2.

`attemptCount = 1` implica que este servidor no mandó un segundo CAPI con otro `event_id` para esas 6. El CPA de **esas** reuniones no debería estar al doble **por reintento nuestro**.

Lo que **sí puede inflar** Ads/EM:

- Los **16 browser / 32 server** que EM atribuye a Programar y que **no existen como 16 `LeadEvent`**. Si esos extras tienen `event_id` distintos y caen en la ventana de atribución, el conjunto **puede** aprender con conversiones de más. Eso **no se puede confirmar** sin el desglose unique/deduplicated de EM y sin Ads Insights `schedule_website`.
- Received 32 no es “32 reuniones”. Es recibidos crudos. Hay que mirar el recuento **deduplicado** en Events Manager.

Direct Booking: en este rango **no hubo** `bookingFlow: DIRECT_BOOKING`. Las 6 son diagnosis pública. Si los conjuntos de Direct Booking “vieron” Schedule, o bien EM está mezclando diagnosis, o hay eventos de Programar que no pasaron por este CRM.

---

## Recomendación de corrección

Ordenadas por impacto / facilidad. **No aplicadas.**

1. **Leer EM y Ads con la métrica correcta (operativo, 10 min).** En Events Manager, Programar 27–31: columnas unique / deduplicated, no solo `browser_received_count` / `server_received_count`. En Ads: `schedule_website` / `schedule_total`. Comparar con 6. Si unique ≈ 6, el 16/32 es ruido de received y el algoritmo no está al 2×.

2. **Cerrar la carrera CAPI (código, alto valor, no explica estas 6).** En `sendLeadEventToMeta`, reclamar el envío con  
   `updateMany({ where: { id, sentToMeta: false }, data: { sentToMeta: true, attemptCount: { increment: 1 } } })`  
   y **solo entonces** llamar a Graph; si `count === 0`, return `already_sent`. Evita el doble POST concurrente.

3. **`retries: 0` o `1` en `enqueueCapiSend`.** Meta no es idempotente si el lock falla. Fathom ya fija `retries`; CAPI se apoya en el default 3.

4. **No devolver 503 si Graph ya aceptó el evento.** Hoy el throw es solo si Graph falla, después de persistir `sentToMeta`. Mantener 200 en `already_sent` (ya ocurre).

5. **`canAdvanceMarketingStage`:** `current === next` + `P2002` + `!sentToMeta` puede reencolar. Tras el lock de (2), es inofensivo. Opcional: no reencolar en P2002 si ya existe el evento.

6. **Auditoría fuera del repo:** consola Upstash (schedules hacia `/api/marketing/capi/send`), otros datasets/tokens CAPI sobre el Pixel `1739545530581946`, Test Events, preview deploys con el mismo Pixel.

---

## Lo que no se pudo determinar

- **De dónde salen los 16 browser y 32 server de EM.** Esta DB tiene 6 CAPI Schedule (27–31 Bogota), 10 si se suma el 26 Bogota. Ningún rango razonable llega a 16/32. No hay evidencia de que este proceso los haya emitido.
- **Si Lead en EM tiene el mismo 2:1.** El código CAPI es el mismo; faltan los números de EM.
- **Si producción usó QStash o inline.** Depende de `QSTASH_*`, `PIPELINE_BASE_URL` y `NODE_ENV` en Vercel, no leídos aquí. Los deltas 0,5–1,2 s no deciden.
- **Si existe un schedule QStash `sweep: true` creado a mano.** No está en el repo ni en `vercel.json`.
- **Si otra app, GTM o Conversions API Gateway** publica `Schedule` al mismo Pixel.
- **Timezone exacto del reporte EM** (UTC vs Bogota). Aun moviendo el corte, no se llega a 16 filas.
- **Si el recuento unique/deduplicated de EM es ~6.** Eso decide si Ads está sobre-contando o solo el informe de received está inflado.
- **PII:** los 6 emails están en CRM; no se listan en este archivo.
