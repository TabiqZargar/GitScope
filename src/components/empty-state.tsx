"use client"

import { Button } from "@/components/ui/button"
import { Search, RefreshCw, AlertTriangle, FolderOpen } from "lucide-react"

interface EmptyStateProps {
  type: "no-search" | "not-found" | "no-repos" | "api-error"
  onRetry?: () => void
  username?: string
  message?: string
}

export function EmptyState({ type, onRetry, username, message }: EmptyStateProps) {
  if (type === "no-search") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl" />
          <div className="relative flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/30">
            <svg className="size-10 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </div>
        </div>
        <h2 className="mb-2 text-xl font-semibold">Search any GitHub developer</h2>
        <p className="max-w-sm text-sm text-on-surface-variant">
          Enter a username above to view detailed analytics, language distribution, and contribution insights.
        </p>
      </div>
    )
  }

  if (type === "not-found") {
    return (
      <div className="glass-card rounded-xl border-destructive/30 p-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <Search className="size-7 text-destructive" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">{message && !message.toLowerCase().includes("not found") ? "Error" : "User Not Found"}</h3>
        <p className="mx-auto mb-4 max-w-sm text-sm text-on-surface-variant">
          {message || (username ? (
            <>We couldn&apos;t find a GitHub user named <strong>{username}</strong>.</>
          ) : (
            "We couldn't find that GitHub user."
          ))}
          {!message && " Please check the spelling and try again."}
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        )}
      </div>
    )
  }

  if (type === "no-repos") {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface-container">
          <FolderOpen className="size-7 text-on-surface-variant" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">No Repositories</h3>
        <p className="text-sm text-on-surface-variant">
          This user doesn&apos;t have any public repositories yet.
        </p>
      </div>
    )
  }

  if (type === "api-error") {
    return (
      <div className="glass-card rounded-xl border-destructive/30 p-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-7 text-destructive" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">API Error</h3>
        <p className="mx-auto mb-4 max-w-sm text-sm text-on-surface-variant">
          {message || "The GitHub API encountered an error. This could be a rate limit or temporary outage."}
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="size-4" />
            Retry
          </Button>
        )}
      </div>
    )
  }

  return null
}
