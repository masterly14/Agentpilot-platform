import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { getResendFromAddress } from "@/lib/email"
import { formatFormDataForEmail } from "@/lib/form-labels"
import { buildVisitorConfirmationEmail } from "@/lib/visitor-confirmation-email"
import type { FormData } from "@/components/multi-step-form"

const STAGE_MAP = { concept: "CONCEPT", plan: "PLAN", built: "BUILT" } as const
const PRODUCT_MAP = { mobile: "MOBILE", web: "WEB", marketplace: "MARKETPLACE", saas: "SAAS", other: "OTHER" } as const
const PROBLEM_MAP = { automate: "AUTOMATE", custom: "CUSTOM", integrate: "INTEGRATE", modernize: "MODERNIZE" } as const
const SIZE_MAP = { "1-10": "SMALL", "11-50": "MEDIUM", "50+": "LARGE" } as const

export async function POST(request: Request) {
  try {
    const data: FormData = await request.json()

    const submission = await prisma.formSubmission.create({
      data: {
        fullName: data.fullName,
        email: data.email || null,
        projectType: data.projectType === "company" ? "COMPANY" : "PERSONAL",
        projectStage: data.projectStage ? STAGE_MAP[data.projectStage] : null,
        productType: data.productType ? PRODUCT_MAP[data.productType] : null,
        businessProblem: data.businessProblem ? PROBLEM_MAP[data.businessProblem] : null,
        companyName: data.companyName || null,
        companyWebsite: data.companyWebsite || null,
        companySocialMedia: data.companySocialMedia || null,
        companySize: data.companySize ? SIZE_MAP[data.companySize] : null,
        projectDescription: data.projectDescription.trim() || null,
      },
    })

    if (process.env.RESEND_API_KEY) {
      const from = getResendFromAddress()
      const replyTo = process.env.NOTIFICATION_EMAIL || undefined

      const { error: notificationError } = await resend.emails.send({
        from,
        to: process.env.NOTIFICATION_EMAIL || "santiagov@example.com",
        subject: `Nueva solicitud de proyecto: ${data.fullName}`,
        html: `
          <h1>Nueva solicitud de proyecto de software</h1>
          <h2>Información del solicitante</h2>
          <ul>
            ${formatFormDataForEmail(data)}
          </ul>
          <h2>Descripción del proyecto</h2>
          <p>${data.projectDescription.trim() || "No proporcionada"}</p>
          <hr />
          <p><small>ID de solicitud: ${submission.id}</small></p>
        `,
      })

      if (notificationError) {
        console.error("Error enviando notificación interna:", notificationError)
      }

      const visitorEmail = data.email.trim()
      if (visitorEmail) {
        const confirmation = buildVisitorConfirmationEmail(data.fullName)
        const { error: confirmationError } = await resend.emails.send({
          from,
          to: visitorEmail,
          replyTo,
          subject: confirmation.subject,
          html: confirmation.html,
        })

        if (confirmationError) {
          console.error("Error enviando confirmación al visitante:", confirmationError)
        }
      }
    } else {
      console.warn("RESEND_API_KEY no configurada: se omitieron los correos de notificación.")
    }

    return NextResponse.json({ success: true, id: submission.id })
  } catch (error) {
    console.error("Error processing form submission:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
