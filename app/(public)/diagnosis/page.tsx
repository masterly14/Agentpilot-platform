import type { Metadata } from "next"
import { DiagnosisPage } from "@/components/diagnosis/diagnosis-page"

export const metadata: Metadata = {
  title: "Diagnóstico",
  description:
    "Agenda tu diagnóstico gratuito y descubre cómo recuperar +50 horas a la semana automatizando tu operación de renta corta.",
}

export default function DiagnosisRoute() {
  return <DiagnosisPage />
}
