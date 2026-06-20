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
  const totalWatchers = repos.reduce((sum, r) => sum + r.watchers_count, 0)

  const stats = [
    {
      label: "Total Stars",
      value: totalStars.toLocaleString(),
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: "Total Forks",
      value: totalForks.toLocaleString(),
      icon: GitFork,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Languages",
      value: languages.size.toLocaleString(),
      icon: Code2,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Total Size",
      value: `${(totalSize / 1024).toFixed(1)} MB`,
      icon: Database,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Avg Stars/Repo",
      value: avgStars,
      icon: TrendingUp,
      color: "text-pink-400",
      bg: "bg-pink-400/10",
    },
    {
      label: "Top Starred",
      value: topStarred.toLocaleString(),
      icon: Activity,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="transition-all hover:ring-1 hover:ring-primary/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`size-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              <p className="text-lg font-bold tabular-nums">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
