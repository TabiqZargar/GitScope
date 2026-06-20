"use client"

import { useState, useCallback, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import type { GitHubUser, GitHubRepo, LanguageBreakdown } from "@/types/github"
import { fetchUser, fetchRepos, fetchAllLanguages } from "@/lib/github"
import { computeDeveloperInsights } from "@/lib/insights"
import { SearchBar } from "@/components/search-bar"
import { ProfileCard } from "@/components/profile-card"
import { RepoStats } from "@/components/repo-stats"
import { RepoAnalytics } from "@/components/repo-analytics"
import { LanguageChart } from "@/components/language-chart"
import { ContributionActivity } from "@/components/contribution-activity"
import { DeveloperInsights } from "@/components/developer-insights"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { EmptyState } from "@/components/empty-state"
import { Separator } from "@/components/ui/separator"
import { Copy, Check, ExternalLink, BarChart3, Code2, GitCommitHorizontal, Lightbulb, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

function HomeContent() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [languages, setLanguages] = useState<LanguageBreakdown>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLangLoading, setIsLangLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const usernameFromUrl = searchParams.get("user")
  const [searched, setSearched] = useState(!!usernameFromUrl)
  const lastSearched = useRef("")

  const handleSearch = useCallback(async (username: string) => {
    setIsLoading(true)
    setError(null)
    setSearched(true)
    setLanguages({})
    setUser(null)
    setRepos([])

    window.history.replaceState(null, "", `/?user=${encodeURIComponent(username)}`)

    try {
      const [userData, reposData] = await Promise.all([
        fetchUser(username),
        fetchRepos(username),
      ])
      setUser(userData)
      setRepos(reposData)

      setIsLangLoading(true)
      fetchAllLanguages(username, reposData)
        .then((langData) => { setLanguages(langData); setIsLangLoading(false) })
        .catch(() => setIsLangLoading(false))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (usernameFromUrl && usernameFromUrl !== lastSearched.current) {
      lastSearched.current = usernameFromUrl
      handleSearch(usernameFromUrl)
    }
  }, [usernameFromUrl])

  const handleCopyUrl = async () => {
    const url = user ? `${window.location.origin}/user/${user.login}` : window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const insights = user ? computeDeveloperInsights(user, repos, languages) : null
  const exportId = "gitscope-export"

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {!searched && !isLoading && (
        <div className="mt-10 animate-slide-up">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: BarChart3, label: "Repository Analytics", desc: "Stars, forks, size & language breakdown" },
              { icon: Code2, label: "Language Distribution", desc: "Interactive donut chart & usage stats" },
              { icon: GitCommitHorizontal, label: "Activity Timeline", desc: "Creation, push & update patterns" },
              { icon: Lightbulb, label: "Developer Insights", desc: "Top repos, ratios & key metrics" },
              { icon: FolderOpen, label: "Smart Filtering", desc: "Sort & filter repos by any criteria" },
            ].map((feature, i) => (
              <div key={feature.label} className="group rounded-xl border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-sm" style={{ animationDelay: `${i * 80}ms` }}>
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

      {isLoading && <div className="mt-6"><DashboardSkeleton /></div>}

      {error && !isLoading && (
        <div className="mt-6">
          <EmptyState
            type={error.toLowerCase().includes("rate limit") ? "api-error" : error.toLowerCase().includes("not found") ? "not-found" : "api-error"}
            username={usernameFromUrl || undefined}
            message={error}
            onRetry={() => handleSearch(usernameFromUrl || "")}
          />
        </div>
      )}

      {user && !isLoading && (
        <div id={exportId} className="mt-6 space-y-6 animate-slide-up">
          {/* Export & Share bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="size-4" />
              <span>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  @{user.login}
                </a>
                {' / '}
                <Button variant="link" size="sm" onClick={handleCopyUrl} className="h-auto p-0 text-muted-foreground hover:text-primary">
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ProfileCard user={user} />
            </div>
            <div className="lg:col-span-2">
              <RepoStats repos={repos} />
            </div>
          </div>

          {insights && <DeveloperInsights data={insights} />}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LanguageChart languages={languages} isLoading={isLangLoading} />
            <ContributionActivity repos={repos} />
          </div>

          <ErrorBoundary>
            <RepoAnalytics repos={repos} />
          </ErrorBoundary>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}
