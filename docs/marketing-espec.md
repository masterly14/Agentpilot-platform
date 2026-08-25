# Contextualización: Sistema de Tracking + Meta Conversions API

## Propósito de este documento

Este documento define, para implementación directa en Cursor, el sistema de tracking de Agent Pilot que conecta el funnel de adquisición (Meta Ads → Landing → WhatsApp → CRM) con Meta Conversions API (CAPI). El objetivo de negocio es uno solo: **que Meta reciba señal de calidad suficiente para aprender exactamente qué perfil de Property Manager convierte, y siga mostrando el anuncio a personas similares a ese perfil (lookalike real, no genérico)**.

Todo en este sistema existe para alimentar ese objetivo. Cada tabla, cada trigger, cada pantalla de UI descrita aquí tiene como fin último producir un evento de marketing preciso, correctamente atribuido, y con el peso (`value`) correcto hacia Meta.

Stack: **PostgreSQL** (vía Supabase), backend en Next.js Server Actions, WhatsApp Cloud API + Upstash QStash para nutrición, CRM propio (no herramienta externa).

---

## 1. Principio rector: la identidad del lead es la columna vertebral

Antes de cualquier lógica de eventos, el sistema depende de una sola garantía: **todo evento, sin importar en qué canal o cuántos días después ocurra, debe poder atarse al mismo `lead_id`**.

Esto es lo que permite que un clic en Meta Ads el día 1, seguido de una compra cerrada por Zoom el día 20, se reporte a Meta como una conversión atribuible a ese anuncio específico.

La cadena de identidad es:

```
Clic en anuncio (fbclid en la URL)
  → Landing captura fbclid, fbp (cookie), fbc (derivado), UTMs
  → Se crea un registro en `leads` con un lead_id (uuid) propio
  → Todo evento posterior (WhatsApp, video, CRM) referencia ese lead_id
  → Al mandar a Meta, se manda fbp/fbc/lead_id — no importa el canal actual
```

**Regla no negociable:** ningún evento se envía a Meta sin `lead_id`. Si un evento llega sin poder resolverse a un lead existente, se descarta y se loggea como error — nunca se envía como evento anónimo, porque un evento sin atribución correcta le enseña a Meta un patrón equivocado.

---

## 2. Esquema de base de datos (PostgreSQL)

### Tabla `leads`

Registro único por lead. Se crea en el primer contacto (landing) y se actualiza a lo largo de todo su ciclo de vida — nunca se duplica.

