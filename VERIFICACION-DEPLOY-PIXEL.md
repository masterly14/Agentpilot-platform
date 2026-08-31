# Verificación de despliegue — 2026-08-31

## Conclusión

**El fix está en producción hoy y el problema observado no es un `trackCustom` que siga en el código.** No hay una segunda función de cliente que emita `Schedule`. El siguiente paso no es cambiar `lib/facebook-pixel.ts`.

Evidencia directa del bundle que sirve `https://agentpilot.cloud` ahora mismo (despliegue `dpl_EBt6bj7yUENFZdCHWs8cPTE9RyUL`):

```js
window.fbq("track","Schedule",{content_name:"Reunión agendada",content_category:"booking",value:25,currency:"USD",status:"confirmed"},{eventID:e.eventID})
```

No aparece `trackCustom` en los chunks de esa página. El HTML de producción inicializa el Pixel `1739545530581946`.

Eso **no** explica por sí solo los 6 `offsite_conversion.fb_pixel_custom` de los 5 días anteriores. Quedan dos frentes, en este orden:

1. **Cómo se leyó Meta Ads.** La Insights API **no tiene** `offsite_conversion.fb_pixel_schedule`. El evento estándar `Schedule` se reporta como `schedule_website` / `schedule_total`. `offsite_conversion.fb_pixel_custom` es el cubo de eventos personalizados. Buscar un `fb_pixel_schedule` inexistente da cero aunque el estándar esté llegando.
2. **Cuándo llegó el bundle con `track` a producción.** El commit del fix está en `origin/main`, y el JS live de hoy ya lo incluye. Esta sesión no pudo listar el historial de deploys de Vercel (API 403/404 sobre este proyecto), así que no se puede afirmar que las 6 reservas del 26–31 corrieron contra ese bundle. Si el push/deploy efectivo fue el 31 por la mañana, las 6 reuniones habrían visto todavía `trackCustom`.

CAPI es una vía paralela: envía `event_name: "Schedule"` (estándar) con el mismo `event_id` que el Pixel. Si Events Manager muestra cero `Schedule` estándar en 5 días, CAPI tampoco está aterrizando como estándar — o no se está mirando Events Manager, sino solo el action type de Ads.

---

## Evidencia por punto

### 1. ¿El commit de la corrección llegó a la rama de producción?

Sí, está en `main` y en `origin/main`.

| Campo | Valor |
|---|---|
| Hash corto | `2719518` |
| Hash completo | `27195185416182a1459db344c8bf7eb4246311e3` |
| Fecha | miércoles 26 ago 2026, 23:07:45 −05:00 |
| Mensaje | `Updatede Landing and Pixel` |
| Diff | `trackCustom` → `track` en `trackSchedule` (único cambio de `lib/facebook-pixel.ts`) |
| Ramas que lo contienen | `main`, `remotes/origin/main` |

HEAD local = `origin/main` = `3394650` (`Updated`, 31 ago 08:11 −05:00). `2719518` es ancestro de ese HEAD (`git merge-base --is-ancestor` = sí). Commits posteriores al fix:

- `a68f7ab` (28 ago) — pipeline WhatsApp, no toca el Pixel
- `f272b57` (31 ago 08:05) — calendario de los widgets + docs
- `3394650` (31 ago 08:11) — reagendar / Composio

`vercel.json` no declara rama de producción; solo `buildCommand`, `installCommand` y `framework: nextjs`. El default de Vercel es `main`. El README del repo dice que cada merge a `main` se despliega solo. `.vercel/project.json` (gitignored) apunta a:

- proyecto: `agentpilot-platform`
- `projectId`: `prj_V26byzEHTV9xyE6tQwfoT4aUbdOv`
- team: `team_AmpajkWBrL9kfhzU730OzX1X` (monach)

Dominio live: `agentpilot.cloud` / `www.agentpilot.cloud` (respuesta `x-vercel-id`, Pixel y widget de Direct Booking coinciden con este repo).

**Límite:** git no guarda la hora del `push`. El commit del 26 está en origin ahora; no se puede saber desde el repo si se empujó el 26 por la noche, el 28 o el 31. Vercel MCP no listó este proyecto ni el deploy `dpl_EBt6bj7yUENFZdCHWs8cPTE9RyUL` (403/404). El SHA exacto del deploy live no se pudo leer por API.

### 2. ¿El código fuente actual tiene el fix?

Sí. `lib/facebook-pixel.ts` en disco, función completa:

```ts
export function trackSchedule(params: {
  email: string
  fullName: string
  eventID: string
}) {
  if (!params.eventID || !initAdvancedMatching(params.email, params.fullName) || !window.fbq) return

  window.fbq(
    "track",
    "Schedule",
    {
      content_name: "Reunión agendada",
      content_category: "booking",
      value: 25,
      currency: "USD",
      status: "confirmed",
    },
    { eventID: params.eventID },
  )
}
```

