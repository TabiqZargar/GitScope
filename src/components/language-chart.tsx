"use client"

import { useMemo } from "react"
import type { LanguageBreakdown } from "@/types/github"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Code2 } from "lucide-react"

interface LanguageChartProps {
  languages: LanguageBreakdown
  isLoading: boolean
}

const COLORS = [
  "#58a6ff",
  "#3fb950",
  "#d29922",
  "#f85149",
  "#bc8cff",
  "#79c0ff",
  "#ff7b72",
  "#a5d6ff",
  "#7ee787",
  "#ffa657",
  "#d2a8ff",
  "#ffc145",
  "#ff6eb4",
  "#79c0ff",
  "#56d364",
  "#e3b341",
  "#fb8532",
  "#959da5",
  "#dbedff",
  "#f97583",
]

interface CustomTooltipProps {
  active?: boolean
  payload?: { name: string; value: number; payload: { percentage: string } }[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const data = payload[0]
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-sm font-medium">{data.name}</p>
      <p className="text-xs text-muted-foreground">
        {data.value.toLocaleString()} bytes ({data.payload.percentage})
      </p>
    </div>
  )
}

export function LanguageChart({ languages, isLoading }: LanguageChartProps) {
  const totalBytes = useMemo(
    () => Object.values(languages).reduce((sum, bytes) => sum + bytes, 0),
    [languages]
  )

  const chartData = useMemo(() => {
    if (!Object.keys(languages).length) return []

    const entries = Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        value: bytes,
        percentage: ((bytes / totalBytes) * 100).toFixed(1) + "%",
      }))
      .sort((a, b) => b.value - a.value)

    const topLanguages = entries.slice(0, 10)

    if (entries.length > 10) {
      const otherBytes = entries.slice(10).reduce((sum, l) => sum + l.value, 0)
      topLanguages.push({
        name: "Other",
        value: otherBytes,
        percentage: ((otherBytes / totalBytes) * 100).toFixed(1) + "%",
      })
    }

    return topLanguages
  }, [languages, totalBytes])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="size-4 text-primary" />
            Language Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="size-4 text-primary" />
            Language Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            No language data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="size-4 text-primary" />
          Language Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 pt-2">
                    {payload?.map((entry, index) => (
                      <div key={entry.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                          className="size-2.5 rounded-sm"
                          style={{ backgroundColor: entry.color }}
                        />
                        {entry.value}
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
