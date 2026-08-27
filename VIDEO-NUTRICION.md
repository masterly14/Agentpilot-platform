# Página de video de nutrición — 26 de agosto de 2026

## Qué se construyó

- Ruta pública nueva: `/video`.
- Se reutilizó `LandingVideoPlayer`, retirando su dependencia de `ScrollLockProvider` y toda lógica de desbloqueo, pausa por scroll y restricción de avance.
- Se añadieron dos CTA de agendamiento: uno antes y otro después del video.
- El reproductor ahora envía el token opcional del lead con sus heartbeats para asociar la reproducción al pipeline.

## Flujo completo

1. La plantilla de WhatsApp para `VIDEO_SENT` obtiene el enlace `/api/pipeline/video?token=...` desde `getVideoTrackingUrl`.
2. El endpoint valida que el `pdfToken` identifica una submission y redirige a `/video?lead=...`. No registra ningún evento de marketing al abrirse.
3. La página muestra el CTA superior, el video y el CTA inferior. Con token válido, ambos CTA llevan a `/agendar?lead=...`; sin token, siguen disponibles y llevan a `/diagnosis`.
4. Durante reproducción, el reproductor manda un heartbeat cada cinco segundos y al salir de la página. El progreso enviado es tiempo realmente acumulado mientras se reproduce; buscar una posición posterior no suma progreso.
5. Al alcanzar el 50% de la duración, `/api/video/heartbeat` busca la submission por token y llama a `markVideoWatched(contactId)`.
6. `markVideoWatched` actualiza `LeadPipeline.videoWatched` y `pixelFiredAt` únicamente si el flag aún era `false`. No llama a `recordMarketingStage` ni produce `ViewContent`.
7. Cuando el job de nutrición ejecuta el siguiente paso desde `VIDEO_SENT`, `executeScheduledStep` lee ese mismo `pipeline.videoWatched` para elegir `CTA_SENT_SAW_VIDEO` o `CTA_SENT_NO_VIDEO`.

## Decisiones tomadas

- **CTA:** se usaron enlaces a `/agendar?lead=...`, en vez de montar un segundo widget de reservas. Es el flujo existente que ya resuelve la lead identificada y precarga sus datos; evita duplicar la lógica de booking.
- **Identidad:** se propagó el `pdfToken` validado como `lead` en el query string. El heartbeat vuelve a validarlo contra `FormSubmission` antes de actualizar el pipeline. Sin token, el video y los CTA se mantienen disponibles, pero no hay asociación de tracking.
- **Progreso real:** el reproductor acumula intervalos normales de reproducción y descarta saltos de más de un segundo, por lo que avanzar el cabezal no cumple por sí solo el umbral.
- **Idempotencia:** `markVideoWatched` usa `updateMany` con la condición `videoWatched: false`; sólo la primera solicitud concurrente puede escribir el estado y su timestamp.

## Verificación del CTA sin gate

Confirmado: el CTA superior se renderiza antes del reproductor como un enlace HTML a la ruta de agendamiento, sin estados, temporizadores, listeners ni condiciones del video. No hay `ScrollLockProvider`, `disabled` ni control de desplazamiento en `/video`. Por tanto, se puede agendar sin reproducir ni interactuar con el video, y el enlace sigue siendo alcanzable si JavaScript del reproductor no carga o está deshabilitado.

## Pendientes y riesgos

- `scripts/funnel-test/funnel.ts` todavía espera que abrir `/api/pipeline/video` cree `VIDEO_SENT` en el funnel de marketing y un evento CAPI `ViewContent`. Esa expectativa contradice la corrección de Pixel previa y fallará si se ejecuta; se deja intacta por estar fuera de alcance.
- `PIPELINE_VIDEO_URL` ya no se consulta. Si continúa configurada en algún entorno, quedó como variable huérfana y puede eliminarse en una tarea de configuración separada.
- El build terminó correctamente. Mantiene un warning de Turbopack sobre el trazado del cliente Prisma desde el route handler de heartbeat, sin errores de compilación ni TypeScript.
- `pnpm lint` no pudo ejecutarse porque el binario `eslint` no está instalado en las dependencias disponibles del workspace. El diagnóstico del editor no reporta errores en los archivos modificados.
- El árbol de trabajo ya contenía cambios rastreados fuera de esta tarea —incluyendo archivos de booking, diagnóstico y Pixel—, así que el `git diff` completo no puede limitarse sólo a estos cambios. No se modificaron durante esta implementación.

## Archivos tocados

- `app/(public)/video/page.tsx`
- `app/api/pipeline/video/route.ts`
- `app/api/video/heartbeat/route.ts`
- `components/landing/landing-video-player.tsx`
- `lib/pipeline/engine.ts`
- `VIDEO-NUTRICION.md`
