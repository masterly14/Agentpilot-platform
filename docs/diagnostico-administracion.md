# Diagnóstico de administración — Mapa de fugas

Documentación completa de la página interna `/admin/diagnostico`. Es la herramienta que el comercial usa **durante y después de la reunión de diagnóstico** con un lead: recorre la operación, marca fricciones y huecos, cuantifica fugas de tiempo y dinero, y genera un informe para el cliente.

No es la landing pública de agendamiento (`/diagnostico`). Esa página solo agenda. Esta construye el diagnóstico operativo.

---

## 1. Qué es y para qué sirve

El diagnóstico responde tres preguntas sobre la operación del lead:

1. **Dónde se traba el trabajo hoy** — recorrido de tres trazas (huésped, dinero, propiedad).
2. **Cuánto cuesta ese trabón** — horas del equipo × tarifa + costos indirectos, por área.
3. **Qué no pueden hacer aunque quieran** — requerimientos estructurales (capacidades que no existen).

El resultado son **tres cifras anuales, separadas a propósito**:

| Cifra | Qué mide | Certeza |
|---|---|---|
| **Costo medido** | Tiempo del equipo convertido a dinero (aritmética sobre lo que dijeron en la reunión) | Alta |
| **Costo estimado** | Costos indirectos (reviews perdidas, lencería, noches vacías, etc.) | Media — hay que confirmarlo |
| **Potencial no capturado** | Ingreso o crecimiento que la operación actual no puede capturar | No es un gasto: es dinero que no entra |

Esas tres cifras **no se suman en la UI como un único total de venta**. El código sí calcula un `mix` interno para una nota metodológica, pero el informe las muestra siempre por separado.

---

## 2. Cómo se llega y qué hay en pantalla

Ruta: `/admin/diagnostico`. Solo entra un admin autenticado; si no, redirige a `/admin/login`.

Al cargar, el servidor trae:

- Todos los diagnósticos guardados (`OperationalDiagnosis`), del más reciente al más viejo.
- Hasta 200 leads inbound y 200 leads Airbnb elegibles (ver §3).

La página tiene dos pestañas:

- **Consulta** — el formulario vivo de la reunión.
- **Informe** — el documento que se le muestra / imprime al cliente.

Cabecera fija (no se imprime):

- Título **Mapa de fugas**, nombre del cliente si ya hay snapshot.
- Fuente del lead ligado: `Airbnb` o `Inbound`, más fecha/hora de la reunión.
- Si no hay lead: *Sin lead ligado*.
- Acciones: **Elegir lead / Cambiar lead**, **Nuevo**, **PDF**, **Guardar**.
- En Consulta, un selector **Abrir un diagnóstico guardado** y tres contadores: áreas activas `/8`, pasos marcados, requerimientos. Cuando se revela el costo, aparece también **Costo medido** anual.

---

## 3. Cómo se liga el diagnóstico a un lead

Un diagnóstico **nuevo no se puede guardar sin un lead**. Un diagnóstico ya guardado sí puede cambiar de lead.

### 3.1 Orígenes de lead

Hay exactamente dos fuentes. Un diagnóstico se liga a **una sola**: o inbound o Airbnb, nunca las dos.

**Inbound** (`FormSubmission`):

- Entran submissions que tengan al menos nombre, empresa o correo.
- Nombre de cliente: `companyName` → `fullName` → `email` → `"Lead inbound"`.
- Fecha de reunión: `contact.pipeline.meetingTime` o, si no hay, `bookedAt`.
- Propiedades: el rango del formulario (`< 5`, `5–15`, `16–25`, `+25`).

**Airbnb** (`AirbnbLead`):

- Entran leads con ficha comercial (`commercial` no nulo) **o** status `HUMAN_TAKEOVER` / `REPLIED_IN_PROGRESS`.
- Nombre de cliente: `companyName` → `name`.
- Fecha de reunión: `commercial.meetingTime` o `calBookedAt`.
- Propiedades: `totalProperties` como número.
- Si se arranca un diagnóstico nuevo desde un lead Airbnb, el campo **Canales de venta** se prellena con `"Airbnb"`.

El picker ordena primero los que **tienen reunión** (la más reciente arriba) y después el resto, alfabéticamente.

