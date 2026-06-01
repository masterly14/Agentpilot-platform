import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import type { FormData } from "@/components/multi-step-form"

export async function POST(request: Request) {
  try {
    const data: FormData = await request.json()

    // Save to database
    const submission = await prisma.formSubmission.create({
      data: {
        fullName: data.fullName,
        email: data.email || null,
        projectType: data.projectType === "company" ? "COMPANY" : "PERSONAL",
        companyName: data.companyName || null,
        companyWebsite: data.companyWebsite || null,
        companySocialMedia: data.companySocialMedia || null,
        projectDescription: data.projectDescription,
      },
    })

    // Send email notification using Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: process.env.NOTIFICATION_EMAIL || "santiagov@example.com",
        subject: `Nueva solicitud de proyecto: ${data.fullName}`,
        html: `
          <h1>Nueva solicitud de proyecto de software</h1>
          <h2>Información del solicitante</h2>
          <ul>
            <li><strong>Nombre:</strong> ${data.fullName}</li>
            <li><strong>Correo:</strong> ${data.email || "No proporcionado"}</li>
            <li><strong>Tipo de proyecto:</strong> ${data.projectType === "company" ? "Empresa" : "Personal"}</li>
            ${data.companyName ? `<li><strong>Empresa:</strong> ${data.companyName}</li>` : ""}
            ${data.companyWebsite ? `<li><strong>Sitio web:</strong> ${data.companyWebsite}</li>` : ""}
            ${data.companySocialMedia ? `<li><strong>Redes sociales:</strong> ${data.companySocialMedia}</li>` : ""}
          </ul>
          <h2>Descripción del proyecto</h2>
          <p>${data.projectDescription || "No proporcionada"}</p>
          <hr />
          <p><small>ID de solicitud: ${submission.id}</small></p>
        `,
      })
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
