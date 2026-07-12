"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { GitHubUser, GitHubRepo, LanguageBreakdown } from "@/types/github";
import { fetchUser, fetchRepos, fetchAllLanguages } from "@/lib/github";
import { computeDeveloperInsights } from "@/lib/insights";
import { SearchBar } from "@/components/search-bar";
import { ProfileCard } from "@/components/profile-card";
import { RepoStats } from "@/components/repo-stats";
import { RepoAnalytics } from "@/components/repo-analytics";
import { LanguageChart } from "@/components/language-chart";
import { ContributionActivity } from "@/components/contribution-activity";
import { DeveloperInsights } from "@/components/developer-insights";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { ErrorBoundary } from "@/components/error-boundary";
import { EmptyState } from "@/components/empty-state";
import { ExportCardButton } from "@/components/export-card-button";
import { ExportProfileCard } from "@/components/export-profile-card";
import { computeExportCardStats } from "@/lib/exportStats";
import {
  Copy,
  Check,
  ExternalLink,
  BarChart3,
  Code2,
  GitCommitHorizontal,
  Lightbulb,
  FolderOpen,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function HomeContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [languages, setLanguages] = useState<LanguageBreakdown>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLangLoading, setIsLangLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const usernameFromUrl = searchParams.get("user");
  const [searched, setSearched] = useState(!!usernameFromUrl);
  const lastSearched = useRef("");

  const handleSearch = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);
    setSearched(true);
    setLanguages({});
    setUser(null);
    setRepos([]);

    window.history.replaceState(
      null,
      "",
      `/?user=${encodeURIComponent(username)}`,
    );

    try {
      const [userData, reposData] = await Promise.all([
        fetchUser(username),
        fetchRepos(username),
      ]);
      setUser(userData);
      setRepos(reposData);

      setIsLangLoading(true);
      fetchAllLanguages(username, reposData)
        .then((langData) => {
          setLanguages(langData);
          setIsLangLoading(false);
        })
        .catch(() => setIsLangLoading(false));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (usernameFromUrl && usernameFromUrl !== lastSearched.current) {
      lastSearched.current = usernameFromUrl;
      handleSearch(usernameFromUrl);
    }
  }, [usernameFromUrl]);

  const handleCopyUrl = async () => {
    const url = user
      ? `${window.location.origin}/user/${user.login}`
      : window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const insights = user
    ? computeDeveloperInsights(user, repos, languages)
    : null;
  const exportId = "gitscope-export";
  const exportStats =
    user && repos.length > 0 ? computeExportCardStats(repos, languages) : null;

  return (
    <div className="mx-auto max-w-7xl px-gutter py-12">
      {/* Hero Section — always visible title + search */}
      <section className="relative flex flex-col items-center pt-8 pb-4 text-center">
        {/* Glow Orbs — shown only on initial state */}
        {!searched && !isLoading && !error && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-full -translate-x-1/2 -translate-y-1/2">
            <div className="glow-orb absolute left-1/4 top-0 size-[400px] rounded-full bg-primary opacity-[0.15] blur-[100px]" />
            <div className="glow-orb absolute bottom-0 right-1/4 size-[500px] rounded-full bg-secondary opacity-[0.15] blur-[100px]" />
          </div>
        )}

        {/* Title — hidden when results are showing */}
        {!searched && !isLoading && !error && (
          <div className="animate-slide-up mb-8" style={{ animationDelay: "100ms" }}>
            <div className="animate-float">
              <h1 className="text-5xl font-bold tracking-tighter text-primary md:text-6xl">
                Git<span className="text-foreground">Scope</span>
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-base text-on-surface-variant">
                Next-generation engineering intelligence for modern dev teams.
                Understand your repositories like never before.
              </p>
            </div>
          </div>
        )}

        {/* Search Container — always visible */}
        <div className="w-full max-w-2xl px-4">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </section>

      {/* Bento Grid + CTA — shown only on initial state */}
      {!searched && !isLoading && !error && (
        <>
        <section className="w-full py-16">
          <h2 className="mb-16 text-center text-3xl font-semibold animate-slide-up">
            Core Intelligence Modules
          </h2>
          <div className="grid h-auto grid-cols-1 gap-6 md:h-[600px] md:grid-cols-6">
              {/* Repository Analytics */}
              <div className="flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-low/50 p-8 transition-all hover:ring-1 hover:ring-primary/50 md:col-span-3">
                <div>
                  <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <BarChart3 className="size-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-2xl font-semibold">Repository Analytics</h3>
                  <p className="text-base text-on-surface-variant">Deep dive into commit patterns, code churn, and contributor velocity over time.</p>
                </div>
                <div className="mt-8 flex h-32 items-end gap-1 overflow-hidden rounded-xl bg-surface-container-highest/30 px-4">
                  <div className="h-[40%] w-full rounded-t-sm bg-primary/40" />
                  <div className="h-[70%] w-full rounded-t-sm bg-primary/60" />
                  <div className="h-[50%] w-full rounded-t-sm bg-primary" />
                  <div className="h-[90%] w-full rounded-t-sm bg-primary/40" />
                  <div className="h-[60%] w-full rounded-t-sm bg-primary/80" />
                  <div className="h-[30%] w-full rounded-t-sm bg-primary" />
                </div>
              </div>

              {/* Language Distribution */}
              <div className="flex flex-col rounded-2xl border border-outline-variant/30 bg-surface-container-low/50 p-8 transition-all hover:ring-1 hover:ring-primary/50 md:col-span-3">
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-secondary/10">
                  <Code2 className="size-6 text-secondary" />
                </div>
                <h3 className="mb-2 text-2xl font-semibold">Language Distribution</h3>
                <p className="mb-8 text-base text-on-surface-variant">Granular breakdown of technology stacks and file complexity across your codebase.</p>
                <div className="flex flex-1 items-center justify-center">
                  <div className="relative flex size-40 items-center justify-center rounded-full border-8 border-surface-container-highest">
                    <div className="absolute inset-0 rounded-full border-8 border-primary" style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)" }} />
                    <span className="text-sm font-medium text-foreground">65% TS</span>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="flex flex-col rounded-2xl border border-outline-variant/30 bg-surface-container-low/50 p-8 transition-all hover:ring-1 hover:ring-primary/50 md:col-span-2">
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-tertiary/10">
                  <GitCommitHorizontal className="size-6 text-tertiary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Activity Timeline</h3>
                <p className="mb-4 text-sm text-on-surface-variant">Real-time visualization of developer interaction pulses.</p>
                <div className="mt-auto flex flex-col gap-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant"><div className="h-full w-3/4 rounded-full bg-tertiary" /></div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant"><div className="h-full w-1/2 rounded-full bg-tertiary" /></div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant"><div className="h-full w-5/6 rounded-full bg-tertiary" /></div>
                </div>
              </div>

              {/* Developer Insights */}
              <div className="flex flex-col rounded-2xl border border-outline-variant/30 bg-surface-container-low/50 p-8 transition-all hover:ring-1 hover:ring-primary/50 md:col-span-2">
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary-container/10">
                  <Lightbulb className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Developer Insights</h3>
                <p className="mb-4 text-sm text-on-surface-variant">Individual contribution metrics with focus on quality and impact.</p>
                <div className="mt-6 flex -space-x-2">
                  <div className="size-8 rounded-full border border-outline-variant bg-surface-container" />
                  <div className="size-8 rounded-full border border-outline-variant bg-primary/40" />
                  <div className="size-8 rounded-full border border-outline-variant bg-secondary/40" />
                  <div className="flex size-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest text-[10px]">+12</div>
                </div>
              </div>

              {/* Smart Filtering */}
              <div className="flex flex-col rounded-2xl border border-outline-variant/30 bg-surface-container-low/50 p-8 transition-all hover:ring-1 hover:ring-primary/50 md:col-span-2">
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-on-surface-variant/10">
                  <Search className="size-6 text-on-surface-variant" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Smart Filtering</h3>
                <p className="mb-4 text-sm text-on-surface-variant">Natural language queries for complex dataset manipulation.</p>
                <div className="mt-6 rounded-lg bg-surface-container px-3 py-2 font-mono text-xs text-primary">
                  query: commits &gt; 100 AND label: &quot;feat&quot;
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Hidden export card – captured by html-to-image */}
      {user && exportStats && (
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <ExportProfileCard
            user={user}
            repos={repos}
            languages={languages}
            stats={exportStats}
          />
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="mt-6">
          <DashboardSkeleton />
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="mt-6">
          <EmptyState
            type={
              error.toLowerCase().includes("rate limit")
                ? "api-error"
                : error.toLowerCase().includes("not found")
                  ? "not-found"
                  : "api-error"
            }
            username={usernameFromUrl || undefined}
            message={error}
            onRetry={() => handleSearch(usernameFromUrl || "")}
          />
        </div>
      )}

      {/* Dashboard */}
      {user && !isLoading && (
        <div id={exportId} className="mt-6 space-y-6 animate-slide-up">
          {/* Export & Share bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="size-4" />
              <span>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  @{user.login}
                </a>
                {" / "}
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="h-auto p-0 text-muted-foreground hover:text-primary"
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
              </span>
            </div>
            <ExportCardButton filename={`profile-${user.login}`} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div id="profile-card-export">
                <ProfileCard user={user} />
              </div>
            </div>
            <div className="lg:col-span-2">
              <RepoStats repos={repos} />
            </div>
          </div>

          {insights && <DeveloperInsights data={insights} />}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LanguageChart languages={languages} isLoading={isLangLoading} />
            <ContributionActivity repos={repos} />
          </div>

          <ErrorBoundary>
            <RepoAnalytics repos={repos} />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
