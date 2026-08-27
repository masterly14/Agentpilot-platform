# Auditoría del Píxel de Meta — 2026-08-26

## 1. Resumen ejecutivo

Se encontró un único ID de píxel, `1739545530581946`, que coincide con el esperado y está configurado tanto para navegador como para CAPI.
El píxel base se inyecta una sola vez desde el layout público con `afterInteractive`; no hay GTM, Segment ni otro gestor de etiquetas en el código revisado.
`Lead` se dispara únicamente tras una respuesta HTTP exitosa del backend, después de validar y persistir el formulario.
`Schedule` se dispara después de que `/api/booking` responde exitosamente y comparte `eventID` con CAPI.
La reserva se realiza con un widget propio y Google Calendar vía Composio, no con iframe/Calendly.
Hay una vía de falso positivo: si Composio no está configurado, el backend devuelve una reserva simulada exitosa y aun así emite `Schedule`.
No hay un `PageView` explícito en las navegaciones SPA ni un evento que marque la visualización del calendario.
Quedaron artefactos del antiguo video: código de reproductor, heartbeat, scroll lock, endpoint y un `ViewContent` CAPI que puede activarse sin verificar una reproducción.
El `.env` local define `META_TEST_EVENT_CODE`; si ese valor existe también en producción, todos los envíos CAPI se marcan como eventos de prueba.
El `utm_content` se conserva hasta `FormSubmission`, pero no se envía como parámetro de Pixel/CAPI ni se guarda en el registro agregado de visitas.

## 2. Hallazgos críticos

### C-1. `Schedule` puede emitirse aunque no se haya creado una reunión real

- **Dónde:** `lib/booking/composio-calendar.ts:315-323`, `app/api/booking/route.ts:290-320`, `components/landing/booking-widget.tsx:701-749`.
- **Qué pasa:** cuando Composio no está configurado, `createBooking()` devuelve `success: true` con `source: "mock"`. La ruta continúa guardando la reserva, crea/emite el evento de marketing y devuelve su `marketingEventId`; el cliente entonces ejecuta `trackSchedule`.
- **Implicación:** Meta puede recibir `Schedule` y CAPI puede recibir el mismo evento deduplicado aun sin un evento de Google Calendar. El código local revisado contiene configuración de Composio, pero no fue posible comprobar la configuración efectiva del despliegue.

```ts
315:353:lib/booking/composio-calendar.ts
export async function createBooking(payload: BookingFormPayload): Promise<BookingCreateResponse> {
  const slotStart = normalizeSlotStart(payload.date, payload.slotStart)

  if (!isComposioConfigured()) {
    return {
      success: true,
      source: "mock",
    }
  }

  await assertSlotIsAvailable(payload.date, slotStart)

  const answers = formatBookingAnswersForDescription({
    usesPms: payload.usesPms,
    propertyCount: payload.propertyCount,
    revenueRange: payload.revenueRange,
    isTodero: payload.isTodero,
    usesAi: payload.usesAi,
    wantsToScale: payload.wantsToScale,
    industryTime: payload.industryTime,
    phoneCountryCode: payload.phoneCountryCode,
    phoneNumber: payload.phoneNumber,
    companyName: payload.companyName,
    websiteUrl: payload.websiteUrl,
    instagramUrl: payload.instagramUrl,
    origin: payload.origin,
  })
  const timezoneNote = formatBookingTimezoneNote(slotStart, payload.visitorTimezone)
  const description = [timezoneNote, answers].filter(Boolean).join("\n\n")
  const start = parseBookingDateTime(slotStart)

  return createMeetingEvent({
    summary: `Reunión con ${payload.fullName}`,
    description: description || undefined,
    start,
    durationMinutes: bookingConfig.slotMinutes,
    attendeeEmail: payload.email,
  })
}
```

### C-2. El remanente de video puede producir un `ViewContent` de CAPI sin que exista reproducción comprobada

- **Dónde:** `app/api/pipeline/video/route.ts:30-47`, `lib/pipeline/engine.ts:496-517`, `lib/marketing/types.ts:43-48`.
- **Qué pasa:** un `GET` a `/api/pipeline/video?token=...` llama a `recordVideo()` y luego redirige a una URL de diagnóstico. `recordVideo()` termina creando la etapa `VIDEO_SENT`; esa etapa se traduce a `VIEW_CONTENT`. No hay comprobación de reproducción en esa ruta.
- **Implicación:** si el enlace aún se distribuye, una apertura del enlace puede señalar `ViewContent` a Meta aunque el usuario no vea el video. Además, el componente `LandingVideoPlayer` no está importado por ninguna página/componente de producción encontrada.

```ts
30:47:app/api/pipeline/video/route.ts
  await recordMarketingStage({
    submissionId: submission.id,
    to: "VIDEO_SENT",
    triggeredBy: MARKETING_TRIGGERED_BY.system,
  })
  return true
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim()
  if (token) {
    try {
      await recordVideo(token)
    } catch (error) {
      console.error("[pipeline/video]", error)
    }
  }
  return NextResponse.redirect(videoRedirectUrl())
}
```

