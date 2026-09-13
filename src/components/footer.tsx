import Link from "next/link"
import { Mail } from "lucide-react"

const SUPPORT_EMAIL = "zargartabiq@gmail.com"

export function Footer() {
  return (
    <footer className="mx-auto w-[95%] max-w-7xl px-gutter pb-8">
      <div className="flex flex-col items-center justify-between gap-4 rounded-[20px] border border-outline-variant/30 bg-surface/50 px-6 py-6 backdrop-blur-md md:flex-row">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="font-bold tracking-tighter text-primary">
            Git<span className="text-foreground">Scope</span>
          </span>
        </Link>
        <p className="text-sm text-on-surface-variant">© 2026 GitScope. Built for the developer community.</p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="group flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-primary"
          aria-label="Contact GitScope support"
        >
          <Mail className="size-4 text-primary transition-transform group-hover:scale-110" />
          {SUPPORT_EMAIL}
        </a>
      </div>
    </footer>
  )
}