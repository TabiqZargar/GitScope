"use client"

import { useState, useCallback } from "react"
import type { GitHubUser, GitHubRepo, LanguageBreakdown, ComparisonData } from "@/types/github"
import { fetchUser, fetchRepos, fetchAllLanguages, calculateTotalStars, calculateTotalForks, getAccountAge } from "@/lib/github"
import { computeDeveloperInsights } from "@/lib/insights"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { GitCompare, Search, Loader2, Users, Star, GitFork, Trophy, ExternalLink, UserPlus, Calendar, Code2, FolderOpen, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const METRICS = [
  { key: "followers", label: "Most Followers", icon: Users },
  { key: "stars", label: "Most Stars", icon: Star },
  { key: "forks", label: "Most Forks", icon: GitFork },
  { key: "repos", label: "Most Repositories", icon: FolderOpen },
  { key: "following", label: "Most Following", icon: UserPlus },
  { key: "accountAge", label: "Older Account", icon: Calendar },
  { key: "avgStars", label: "Highest Avg Stars", icon: Trophy },
]

function WinnerBadge({ winner, label }: { winner: string | null; label: string }) {
  if (!winner) return null
  return (
    <div className="glass-card flex items-center gap-2 rounded-xl p-4">
      <Trophy className="size-5 shrink-0 text-yellow-400" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-yellow-400 truncate">{winner}</p>
        <p className="text-xs text-on-surface-variant">{label}</p>
      </div>
    </div>
  )
}

function ComparisonBar({ label, val1, val2, color1, color2, max }: {
  label: string; val1: number; val2: number; color1: string; color2: string; max: number
}) {
  const p1 = max > 0 ? (val1 / max) * 100 : 0
  const p2 = max > 0 ? (val2 / max) * 100 : 0
  return (
    <div className="grid grid-cols-12 items-center gap-4">
      <div className="col-span-2 text-right">
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{label}</span>
      </div>
      <div className="col-span-8 flex h-10 items-center gap-0.5">
        <div className="relative h-full rounded-l-full border-r border-primary/40 bg-primary/20 transition-all group" style={{ width: `${p1}%` }}>
          <div className="absolute inset-y-1.5 left-1.5 right-1.5 rounded-l-full bg-primary transition-all group-hover:brightness-110" />
        </div>
        <div className="relative h-full rounded-r-full border-l border-tertiary/40 bg-tertiary/20 transition-all group" style={{ width: `${p2}%` }}>
          <div className="absolute inset-y-1.5 left-1.5 right-1.5 rounded-r-full bg-tertiary transition-all group-hover:brightness-110" />
        </div>
      </div>
      <div className="col-span-2 flex justify-between font-mono text-xs">
        <span className="text-primary">{val1.toLocaleString()}</span>
        <span className="text-tertiary">{val2.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function ComparePage() {
  const [user1, setUser1] = useState("")
  const [user2, setUser2] = useState("")
  const [data, setData] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = useCallback(async () => {
    const u1 = user1.trim()
    const u2 = user2.trim()
    if (!u1 || !u2) return

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const [d1, d2, r1, r2] = await Promise.all([
        fetchUser(u1), fetchUser(u2),
        fetchRepos(u1), fetchRepos(u2),
      ])

      const [l1, l2] = await Promise.all([
        fetchAllLanguages(u1, r1),
        fetchAllLanguages(u2, r2),
      ])

      const i1 = computeDeveloperInsights(d1, r1, l1)
      const i2 = computeDeveloperInsights(d2, r2, l2)

      const s1 = calculateTotalStars(r1)
      const s2 = calculateTotalStars(r2)
      const f1 = calculateTotalForks(r1)
      const f2 = calculateTotalForks(r2)
      const age1 = getAccountAge(d1.created_at)
      const age2 = getAccountAge(d2.created_at)
      const avg1 = r1.length > 0 ? s1 / r1.length : 0
      const avg2 = r2.length > 0 ? s2 / r2.length : 0

      const winners: ComparisonData["winners"] = {
        followers: d1.followers > d2.followers ? d1.login : d2.followers > d1.followers ? d2.login : null,
        stars: s1 > s2 ? d1.login : s2 > s1 ? d2.login : null,
        forks: f1 > f2 ? d1.login : f2 > f1 ? d2.login : null,
        repos: d1.public_repos > d2.public_repos ? d1.login : d2.public_repos > d1.public_repos ? d2.login : null,
        following: d1.following > d2.following ? d1.login : d2.following > d1.following ? d2.login : null,
        accountAge: age1.years > age2.years ? d1.login : age2.years > age1.years ? d2.login : null,
        avgStars: avg1 > avg2 ? d1.login : avg2 > avg1 ? d2.login : null,
      }

      setData({ user1: d1, user2: d2, repos1: r1, repos2: r2, languages1: l1, languages2: l2, insights1: i1, insights2: i2, winners })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed")
    } finally {
      setLoading(false)
    }
  }, [user1, user2])

  return (
    <div className="mx-auto max-w-7xl px-gutter py-12">
      {/* Header */}
      <header className="mb-12 flex flex-col items-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
          <GitCompare className="size-8 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Engineering Intelligence <span className="text-primary">Clash</span>
        </h1>
        <p className="max-w-2xl text-base text-on-surface-variant">
          Quantifying technical influence and architectural impact. Comparing developer velocity, open-source contribution, and community traction between two entities.
        </p>
      </header>

      {/* Inputs */}
      <div className="mb-8 flex w-full max-w-2xl mx-auto flex-col gap-3 sm:flex-row">
        <Input placeholder="First username (e.g. vercel)" value={user1} onChange={(e) => setUser1(e.target.value)} className="h-12 rounded-xl border-outline-variant/30 bg-surface-container-low/50 text-base" />
        <Input placeholder="Second username (e.g. shadcn)" value={user2} onChange={(e) => setUser2(e.target.value)} className="h-12 rounded-xl border-outline-variant/30 bg-surface-container-low/50 text-base" />
        <Button onClick={handleCompare} disabled={loading || !user1.trim() || !user2.trim()} className="h-12 shrink-0 gap-2 rounded-xl px-6">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Compare
        </Button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-[20px] p-8">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="size-24 rounded-full" />
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-24" />
                {Array.from({ length: 3 }).map((_, j) => <Skeleton key={j} className="h-10 w-full" />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="glass-card mx-auto max-w-lg rounded-xl p-8 text-center">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={handleCompare} className="mt-4 gap-2"><Loader2 className="size-4" />Retry</Button>
        </div>
      )}

      {data && (
        <div className="space-y-8 animate-slide-up">
          {/* Side by side profiles */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[data.user1, data.user2].filter(Boolean).map((u, i) => {
              const isWinner = Object.values(data.winners).filter(Boolean).includes(u!.login)
              return (
                <div key={u!.id} className={`glass-card relative overflow-hidden rounded-[20px] p-8 ${isWinner ? "ring-1 ring-primary/30" : ""}`}>
                  {isWinner && (
                    <div className="absolute right-4 top-4 z-10">
                      <span className="flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                        <Trophy className="size-3.5" /> Winner
                      </span>
                    </div>
                  )}
                  <div className={`absolute left-0 top-0 h-1 w-full ${i === 0 ? "bg-primary" : "bg-tertiary"}`} />
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <img
                        src={u!.avatar_url}
                        alt=""
                        className={`size-24 rounded-full border-2 p-1 ${i === 0 ? "border-primary" : "border-tertiary"}`}
                      />
                      {data.winners.followers === u!.login && (
                        <div className="absolute -bottom-2 -right-2 rounded-full border-2 border-surface bg-primary p-1.5 text-on-primary shadow-lg">
                          <Trophy className="size-4" />
                        </div>
                      )}
                    </div>
                    <h2 className="text-3xl font-semibold">{u!.name || u!.login}</h2>
                    <p className={`mb-4 font-mono text-base ${i === 0 ? "text-primary" : "text-tertiary"}`}>
                      @{u!.login}
                    </p>
                    {u!.bio && (
                      <p className="mb-6 max-w-xs text-center text-sm text-on-surface-variant">{u!.bio}</p>
                    )}
                    <div className="flex w-full gap-8 border-t border-outline-variant/30 pt-6">
                      <div className="flex-1 text-center">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Stars</p>
                        <p className="text-3xl font-bold">{calculateTotalStars(i === 0 ? data.repos1 : data.repos2).toLocaleString()}</p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Repos</p>
                        <p className="text-3xl font-bold">{u!.public_repos}</p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Followers</p>
                        <p className="text-3xl font-bold">{u!.followers.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Winner Badges */}
          <section>
            <h3 className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Benchmark Achievements</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {METRICS.map((m) => (
                <WinnerBadge key={m.key} winner={data.winners[m.key as keyof typeof data.winners]} label={m.label} />
              ))}
            </div>
          </section>

          {/* Custom Comparison Chart */}
          <div className="glass-card rounded-[20px] p-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-semibold">Velocity Delta</h3>
                <p className="text-sm text-on-surface-variant">Comparative analysis across core repositories.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-primary" />
                  <span className="text-xs font-semibold tracking-wider text-foreground">{data.user1!.login}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-tertiary" />
                  <span className="text-xs font-semibold tracking-wider text-foreground">{data.user2!.login}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <ComparisonBar
                label="FOLLOWERS"
                val1={data.user1!.followers}
                val2={data.user2!.followers}
                color1="#a2c9ff"
                color2="#67df70"
                max={Math.max(data.user1!.followers, data.user2!.followers)}
              />
              <ComparisonBar
                label="STARS"
                val1={calculateTotalStars(data.repos1)}
                val2={calculateTotalStars(data.repos2)}
                color1="#a2c9ff"
                color2="#67df70"
                max={Math.max(calculateTotalStars(data.repos1), calculateTotalStars(data.repos2))}
              />
              <ComparisonBar
                label="FORKS"
                val1={calculateTotalForks(data.repos1)}
                val2={calculateTotalForks(data.repos2)}
                color1="#a2c9ff"
                color2="#67df70"
                max={Math.max(calculateTotalForks(data.repos1), calculateTotalForks(data.repos2))}
              />
              <ComparisonBar
                label="REPOS"
                val1={data.user1!.public_repos}
                val2={data.user2!.public_repos}
                color1="#a2c9ff"
                color2="#67df70"
                max={Math.max(data.user1!.public_repos, data.user2!.public_repos)}
              />
              <ComparisonBar
                label="FOLLOWING"
                val1={data.user1!.following}
                val2={data.user2!.following}
                color1="#a2c9ff"
                color2="#67df70"
                max={Math.max(data.user1!.following, data.user2!.following)}
              />
            </div>
          </div>

          {/* Language Comparison */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {[data.user1, data.user2].filter(Boolean).map((u, i) => {
              const langs = i === 0 ? data.languages1 : data.languages2
              const total = Object.values(langs).reduce((s, b) => s + b, 0)
              const entries = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 5)
              const barColor = i === 0 ? "bg-primary" : "bg-tertiary"
              return (
                <div key={u!.id} className="glass-card rounded-[20px] p-8">
                  <div className="mb-8 flex items-center gap-3">
                    <img src={u!.avatar_url} alt="" className="size-8 rounded-full border object-cover" style={{ borderColor: i === 0 ? "rgba(162,201,255,0.3)" : "rgba(103,223,112,0.3)" }} />
                    <h4 className="text-2xl font-semibold">Tech Stack: {u!.login}</h4>
                  </div>
                  <div className="space-y-5">
                    {entries.length === 0 ? (
                      <p className="text-sm text-on-surface-variant">No language data</p>
                    ) : (
                      entries.map(([name, bytes]) => {
                        const pct = total > 0 ? ((bytes / total) * 100).toFixed(1) : "0"
                        return (
                          <div key={name}>
                            <div className="mb-2 flex justify-between">
                              <span className="font-mono text-sm text-foreground">{name}</span>
                              <span className={`font-mono text-sm ${i === 0 ? "text-primary" : "text-tertiary"}`}>{pct}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!data && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-on-surface-variant/10">
            <GitCompare className="size-8 text-on-surface-variant opacity-50" />
          </div>
          <h2 className="mb-1 text-xl font-semibold">Compare Developers</h2>
          <p className="max-w-sm text-sm text-on-surface-variant">Enter two GitHub usernames above to compare their profiles, statistics, and language distributions side by side.</p>
        </div>
      )}
    </div>
  )
}