### 3.2 Dos modos del picker

| Acción | Qué hace |
|---|---|
| **Nuevo** | Resetea el formulario. Prellena snapshot con cliente, fecha (Bogotá), propiedades y canal Airbnb si aplica. Quita el id guardado. Vuelve a Consulta con el costo oculto. |
| **Elegir / Cambiar lead** | No borra lo ya escrito. Solo rellena campos **vacíos** del snapshot: cliente, fecha, propiedades, canales (Airbnb). El resto se conserva. |

### 3.3 Qué se prellena desde el lead

Función `leakMapFromLead`:

| Campo del snapshot | Valor que toma del lead |
|---|---|
| Cliente | `clientName` |
| Fecha | Fecha de la reunión en zona `America/Bogota` (`YYYY-MM-DD`) |
| Propiedades | Rango inbound o número Airbnb |
| Canales | `"Airbnb"` solo si la fuente es Airbnb; si no, vacío |

El resto del formulario arranca vacío: áreas inactivas, trazas sin marcar, sin requerimientos. Tarifa por defecto: **25.000 COP/hora**. Moneda: **COP**.

### 3.4 Guardado

`POST /api/admin/diagnostico`.

Reglas:

1. El nombre del cliente no puede estar vacío.
2. Si es un diagnóstico **nuevo** (sin `id`), hay que mandar `submissionId` **o** `airbnbLeadId`.
3. No se pueden mandar los dos ids a la vez.
4. El lead tiene que existir.

Lo que se persiste en `OperationalDiagnosis`:

| Columna | Contenido |
|---|---|
| `slug` | Slug del cliente + timestamp (`nombre-cliente-lxyz`). Único. |
| `clientName` | Snapshot.cliente recortado |
| `payload` | JSON completo del estado (`LeakMapState`) |
| `submissionId` / `airbnbLeadId` | El lead ligado |
| `meetingTime` | Copia de la reunión del lead (o null) |

Cargar uno guardado: `GET /api/admin/diagnostico/:id` hidrata el JSON con `hydrateLeakMap` (rellena áreas/trazas nuevas si el catálogo creció, descarta ids desconocidos).

---

## 4. Flujo de la reunión (pestaña Consulta)

Seis bloques, en este orden. El comercial los recorre con el lead en la llamada.

```
00 Snapshot + parámetros de cálculo
01 Trazas operativas  →  marca fricción / hueco
02 Áreas operativas   →  cuantifica horas y costos (solo las que están en juego)
03 Requerimientos     →  capacidades que no existen
04 Costo de la operación  →  las tres cifras (ocultas hasta “Ver estimación”)
05 Priorización       →  cuadrante impacto × velocidad (solo si hay 2+ áreas activas con fuga)
```

Las trazas **alimentan** áreas y requerimientos: un clic en “Anotar en…” activa el área; un hueco puede crear el requerimiento. No es obligatorio pasar por las trazas: se puede activar un área o agregar un requerimiento a mano.

---

## 5. Campos del formulario — inventario completo

### 5.1 Snapshot de la operación (paso 00)

Datos de contexto. **No entran al cálculo de fugas.** Sí aparecen en el informe (ciudades, propiedades, canales).

| Campo | Tipo | Placeholder / nota | Clave interna |
|---|---|---|---|
| Cliente | texto | Nombre de la empresa | `snapshot.cliente` |
| Fecha | date | Hoy en Bogotá al crear vacío | `snapshot.fecha` |
| Propiedades | texto | `0` | `snapshot.propiedades` |
| Ciudades | texto | Bogotá, Medellín… | `snapshot.ciudades` |
| Canales de venta | texto | Airbnb, Booking, directo, corporativo… | `snapshot.canales` |
| Equipo y roles | texto | 2 admin, 4 camareras, 1 mantenimiento… | `snapshot.equipo` |
| Software actual | texto | Excel, WhatsApp, Guesty… | `snapshot.software` |
| Ocupación % | texto | `0` | `snapshot.ocupacion` |
| ADR promedio | texto | `0` | `snapshot.adr` |

### 5.2 Parámetros de cálculo (paso 00, recuadro)

