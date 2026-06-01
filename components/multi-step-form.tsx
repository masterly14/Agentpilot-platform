"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown, Check, Clock } from "lucide-react"

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

const stepVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
}

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<Step>("start")
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

  const getStepNumber = () => {
    const steps: Step[] = ["name", "projectType", "companyName", "description"]
    const index = steps.indexOf(currentStep)
    return index >= 0 ? index + 1 : 0
  }

  const getTotalSteps = () => {
    return formData.projectType === "company" ? 4 : 3
  }

  const handleNext = () => {
    switch (currentStep) {
      case "start":
        setCurrentStep("name")
        break
      case "name":
        setCurrentStep("projectType")
        break
      case "projectType":
        if (formData.projectType === "company") {
          setCurrentStep("companyName")
        } else {
          setCurrentStep("description")
        }
        break
      case "companyName":
        setCurrentStep("description")
        break
      case "description":
        handleSubmit()
        break
    }
  }

  const handlePrev = () => {
    switch (currentStep) {
      case "name":
        setCurrentStep("start")
        break
      case "projectType":
        setCurrentStep("name")
        break
      case "companyName":
        setCurrentStep("projectType")
        break
      case "description":
        if (formData.projectType === "company") {
          setCurrentStep("companyName")
        } else {
          setCurrentStep("projectType")
        }
        break
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setCurrentStep("complete")
      } else {
        console.error("Error submitting form")
      }
    } catch (error) {
      console.error("Error:", error)
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
      case "start":
        return true
      case "name":
        return formData.fullName.trim() !== ""
      case "projectType":
        return formData.projectType !== ""
      case "companyName":
        return formData.companyName.trim() !== ""
      case "description":
        return true
      default:
        return false
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {currentStep === "start" && (
          <motion.div
            key="start"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="mb-4 text-2xl font-medium text-foreground md:text-3xl text-balance">
              {"¿Tienes un proyecto de software que deseas desarrollar?"}
            </h1>
            <p className="mb-8 text-muted-foreground italic">Description (optional)</p>
            <button
              onClick={handleNext}
              className="rounded-md bg-[#1a4fd8] px-8 py-3 font-medium text-white transition-colors hover:bg-[#1a4fd8]/90"
            >
              start
            </button>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Takes X minutes</span>
            </div>
          </motion.div>
        )}

        {currentStep === "name" && (
          <motion.div
            key="name"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-[#1a4fd8] text-xs font-medium text-white">
                1
              </span>
              <div className="flex-1">
                <h2 className="mb-1 text-xl font-medium text-foreground md:text-2xl">
                  {"¿Cuál es tu nombre completo?"}
                </h2>
                <p className="mb-6 text-muted-foreground italic">Description (optional)</p>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here..."
                  className="w-full border-b-2 border-[#1a4fd8]/30 bg-transparent py-2 text-lg text-[#1a4fd8] placeholder:text-[#1a4fd8]/40 focus:border-[#1a4fd8] focus:outline-none"
                  autoFocus
                />
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onKeyDown={handleKeyDown}
                    placeholder="tu@email.com"
                    className="w-full border-b-2 border-[#1a4fd8]/30 bg-transparent py-2 text-lg text-[#1a4fd8] placeholder:text-[#1a4fd8]/40 focus:border-[#1a4fd8] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "projectType" && (
          <motion.div
            key="projectType"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-[#1a4fd8] text-xs font-medium text-white">
                2
              </span>
              <div className="flex-1">
                <h2 className="mb-1 text-xl font-medium text-foreground md:text-2xl">
                  {"¿Este proyecto es personal o para tu empresa?"}
                </h2>
                <p className="mb-6 text-muted-foreground italic">Description (optional)</p>
                <div className="space-y-3">
                  <button
                    onClick={() => setFormData({ ...formData, projectType: "personal" })}
                    className={`flex w-full max-w-md items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors ${
                      formData.projectType === "personal"
                        ? "border-[#1a4fd8] bg-[#1a4fd8]/5"
                        : "border-border hover:border-[#1a4fd8]/50"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded border border-[#1a4fd8]/30 text-xs font-medium text-[#1a4fd8]">
                      A
                    </span>
                    <span className="text-[#1a4fd8]">Proyecto personal</span>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, projectType: "company" })}
                    className={`flex w-full max-w-md items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors ${
                      formData.projectType === "company"
                        ? "border-[#1a4fd8] bg-[#1a4fd8]/5"
                        : "border-border hover:border-[#1a4fd8]/50"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded border border-[#1a4fd8]/30 text-xs font-medium text-[#1a4fd8]">
                      B
                    </span>
                    <span className="text-[#1a4fd8]">Proyecto para empresa</span>
                  </button>
                </div>
                <button className="mt-4 text-sm text-[#1a4fd8] hover:underline">
                  Add choice
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "companyName" && (
          <motion.div
            key="companyName"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-[#1a4fd8] text-xs font-medium text-white">
                3
              </span>
              <div className="flex-1">
                <h2 className="mb-1 text-xl font-medium text-foreground md:text-2xl">
                  {"¿Cuál es el nombre de la empresa?"}
                </h2>
                <p className="mb-6 text-muted-foreground italic">Description (optional)</p>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here..."
                  className="w-full border-b-2 border-[#1a4fd8]/30 bg-transparent py-2 text-lg text-[#1a4fd8] placeholder:text-[#1a4fd8]/40 focus:border-[#1a4fd8] focus:outline-none"
                  autoFocus
                />
                
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    {"¿Dónde podemos conocer más de tu empresa? (opcional)"}
                  </h3>
                  <div>
                    <label className="mb-2 block text-sm text-muted-foreground">
                      Sitio web
                    </label>
                    <input
                      type="url"
                      value={formData.companyWebsite}
                      onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                      onKeyDown={handleKeyDown}
                      placeholder="https://tuempresa.com"
                      className="w-full border-b-2 border-[#1a4fd8]/30 bg-transparent py-2 text-lg text-[#1a4fd8] placeholder:text-[#1a4fd8]/40 focus:border-[#1a4fd8] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-muted-foreground">
                      Redes sociales
                    </label>
                    <input
                      type="text"
                      value={formData.companySocialMedia}
                      onChange={(e) => setFormData({ ...formData, companySocialMedia: e.target.value })}
                      onKeyDown={handleKeyDown}
                      placeholder="@tuempresa o enlace a redes sociales"
                      className="w-full border-b-2 border-[#1a4fd8]/30 bg-transparent py-2 text-lg text-[#1a4fd8] placeholder:text-[#1a4fd8]/40 focus:border-[#1a4fd8] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "description" && (
          <motion.div
            key="description"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-[#1a4fd8] text-xs font-medium text-white">
                {formData.projectType === "company" ? 4 : 3}
              </span>
              <div className="flex-1">
                <h2 className="mb-1 text-xl font-medium text-foreground md:text-2xl">
                  Por favor, describe en detalle tu proyecto de software.
                </h2>
                <p className="mb-6 text-muted-foreground italic">Description (optional)</p>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  placeholder="Type your answer here..."
                  rows={4}
                  className="w-full resize-none border-b-2 border-[#1a4fd8]/30 bg-transparent py-2 text-lg text-[#1a4fd8] placeholder:text-[#1a4fd8]/40 focus:border-[#1a4fd8] focus:outline-none"
                  autoFocus
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">Shift ⇧</span> + <span className="font-medium">Enter ↵</span> to make a line break
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "complete" && (
          <motion.div
            key="complete"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-4 text-2xl font-medium text-foreground md:text-3xl">
              {"¡Gracias por tu respuesta!"}
            </h1>
            <p className="text-muted-foreground">
              Hemos recibido tu información y te contactaremos pronto.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {currentStep !== "start" && currentStep !== "complete" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 right-8 flex flex-col items-center gap-2"
        >
          <div className="flex flex-col rounded-md shadow-lg">
            <button
              onClick={handlePrev}
              className="rounded-t-md bg-[#1a4fd8] p-2 text-white transition-colors hover:bg-[#1a4fd8]/90"
              title="Previous"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="rounded-b-md bg-[#1a4fd8] p-2 text-white transition-colors hover:bg-[#1a4fd8]/90 disabled:opacity-50"
              title="Next"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {getStepNumber()} / {getTotalSteps()}
          </span>
        </motion.div>
      )}
    </div>
  )
}
