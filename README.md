# GitScope — GitHub Profile Analyzer

A developer-focused tool for analyzing GitHub profiles — language distribution, contribution activity, repository analytics, and developer insights.

Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Recharts.

## Features

- **Profile Analytics** — View followers, repos, stars, forks, account age, and more
- **Language Distribution** — Interactive donut chart + horizontal bars with per-language breakdown
- **Repository Analytics** — Sort, filter, and analyze repos by stars, forks, language, activity
- **Contribution Activity** — Timeline of creation, push, and update patterns
- **Developer Insights** — AI-style summary, developer classification (Frontend/Backend/Full Stack/Mobile/Data/Generalist), top repos, key ratios
- **Profile Comparison** — Compare two users side-by-side with winner badges and comparison charts
- **Share & Export** — Shareable profile URLs, export as PNG or PDF
- **GitHub Dark Mode** — UI styled after GitHub's dark theme (#0D1117)

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### GitHub Token (Optional)

Without a token, the GitHub API is limited to 60 requests/hour. Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Generate a token at [github.com/settings/tokens](https://github.com/settings/tokens) (no special scopes needed for public data) and add it to `.env.local`:

```
GITHUB_TOKEN=your_token_here
```

With a token, the limit increases to 5,000 requests/hour.

## Usage

- **Search** — Enter a GitHub username on the homepage to load their profile dashboard
- **Direct URL** — Navigate to `/?user=username` or `/user/username`
- **Compare** — Go to `/compare` to compare two profiles side by side

## Tech Stack

- [Next.js](https://nextjs.org/) 16 — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [shadcn/ui](https://ui.shadcn.com/) components
- [Recharts](https://recharts.org/) — data visualization
- [SWR](https://swr.vercel.app/) — client-side caching
- [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF) — export
- [Lucide](https://lucide.dev/) — icons
