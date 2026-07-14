"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ChevronDown, X } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { scrollToSection } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    id: "basic",
    name: "Setup Básico",
    price: "$5,000 USD",
    maintenance: "$120 USD/mes",
    modulesCount: 11,
    description: "Para administradores pequeños o con pocas propiedades.",
    features: [
      { name: "Automatización de reservas", included: true },
      { name: "Organización de calendario de propiedades", included: true },
      { name: "Dashboard Básico", included: true },
      { name: "Gestión de ocupación", included: true },
      { name: "HouseKeeping Básico", included: true },
      { name: "Chatbot WhatsApp", included: true },
      { name: "Página web sincronizada", included: true },
      { name: "Infraestructura de pagos", included: true },
      { name: "Gestión de documentación del Guest-report con entidades", included: true },
      { name: "Comunicación con Airbnb", included: true },
      { name: "Gestión de gastos", included: true },
      { name: "Sincronización con sistema contable externo", included: false },
      { name: "Asistente para administración", included: false },
      { name: "Reportes a propietarios y proveedores a final de mes", included: false },
      { name: "Sincronización con Booking", included: false },
      { name: "HouseKeeping Integral", included: false },
      { name: "Chatbot Airbnb", included: false },
      { name: "Gestión de equipo", included: false },
    ],
    support: [
      "Capacitación durante 2 meses",
      "Soporte con Tickets",
      "Módulos grabados",
    ],
    paymentSchedule: [
      { label: "Día 1", amount: "$2,500" },
      { label: "Mes 2", amount: "$1,250" },
      { label: "Mes 4", amount: "$1,250" },
    ],
    isPopular: false,
  },
  {
    id: "pro",
    name: "Centralizar",
    price: "$7,500 USD",
    maintenance: "$120 USD/mes",
    modulesCount: 13,
    description: "Para empresas en crecimiento que necesitan más control.",
    features: [
      { name: "Automatización de reservas", included: true },
      { name: "Organización de calendario de propiedades", included: true },
      { name: "Dashboard Operativo", included: true },
      { name: "Gestión de ocupación", included: true },
      { name: "HouseKeeping Integral", included: true },
      { name: "Chatbot Airbnb", included: true },
      { name: "Chatbot WhatsApp", included: true },
      { name: "Página web sincronizada", included: true },
      { name: "Infraestructura de pagos", included: true },
      { name: "Gestión de documentación del Guest-report con entidades", included: true },
      { name: "Comunicación con Airbnb", included: true },
      { name: "Gestión de equipo", included: true },
      { name: "Gestión de gastos", included: true },
      { name: "Sincronización con sistema contable externo", included: true },
      { name: "Asistente para administración", included: false },
      { name: "Reportes a propietarios y proveedores a final de mes", included: false },
      { name: "Sincronización con Booking", included: false },
    ],
    support: [
      "Capacitación ilimitada con cada miembro durante 1 año",
      "Soporte 24/7",
      "Módulos grabados",
    ],
    paymentSchedule: [
      { label: "Día 1", amount: "$3,750" },
      { label: "Mes 2", amount: "$1,875" },
      { label: "Mes 4", amount: "$1,875" },
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Escalar",
    price: "$10,000 USD",
    maintenance: "$120 USD/mes",
    modulesCount: 16,
    description: "La solución completa para escalar tu operación al máximo nivel.",
    features: [
      { name: "Automatización de reservas", included: true },
      { name: "Organización de calendario de propiedades", included: true },
      { name: "Dashboard Operativo y Business Intelligence", included: true },
      { name: "Gestión de ocupación", included: true },
      { name: "HouseKeeping Integral", included: true },
      { name: "Chatbot Airbnb", included: true },
      { name: "Chatbot WhatsApp", included: true },
      { name: "Página web sincronizada", included: true },
      { name: "Infraestructura de pagos", included: true },
      { name: "Gestión de documentación del Guest-report con entidades", included: true },
      { name: "Comunicación con Airbnb", included: true },
      { name: "Gestión de equipo", included: true },
      { name: "Gestión de gastos", included: true },
      { name: "Sincronización con sistema contable externo", included: true },
      { name: "Asistente para administración", included: true },
      { name: "Reportes a propietarios y proveedores a final de mes", included: true },
      { name: "Sincronización con Booking", included: true },
    ],
    support: [
      "Capacitación ilimitada con cada miembro durante 1 año",
      "Soporte 24/7",
      "Módulos grabados",
    ],
    paymentSchedule: [
      { label: "Día 1", amount: "$5,000" },
      { label: "Mes 3", amount: "$1,700" },
      { label: "Mes 4", amount: "$1,700" },
      { label: "Mes 5", amount: "$1,600" },
    ],
    isPopular: false,
  },
]

