/**
 * Placeholder de nutrición MQL.
 *
 * El bloque de cualificación conversacional se retiró. El pipeline se crea
 * en LEAD_MAGNET_DOWNLOADED y no avanza hasta que `nextMqlNurtureState`
 * (`lib/pipeline/nurture-mql.ts`) devuelva un estado.
 *
 *   pnpm pipeline:sim-mql
 *   pnpm pipeline:sim-mql --phone 573001112233
 */
import { PrismaClient } from "../prisma/generated/client/index.js"
import { nextMqlNurtureState } from "../lib/pipeline/nurture-mql.ts"
import {
  abortIfProduction,
  deleteQstashMessage,
  generatePdfToken,
  hasFlag,
  loadEnvFile,
  makeQstashClient,
  parsePhone,
} from "./sim-shared.ts"

const CONTACT_NAME = "MQL Nurture Test"

loadEnvFile()
abortIfProduction()

const argv = process.argv.slice(2)
if (hasFlag(argv, "--book-direct") || hasFlag(argv, "--disqualified")) {
  throw new Error("Las ramas de cualificación MQL ya no existen. Usa el hook en lib/pipeline/nurture-mql.ts.")
}

const phone = parsePhone(argv)
const prisma = new PrismaClient()
const qstash = makeQstashClient()

try {
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

  const next = nextMqlNurtureState(pipeline)
  if (next) {
    throw new Error(`Se esperaba nextMqlNurtureState=null, obtuvo ${next}`)
  }
  if (pipeline.currentState !== "LEAD_MAGNET_DOWNLOADED") {
    throw new Error(`Se esperaba LEAD_MAGNET_DOWNLOADED, quedó en ${pipeline.currentState}`)
  }

  console.log(`Simulación MQL (nutrición vacía) → ${phone.e164}`)
  console.log(`  contact     ${contact.id}`)
  console.log(`  pipeline    ${pipeline.id}`)
  console.log(`  pdfToken    ${submission.pdfToken}`)
  console.log(`  estado      ${pipeline.currentState}`)
  console.log(`  siguiente   (ninguno — hook vacío en lib/pipeline/nurture-mql.ts)`)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
