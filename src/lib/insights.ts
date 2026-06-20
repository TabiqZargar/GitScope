import type { GitHubUser, GitHubRepo, LanguageBreakdown, DeveloperInsightsData, DeveloperType } from "@/types/github"
import { getAccountAge, calculateTotalStars, calculateTotalForks } from "./github"

const FRONTEND_LANGS = new Set(["javascript", "typescript", "html", "css", "scss", "sass", "less", "vue", "react", "angular", "svelte", "elm", "coffeescript", "pug", "haml", "stylus"])
const BACKEND_LANGS = new Set(["python", "java", "go", "rust", "c#", "c++", "c", "php", "ruby", "scala", "kotlin", "elixir", "erlang", "haskell", "clojure", "dart", "swift", "perl", "r", "zig", "nim", "crystal", "ocaml", "f#", "lua"])
const MOBILE_LANGS = new Set(["kotlin", "swift", "dart", "java", "objective-c"])
const DATA_LANGS = new Set(["python", "r", "julia", "sql", "matlab", "scala"])

function determineDeveloperType(languages: LanguageBreakdown): DeveloperType {
  const totalBytes = Object.values(languages).reduce((s, b) => s + b, 0)
  if (totalBytes === 0) return "Generalist Developer"

  let frontend = 0, backend = 0, mobile = 0, data = 0
  for (const [lang, bytes] of Object.entries(languages)) {
    const lower = lang.toLowerCase()
    if (FRONTEND_LANGS.has(lower)) frontend += bytes
    if (BACKEND_LANGS.has(lower)) backend += bytes
    if (MOBILE_LANGS.has(lower)) mobile += bytes
    if (DATA_LANGS.has(lower)) data += bytes
  }

  const fRatio = frontend / totalBytes
  const bRatio = backend / totalBytes
  const mRatio = mobile / totalBytes
  const dRatio = data / totalBytes

  if (mRatio > 0.4) return "Mobile Developer"
  if (dRatio > 0.4) return "Data Developer"
  if (fRatio > 0.4 && bRatio > 0.4) return "Full Stack Developer"
  if (fRatio > 0.3) return "Frontend Developer"
  if (bRatio > 0.3) return "Backend Developer"
  return "Generalist Developer"
}

function generateSummary(
  user: GitHubUser,
  repos: GitHubRepo[],
  languages: LanguageBreakdown,
  primaryLang: string | null,
  devType: DeveloperType
): string {
  const totalStars = calculateTotalStars(repos)
  const sourceRepos = repos.filter((r) => !r.fork)
  const age = getAccountAge(user.created_at)
  const topLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name)

  const parts: string[] = []

  if (primaryLang && topLangs.length > 1) {
    parts.push(`This developer primarily works with ${primaryLang}`)
    if (topLangs.length > 1) {
      const others = topLangs.slice(1)
      parts.push(`${others.length === 1 ? "and" : ""} ${others.join(", ")}`)
    }
    parts.push(".")
  } else if (primaryLang) {
    parts.push(`This developer primarily works with ${primaryLang}.`)
  }

  parts.push(`They have built ${user.public_repos} public repositories (${sourceRepos.length} source, ${repos.filter(r => r.fork).length} forks), accumulated ${totalStars} stars,`)

  if (age.years > 0) {
    parts.push(`and show consistent open-source activity over the last ${age.years} ${age.years === 1 ? "year" : "years"}.`)
  } else {
    parts.push("and are actively building their open-source presence.")
  }

  const typeDescriptions: Record<DeveloperType, string> = {
    "Frontend Developer": "Their strongest focus appears to be frontend development with modern UI frameworks.",
    "Backend Developer": "Their expertise lies in backend development and server-side technologies.",
    "Full Stack Developer": "They demonstrate full-stack capabilities across both frontend and backend technologies.",
    "Mobile Developer": "Their primary focus is mobile application development.",
    "Data Developer": "They specialize in data-driven development and analytics.",
    "Generalist Developer": "They work across a diverse range of technologies and domains.",
  }
  parts.push(typeDescriptions[devType])

  return parts.join(" ")
}

export function computeDeveloperInsights(
  user: GitHubUser,
  repos: GitHubRepo[],
  languages: LanguageBreakdown
): DeveloperInsightsData {
  const totalStars = calculateTotalStars(repos)
  const totalForks = calculateTotalForks(repos)
  const sourceRepos = repos.filter((r) => !r.fork)
  const forkRepos = repos.filter((r) => r.fork)
  const archivedRepos = repos.filter((r) => r.archived)
  const age = getAccountAge(user.created_at)

  const sortedByStars = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)
  const mostStarredRepo = sortedByStars[0]
    ? { name: sortedByStars[0].name, stars: sortedByStars[0].stargazers_count }
    : null

  const sortedByUpdate = [...repos].sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
  const mostRecentActive = sortedByUpdate[0]
    ? { name: sortedByUpdate[0].name, updated: sortedByUpdate[0].pushed_at }
    : null

  const langEntries = Object.entries(languages).sort((a, b) => b[1] - a[1])
  const primaryLanguage = langEntries[0]?.[0] || null
  const totalBytes = langEntries.reduce((s, [, b]) => s + b, 0)
  const topLanguages = langEntries.slice(0, 5).map(([name, bytes]) => ({
    name,
    percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
  }))

  const devType = determineDeveloperType(languages)
  const summary = generateSummary(user, repos, languages, primaryLanguage, devType)

  const repoCreationTrend = (() => {
    if (repos.length < 3) return "no data" as const
    const byYear = new Map<number, number>()
    repos.forEach((r) => {
      const year = new Date(r.created_at).getFullYear()
      byYear.set(year, (byYear.get(year) || 0) + 1)
    })
    const years = [...byYear.entries()].sort((a, b) => a[0] - b[0])
    if (years.length < 2) return "steady" as const

    const recent = years.slice(-3)
    if (recent.length < 2) return "steady" as const
    const first = recent[0][1]
    const last = recent[recent.length - 1][1]
    if (last > first * 1.2) return "increasing" as const
    if (last < first * 0.8) return "decreasing" as const
    return "steady" as const
  })()

  return {
    primaryLanguage,
    totalRepos: user.public_repos,
    totalStars,
    totalForks,
    mostStarredRepo,
    accountAge: age,
    avgStarsPerRepo: repos.length > 0 ? (totalStars / repos.length).toFixed(1) : "0",
    mostRecentActive,
    repoCreationTrend,
    developerType: devType,
    summary,
    topLanguages,
    languageCount: langEntries.length,
    sourceRepos: sourceRepos.length,
    forkRepos: forkRepos.length,
    archivedRepos: archivedRepos.length,
    avgForksPerRepo: repos.length > 0 ? (totalForks / repos.length).toFixed(1) : "0",
    totalWatchers: repos.reduce((s, r) => s + r.watchers_count, 0),
    totalOpenIssues: repos.reduce((s, r) => s + r.open_issues_count, 0),
  }
}
