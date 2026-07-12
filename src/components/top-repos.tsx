"use client"

import { useState, useMemo } from "react"
import type { GitHubRepo, SortOption, FilterOption } from "@/types/github"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, GitFork, Clock, ArrowUpDown, ExternalLink, FolderOpen } from "lucide-react"

interface TopReposProps {
  repos: GitHubRepo[]
}

export function TopRepos({ repos }: TopReposProps) {
  const [sortBy, setSortBy] = useState<SortOption>("stars")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")

  const filteredAndSorted = useMemo(() => {
    let filtered = [...repos]

    switch (filterBy) {
      case "sources":
        filtered = filtered.filter((r) => !r.fork)
        break
      case "forks":
        filtered = filtered.filter((r) => r.fork)
        break
      case "archived":
        filtered = filtered.filter((r) => r.archived)
        break
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stargazers_count - a.stargazers_count
        case "forks":
          return b.forks_count - a.forks_count
        case "updated":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    return filtered.slice(0, 10)
  }, [repos, sortBy, filterBy])

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "stars", label: "Stars" },
    { value: "forks", label: "Forks" },
    { value: "updated", label: "Updated" },
    { value: "created", label: "Created" },
    { value: "name", label: "Name" },
  ]

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "all", label: "All" },
    { value: "sources", label: "Sources" },
    { value: "forks", label: "Forks" },
    { value: "archived", label: "Archived" },
  ]

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="size-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Top Repositories</h3>
        </div>
        <span className="text-xs text-on-surface-variant">{repos.length} total</span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <div className="flex flex-wrap gap-1">
          {filterOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={filterBy === opt.value ? "default" : "outline"}
              size="xs"
              onClick={() => setFilterBy(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {sortOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={sortBy === opt.value ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setSortBy(opt.value)}
            >
              {sortBy === opt.value && <ArrowUpDown className="size-3" />}
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filteredAndSorted.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card group flex items-center justify-between rounded-xl p-4 transition-all"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                  {repo.name}
                </span>
                {repo.fork && (
                  <Badge variant="outline" className="h-4 text-[10px]">
                    fork
                  </Badge>
                )}
                {repo.archived && (
                  <Badge variant="outline" className="h-4 border-destructive/30 text-[10px] text-destructive">
                    archived
                  </Badge>
                )}
              </div>
              {repo.description && (
                <p className="mt-0.5 truncate text-xs text-on-surface-variant">{repo.description}</p>
              )}
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded-full bg-primary" />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="size-3" />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="size-3" />
                  {repo.forks_count}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <ExternalLink className="ml-3 size-4 shrink-0 text-on-surface-variant opacity-0 transition-all group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </div>
  )
}
