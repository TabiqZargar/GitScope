export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  hireable: boolean | null
  type: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  fork: boolean
  created_at: string
  updated_at: string
  pushed_at: string
  homepage: string | null
  size: number
  stargazers_count: number
  watchers_count: number
  language: string | null
  forks_count: number
  open_issues_count: number
  topics: string[]
  visibility: string
  default_branch: string
  archived: boolean
  disabled: boolean
}

export interface LanguageBreakdown {
  [language: string]: number
}

export type SortOption = "stars" | "forks" | "updated" | "name" | "created"
export type FilterOption = "all" | "sources" | "forks" | "archived"

export type DeveloperType =
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "Mobile Developer"
  | "Data Developer"
  | "Generalist Developer"

export interface DeveloperInsightsData {
  primaryLanguage: string | null
  totalRepos: number
  totalStars: number
  totalForks: number
  mostStarredRepo: { name: string; stars: number } | null
  accountAge: { years: number; months: number; label: string }
  avgStarsPerRepo: string
  mostRecentActive: { name: string; updated: string } | null
  repoCreationTrend: "increasing" | "steady" | "decreasing" | "no data"
  developerType: DeveloperType
  summary: string
  topLanguages: { name: string; percentage: number }[]
  languageCount: number
  sourceRepos: number
  forkRepos: number
  archivedRepos: number
  avgForksPerRepo: string
  totalWatchers: number
  totalOpenIssues: number
}

export interface ComparisonData {
  user1: GitHubUser | null
  user2: GitHubUser | null
  repos1: GitHubRepo[]
  repos2: GitHubRepo[]
  languages1: LanguageBreakdown
  languages2: LanguageBreakdown
  insights1: DeveloperInsightsData | null
  insights2: DeveloperInsightsData | null
  winners: {
    followers: string | null
    stars: string | null
    forks: string | null
    repos: string | null
    following: string | null
    accountAge: string | null
    avgStars: string | null
  }
}
