"use client"

import { useState, useCallback } from "react"
import type { GitHubUser, GitHubRepo, LanguageBreakdown, ComparisonData } from "@/types/github"
import { fetchUser, fetchRepos, fetchAllLanguages, calculateTotalStars, calculateTotalForks, getAccountAge } from "@/lib/github"
import { computeDeveloperInsights } from "@/lib/insights"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
    <div className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2">
      <Trophy className="size-4 text-yellow-400 shrink-0" />
      <span className="text-xs">
        <strong className="text-yellow-400">{winner}</strong>
        <span className="text-muted-foreground"> &middot; {label}</span>
      </span>
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

  const chartData = data ? [
    { name: "Followers", [data.user1!.login]: data.user1!.followers, [data.user2!.login]: data.user2!.followers },
    { name: "Following", [data.user1!.login]: data.user1!.following, [data.user2!.login]: data.user2!.following },
    { name: "Repos", [data.user1!.login]: data.user1!.public_repos, [data.user2!.login]: data.user2!.public_repos },
    { name: "Stars", [data.user1!.login]: calculateTotalStars(data.repos1), [data.user2!.login]: calculateTotalStars(data.repos2) },
    { name: "Forks", [data.user1!.login]: calculateTotalForks(data.repos1), [data.user2!.login]: calculateTotalForks(data.repos2) },
  ] : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <GitCompare className="size-6 text-primary" />
          <h1 className="text-2xl font-bold">Profile Comparison</h1>
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-lg">
          Compare two GitHub profiles side by side — followers, stars, languages, and more.
        </p>

        <div className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
          <Input placeholder="First username (e.g. vercel)" value={user1} onChange={(e) => setUser1(e.target.value)} className="h-10" />
          <Input placeholder="Second username (e.g. shadcn)" value={user2} onChange={(e) => setUser2(e.target.value)} className="h-10" />
          <Button onClick={handleCompare} disabled={loading || !user1.trim() || !user2.trim()} className="h-10 shrink-0 gap-2">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Compare
          </Button>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4"><Skeleton className="size-16 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div></div>
                {Array.from({ length: 6 }).map((_, j) => <Skeleton key={j} className="h-10 w-full" />)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card className="border-destructive/30">
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={handleCompare} className="mt-4 gap-2"><Loader2 className="size-4" />Retry</Button>
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="space-y-6 animate-slide-up">
          {/* Winner summary */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Trophy className="size-4 text-yellow-400" />Winner Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {METRICS.map((m) => (
                  <WinnerBadge key={m.key} winner={data.winners[m.key as keyof typeof data.winners]} label={m.label} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Side by side profiles */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[data.user1, data.user2].filter(Boolean).map((u, i) => (
              <Card key={u!.id}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <img src={u!.avatar_url} alt="" className="size-16 rounded-full ring-2 ring-border" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{u!.name || u!.login}</h3>
                        {data.winners.followers === u!.login && <Trophy className="size-3.5 text-yellow-400" />}
                      </div>
                      <a href={u!.html_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">@{u!.login}</a>
                      {u!.bio && <p className="mt-1 text-xs text-foreground/70 line-clamp-2">{u!.bio}</p>}
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-secondary/50 p-2"><span className="text-muted-foreground">Followers</span><p className="font-semibold">{u!.followers.toLocaleString()}</p></div>
                    <div className="rounded-lg bg-secondary/50 p-2"><span className="text-muted-foreground">Following</span><p className="font-semibold">{u!.following.toLocaleString()}</p></div>
                    <div className="rounded-lg bg-secondary/50 p-2"><span className="text-muted-foreground">Repos</span><p className="font-semibold">{u!.public_repos}</p></div>
                    <div className="rounded-lg bg-secondary/50 p-2"><span className="text-muted-foreground">Stars</span><p className="font-semibold">{calculateTotalStars(i === 0 ? data.repos1 : data.repos2).toLocaleString()}</p></div>
                    <div className="rounded-lg bg-secondary/50 p-2"><span className="text-muted-foreground">Forks</span><p className="font-semibold">{calculateTotalForks(i === 0 ? data.repos1 : data.repos2).toLocaleString()}</p></div>
                    <div className="rounded-lg bg-secondary/50 p-2"><span className="text-muted-foreground">Account Age</span><p className="font-semibold">{getAccountAge(u!.created_at).label}</p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison chart */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="size-4 text-primary" />Statistics Comparison</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: "Followers", [data.user1!.login]: data.user1!.followers, [data.user2!.login]: data.user2!.followers },
                    { name: "Following", [data.user1!.login]: data.user1!.following, [data.user2!.login]: data.user2!.following },
                    { name: "Repos", [data.user1!.login]: data.user1!.public_repos, [data.user2!.login]: data.user2!.public_repos },
                    { name: "Stars", [data.user1!.login]: calculateTotalStars(data.repos1), [data.user2!.login]: calculateTotalStars(data.repos2) },
                    { name: "Forks", [data.user1!.login]: calculateTotalForks(data.repos1), [data.user2!.login]: calculateTotalForks(data.repos2) },
                  ]} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#30363d" }} />
                    <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                          <p className="text-xs text-muted-foreground mb-1">{label}</p>
                          {payload.map((p) => <p key={p.name} className="text-xs" style={{ color: p.color }}>{p.name}: {p.value?.toLocaleString()}</p>)}
                        </div>
                      )
                    }} cursor={{ fill: "#21262d" }} />
                    <Bar dataKey={data.user1!.login} fill="#58a6ff" radius={[3, 3, 0, 0]} />
                    <Bar dataKey={data.user2!.login} fill="#3fb950" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="size-3 rounded-sm bg-[#58a6ff]" />{data.user1!.login}</span>
                <span className="flex items-center gap-1"><span className="size-3 rounded-sm bg-[#3fb950]" />{data.user2!.login}</span>
              </div>
            </CardContent>
          </Card>

          {/* Language comparison */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Code2 className="size-4 text-primary" />Language Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {[data.user1, data.user2].filter(Boolean).map((u, i) => {
                  const langs = i === 0 ? data.languages1 : data.languages2
                  const total = Object.values(langs).reduce((s, b) => s + b, 0)
                  const entries = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 5)
                  return (
                    <div key={u!.id}>
                      <p className="text-xs font-medium text-muted-foreground mb-3">{u!.login}</p>
                      {entries.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No language data</p>
                      ) : (
                        <div className="space-y-2">
                          {entries.map(([name, bytes]) => (
                            <div key={name}>
                              <div className="mb-0.5 flex justify-between text-xs"><span>{name}</span><span className="text-muted-foreground">{((bytes / total) * 100).toFixed(1)}%</span></div>
                              <div className="h-1.5 w-full rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(bytes / total) * 100}%` }} /></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!data && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <GitCompare className="size-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-semibold mb-1">Compare Developers</h2>
          <p className="text-sm text-muted-foreground max-w-sm">Enter two GitHub usernames above to compare their profiles, statistics, and language distributions side by side.</p>
        </div>
      )}
    </div>
  )
}
