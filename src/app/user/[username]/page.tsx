"use client";

import { useState, use } from "react";
import {
  useGitHubUser,
  useGitHubRepos,
  useGitHubLanguages,
} from "@/lib/github-hooks";
import { computeDeveloperInsights } from "@/lib/insights";
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
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [copied, setCopied] = useState(false);

  const {
    data: user,
    error: userError,
    isValidating: userLoading,
  } = useGitHubUser(username);
  const {
    data: reposData,
    error: reposError,
    isValidating: reposLoading,
  } = useGitHubRepos(username);
  const { data: languages, isValidating: langLoading } = useGitHubLanguages(
    username,
    user ? reposData || null : null,
  );

  const repos = reposData || [];
  const isLoading = userLoading || reposLoading;
  const error = userError || reposError;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const insights =
    user && repos.length > 0
      ? computeDeveloperInsights(user, repos, languages || {})
      : null;
  const exportId = "gitscope-export";
  const exportStats =
    user && repos.length > 0
      ? computeExportCardStats(repos, languages || {})
      : null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-gutter py-12">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-gutter py-12">
        <div className="mt-6">
          <EmptyState
            type={
              error.toLowerCase().includes("rate limit")
                ? "api-error"
                : error.toLowerCase().includes("not found")
                  ? "not-found"
                  : "api-error"
            }
            username={username}
            message={error}
          />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-gutter py-12">
      {/* Hidden export card – captured by html-to-image */}
      {exportStats && (
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
            languages={languages || {}}
            stats={exportStats}
          />
        </div>
      )}

      <div id={exportId} className="space-y-6 animate-slide-up">
        {/* Share bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="size-4" />
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              @{user.login}
            </a>
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
          </div>
          <ExportCardButton filename={`profile-${user.login}`} />
        </div>

        {/* 12-column grid layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Column 1: Profile Panel (4 cols) */}
          <aside className="space-y-6 md:col-span-4">
            <ProfileCard user={user} />
          </aside>

          {/* Column 2 & 3: Stats & Content (8 cols) */}
          <section className="space-y-6 md:col-span-8">
            <RepoStats repos={repos} />

            {/* Insights banner */}
            {insights && (
              <div className="relative overflow-hidden rounded-xl border border-outline-variant/30 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8">
                <div className="relative z-10">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    Engineering Insights
                  </span>
                  <h2 className="mb-4 text-3xl font-semibold">Developer Profile Summary</h2>
                  <p className="mb-6 leading-relaxed text-on-surface-variant">{insights.summary}</p>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-tertiary" /> Classified as{" "}
                      <strong className="text-foreground">{insights.developerType}</strong>
                    </span>
                    <span className="text-outline-variant">|</span>
                    <span className="flex items-center gap-1">
                      Primary: <strong className="text-foreground">{insights.primaryLanguage || "N/A"}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LanguageChart languages={languages || {}} isLoading={langLoading} />
              <ContributionActivity repos={repos} />
            </div>

            {/* Repo Analytics */}
            <ErrorBoundary>
              <RepoAnalytics repos={repos} />
            </ErrorBoundary>
          </section>
        </div>
      </div>
    </div>
  );
}
