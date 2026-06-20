"use client"

import type { DeveloperInsightsData } from "@/types/github"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InsightCard } from "@/components/insight-card"
import { DeveloperClassification } from "@/components/developer-classification"
import { AISummary } from "@/components/ai-summary"
import { Separator } from "@/components/ui/separator"
import {
  Code2, Star, GitFork, Trophy, Clock, TrendingUp, Activity, Zap,
  Eye, FolderOpen, Archive, GitBranch, BarChart3, Lightbulb,
} from "lucide-react"

interface DeveloperInsightsProps {
  data: DeveloperInsightsData
}

export function DeveloperInsights({ data }: DeveloperInsightsProps) {
  const trendIcons = {
    increasing: <TrendingUp className="size-4 text-green-400" />,
    steady: <Activity className="size-4 text-yellow-400" />,
    decreasing: <Activity className="size-4 text-red-400" />,
    "no data": <Activity className="size-4 text-muted-foreground" />,
  }

  return (
    <div className="space-y-5">
      {/* AI Summary */}
      <AISummary text={data.summary} />

      {/* Classification */}
      <DeveloperClassification type={data.developerType} />

      {/* Metrics Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="size-4 text-primary" />
            Developer Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            <InsightCard
              label="Primary Language"
              value={data.primaryLanguage || "N/A"}
              icon={<Code2 className="size-4 text-primary" />}
            />
            <InsightCard
              label="Total Repositories"
              value={data.totalRepos}
              icon={<FolderOpen className="size-4 text-primary" />}
              subtext={`${data.sourceRepos} source, ${data.forkRepos} forks`}
            />
            <InsightCard
              label="Total Stars"
              value={data.totalStars.toLocaleString()}
              icon={<Star className="size-4 text-yellow-400" />}
            />
            <InsightCard
              label="Total Forks"
              value={data.totalForks.toLocaleString()}
              icon={<GitFork className="size-4 text-blue-400" />}
            />
            <InsightCard
              label="Most Starred Repo"
              value={data.mostStarredRepo?.name || "N/A"}
              icon={<Trophy className="size-4 text-orange-400" />}
              subtext={data.mostStarredRepo ? `${data.mostStarredRepo.stars} stars` : undefined}
            />
            <InsightCard
              label="Account Age"
              value={data.accountAge.label}
              icon={<Clock className="size-4 text-purple-400" />}
            />
            <InsightCard
              label="Avg Stars / Repo"
              value={data.avgStarsPerRepo}
              icon={<TrendingUp className="size-4 text-pink-400" />}
            />
            <InsightCard
              label="Most Recent Activity"
              value={data.mostRecentActive?.name || "N/A"}
              icon={<Activity className="size-4 text-green-400" />}
              subtext={data.mostRecentActive ? new Date(data.mostRecentActive.updated).toLocaleDateString() : undefined}
            />
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-border/50 bg-card/50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Zap className="size-3" /> Languages
              </div>
              <p className="text-sm font-bold">{data.languageCount}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Archive className="size-3" /> Archived
              </div>
              <p className="text-sm font-bold">{data.archivedRepos}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Eye className="size-3" /> Watchers
              </div>
              <p className="text-sm font-bold">{data.totalWatchers.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <BarChart3 className="size-3" /> Open Issues
              </div>
              <p className="text-sm font-bold">{data.totalOpenIssues.toLocaleString()}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Top languages */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">Top Languages</p>
            <div className="space-y-2">
              {data.topLanguages.map((lang) => (
                <div key={lang.name}>
                  <div className="mb-0.5 flex items-center justify-between text-xs">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-muted-foreground">{lang.percentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
