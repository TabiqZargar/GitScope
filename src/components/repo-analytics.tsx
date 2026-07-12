"use client"

import { useState, useMemo } from "react"
import type { GitHubRepo, SortOption } from "@/types/github"
import { filterRepos } from "@/lib/github"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, GitFork, Clock, ArrowUpDown, ExternalLink, FolderOpen, Search, Archive, GitBranch } from "lucide-react"

interface RepoAnalyticsProps {
  repos: GitHubRepo[]
}

export function RepoAnalytics({ repos }: RepoAnalyticsProps) {
  const [sort, setSort] = useState<SortOption>("stars")
  const [filter, setFilter] = useState<string>("all")
  const [search, setSearch] = useState("")

  const sourceRepos = repos.filter((r) => !r.fork)
  const forkRepos = repos.filter((r) => r.fork)
  const archivedRepos = repos.filter((r) => r.archived)
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0)
  const avgStars = repos.length > 0 ? (totalStars / repos.length).toFixed(1) : "0"
  const avgForks = repos.length > 0 ? (totalForks / repos.length).toFixed(1) : "0"

  const mostStarred = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0]
  const mostForked = [...repos].sort((a, b) => b.forks_count - a.forks_count)[0]
  const recentlyUpdated = [...repos].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]

  const filtered = useMemo(() => filterRepos(repos, filter, search), [repos, filter, search])
  const sorted = useMemo(() => {
    const s = [...filtered]
    switch (sort) {
      case "stars": s.sort((a, b) => b.stargazers_count - a.stargazers_count); break
      case "forks": s.sort((a, b) => b.forks_count - a.forks_count); break
      case "updated": s.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()); break
      case "name": s.sort((a, b) => a.name.localeCompare(b.name)); break
      case "created": s.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
    }
    return s.slice(0, 10)
  }, [filtered, sort])

  const overviewItems = [
    { label: "Total", value: repos.length, icon: FolderOpen, color: "text-primary" },
    { label: "Source", value: sourceRepos.length, icon: GitBranch, color: "text-tertiary" },
    { label: "Forks", value: forkRepos.length, icon: GitFork, color: "text-secondary" },
    { label: "Archived", value: archivedRepos.length, icon: Archive, color: "text-destructive" },
    { label: "Avg Stars", value: avgStars, icon: Star, color: "text-yellow-400" },
    { label: "Avg Forks", value: avgForks, icon: GitFork, color: "text-secondary" },
  ]

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="mb-5 flex items-center gap-2">
        <FolderOpen className="size-4 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Repository Analytics</h3>
      </div>

      {/* Overview cards */}
      <div className="mb-5 grid grid-cols-3 gap-2 md:grid-cols-6">
        {overviewItems.map((item) => (
          <div key={item.label} className="rounded-lg border border-outline-variant/20 bg-surface-container-low/50 p-3 text-center">
            <item.icon className={`mx-auto mb-1 size-4 ${item.color}`} />
            <p className="text-sm font-bold tabular-nums">{item.value}</p>
            <p className="text-[10px] text-on-surface-variant">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 h-px bg-outline-variant/20" />

      {/* Top repo highlights */}
      <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {mostStarred && (
          <div className="rounded-lg border border-outline-variant/20 p-3">
            <p className="mb-1 flex items-center gap-1 text-[10px] text-on-surface-variant"><Star className="size-3 text-yellow-400" /> Most Starred</p>
            <p className="truncate text-sm font-medium">{mostStarred.name}</p>
            <p className="text-xs text-on-surface-variant">{mostStarred.stargazers_count} stars</p>
          </div>
        )}
        {mostForked && (
          <div className="rounded-lg border border-outline-variant/20 p-3">
            <p className="mb-1 flex items-center gap-1 text-[10px] text-on-surface-variant"><GitFork className="size-3 text-secondary" /> Most Forked</p>
            <p className="truncate text-sm font-medium">{mostForked.name}</p>
            <p className="text-xs text-on-surface-variant">{mostForked.forks_count} forks</p>
          </div>
        )}
        {recentlyUpdated && (
          <div className="rounded-lg border border-outline-variant/20 p-3">
            <p className="mb-1 flex items-center gap-1 text-[10px] text-on-surface-variant"><Clock className="size-3 text-tertiary" /> Recently Updated</p>
            <p className="truncate text-sm font-medium">{recentlyUpdated.name}</p>
            <p className="text-xs text-on-surface-variant">{new Date(recentlyUpdated.updated_at).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="mb-5 h-px bg-outline-variant/20" />

      {/* Search & filter */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-on-surface-variant" />
          <Input
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 rounded-lg border-outline-variant/20 bg-surface-container-low/50 pl-8 text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {["all", "sources", "forks", "archived"].map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="xs" onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {(["stars", "forks", "updated", "name"] as SortOption[]).map((s) => (
            <Button key={s} variant={sort === s ? "secondary" : "ghost"} size="xs" onClick={() => setSort(s)}>
              {sort === s && <ArrowUpDown className="size-3" />}
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Repo list */}
      <div className="space-y-2">
        {sorted.length === 0 && (
          <p className="py-8 text-center text-sm text-on-surface-variant">No repositories match your criteria.</p>
        )}
        {sorted.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card group flex items-center justify-between rounded-xl p-4 transition-all"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg border border-outline-variant/20 bg-surface-container text-primary">
                  <FolderOpen className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold transition-colors group-hover:text-primary truncate">{repo.name}</span>
                    {repo.fork && <Badge variant="outline" className="h-4 text-[10px]">fork</Badge>}
                    {repo.archived && <Badge variant="outline" className="h-4 border-destructive/30 text-[10px] text-destructive">archived</Badge>}
                  </div>
                  {repo.description && (
                    <p className="mt-0.5 truncate text-xs text-on-surface-variant">{repo.description}</p>
                  )}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 pl-14 text-xs text-on-surface-variant">
                {repo.language && <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary" />{repo.language}</span>}
                <span className="flex items-center gap-1"><Star className="size-3" />{repo.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork className="size-3" />{repo.forks_count}</span>
                <span className="flex items-center gap-1"><Clock className="size-3" />{new Date(repo.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
            <ExternalLink className="ml-3 size-4 shrink-0 text-on-surface-variant opacity-0 transition-all group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </div>
  )
}