`origin/main:lib/facebook-pixel.ts` es idéntico. El último commit que tocó ese archivo es `2719518`; no hubo revert.

### 3. ¿Hay más de un lugar que dispare `Schedule`?

No hay un segundo `fbq(..., "Schedule")` en el cliente. Ocurrencias relevantes:

| Archivo | Línea | Qué es |
|---|---|---|
| `lib/facebook-pixel.ts` | 6 | Unión de tipos `"init" \| "track" \| "trackCustom"` — no dispara nada |
| `lib/facebook-pixel.ts` | 34–52 | **Única** llamada `fbq("track", "Schedule", ...)` |
| `components/landing/booking-widget.tsx` | 37, 756–760 | Importa y llama `trackSchedule` tras booking OK (Direct Booking / `/` y `/agendar`) |
| `components/diagnosis/booking-widget-light.tsx` | 45, 827–831 | Igual, flujo diagnosis |
| `lib/marketing/types.ts` | 31 | `META_EVENT_NAME.SCHEDULE = "Schedule"` — nombre CAPI, no Pixel de navegador |
| `lib/marketing/capi.ts` | 121 | `event_name: META_EVENT_NAME[event.eventName]` → `"Schedule"` por servidor |
| `app/api/booking/route.ts` | 210, 317 | Logs; no llama `fbq` |
| `scripts/funnel-test/funnel.ts` | 212, 227–231 | Tests |
| Admin `onScheduleDemo` / `executeScheduledStep` / `paymentSchedule` | — | Nombres de UI/pipeline; no son el evento Meta |

Los widgets también llaman `window.fbq?.("track", "ViewContent", ...)` al 50 % de visibilidad del calendario. Eso es evento **estándar** `ViewContent`, no `Schedule` y no `trackCustom`.

Búsqueda global de `fbq(` + Schedule: solo `trackSchedule`. Cero `trackCustom("Schedule")` residual.

### 4. ¿El evento se dispara desde donde se cree?

Sí, y solo si el servidor confirma calendario + etapa de marketing.

Cadena Direct Booking (`/` → `BookingWidget`) y diagnosis (`booking-widget-light`):

1. `POST /api/booking`
2. `createBooking` → Google Calendar vía Composio
3. Guarda `hasConfirmedCalendarEvent = source === "composio" && eventId`
4. Si eso falla: responde OK al visitante pero `marketingEventId: null` → **el cliente no llama `trackSchedule`**
5. Si confirma: `recordMarketingStage({ to: "SCHEDULED" })` crea `LeadEvent` con id `{submissionId}-Schedule` y encola CAPI
6. JSON: `{ marketingEventId }`
7. Cliente: `if (result.marketingEventId) trackSchedule({ eventID: result.marketingEventId })`

No hay wrapper/hook intermedio que llame `fbq` por fuera de `lib/facebook-pixel.ts` para `Schedule`. `initAdvancedMatching` solo hace un segundo `fbq("init", PIXEL_ID, { em, fn })` antes del `track`.

CAPI corre **en paralelo, en el servidor**, con el mismo `event_id`. En producción (QStash configurado) el envío no es inline: `enqueueCapiSend` publica a `/api/marketing/capi/send`. Si QStash o `PIPELINE_BASE_URL` fallan en Vercel, el Pixel de navegador seguiría siendo la única señal. CAPI no usa `trackCustom`; clasifica por `event_name`. `"Schedule"` es nombre estándar de Conversions API.

`/agendar` monta el mismo `BookingWidget` de landing (con token de guía). Mismo `trackSchedule`.

### 5. ¿Es un problema de build o caché?

**El JS que se sirve hoy no está cacheado en una versión con `trackCustom`.** El chunk `0~e609p-gaxs2.js` del deploy live contiene `fbq("track","Schedule",...)`. No hay `trackCustom` en los chunks de `/`.

Caché observada:

| Recurso | `Cache-Control` | Efecto |
|---|---|---|
| HTML `/` | `public, max-age=0, must-revalidate` (`x-vercel-cache: HIT`) | Se revalida; un deploy nuevo cambia las URLs de chunks |
| JS `/_next/static/chunks/*` | `public, max-age=31536000, immutable` | 1 año, **pero** el nombre del archivo está hasheado y lleva `?dpl=dpl_EBt6bj7yUENFZdCHWs8cPTE9RyUL` |

Eso es el modelo normal de Vercel/Next: visitantes nuevos tras un deploy reciben HTML nuevo → chunks nuevos. No hay `headers` / CDN extra en `next.config.mjs` ni `vercel.json` que pinaran un bundle viejo. Un HTML de pestaña abierta desde antes del deploy podría seguir con chunks viejos; no aplica a tráfico de anuncios fresco.

`.next/` local existe (dev); está en `.gitignore`. Un grep local de `trackCustom` en `.next` no halló el evento. `.vercel/output` no está en el árbol. Eso no afecta producción.

