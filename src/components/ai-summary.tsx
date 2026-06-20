"use client"

import { Sparkles } from "lucide-react"

interface AIStatusSummaryProps {
  text: string
  isLoading?: boolean
}

export function AISummary({ text, isLoading }: AIStatusSummaryProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/50 bg-gradient-to-r from-primary/5 to-accent/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-secondary" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-4 transition-all hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-primary mb-1">AI Overview</p>
          <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
        </div>
      </div>
    </div>
  )
}
