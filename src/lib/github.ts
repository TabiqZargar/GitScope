import type { GitHubUser, GitHubRepo, LanguageBreakdown } from "@/types/github"

const GITHUB_API = "https://api.github.com"

async function fetchGitHub<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "GitScope/1.0",
    },
    next: { revalidate: 300 },
  })

  if (res.status === 404) {
    throw new Error("User not found")
  }
  if (res.status === 403) {
    throw new Error("API rate limit exceeded")
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }

  return res.json()
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`${GITHUB_API}/users/${encodeURIComponent(username)}`)
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = []
  let page = 1
  let hasMore = true

  while (hasMore && page <= 5) {
    const data = await fetchGitHub<GitHubRepo[]>(
      `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated&type=all`
    )
    repos.push(...data)
    hasMore = data.length === 100
    page++
  }

  return repos
}

export async function fetchLanguages(username: string, repoName: string): Promise<LanguageBreakdown> {
  return fetchGitHub<LanguageBreakdown>(
    `${GITHUB_API}/repos/${encodeURIComponent(username)}/${encodeURIComponent(repoName)}/languages`
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

export function calculateTotalSize(repos: GitHubRepo[]): number {
  return repos.reduce((sum, repo) => sum + repo.size, 0)
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
