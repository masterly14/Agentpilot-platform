/**
 * Simula la nutrición MQL contra un número real, sin esperar delays de QStash.
 * Combina pasos por tiempo (POST /api/pipeline/execute) con inbound firmado
 * (POST /api/whatsapp/webhook) para las preguntas de cualificación.
 * Envía de verdad por WhatsApp y aborta si un mensaje queda FAILED (131049).
 *
 * Requiere: `pnpm dev`, WhatsApp Cloud API, QSTASH_SKIP_VERIFY=true en el server,
 * WHATSAPP_APP_SECRET (para firmar el inbound), y ngrok con el webhook de Meta
 * apuntando a /api/whatsapp/webhook.
 *
 *   pnpm pipeline:sim-mql                       (fit → video → CTA → last → cold)
 *   pnpm pipeline:sim-mql --unwatched           (rama sin ver video)
 *   pnpm pipeline:sim-mql --book-direct         (salta preguntas → FIT_CONFIRMED)
 *   pnpm pipeline:sim-mql --disqualified        (Q1 bajo → DISQUALIFIED, stop)
 *   pnpm pipeline:sim-mql --missing             (confirmación: no me llegó)
 *   pnpm pipeline:sim-mql --questions           (confirmación: tengo dudas)
 *   pnpm pipeline:sim-mql --lost                (last nurture → LOST)
 *   pnpm pipeline:sim-mql --phone 573001112233
 */
import type { PipelineState } from "../prisma/generated/client/index.js"
import { PrismaClient } from "../prisma/generated/client/index.js"
import {
  abortIfProduction,
  assertServerUp,
  deleteQstashMessage,
  fireExpected,
  fireInbound,
  fireInboundOverlay,
  generatePdfToken,
  getBaseUrl,
  hasFlag,
  listRunOutbound,
  loadEnvFile,
  makeQstashClient,
  parsePhone,
  printOutbound,
  waitForDelivery,
} from "./sim-shared.ts"

const CONTACT_NAME = "MQL Nurture Test"
const STOP_STATE: PipelineState = "COLD_CALL_QUEUED"

// Respuestas que producen fit (>= 5 propiedades → hasLowPropertyFit=false).
const FIT_ANSWERS = {
  QUALIFYING_Q1: "12",
  QUALIFYING_Q2: "reportes y comunicación con huéspedes",
  QUALIFYING_Q3: "todo manual en Excel",
} as const

// Respuesta que descalifica (< 5 propiedades).
const DISQUALIFY_Q1 = "2"

// Pasos por tiempo (los inbound se manejan aparte).
const NEXT_TIMER_STATE: Partial<Record<PipelineState, PipelineState>> = {
  LEAD_MAGNET_DOWNLOADED: "AWAITING_CONFIRMATION",
  AWAITING_CONFIRMATION: "QUALIFICATION_OFFERED",
  FIT_CONFIRMED: "VIDEO_SENT",
  VIDEO_SENT: "CTA_SENT_SAW_VIDEO",
  CTA_SENT_SAW_VIDEO: "LAST_NURTURE_SENT",
  CTA_SENT_NO_VIDEO: "LAST_NURTURE_SENT",
  LAST_NURTURE_SENT: "COLD_CALL_QUEUED",
}

loadEnvFile()
abortIfProduction()

const argv = process.argv.slice(2)
const watched = !hasFlag(argv, "--unwatched")
const bookDirect = hasFlag(argv, "--book-direct")
const disqualify = hasFlag(argv, "--disqualified")
const missingGuide = hasFlag(argv, "--missing")
const questions = hasFlag(argv, "--questions")
const lost = hasFlag(argv, "--lost")
const phone = parsePhone(argv)
const baseUrl = getBaseUrl()
const prisma = new PrismaClient()
const qstash = makeQstashClient()

if (bookDirect && disqualify) {
  throw new Error("--book-direct y --disqualified son excluyentes")
}
if (missingGuide && questions) {
  throw new Error("--missing y --questions son excluyentes")
}

