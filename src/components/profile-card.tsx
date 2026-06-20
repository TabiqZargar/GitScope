"use client"

import type { GitHubUser } from "@/types/github"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Building2,
  Link,
  X,
  Calendar,
  Users,
  UserPlus,
  ExternalLink,
} from "lucide-react"

interface ProfileCardProps {
  user: GitHubUser
}

export function ProfileCard({ user }: ProfileCardProps) {
  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <Card className="overflow-hidden transition-all hover:ring-1 hover:ring-primary/50">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="group relative shrink-0">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="size-24 rounded-full ring-2 ring-border transition-all group-hover:ring-primary sm:size-28"
            />
            {user.hireable && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white shadow-lg" title="Available for hire">
                H
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <h2 className="text-xl font-bold">{user.name || user.login}</h2>
              {user.hireable && (
                <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
                  HIRABLE
                </Badge>
              )}
            </div>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              @{user.login}
            </a>

            {user.bio && (
              <p className="mt-2 text-sm text-foreground/80 max-w-lg line-clamp-2">{user.bio}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground justify-center sm:justify-start">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {user.location}
                </span>
              )}
              {user.company && (
                <span className="flex items-center gap-1">
                  <Building2 className="size-3.5" />
                  {user.company}
                </span>
              )}
              {user.blog && (
                <a
                  href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Link className="size-3.5" />
                  {new URL(user.blog.startsWith("http") ? user.blog : `https://${user.blog}`).hostname}
                </a>
              )}
              {user.twitter_username && (
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <X className="size-3.5" />
                  @{user.twitter_username}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                Joined {joinedDate}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-start">
          <a
            href={`${user.html_url}?tab=followers`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors hover:text-primary group"
          >
            <Users className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-semibold">{user.followers.toLocaleString()}</span>
            <span className="text-muted-foreground">followers</span>
          </a>
          <a
            href={`${user.html_url}?tab=following`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors hover:text-primary group"
          >
            <UserPlus className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-semibold">{user.following.toLocaleString()}</span>
            <span className="text-muted-foreground">following</span>
          </a>
          <a
            href={`${user.html_url}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors hover:text-primary group"
          >
            <ExternalLink className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-semibold">{user.public_repos}</span>
            <span className="text-muted-foreground">repositories</span>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
