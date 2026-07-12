"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GitCompare, Home, Search, Bell, Settings } from "lucide-react"

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

        <div className="flex items-center gap-4">
          <div className="hidden items-center rounded-full border border-outline-variant/20 bg-surface-container px-4 py-1.5 md:flex">
            <Search className="mr-2 size-[18px] text-on-surface-variant" />
            <input
              className="w-48 bg-transparent p-0 text-sm text-foreground placeholder:text-on-surface-variant focus:ring-0"
              placeholder="Search Engineer..."
              type="text"
            />
          </div>
          <button className="rounded-full p-2 transition-all duration-300 hover:bg-surface-container-highest/50">
            <Bell className="size-5 text-on-surface-variant" />
          </button>
          <button className="rounded-full p-2 transition-all duration-300 hover:bg-surface-container-highest/50">
            <Settings className="size-5 text-on-surface-variant" />
          </button>
          <div className="size-8 overflow-hidden rounded-full border border-primary/30">
            <div className="flex size-full items-center justify-center bg-surface-container-highest text-xs font-medium text-foreground">
              G
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
