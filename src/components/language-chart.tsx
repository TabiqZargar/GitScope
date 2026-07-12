"use client"

import { useMemo, useState } from "react"
import type { LanguageBreakdown } from "@/types/github"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Code2 } from "lucide-react"

interface LanguageChartProps {
  languages: LanguageBreakdown
  isLoading: boolean
}

const COLORS = [
  "#a2c9ff",
  "#67df70",
  "#d8baff",
  "#ffb4ab",
  "#c0c7d4",
  "#58a6ff",
  "#3fb950",
  "#bc8cff",
  "#d29922",
  "#f85149",
  "#79c0ff",
  "#ff7b72",
  "#a5d6ff",
  "#7ee787",
  "#ffa657",
  "#d2a8ff",
  "#ffc145",
  "#ff6eb4",
  "#56d364",
  "#e3b341",
]

interface ChartEntry {
  name: string
  value: number
  percentage: string
  color: string
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as ChartEntry
  return (
    <div className="glass-card rounded-xl px-4 py-3 shadow-xl">
      <div className="mb-1 flex items-center gap-2">
        <span className="size-3 rounded-sm" style={{ backgroundColor: d.color }} />
        <p className="text-sm font-medium">{d.name}</p>
      </div>
      <p className="text-xs text-on-surface-variant">
        {d.value.toLocaleString()} bytes &middot; {d.percentage}
      </p>
    </div>
  )
}

export function LanguageChart({ languages, isLoading }: LanguageChartProps) {
  const [hoveredLang, setHoveredLang] = useState<string | null>(null)

  const totalBytes = useMemo(
    () => Object.values(languages).reduce((sum, bytes) => sum + bytes, 0),
    [languages]
  )

  const { chartData, topLanguages } = useMemo(() => {
    if (!Object.keys(languages).length) return { chartData: [] as ChartEntry[], topLanguages: [] as ChartEntry[] }

    const entries: ChartEntry[] = Object.entries(languages)
      .map(([name, value], i) => ({
        name,
        value,
        percentage: ((value / totalBytes) * 100).toFixed(1) + "%",
        color: COLORS[i % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)

    const top = entries.slice(0, 10)

    if (entries.length > 10) {
      const otherBytes = entries.slice(10).reduce((sum, l) => sum + l.value, 0)
      top.push({
        name: "Other",
        value: otherBytes,
        percentage: ((otherBytes / totalBytes) * 100).toFixed(1) + "%",
        color: "#484f58",
      })
    }

    return { chartData: top, topLanguages: top.slice(0, 5) }
  }, [languages, totalBytes])

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="mb-6 flex items-center gap-2">
          <Code2 className="size-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Language Distribution</h3>
        </div>
        <div className="flex h-[360px] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!chartData.length) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="mb-6 flex items-center gap-2">
          <Code2 className="size-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Language Distribution</h3>
        </div>
        <div className="flex h-[360px] items-center justify-center text-sm text-on-surface-variant">
          No language data available
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="mb-6 flex items-center gap-2">
        <Code2 className="size-4 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Language Distribution</h3>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Chart */}
        <div className="mx-auto size-[260px] shrink-0 lg:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={115}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                onMouseEnter={(_, i) => setHoveredLang(chartData[i].name)}
                onMouseLeave={() => setHoveredLang(null)}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={hoveredLang && hoveredLang !== entry.name ? 0.35 : 1}
                    className="transition-all duration-300"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="pointer-events-none -mt-[260px] flex h-[260px] flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">{chartData.length}</span>
            <span className="text-xs text-on-surface-variant">languages</span>
          </div>
        </div>

        {/* Top languages breakdown */}
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-xs font-medium text-on-surface-variant">Top Languages</p>
          {topLanguages.map((lang) => (
            <div
              key={lang.name}
              className="group cursor-default"
              onMouseEnter={() => setHoveredLang(lang.name)}
              onMouseLeave={() => setHoveredLang(null)}
            >
              <div className="mb-1 flex items-center justify-between text-xs">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: lang.color }} />
                  <span className="truncate font-medium">{lang.name}</span>
                </div>
                <span className="shrink-0 tabular-nums text-on-surface-variant">{lang.percentage}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: lang.percentage,
                    backgroundColor: lang.color,
                    opacity: hoveredLang && hoveredLang !== lang.name ? 0.3 : 1,
                  }}
                />
              </div>
            </div>
          ))}
          {chartData.length > 5 && (
            <p className="pt-1 text-[10px] text-on-surface-variant">
              +{chartData.length - 5} more languages
            </p>
          )}
        </div>
      </div>

      {/* Bottom legend chips */}
      <div className="mt-5 flex flex-wrap gap-1.5 border-t border-outline-variant/20 pt-4">
        {chartData.map((lang) => (
          <span
            key={lang.name}
            className={`inline-flex cursor-default items-center gap-1.5 rounded-md px-2 py-1 text-[11px] transition-all ${
              hoveredLang && hoveredLang !== lang.name
                ? "opacity-30"
                : "hover:bg-surface-container-highest/80"
            }`}
            style={{ backgroundColor: `${lang.color}15` }}
            onMouseEnter={() => setHoveredLang(lang.name)}
            onMouseLeave={() => setHoveredLang(null)}
          >
            <span className="size-2 rounded-sm" style={{ backgroundColor: lang.color }} />
            {lang.name}
            <span className="tabular-nums text-on-surface-variant">{lang.percentage}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
