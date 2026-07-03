"use client"

import { useState, useEffect, useCallback } from "react"
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportPremiumCardToPNG, type ExportScale } from "@/lib/exportProfileCard"

interface ExportCardButtonProps {
  elementId?: string
  filename?: string
}

export function ExportCardButton({ elementId, filename }: ExportCardButtonProps) {
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showOptions, setShowOptions] = useState(false)
  const scale: ExportScale = 3

  const handleExport = useCallback(async () => {
    setExporting(true)
    setMessage(null)
    setShowOptions(false)

    try {
      await exportPremiumCardToPNG(elementId ?? "gitscope-export-card", { scale, filename: filename ?? "github-profile-card" })
      setMessage({ type: "success", text: "Exported at 3x!" })
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Export failed" })
    } finally {
      setExporting(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }, [elementId, scale, filename])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "E") {
        e.preventDefault()
        handleExport()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleExport])

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {message && (
          <span
            className={`flex items-center gap-1 text-xs ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="size-3.5" />
            ) : (
              <AlertCircle className="size-3.5" />
            )}
            {message.text}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowOptions(!showOptions)}
          disabled={exporting}
          className="gap-1.5"
        >
          {exporting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Download className="size-3.5" />
          )}
          {exporting ? "Exporting..." : "Export Card"}
        </Button>
      </div>

      {showOptions && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-44 rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="mb-2 text-xs text-muted-foreground">
            Exports a premium 1200×630 profile card at 3x resolution.
          </p>
          <p className="mb-2 text-xs text-muted-foreground">
            Shortcut: <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Ctrl/Cmd+Shift+E</kbd>
          </p>
          <Button size="sm" className="w-full gap-1.5" onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            {exporting ? "Exporting..." : "Export 3x PNG"}
          </Button>
        </div>
      )}
    </div>
  )
}
