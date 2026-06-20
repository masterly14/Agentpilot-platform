"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import {
  ChoiceButton,
  FormNavigation,
  FormShell,
  FormSubtitle,
  FormTitle,
  StepBadge,
  formInputCls,
  formLabelCls,
} from "@/components/qualification/form-ui"

/* ── Types ── */

export type FormData = {
  projectType:         "personal" | "company" | ""
  projectStage:        "concept" | "plan" | "built" | ""
  productType:         "mobile" | "web" | "marketplace" | "saas" | "other" | ""
  businessProblem:     "automate" | "custom" | "integrate" | "modernize" | ""
  companyName:         string
  companyWebsite:      string
  companySocialMedia:  string
  companySize:         "1-10" | "11-50" | "50+" | ""
  projectDescription:  string
  fullName:            string
  email:               string
}

type Step =
  | "projectType"
  | "projectStage"
  | "productType"
  | "businessProblem"
  | "companyName"
  | "companySize"
  | "description"
  | "contact"
  | "complete"

const stepVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? 40 : -40,
    filter: "blur(4px)",
  }),
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? -40 : 40,
    filter: "blur(4px)",
  }),
}

const TRANSITION = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const }

const PERSONAL_STEPS: Step[] = ["projectType", "projectStage", "productType", "description", "contact"]
const COMPANY_STEPS: Step[]  = ["projectType", "businessProblem", "companyName", "companySize", "description", "contact"]

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<Step>("projectType")
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

  const handleSubmit = useCallback(async () => {
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
  }, [formData, navigate])

  const handleNext = useCallback(() => {
    if (currentStep === "contact") { handleSubmit(); return }

    const idx = sequence.indexOf(currentStep)
    if (idx >= 0 && idx < sequence.length - 1) {
      navigate(sequence[idx + 1], 1)
    }
  }, [currentStep, sequence, navigate, handleSubmit])

  const handlePrev = useCallback(() => {
    if (currentStep === "projectType") return

    const idx = sequence.indexOf(currentStep)
    if (idx > 0) {
      navigate(sequence[idx - 1], -1)
    }
  }, [currentStep, sequence, navigate])

  const selectAndAdvance = useCallback(<K extends keyof FormData>(
    key: K,
    value: FormData[K],
    overrides?: Partial<FormData>
  ) => {
    setFormData(prev => ({ ...prev, [key]: value, ...(overrides ?? {}) }))
    setTimeout(() => {
      setDirection(1)
      setCurrentStep(prev => {
        if (prev === "projectType") {
          const branch = value === "company" ? COMPANY_STEPS : PERSONAL_STEPS
          return branch[1]
        }
        const seq = (overrides?.projectType ?? formData.projectType) === "company"
          ? COMPANY_STEPS : PERSONAL_STEPS
        const idx = seq.indexOf(prev)
        return idx >= 0 && idx < seq.length - 1 ? seq[idx + 1] : prev
      })
    }, 180)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.projectType])

  const canProceed = () => {
    switch (currentStep) {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && currentStep !== "description") {
      e.preventDefault()
      if (canProceed()) handleNext()
    }
  }

  const isAutoAdvanceStep = ["projectType", "projectStage", "productType", "businessProblem", "companySize"].includes(currentStep)

  const badge =
    currentStep !== "complete"
      ? `Paso ${getStepNumber()} de ${getTotalSteps()}`
      : undefined

  return (
    <FormShell badge={badge}>
      <AnimatePresence mode="wait" custom={direction}>

        {currentStep === "projectType" && (
          <motion.div key="projectType" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={TRANSITION}>
            <div className="flex items-start gap-4">
              <StepBadge n={1} />
              <div className="flex-1">
                <FormTitle>¿Tu proyecto es personal o para una empresa?</FormTitle>
                <FormSubtitle>Selecciona una opción</FormSubtitle>
                <div className="space-y-3">
                  <ChoiceButton letter="A" label="Proyecto personal" selected={formData.projectType === "personal"} onClick={() => selectAndAdvance("projectType", "personal", { projectStage: "", productType: "", businessProblem: "", companyName: "", companySize: "" })} />
                  <ChoiceButton letter="B" label="Proyecto para empresa" selected={formData.projectType === "company"} onClick={() => selectAndAdvance("projectType", "company", { projectStage: "", productType: "", businessProblem: "", companyName: "", companySize: "" })} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "projectStage" && (
          <motion.div key="projectStage" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={TRANSITION}>
            <div className="flex items-start gap-4">
              <StepBadge n={2} />
              <div className="flex-1">
                <FormTitle>¿En qué etapa está tu idea?</FormTitle>
                <FormSubtitle>Selecciona una opción</FormSubtitle>
                <div className="space-y-3">
                  <ChoiceButton letter="A" label="Solo es un concepto" selected={formData.projectStage === "concept"} onClick={() => selectAndAdvance("projectStage", "concept")} />
                  <ChoiceButton letter="B" label="Tengo bocetos o un plan" selected={formData.projectStage === "plan"} onClick={() => selectAndAdvance("projectStage", "plan")} />
                  <ChoiceButton letter="C" label="Ya tengo algo funcionando" selected={formData.projectStage === "built"} onClick={() => selectAndAdvance("projectStage", "built")} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "productType" && (
          <motion.div key="productType" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={TRANSITION}>
            <div className="flex items-start gap-4">
              <StepBadge n={3} />
              <div className="flex-1">
                <FormTitle>¿Qué tipo de producto imaginas?</FormTitle>
                <FormSubtitle>Selecciona una opción</FormSubtitle>
                <div className="space-y-3">
                  <ChoiceButton letter="A" label="App móvil" selected={formData.productType === "mobile"} onClick={() => selectAndAdvance("productType", "mobile")} />
                  <ChoiceButton letter="B" label="Plataforma web" selected={formData.productType === "web"} onClick={() => selectAndAdvance("productType", "web")} />
                  <ChoiceButton letter="C" label="Marketplace" selected={formData.productType === "marketplace"} onClick={() => selectAndAdvance("productType", "marketplace")} />
                  <ChoiceButton letter="D" label="SaaS" selected={formData.productType === "saas"} onClick={() => selectAndAdvance("productType", "saas")} />
                  <ChoiceButton letter="E" label="Otro" selected={formData.productType === "other"} onClick={() => selectAndAdvance("productType", "other")} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "businessProblem" && (
          <motion.div key="businessProblem" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={TRANSITION}>
            <div className="flex items-start gap-4">
              <StepBadge n={2} />
              <div className="flex-1">
                <FormTitle>¿Qué quieres resolver?</FormTitle>
                <FormSubtitle>Selecciona una opción</FormSubtitle>
                <div className="space-y-3">
                  <ChoiceButton letter="A" label="Automatizar procesos" selected={formData.businessProblem === "automate"} onClick={() => selectAndAdvance("businessProblem", "automate")} />
                  <ChoiceButton letter="B" label="Sistema a medida" selected={formData.businessProblem === "custom"} onClick={() => selectAndAdvance("businessProblem", "custom")} />
                  <ChoiceButton letter="C" label="Integrar herramientas" selected={formData.businessProblem === "integrate"} onClick={() => selectAndAdvance("businessProblem", "integrate")} />
                  <ChoiceButton letter="D" label="Modernizar algo existente" selected={formData.businessProblem === "modernize"} onClick={() => selectAndAdvance("businessProblem", "modernize")} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "companyName" && (
          <motion.div key="companyName" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={TRANSITION}>
            <div className="flex items-start gap-4">
              <StepBadge n={3} />
              <div className="flex-1">
                <FormTitle>¿Cuál es el nombre de la empresa?</FormTitle>
                <FormSubtitle>Nombre oficial de la compañía</FormSubtitle>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData(p => ({ ...p, companyName: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  placeholder="Nombre de la empresa..."
                  className={formInputCls}
                  autoFocus
                />
                <div className="mt-10 space-y-6 border-t border-dashed border-border/50 pt-8">
                  <p className={formLabelCls}>
                    Presencia digital{" "}
                    <span className="font-normal normal-case italic tracking-normal text-muted-foreground/80">(opcional)</span>
                  </p>
                  <div>
                    <label className={formLabelCls}>Sitio web</label>
                    <input type="url" value={formData.companyWebsite} onChange={(e) => setFormData(p => ({ ...p, companyWebsite: e.target.value }))} onKeyDown={handleKeyDown} placeholder="https://tuempresa.com" className={formInputCls} />
                  </div>
                  <div>
                    <label className={formLabelCls}>Redes sociales</label>
                    <input type="text" value={formData.companySocialMedia} onChange={(e) => setFormData(p => ({ ...p, companySocialMedia: e.target.value }))} onKeyDown={handleKeyDown} placeholder="@tuempresa o enlace" className={formInputCls} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "companySize" && (
          <motion.div key="companySize" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={TRANSITION}>
            <div className="flex items-start gap-4">
              <StepBadge n={4} />
              <div className="flex-1">
                <FormTitle>¿Qué tamaño tiene la empresa?</FormTitle>
                <FormSubtitle>Selecciona una opción</FormSubtitle>
                <div className="space-y-3">
                  <ChoiceButton letter="A" label="1 – 10" selected={formData.companySize === "1-10"} onClick={() => selectAndAdvance("companySize", "1-10")} />
                  <ChoiceButton letter="B" label="11 – 50" selected={formData.companySize === "11-50"} onClick={() => selectAndAdvance("companySize", "11-50")} />
                  <ChoiceButton letter="C" label="50+" selected={formData.companySize === "50+"} onClick={() => selectAndAdvance("companySize", "50+")} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "description" && (
          <motion.div key="description" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={TRANSITION}>
            <div className="flex items-start gap-4">
              <StepBadge n={formData.projectType === "company" ? 5 : 4} />
              <div className="flex-1">
                <FormTitle>
                  Describe tu <span className="font-serif italic">proyecto</span>
                </FormTitle>
                <FormSubtitle>Opcional — cuéntame todo lo que quieras</FormSubtitle>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => setFormData(p => ({ ...p, projectDescription: e.target.value }))}
                  placeholder="Escribe aquí con todos los detalles..."
                  rows={5}
                  className={`${formInputCls} resize-none`}
                  autoFocus
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="font-medium">Shift ⇧</span> + <span className="font-medium">Enter ↵</span> para salto de línea
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "contact" && (
          <motion.div key="contact" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={TRANSITION}>
            <div className="flex items-start gap-4">
              <StepBadge n={formData.projectType === "company" ? 6 : 5} />
              <div className="flex-1">
                <FormTitle>¿Cómo te contactamos?</FormTitle>
                <FormSubtitle>Nombre y correo para seguimiento</FormSubtitle>
                <div className="space-y-8">
                  <div>
                    <label className={formLabelCls}>Nombre completo</label>
                    <input type="text" value={formData.fullName} onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))} onKeyDown={handleKeyDown} placeholder="Tu nombre y apellido..." className={formInputCls} autoFocus />
                  </div>
                  <div>
                    <label className={formLabelCls}>Correo electrónico</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} onKeyDown={handleKeyDown} placeholder="tu@correo.com" className={formInputCls} />
                  </div>
                </div>
                {error && <p className="mt-6 text-sm font-medium text-red-400">{error}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "complete" && (
          <motion.div key="complete" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={TRANSITION} className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30"
            >
              <Check className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="mb-4 text-4xl font-light leading-none tracking-tight text-foreground md:text-6xl">
              ¡<span className="font-serif italic">Gracias</span>!
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              Recibí tu información y me pondré en contacto contigo pronto.
            </p>
          </motion.div>
        )}

      </AnimatePresence>

      {currentStep !== "complete" && (
        <FormNavigation
          onNext={handleNext}
          onPrev={handlePrev}
          canProceed={canProceed()}
          isSubmitting={isSubmitting}
          isContact={currentStep === "contact"}
          stepNumber={getStepNumber()}
          totalSteps={getTotalSteps()}
          showNext={!isAutoAdvanceStep}
          showPrev={currentStep !== "projectType"}
        />
      )}
    </FormShell>
  )
}