Estos **sí** mueven las cifras.

| Campo | Tipo | Default | Clave interna |
|---|---|---|---|
| Moneda | select `COP` \| `USD` | COP | `config.moneda` |
| Costo por hora del equipo | número ≥ 0 | `25000` | `config.tarifa` |

Ayuda en pantalla: *Salario mensual cargado ÷ 192 horas.*

Esa tarifa es el precio de una hora de trabajo del equipo. Si el lead paga $4.800.000 al mes a alguien que trabaja 192 h, la tarifa es $25.000.

Formato de dinero:

- COP → `$1.234.567` (`es-CO`)
- USD → `US$1,234` (`en-US`)

En el informe, USD también se formatea con `es-CO` (`US$1.234`).

### 5.3 Trazas operativas (paso 01)

Tres recorridos fijos. Cada paso se cicla con clics:

`sin marcar` → `fricción` → `hueco` → `sin marcar`

- **Fricción** — lo hacen, mal. Acción sugerida: anotar el área operativa ligada.
- **Hueco** — no existe. Acción sugerida: crear requerimiento.

Leyenda: *Un clic marca fricción · Dos, hueco · Tres, limpia.*

Cada paso marcado abre un detalle con:

| Campo / control | Qué es |
|---|---|
| Nota | texto, placeholder *¿Qué pasa aquí?* → `paso.nota` |
| **Crear requerimiento** | Solo si el estado es **hueco** y aún no tiene `requerimientoId`. Crea el requerimiento con nombre = label del paso y `queNoPueden` = la nota. Liga el paso al requerimiento. |
| **Anotar en {área}** | Solo si el estado es **fricción** y el paso tiene `areaId`. Activa esa área en el paso 02. Si ya está activa, muestra *Ya está en {área}*. |

Al final de las tres trazas hay un cierre: *¿Hay algo más en la operación que no esté en esta lista?* → **Agregar a la lista** crea un requerimiento en blanco.

#### Traza del huésped

| # | Paso | `id` | Área ligada (si hay fricción) |
|---|---|---|---|
| 01 | Cómo te encuentra | `huesped:encuentra` | Datos y decisiones |
| 02 | Consulta | `huesped:consulta` | Comunicación con huéspedes |
| 03 | Cotización | `huesped:cotizacion` | Comunicación con huéspedes |
| 04 | Reserva | `huesped:reserva` | Gestión administrativa diaria |
| 05 | Pago | `huesped:pago` | Facturación, gastos y proveedores |
| 06 | Check-in | `huesped:checkin` | Documentación y cumplimiento |
| 07 | Estadía | `huesped:estadia` | Comunicación con huéspedes |
| 08 | Checkout | `huesped:checkout` | Housekeeping y mantenimiento |
| 09 | Reseña | `huesped:resena` | Comunicación con huéspedes |
| 10 | Recompra | `huesped:recompra` | Datos y decisiones |

#### Traza del dinero

| # | Paso | `id` | Área ligada |
|---|---|---|---|
| 01 | Entra la reserva | `dinero:entra-reserva` | Gestión administrativa diaria |
| 02 | Quién cobra | `dinero:quien-cobra` | Facturación, gastos y proveedores |
| 03 | Por dónde entra la plata | `dinero:entra-plata` | Facturación, gastos y proveedores |
| 04 | Comisiones | `dinero:comisiones` | Facturación, gastos y proveedores |
| 05 | Gastos | `dinero:gastos` | Facturación, gastos y proveedores |
| 06 | Liquidación al propietario | `dinero:liquidacion` | Reportes a propietarios |
| 07 | Impuestos | `dinero:impuestos` | Facturación, gastos y proveedores |
| 08 | Conciliación | `dinero:conciliacion` | Facturación, gastos y proveedores |

#### Traza de la propiedad

| # | Paso | `id` | Área ligada |
|---|---|---|---|
| 01 | Propietario firma | `propiedad:firma` | Documentación y cumplimiento |
| 02 | Onboarding | `propiedad:onboarding` | Gestión administrativa diaria |
| 03 | Publicación | `propiedad:publicacion` | Gestión administrativa diaria |
| 04 | Operación diaria | `propiedad:operacion` | Housekeeping y mantenimiento |
| 05 | Reporte mensual | `propiedad:reporte` | Reportes a propietarios |
| 06 | Renovación o salida | `propiedad:renovacion` | Reportes a propietarios |

