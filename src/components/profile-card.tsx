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
    <Card className="glass-card relative overflow-hidden rounded-xl border-0 p-6">
      {/* Hireable badge */}
      {user.hireable && (
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-1 rounded-full border border-tertiary/20 bg-tertiary/10 px-3 py-1 text-xs font-semibold text-tertiary">
            <span className="size-1.5 animate-pulse rounded-full bg-tertiary" />
            HIREABLE
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-col items-center text-center">
        {/* Avatar with rotating ring */}
        <div className="relative mb-6">
          <svg className="absolute -inset-2 size-[calc(100%+16px)] animate-rotate-ring" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a2c9ff" />
                <stop offset="100%" stopColor="#d8baff" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#ring-gradient)" strokeDasharray="15 5" strokeWidth="2" />
          </svg>
          <div className="size-28 overflow-hidden rounded-full border-4 border-surface-container-lowest shadow-2xl">
            <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="size-full object-cover" />
          </div>
        </div>

        <h2 className="text-3xl font-semibold">{user.name || user.login}</h2>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base text-on-surface-variant transition-colors hover:text-primary"
        >
          @{user.login}
        </a>

        {user.bio && (
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground/80">{user.bio}</p>
        )}

        <div className="mt-8 grid w-full grid-cols-2 gap-4 border-t border-outline-variant/20 pt-8">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Users className="size-4 shrink-0" />
            <span><strong className="text-foreground">{user.followers.toLocaleString()}</strong> followers</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <UserPlus className="size-4 shrink-0" />
            <span><strong className="text-foreground">{user.following.toLocaleString()}</strong> following</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <ExternalLink className="size-4 shrink-0" />
            <span><strong className="text-foreground">{user.public_repos}</strong> repos</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Calendar className="size-4 shrink-0" />
            <span className="truncate">Joined {joinedDate}</span>
          </div>
        </div>

        {/* Extra details */}
        {(user.location || user.company || user.blog || user.twitter_username) && (
          <>
            <Separator className="my-4" />
            <div className="flex w-full flex-col gap-3 text-sm text-on-surface-variant">
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
              {user.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 shrink-0" />
                  <span className="truncate">{user.company}</span>
                </div>
              )}
              {user.blog && (
                <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 truncate transition-colors hover:text-primary">
                  <Link className="size-4 shrink-0" />
                  <span className="truncate">{new URL(user.blog.startsWith("http") ? user.blog : `https://${user.blog}`).hostname}</span>
                </a>
              )}
              {user.twitter_username && (
                <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 truncate transition-colors hover:text-primary">
                  <X className="size-4 shrink-0" />
                  <span>@{user.twitter_username}</span>
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
