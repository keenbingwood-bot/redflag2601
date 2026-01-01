import html2canvas from 'html2canvas'

export async function generateShareImage(element: HTMLElement): Promise<string> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      imageTimeout: 15000,
      removeContainer: true,
      width: element.offsetWidth,
      height: element.offsetHeight,
    })

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Failed to generate share image:', error)
    throw new Error('Failed to generate share image')
  }
}

export function downloadImage(dataUrl: string, filename: string = 'redflag-analysis.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    return new Promise((resolve, reject) => {
      try {
        document.execCommand('copy')
        resolve()
      } catch (err) {
        reject(err)
      } finally {
        document.body.removeChild(textArea)
      }
    })
  }
}

export function getTopFlags(flags: Array<{ severity: 'High' | 'Medium' | 'Low', quote: string }>, limit: number = 3) {
  // Sort by severity (High first, then Medium, then Low)
  const severityOrder = { High: 0, Medium: 1, Low: 2 }
  return [...flags]
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .slice(0, limit)
}