Estado de cada paso (`TrazaPasoState`):

| Campo | Valores |
|---|---|
| `id` | id del paso |
| `estado` | `""` \| `"friccion"` \| `"hueco"` |
| `nota` | texto libre |
| `requerimientoId` | id del requerimiento creado desde este hueco, o `null` |

### 5.4 Áreas operativas (paso 02)

Ocho áreas fijas. Por defecto **inactivas**. Solo las activas entran al cálculo de fugas.

Clic en la fila → activa / desactiva. Al activar se despliega el formulario de esa área.

Cada área tiene un **módulo** (producto de Agent Pilot al que apunta) y una **pregunta guía** que el comercial lee en voz alta.

| Área | `id` | Módulo | Pregunta guía |
|---|---|---|---|
| Comunicación con huéspedes | `comunicacion` | Chatbot omnicanal | ¿Quién responde los mensajes? ¿A qué horas entran? ¿Qué pasa cuando nadie contesta en 20 minutos? |
| Housekeeping y mantenimiento | `housekeeping` | Sistema de housekeeping | ¿Cómo se asignan las limpiezas? ¿Cómo sabes que quedó lista? ¿Cuántas veces al mes se cruza un check-in con una limpieza sin terminar? |
| Inventario y lencería | `inventario` | Mini-ERP de bodega | ¿Sabes hoy cuántos juegos de sábanas tienes y dónde están? ¿Cuánto reponen al año por pérdida o descuadre? |
| Facturación, gastos y proveedores | `finanzas` | Finanzas automáticas | ¿Cómo se registra un gasto hoy? ¿Cuándo se enteran de que un gasto se salió de presupuesto: el mismo día o a fin de mes? |
| Gestión administrativa diaria | `admin` | Asistente administrativo | ¿Cuántas veces al día alguien tiene que abrir el computador para hacer algo que podría hacer desde el celular? |
| Datos y decisiones | `datos` | Business Intelligence | ¿Sabes cuál de tus propiedades es la más rentable? ¿Con qué dato tomaste tu última decisión de precio? |
| Documentación y cumplimiento | `documentacion` | App de huésped + regulatorio | ¿Cómo recogen los documentos del huésped? ¿Qué pasa si les cae una revisión y falta un registro? |
| Reportes a propietarios | `reportes` | Reportes automáticos | ¿Cuántos días del mes se van armando reportes? ¿Has perdido un propietario por falta de claridad? |

Campos **por cada área activa**:

Grupo **Cómo funciona hoy**

| Campo | Tipo | Placeholder | Clave |
|---|---|---|---|
| El proceso actual | textarea | Cómo lo resuelven hoy, paso a paso. | `hoy` |
| Quién lo hace | texto | Rol o persona | `quien` |
| Tiempo que consume — horas | número ≥ 0 | `0` | `horas` |
| Tiempo que consume — frecuencia | select | default `a la semana` | `frecuencia` |

Frecuencias:

| Valor | Label en UI | Multiplicador a mes |
|---|---|---|
| `dia` | al día | **30** |
| `semana` | a la semana | **4.33** |
| `mes` | al mes | **1** |

Grupo **Impacto y costo**

| Campo | Tipo | Placeholder / rango | Clave |
|---|---|---|---|
| Qué se rompe cuando falla | textarea | Review perdida, propietario molesto, reserva no capturada, multa… | `rompe` |
| Costo indirecto / mes | número ≥ 0 | `0` | `indirecto` |
| Severidad | escala 1–5 (parte en 0) | no entra al cálculo de dinero | `severidad` |
| Velocidad de implementación | escala 1–5 (parte en 3) | eje X del cuadrante | `velocidad` |

Barra visual (solo si hay directo o indirecto > 0): proporción Directo vs Indirecto del mes.

Badge en la fila activa: `{horasMes} h/mes · {fugaMes}/mes`.

Defaults de un área nueva:

```
activo: false
hoy, quien, horas, rompe, indirecto: ""
frecuencia: "semana"
severidad: 0
velocidad: 3
```

