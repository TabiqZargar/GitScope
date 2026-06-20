import { NextRequest, NextResponse } from "next/server"

const GITHUB_API = "https://api.github.com"

export async function GET(request: NextRequest) {
  const endpoint = request.nextUrl.searchParams.get("endpoint")

  if (!endpoint) {
    return NextResponse.json({ error: "Missing 'endpoint' query parameter" }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN

  if (!token && process.env.NODE_ENV === "development") {
    console.warn("[GitScope] No GITHUB_TOKEN configured. Using public API (60 req/hr limit). Set GITHUB_TOKEN in .env.local for 5,000 req/hr.")
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitScope/1.0",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const url = `${GITHUB_API}${endpoint}`
    const res = await fetch(url, { headers })

    if (res.status === 404) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (res.status === 403) {
      const body = await res.text()
      const isRateLimit = body.toLowerCase().includes("rate limit")
      return NextResponse.json(
        { error: isRateLimit
          ? "GitHub API rate limit reached. Please try again later."
          : "Access denied. Please check your GitHub token."
        },
        { status: isRateLimit ? 429 : 403 }
      )
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof TypeError && error.message === "fetch failed"
      ? "Network error. Please check your connection and try again."
      : "An unexpected error occurred."
    return NextResponse.json({ error: message }, { status: 503 })
  }
}
