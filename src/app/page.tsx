"use client"

import { useState, useCallback } from "react"
import type { GitHubUser, GitHubRepo, LanguageBreakdown } from "@/types/github"
import { fetchUser, fetchRepos, fetchAllLanguages, getTopRepos } from "@/lib/github"
import { SearchBar } from "@/components/search-bar"
import { ProfileCard } from "@/components/profile-card"
import { RepoStats } from "@/components/repo-stats"
import { TopRepos } from "@/components/top-repos"
import { LanguageChart } from "@/components/language-chart"
import { ContributionActivity } from "@/components/contribution-activity"
import { DeveloperInsights } from "@/components/developer-insights"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { ErrorState } from "@/components/error-state"

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

      {isLoading && <DashboardSkeleton />}

      {error && !isLoading && (
        <ErrorState message={error} onRetry={searched && user ? undefined : undefined} />
      )}

      {user && !isLoading && (
        <div className="space-y-6">
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

      {!searched && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">📊</div>
          <h2 className="text-xl font-semibold mb-2">Ready to analyze</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Search for any GitHub username above to view their profile analytics, language distribution, contribution activity, and more.
          </p>
        </div>
      )}
    </div>
  )
}
