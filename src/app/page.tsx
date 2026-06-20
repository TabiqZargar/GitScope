"use client"

import { useState, useCallback } from "react"
import type { GitHubUser, GitHubRepo, LanguageBreakdown } from "@/types/github"
import { fetchUser, fetchRepos, fetchAllLanguages } from "@/lib/github"
import { SearchBar } from "@/components/search-bar"
import { ProfileCard } from "@/components/profile-card"
import { RepoStats } from "@/components/repo-stats"
import { TopRepos } from "@/components/top-repos"
import { LanguageChart } from "@/components/language-chart"
import { ContributionActivity } from "@/components/contribution-activity"
import { DeveloperInsights } from "@/components/developer-insights"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { ErrorState } from "@/components/error-state"
import { BarChart3, Code2, GitCommitHorizontal, Lightbulb, FolderOpen } from "lucide-react"

const FEATURES = [
  { icon: BarChart3, label: "Repository Analytics", desc: "Stars, forks, size & language breakdown" },
  { icon: Code2, label: "Language Distribution", desc: "Interactive donut chart & usage stats" },
  { icon: GitCommitHorizontal, label: "Activity Timeline", desc: "Creation, push & update patterns" },
  { icon: Lightbulb, label: "Developer Insights", desc: "Top repos, ratios & key metrics" },
  { icon: FolderOpen, label: "Smart Filtering", desc: "Sort & filter repos by any criteria" },
]

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [languages, setLanguages] = useState<LanguageBreakdown>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLangLoading, setIsLangLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = useCallback(async (username: string) => {
    setIsLoading(true)
    setError(null)
    setSearched(true)
    setLanguages({})
    setUser(null)
    setRepos([])

    try {
      const [userData, reposData] = await Promise.all([
        fetchUser(username),
        fetchRepos(username),
      ])

      setUser(userData)
      setRepos(reposData)

      setIsLangLoading(true)
      fetchAllLanguages(username, reposData)
        .then((langData) => {
          setLanguages(langData)
          setIsLangLoading(false)
        })
        .catch(() => setIsLangLoading(false))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Feature cards shown when no search has been done */}
      {!searched && !isLoading && (
        <div className="mt-10 animate-slide-up">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.label}
                className="group rounded-xl border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-sm"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-secondary/80 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-sm font-medium mb-0.5">{feature.label}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && <DashboardSkeleton />}

      {error && !isLoading && (
        <div className="mt-6">
          <ErrorState message={error} />
        </div>
      )}

      {user && !isLoading && (
        <div className="mt-6 space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ProfileCard user={user} />
            </div>
            <div className="lg:col-span-2">
              <RepoStats repos={repos} />
            </div>
          </div>

          <DeveloperInsights user={user} repos={repos} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LanguageChart languages={languages} isLoading={isLangLoading} />
            <ContributionActivity repos={repos} />
          </div>

          <TopRepos repos={repos} />
        </div>
      )}
    </div>
  )
}
