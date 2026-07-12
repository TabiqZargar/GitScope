"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"




export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-4 z-50 mx-auto w-[95%] max-w-7xl">
      <div className="flex h-14 items-center justify-between rounded-full border border-outline-variant/30 bg-surface/80 px-6 shadow-xl shadow-primary/5 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="font-bold tracking-tighter text-primary" style={{ fontSize: "24px", lineHeight: "32px" }}>
              Git<span className="text-foreground">Scope</span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "border-b-2 border-primary pb-1 font-bold text-primary"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/compare"
              className={`text-sm font-medium transition-colors ${
                pathname === "/compare"
                  ? "border-b-2 border-primary pb-1 font-bold text-primary"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              Compare
            </Link>
          </div>
        </div>

      </div>
    </nav>
  )
}
