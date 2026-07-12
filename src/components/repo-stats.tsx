"use client"

import type { GitHubRepo } from "@/types/github"
import { calculateTotalStars, calculateTotalForks, getTopRepos } from "@/lib/github"
import { Card, CardContent } from "@/components/ui/card"
import { Star, GitFork, Code2, Database, TrendingUp, Activity } from "lucide-react"

interface RepoStatsProps {
  repos: GitHubRepo[]
}

export function RepoStats({ repos }: RepoStatsProps) {
  const totalStars = calculateTotalStars(repos)
  const totalForks = calculateTotalForks(repos)
  const totalSize = repos.reduce((sum, r) => sum + r.size, 0)
  const languages = new Set(repos.map((r) => r.language).filter(Boolean))
  const topRepos = getTopRepos(repos)
  const avgStars = repos.length > 0 ? (totalStars / repos.length).toFixed(1) : "0"
  const topStarred = topRepos[0]?.stargazers_count || 0

  const stats = [
    {
      label: "Total Stars",
      value: totalStars.toLocaleString(),
      icon: Star,
      color: "text-primary",
      bg: "bg-primary/10",
      sparkline: "M0 25 L10 20 L20 28 L30 15 L40 18 L50 10 L60 12",
    },
    {
      label: "Fork Count",
      value: totalForks.toLocaleString(),
      icon: GitFork,
      color: "text-secondary",
      bg: "bg-secondary/10",
      sparkline: "M0 28 L10 22 L20 18 L30 20 L40 12 L50 15 L60 8",
    },
    {
      label: "Languages",
      value: languages.size.toLocaleString(),
      icon: Code2,
      color: "text-tertiary",
      bg: "bg-tertiary/10",
      sparkline: "M0 10 L10 25 L20 12 L30 18 L40 22 L50 14 L60 10",
    },
    {
      label: "Total Size",
      value: `${(totalSize / 1024).toFixed(1)} MB`,
      icon: Database,
      color: "text-accent",
      bg: "bg-accent/10",
      sparkline: null,
    },
    {
      label: "Avg Stars/Repo",
      value: avgStars,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
      sparkline: null,
    },
    {
      label: "Top Starred",
      value: topStarred.toLocaleString(),
      icon: Activity,
      color: "text-tertiary",
      bg: "bg-tertiary/10",
      sparkline: null,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="glass-card rounded-xl border-0 p-5">
          <CardContent className="p-0">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{stat.label}</span>
              <div className={`flex size-9 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <span className="flex items-center gap-1 text-sm text-tertiary">
                  <TrendingUp className="size-4" /> +12%
                </span>
              </div>
              {stat.sparkline && (
                <svg className="size-16 overflow-visible">
                  <path className="text-primary" d={stat.sparkline} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
