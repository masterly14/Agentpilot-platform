/**
 * Simula la nutrición SQL contra un número real, sin esperar delays de QStash.
 * Envía de verdad por WhatsApp y espera el webhook de entrega; aborta en FAILED
 * (p. ej. 131049 tope de marketing).
 *
 * Requiere: `pnpm dev`, WhatsApp Cloud API, QSTASH_SKIP_VERIFY=true en el server,
 * y ngrok con el webhook de Meta apuntando a /api/whatsapp/webhook.
 *
 *   pnpm pipeline:sim-sql
 *   pnpm pipeline:sim-sql --unwatched
 *   pnpm pipeline:sim-sql --missing
 *   pnpm pipeline:sim-sql --questions
 *   pnpm pipeline:sim-sql --lost
 *   pnpm pipeline:sim-sql --phone 573001112233
 */
import type { PipelineState } from "../prisma/generated/client/index.js"
import { PrismaClient } from "../prisma/generated/client/index.js"
import {
  abortIfProduction,
  assertServerUp,
  deleteQstashMessage,
  fireExpected,
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

const CONTACT_NAME = "SQL Nurture Test"
const STOP_STATE: PipelineState = "COLD_CALL_QUEUED"

const NEXT_SQL_STATE: Partial<Record<PipelineState, PipelineState>> = {
  LEAD_MAGNET_DOWNLOADED: "AWAITING_CONFIRMATION",
  AWAITING_CONFIRMATION: "VIDEO_SENT",
  VIDEO_SENT: "CTA_SENT_SAW_VIDEO",
  CTA_SENT_SAW_VIDEO: "LAST_NURTURE_SENT",
  CTA_SENT_NO_VIDEO: "LAST_NURTURE_SENT",
  LAST_NURTURE_SENT: "COLD_CALL_QUEUED",
}

loadEnvFile()
abortIfProduction()

const argv = process.argv.slice(2)
const watched = !hasFlag(argv, "--unwatched")
const missingGuide = hasFlag(argv, "--missing")
const questions = hasFlag(argv, "--questions")
const lost = hasFlag(argv, "--lost")
const phone = parsePhone(argv)
const baseUrl = getBaseUrl()
const prisma = new PrismaClient()
const qstash = makeQstashClient()

if (missingGuide && questions) {
  throw new Error("--missing y --questions son excluyentes")
}

try {
  await assertServerUp(baseUrl)
  const confirmBranch = missingGuide ? "missing" : questions ? "questions" : "received"
  const lastBranch = lost ? "lost" : "book_now"
  console.log(
    `Simulación SQL → ${phone.e164} · ${watched ? "watched" : "unwatched"} · confirm=${confirmBranch} · last=${lastBranch}`,
  )
  console.log(`  server  ${baseUrl}`)
  console.log(`  qstash  ${qstash ? "token presente (se cancelan mensajes, no delays)" : "no configurado"}`)

  const contact = await prisma.contact.upsert({
    where: { phoneE164: phone.e164 },
    create: {
      fullName: CONTACT_NAME,
      email: "sql-nurture-sim@example.com",
      phoneE164: phone.e164,
      waId: phone.e164,
      phoneCountryCode: phone.countryCode,
      phoneNumber: phone.national,
      companyName: "SQL Nurture Sim",
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
        email: "sql-nurture-sim@example.com",
        phoneCountryCode: phone.countryCode,
        phoneNumber: phone.national,
        pdfToken: generatePdfToken(),
        qualification: "SQL",
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
      funnelOrigin: "SQL",
      currentStage: "NURTURING",
      currentState: "LEAD_MAGNET_DOWNLOADED",
      videoWatched: false,
      pixelFiredAt: null,
    },
  })

  console.log(`  contact ${contact.id}`)
  console.log(`  pipeline ${pipeline.id}`)
  console.log(`  pdfToken ${submission.pdfToken}`)

  const inboundBase = {
    prisma,
    baseUrl,
    waId: phone.e164,
    contactId: contact.id,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    profileName: CONTACT_NAME,
  }

  let current = await prisma.leadPipeline.findUniqueOrThrow({ where: { id: pipeline.id } })
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
      current = await prisma.leadPipeline.findUniqueOrThrow({ where: { id: pipeline.id } })
    }

    const expected = NEXT_SQL_STATE[current.currentState]
    if (!expected) {
      throw new Error(`No hay siguiente estado SQL desde ${current.currentState}`)
    }

    console.log(`\n  ${current.currentState} → ${expected}`)
    const result = await fireExpected({
      prisma,
      baseUrl,
      qstash,
      pipelineId: pipeline.id,
      contactId: contact.id,
      expectedState: expected,
    })
    current = await prisma.leadPipeline.findUniqueOrThrow({ where: { id: pipeline.id } })
    console.log(`    execute   ${result.status ?? "?"} · db=${current.currentState}`)
    await printOutbound(prisma, contact.id, current.currentState)

    // COLD_CALL_QUEUED no envía WhatsApp; el resto sí y esperamos entrega.
    if (current.currentState !== STOP_STATE && current.currentState !== "LOST") {
      const delivery = await waitForDelivery({
        prisma,
        contactId: contact.id,
        state: current.currentState,
      })
      console.log(`    entrega   ${delivery ?? "sin status del webhook (¿ngrok/suscripción?)"}`)
    }

    if (current.currentState === "AWAITING_CONFIRMATION") {
      const button = missingGuide
        ? { buttonId: "guide_missing", buttonText: "No me llegó" }
        : questions
          ? { buttonId: "guide_questions", buttonText: "Tengo dudas" }
          : { buttonId: "guide_received", buttonText: "Sí, la recibí" }
      await fireInboundOverlay({
        ...inboundBase,
        state: "AWAITING_CONFIRMATION",
        label: button.buttonId,
        ...button,
      })
      current = await prisma.leadPipeline.findUniqueOrThrow({ where: { id: pipeline.id } })
    }

    if (current.currentState === "LAST_NURTURE_SENT") {
      const button = lost
        ? { buttonId: "not_now", buttonText: "No es el momento" }
        : { buttonId: "book_now", buttonText: "Sí, quiero agendar" }
      await fireInboundOverlay({
        ...inboundBase,
        state: "LAST_NURTURE_SENT",
        label: button.buttonId,
        ...button,
      })
      current = await prisma.leadPipeline.findUniqueOrThrow({ where: { id: pipeline.id } })
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

  const outbound = await listRunOutbound(prisma, contact.id, pipeline.createdAt)

  console.log("\nListo")
  console.log(`  estado final  ${current.currentState}`)
  console.log(`  videoWatched  ${current.videoWatched}`)
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