**Severidad no mueve ninguna cifra.** Es una nota cualitativa para el comercial. El cuadrante usa **fuga mensual** vs **velocidad**, no severidad.

### 5.5 Requerimientos estructurales (paso 03)

Capacidades que **hoy no existen** y que un ajuste de proceso no resuelve.

Se crean de tres formas:

1. Desde un **hueco** en las trazas (trae nombre del paso + nota, y deja rastro de origen).
2. Desde **Agregar a la lista** al final de las trazas.
3. Desde **Agregar requerimiento** en este bloque.

Si no hay ninguno, empty state: *Aún no hay requerimientos. Marca un hueco en las trazas para traerlo aquí, o agrega uno a mano.*

Campos **por cada requerimiento**:

| Campo | Tipo | Opciones / nota | Clave |
|---|---|---|---|
| Nombre | texto | placeholder *Nombre del requerimiento* | `nombre` |
| Qué no pueden hacer hoy | textarea | *La capacidad que no existe.* | `queNoPueden` |
| Impacto | chips (uno) | ver tabla abajo | `impacto` |
| Valor estimado / mes | número ≥ 0, opcional | solo cuenta si es > 0 | `valorMes` |
| Clasificación | chips (uno) | ver tabla abajo | `clasificacion` |
| Origen | solo lectura | `Traza · Paso` si nació de un hueco | `origenTrazaId`, `origenPasoId` |

Quitar un requerimiento también desliga el paso de traza (`requerimientoId` vuelve a `null`).

**Impacto**

| `id` | Label |
|---|---|
| `ingreso` | Ingreso no capturado |
| `crecimiento` | Bloquea crecimiento |
| `legal` | Riesgo legal o regulatorio |
| `propietarios` | Fricción con propietarios |

Solo `ingreso` y `crecimiento` con `valorMes > 0` alimentan la cifra **Potencial no capturado**. Legal y propietarios se listan en el informe pero no suman potencial.

**Clasificación**

| `id` | Label | Uso |
|---|---|---|
| `base` | Dentro del base | Si no hay áreas con fuga, las primeras 3 `base` se usan como “Por dónde empezar” |
| `adicional` | Desarrollo adicional | — |
| `fuera` | Fuera de alcance | — |

El badge del paso 03: `{n} · {suma valorMes}/mes` si hay al menos uno cuantificado; si no, `{n} sin cuantificar`.

---

## 6. Cómo se calculan las fugas

Toda la aritmética vive en `calculateLeakMap` (`lib/admin/leak-map.ts`). Solo mira **áreas activas**. Trazas y snapshot no suman dinero. Requerimientos no entran a `fugaMes`; entran a la cifra de potencial del informe.

### 6.1 Por área activa

```
horasMes     = (horas parseadas o 0) × multiplicador(frecuencia)
directo      = horasMes × tarifa          ← costo de tiempo del equipo
indirectoMes = (indirecto parseado o 0)   ← lo que el comercial escribió a mano
fugaMes      = directo + indirectoMes
```

Ejemplo: housekeeping consume **2 h al día**, tarifa **$25.000**, indirecto **$800.000/mes** (lencería que se pierde).

```
horasMes     = 2 × 30 = 60
directo      = 60 × 25.000 = 1.500.000
indirectoMes = 800.000
fugaMes      = 2.300.000
```

Strings vacíos o no numéricos cuentan como 0. Las filas se ordenan de **mayor a menor `fugaMes`**.

Totales del mapa:

```
horas     = Σ horasMes
directo   = Σ directo
indirecto = Σ indirectoMes
total     = Σ fugaMes          (= directo + indirecto)
```

`total` es el costo mensual combinado de las áreas. **No es** la cifra que se le muestra al cliente como “el número”. Al cliente se le muestran las tres cifras anuales del §6.2.

### 6.2 Las tres cifras del informe (anuales)

`buildDiagnosisInforme` parte el `fugaMes` en dos cubetas y añade una tercera desde requerimientos.

**1. Costo medido (año)**

Áreas activas con `directo > 0`.

```
medidoMes  = Σ directo
medidoAnio = medidoMes × 12
```

