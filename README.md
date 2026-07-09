<div align="center">
  <img src="public/globe.svg" alt="GitScope" width="80" />
  <h1 align="center">GitScope</h1>
  <p><strong>GitHub Profile Analyzer</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Structure</a> •
    <a href="#api">API</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#license">License</a>
  </p>
</div>

<br />

**GitScope** is a Next.js application that provides comprehensive analytics for any public GitHub profile. Enter a username to view detailed repository statistics, language distribution, contribution activity, developer classification, and side-by-side user comparisons.

![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000000?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

### Profile Dashboard
- **Profile Card** — avatar, bio, location, company, social links, follower/following/repo counts, hireable badge
- **Repository Stats** — total stars, forks, languages, disk size (MB), average stars per repo, top starred repo
- **Language Distribution** — interactive donut chart with top-5 breakdown bars and legend (Recharts)
- **Contribution Activity** — stacked bar chart of repo creation/update/push events over the last 12 months
- **Top Repositories** — sortable/filterable list of top 10 repos by stars
- **Full Repository Analytics** — searchable, filterable (all/sources/forks/archived), sortable (stars/forks/updated/name) table with summary cards and highlights

### Developer Insights
- **AI Overview** — generated natural-language summary of the developer's profile
- **Developer Classification** — classifies into Frontend, Backend, Full Stack, Mobile, Data, or Generalist based on language ratios
- **12 Key Metrics** — primary language, total repos/stars/forks, most-starred repo, account age, average stars/forks per repo, most recent activity, repo creation trend, watchers, open issues
- **Secondary Stats** — language count, source/fork/archived breakdown
- **Top Language Progress Bars** — proportional language usage visualization

### Compare Mode (`/compare`)
- Side-by-side profile comparison for any two GitHub users
- Winner badges across 7 categories: followers, stars, forks, repos, following, account age, average stars
- 5-metric bar chart comparison
- Language distribution comparison (top-5 each)

### Export & Share
- Premium profile card export as 3× PNG (via `html-to-image`)
- Keyboard shortcut: `Ctrl/Cmd+Shift+E`
- URL copy/share with `?user=` query parameter

### User Detail Pages (`/user/[username]`)
- Direct URL access to any GitHub user's dashboard
- Same analytics layout as the home page result view

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, `"use client"` pages) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + `tailwindcss-animate` |
| **UI Components** | shadcn/ui (base-nova) + @base-ui/react |
| **Icons** | Lucide React |
| **Charts** | Recharts (PieChart, BarChart) |
| **Data Fetching** | SWR (stale-while-revalidate, 5-min dedup) |
| **Image Export** | html-to-image |
| **Class Management** | clsx + tailwind-merge + class-variance-authority |
| **Fonts** | Geist Sans / Geist Mono via `next/font/google` |
| **Package Manager** | npm |

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun 1.0+)
- A [GitHub Personal Access Token](https://github.com/settings/tokens) (optional, but strongly recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/github_analyzer.git
cd github_analyzer

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

Edit `.env.local` and add your GitHub token:

```env
GITHUB_TOKEN=ghp_your_token_here
```

> Without a token, you are limited to 60 requests/hour. With a token, the limit increases to 5,000 requests/hour.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Search for any GitHub username (e.g. `vercel`, `shadcn`, `tailwindlabs`).

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── diag/route.ts          # Token diagnostic endpoint
│   │   └── github/route.ts        # GitHub API proxy (caching, rate-limit handling)
│   ├── compare/page.tsx           # /compare — side-by-side user comparison
│   ├── user/[username]/page.tsx   # /user/:username — direct profile dashboard
│   ├── layout.tsx                 # Root layout (SWRConfig, NavBar, fonts, dark mode)
│   ├── page.tsx                   # / — home page with search + dashboard
│   └── globals.css                # Tailwind v4 imports, dark theme, animations
├── components/
│   ├── ui/                        # shadcn/ui primitives (badge, button, card, input, select, separator, skeleton)
│   ├── ai-summary.tsx             # AI Overview card with loading skeleton
│   ├── contribution-activity.tsx   # 12-month stacked bar chart
│   ├── dashboard-skeleton.tsx     # Full-page loading skeleton
│   ├── developer-classification.tsx # Developer type badge + description
│   ├── developer-insights.tsx     # Metrics aggregation component
│   ├── empty-state.tsx            # Contextual empty/error/not-found states
│   ├── error-boundary.tsx         # React error boundary
│   ├── error-state.tsx            # Error display (not found, rate limit, generic)
│   ├── export-card-button.tsx     # Export dropdown + keyboard shortcut
│   ├── export-profile-card.tsx    # Hidden 1200×630 premium export card
│   ├── insight-card.tsx           # Reusable metric card
│   ├── language-chart.tsx         # Interactive donut chart + top-5 breakdown
│   ├── nav-bar.tsx                # Sticky navigation bar
│   ├── profile-card.tsx           # User profile card
│   ├── repo-analytics.tsx         # Full repo table with filters/sorts/search
│   ├── repo-stats.tsx             # 6-stat summary grid
│   ├── search-bar.tsx             # Hero search with suggestions
│   └── top-repos.tsx              # Top 10 repos list
├── lib/
│   ├── exportProfileCard.ts       # html-to-image export helpers
│   ├── exportStats.ts             # Commit/streak estimation, language colors
│   ├── github.ts                  # GitHub API client (fetch + cache + dedup)
│   ├── github-hooks.ts            # SWR hooks: useGitHubUser, useGitHubRepos, useGitHubLanguages
│   ├── insights.ts                # computeDeveloperInsights, determineDeveloperType
│   └── utils.ts                   # cn() utility
└── types/
    └── github.ts                  # TypeScript interfaces (GitHubUser, GitHubRepo, etc.)
```

## API

### Internal Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/github?endpoint=/users/:username` | GET | Proxies GitHub REST API v3 with server-side caching |
| `/api/diag` | GET | Diagnoses token configuration and GitHub connectivity |

The GitHub proxy handles:
- Bearer token injection from `GITHUB_TOKEN` env var
- 5-minute TTL caching for authenticated requests
- Rate-limit header passthrough
- Error translation (404 → user not found, 401 → invalid token, 403/429 → rate limited)

### TypeScript Types (`src/types/github.ts`)

- `GitHubUser` — full user profile shape from the GitHub API
- `GitHubRepo` — full repository shape
- `LanguageBreakdown` — `Record<string, number>` of bytes per language
- `SortOption` / `FilterOption` — sort/filter enum types
- `DeveloperType` — classification categories
- `DeveloperInsightsData` — computed analytics payload
- `ComparisonData` — comparison page data shape

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITHUB_TOKEN` | No | — | GitHub personal access token (increases rate limit to 5,000 req/h) |

### SWR Configuration

Set in `src/app/layout.tsx`:
- Deduping interval: 5 minutes
- Revalidation on focus: off
- Revalidation on reconnect: off
- Error retry count: 2

## Deployment

### Vercel (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set `GITHUB_TOKEN` as an environment variable in your Vercel project settings.

### Other Platforms

Build the static export or run as a Node.js server:

```bash
npm run build
npm start
```

## Screenshots

> _Screenshots to be added. Key views:_
> - Home page with search and suggestions
> - User profile dashboard (stats, charts, insights)
> - Compare mode (side-by-side profiles + winner badges)
> - Premium export card

## License

[MIT](LICENSE) © 2026 Tabiq
