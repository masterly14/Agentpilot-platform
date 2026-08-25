import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email"

export const LEAD_GUIDE_EMAIL_SUBJECT = "Tu guía está lista — 10 pilares para rentas cortas"
export const LEAD_GUIDE_COVER_CID = "ebook-cover"
export const LEAD_GUIDE_COVER_PREVIEW_SRC = "/static/portada-ebook.png"

export type LeadGuideEmailProps = {
  firstName: string
  coverUrl?: string
}

export default function LeadGuideEmail({
  firstName,
  coverUrl = LEAD_GUIDE_COVER_PREVIEW_SRC,
}: LeadGuideEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Preview>Tu guía de 10 pilares va adjunta en este correo. Ábrela cuando quieras.</Preview>
        <Body className="m-0 bg-[#0D0D0F] font-sans">
          <Container className="mx-auto max-w-[560px] px-6 py-10">
            <Text className="m-0 mb-6 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
              Agent Pilot
            </Text>

            <Section className="mb-8">
              <Img
                src={coverUrl}
                alt="Portada de la guía Agent Pilot"
                width={240}
                className="mx-auto block w-full max-w-[240px] rounded-xl"
                style={{ color: "#e4e4e7" }}
              />
            </Section>

            <Heading className="m-0 mb-4 text-center text-[28px] font-light leading-tight tracking-tight text-white">
              Tu guía va adjunta
            </Heading>

            <Text className="m-0 mb-4 text-[16px] leading-7 text-zinc-300">
              Hola {firstName},
            </Text>

            <Text className="m-0 mb-4 text-[16px] leading-7 text-zinc-300">
              Aquí tienes los <strong className="font-medium text-white">10 pilares</strong> para
              recuperar +100 horas semanales y multiplicar la facturación de tus rentas cortas con
              IA.
            </Text>

            <Text className="m-0 mb-8 text-[16px] leading-7 text-zinc-300">
              El PDF ya está en este correo. Ábrelo desde el archivo adjunto{" "}
              <strong className="font-medium text-white">guia-agent-pilot.pdf</strong>.
            </Text>

            <Hr className="m-0 mb-6 border-zinc-800" />

            <Text className="m-0 mb-6 text-[13px] leading-6 text-zinc-500">
              Si no ves el archivo, revisa la sección de adjuntos o la carpeta de spam. No vamos a
              llenarte la bandeja: este correo es para que tengas la guía a mano.
            </Text>

            <Text className="m-0 text-[15px] leading-7 text-zinc-300">
              Un abrazo,
              <br />
              <strong className="font-medium text-white">Santiago Varón</strong>
              <br />
              <span className="text-[13px] text-zinc-500">Agent Pilot</span>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

LeadGuideEmail.PreviewProps = {
  firstName: "María",
} satisfies LeadGuideEmailProps