### C-3. No se registra `PageView` en cambios de ruta de cliente

- **Dónde:** `components/analytics/facebook-pixel.tsx:11-23`; no se encontró `usePathname`, listener de navegación ni otro `fbq('track', 'PageView')` fuera de este snippet.
- **Qué pasa:** `PageView` se ejecuta en el script base al cargar el layout público. No hay código que lo vuelva a emitir al navegar entre rutas públicas mediante App Router.
- **Implicación:** una sesión que navegue en cliente de `/ebook` a `/gracias` o a otra ruta pública no genera un `PageView` adicional para Meta. No se observó duplicación por navegación; el problema es cobertura incompleta de vistas posteriores.

### C-4. El código de prueba CAPI se adjunta a todos los eventos cuando la variable existe

- **Dónde:** `.env:54` y `lib/marketing/capi.ts:135-136`.
- **Qué pasa:** el envío principal de CAPI añade `test_event_code` sin condicionar el entorno. La variable está definida en el `.env` local inspeccionado.
- **Implicación:** si esa variable se replica en producción, cada evento CAPI se enviará como prueba. No se puede determinar estáticamente si sucede en el despliegue, pero la implementación no lo previene.

```ts
135:136:lib/marketing/capi.ts
  const testCode = process.env.META_TEST_EVENT_CODE?.trim()
  if (testCode) payload.test_event_code = testCode
```

## 3. Hallazgos menores

- `initAdvancedMatching()` llama a `fbq("init", PIXEL_ID, ...)` en cada conversión de navegador (`lib/facebook-pixel.ts:22-30`), además del `init` del snippet base. No se ejecuta por re-render, pero hay dos puntos de inicialización.
- No existe `fbq('set', 'autoConfig', 'false', ...)` en el código fuente revisado.
- No se envían respuestas de cualificación (propiedades, facturación, PMS, etc.) en `custom_data` de Pixel ni CAPI; solo se transmiten `value` y `currency` para CAPI.
- El `external_id` de CAPI se manda sin hash, mientras que `em`, `ph`, `fn` y `ln` se normalizan y hashean con SHA-256.
- `LandingVisit` guarda `utmSource`, `utmMedium` y `utmCampaign`, pero omite `utmContent` y `utmTerm` (`lib/ad-landing.ts:119-130`). Sí se conservan en `FormSubmission`.
- El layout de la home mantiene un `ScrollLockProvider`; el calendario no tiene una condición de video, pero inicialmente se requiere pulsar la flecha para desbloquear el desplazamiento hacia él.
- CAPI implementa `sendUnsentLeadEvents()`, pero no se encontró cron ni invocador automático del modo `{ sweep: true }`; los fallos pendientes pueden permanecer sin reintento automático.
- Si Direct Booking de campañas es la ruta `/`, no queda registrada en el analítico interno `LandingVisit`: `AD_LANDING_PATHS` solo incluye `/ebook` y `/diagnosis` (`lib/ad-landing.ts:4`).
- Los `Schedule` creados por `/api/booking` declaran `event_source_url` como `/agendar` aun si la reserva procedió de `/` o `/diagnosis` (`app/api/booking/route.ts:290-298`).
- La ruta pública `/qualificacion` envía una forma de payload distinta a `/api/submit-form`; la validación del backend la rechaza y esa ruta no llama `trackEbookLead` (`components/multi-step-form.tsx:99-118`, `app/api/submit-form/route.ts:49-80`).

## 4. Inventario de eventos

| Evento | Archivo:línea | Qué lo dispara exactamente | Parámetros enviados |
|---|---|---|---|
| `PageView` | `components/analytics/facebook-pixel.tsx:22` | Script `next/script` con `strategy="afterInteractive"` renderizado por `app/(public)/layout.tsx:10`. Se ejecuta cuando carga el snippet base en una página del grupo público; no está en `useEffect` ni en un `onClick`. | Ninguno. El fallback `<noscript>` usa `https://www.facebook.com/tr?id=...&ev=PageView&noscript=1` en `:30`. |
| `Schedule` (`trackCustom`) | `lib/facebook-pixel.ts:41-52` | Llamada dentro del callback asíncrono `handleFormSubmit`, solo después de `await fetch("/api/booking")`, de comprobar `response.ok` y de recibir `result.marketingEventId`: `components/landing/booking-widget.tsx:701-749`. La variante de diagnóstico hace lo mismo en `components/diagnosis/booking-widget-light.tsx:770-820`. | `content_name: "Reunión agendada"`, `content_category: "booking"`, `value: 25`, `currency: "USD"`, `status: "confirmed"`; opciones `{ eventID }`. |
| `Lead` | `lib/facebook-pixel.ts:59-70` | Llamada dentro del callback asíncrono `handleSubmit`, solo después de `await fetch("/api/submit-form")`, de comprobar `response.ok` y de recibir `payload.eventId`: `components/ebook-landing/lead-modal.tsx:337-400`. | `content_name: "Guía gratuita"`, `content_category: "ebook"`, `value: 0`, `currency: "USD"`, `status: "submitted"`; opciones `{ eventID }`. |

