import { NextResponse } from "next/server"

const GITHUB_API = "https://api.github.com"

export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const hasToken = !!token
  const isPlaceholder = token === "ghp_replace_with_your_github_token"
  const maskedToken = hasToken && !isPlaceholder
    ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}`
    : null

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    token: {
      present: hasToken,
      placeholderValue: isPlaceholder,
      masked: maskedToken,
      length: token ? token.length : 0,
      note: isPlaceholder
        ? "Token is set to the example placeholder — replace it with a real GitHub token."
        : hasToken
          ? "Token is configured and will be used for authenticated requests."
          : "No token configured. Falling back to public API (60 req/hr).",
    },
  }

  if (hasToken && !isPlaceholder) {
    const report: Record<string, unknown> = {}
    report.tokenConfigured = true

    const endpoints = [
      { name: "Root (Quick)", url: `${GITHUB_API}` },
      { name: "Rate Limit", url: `${GITHUB_API}/rate_limit` },
    ]

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep.url, {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "GitScope/1.0",
            Authorization: `Bearer ${token}`,
          },
        })

        const limit = res.headers.get("X-RateLimit-Limit")
        const remaining = res.headers.get("X-RateLimit-Remaining")
        const reset = res.headers.get("X-RateLimit-Reset")

        report[ep.name] = {
          status: res.status,
          ok: res.ok,
          rateLimit: {
            limit: limit ? parseInt(limit) : null,
            remaining: remaining ? parseInt(remaining) : null,
            reset: reset ? new Date(parseInt(reset) * 1000).toISOString() : null,
          },
        }
      } catch (err) {
        report[ep.name] = {
          error: err instanceof Error ? err.message : String(err),
        }
      }
    }

    results.diagnosticRequests = report
  }

  return NextResponse.json(results)
}