export default function CozyApartmentsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("pro")

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <DashedGrid gridId="cozy-hero" padding="p-0" contentClassName="flex flex-col">
        <div className="flex flex-col items-center px-4 pb-16 pt-24 text-center md:px-0 md:pb-24 md:pt-32">
          <Image
            src="/logos_rgb-01-1.png"
            alt="Cozy Apartments"
            width={220}
            height={80}
            priority
            className="mb-10 h-auto w-40 sm:w-48 md:w-56"
          />

          <div className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-4 py-2 mb-8">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
            <span className="text-sm text-muted-foreground">Propuesta exclusiva para Cozy Apartments</span>
          </div>

          <h1 className="bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 bg-clip-text text-4xl font-light leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl dark:from-zinc-400 dark:via-zinc-200 dark:to-zinc-500 mb-6">
            Infraestructura de IA para
            <br />
            <span className="font-serif italic font-normal text-white">Cozy</span> Apartments
          </h1>
          
          <p className="max-w-2xl text-base text-muted-foreground md:text-xl lg:text-2xl mb-12">
            Hemos diseñado tres planes de implementación para centralizar y automatizar la operación de Cozy Apartments. Cada uno cuenta con integraciones y alcances diferentes. 
          </p>
          
          <button
            type="button"
            onClick={() => scrollToSection("pricing-plans")}
            aria-label="Ver planes"
            className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900/40 text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-800/70 hover:text-white animate-scroll-button-pulse motion-reduce:animate-none"
          >
            <span className="relative flex h-7 w-7 flex-col items-center justify-center">
              <ChevronDown
                className="absolute h-5 w-5 animate-scroll-arrow motion-reduce:animate-none"
                style={{ animationDelay: "0ms" }}
              />
              <ChevronDown
                className="absolute h-5 w-5 animate-scroll-arrow motion-reduce:animate-none"
                style={{ animationDelay: "350ms" }}
              />
            </span>
          </button>
        </div>
      </DashedGrid>

      <div id="pricing-plans" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Selector de planes para móvil/tablet */}
        <div className="mb-12 flex justify-center lg:hidden">
          <div className="inline-flex w-full max-w-md flex-col space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "relative flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  selectedPlan === plan.id
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                {plan.name}
                {plan.isPopular && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de planes */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-3xl border p-8 transition-all duration-300",
                // En móvil/tablet, solo mostramos el plan seleccionado
                selectedPlan !== plan.id ? "hidden lg:flex" : "flex",
                plan.isPopular
                  ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/10 to-transparent shadow-2xl shadow-cyan-500/10 lg:-translate-y-4"
                  : "border-zinc-800 bg-zinc-900/30",
                plan.id === "basic" ? "opacity-90 lg:scale-95" : ""
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                  Plan recomendado
                </div>
              )}

              <div className="mb-8">
                <h3 className={cn(
                  "text-xl font-medium",
                  plan.id === "basic" ? "text-zinc-400" : "text-white"
                )}>{plan.name}</h3>
                <p className="mt-2 text-sm text-zinc-400 min-h-[40px]">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className={cn(
                    "text-4xl font-bold tracking-tight",
                    plan.id === "basic" ? "text-zinc-300" : "text-white"
                  )}>{plan.price}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-cyan-400">
                  + {plan.maintenance} Mantenimiento
                </p>
              </div>

              <div className="mb-8 rounded-2xl border border-zinc-800 bg-black/50 p-5">
                <h4 className="mb-4 text-sm font-medium text-zinc-300">Plan de pagos</h4>
                <div className="space-y-3">
                  {plan.paymentSchedule.map((payment, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                      <span className="text-sm text-zinc-400">{payment.label}</span>
                      <span className="text-sm font-medium text-white">{payment.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8 rounded-2xl border border-zinc-800 bg-black/50 p-5">
                <h4 className="mb-4 text-sm font-medium text-zinc-300">Soporte y Capacitación</h4>
                <ul className="space-y-3">
                  {plan.support.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-4 w-4 shrink-0 text-cyan-500 mt-0.5" />
                      <span className="text-sm text-zinc-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-zinc-300">Módulos incluidos</h4>
                  <span className="inline-flex items-center justify-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                    {plan.modulesCount} módulos
                  </span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-4 w-4 shrink-0 text-white mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-zinc-700 mt-0.5" />
                      )}
                      <span className={cn(
                        "text-sm",
                        feature.included ? "text-zinc-300" : "text-zinc-600 line-through"
                      )}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
