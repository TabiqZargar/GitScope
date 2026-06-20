import useSWR from "swr"
import type { GitHubUser, GitHubRepo, LanguageBreakdown } from "@/types/github"
import { fetchUser, fetchRepos, fetchAllLanguages } from "./github"

const SWR_OPTIONS = {
  dedupingInterval: 5 * 60 * 1000,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  errorRetryCount: 2,
}

export function useGitHubUser(username: string | null) {
  return useSWR(
    username ? `github-user-${username}` : null,
    () => fetchUser(username!),
    SWR_OPTIONS
  )
}

export function useGitHubRepos(username: string | null) {
  return useSWR(
    username ? `github-repos-${username}` : null,
    () => fetchRepos(username!),
    SWR_OPTIONS
  )
}

export function useGitHubLanguages(username: string | null, repos: GitHubRepo[] | null) {
  return useSWR(
    username && repos ? `github-langs-${username}` : null,
    () => fetchAllLanguages(username!, repos || []),
    { ...SWR_OPTIONS, revalidateOnMount: true }
  )
}
