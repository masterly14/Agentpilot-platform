import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { DashedGrid } from "./dashed-grid"

const CEO_PHOTO_URL =
  "https://3auasoi81o.ucarecd.net/bb605086-50c5-4a5c-bdc0-cf5cba44620b/IMG_0758.png"

export function DesignsFlowSection() {
  return (
    <DashedGrid maxWidth="6xl">
      <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center md:mb-12">
        <h2 className="text-3xl font-light text-foreground md:text-5xl">
          Como obtienes tu <span className="font-serif italic">sistema?</span>
        </h2>
        <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-xl">
              Todas las comunicaciones se realizarán a través de WhatsApp para mantener las cosas fluidas y organizadas. No hay herramientas complicadas, solo una colaboración simple y efectiva.
        </p>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-100 backdrop-blur-xl dark:bg-zinc-800/50 md:h-32 md:w-32">
            <svg className="h-12 w-12 text-zinc-700 dark:text-zinc-300 md:h-16 md:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <ArrowRight className="h-8 w-8 rotate-90 text-muted-foreground md:rotate-0" />

          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-100 backdrop-blur-xl dark:bg-zinc-800/50 md:h-32 md:w-32">
              <svg className="h-12 w-12 text-zinc-700 dark:text-zinc-300 md:h-16 md:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-xs font-medium text-white dark:bg-zinc-300 dark:text-zinc-900">
              FIG
            </div>
          </div>
        </div>
      </div>
    </DashedGrid>
  )
}

export function TestimonialSection() {
  return (
    <DashedGrid maxWidth="5xl">
      <div className="relative mx-auto max-w-5xl">
        <div className="absolute right-2 top-0 font-serif text-5xl leading-none text-muted-foreground/30 md:right-6 md:text-8xl">
          &ldquo;
        </div>
        <div className="space-y-6 rounded-3xl border border-border/50 bg-gradient-to-b from-[#0D0D0F] to-[#141417] p-6 md:space-y-8 md:p-12">
          <p className="max-w-3xl text-base leading-relaxed text-foreground md:text-xl lg:text-2xl">
            Entiende a detalle las 3 etapas de la creación del software
          </p>

          <div className="overflow-hidden rounded-2xl border border-border/50">
            <div className="relative h-0 pb-[56.25%]">
              <iframe
                className="absolute left-0 top-0 h-full w-full border-0"
                src="https://www.tella.tv/video/vid_cmqmgzflj006k0bjfg3vb9l93/embed?b=1&title=1&a=1&loop=0&t=0&muted=0&wt=1&o=1"
                title="Video: 3 etapas de la creación del software"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Image
              src={CEO_PHOTO_URL}
              alt="Santiago Cano Varón"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold text-foreground">Santiago Cano Varón</p>
              <p className="text-muted-foreground">CEO &amp; Founder</p>
            </div>
          </div>        </div>
      </div>
    </DashedGrid>
  )
}
