import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center px-4">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Santiago Varón
          </span>
        </Link>
      </div>
    </header>
  )
}
