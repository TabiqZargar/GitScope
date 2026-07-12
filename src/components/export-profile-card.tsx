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

  const surface = "#181c22"
  const surfaceContainer = "#1c2026"
  const surfaceHighest = "#31353c"
  const outlineVariant = "#414752"
  const primary = "#a2c9ff"
  const secondary = "#d8baff"
  const tertiary = "#67df70"
  const foreground = "#dfe2eb"
  const onSurfaceVariant = "#c0c7d4"
  const mutedForeground = "#8b919d"
  const background = "#10141a"

  return (
    <div
      id="gitscope-export-card"
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background,
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        fontFamily: '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      }}
    >
      {/* Glow Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primary}22 0%, transparent 70%)`,
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
          background: `radial-gradient(circle, ${secondary}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          padding: "32px",
          gap: "28px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left panel – Avatar + name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "260px",
            flexShrink: 0,
            gap: "14px",
            background: `rgba(22, 27, 34, 0.7)`,
            backdropFilter: "blur(12px)",
            border: `1px solid ${outlineVariant}80`,
            borderRadius: "16px",
            padding: "24px 16px",
          }}
        >
          <div
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              padding: "3px",
              background: `linear-gradient(135deg, ${primary}, ${secondary})`,
              boxShadow: `0 0 30px ${primary}40`,
            }}
          >
            <img
              src={user.avatar_url}
              alt=""
              style={{
                width: "104px",
                height: "104px",
                borderRadius: "50%",
                display: "block",
                background: surface,
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: foreground,
                fontSize: "26px",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {user.name || user.login}
            </div>
            <div
              style={{
                color: onSurfaceVariant,
                fontSize: "15px",
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
                color: mutedForeground,
                fontSize: "12px",
                lineHeight: 1.5,
                textAlign: "center",
                maxWidth: "220px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {user.bio}
            </div>
          )}
        </div>

        {/* Right panel – Stats grid */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {/* Row 1 */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "Followers", value: user.followers.toLocaleString(), color: primary },
              { label: "Following", value: user.following.toLocaleString(), color: tertiary },
              { label: "Repos", value: user.public_repos.toLocaleString(), color: "#d29922" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  background: `rgba(22, 27, 34, 0.7)`,
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${outlineVariant}80`,
                  borderRadius: "14px",
                  padding: "16px 18px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: stat.color, fontSize: "26px", fontWeight: 700, lineHeight: 1.2 }}>
                  {stat.value}
                </div>
                <div style={{ color: onSurfaceVariant, fontSize: "11px", fontWeight: 600, marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "Stars", value: cardStats.totalStars.toLocaleString(), color: "#d29922" },
              { label: "Commits", value: cardStats.totalCommits.toLocaleString(), color: secondary },
              { label: "Streak", value: `${cardStats.longestStreak}d`, color: tertiary },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  background: `rgba(22, 27, 34, 0.7)`,
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${outlineVariant}80`,
                  borderRadius: "14px",
                  padding: "16px 18px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: stat.color, fontSize: "26px", fontWeight: 700, lineHeight: 1.2 }}>
                  {stat.value}
                </div>
                <div style={{ color: onSurfaceVariant, fontSize: "11px", fontWeight: 600, marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
          borderTop: `1px solid ${outlineVariant}60`,
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          background: `rgba(22, 27, 34, 0.7)`,
          backdropFilter: "blur(12px)",
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 12px" }}>
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
                <span style={{ color: foreground, fontSize: "12px", fontWeight: 500 }}>{lang.name}</span>
                <span style={{ color: mutedForeground, fontSize: "11px" }}>{lang.percentage}%</span>
              </div>
            ))}
            {sortedLangs.length === 0 && (
              <span style={{ color: mutedForeground, fontSize: "12px" }}>No language data</span>
            )}
          </div>
        </div>

        {/* GitScope + Date */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={primary} strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke={primary} strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke={primary} strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span style={{ color: primary, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.02em" }}>GitScope</span>
          </div>
          <span style={{ color: mutedForeground, fontSize: "11px" }}>{generatedDate}</span>
        </div>
      </div>
    </div>
  )
}
