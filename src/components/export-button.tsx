"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { exportAsPNG, exportAsPDF } from "@/lib/export"
import { Download, Image, FileText, Loader2 } from "lucide-react"

interface ExportButtonProps {
  elementId: string
  filename?: string
}

export function ExportButton({ elementId, filename }: ExportButtonProps) {
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null)

  const handleExport = async (format: "png" | "pdf") => {
    setExporting(format)
    try {
      if (format === "png") {
        await exportAsPNG(elementId, filename)
      } else {
        await exportAsPDF(elementId, filename)
      }
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("png")}
        disabled={exporting !== null}
        className="gap-1.5"
      >
        {exporting === "png" ? <Loader2 className="size-3.5 animate-spin" /> : <Image className="size-3.5" />}
        PNG
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("pdf")}
        disabled={exporting !== null}
        className="gap-1.5"
      >
        {exporting === "pdf" ? <Loader2 className="size-3.5 animate-spin" /> : <FileText className="size-3.5" />}
        PDF
      </Button>
    </div>
  )
}