No se encontraron más llamadas fuente a `fbq('track', ...)`, `fbq('trackCustom', ...)` ni `window.fbq(...)`.

## 5. Respuestas punto por punto

### 1. Instalación base del píxel

**Apariciones localizadas.** Se encontraron el loader de `fbevents.js`, `fbq`, `init`, `PageView` y helpers de conversión en:

- `components/analytics/facebook-pixel.tsx:1-36`
- `lib/facebook-pixel.ts:1-71`
- `app/(public)/layout.tsx:1-14`

No se encontraron `facebook-jssdk`, `react-facebook-pixel`, GTM, Segment, `googletagmanager`, `gtag`, RudderStack, Tealium ni otro gestor de etiquetas.

Hay **un ID distinto**: `1739545530581946`. Está definido para navegador en `.env:33` (`NEXT_PUBLIC_FACEBOOK_PIXEL_ID`) y para CAPI en `.env:53` (`META_PIXEL_ID`); el ejemplo también lo documenta en `.env.example:16,20`. Ambos valores coinciden con el ID esperado. El ID público es, por diseño, visible al cliente.

El script base se inyecta en el layout del grupo de rutas públicas, no en `_document`, `<head>` ni GTM:

```tsx
1:14:app/(public)/layout.tsx
import { FacebookPixel } from "@/components/analytics/facebook-pixel"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <FacebookPixel />
      {children}
    </>
  )
}
```

```tsx
11:33:components/analytics/facebook-pixel.tsx
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
```

La estrategia es **`afterInteractive`**. Hay dos sitios fuente con `fbq('init')`: el snippet base y `initAdvancedMatching`. El segundo solo se invoca por `trackSchedule` o `trackEbookLead`, es decir, después de una conversión; no está en un `useEffect` ni se ejecuta en re-renders.

```ts
22:30:lib/facebook-pixel.ts
function initAdvancedMatching(email: string, fullName: string) {
  if (typeof window === "undefined" || !window.fbq || !PIXEL_ID) return false
  const normalizedEmail = email.trim().toLowerCase()
  const firstName = getFirstName(fullName)
  window.fbq("init", PIXEL_ID, {
    em: normalizedEmail,
    ...(firstName ? { fn: firstName } : {}),
  })
  return true
}
```

No existe `fbq('set', 'autoConfig', 'false', ...)`; por tanto no hay un orden que reportar respecto de `init`.

### 2. Inventario completo de eventos

El inventario completo de llamadas de navegador está en la sección 4. Los disparadores son: una carga de script `afterInteractive` para `PageView`, y callbacks de éxito de `fetch` para `Schedule` y `Lead`. No hay eventos de navegador que se disparen al montar un componente, en `useEffect`, ni directamente por el `onClick` de un CTA.

### 3. Evento `Schedule` (crítico)

`Schedule` está definido en `lib/facebook-pixel.ts:34-53` como evento personalizado de navegador. Esta es la función completa:

```ts
34:53:lib/facebook-pixel.ts
export function trackSchedule(params: {
  email: string
  fullName: string
  eventID: string
}) {
  if (!params.eventID || !initAdvancedMatching(params.email, params.fullName) || !window.fbq) return

  window.fbq(
    "trackCustom",
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

No se dispara al cargar la página ni al seleccionar día/hora. Se ejecuta solo después de una respuesta `2xx` de `/api/booking` que devuelva `marketingEventId`:

```ts
701:754:components/landing/booking-widget.tsx
  const handleFormSubmit = useCallback(async () => {
    if (!selectedDay || !selectedSlotStart) return

    setStep("submitting")
    setErrorMessage(null)

    try {
      await flush()
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          leadToken
            ? {
                date: toBookingDate(viewYear, viewMonth, selectedDay),
                slotStart: selectedSlotStart,
                visitorTimezone: timeZone,
                leadToken,
                bookingFlow: "EBOOK_PDF",
                attribution: collectAttribution(),
              }
            : {
                date: toBookingDate(viewYear, viewMonth, selectedDay),
                slotStart: selectedSlotStart,
                visitorTimezone: timeZone,
                ...formData,
                bookingFlow: "DIRECT_BOOKING",
                leadToken: getToken() || undefined,
                attribution: collectAttribution(),
              }
        ),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error ?? "No se pudo confirmar la reunión")
      }

      const result = (await response.json()) as { meetLink?: string; marketingEventId?: string | null }
      setMeetLink(result.meetLink ?? null)
      if (result.marketingEventId) {
        trackSchedule({
          email: leadEmail || formData.email,
          fullName: leadName || formData.fullName,
          eventID: result.marketingEventId,
        })
      }
      clear()
      setStep("submitted")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo confirmar la reunión")
      setStep("form")
    }
  }, [clear, flush, formData, getToken, leadEmail, leadName, leadToken, selectedDay, selectedSlotStart, timeZone, viewMonth, viewYear])
