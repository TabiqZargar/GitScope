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

const SUGGESTIONS = ["vercel", "vercel", "shadcn", "tailwindlabs", "vercel"]

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
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-card/80 to-card/30 p-8 md:p-12">
      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 size-48 rounded-full bg-primary/5 blur-[80px]" />

      <div className="relative flex flex-col items-center gap-5">
        {/* Logo section */}
        <div className="animate-float flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-primary/20 blur-md animate-glow-pulse" />
            <div className="relative flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/30">
              <svg className="size-7 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Git<span className="text-primary">Scope</span>
            </h1>
            <p className="text-xs text-muted-foreground">GitHub Profile Analyzer</p>
          </div>
        </div>

        <p className="max-w-lg text-center text-sm text-muted-foreground">
          Enter any GitHub username to unlock a deep analytics dashboard — explore repos, languages, contribution patterns, and key developer metrics.
        </p>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 pl-9 text-base transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </div>
          <Button type="submit" disabled={isLoading || !username.trim()} className="h-11 px-6">
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </form>

        {/* Popular suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-muted-foreground/30" />
            Popular:
          </span>
          {["vercel", "shadcn", "tailwindlabs", "facebook", "microsoft"].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                setUsername(name)
                onSearch(name)
              }}
              disabled={isLoading}
              className="rounded-md border border-border/50 bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground hover:bg-secondary disabled:opacity-50"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
