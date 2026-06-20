"use client"

import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface InsightCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: "up" | "down" | "neutral"
  subtext?: string
}

export function InsightCard({ label, value, icon, trend, subtext }: InsightCardProps) {
  return (
    <Card className="transition-all hover:ring-1 hover:ring-primary/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="mt-1 text-lg font-bold tabular-nums truncate">{value}</p>
            {subtext && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{subtext}</p>
            )}
          </div>
          <div className="ml-3 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/80">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
