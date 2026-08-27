# Correcciones aplicadas — 2026-08-26

## Cambios realizados

### 1. `Schedule` ahora es evento estándar

**Archivo:** `lib/facebook-pixel.ts:41-52`

Se cambió únicamente el comando de `trackCustom` a `track`. Se conservaron todos los parámetros, `eventID`, la guarda y `initAdvancedMatching`. `trackEbookLead` ya utilizaba `track` y no se modificó.

```diff
 window.fbq(
-  "trackCustom",
+  "track",
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
```

La búsqueda global de llamadas a `trackCustom` no encontró otras llamadas que envíen eventos estándar de Meta en los flujos públicos. Solo quedan referencias textuales y la unión de tipos `command: "init" | "track" | "trackCustom"`.

### 2. `test_event_code` queda fuera de producción

**Archivo:** `lib/marketing/capi.ts:135-136`

La incorporación de `test_event_code` ahora depende de que `NODE_ENV` no sea `production`. Se eligió esta condición por ser el cambio de menor superficie. `lib/marketing/capi-test.ts` construye y envía su propio payload, por lo que continúa usando su código de prueba sin necesitar override adicional.

```diff
-const testCode = process.env.META_TEST_EVENT_CODE?.trim()
+const testCode = process.env.NODE_ENV !== "production" ? process.env.META_TEST_EVENT_CODE?.trim() : ""
 if (testCode) payload.test_event_code = testCode
```

### 3. No se emite `Schedule` sin evento de Google Calendar confirmado

**Archivo:** `app/api/booking/route.ts:206-214,297-305`

Después de `createBooking`, la ruta exige simultáneamente `source === "composio"` y `eventId` antes de crear la etapa de marketing. Para `source: "mock"` o una respuesta de Composio sin `eventId`, mantiene la persistencia y la respuesta exitosa al visitante, registra un error de servidor y devuelve `marketingEventId: null`; por ello no se llama al Pixel de navegador ni a CAPI.

```diff
 const result = await createBooking(payload)
 const meetingTime = parseBookingDateTime(payload.slotStart)
+const hasConfirmedCalendarEvent = result.source === "composio" && Boolean(result.eventId)
+if (!hasConfirmedCalendarEvent) {
+  console.error("[booking/create] reserva sin evento de calendario confirmado; se omite Schedule", {
+    source: result.source,
+    hasEventId: Boolean(result.eventId),
+  })
+}

-const marketing = savedSubmissionId
+const marketing = savedSubmissionId && hasConfirmedCalendarEvent
   ? await recordMarketingStage({
       submissionId: savedSubmissionId,
       to: "SCHEDULED",
```

### 4. Endpoint legado de video sin etapa de marketing

**Archivo:** `app/api/pipeline/video/route.ts:1-18`

Se retiraron las rutas que llamaban `markVideoWatched` o `recordMarketingStage`. El endpoint conserva la validación de token/lead y continúa redirigiendo en `GET`, o respondiendo con el mismo booleano en `POST`, sin emitir `ViewContent`.

```diff
 import { NextResponse } from "next/server"
 import { prisma } from "@/lib/prisma"
-import { MARKETING_TRIGGERED_BY, recordMarketingStage } from "@/lib/marketing/events"
-import { markVideoWatched } from "@/lib/pipeline/engine"
 
 // ...
-if (submission.contactId) {
-  // buscaba pipeline y llamaba markVideoWatched(...)
-}
-await recordMarketingStage({
-  submissionId: submission.id,
-  to: "VIDEO_SENT",
-  triggeredBy: MARKETING_TRIGGERED_BY.system,
-})
+// El video fue retirado; conservar la redirección de enlaces existentes sin emitir ViewContent.
 return true
```

### 5. `ViewContent` al ser visible el calendario

**Archivos:** `components/landing/booking-widget.tsx:543-598,794` y `components/diagnosis/booking-widget-light.tsx:612-667,865-868`

Cada widget tiene una referencia a su contenedor y un flag `useRef`. Un `IntersectionObserver` con umbral de 50% envía una sola vez el evento estándar de navegador al tener al menos la mitad del calendario visible, y desconecta el observer. No hay CAPI, `LeadEvent` ni cambio de deduplicación asociado.

```diff
 const mobileTimesPanelRef = useRef<HTMLDivElement>(null)
+const bookingWidgetRef = useRef<HTMLDivElement>(null)
+const calendarViewedRef = useRef(false)

+useEffect(() => {
+  const node = bookingWidgetRef.current
+  if (!node || calendarViewedRef.current) return
+
+  const observer = new IntersectionObserver(
+    ([entry]) => {
+      if (!entry?.isIntersecting || calendarViewedRef.current) return
+      calendarViewedRef.current = true
+      observer.disconnect()
+      window.fbq?.("track", "ViewContent", {
+        content_name: "Calendario de agendamiento",
+        content_category: "booking",
+      })
+    },
+    { threshold: 0.5 },
+  )
+
+  observer.observe(node)
+  return () => observer.disconnect()
+}, [])

-<div className="...">
+<div ref={bookingWidgetRef} className="...">
```

El widget de Direct Booking se coloca después de la hero. En escritorio, la hero elimina su altura mínima a partir de `md` (`components/landing/hero-section.tsx:9-11`), por lo que, según la altura efectiva del viewport, el calendario puede alcanzar el umbral desde el render inicial. En ese caso `ViewContent` mide visibilidad, no necesariamente una exploración intencional.

## Cambios NO aplicados

Ninguno de los cinco cambios requeridos quedó pendiente.

## Acciones manuales pendientes

- Revisa y elimina `META_TEST_EVENT_CODE` del entorno de **producción** en el panel de despliegue. La corrección evita que el código lo adjunte en producción, pero no elimina la variable remota.
- Despliega estos cambios antes del lanzamiento y valida en Meta Events Manager que `Schedule` aparezca como evento estándar recibido, no como evento personalizado.

## Verificación

- `pnpm run build` finalizó correctamente: compilación, TypeScript y generación de páginas completados sin errores.
- El build mostró un warning preexistente de trazado Turbopack/NFT relacionado con `next.config.mjs` → Prisma → `app/api/video/heartbeat/route.ts`. No se modificó por estar fuera de alcance.
- Archivos de código tocados, todos dentro de los cambios solicitados:
  - `lib/facebook-pixel.ts`
  - `lib/marketing/capi.ts`
  - `app/api/booking/route.ts`
  - `app/api/pipeline/video/route.ts`
  - `components/landing/booking-widget.tsx`
  - `components/diagnosis/booking-widget-light.tsx`
- Archivo de informe creado: `CORRECCIONES-PIXEL.md`.
- No se actualizaron dependencias ni se modificaron flujos de deduplicación, hashing, reservas, UTMs o cambios de ruta.
- El árbol ya contenía modificaciones ajenas a esta corrección en `components/diagnosis/content.ts`, `components/diagnosis/diagnosis-page.tsx`, `components/diagnosis/hero.tsx` y `next-env.d.ts`; no se tocaron.

## Observaciones

No se modificaron los siguientes temas, conforme al alcance: `external_id` sin hash, token CAPI en query string, `event_source_url` fijo en `/agendar`, `PageView` sin navegación SPA, `utmContent` ausente en `LandingVisit`, `/` fuera de `AD_LANDING_PATHS`, `/qualificacion` incompatible, doble `init` del Pixel y ausencia de cron de reintentos CAPI.