En la tabla: concepto = nombre del área; “cómo se calcula” = `{horas} h {frecuencia} × {tarifa} por hora` + quién lo hace + el proceso actual.

Esta es la única cifra que el header de Consulta muestra como **Costo medido** (`calc.directo × 12`), y solo **después** de pulsar “Ver estimación”.

**2. Costo estimado (año)**

Áreas activas con `indirectoMes > 0`.

```
estimadoAnio = Σ (indirectoMes × 12)
```

En la tabla se marca con `~` (aproximado). “Cómo se aproximó” = el texto de *Qué se rompe* o, si no hay, el proceso actual. Columna “Para confirmarlo”: siempre *Dato o gasto de los últimos meses*.

El comercial es quien escribe el número de `indirecto`. El sistema **no estima** reviews perdidas ni noches vacías solo: copia lo que se tecleó.

**3. Potencial no capturado (año)**

Requerimientos con `valorMes > 0` **y** impacto `ingreso` o `crecimiento`.

```
potencialAnio = Σ (valorMes × 12)   // solo esos
```

Legal / propietarios / sin impacto / sin valor → aparecen en “Lo que hoy no pueden hacer” pero **no suman** esta caja.

### 6.3 Qué no entra al cálculo

- Áreas inactivas (aunque tengan horas escritas).
- Severidad.
- Ocupación %, ADR, equipo, software, ciudades.
- Pasos de traza (solo disparan áreas / requerimientos).
- Requerimientos `legal` / `propietarios` / sin cuantificar, para la caja de potencial.
- Clasificación, salvo el fallback de prioridades.

### 6.4 Relación visual: fuga vs las tres cajas

```
                    ┌─────────────────────┐
  horas × tarifa ──►│ Costo medido (×12)  │  certeza alta
                    └─────────────────────┘
  costo indirecto ─►│ Costo estimado (×12)│  hay que confirmar
                    └─────────────────────┘
  req. ingreso/     │ Potencial (×12)     │  no es un gasto
  crecimiento ─────►└─────────────────────┘

  fugaMes (área) = directo + indirecto     ← barra y cuadrante
```

El cuadrante y el badge del área usan `fugaMes` (las dos cubetas juntas). El informe las vuelve a separar.

---

## 7. Revelar el costo y priorizar

### 7.1 Paso 04 — Costo de la operación

Las cifras empiezan **ocultas** (`revelado = false`). Hay un botón **Ver estimación** con máscara `▓▓▓ ▓▓▓ ▓▓▓`. Al pulsarlo se renderizan las tres cajas embebidas (mismo HTML que el informe).

Al cargar o crear un diagnóstico, `revelado` vuelve a `false`. No se persiste: es estado de sesión.

### 7.2 Paso 05 — Cuadrante de priorización

Solo aparece si hay **más de una** fila de fuga (`calc.filas.length > 1`).

Ejes:

- **X — velocidad de implementación** (1 = lento, 5 = rápido).
  Posición: `((velocidad − 1) / 4) × 82 + 9` % del ancho.
- **Y — mayor fuga** hacia arriba.
  Posición: `91 − (fugaMes / max(fugaMes)) × 82` % del alto.

Cuadrantes:

| | Lento (izq.) | Rápido (der.) |
|---|---|---|
| **Alta fuga** | Fase 2 | **Atacar primero** (resaltado) |
| **Baja fuga** | Descartar | Oportunista |

Cada punto es un área activa. Tooltip: `{nombre} · {fugaMes}/mes`.

### 7.3 “Por dónde empezar” en el informe

Las **3 primeras filas** de `calc.filas` (ya ordenadas por `fugaMes` descendente). Descripción: texto de *Qué se rompe*, o *Recuperar esta área libera N horas al mes y $X al año*.

Si no hay áreas con fuga, toma hasta 3 requerimientos con clasificación `base`.

Ese listado arma el texto de **Siguiente paso**: *En la próxima reunión mostramos {foco} funcionando con tus propiedades…*

---

## 8. Pestaña Informe y PDF

La pestaña Informe es el documento de cliente, generado en vivo desde el mismo estado. No hay un guardado aparte: lo que hay en Consulta **es** el informe.

