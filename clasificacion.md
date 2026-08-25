# Lógica de Clasificación SQL / MQL — Agent Pilot S.A.S.

## Contexto

Este documento define las reglas de calificación automática de leads que llegan a través de los formularios de pre-calificación (Lead Magnet y Direct Booking), clasificándolos como **SQL**, **MQL** o **Descalificado**.

## Definiciones

- **SQL (Sales Qualified Lead):** el lead con el mayor nivel de calificación. Cumple con el ICP y muestra señales claras de intención. Va **directo a la página de agendamiento**, sin pasos intermedios.
- **MQL (Marketing Qualified Lead):** el lead cumple con el ICP mínimo, pero necesita un paso adicional de cualificación conversacional (agente de IA por WhatsApp) antes de pedirle 60 minutos de reunión.
- **Descalificado:** el lead no cumple el tamaño mínimo del ICP, o su score de intención es demasiado bajo. No entra a seguimiento comercial activo.

## ICP de referencia

Operadores medianos y grandes de propiedades vacacionales o de renta de corta estancia, corporativos o vacacionales.

---

## Paso 1 — Regla de veto (se evalúa primero)

Antes de calcular cualquier puntaje, se aplica un filtro de tamaño mínimo:

```
SI facturación < $10.000.000 COP:
    → DESCALIFICADO
    → No se calcula score. El proceso corta aquí.
    → No entra a nurture activo (va a base fría / no cualificado)
```

Este filtro va primero porque no tiene sentido evaluar el resto de variables si el lead no alcanza el umbral mínimo de facturación de tu ICP.

---

## Paso 2 — Score de calificación (si pasa el veto)

Las variables del formulario se dividen en dos tipos:

- **Filtros de tamaño/fit (ICP):** número de propiedades y facturación. Tienen el mayor peso porque determinan si el lead puede pagar el ticket mínimo ($2.000–5.000 USD).
- **Señales de intención/dolor:** todero del negocio, deseo de escalar, uso de IA. Matizan el score pero ninguna, por sí sola, puede tumbar la clasificación de un lead que ya cumple el ICP de tamaño.
- **Variables informativas (no puntúan):** PMS implementado y tiempo en la industria. Se usan como contexto para la llamada comercial, no para la clasificación.

### Tabla de pesos

| Variable | Rol | Peso máximo |
|---|---|---|
| Número de propiedades | Filtro de tamaño (ICP) | 35 pts |
| Rango de facturación | Filtro de tamaño (ICP) | 35 pts |
| Todero del negocio | Señal de dolor/urgencia | 15 pts |
| Deseo de escalar propiedades | Señal de intención futura | 10 pts |
| Usa ChatGPT / IA | Señal de madurez digital | 5 pts |
| Tiene PMS implementado | Informativo | 0 pts |
| Tiempo en la industria | Informativo | 0 pts |
| **Total posible** | | **100 pts** |

### Escalas de puntaje por variable

**Número de propiedades (35 pts)**

| Rango | Puntos |
|---|---|
| Entre 5 y 15 | 20 |
| Entre 16 y 25 | 30 |
| Más de 25 | 35 |

**Rango de facturación (35 pts)** — ya se asume ≥ $10.000.000 COP por el veto del Paso 1

| Rango | Puntos |
|---|---|
| Entre $10M y $20M | 20 |
| Entre $21M y $50M | 30 |
| Más de $50M | 35 |

**Todero del negocio (15 pts)**

| Respuesta | Puntos |
|---|---|
| Sí | 15 |
| No | 0 |

**Deseo de escalar propiedades (10 pts)**

| Respuesta | Puntos |
|---|---|
| Sí | 10 |
| No | 0 |

**Usa ChatGPT / IA (5 pts)**

| Respuesta | Puntos |
|---|---|
| Sí | 5 |
| No | 0 |

---

## Paso 3 — Umbrales de clasificación final

| Condición | Resultado | Ruta |
|---|---|---|
| Facturación < $10M | **Descalificado (veto)** | No entra a nurture activo |
| Score 70–100 pts | **SQL** | Directo a agendamiento |
| Score 40–69 pts | **MQL** | Agente conversacional por WhatsApp, luego embudo de video + agendamiento |
| Score < 40 pts (pero facturación ≥ $10M) | **Descalificado (score bajo)** | Nurture de largo plazo |

### Nota sobre las dos rutas de descalificación

Existen dos motivos de descalificación distintos y deberían tratarse diferente en el copy de salida:

- **Descalificado por facturación:** el lead está fuera del tamaño real del ICP. No vale la pena nutrir.
- **Descalificado por score bajo (facturación ≥ $10M):** el lead sí tiene el tamaño mínimo, solo le faltan señales de intención hoy. Entra a nurture de largo plazo en vez de descartarse por completo.

---

## Ejemplo de aplicación

**Datos del lead:**
- Propiedades: más de 25 → 35 pts
- Facturación: más de $50M → 35 pts
- Todero: Sí → 15 pts
- Quiere escalar: Sí → 10 pts
- Usa IA: **No** → 0 pts

**Score total: 95 pts → SQL**

La ausencia de la señal "usa IA" (peso de solo 5 pts) no cambia la clasificación, porque las dos variables de tamaño (propiedades y facturación) ya cubren el 70% del puntaje total y son las que realmente determinan si el lead es viable para el ticket mínimo.

---

## Resumen visual del flujo

```
Formulario de pre-calificación
        │
        ▼
¿Facturación < $10M?
        │
   Sí ──┴── No
   │         │
   ▼         ▼
DESCALIFICADO   Calcular score (0-100 pts)
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   Score ≥ 70      Score 40-69      Score < 40
        │               │               │
        ▼               ▼               ▼
      SQL             MQL         DESCALIFICADO
   (agendamiento   (agente IA      (nurture largo
      directo)      WhatsApp)         plazo)
```