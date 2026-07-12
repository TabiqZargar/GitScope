"use client"

import { useMemo } from "react"
import type { GitHubRepo } from "@/types/github"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { GitCommitHorizontal } from "lucide-react"

interface ContributionActivityProps {
  repos: GitHubRepo[]
}

interface ActivityData {
  month: string
  created: number
  updated: number
  pushed: number
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-lg px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs text-on-surface-variant">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export function ContributionActivity({ repos }: ContributionActivityProps) {
  const activityData = useMemo(() => {
    const monthlyMap = new Map<string, { created: number; updated: number; pushed: number }>()

    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      monthlyMap.set(key, { created: 0, updated: 0, pushed: 0 })
    }

    repos.forEach((repo) => {
      const createdKey = new Date(repo.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      })
      const updatedKey = new Date(repo.updated_at).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      })
      const pushedKey = new Date(repo.pushed_at).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      })

      if (monthlyMap.has(createdKey)) {
        monthlyMap.get(createdKey)!.created++
      }
      if (monthlyMap.has(updatedKey)) {
        monthlyMap.get(updatedKey)!.updated++
      }
      if (monthlyMap.has(pushedKey)) {
        monthlyMap.get(pushedKey)!.pushed++
      }
    })

    const data: ActivityData[] = []
    monthlyMap.forEach((value, month) => {
      data.push({ month, ...value })
    })

    return data
  }, [repos])

  if (!activityData.length) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="mb-6 flex items-center gap-2">
          <GitCommitHorizontal className="size-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Repository Activity</h3>
        </div>
        <div className="flex h-[200px] items-center justify-center text-sm text-on-surface-variant">
          No activity data available
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCommitHorizontal className="size-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Repository Activity</h3>
        </div>
        <div className="flex gap-2">
          <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] text-primary">6M</span>
          <span className="rounded bg-surface-container px-2 py-0.5 text-[10px] text-on-surface-variant">1Y</span>
        </div>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activityData} barGap={2} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#31353c" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#8b919d", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#31353c" }}
            />
            <YAxis
              tick={{ fill: "#8b919d", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#31353c" }} />
            <Bar dataKey="created" name="Created" fill="#3fb950" radius={[2, 2, 0, 0]} />
            <Bar dataKey="pushed" name="Pushed" fill="#a2c9ff" radius={[2, 2, 0, 0]} />
            <Bar dataKey="updated" name="Updated" fill="#d29922" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-sm bg-[#3fb950]" /> Created
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-sm bg-[#a2c9ff]" /> Pushed
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-sm bg-[#d29922]" /> Updated
        </span>
      </div>
    </div>
  )
}
