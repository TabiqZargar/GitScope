"use client"

import { useMemo } from "react"
import type { GitHubRepo } from "@/types/github"
import type { GitHubUser } from "@/types/github"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Lightbulb,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  GitBranch,
  Star,
  GitFork,
  Zap,
  Eye,
} from "lucide-react"

interface DeveloperInsightsProps {
  user: GitHubUser
  repos: GitHubRepo[]
}

export function DeveloperInsights({ user, repos }: DeveloperInsightsProps) {
  const insights = useMemo(() => {
    const sourceRepos = repos.filter((r) => !r.fork)
    const forkRepos = repos.filter((r) => r.fork)
    const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
    const totalForks = repos.reduce((s, r) => s + r.forks_count, 0)

    const oldestRepo = [...repos].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )[0]

    const mostStarred = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0]
    const mostForked = [...repos].sort((a, b) => b.forks_count - a.forks_count)[0]

    const languages = new Set(repos.map((r) => r.language).filter(Boolean))
    const mostUsedLang = [...languages].slice(0, 3)

    const totalWatchers = repos.reduce((s, r) => s + r.watchers_count, 0)

    return {
      sourceReposCount: sourceRepos.length,
      forkReposCount: forkRepos.length,
      totalStars,
      totalForks,
      oldestRepo,
      mostStarred,
      mostForked,
      mostUsedLang,
      totalWatchers,
      avgStarsPerRepo: repos.length > 0 ? (totalStars / repos.length).toFixed(1) : "0",
      forkRatio: sourceRepos.length > 0 ? (forkRepos.length / sourceRepos.length).toFixed(2) : "0",
    }
  }, [repos])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="size-4 text-primary" />
          Developer Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="size-3" />
              Source vs Forks
            </div>
            <p className="text-lg font-bold">
              {insights.sourceReposCount}
              <span className="text-sm font-normal text-muted-foreground"> / </span>
              {insights.forkReposCount}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Ratio: {insights.forkRatio}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Award className="size-3" />
              Most Starred
            </div>
            <p className="text-sm font-medium truncate" title={insights.mostStarred?.name}>
              {insights.mostStarred?.name || "N/A"}
            </p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Star className="size-2.5" />
              {insights.mostStarred?.stargazers_count || 0}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <GitBranch className="size-3" />
              Most Forked
            </div>
            <p className="text-sm font-medium truncate" title={insights.mostForked?.name}>
              {insights.mostForked?.name || "N/A"}
            </p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <GitFork className="size-2.5" />
              {insights.mostForked?.forks_count || 0}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3" />
              Oldest Repo
            </div>
            <p className="text-sm font-medium truncate" title={insights.oldestRepo?.name}>
              {insights.oldestRepo?.name || "N/A"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {insights.oldestRepo
                ? new Date(insights.oldestRepo.created_at).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BarChart3 className="size-3" />
              Top Languages
            </div>
            <div className="flex flex-wrap gap-1">
              {insights.mostUsedLang.length > 0 ? (
                insights.mostUsedLang.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No data</span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star className="size-3" />
              Avg Stars/Repo
            </div>
            <p className="text-lg font-bold">{insights.avgStarsPerRepo}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="size-3" />
              Total Watchers
            </div>
            <p className="text-lg font-bold">{insights.totalWatchers.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="size-3" />
              Open Issues
            </div>
            <p className="text-lg font-bold">
              {repos.reduce((s, r) => s + r.open_issues_count, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