try {
  await assertServerUp(baseUrl)
  if (!process.env.WHATSAPP_APP_SECRET) {
    console.warn(
      "[sim-mql] WHATSAPP_APP_SECRET vacío: el inbound irá sin firma; el webhook lo rechazará si WHATSAPP_APP_SECRET está configurado en el server.",
    )
  }
  const branch = disqualify ? "disqualified" : bookDirect ? "book-direct" : "fit"
  const confirmBranch = missingGuide ? "missing" : questions ? "questions" : "received"
  console.log(
    `Simulación MQL → ${phone.e164} · rama ${branch}${watched ? " · watched" : " · unwatched"} · confirm=${confirmBranch}${lost ? " · last=lost" : ""}`,
  )
  console.log(`  server  ${baseUrl}`)
  console.log(`  qstash  ${qstash ? "token presente (se cancelan mensajes, no delays)" : "no configurado"}`)

  const contact = await prisma.contact.upsert({
    where: { phoneE164: phone.e164 },
    create: {
      fullName: CONTACT_NAME,
      email: "mql-nurture-sim@example.com",
      phoneE164: phone.e164,
      waId: phone.e164,
      phoneCountryCode: phone.countryCode,
      phoneNumber: phone.national,
      companyName: "MQL Nurture Sim",
    },
    update: {
      fullName: CONTACT_NAME,
      waId: phone.e164,
      phoneCountryCode: phone.countryCode,
      phoneNumber: phone.national,
    },
  })

  const existingSubmission = await prisma.formSubmission.findFirst({
    where: { contactId: contact.id },
    orderBy: { createdAt: "desc" },
  })
  const submission =
    existingSubmission ??
    (await prisma.formSubmission.create({
      data: {
        fullName: CONTACT_NAME,
        email: "mql-nurture-sim@example.com",
        phoneCountryCode: phone.countryCode,
        phoneNumber: phone.national,
        pdfToken: generatePdfToken(),
        qualification: "MQL",
        entrySource: "EBOOK",
        contactId: contact.id,
      },
    }))

  const existingPipeline = await prisma.leadPipeline.findUnique({
    where: { contactId: contact.id },
    include: { jobs: true },
  })
  if (existingPipeline) {
    await Promise.all(
      existingPipeline.jobs.map((job) => deleteQstashMessage(qstash, job.qstashMessageId)),
    )
    await deleteQstashMessage(qstash, existingPipeline.scheduledJobId)
    await prisma.leadPipeline.delete({ where: { id: existingPipeline.id } })
  }

  const pipeline = await prisma.leadPipeline.create({
    data: {
      contactId: contact.id,
      funnelOrigin: "MQL",
      currentStage: "NURTURING",
      currentState: "LEAD_MAGNET_DOWNLOADED",
      videoWatched: false,
      pixelFiredAt: null,
    },
  })

  console.log(`  contact ${contact.id}`)
  console.log(`  pipeline ${pipeline.id}`)
  console.log(`  pdfToken ${submission.pdfToken}`)

  let stopEarly = false
  const reload = () => prisma.leadPipeline.findUniqueOrThrow({ where: { id: pipeline.id } })

  async function timerStep(from: PipelineState) {
    const expected = NEXT_TIMER_STATE[from]
    if (!expected) throw new Error(`No hay siguiente estado por tiempo desde ${from}`)
    console.log(`\n  ${from} → ${expected} (timer)`)
    const result = await fireExpected({
      prisma,
      baseUrl,
      qstash,
      pipelineId: pipeline.id,
      contactId: contact.id,
      expectedState: expected,
    })
    const next = await reload()
    console.log(`    execute   ${result.status ?? "?"} · db=${next.currentState}`)
    await printOutbound(prisma, contact.id, next.currentState)
    if (next.currentState !== STOP_STATE) {
      const delivery = await waitForDelivery({ prisma, contactId: contact.id, state: next.currentState })
      console.log(`    entrega   ${delivery ?? "sin status del webhook (¿ngrok/suscripción?)"}`)
    }
    return next
  }

  async function inboundStep(label: string, opts: Parameters<typeof fireInbound>[0]) {
    console.log(`\n  inbound ${label}`)
    await fireInbound(opts)
    const next = await reload()
    console.log(`    estado    ${next.currentState}`)
    return next
  }

  // 1. Timers hasta QUALIFICATION_OFFERED
  let current = await reload()
  current = await timerStep(current.currentState) // → AWAITING_CONFIRMATION

  const inboundBase = {
    baseUrl,
    waId: phone.e164,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    profileName: CONTACT_NAME,
  }
  const overlayBase = {
    prisma,
    ...inboundBase,
    contactId: contact.id,
  }

  const confirmButton = missingGuide
    ? { buttonId: "guide_missing", buttonText: "No me llegó" }
    : questions
      ? { buttonId: "guide_questions", buttonText: "Tengo dudas" }
      : { buttonId: "guide_received", buttonText: "Sí, la recibí" }
  await fireInboundOverlay({
    ...overlayBase,
    state: "AWAITING_CONFIRMATION",
    label: confirmButton.buttonId,
    ...confirmButton,
  })
  current = await reload()

  current = await timerStep(current.currentState) // → QUALIFICATION_OFFERED

  if (bookDirect) {
    // 2b. Botón "Prefiero agendar directo" → FIT_CONFIRMED
    current = await inboundStep("book_direct", { ...inboundBase, buttonId: "book_direct", buttonText: "Prefiero agendar directo" })
    await printOutbound(prisma, contact.id, "FIT_CONFIRMED")
    await waitForDelivery({ prisma, contactId: contact.id, state: "FIT_CONFIRMED" })
  } else {
    // 2a. Botón "Dale, pregunta" → QUALIFYING_Q1 (envía la pregunta 1)
    current = await inboundStep("qualify_now", { ...inboundBase, buttonId: "qualify_now", buttonText: "Dale, pregunta" })
    await printOutbound(prisma, contact.id, "QUALIFYING_Q1")

    // 3. Responder Q1
    const q1 = disqualify ? DISQUALIFY_Q1 : FIT_ANSWERS.QUALIFYING_Q1
    current = await inboundStep(`Q1="${q1}"`, { ...inboundBase, text: q1 })

    if (disqualify) {
      // Q1 con < 5 propiedades NO descalifica aún: la lógica evalúa en Q3.
      // Seguimos respondiendo para llegar al DISQUALIFIED real.
      current = await inboundStep(`Q2="${FIT_ANSWERS.QUALIFYING_Q2}"`, { ...inboundBase, text: FIT_ANSWERS.QUALIFYING_Q2 })
      current = await inboundStep(`Q3="${FIT_ANSWERS.QUALIFYING_Q3}"`, { ...inboundBase, text: FIT_ANSWERS.QUALIFYING_Q3 })
      current = await reload()
      await printOutbound(prisma, contact.id, current.currentState)
      if (current.currentState !== "DISQUALIFIED") {
        throw new Error(`Se esperaba DISQUALIFIED, quedó en ${current.currentState}`)
      }
      await waitForDelivery({ prisma, contactId: contact.id, state: "DISQUALIFIED" })
      console.log("\n  rama disqualified: stop en DISQUALIFIED (terminal)")
      stopEarly = true
    } else {
      // 4. Q2 y Q3 (fit)
      current = await inboundStep(`Q2="${FIT_ANSWERS.QUALIFYING_Q2}"`, { ...inboundBase, text: FIT_ANSWERS.QUALIFYING_Q2 })
      current = await inboundStep(`Q3="${FIT_ANSWERS.QUALIFYING_Q3}"`, { ...inboundBase, text: FIT_ANSWERS.QUALIFYING_Q3 })
      current = await reload()
      if (current.currentState !== "FIT_CONFIRMED") {
        throw new Error(`Se esperaba FIT_CONFIRMED, quedó en ${current.currentState}`)
      }
      await printOutbound(prisma, contact.id, "FIT_CONFIRMED")
      await waitForDelivery({ prisma, contactId: contact.id, state: "FIT_CONFIRMED" })
    }
  }

  // 5. Timers: FIT_CONFIRMED → VIDEO_SENT → CTA → LAST_NURTURE_SENT → COLD_CALL_QUEUED
  if (!stopEarly) {
    current = await reload()
    let guard = 0
    while (current.currentState !== STOP_STATE && current.currentState !== "LOST") {
      guard += 1
      if (guard > 10) throw new Error("La simulación superó 10 pasos; abortando")

      if (current.currentState === "VIDEO_SENT" && watched && !current.videoWatched) {
        const video = await fetch(
          `${baseUrl}/api/pipeline/video?token=${encodeURIComponent(submission.pdfToken)}`,
          { redirect: "manual" },
        )
        await video.arrayBuffer()
        console.log(`  pixel    GET /api/pipeline/video → ${video.status}`)
        current = await reload()
      }

      current = await timerStep(current.currentState)

      if (
        current.currentState === "CTA_SENT_SAW_VIDEO" ||
        current.currentState === "CTA_SENT_NO_VIDEO"
      ) {
        await fireInboundOverlay({
          ...overlayBase,
          state: current.currentState,
          label: "cta_ok",
          text: "ok",
        })
        current = await reload()
      }

      if (current.currentState === "LAST_NURTURE_SENT") {
        const button = lost
          ? { buttonId: "not_now", buttonText: "No es el momento" }
          : { buttonId: "book_now", buttonText: "Sí, quiero agendar" }
        await fireInboundOverlay({
          ...overlayBase,
          state: "LAST_NURTURE_SENT",
          label: button.buttonId,
          ...button,
        })
        current = await reload()
      }
    }
  }

  const leftover = await prisma.pipelineJob.findFirst({
    where: { pipelineId: pipeline.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  })
  if (leftover) {
    await deleteQstashMessage(qstash, leftover.qstashMessageId)
    console.log(`\n  leftover QStash cancelado (${leftover.expectedState}) sin ejecutar`)
  }

  const finalPipeline = await reload()
  const outbound = await listRunOutbound(prisma, contact.id, pipeline.createdAt)

  console.log("\nListo")
  console.log(`  estado final  ${finalPipeline.currentState}`)
  console.log(`  videoWatched  ${finalPipeline.videoWatched}`)
  for (const row of outbound) {
    console.log(
      `  ${row.pipelineState ?? "—"}  ${row.templateName ?? "—"}  ${row.status}  ${row.waMessageId ?? "—"}`,
    )
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