```

La ruta intenta crear la reunión antes de crear la etapa de marketing:

```ts
198:206:app/api/booking/route.ts
    if (!isValidBookingDate(payload.date)) {
      return NextResponse.json({ error: "Fecha fuera del calendario disponible" }, { status: 400 })
    }

    if (!isValidSlot(payload.date, payload.slotStart)) {
      return NextResponse.json({ error: "Horario no disponible" }, { status: 400 })
    }

    const result = await createBooking(payload)
```

Por tanto, en la vía configurada de Google Calendar el disparo sigue la confirmación de `createBooking`. Sin embargo, sí hay una forma estática de emitirlo sin reunión real: el fallback `source: "mock"` documentado en C-1. También se crea la etapa aunque el proveedor responda sin `eventId` (`lib/booking/composio-calendar.ts:285-297`); el código no valida esa ausencia antes de emitir el evento.

Como matiz de atribución CAPI, la ruta asigna siempre `/agendar` como `event_source_url`, incluso cuando el widget está en Direct Booking `/` o en `/diagnosis`:

```ts
290:298:app/api/booking/route.ts
    const marketing = savedSubmissionId
      ? await recordMarketingStage({
          submissionId: savedSubmissionId,
          to: "SCHEDULED",
          triggeredBy: MARKETING_TRIGGERED_BY.system,
          eventSourceUrl: `${getAppUrl()}/agendar`,
          attribution,
          client,
        })
      : null
```

### 4. Calendario embebido

El proveedor es **un widget propio que usa Google Calendar mediante Composio**, no Cal.com, Calendly, TidyCal ni HubSpot. La UI se renderiza como componente React (`BookingWidget` / `BookingWidgetLight`); no hay iframe ni redirección hacia un proveedor de reservas externo.

```tsx
4:12:components/landing/booking-section.tsx
export function BookingSection() {
  return (
    <section id="booking">
      <DashedGrid maxWidth="6xl" padding="px-4 py-6 md:px-6 md:py-14">
        <BookingWidget />
      </DashedGrid>
    </section>
  )
}
```

La confirmación se detecta mediante la respuesta de la API propia, no mediante `postMessage` ni callback de SDK de calendario. **No existe listener `postMessage`, `addEventListener("message")` ni callback de SDK de un proveedor externo para reserva.** No es necesario para este patrón porque el backend hace la creación de Calendar y devuelve la respuesta.

```ts
249:297:lib/booking/composio-calendar.ts
export async function createMeetingEvent(input: {
  summary: string
  description?: string
  start: Date
  durationMinutes?: number
  attendeeEmail?: string | null
}): Promise<BookingCreateResponse> {
  if (!isComposioConfigured()) {
    return { success: true, source: "mock" }
  }

  const { date, time } = getBookingDateTimeParts(input.start)
  const slotStart = `${date}T${time}`
  const durationMinutes = input.durationMinutes ?? bookingConfig.slotMinutes
  const attendees = input.attendeeEmail
    ? [{ email: input.attendeeEmail, optional: false }]
    : undefined

  const result = await executeCalendarTool("GOOGLECALENDAR_CREATE_EVENT", {
    calendar_id: bookingConfig.calendarId,
    summary: input.summary,
    description: input.description || undefined,
    start_datetime: slotStart,
    end_datetime: buildEventEndDatetime(slotStart, durationMinutes),
    timezone: bookingConfig.timezone,
    attendees,
    exclude_organizer: true,
    create_meeting_room: true,
    send_updates: "all",
  })

  const record = pickCalendarEventRecord(result)
  const eventId = typeof record.id === "string" ? record.id : undefined
  const htmlLink = typeof record.htmlLink === "string" ? record.htmlLink : undefined
  const meetLink = extractMeetLink(record)

  if (!eventId) {
    console.warn("[calendar] CREATE_EVENT sin event id", {
      keys: Object.keys(asRecord(result) ?? {}),
    })
  }

  return {
    success: true,
    source: "composio",
    eventId,
    htmlLink,
    meetLink,
  }
}
```

Hay páginas posteriores internas: `/diagnostico` para SQL y `/gracias` para el flujo de guía. La reserva directa muestra el estado `submitted` en el mismo widget; no redirige a una página específica de confirmación de reserva. Todas las rutas son relativas, así que viven en el mismo dominio/origen de despliegue; el dominio de producción no puede determinarse del código.

### 5. Evento `Lead` (landing Lead Magnet)

`Lead` no se dispara al pulsar el botón de apertura del modal (`components/ebook-landing/download-cta.tsx:17-20`) ni al pulsar “Enviar y descargar” por sí solo. Se dispara después de que el backend responde exitosamente y devuelve un `eventId`.

```ts
337:400:components/ebook-landing/lead-modal.tsx
  const handleSubmit = useCallback(async () => {
    if (!canSubmitQuestions || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await flush()
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          leadToken: getToken() || undefined,
          attribution: collectAttribution(),
          visitorId: getVisitorId() || undefined,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error ?? "No se pudo enviar el formulario")
      }

      const payload = (await response.json()) as {
        token?: string
        qualification?: string
        redirectTo?: string
        eventId?: string | null
      }
      if (payload.eventId) {
        trackEbookLead({
          email: form.email,
          fullName: form.fullName,
          eventID: payload.eventId,
        })
      }
      clear()
      if (payload.token) {
        const downloadUrl = `/api/ebook/download?lead=${encodeURIComponent(payload.token)}`
        try {
          const fileResponse = await fetch(downloadUrl)
          if (fileResponse.ok) {
            const blob = await fileResponse.blob()
            const objectUrl = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = objectUrl
            link.download = "guia-agent-pilot.pdf"
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500)
          }
        } catch {
          window.open(downloadUrl, "_blank", "noopener,noreferrer")
        }
      }
      window.location.assign(payload.redirectTo || "/gracias")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo enviar el formulario")
    } finally {
      setIsSubmitting(false)
    }
  }, [canSubmitQuestions, clear, flush, form, getToken, isSubmitting])
