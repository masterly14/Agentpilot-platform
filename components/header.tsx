import Link from "next/link"

export function Header() {
  return (
    <header className="relative z-50 w-full border-b border-foreground/10 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6 md:px-10">
        <Link href="/" className="group flex items-center">
          <span
            className="text-xl font-black uppercase tracking-widest text-foreground transition-opacity group-hover:opacity-70"
            style={{ fontFamily: "var(--font-barlow, 'Barlow Condensed', sans-serif)", letterSpacing: "0.12em" }}
          >
            Santiago Varón
          </span>
        </Link>
        <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground md:block">
          Desarrollo de Software
        </span>
      </div>
    </header>
  )
}
