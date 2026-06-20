import Image from "next/image"

const designs = Array.from({ length: 10 }, (_, i) => ({
  src: `/landing/ds${i + 1}.png`,
  alt: `Design ${i + 1}`,
}))

export function DesignMarquee() {
  const items = [...designs, ...designs]

  return (
    <section className="overflow-hidden bg-transparent py-8 md:py-12">
      <div className="group relative m-auto w-full">
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-scroll flex w-max gap-4 md:gap-6">
            {items.map((design, index) => (
              <div key={`${design.alt}-${index}`} className="flex items-center justify-center">
                <div className="marquee-card-hover relative w-[min(90vw,420px)] overflow-hidden rounded-xl border border-border/50 bg-muted/30 shadow-lg transition-transform sm:w-[420px]">
                  <Image
                    src={design.src}
                    alt={design.alt}
                    width={700}
                    height={600}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
