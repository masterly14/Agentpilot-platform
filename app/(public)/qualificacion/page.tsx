import type { Metadata } from "next"
import { MultiStepForm } from "@/components/multi-step-form"

export const metadata: Metadata = {
  title: "Cualificación — Santiago Varón",
  description: "Cuéntanos sobre tu proyecto y recibe una respuesta personalizada.",
}

export default function QualificacionPage() {
  return <MultiStepForm />
}
