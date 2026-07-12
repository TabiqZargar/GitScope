"use client"

import { useState, type FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, Star } from "lucide-react"

interface SearchBarProps {
  onSearch: (username: string) => void
  isLoading: boolean
  initialUsername?: string
}

export function SearchBar({ onSearch, isLoading, initialUsername = "" }: SearchBarProps) {
  const [username, setUsername] = useState(initialUsername)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  return (
    <div className="relative px-4">
      <div
        className="relative rounded-[40px] border border-outline-variant/20 bg-surface-container-low/40 p-12 backdrop-blur-xl group dot-grid"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(162, 201, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      >
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <Search className="absolute left-4 size-5 text-on-surface-variant" />
          <Input
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { handleSubmit(e); } }}
            className="h-14 flex-1 rounded-l-2xl border border-outline-variant/30 bg-surface-container-highest/50 pl-12 pr-4 text-base text-foreground placeholder:text-outline outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
          />
          <Button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="h-14 rounded-r-2xl border border-l-0 border-outline-variant/30 bg-primary px-6 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
          >
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="mr-2 self-center text-xs font-semibold uppercase tracking-wider text-outline">
            Quick Access:
          </span>
          {["vercel/next.js", "shadcn/ui", "tailwindlabs/tailwindcss", "facebook/react"].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                const u = name.split("/")[0]
                setUsername(u)
                onSearch(u)
              }}
              disabled={isLoading}
              className="rounded-full border border-outline-variant/20 bg-surface-container px-4 py-1.5 text-sm text-on-surface-variant transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