```

No debe dispararse por validación incompleta ni por un envío fallido: el cliente exige todos los campos requeridos antes de enviar (`components/ebook-landing/lead-modal.tsx:317-335`) y el servidor vuelve a validar el payload antes de persistir:

```ts
49:80:app/api/submit-form/route.ts
function isValidPayload(body: unknown): body is LeadFormPayload {
  if (!body || typeof body !== "object") return false

  const record = body as Record<string, unknown>
  return (
    typeof record.fullName === "string" &&
    typeof record.email === "string" &&
    typeof record.companyName === "string" &&
    typeof record.phoneCountryCode === "string" &&
    typeof record.phoneNumber === "string" &&
    typeof record.websiteUrl === "string" &&
    typeof record.instagramUrl === "string" &&
    typeof record.usesPms === "string" &&
    typeof record.propertyCount === "string" &&
    typeof record.revenueRange === "string" &&
    typeof record.isTodero === "string" &&
    typeof record.usesAi === "string" &&
    typeof record.wantsToScale === "string" &&
    typeof record.industryTime === "string" &&
    record.fullName.trim().length > 0 &&
    isValidEmail(record.email.trim()) &&
    record.companyName.trim().length > 0 &&
    record.phoneCountryCode.trim().length > 0 &&
    isValidPhoneNumber(record.phoneNumber) &&
    isOptionValue(PMS_OPTIONS, record.usesPms) &&
    isOptionValue(PROPERTY_OPTIONS, record.propertyCount) &&
    isOptionValue(REVENUE_OPTIONS, record.revenueRange) &&
    isOptionValue(YES_NO_OPTIONS, record.isTodero) &&
    isOptionValue(YES_NO_OPTIONS, record.usesAi) &&
    isOptionValue(YES_NO_OPTIONS, record.wantsToScale) &&
    isOptionValue(INDUSTRY_TIME_OPTIONS, record.industryTime)
  )
}
```

Campos recogidos: nombre completo, email profesional, empresa, código de país, teléfono, número de propiedades, facturación mensual, uso de PMS, años en la industria, uso de IA, si es “todero/coordinador”, intención de escalar, Instagram opcional y sitio web opcional (`components/ebook-landing/lead-modal.tsx:486-624`; tipos en `lib/booking/types.ts:8-32`).

No se envían parámetros de cualificación al píxel. El navegador manda los campos fijos de `trackEbookLead`; CAPI solo manda `value` y `currency` como `custom_data`:

```ts
118:131:lib/marketing/capi.ts
  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: META_EVENT_NAME[event.eventName],
        event_time: Math.floor(event.eventTime.getTime() / 1000),
        event_id: event.id,
        action_source: actionSource,
        ...(event.eventSourceUrl ? { event_source_url: event.eventSourceUrl } : {}),
        user_data: userData,
        custom_data: {
          value: Number(event.value),
          currency: event.currency,
        },
      },
    ],
  }
