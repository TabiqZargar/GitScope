"use client"

import { useState, useMemo } from "react"
import type { GitHubRepo, SortOption } from "@/types/github"
import { filterRepos } from "@/lib/github"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
    { label: "Source", value: sourceRepos.length, icon: GitBranch, color: "text-green-400" },
    { label: "Forks", value: forkRepos.length, icon: GitFork, color: "text-blue-400" },
    { label: "Archived", value: archivedRepos.length, icon: Archive, color: "text-orange-400" },
    { label: "Avg Stars", value: avgStars, icon: Star, color: "text-yellow-400" },
    { label: "Avg Forks", value: avgForks, icon: GitFork, color: "text-purple-400" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="size-4 text-primary" />
          Repository Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Overview cards */}
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {overviewItems.map((item) => (
            <div key={item.label} className="rounded-lg border border-border/50 bg-card/50 p-3 text-center">
              <item.icon className={`mx-auto mb-1 size-4 ${item.color}`} />
              <p className="text-sm font-bold tabular-nums">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Top repo highlights */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {mostStarred && (
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Star className="size-3 text-yellow-400" /> Most Starred</p>
              <p className="text-sm font-medium truncate">{mostStarred.name}</p>
              <p className="text-xs text-muted-foreground">{mostStarred.stargazers_count} stars</p>
            </div>
          )}
          {mostForked && (
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><GitFork className="size-3 text-blue-400" /> Most Forked</p>
              <p className="text-sm font-medium truncate">{mostForked.name}</p>
              <p className="text-xs text-muted-foreground">{mostForked.forks_count} forks</p>
            </div>
          )}
          {recentlyUpdated && (
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Clock className="size-3 text-green-400" /> Recently Updated</p>
              <p className="text-sm font-medium truncate">{recentlyUpdated.name}</p>
              <p className="text-xs text-muted-foreground">{new Date(recentlyUpdated.updated_at).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Search & filter */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
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
        <div className="space-y-1.5">
          {sorted.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No repositories match your criteria.</p>
          )}
          {sorted.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3 transition-all hover:border-primary/30 hover:bg-card"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{repo.name}</span>
                  {repo.fork && <Badge variant="outline" className="text-[10px] h-4">fork</Badge>}
                  {repo.archived && <Badge variant="outline" className="text-[10px] h-4 text-destructive border-destructive/30">archived</Badge>}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {repo.language && <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary" />{repo.language}</span>}
                  <span className="flex items-center gap-1"><Star className="size-3" />{repo.stargazers_count}</span>
                  <span className="flex items-center gap-1"><GitFork className="size-3" />{repo.forks_count}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" />{new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <ExternalLink className="ml-3 size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