Fecha del último production build **exitoso**: no se pudo leer por API. El `dpl` del HTML live es `dpl_EBt6bj7yUENFZdCHWs8cPTE9RyUL`. Los commits de esta mañana (`f272b57`, `3394650`) habrían disparado un deploy si el auto-deploy de `main` está activo; es plausible que el bundle inspeccionado sea de hoy ~08:05–08:11 −05:00. Hay que confirmarlo en el dashboard de Vercel → `agentpilot-platform` → Production.

### 6. Verificación cruzada del Pixel ID

Un solo ID en todo el proyecto: **`1739545530581946`**.

| Sitio | ID |
|---|---|
| `lib/facebook-pixel.ts` | `process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID` |
| `components/analytics/facebook-pixel.tsx` | el mismo, inyectado en `fbq('init')` + noscript |
| `lib/marketing/capi.ts` | `META_PIXEL_ID` o fallback a `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` |
| `.env` local | ambos = `1739545530581946` |
| `.env.example` | el mismo |
| HTML de `https://agentpilot.cloud/` | `fbq('init', '1739545530581946')` + `tr?id=1739545530581946` |
| `/` y `/diagnosis` | mismo `dpl`, mismo Pixel |

No hay `.env.production` ni `.env.local` en el disco. No hay GTM, gtag, TikTok, LinkedIn ni otro Pixel en el HTML de `/`. El layout público (`app/(public)/layout.tsx`) es el único que monta `<FacebookPixel />`.

No se pueden leer las env vars de Vercel desde aquí. El HTML live demuestra que producción inyecta el ID esperado. Un ID distinto en Vercel habría aparecido en el snippet.

---

## Lectura de Ads vs Events Manager (causa alternativa fuerte)

Documentación oficial de Ads Action Stats (`action_type`):

Eventos Pixel con tipo propio, entre otros:

- `offsite_conversion.fb_pixel_lead`
- `offsite_conversion.fb_pixel_purchase`
- `offsite_conversion.fb_pixel_view_content`
- `offsite_conversion.fb_pixel_custom` ← **todos los eventos personalizados, sin desglose por nombre**

**No existe** `offsite_conversion.fb_pixel_schedule`.

El estándar `Schedule` aparece como:

- `schedule_website` — Website Appointments Scheduled
- `schedule_total` — Appointments Scheduled

Si el informe de los 5 días se armó buscando `fb_pixel_schedule` (por analogía con Lead/Purchase) y contando `fb_pixel_custom`, el resultado “6 custom / 0 Schedule” es exactamente lo que esa consulta devuelve:

- con `trackCustom("Schedule")` → todo cae en `fb_pixel_custom`
- con `track("Schedule")` → debería aparecer en `schedule_website` / `schedule_total`, no en `fb_pixel_schedule`

Los conjuntos que optimizan a la conversión estándar `Schedule` en Ads Manager usan el evento del dataset (Events Manager), no el string `fb_pixel_schedule`. Aun así, si el dataset todavía tiene un evento **personalizado** llamado `Schedule` (creado por semanas de `trackCustom`), Events Manager puede mostrar dos filas con el mismo nombre. Hay que mirar el tipo (estándar vs personalizado), no solo el label.

---

## Recomendación

No tocar código todavía. Tres comprobaciones, en este orden:

1. **Events Manager (dataset del Pixel `1739545530581946`), no Ads Insights.** Últimos 7 días: ¿existe `Schedule` bajo eventos **estándar**? ¿El personalizado `Schedule` sigue recibiendo hits después del deploy de hoy? Test Events: una reserva de prueba y confirmar `Schedule` estándar (browser y/o server) con el `event_id` `{submissionId}-Schedule`.
2. **Ads Manager / Insights.** Columnas o `action_type` `schedule_website` y `schedule_total`. No usar `offsite_conversion.fb_pixel_schedule`. Si `schedule_website` ya tiene las 6 (o parte) y `fb_pixel_custom` es el cubo viejo, el algoritmo sí tiene señal; el diagnóstico de “cero Schedule” era de métrica.
3. **Dashboard Vercel → `agentpilot-platform` → Production.** ¿Hubo un Ready de `2719518` el 26/27, de `a68f7ab` el 28, o el primer Ready con el fix es `dpl_EBt6bj7yUENFZdCHWs8cPTE9RyUL` de esta mañana? Si las 6 reuniones son anteriores a ese Ready, esas 6 salieron con `trackCustom` y el fix live solo cubre reservas nuevas.

Si el test del punto 1 dispara `Schedule` estándar y Ads sigue sin `schedule_website`, el hueco es de configuración del conjunto (evento de optimización / custom conversion histórica), no de `fbq`. Si el test sigue saliendo como personalizado con el bundle que ya tiene `"track"`, entonces Events Manager tiene un evento custom homónimo y hay que tratarlo en Meta (no con otro cambio de `track`/`trackCustom`).