```

### 6. Conversions API (CAPI)

Sí existe CAPI. La emisión final está en `lib/marketing/capi.ts:55-167` y hace un `POST` a Graph API. Se invoca desde `lib/marketing/enqueue.ts:10-36`: inline en desarrollo/sin QStash y mediante la ruta autenticada `/api/marketing/capi/send` en producción con QStash (`app/api/marketing/capi/send/route.ts:8-40`).

Los nombres que CAPI puede enviar son `ViewContent`, `Lead`, `Schedule`, `ShowUp` y `Purchase`:

```ts
28:49:lib/marketing/types.ts
export const META_EVENT_NAME: Record<MarketingEventName, string> = {
  VIEW_CONTENT: "ViewContent",
  LEAD: "Lead",
  SCHEDULE: "Schedule",
  SHOW_UP: "ShowUp",
  PURCHASE: "Purchase",
}

export const STAGE_EVENT: Partial<Record<MarketingFunnelStage, MarketingEventName>> = {
  LEAD_MAGNET_SENT: "LEAD",
  VIDEO_SENT: "VIEW_CONTENT",
  SCHEDULED: "SCHEDULE",
  SHOWED_UP: "SHOW_UP",
  PURCHASED: "PURCHASE",
}
```

- `Lead`: tras almacenar el formulario en `/api/submit-form` (`app/api/submit-form/route.ts:190-197`).
- `Schedule`: tras la reserva pública, y desde ciertas operaciones administrativas de reprogramación (`app/api/booking/route.ts:290-299`, `app/api/admin/pipeline/reschedule/route.ts:79-83`).
- `Schedule`, `ShowUp` y `Purchase` también pueden crearse para leads Airbnb desde acciones administrativas (`lib/admin/airbnb-commercial.ts:75-79` y `lib/marketing/events.ts:140-177`).
- `ViewContent`: al solicitar el endpoint de video legado (C-2).
- `ShowUp`: acción administrativa de marcar asistencia (`app/api/admin/pipeline/attend/route.ts:47-51`).
- `Purchase`: acción administrativa `CLOSED_WON` (`app/api/submissions/[id]/route.ts:54-61`).

**Deduplicación.** Para `Lead` y `Schedule` públicos sí se genera un ID determinista y se propaga al navegador: `{submissionId}-{nombre-evento-Meta}`. El backend lo guarda como ID de `LeadEvent`, lo manda como `event_id` a CAPI y lo devuelve como `eventId`/`marketingEventId`; el cliente lo pasa como `{ eventID }` a `fbq`.

```ts
68:70:lib/marketing/types.ts
export function eventIdFor(submissionId: string, eventName: MarketingEventName) {
  return `${submissionId}-${META_EVENT_NAME[eventName]}`
}
```

```ts
82:102:lib/marketing/events.ts
  const value = eventName === "PURCHASE" ? purchaseValue! : EVENT_VALUE[eventName]
  const eventId = eventIdFor(submission.id, eventName)
  const eventSourceUrl =
    input.eventSourceUrl ||
    (updated.landingPath ? `${getAppUrl()}${updated.landingPath}` : getAppUrl())

  try {
    const event = await prisma.leadEvent.create({
      data: {
        id: eventId,
        submissionId: submission.id,
        eventName,
        eventSourceUrl,
        value,
        triggeredBy: input.triggeredBy,
        clientIp: input.client?.ip,
        clientUserAgent: input.client?.userAgent,
      },
    })
    await enqueueCapiSend(event.id)
    return { submission: updated, event, eventId }
```

```ts
121:145:lib/marketing/capi.ts
        event_name: META_EVENT_NAME[event.eventName],
        event_time: Math.floor(event.eventTime.getTime() / 1000),
        event_id: event.id,
        action_source: actionSource,
        ...(event.eventSourceUrl ? { event_source_url: event.eventSourceUrl } : {}),
        user_data: userData,
        custom_data: {
          value: Number(event.value),
          currency: event.currency,
        },
      },
    ],
  }

  const testCode = process.env.META_TEST_EVENT_CODE?.trim()
  if (testCode) payload.test_event_code = testCode

  const pixelId = getCapiPixelId()
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN!.trim()
  const response = await fetch(
    `https://graph.facebook.com/${getGraphVersion()}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  )
```

Para los eventos CAPI administrativos (`ShowUp`, `Purchase`) y el video legado no existe equivalente de navegador identificado; por ello no hay pareja que deduplicar.

Los datos de usuario se tratan así:

```ts
20:25:lib/marketing/capi.ts
function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

function hashNormalized(value: string) {
  return sha256(value.trim().toLowerCase())
}
```

```ts
92:110:lib/marketing/capi.ts
  const userData: CapiUserData = {
    external_id: [externalId],
  }

  const email = submission?.email ?? airbnbLead?.hostEmail
  if (email) userData.em = [hashNormalized(email)]
  if (first) userData.fn = [hashNormalized(first)]
  if (last) userData.ln = [hashNormalized(last)]
  if (submission?.fbp) userData.fbp = submission.fbp
  if (submission?.fbc) userData.fbc = submission.fbc
  if (event.clientIp) userData.client_ip_address = event.clientIp
  if (event.clientUserAgent) userData.client_user_agent = event.clientUserAgent

  if (submission?.phoneCountryCode && submission.phoneNumber) {
    try {
      userData.ph = [hashNormalized(toPhoneE164(submission.phoneCountryCode, submission.phoneNumber))]
    } catch {
      // Teléfono incompleto: se envía el resto de user_data.
    }
  }
```

`em`, `ph`, `fn` y `ln` usan SHA-256 de la versión recortada y en minúsculas; `external_id` **no se hashea**. `fbp`, `fbc`, IP y user agent se envían sin hash, como se ve arriba.

El access token vive en `.env:52` bajo `META_CAPI_ACCESS_TOKEN` y está ignorado por `.gitignore:18`. No se transcribe aquí. No tiene prefijo `NEXT_PUBLIC_` y solo se usa desde código server-side (`lib/marketing/capi.ts`), por lo que no se expone intencionalmente al bundle cliente. Atención: el código lo coloca como parámetro de consulta de la URL de Graph API (`lib/marketing/capi.ts:139-145`), por lo que podría aparecer en logs de salida, proxies o monitorización que registren URLs completas.

La variable `META_TEST_EVENT_CODE` está definida en el `.env` local y se incorpora a todos los payloads por el bloque de C-4; no está limitada al script de prueba `lib/marketing/capi-test.ts`.

### 7. Eventos intermedios del embudo

No existe evento de Meta que marque que el visitante **vio el calendario**. Las llamadas de disponibilidad de calendario (`/api/booking/month` y `/api/booking/availability`) no invocan Pixel/CAPI.

El único evento intermedio entre `PageView` y la conversión final encontrado es `ViewContent` de CAPI asociado al flujo de video legado, no a la apertura/renderizado del calendario. Además existe `LandingVisitTracker`, pero registra una visita en la base de datos propia, no envía un evento a Meta:

```tsx
8:25:components/analytics/landing-visit-tracker.tsx
export function LandingVisitTracker({ landingPath }: { landingPath: AdLandingPath }) {
  useEffect(() => {
    const visitorId = getVisitorId()
    if (!visitorId) return

    void fetch("/api/landing/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        landingPath,
        attribution: collectAttribution(),
      }),
      keepalive: true,
    }).catch(() => {
      // El dashboard tolera visitas perdidas; no interrumpir la landing.
    })
  }, [landingPath])
```

### 8. Restos del video eliminado

Sí hay restos de una implementación de video:

- Reproductor con timers, `unlocked` y heartbeat: `components/landing/landing-video-player.tsx:14-430`.
- Configuración de video con desbloqueo a los 77 segundos: `lib/landing-video.ts:1-15`.
- Endpoint de heartbeat: `app/api/video/heartbeat/route.ts:1-108`.
- Endpoint de video/pipeline que puede emitir `ViewContent`: `app/api/pipeline/video/route.ts:1-67`.
- Métricas/estado de `videoWatched` en pipeline: `lib/pipeline/engine.ts:496-517`.
- Scroll lock y CSS asociado: `components/landing/scroll-lock-provider.tsx:27-84`, `app/globals.css:139-145`.

El reproductor no tiene importadores en las páginas/componentes de producción encontrados, por lo que no hay evidencia de que se monte en la landing actual. Tampoco se encontró una condición en `BookingWidget` o `BookingWidgetLight` basada en `unlocked`, `canBook` o `videoWatched`.

La home sí sigue envuelta por `ScrollLockProvider`, y la flecha de la hero hace el desbloqueo al clic:

```tsx
5:13:components/landing/design-services-page.tsx
export function DesignServicesPage() {
  return (
    <ScrollLockProvider>
      <div className="min-h-svh overflow-x-hidden bg-black text-foreground">
        <HeroSection />
        <BookingSection />
      </div>
    </ScrollLockProvider>
  )
}
```

```tsx
11:24:components/landing/scroll-down-button.tsx
export function ScrollDownButton({ targetId }: ScrollDownButtonProps) {
  const { unlock } = useScrollLock()

  const handleClick = () => {
    unlock()
    requestAnimationFrame(() => scrollToSection(targetId))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Desplazarse hacia abajo"
```

No queda un bloqueo del calendario por tiempo ni por reproducción de video. Sí queda un bloqueo inicial de scroll hasta una acción de usuario; no impide que el calendario se renderice.

El tracking de video no está conectado al reproductor actual (no se encontró llamada del componente a `/api/pipeline/video`), pero el endpoint legado puede crear `ViewContent`; por ello no puede considerarse inofensivo.

### 9. Bloqueadores potenciales

No se encontró banner de cookies, CMP, OneTrust, Cookiebot ni lógica de consentimiento. El píxel se intenta cargar siempre que exista `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`:

```tsx
4:12:components/analytics/facebook-pixel.tsx
const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

export function FacebookPixel() {
  if (!isFacebookPixelEnabled() || !PIXEL_ID) return null

  return (
    <>
      <Script id="facebook-pixel" strategy="afterInteractive">
```

No se encontró CSP, `Content-Security-Policy`, `script-src`, `connect-src` ni `headers()` en `next.config.mjs`, `proxy.ts` o rutas de aplicación que pueda bloquear `connect.facebook.net`/`www.facebook.com`. El `next.config.mjs` revisado no define cabeceras.

Es una aplicación Next.js App Router. El `PageView` no se duplica explícitamente en cambios de ruta, pero tampoco se registra para esos cambios (C-3). El script base protege su propio bootstrap con `if(f.fbq)return`, y no hay un segundo componente `FacebookPixel` encontrado.

### 10. UTMs y atribución

Sí se leen `fbclid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y `utm_term` desde URL. Se persisten como cookies de primer toque por 90 días y se fusionan con `_fbp`/`_fbc`.

```ts
72:83:lib/marketing/cookies.ts
export function attributionFromSearchParams(params: URLSearchParams): AttributionPayload {
  const fbclid = trimToUndefined(params.get("fbclid"))
  const payload: AttributionPayload = {
    fbclid,
    utmSource: trimToUndefined(params.get("utm_source")),
    utmMedium: trimToUndefined(params.get("utm_medium")),
    utmCampaign: trimToUndefined(params.get("utm_campaign")),
    utmContent: trimToUndefined(params.get("utm_content")),
    utmTerm: trimToUndefined(params.get("utm_term")),
  }
  if (fbclid) payload.fbc = deriveFbc(fbclid)
  return compactAttribution(payload)
}
```

```ts
16:27:lib/marketing/cookies.ts
export const ATTRIBUTION_COOKIES = {
  fbclid: "ap_fbclid",
  fbp: "ap_fbp",
  fbc: "ap_fbc",
  utmSource: "ap_utm_source",
  utmMedium: "ap_utm_medium",
  utmCampaign: "ap_utm_campaign",
  utmContent: "ap_utm_content",
  utmTerm: "ap_utm_term",
  landingPath: "ap_landing",
  referrer: "ap_referrer",
} as const satisfies Record<keyof AttributionPayload, string>
```

El cliente envía la atribución con el formulario/reserva. El servidor la combina con las cookies y `recordMarketingStage()` la aplica a `FormSubmission` sin sobrescribir el primer toque:

```ts
29:35:lib/marketing/attribution.ts
export function attributionFromRequest(request: Request, body?: unknown): AttributionPayload {
  const bodyAttribution =
    body && typeof body === "object"
      ? parseAttributionInput((body as Record<string, unknown>).attribution)
      : {}
  const cookieAttribution = attributionFromCookies(request.headers.get("cookie"))
  return mergeAttribution(bodyAttribution, cookieAttribution)
}
```

```ts
71:97:lib/marketing/attribution.ts
export async function applyFirstTouchAttribution(
  submissionId: string,
  incoming: AttributionPayload,
) {
  const existing = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    select: {
      fbclid: true,
      fbp: true,
      fbc: true,
      utmSource: true,
      utmMedium: true,
      utmCampaign: true,
      utmContent: true,
      utmTerm: true,
      landingPath: true,
      referrer: true,
    },
  })
  if (!existing) return
  const patch = firstTouchAttributionData(existing, incoming)
  const data = toAttributionUpdate(patch)
  if (Object.keys(data).length === 0) return
  await prisma.formSubmission.update({
    where: { id: submissionId },
    data,
  })
}
```

Por tanto, `utm_content={{ad.id}}` llega como `utm_content`, se convierte en `utmContent`, viaja en el POST y se persiste en el registro `FormSubmission` del backend/CRM. No se adjunta a los parámetros del evento de Pixel ni a `custom_data` de CAPI. Tampoco se persiste en el modelo de visita agregada, como muestra la omisión de `utmContent` en `lib/ad-landing.ts:119-130`.

## 6. Lo que NO pude determinar

- No se ejecutaron reservas reales ni llamadas a Meta/Google Calendar: no puede confirmarse que las credenciales, permisos, respuesta de Composio y aceptación de eventos por Events Manager funcionen en el despliegue.
- La auditoría inspeccionó `.env` local, donde están configurados el ID esperado, Composio y CAPI; no puede afirmar que producción use exactamente esas variables o que no haya configuración externa en Vercel, CDN, proxy o gestor de etiquetas fuera del repositorio.
- No puede determinarse el dominio de producción: las redirecciones de agradecimiento son rutas relativas y `NEXT_PUBLIC_APP_URL` está vacío en `.env.example`.
- No puede determinarse si el enlace legado `/api/pipeline/video` sigue siendo enviado a contactos, solo que el endpoint, estado y emisión potencial de `ViewContent` siguen presentes.
- No puede determinarse desde código si Meta clasifica/acepta `Schedule` enviado con `trackCustom` como la conversión configurada en la cuenta publicitaria.
