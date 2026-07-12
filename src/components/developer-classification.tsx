"use client"

import type { DeveloperType } from "@/types/github"
import { Badge } from "@/components/ui/badge"
import { Monitor, Server, LayoutGrid, Smartphone, Database, Code2 } from "lucide-react"

interface DeveloperClassificationProps {
  type: DeveloperType
}

const config: Record<DeveloperType, { icon: typeof Code2; color: string; bg: string; description: string }> = {
  "Frontend Developer": {
    icon: Monitor,
    color: "text-primary",
    bg: "bg-primary/10",
    description: "Specializes in building user interfaces and client-side applications",
  },
  "Backend Developer": {
    icon: Server,
    color: "text-tertiary",
    bg: "bg-tertiary/10",
    description: "Focuses on server-side logic, APIs, and infrastructure",
  },
  "Full Stack Developer": {
    icon: LayoutGrid,
    color: "text-secondary",
    bg: "bg-secondary/10",
    description: "Works across both frontend and backend technologies",
  },
  "Mobile Developer": {
    icon: Smartphone,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    description: "Develops applications for mobile platforms",
  },
  "Data Developer": {
    icon: Database,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    description: "Works with data analysis, ML, and data pipelines",
  },
  "Generalist Developer": {
    icon: Code2,
    color: "text-on-surface-variant",
    bg: "bg-surface-container",
    description: "Works across a diverse range of technologies",
  },
}

export function DeveloperClassification({ type }: DeveloperClassificationProps) {
  const c = config[type]

  return (
    <div className="glass-card flex items-center gap-3 rounded-xl p-4">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${c.bg}`}>
        <c.icon className={`size-5 ${c.color}`} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Developer Type</p>
          <Badge variant="outline" className="text-[10px]">{type.split(" ")[0]}</Badge>
        </div>
        <p className="mt-0.5 text-xs text-on-surface-variant">{c.description}</p>
        <p className="mt-1 text-sm font-semibold">{type}</p>
      </div>
    </div>
  )
}
