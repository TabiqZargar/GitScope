"use client"

import { useState, use } from "react"
import { useGitHubUser, useGitHubRepos, useGitHubLanguages } from "@/lib/github-hooks"
import { computeDeveloperInsights } from "@/lib/insights"
import { ProfileCard } from "@/components/profile-card"
import { RepoStats } from "@/components/repo-stats"
import { RepoAnalytics } from "@/components/repo-analytics"
import { LanguageChart } from "@/components/language-chart"
import { ContributionActivity } from "@/components/contribution-activity"
import { DeveloperInsights } from "@/components/developer-insights"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { EmptyState } from "@/components/empty-state"
import { Copy, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const [copied, setCopied] = useState(false)

  const { data: user, error: userError, isValidating: userLoading } = useGitHubUser(username)
  const { data: reposData, error: reposError, isValidating: reposLoading } = useGitHubRepos(username)
  const { data: languages, isValidating: langLoading } = useGitHubLanguages(username, user ? (reposData || null) : null)

  const repos = reposData || []
  const isLoading = userLoading || reposLoading
  const error = userError || reposError

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const insights = user && repos.length > 0 ? computeDeveloperInsights(user, repos, languages || {}) : null
  const exportId = "gitscope-export"

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <DashboardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mt-6">
          <EmptyState
            type={error.toLowerCase().includes("rate limit") ? "api-error" : error.toLowerCase().includes("not found") ? "not-found" : "api-error"}
            username={username}
            message={error}
          />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div id={exportId} className="space-y-6 animate-slide-up">
        {/* Share bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="size-4" />
            <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              @{user.login}
            </a>
            <Button variant="link" size="sm" onClick={handleCopyUrl} className="h-auto p-0 text-muted-foreground hover:text-primary">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied!" : "Copy URL"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1"><ProfileCard user={user} /></div>
          <div className="lg:col-span-2"><RepoStats repos={repos} /></div>
        </div>

        {insights && <DeveloperInsights data={insights} />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LanguageChart languages={languages || {}} isLoading={langLoading} />
          <ContributionActivity repos={repos} />
        </div>

        <ErrorBoundary>
          <RepoAnalytics repos={repos} />
        </ErrorBoundary>
      </div>
    </div>
  )
}
