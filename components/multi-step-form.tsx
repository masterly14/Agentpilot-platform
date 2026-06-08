"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown, Check, Clock, ArrowRight } from "lucide-react"
import { VideoBackground } from "@/components/video-background"

export type FormData = {
  fullName: string
  email: string
  projectType: "personal" | "company" | ""
  companyName: string
  companyWebsite: string
  companySocialMedia: string
  projectDescription: string
}

type Step = "start" | "name" | "projectType" | "companyName" | "description" | "complete"
type VideoTheme = "pink" | "green" | "white"

const STEP_VIDEO: Record<Step, VideoTheme> = {
  start:       "white",
  name:        "white",
  projectType: "green",
  companyName: "green",
  description: "pink",
  complete:    "pink",
}

const stepVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? 60 : -60,
    filter: "blur(4px)",
  }),
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? -60 : 60,
    filter: "blur(4px)",
  }),
}

const videoVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
}

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<Step>("start")
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    projectType: "",
    companyName: "",
    companyWebsite: "",
    companySocialMedia: "",
    projectDescription: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getStepNumber = () => {
    const steps: Step[] =
      formData.projectType === "company"
        ? ["name", "projectType", "companyName", "description"]
        : ["name", "projectType", "description"]
    const index = steps.indexOf(currentStep)
    return index >= 0 ? index + 1 : 0
  }

  const getTotalSteps = () =>
    formData.projectType === "company" ? 4 : 3

  const navigate = (to: Step, dir: number) => {
    setDirection(dir)
    setCurrentStep(to)
  }

  const handleNext = () => {
    switch (currentStep) {
      case "start":
        navigate("name", 1)
        break
      case "name":
        navigate("projectType", 1)
        break
      case "projectType":
        navigate(formData.projectType === "company" ? "companyName" : "description", 1)
        break
      case "companyName":
        navigate("description", 1)
        break
      case "description":
        handleSubmit()
        break
    }
  }

  const handlePrev = () => {
    switch (currentStep) {
      case "name":
        navigate("start", -1)
        break
      case "projectType":
        navigate("name", -1)
        break
      case "companyName":
        navigate("projectType", -1)
        break
      case "description":
        navigate(formData.projectType === "company" ? "companyName" : "projectType", -1)
        break
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        navigate("complete", 1)
      } else {
        setError("Hubo un error al enviar. Inténtalo de nuevo.")
      }
    } catch {
      setError("No se pudo conectar. Revisa tu conexión.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && currentStep !== "description") {
      e.preventDefault()
      if (canProceed()) handleNext()
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "start":       return true
      case "name":        return formData.fullName.trim() !== ""
      case "projectType": return formData.projectType !== ""
      case "companyName": return formData.companyName.trim() !== ""
      case "description": return true
      default:            return false
    }
  }

  const theme = STEP_VIDEO[currentStep]

  /* ── Shared input class ── */
  const inputCls =
    "w-full border-0 border-b-2 border-primary/25 bg-transparent py-2.5 text-lg text-primary placeholder:text-primary/35 focus:border-primary focus:outline-none transition-colors leading-relaxed"

  /* ── Shared label class ── */
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground"

  return (
    <>
      {/* Animated video background keyed by theme */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          variants={videoVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="pointer-events-none fixed inset-0 z-0"
        >
          <VideoBackground theme={theme} opacity={theme === "white" ? 0.28 : 0.32} />
        </motion.div>
      </AnimatePresence>

      {/* Glass overlay for readability */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-background/60" />

      {/* Form content */}
      <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 py-16">
        <AnimatePresence mode="wait" custom={direction}>

          {/* ── START ── */}
          {currentStep === "start" && (
            <motion.div
              key="start"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex max-w-2xl flex-col items-center text-center"
            >
              <h1
                className="mb-4 text-4xl font-black leading-tight tracking-tight text-foreground text-balance md:text-6xl"
                style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
              >
                {"¿Tienes un proyecto de software que deseas desarrollar?"}
              </h1>
              <p className="mb-10 text-base italic text-muted-foreground/70">
                Cuéntame sobre tu idea
              </p>
              <button
                onClick={handleNext}
                className="group flex items-center gap-2 rounded-sm bg-primary px-8 py-3.5 text-sm font-semibold tracking-widest text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
              >
                Comenzar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Toma 3 minutos</span>
              </div>
            </motion.div>
          )}

          {/* ── NAME ── */}
          {currentStep === "name" && (
            <motion.div
              key="name"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={1} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    {"¿Cuál es tu nombre completo?"}
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">
                    Nombre y apellido
                  </p>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe aquí..."
                    className={inputCls}
                    autoFocus
                  />
                  <div className="mt-8">
                    <label className={labelCls}>Correo electrónico</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onKeyDown={handleKeyDown}
                      placeholder="tu@correo.com"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PROJECT TYPE ── */}
          {currentStep === "projectType" && (
            <motion.div
              key="projectType"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={2} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    {"¿Este proyecto es personal o para tu empresa?"}
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">
                    Selecciona una opción
                  </p>
                  <div className="space-y-3">
                    <TypeButton
                      letter="A"
                      label="Proyecto personal"
                      selected={formData.projectType === "personal"}
                      onClick={() => setFormData({ ...formData, projectType: "personal" })}
                    />
                    <TypeButton
                      letter="B"
                      label="Proyecto para empresa"
                      selected={formData.projectType === "company"}
                      onClick={() => setFormData({ ...formData, projectType: "company" })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── COMPANY NAME ── */}
          {currentStep === "companyName" && (
            <motion.div
              key="companyName"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={3} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    {"¿Cuál es el nombre de la empresa?"}
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">
                    Nombre oficial de la compañía
                  </p>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="Nombre de la empresa..."
                    className={inputCls}
                    autoFocus
                  />

                  {/* Website + Social (only for company) */}
                  <div className="mt-10 space-y-6 border-t border-border/50 pt-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Presencia digital <span className="font-normal normal-case italic tracking-normal">(opcional)</span>
                    </p>
                    <div>
                      <label className={labelCls}>Sitio web</label>
                      <input
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                        onKeyDown={handleKeyDown}
                        placeholder="https://tuempresa.com"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Redes sociales</label>
                      <input
                        type="text"
                        value={formData.companySocialMedia}
                        onChange={(e) => setFormData({ ...formData, companySocialMedia: e.target.value })}
                        onKeyDown={handleKeyDown}
                        placeholder="@tuempresa o enlace"
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── DESCRIPTION ── */}
          {currentStep === "description" && (
            <motion.div
              key="description"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={formData.projectType === "company" ? 4 : 3} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    Describe tu proyecto de software.
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">
                    Descripción (opcional)
                  </p>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    placeholder="Escribe aquí con todos los detalles..."
                    rows={5}
                    className={`${inputCls} resize-none`}
                    autoFocus
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-semibold">Shift ⇧</span>
                    {" + "}
                    <span className="font-semibold">Enter ↵</span>
                    {" para salto de línea"}
                  </p>
                  {error && (
                    <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── COMPLETE ── */}
          {currentStep === "complete" && (
            <motion.div
              key="complete"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex max-w-xl flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary"
              >
                <Check className="h-8 w-8 text-primary" />
              </motion.div>
              <h1
                className="mb-4 text-5xl font-black leading-none tracking-tight text-foreground md:text-7xl"
                style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
              >
                {"¡Gracias!"}
              </h1>
              <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                Recibí tu información y me pondré en contacto contigo pronto.
              </p>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation controls */}
        {currentStep !== "start" && currentStep !== "complete" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="fixed bottom-8 right-8 flex flex-col items-center gap-3"
          >
            {/* Next / Submit button */}
            <button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
            >
              {isSubmitting
                ? "Enviando..."
                : currentStep === "description"
                ? "Enviar"
                : "Siguiente"}
              {!isSubmitting && <ArrowRight className="h-3.5 w-3.5" />}
            </button>

            {/* Up / Down arrows */}
            <div className="flex gap-1.5">
              <button
                onClick={handlePrev}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-foreground/20 bg-background/80 text-foreground transition-colors hover:bg-background"
                title="Anterior"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-foreground/20 bg-background/80 text-foreground transition-colors hover:bg-background disabled:opacity-40"
                title="Siguiente"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Step counter */}
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {getStepNumber()} / {getTotalSteps()}
            </span>
          </motion.div>
        )}
      </div>
    </>
  )
}

/* ── Sub-components ── */

function StepBadge({ n }: { n: number }) {
  return (
    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-primary text-xs font-bold text-primary-foreground">
      {n}
    </span>
  )
}

function TypeButton({
  letter,
  label,
  selected,
  onClick,
}: {
  letter: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full max-w-sm items-center gap-3 rounded-sm border px-4 py-3 text-left text-sm font-medium transition-all ${
        selected
          ? "border-primary bg-primary/8 text-primary"
          : "border-border bg-background/50 text-foreground hover:border-primary/40 hover:bg-primary/4"
      }`}
    >
      <span
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm border text-xs font-bold ${
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 text-muted-foreground"
        }`}
      >
        {letter}
      </span>
      {label}
    </button>
  )
}
