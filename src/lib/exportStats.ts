import type { GitHubRepo } from "@/types/github"

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Less: "#1d365d",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  PowerShell: "#012456",
  Lua: "#000080",
  Haskell: "#5e5086",
  Elm: "#60B5CC",
  Clojure: "#db5855",
  Elixir: "#6e4a7e",
  Erlang: "#B83998",
  R: "#198CE7",
  Julia: "#a270ba",
  Perl: "#0298c3",
  Zig: "#ec915c",
  Nim: "#37775b",
  Objective_C: "#438eff",
  Solidity: "#AA6746",
  Makefile: "#427819",
  Dockerfile: "#384d54",
}

export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? "#8b949e"
}

function parseDateSafe(dateStr: string): Date | null {
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

export function estimateTotalCommits(repos: GitHubRepo[]): number {
  let total = 0
  for (const repo of repos) {
    if (repo.fork) continue
    const created = parseDateSafe(repo.created_at)
    const pushed = parseDateSafe(repo.pushed_at)
    if (!created || !pushed) continue
    const daysActive = Math.max(1, (pushed.getTime() - created.getTime()) / 86400000)
    const sizeFactor = Math.max(1, repo.size / 15)
    const timeFactor = daysActive * 0.15
    total += Math.round(sizeFactor + timeFactor)
  }
  return total
}

export function calculateStreak(repos: GitHubRepo[]): { currentStreak: number; longestStreak: number } {
  const pushDates = new Set<string>()
  for (const repo of repos) {
    const d = parseDateSafe(repo.pushed_at)
    if (d) {
      pushDates.add(d.toISOString().slice(0, 10))
    }
    const created = parseDateSafe(repo.created_at)
    if (created) {
      pushDates.add(created.toISOString().slice(0, 10))
    }
    const updated = parseDateSafe(repo.updated_at)
    if (updated) {
      pushDates.add(updated.toISOString().slice(0, 10))
    }
  }

  const sorted = [...pushDates].sort()
  if (sorted.length === 0) return { currentStreak: 0, longestStreak: 0 }

  let longest = 1
  let current = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000
    if (diffDays <= 1.5) {
      current++
    } else {
      longest = Math.max(longest, current)
      current = 1
    }
  }
  longest = Math.max(longest, current)

  const today = new Date().toISOString().slice(0, 10)
  const daysSinceLastPush = sorted.length > 0
    ? Math.round((new Date(today).getTime() - new Date(sorted[sorted.length - 1]).getTime()) / 86400000)
    : 999

  return {
    currentStreak: daysSinceLastPush <= 1 ? current : 0,
    longestStreak: longest,
  }
}

export interface ExportCardStats {
  totalStars: number
  totalForks: number
  totalCommits: number
  currentStreak: number
  longestStreak: number
  topLanguages: { name: string; percentage: number; color: string }[]
}

export function computeExportCardStats(
  repos: GitHubRepo[],
  languages: Record<string, number>
): ExportCardStats {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0)
  const totalCommits = estimateTotalCommits(repos)
  const { currentStreak, longestStreak } = calculateStreak(repos)

  const langEntries = Object.entries(languages).sort((a, b) => b[1] - a[1])
  const totalBytes = langEntries.reduce((s, [, b]) => s + b, 0)
  const topLanguages = langEntries.slice(0, 5).map(([name, bytes]) => ({
    name,
    percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
    color: getLanguageColor(name),
  }))

  return {
    totalStars,
    totalForks,
    totalCommits,
    currentStreak,
    longestStreak,
    topLanguages,
  }
}
