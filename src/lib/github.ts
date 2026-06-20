import type { GitHubUser, GitHubRepo, LanguageBreakdown } from "@/types/github"

const API_BASE = "/api/github"

interface CacheEntry {
  data: unknown
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<unknown>>()
const CACHE_TTL = 5 * 60 * 1000

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const cacheKey = endpoint

  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T
  }

  if (inflight.has(cacheKey)) {
    return inflight.get(cacheKey) as Promise<T>
  }

  const promise = (async () => {
    const res = await fetch(`${API_BASE}?endpoint=${encodeURIComponent(endpoint)}`)

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || `GitHub API error: ${res.status}`)
    }

    const data: T = await res.json()
    cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  })()

  inflight.set(cacheKey, promise)
  promise.finally(() => inflight.delete(cacheKey)).catch(() => {})

  return promise
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`/users/${encodeURIComponent(username)}`)
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = []
  let page = 1
  let hasMore = true

  while (hasMore && page <= 5) {
    const data = await fetchGitHub<GitHubRepo[]>(
      `/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated`
    )
    repos.push(...data)
    hasMore = data.length === 100
    page++
  }

  return repos
}

export async function fetchLanguages(username: string, repoName: string): Promise<LanguageBreakdown> {
  return fetchGitHub<LanguageBreakdown>(
    `/repos/${encodeURIComponent(username)}/${encodeURIComponent(repoName)}/languages`
  )
}

export async function fetchAllLanguages(username: string, repos: GitHubRepo[]): Promise<LanguageBreakdown> {
  const languageTotals: LanguageBreakdown = {}
  const batchSize = 5

  for (let i = 0; i < repos.length; i += batchSize) {
    const batch = repos.slice(i, i + batchSize)
    const results = await Promise.allSettled(
      batch.map((repo) => fetchLanguages(username, repo.name))
    )
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        Object.entries(result.value).forEach(([lang, bytes]) => {
          languageTotals[lang] = (languageTotals[lang] || 0) + bytes
        })
      }
    })
  }

  return languageTotals
}

export function calculateTotalStars(repos: GitHubRepo[]): number {
  return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
}

export function calculateTotalForks(repos: GitHubRepo[]): number {
  return repos.reduce((sum, repo) => sum + repo.forks_count, 0)
}

export function getTopRepos(repos: GitHubRepo[], limit = 6): GitHubRepo[] {
  return [...repos]
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit)
}

export function getYearsSince(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  return Math.max(1, now.getFullYear() - date.getFullYear())
}

export function getAccountAge(dateString: string): { years: number; months: number; label: string } {
  const start = new Date(dateString)
  const now = new Date()
  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  if (months < 0) { years--; months += 12 }
  const label = years > 0
    ? `${years}y ${months}m`
    : `${months} months`
  return { years, months, label }
}

export function sortRepos(repos: GitHubRepo[], sort: string): GitHubRepo[] {
  const sorted = [...repos]
  switch (sort) {
    case "stars": return sorted.sort((a, b) => b.stargazers_count - a.stargazers_count)
    case "forks": return sorted.sort((a, b) => b.forks_count - a.forks_count)
    case "updated": return sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    case "name": return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case "created": return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    default: return sorted
  }
}

export function filterRepos(repos: GitHubRepo[], filter: string, search?: string): GitHubRepo[] {
  let filtered = [...repos]
  switch (filter) {
    case "sources": filtered = filtered.filter((r) => !r.fork); break
    case "forks": filtered = filtered.filter((r) => r.fork); break
    case "archived": filtered = filtered.filter((r) => r.archived); break
  }
  if (search?.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(q) || (r.description?.toLowerCase() || "").includes(q))
  }
  return filtered
}
