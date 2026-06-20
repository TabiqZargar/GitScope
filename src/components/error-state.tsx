"use client"

import { Card, CardContent } from "@/components/ui/card"
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
    <Card className="border-destructive/30">
      <CardContent className="flex flex-col items-center gap-4 py-12">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <Icon className="size-7 text-destructive" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold">
            {isNotFound
              ? "User Not Found"
              : isRateLimit
              ? "Rate Limit Exceeded"
              : "Something went wrong"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {isNotFound
              ? "The GitHub username you searched for doesn't exist. Please check the spelling and try again."
              : isRateLimit
              ? "The GitHub API rate limit has been exceeded. Please wait a moment and try again."
              : message}
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
