"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown, Check, Clock, ArrowRight } from "lucide-react"
import { VideoBackground } from "@/components/video-background"

/* ── Types ── */

export type FormData = {
  projectType:         "personal" | "company" | ""
  // Personal branch
  projectStage:        "concept" | "plan" | "built" | ""
  productType:         "mobile" | "web" | "marketplace" | "saas" | "other" | ""
  // Company branch
  businessProblem:     "automate" | "custom" | "integrate" | "modernize" | ""
  companyName:         string
  companyWebsite:      string
  companySocialMedia:  string
  companySize:         "1-10" | "11-50" | "50+" | ""
  // Shared
  projectDescription:  string
  fullName:            string
  email:               string
}

type Step =
  | "start"
  | "projectType"
  | "projectStage"
  | "productType"
  | "businessProblem"
  | "companyName"
  | "companySize"
  | "description"
  | "contact"
  | "complete"

type VideoTheme = "pink" | "green" | "white"

const STEP_VIDEO: Record<Step, VideoTheme> = {
  start:          "white",
  projectType:    "white",
  projectStage:   "green",
  productType:    "green",
  businessProblem:"green",
  companyName:    "green",
  companySize:    "green",
  description:    "pink",
  contact:        "pink",
  complete:       "pink",
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

const TRANSITION = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const }

