"use client"

import type { ReactNode } from "react"

interface InsightCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: "up" | "down" | "neutral"
  subtext?: string
}

export function InsightCard({ label, value, icon, trend, subtext }: InsightCardProps) {
  return (
    <div className="glass-card rounded-xl p-4 transition-all">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{label}</p>
          <p className="mt-1 truncate text-lg font-bold tabular-nums">{value}</p>
          {subtext && (
            <p className="mt-0.5 text-[10px] text-on-surface-variant">{subtext}</p>
          )}
        </div>
        <div className="ml-3 flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-container">
          {icon}
        </div>
      </div>
    </div>
  )
}
