"use client"

import type { GitHubUser } from "@/types/github"
import { computeExportCardStats, getLanguageColor, type ExportCardStats } from "@/lib/exportStats"

interface ExportProfileCardProps {
  user: GitHubUser
  repos: { stargazers_count: number; forks_count: number; fork: boolean; size: number; created_at: string; pushed_at: string; updated_at: string }[]
  languages: Record<string, number>
  stats?: ExportCardStats
}

export function ExportProfileCard({ user, repos, languages, stats }: ExportProfileCardProps) {
  const cardStats = stats ?? computeExportCardStats(repos as any, languages)

  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const sortedLangs = [...cardStats.topLanguages].sort((a, b) => b.percentage - a.percentage)
  const maxLangPercent = sortedLangs[0]?.percentage ?? 0

  return (
    <div
      id="gitscope-export-card"
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1c2333 100%)",
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        fontFamily: '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      }}
    >
      {/* Subtle ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(88,166,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-60px",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(130,80,223,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          padding: "36px 40px",
          gap: "32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left column – Avatar + name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "280px",
            flexShrink: 0,
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              padding: "3px",
              background: "linear-gradient(135deg, #58a6ff, #8250df)",
              boxShadow: "0 0 30px rgba(88,166,255,0.25)",
            }}
          >
            <img
              src={user.avatar_url}
              alt=""
              style={{
                width: "114px",
                height: "114px",
                borderRadius: "50%",
                display: "block",
                background: "#161b22",
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: "#e6edf3",
                fontSize: "28px",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {user.name || user.login}
            </div>
            <div
              style={{
                color: "#8b949e",
                fontSize: "16px",
                fontWeight: 500,
                marginTop: "4px",
              }}
            >
              @{user.login}
            </div>
          </div>
          {user.bio && (
            <div
              style={{
                color: "#8b949e",
                fontSize: "13px",
                lineHeight: 1.5,
                textAlign: "center",
                maxWidth: "240px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {user.bio}
            </div>
          )}
        </div>

        {/* Right column – Stats */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          {/* Stat cards row 1 */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "Followers", value: user.followers.toLocaleString(), color: "#58a6ff" },
              { label: "Following", value: user.following.toLocaleString(), color: "#3fb950" },
              { label: "Repos", value: user.public_repos.toLocaleString(), color: "#d29922" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  background: "rgba(22,27,34,0.6)",
                  border: "1px solid rgba(48,54,61,0.5)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  textAlign: "center",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ color: stat.color, fontSize: "24px", fontWeight: 700, lineHeight: 1.2 }}>
                  {stat.value}
                </div>
                <div style={{ color: "#8b949e", fontSize: "12px", fontWeight: 500, marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Stat cards row 2 */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "Stars", value: cardStats.totalStars.toLocaleString(), color: "#d29922" },
              { label: "Commits", value: cardStats.totalCommits.toLocaleString(), color: "#bc8cff" },
              { label: "Streak", value: `${cardStats.longestStreak}d`, color: "#3fb950" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  background: "rgba(22,27,34,0.6)",
                  border: "1px solid rgba(48,54,61,0.5)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  textAlign: "center",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ color: stat.color, fontSize: "24px", fontWeight: 700, lineHeight: 1.2 }}>
                  {stat.value}
                </div>
                <div style={{ color: "#8b949e", fontSize: "12px", fontWeight: 500, marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar – Languages + GitScope */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(48,54,61,0.4)",
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          background: "rgba(13,17,23,0.4)",
        }}
      >
        {/* Language bars */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", minWidth: 0 }}>
          <div style={{ display: "flex", gap: "2px", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
            {sortedLangs.map((lang) => (
              <div
                key={lang.name}
                style={{
                  flex: lang.percentage,
                  background: lang.color,
                  minWidth: lang.percentage > 0 ? "4px" : "0",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
            {sortedLangs.slice(0, 5).map((lang) => (
              <div key={lang.name} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: lang.color,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: "#e6edf3", fontSize: "12px", fontWeight: 500 }}>{lang.name}</span>
                <span style={{ color: "#8b949e", fontSize: "11px" }}>{lang.percentage}%</span>
              </div>
            ))}
            {sortedLangs.length === 0 && (
              <span style={{ color: "#8b949e", fontSize: "12px" }}>No language data</span>
            )}
          </div>
        </div>

        {/* GitScope + Date */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#58a6ff" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="#58a6ff" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#58a6ff" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span style={{ color: "#58a6ff", fontSize: "14px", fontWeight: 700, letterSpacing: "-0.02em" }}>GitScope</span>
          </div>
          <span style={{ color: "#8b949e", fontSize: "11px" }}>{generatedDate}</span>
        </div>
      </div>
    </div>
  )
}
