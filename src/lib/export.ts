import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export async function exportAsPNG(elementId: string, filename = "gitscope-report") {
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    backgroundColor: "#0d1117",
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
  })

  const link = document.createElement("a")
  link.download = `${filename}.png`
  link.href = canvas.toDataURL("image/png")
  link.click()
}

export async function exportAsPDF(elementId: string, filename = "gitscope-report") {
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    backgroundColor: "#0d1117",
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
  })

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth - 20
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 10

  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
  heightLeft -= pageHeight - 20

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - 20
  }

  pdf.save(`${filename}.pdf`)
}