/* ── Personal steps sequence ── */
const PERSONAL_STEPS: Step[] = ["projectType", "projectStage", "productType", "description", "contact"]
/* ── Company steps sequence ── */
const COMPANY_STEPS: Step[]  = ["projectType", "businessProblem", "companyName", "companySize", "description", "contact"]

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<Step>("start")
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    projectType:        "",
    projectStage:       "",
    productType:        "",
    businessProblem:    "",
    companyName:        "",
    companyWebsite:     "",
    companySocialMedia: "",
    companySize:        "",
    projectDescription: "",
    fullName:           "",
    email:              "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]               = useState<string | null>(null)

  /* ── Sequence helpers ── */
  const sequence = formData.projectType === "company" ? COMPANY_STEPS : PERSONAL_STEPS

  const getStepNumber = () => {
    const idx = sequence.indexOf(currentStep)
    return idx >= 0 ? idx + 1 : 0
  }
  const getTotalSteps = () => sequence.length

  const navigate = useCallback((to: Step, dir: number) => {
    setDirection(dir)
    setCurrentStep(to)
  }, [])

  /* ── Next logic ── */
  const handleNext = useCallback(() => {
    if (currentStep === "start") { navigate("projectType", 1); return }
    if (currentStep === "contact") { handleSubmit(); return }

    const idx = sequence.indexOf(currentStep)
    if (idx >= 0 && idx < sequence.length - 1) {
      navigate(sequence[idx + 1], 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, sequence, navigate])

  /* ── Prev logic ── */
  const handlePrev = useCallback(() => {
    if (currentStep === "projectType") { navigate("start", -1); return }

    const idx = sequence.indexOf(currentStep)
    if (idx > 0) {
      navigate(sequence[idx - 1], -1)
    }
  }, [currentStep, sequence, navigate])

  /* ── Auto-advance after selection ── */
  const selectAndAdvance = useCallback(<K extends keyof FormData>(
    key: K,
    value: FormData[K],
    overrides?: Partial<FormData>
  ) => {
    setFormData(prev => ({ ...prev, [key]: value, ...(overrides ?? {}) }))
    // Small delay so the selection animates visibly before advancing
    setTimeout(() => {
      setDirection(1)
      setCurrentStep(prev => {
        if (prev === "start") return "projectType"
        // For projectType we need to determine branch dynamically
        if (prev === "projectType") {
          const branch = value === "company" ? COMPANY_STEPS : PERSONAL_STEPS
          return branch[1] // step after projectType
        }
        const seq = (overrides?.projectType ?? formData.projectType) === "company"
          ? COMPANY_STEPS : PERSONAL_STEPS
        const idx = seq.indexOf(prev)
        return idx >= 0 && idx < seq.length - 1 ? seq[idx + 1] : prev
      })
    }, 180)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.projectType])

  /* ── Submit ── */
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
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

  /* ── Can proceed (for non-auto-advance steps) ── */
  const canProceed = () => {
    switch (currentStep) {
      case "start":           return true
      case "projectType":     return formData.projectType !== ""
      case "projectStage":    return formData.projectStage !== ""
      case "productType":     return formData.productType !== ""
      case "businessProblem": return formData.businessProblem !== ""
      case "companyName":     return formData.companyName.trim() !== ""
      case "companySize":     return formData.companySize !== ""
      case "description":     return true
      case "contact":         return formData.fullName.trim() !== "" && formData.email.trim() !== ""
      default:                return false
    }
  }

  /* ── Enter key ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && currentStep !== "description") {
      e.preventDefault()
      if (canProceed()) handleNext()
    }
  }

  const theme = STEP_VIDEO[currentStep]

  /* ── Shared styles ── */
  const inputCls =
    "w-full border-0 border-b-2 border-primary/25 bg-transparent py-2.5 text-lg text-primary placeholder:text-primary/35 focus:border-primary focus:outline-none transition-colors leading-relaxed"
  const labelCls =
    "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground"

  const isAutoAdvanceStep = ["projectType", "projectStage", "productType", "businessProblem", "companySize"].includes(currentStep)

  return (
    <>
      {/* Animated video background */}
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

      {/* Glass overlay */}
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
              transition={TRANSITION}
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

          {/* ── PROJECT TYPE ── */}
          {currentStep === "projectType" && (
            <motion.div
              key="projectType"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={TRANSITION}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={1} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    {"¿Tu proyecto es personal o para una empresa?"}
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">Selecciona una opción</p>
                  <div className="space-y-3">
                    <ChoiceButton
                      letter="A" label="Proyecto personal"
                      selected={formData.projectType === "personal"}
                      onClick={() => selectAndAdvance("projectType", "personal", { projectStage: "", productType: "", businessProblem: "", companyName: "", companySize: "" })}
                    />
                    <ChoiceButton
                      letter="B" label="Proyecto para empresa"
                      selected={formData.projectType === "company"}
                      onClick={() => selectAndAdvance("projectType", "company", { projectStage: "", productType: "", businessProblem: "", companyName: "", companySize: "" })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PROJECT STAGE (personal) ── */}
          {currentStep === "projectStage" && (
            <motion.div
              key="projectStage"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={TRANSITION}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={2} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    {"¿En qué etapa está tu idea?"}
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">Selecciona una opción</p>
                  <div className="space-y-3">
                    <ChoiceButton letter="A" label="Solo es un concepto" selected={formData.projectStage === "concept"} onClick={() => selectAndAdvance("projectStage", "concept")} />
                    <ChoiceButton letter="B" label="Tengo bocetos o un plan" selected={formData.projectStage === "plan"} onClick={() => selectAndAdvance("projectStage", "plan")} />
                    <ChoiceButton letter="C" label="Ya tengo algo funcionando" selected={formData.projectStage === "built"} onClick={() => selectAndAdvance("projectStage", "built")} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PRODUCT TYPE (personal) ── */}
          {currentStep === "productType" && (
            <motion.div
              key="productType"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={TRANSITION}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={3} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    {"¿Qué tipo de producto imaginas?"}
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">Selecciona una opción</p>
                  <div className="space-y-3">
                    <ChoiceButton letter="A" label="App móvil"       selected={formData.productType === "mobile"}      onClick={() => selectAndAdvance("productType", "mobile")} />
                    <ChoiceButton letter="B" label="Plataforma web"  selected={formData.productType === "web"}         onClick={() => selectAndAdvance("productType", "web")} />
                    <ChoiceButton letter="C" label="Marketplace"     selected={formData.productType === "marketplace"} onClick={() => selectAndAdvance("productType", "marketplace")} />
                    <ChoiceButton letter="D" label="SaaS"            selected={formData.productType === "saas"}        onClick={() => selectAndAdvance("productType", "saas")} />
                    <ChoiceButton letter="E" label="Otro"            selected={formData.productType === "other"}       onClick={() => selectAndAdvance("productType", "other")} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── BUSINESS PROBLEM (company) ── */}
          {currentStep === "businessProblem" && (
            <motion.div
              key="businessProblem"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={TRANSITION}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={2} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    {"¿Qué quieres resolver?"}
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">Selecciona una opción</p>
                  <div className="space-y-3">
                    <ChoiceButton letter="A" label="Automatizar procesos"          selected={formData.businessProblem === "automate"}   onClick={() => selectAndAdvance("businessProblem", "automate")} />
                    <ChoiceButton letter="B" label="Sistema a medida"              selected={formData.businessProblem === "custom"}     onClick={() => selectAndAdvance("businessProblem", "custom")} />
                    <ChoiceButton letter="C" label="Integrar herramientas"         selected={formData.businessProblem === "integrate"}  onClick={() => selectAndAdvance("businessProblem", "integrate")} />
                    <ChoiceButton letter="D" label="Modernizar algo existente"     selected={formData.businessProblem === "modernize"}  onClick={() => selectAndAdvance("businessProblem", "modernize")} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── COMPANY NAME (company) ── */}
          {currentStep === "companyName" && (
            <motion.div
              key="companyName"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={TRANSITION}
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
                  <p className="mb-8 text-sm italic text-muted-foreground">Nombre oficial de la compañía</p>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData(p => ({ ...p, companyName: e.target.value }))}
                    onKeyDown={handleKeyDown}
                    placeholder="Nombre de la empresa..."
                    className={inputCls}
                    autoFocus
                  />
                  <div className="mt-10 space-y-6 border-t border-border/50 pt-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Presencia digital{" "}
                      <span className="font-normal normal-case italic tracking-normal">(opcional)</span>
                    </p>
                    <div>
                      <label className={labelCls}>Sitio web</label>
                      <input
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) => setFormData(p => ({ ...p, companyWebsite: e.target.value }))}
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
                        onChange={(e) => setFormData(p => ({ ...p, companySocialMedia: e.target.value }))}
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

          {/* ── COMPANY SIZE (company) ── */}
          {currentStep === "companySize" && (
            <motion.div
              key="companySize"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={TRANSITION}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={4} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    {"¿Qué tamaño tiene la empresa?"}
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">Selecciona una opción</p>
                  <div className="space-y-3">
                    <ChoiceButton letter="A" label="1 – 10 personas"  selected={formData.companySize === "1-10"}  onClick={() => selectAndAdvance("companySize", "1-10")} />
                    <ChoiceButton letter="B" label="11 – 50 personas" selected={formData.companySize === "11-50"} onClick={() => selectAndAdvance("companySize", "11-50")} />
                    <ChoiceButton letter="C" label="50+ personas"     selected={formData.companySize === "50+"}   onClick={() => selectAndAdvance("companySize", "50+")} />
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
              transition={TRANSITION}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={formData.projectType === "company" ? 5 : 4} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    Describe tu proyecto.
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">Opcional — cuéntame todo lo que quieras</p>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => setFormData(p => ({ ...p, projectDescription: e.target.value }))}
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
                </div>
              </div>
            </motion.div>
          )}

          {/* ── CONTACT ── */}
          {currentStep === "contact" && (
            <motion.div
              key="contact"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={TRANSITION}
              className="w-full max-w-xl"
            >
              <div className="flex items-start gap-4">
                <StepBadge n={formData.projectType === "company" ? 6 : 5} />
                <div className="flex-1">
                  <h2
                    className="mb-1 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl"
                    style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
                  >
                    {"¿Cómo te contactamos?"}
                  </h2>
                  <p className="mb-8 text-sm italic text-muted-foreground">Nombre y correo para seguimiento</p>
                  <div className="space-y-8">
                    <div>
                      <label className={labelCls}>Nombre completo</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                        onKeyDown={handleKeyDown}
                        placeholder="Tu nombre y apellido..."
                        className={inputCls}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Correo electrónico</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                        onKeyDown={handleKeyDown}
                        placeholder="tu@correo.com"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  {error && (
                    <p className="mt-6 text-sm font-medium text-red-600">{error}</p>
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
              transition={TRANSITION}
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
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                Recibí tu información y me pondré en contacto contigo pronto.
              </p>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation controls — hidden on start, auto-advance steps and complete */}
        {currentStep !== "start" && currentStep !== "complete" && !isAutoAdvanceStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="fixed bottom-8 right-8 flex flex-col items-center gap-3"
          >
            <button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
            >
              {isSubmitting ? "Enviando..." : currentStep === "contact" ? "Enviar" : "Siguiente"}
              {!isSubmitting && <ArrowRight className="h-3.5 w-3.5" />}
            </button>

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

            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {getStepNumber()} / {getTotalSteps()}
            </span>
          </motion.div>
        )}

        {/* On auto-advance steps show only step counter + back arrow */}
        {currentStep !== "start" && currentStep !== "complete" && isAutoAdvanceStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="fixed bottom-8 right-8 flex flex-col items-center gap-3"
          >
            <button
              onClick={handlePrev}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-foreground/20 bg-background/80 text-foreground transition-colors hover:bg-background"
              title="Anterior"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
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

function ChoiceButton({
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
          : "border-foreground/15 bg-background/70 text-foreground hover:border-primary/40 hover:bg-primary/5"
      }`}
    >
      <span
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm border text-xs font-bold transition-colors ${
          selected ? "border-primary bg-primary text-primary-foreground" : "border-foreground/25 text-muted-foreground"
        }`}
      >
        {letter}
      </span>
      {label}
    </button>
  )
}
