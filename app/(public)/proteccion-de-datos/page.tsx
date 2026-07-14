import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"

export const metadata: Metadata = {
  title: "Protección de datos personales",
  description:
    "Política de tratamiento de datos personales de Agent Pilot S.A.S conforme a la legislación colombiana.",
}

const sections = [
  {
    title: "Responsable del tratamiento",
    content: (
      <>
        <p>
          <strong>Agent Pilot S.A.S</strong>, representada legalmente por{" "}
          <strong>Nicolás Santiago Cano Varón</strong>, es responsable del tratamiento de los datos
          personales recopilados a través de sus soluciones tecnológicas.
        </p>
        <p className="mt-3">
          Contacto:{" "}
          <a
            href="mailto:contacto@agentpilot.cloud"
            className="text-cyan-400 underline-offset-4 hover:underline"
          >
            contacto@agentpilot.cloud
          </a>
        </p>
      </>
    ),
  },
  {
    title: "Alcance",
    content: (
      <p>
        Esta política aplica al tratamiento de datos personales en el desarrollo, implementación y
        operación de chatbots, automatizaciones, integraciones con sistemas de clientes, procesamiento
        de credenciales y demás servicios de software e inteligencia artificial ofrecidos por Agent
        Pilot.
      </p>
    ),
  },
  {
    title: "Datos que tratamos",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Datos de identificación y contacto (nombre, correo, teléfono, empresa).</li>
        <li>Datos de interacción en chatbots y canales conectados (WhatsApp, web, etc.).</li>
        <li>Datos operativos y de negocio que el cliente autorice integrar en nuestras soluciones.</li>
        <li>Credenciales y tokens de acceso a servicios de terceros, cuando sean necesarios para la prestación del servicio.</li>
      </ul>
    ),
  },
  {
    title: "Finalidades",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Prestar, configurar y mantener las soluciones contratadas.</li>
        <li>Automatizar procesos, atención y flujos conversacionales.</li>
        <li>Integrar sistemas y procesar información autorizada por el cliente.</li>
        <li>Brindar soporte, seguridad, mejora continua y cumplimiento contractual.</li>
        <li>Atender solicitudes, consultas y ejercicio de derechos del titular.</li>
      </ul>
    ),
  },
  {
    title: "Derechos de los titulares",
    content: (
      <p>
        Conforme a la Ley 1581 de 2012 y normas complementarias, usted puede conocer, actualizar,
        rectificar y suprimir sus datos, revocar la autorización y presentar consultas o reclamos ante
        el responsable. Responderemos dentro de los plazos legales aplicables.
      </p>
    ),
  },
  {
    title: "Seguridad y encargados",
    content: (
      <p>
        Adoptamos medidas técnicas, humanas y administrativas razonables para proteger la información.
        Podemos apoyarnos en proveedores de infraestructura y servicios en la nube como encargados del
        tratamiento, bajo acuerdos que exigen confidencialidad y protección de datos.
      </p>
    ),
  },
  {
    title: "Conservación",
    content: (
      <p>
        Los datos se conservarán mientras exista una relación contractual o comercial, mientras sean
        necesarios para las finalidades descritas, o durante el tiempo exigido por la ley. Luego se
        eliminarán o anonimizarán de forma segura.
      </p>
    ),
  },
  {
    title: "Autorización",
    content: (
      <p>
        El tratamiento se realiza con la autorización del titular, cuando la ley lo exija, o en los
        casos permitidos por la normativa colombiana. Al usar nuestros servicios o proporcionar datos,
        usted declara haber leído y aceptado esta política.
      </p>
    ),
  },
]

export default function ProteccionDeDatosPage() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-black text-foreground">
      <header className="relative z-20 px-4 pt-6 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="mt-6 flex justify-center md:justify-start">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
            Legal
          </span>
        </div>
      </header>

      <DashedGrid
        gridId="data-protection"
        maxWidth="4xl"
        padding="px-4 py-10 md:px-6 md:py-16"
        contentClassName="pb-20"
      >
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="mb-3 bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 bg-clip-text text-3xl font-light leading-tight tracking-tight text-transparent md:text-5xl">
            Protección de{" "}
            <span className="font-serif italic font-normal text-white">datos personales</span>
          </h1>

          <p className="mb-10 text-sm text-muted-foreground md:text-base">
            Política de tratamiento conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 (Colombia).
            Última actualización: julio de 2026.
          </p>

          <div className="space-y-8">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 md:p-8"
              >
                <h2 className="mb-4 text-lg font-medium text-white md:text-xl">{section.title}</h2>
                <div className="text-sm leading-relaxed text-zinc-300 md:text-base">{section.content}</div>
              </section>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Para consultas o reclamos sobre sus datos:{" "}
            <a
              href="mailto:contacto@agentpilot.cloud"
              className="text-cyan-400 underline-offset-4 hover:underline"
            >
              contacto@agentpilot.cloud
            </a>
          </p>
        </div>
      </DashedGrid>
    </div>
  )
}
