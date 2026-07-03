import { toPng } from "html-to-image"

export type ExportScale = 1 | 2 | 3

export interface ExportProfileCardOptions {
  scale?: ExportScale
  filename?: string
}

export async function exportPremiumCardAsPNG(
  elementId: string,
  options: ExportProfileCardOptions = {}
): Promise<{ dataUrl: string; filename: string }> {
  const scale = options.scale ?? 3
  const filename = options.filename ?? "github-profile-card"

  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: scale,
    backgroundColor: "#0d1117",
    style: {
      borderRadius: "20px",
    },
  })

  return { dataUrl, filename }
}

export async function exportPremiumCardToPNG(
  elementId: string,
  options: ExportProfileCardOptions = {}
): Promise<void> {
  const { dataUrl, filename } = await exportPremiumCardAsPNG(elementId, options)
  const link = document.createElement("a")
  link.download = `${filename}.png`
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
