"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, SearchX, CloudOff } from "lucide-react"

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const isNotFound = message.toLowerCase().includes("not found")
  const isRateLimit = message.toLowerCase().includes("rate limit")

  const Icon = isNotFound ? SearchX : isRateLimit ? CloudOff : AlertTriangle

  return (
    <div className="glass-card rounded-xl border-destructive/30 p-8 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="size-7 text-destructive" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">
        {isNotFound
          ? "User Not Found"
          : isRateLimit
          ? "Rate Limit Exceeded"
          : "Something went wrong"}
      </h3>
      <p className="mx-auto mb-4 max-w-sm text-sm text-on-surface-variant">
        {isNotFound
          ? "The GitHub username you searched for doesn't exist. Please check the spelling and try again."
          : isRateLimit
          ? "The GitHub API rate limit has been exceeded. Please wait a moment and try again."
          : message}
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