Campos de identidad de tracking:
- `lead_id` (uuid, PK)
- `fbclid` (text) — click id crudo de la URL del anuncio
- `fbp` (text) — cookie `_fbp` de Meta, capturada en el primer page load
- `fbc` (text) — cookie `_fbc`, derivada de fbclid, capturada igual en el primer page load
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` (text)

Campos de contacto (se hashean con SHA-256 solo al momento de enviar a Meta, nunca se guardan hasheados en la tabla):
- `phone`, `email`, `full_name`

Campos de cualificación (vienen del formulario de la landing, alimentan el modelo SQL/MQL):
- `num_properties`, `revenue_range`, `has_pms`, `is_sole_operator`, `uses_ai_tools`, `years_in_industry`, `main_income_source`
- `lead_score` (int, 0-100)
- `lead_type` (`SQL` | `MQL`)

Campo de estado — **esta columna es la que la UI del CRM va a mutar directamente**:
- `funnel_stage` (text, enum controlado — ver sección 4)

### Tabla `lead_events`

Log inmutable de cada evento de marketing generado. Es la fuente de verdad de qué se le mandó a Meta y cuándo. Nunca se edita un registro existente — cada evento nuevo es una fila nueva.

- `event_id` (uuid, PK)
- `lead_id` (uuid, FK a `leads`)
- `event_name` (text) — uno de: `ViewContent`, `Lead`, `Schedule`, `ShowUp`, `Purchase`
- `event_time` (timestamptz)
- `event_source_url` (text)
- `value` (numeric) — el peso asignado, ver tabla de la sección 3
- `currency` (text, default `USD`)
- `sent_to_meta` (boolean, default `false`)
- `meta_response` (jsonb) — respuesta cruda de la Graph API, para debug y auditoría
- `triggered_by` (text) — `system` (automático) o `user:<user_id>` (acción manual en CRM). Esta columna es clave para auditar qué eventos vinieron de un cambio de estado manual vs. un webhook automático.

---

## 3. Modelo de eventos de marketing: la relevancia que Meta debe aprender

Esta es la sección más importante del documento porque es la que determina si Meta optimiza bien o mal. Meta CAPI no pondera eventos por sí sola — la ponderación la defines tú a través de **qué nombre de evento usas y qué `value` le asignas**. Un `value` más alto y un evento más tarde en el funnel le dicen a Meta "este es el patrón de persona que quiero que encuentres más".

| Evento de negocio | `event_name` en Meta | `value` (USD) | Quién/qué lo dispara | Por qué este peso |
|---|---|---|---|---|
| Vio el video de nutrición | `ViewContent` | 1 | Sistema (webhook de video-view) | Señal de engagement, alto volumen, baja intención — sirve para tener volumen de datos pero no debe pesar en la optimización de compra |
| Descargó lead magnet | `Lead` | 0 | Sistema (submit del formulario) | Top of funnel. Útil para audiencias de retargeting, pero no para optimizar hacia compradores |
| Agendó reunión | `Schedule` (evento custom) | 25 | Sistema (webhook de Calendly/agendamiento) | Primera señal de intención real. Con tu ciclo de venta largo, este evento le da a Meta volumen suficiente para empezar a aprender mucho antes de que existan compras |
| Show-up a la reunión | `ShowUp` (evento custom) | 60 | **Manual — acción del usuario en el CRM** | Filtra el ruido de "agendé pero no tenía intención real". Mucho más predictivo de cierre que solo agendar |
| Compra / cierre de contrato | `Purchase` (evento estándar) | Valor real del contrato ($3,000 o $5,000) | **Manual — acción del usuario en el CRM** | Máxima señal. Esto es exactamente a quién Meta debe aprender a encontrar y parecerse |

**Regla de diseño:** con un ticket mínimo de $2,000 USD y ciclo de venta de semanas, el volumen puro de `Purchase` será insuficiente para que el algoritmo de Meta optimice bien (necesita volumen recurrente de señal). Por eso `Schedule` y `ShowUp` cargan `value` intermedio — existen para darle a Meta señal abundante y temprana, no solo para medición interna.

---

## 4. Los dos disparadores de eventos: automático vs. manual

Este es el punto que se aclaró explícitamente con el usuario antes de este documento y debe quedar sin ambigüedad para el agente de Cursor:

### 4.1 Eventos automáticos (sin intervención humana)

Estos se disparan por un webhook o sistema, sin que Santiago tenga que hacer nada:

- `ViewContent` → disparado por el script de tracking embebido en la página del video, cuando se detecta >50% de reproducción.
- `Lead` → disparado en el momento del submit del formulario de la landing.
- `Schedule` → disparado por el webhook del sistema de agendamiento (Calendly u otro), en el evento de "booking confirmado".

Estos tres actualizan `leads.funnel_stage` automáticamente y crean su fila correspondiente en `lead_events` con `triggered_by = 'system'`.

### 4.2 Eventos manuales (requieren acción humana en el CRM)

**Estos son los que tienen más peso real para Meta, y dependen 100% de que Santiago mueva el estado del lead en la UI del CRM.** No existe ningún sistema automático que sepa si alguien realmente entró a la llamada de Zoom o si el contrato se cerró — solo Santiago lo sabe, y su acción de mover el estado *es* el evento.

- `ShowUp` → se dispara cuando Santiago cambia `funnel_stage` de `scheduled` a `showed_up` (o a `no_show`, que **no** genera evento hacia Meta — un no-show no es señal positiva de nada).
- `Purchase` → se dispara cuando Santiago cambia `funnel_stage` a `purchased`, y en ese mismo momento debe ingresar el monto real del contrato (3000 o 5000 USD, más adicionales si aplica), que se usa como `value` exacto del evento — nunca un valor genérico.

**Esto no es una limitación del sistema, es una ventaja deliberada:** un evento confirmado por criterio humano de negocio es una señal mucho más limpia para Meta que cualquier detección automática, porque no tiene el ruido de bots, clics accidentales, o interacciones vacías.

---

## 5. Especificación de UI del CRM

El agente debe construir un pipeline visual tipo kanban (columnas = `funnel_stage`) donde cada lead es una tarjeta. Los estados, en orden, son:

```
lead_magnet_sent → video_sent → scheduled → showed_up / no_show → purchased
```

### Comportamiento requerido por estado

- **Todas las columnas hasta `scheduled` inclusive** se mueven solas vía los webhooks automáticos de la sección 4.1. La tarjeta se mueve sin que Santiago haga clic.
- **La transición de `scheduled` a `showed_up` o `no_show` es manual.** El día de la reunión (o el día siguiente), Santiago debe poder mover la tarjeta arrastrándola o con un botón de acción rápida directamente en la tarjeta ("Marcar show-up" / "Marcar no-show").
  - Al marcar `showed_up`: dispara el evento `ShowUp` hacia Meta inmediatamente. Sin campos adicionales requeridos.
  - Al marcar `no_show`: **no** dispara ningún evento hacia Meta. Solo actualiza `funnel_stage` para fines de pipeline interno.
- **La transición a `purchased` es manual y requiere un campo obligatorio.** Al mover la tarjeta a esta columna, la UI debe abrir un modal simple que pida:
  - Monto del contrato en USD (número, requerido — sin este campo no se puede confirmar la transición)
  - Tipo de plan ($3,000/3 meses o $5,000/5 meses, u "otro" con campo libre)
  - Este monto es exactamente el `value` que se envía en el evento `Purchase`. No hay default ni valor asumido.

**Principio de diseño de UI:** ninguna transición manual debe sentirse como "llenar un formulario de tracking". Desde la perspectiva de Santiago, está simplemente actualizando su pipeline de ventas como lo haría en cualquier CRM — el evento hacia Meta es un efecto secundario invisible de esa actualización, no un paso adicional que él ejecuta a propósito.

---

## 6. Lógica de backend

### 6.1 Trigger de base de datos (recomendado sobre lógica en el frontend)

La función que envía a Meta CAPI debe dispararse desde un trigger de PostgreSQL sobre `UPDATE` en `leads.funnel_stage`, no desde el código del frontend. Esto garantiza que el evento se dispare sin importar desde dónde se actualice el estado (UI web, un script de backfill, un futuro cliente móvil), y evita duplicar la lógica de envío en múltiples puntos de la aplicación.

Lógica del trigger, en pseudocódigo de flujo (sin código real):

1. Detectar si `funnel_stage` cambió y a qué valor nuevo.
2. Resolver el nuevo valor contra el mapeo de la sección 3 (`scheduled` → nada, `showed_up` → evento `ShowUp`, `purchased` → evento `Purchase`).
3. Si el nuevo estado no tiene evento asociado (como `no_show`), no hacer nada.
4. Insertar la fila correspondiente en `lead_events` con `triggered_by = 'user:<id>'`.
5. Encolar el envío real a Meta (idealmente vía QStash, no de forma síncrona dentro del trigger, para no bloquear la transacción de UI si Meta responde lento).
6. Al confirmar el envío, actualizar `lead_events.sent_to_meta = true` y guardar `meta_response`.

### 6.2 Deduplicación de eventos

Cada evento manda un `event_id` determinístico (`{lead_id}-{event_name}`) a Meta. Esto es crítico si en el futuro también se agrega el Pixel de navegador en la landing — sin este `event_id` compartido, Meta contaría el mismo evento dos veces (una vía Pixel, otra vía CAPI) e infla artificialmente las métricas de conversión, lo cual degrada — no mejora — la calidad de la señal de optimización.

### 6.3 Reintentos y consistencia

Los eventos que fallan al enviarse (timeout de Meta, error de red) deben quedar con `sent_to_meta = false` y reintentarse — nunca se descartan silenciosamente. Un evento de `Purchase` perdido es directamente dinero de señal de optimización que Meta nunca recibe.

---

## 7. Resumen del objetivo de negocio (para que el agente no pierda el foco)

Cada decisión técnica de este documento existe para un solo fin: **maximizar la calidad y precisión de la señal que Meta recibe, para que el algoritmo de targeting encuentre y muestre el anuncio a personas con el mismo perfil que los leads que realmente agendaron, asistieron y compraron** — no a cualquiera que descargue un lead magnet.

Esto implica dos disciplinas que el agente debe respetar en toda la implementación:

1. **Nunca inflar ni inventar valor.** Si no hay monto real de contrato, no se manda `Purchase`. Si un lead no se presentó, no se manda `ShowUp`. Un evento falso o inflado no ayuda a Meta — lo confunde, porque le enseña un patrón que no corresponde a un comprador real.
2. **Priorizar la señal manual sobre la automática cuando ambas existen.** El estado que Santiago confirma con su propio criterio de negocio (show-up, compra) siempre es la fuente de verdad — nunca se debe inferir automáticamente un `ShowUp` o `Purchase` a partir de señales indirectas (ej. "el lead abrió el link de Zoom" no es lo mismo que "Santiago confirmó que estuvo en la llamada").