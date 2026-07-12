"use client"

import type { DeveloperInsightsData } from "@/types/github"
import { InsightCard } from "@/components/insight-card"
import { DeveloperClassification } from "@/components/developer-classification"
import { AISummary } from "@/components/ai-summary"
import {
  Code2, Star, GitFork, Trophy, Clock, TrendingUp, Activity, Zap,
  Eye, FolderOpen, Archive, GitBranch, BarChart3, Lightbulb,
} from "lucide-react"

interface DeveloperInsightsProps {
  data: DeveloperInsightsData
}

export function DeveloperInsights({ data }: DeveloperInsightsProps) {
  const trendIcons = {
    increasing: <TrendingUp className="size-4 text-tertiary" />,
    steady: <Activity className="size-4 text-yellow-400" />,
    decreasing: <Activity className="size-4 text-destructive" />,
    "no data": <Activity className="size-4 text-on-surface-variant" />,
  }

  return (
    <div className="space-y-5">
      {/* AI Summary */}
      <AISummary text={data.summary} />

      {/* Classification */}
      <DeveloperClassification type={data.developerType} />

      {/* Metrics Grid */}
      <div className="glass-card rounded-xl p-6">
        <div className="mb-5 flex items-center gap-2">
          <Lightbulb className="size-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Developer Insights</h3>
        </div>

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
            icon={<GitFork className="size-4 text-secondary" />}
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
            icon={<Activity className="size-4 text-tertiary" />}
            subtext={data.mostRecentActive ? new Date(data.mostRecentActive.updated).toLocaleDateString() : undefined}
          />
        </div>

        <div className="my-4 h-px bg-outline-variant/20" />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low/50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Zap className="size-3" /> Languages
            </div>
            <p className="text-sm font-bold">{data.languageCount}</p>
          </div>
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low/50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Archive className="size-3" /> Archived
            </div>
            <p className="text-sm font-bold">{data.archivedRepos}</p>
          </div>
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low/50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Eye className="size-3" /> Watchers
            </div>
            <p className="text-sm font-bold">{data.totalWatchers.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low/50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <BarChart3 className="size-3" /> Open Issues
            </div>
            <p className="text-sm font-bold">{data.totalOpenIssues.toLocaleString()}</p>
          </div>
        </div>

        <div className="my-4 h-px bg-outline-variant/20" />

        {/* Top languages */}
        <div>
          <p className="mb-3 text-xs font-medium text-on-surface-variant">Top Languages</p>
          <div className="space-y-2">
            {data.topLanguages.map((lang) => (
              <div key={lang.name}>
                <div className="mb-0.5 flex items-center justify-between text-xs">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-on-surface-variant">{lang.percentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
