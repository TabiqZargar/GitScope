"use client"

import { Sparkles } from "lucide-react"

interface AIStatusSummaryProps {
  text: string
  isLoading?: boolean
}

export function AISummary({ text, isLoading }: AIStatusSummaryProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-xl border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-surface-container-highest" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-surface-container-highest" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-surface-container-highest" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl border-primary/10 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-4 transition-all hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">AI Overview</p>
          <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
        </div>
      </div>
    </div>
  )
}
