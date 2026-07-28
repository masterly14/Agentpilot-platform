"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { animate, motion, useInView } from "framer-motion"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const EASE_OUT = [0.22, 1, 0.36, 1] as const

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
}

export function Reveal({ children, className, delay = 0, y = 28, duration = 0.75 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

type SectionHeadingProps = {
  eyebrow?: string
  titleLead: string
  titleAccent?: string
  description?: string
  align?: "center" | "left"
  className?: string
}

export function SectionHeading({
  eyebrow,
  titleLead,
  titleAccent,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <Reveal>
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground",
              align === "center" ? "mx-auto" : ""
            )}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500" />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}

      <Reveal delay={0.08}>
        <h2 className="text-balance bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-3xl font-light leading-[1.15] tracking-tight text-transparent md:text-5xl">
          {titleLead}
          {titleAccent ? (
            <>
              {" "}
              <span className="font-serif italic text-white">{titleAccent}</span>
            </>
          ) : null}
        </h2>
      </Reveal>

      {description ? (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "text-pretty text-base leading-relaxed text-muted-foreground md:text-lg",
              align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}

type GlowCardProps = {
  children: ReactNode
  className?: string
  glowColor?: string
}

export function GlowCard({
  children,
  className,
  glowColor = "rgba(6, 182, 212, 0.14)",
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pointer, setPointer] = useState({ x: -300, y: -300 })

  return (
    <div
      ref={ref}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        setPointer({ x: event.clientX - bounds.left, y: event.clientY - bounds.top })
      }}
      onMouseLeave={() => setPointer({ x: -300, y: -300 })}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-[#0D0D0F] to-[#141417] transition-colors duration-300 hover:border-zinc-700",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(380px circle at ${pointer.x}px ${pointer.y}px, ${glowColor}, transparent 65%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

type AnimatedNumberProps = {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.8,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(latest),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  const formatted = display.toLocaleString("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

type MediaSlotProps = {
  src?: string
  alt: string
  label?: string
  aspect?: string
  rounded?: string
  className?: string
  imageClassName?: string
  sizes?: string
  priority?: boolean
  hidePlaceholderContent?: boolean
  children?: ReactNode
}

/**
 * Marco de imagen que funciona como placeholder mientras no exista el asset.
 * Al recibir `src` renderiza la imagen real sin cambiar el layout.
 */
export function MediaSlot({
  src,
  alt,
  label,
  aspect = "aspect-video",
  rounded = "rounded-2xl",
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  hidePlaceholderContent = false,
  children,
}: MediaSlotProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-zinc-800/80 bg-zinc-950",
        aspect,
        rounded,
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.10),transparent_55%)]" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 10px)",
            }}
          />
          {hidePlaceholderContent ? null : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-zinc-700 bg-zinc-900/70">
                <ImageIcon className="h-4 w-4 text-zinc-500" />
              </span>
              <span className="text-xs font-medium text-zinc-500">{label ?? alt}</span>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

type AvatarSlotProps = {
  src?: string
  name: string
  size?: number
  className?: string
}

export function AvatarSlot({ src, name, size = 48, className }: AvatarSlotProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full border border-zinc-700/80 bg-zinc-900",
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={`${size}px`}
          className="object-cover object-[center_18%]"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs font-medium text-zinc-500">
          {initials}
        </span>
      )}
    </div>
  )
}

type CtaButtonProps = {
  href: string
  children: ReactNode
  variant?: "primary" | "ghost"
  className?: string
}

export function CtaButton({ href, children, variant = "primary", className }: CtaButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-7 text-sm font-medium transition-all duration-300",
        variant === "primary"
          ? "bg-white text-black hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.45)]"
          : "border border-zinc-700 text-zinc-200 hover:border-zinc-400 hover:text-white",
        className
      )}
    >
      {variant === "primary" ? (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      ) : null}
      <span className="relative flex items-center gap-2">{children}</span>
    </a>
  )
}
