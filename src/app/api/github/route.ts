import { NextRequest, NextResponse } from "next/server"

const GITHUB_API = "https://api.github.com"

interface CacheEntry {
  data: unknown
  timestamp: number
  wasAuthenticated: boolean
}

const serverCache = new Map<string, CacheEntry>()
const SERVER_CACHE_TTL = 5 * 60 * 1000

let lastKnownAuth = false

function checkAuthState() {
  const rawToken = process.env.GITHUB_TOKEN
  const hasValidToken = !!rawToken && rawToken !== "ghp_replace_with_your_github_token"
  if (hasValidToken !== lastKnownAuth) {
    if (hasValidToken) {
      console.log("[GitScope] Valid token detected — clearing server cache to force authenticated requests.")
    }
    serverCache.clear()
    lastKnownAuth = hasValidToken
  }
  return hasValidToken
}

export async function GET(request: NextRequest) {
  const endpoint = request.nextUrl.searchParams.get("endpoint")

  if (!endpoint) {
    return NextResponse.json({ error: "Missing 'endpoint' query parameter" }, { status: 400 })
  }

  const hasValidToken = checkAuthState()
  const token = process.env.GITHUB_TOKEN
  const isPlaceholder = !!token && token === "ghp_replace_with_your_github_token"

  if (isPlaceholder) {
    console.warn("[GitScope] GITHUB_TOKEN is set to the example placeholder. Replace it with a real token in .env.local for authenticated requests.")
  } else if (hasValidToken) {
    console.log("[GitScope] Token present — requests are authenticated.")
  } else if (process.env.NODE_ENV === "development") {
    console.warn("[GitScope] No GITHUB_TOKEN configured. Using public API (60 req/hr limit). Set GITHUB_TOKEN in .env.local for 5,000 req/hr.")
  }

  if (hasValidToken) {
    const cached = serverCache.get(endpoint)
    if (cached && Date.now() - cached.timestamp < SERVER_CACHE_TTL) {
      return NextResponse.json(cached.data)
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitScope/1.0",
  }

  if (hasValidToken && token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const url = `${GITHUB_API}${endpoint}`
    const res = await fetch(url, { headers })

    const rateLimit = res.headers.get("X-RateLimit-Limit")
    const rateRemaining = res.headers.get("X-RateLimit-Remaining")
    const rateReset = res.headers.get("X-RateLimit-Reset")

    console.log(
      `[GitScope] ${endpoint} → ${res.status} | Rate: ${rateRemaining}/${rateLimit}` +
      (rateReset ? ` | Resets: ${new Date(parseInt(rateReset) * 1000).toISOString()}` : "")
    )

    if (res.status === 404) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (res.status === 401) {
      return NextResponse.json(
        { error: "GitHub token is invalid. Please check your GITHUB_TOKEN in .env.local." },
        { status: 401 }
      )
    }

    if (res.status === 403 || res.status === 429) {
      const body = await res.text()
      const isRateLimit = body.toLowerCase().includes("rate limit")
      return NextResponse.json(
        {
          error: isRateLimit
            ? "GitHub API rate limit reached. Please try again later."
            : "Access denied. Please check your GitHub token.",
          rateLimit: {
            limit: rateLimit ? parseInt(rateLimit) : null,
            remaining: rateRemaining ? parseInt(rateRemaining) : null,
            reset: rateReset ? parseInt(rateReset) : null,
          },
        },
        {
          status: isRateLimit ? 429 : 403,
          headers: {
            "X-RateLimit-Limit": rateLimit || "unknown",
            "X-RateLimit-Remaining": rateRemaining || "0",
            "X-RateLimit-Reset": rateReset || "0",
          },
        }
      )
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    if (hasValidToken) {
      serverCache.set(endpoint, { data, timestamp: Date.now(), wasAuthenticated: hasValidToken })
    }
    return NextResponse.json(data, {
      headers: {
        "X-RateLimit-Limit": rateLimit || "unknown",
        "X-RateLimit-Remaining": rateRemaining || "unknown",
        "X-RateLimit-Reset": rateReset || "unknown",
      },
    })
  } catch (error) {
    const message = error instanceof TypeError && error.message === "fetch failed"
      ? "Network error. Please check your connection and try again."
      : "An unexpected error occurred."
    return NextResponse.json({ error: message }, { status: 503 })
  }
}
