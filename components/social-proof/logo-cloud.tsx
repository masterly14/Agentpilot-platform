"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { cn } from "@/lib/utils"
import { LOGOS } from "./content"

export function LogoCloud() {
  return (
    <section id="clientes" className="scroll-mt-8">
      <DashedGrid gridId="sp-logos" maxWidth="5xl" padding="px-4 py-12 md:px-6 md:py-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center text-xs uppercase tracking-[0.28em] text-zinc-500"
        >
          Operaciones que ya corren solas
        </motion.p>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-800/70 bg-zinc-800/50 sm:grid-cols-3 lg:grid-cols-5">
          {LOGOS.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex h-32 items-center justify-center bg-black px-5 sm:h-36 sm:px-8"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.10), transparent 68%)",
                }}
              />
              <Image
                src={logo.src}
                alt={logo.name}
                width={200}
                height={120}
                className={cn(
                  "relative max-h-[72%] max-w-[78%] object-contain opacity-55 transition-all duration-300 group-hover:opacity-100 group-hover:scale-[1.04]",
                  logo.className
                )}
              />
            </motion.div>
          ))}
        </div>
      </DashedGrid>
    </section>
  )
}
