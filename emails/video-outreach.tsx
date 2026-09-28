import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email"
import { VIDEO_OUTREACH_EMAIL_SUBJECT } from "@/lib/campaigns/constants"

export { VIDEO_OUTREACH_EMAIL_SUBJECT }

export type VideoOutreachEmailProps = {
  firstName: string
  bookingUrl: string
}

export default function VideoOutreachEmail({
  firstName,
  bookingUrl,
}: VideoOutreachEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Preview>
          Hola {firstName}, te escribo por el desorden tecnológico en tus rentas cortas.
        </Preview>
        <Body className="m-0 bg-[#0D0D0F] font-sans">
          <Container className="mx-auto max-w-[560px] px-6 py-10">
            <Text className="m-0 mb-6 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
              Agent Pilot
            </Text>

            <Heading className="m-0 mb-6 text-[24px] font-light leading-tight tracking-tight text-white">
              Si, tienes un desorden tecnologico en tus rentas cortas, ¿Por que?
            </Heading>

            <Text className="m-0 mb-4 text-[16px] leading-7 text-zinc-300">
              Hola {firstName}, te escribo personalmente por que me he enterado que perteneces al
              gran cumulo de empresas de rentas cortas, property management o alojamientos
              temporales que se encuentra en 3 situaciones (Y creeme, no deberías estar ahí):
            </Text>

            <Text className="m-0 mb-3 text-[16px] leading-7 text-zinc-300">
              1. Haciendo de TODO, cuando digo de todo, es de TODO. Puede que tengas
              administrador/a, sin embargo tu eres el coordinador de todo, tienes que estar encima
              de que llegue un huesped, de documentación, de portería, y un monton de vainas más.
            </Text>

            <Text className="m-0 mb-3 text-[16px] leading-7 text-zinc-300">
              2. Gastas un montón en nómina por un equipo, si bien te libera a ti de ciertas cosas,
              eso no se ve reflejado en la facturación mensual, y es que, pagas por un equipo que
              hace tareas muy repetitivas, esta limitado a un horario laboral y es susceptible a
              errores humanos.
            </Text>

            <Text className="m-0 mb-4 text-[16px] leading-7 text-zinc-300">
              3. No escalas, te enfocas en administrar en vez de escalar, apesar de que quieres
              hacer crecer tu empresa.
            </Text>

            <Text className="m-0 mb-4 text-[16px] leading-7 text-zinc-300">
              Mira, no quiero sonar como vendedor barato, de hecho, prefiero ser muy sincero y
              directo. Hemos creado un sistema que ataca todos los puntos de tus rentas para
              llevarlo a ser más eficiente, usando IA como vertiente principal. Cuando digo de todo,
              es TODO, desde la llegada hasta la salida de un húesped hasta que te deja la reseña.
              Literal liberas +100 horas al mes, aumentas capacidad operativa y potencialmente
              puedes multipllicar facturación.
            </Text>

            <Text className="m-0 mb-8 text-[16px] leading-7 text-zinc-300">
              Es mejor ver para creer {firstName}, así que te dejo mi Link de agendamiento, me
              emociona mostrartelo en vivo y que lo veas por tus propios ojos. ¿Cuando te viene
              bien?
            </Text>

            <Section className="mb-8 text-center">
              <Button
                href={bookingUrl}
                className="rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black no-underline"
              >
                Link agendamiento
              </Button>
            </Section>

            <Hr className="m-0 mb-6 border-zinc-800" />

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

VideoOutreachEmail.PreviewProps = {
  firstName: "Carlos",
  bookingUrl: "https://cal.com/santiago/diagnostico",
} satisfies VideoOutreachEmailProps