Secciones, en orden, omitiendo las vacías:

1. Cabecera: *Diagnóstico operativo* + nombre del cliente.
2. Meta: ciudades, propiedades (si el texto no tiene letras, se le agrega la palabra “propiedades”), canales.
3. Intro fija (método conservador: si hubo rango, se tomó el extremo bajo — eso es copy; el código no recorta rangos solo).
4. Tres cajas anuales.
5. Tabla **Dónde está el costo medido**.
6. Tabla **Costo estimado — pendiente de confirmar**.
7. **Lo que hoy no pueden hacer** (requerimientos con nombre o descripción). Tag = `{impacto} · {traza de origen}`.
8. **Por dónde empezar**.
9. **Nota sobre el método** (textos que dependen de si hay medido / estimado / mix).
10. **Siguiente paso** + firma *Agent Pilot · Real Estate Pilot*.

**PDF**: el botón no genera un archivo PDF en servidor. Abre un iframe oculto, escribe el HTML del informe e invoca `window.print()`. Si el iframe falla, descarga un `.html` con slug del cliente.

---

## 9. Modelo de estado (`LeakMapState`)

```
snapshot     cliente, fecha, propiedades, ciudades, canales, equipo, software, ocupacion, adr
config       moneda, tarifa
areas[8]     activo + campos de §5.4 (catálogo fijo AREAS_BASE)
trazas[3]    pasos con estado / nota / requerimientoId
requerimientos[]  lista libre
```

Eso es exactamente lo que va en `OperationalDiagnosis.payload`. Hidratar un JSON viejo:

- Áreas: se fusionan por `id`; las 8 del catálogo actual siempre existen.
- Trazas: solo ids conocidos; pasos nuevos aparecen vacíos.
- Requerimientos: se descartan items sin `id`.
- Severidad se recorta a 0–5; velocidad a 1–5.

---

## 10. Archivos

| Pieza | Ruta |
|---|---|
| Página admin (auth + carga inicial) | `app/admin/(dashboard)/diagnostico/page.tsx` |
| Shell: pestañas, guardar, lead, PDF | `components/admin/mapa-de-fugas.tsx` |
| Formulario Consulta | `components/admin/mapa-de-fugas-consulta.tsx` |
| Trazas | `components/admin/mapa-de-fugas-trazas.tsx` |
| Requerimientos | `components/admin/mapa-de-fugas-requerimientos.tsx` |
| Informe en pantalla | `components/admin/mapa-de-fugas-informe.tsx` |
| Picker de lead | `components/admin/diagnostico-lead-picker.tsx` |
| Motor de fugas + catálogos | `lib/admin/leak-map.ts` |
| Modelo del informe + HTML/print | `lib/admin/diagnosis-informe.ts` |
| Prefill y listado de leads | `lib/admin/diagnosis-leads.ts` |
| API guardar / listar | `app/api/admin/diagnostico/route.ts` |
| API cargar uno | `app/api/admin/diagnostico/[id]/route.ts` |
| Tabla | `OperationalDiagnosis` en `prisma/schema.prisma` |

---

## 11. Receta de uso en la reunión

1. **Nuevo** → elegir el lead de esa reunión. Confirmar cliente, fecha, propiedades.
2. Ajustar **moneda** y **tarifa** (salario cargado ÷ 192).
3. Recorrer las **tres trazas**. Clic = fricción (lo hacen mal). Doble clic = hueco (no existe). Anotar qué pasa.
4. En cada fricción: **Anotar en {área}**. En cada hueco: **Crear requerimiento**.
5. Bajar a **áreas**: completar proceso, quién, horas y frecuencia. Si hay un costo que no es tiempo (lencería, noches, multas), ponerlo en **Costo indirecto / mes**. Marcar velocidad (qué tan rápido se implementa el módulo).
6. Completar **requerimientos**: impacto y, si se puede, valor/mes. Clasificar base / adicional / fuera.
7. **Ver estimación**. Revisar las tres cifras con el lead. No mezclarlas.
8. Si hay 2+ áreas, mirar el cuadrante: arriba a la derecha va primero.
9. **Guardar**. Pasar a **Informe** o **PDF** para enviárselo.
