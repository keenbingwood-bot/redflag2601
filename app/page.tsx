'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Link, FileText, Loader2, AlertTriangle, CheckCircle, Globe, Briefcase, Building, Users, Sparkles, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getRiskBadgeClasses, getRiskScoreColor, riskColors } from '@/lib/risk-colors'
import { analyzeJobDescription } from '@/app/actions/analyze-job-description'
import { getRandomSampleJD } from '@/lib/sample-jds'
import { generateShareImage, downloadImage, getTopFlags } from '@/lib/share-utils'
import { ShareCard } from '@/components/share-card'
import { SocialShareCard } from '@/components/social-share-card'
import HeroCarousel from '@/components/HeroCarousel'
import html2canvas from 'html2canvas'

type JobScanResult = {
  id: string
  companyName: string | null
  jobTitle: string | null
  riskScore: number
  summary: string
  flags: Array<{
    id: string
    severity: 'High' | 'Medium' | 'Low'
    category: string
    quote: string
    reality: string
  }>
}

export default function Home() {
  const [inputType, setInputType] = useState<'url' | 'text'>('text')
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<JobScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProtectedUrlError, setIsProtectedUrlError] = useState(false)

  const handleAnalyze = async () => {
    const input = inputType === 'url' ? urlInput : textInput

    if (!input.trim()) {
      setError(inputType === 'url' ? 'Please enter a URL' : 'Please enter job description text')
      return
    }

    setIsLoading(true)
    setError(null)
    setIsProtectedUrlError(false)
    setResult(null)

    try {
      const formData = new FormData()
      formData.set('input', input)
      formData.set('type', inputType)

      const response = await analyzeJobDescription(formData)

      if (response.success && response.data) {
        // Convert severity strings to literal types
        const resultData: JobScanResult = {
          ...response.data,
          flags: response.data.flags.map((flag: any) => ({
            ...flag,
            severity: flag.severity as 'High' | 'Medium' | 'Low'
          }))
        }
        setResult(resultData)
      } else {
        // Special handling for protected URLs
        if (response.error === 'PROTECTED_URL') {
          // Switch to text input tab
          setInputType('text')
          setIsProtectedUrlError(true)

          // Show the protected URL message
          setError(response.message || 'LinkedIn/Indeed protects their data strictly. Please copy & paste the job description text manually.')

          // Focus the textarea for immediate pasting
          setTimeout(() => {
            const textarea = document.querySelector('textarea[name="text-input"]') as HTMLTextAreaElement
            if (textarea) {
              textarea.focus()
              textarea.select()
            }
          }, 100)
        } else {
          setError(response.error || 'Failed to analyze job description')
          setIsProtectedUrlError(false)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }


  const handleNewAnalysis = () => {
    setResult(null)
    setUrlInput('')
    setTextInput('')
    setError(null)
    setIsProtectedUrlError(false)
  }

  const handleDownloadImage = async () => {
    if (!result) return

    try {
      // 首先尝试使用canvas直接绘制，避免html2canvas的问题
      let dataUrl
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 1200
        canvas.height = 630
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          throw new Error('Failed to get canvas context')
        }

        const riskLevel = result.riskScore >= 80 ? 'Low' : result.riskScore >= 60 ? 'Medium' : 'High'
        const topFlags = getTopFlags((result.flags || []).map(flag => ({
          severity: flag.severity,
          quote: flag.quote
        })))

        // 设置背景颜色
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, 1200, 630)

        // 根据风险等级添加背景渐变
        let bgGradient
        if (riskLevel === 'High') {
          bgGradient = ctx.createLinearGradient(0, 0, 1200, 630)
          bgGradient.addColorStop(0, 'rgba(254, 242, 242, 0.3)') // red-50 with opacity
          bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
        } else if (riskLevel === 'Medium') {
          bgGradient = ctx.createLinearGradient(0, 0, 1200, 630)
          bgGradient.addColorStop(0, 'rgba(255, 251, 235, 0.3)') // amber-50 with opacity
          bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
        } else {
          bgGradient = ctx.createLinearGradient(0, 0, 1200, 630)
          bgGradient.addColorStop(0, 'rgba(240, 253, 244, 0.3)') // green-50 with opacity
          bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
        }

        ctx.fillStyle = bgGradient
        ctx.fillRect(0, 0, 1200, 630)

        // 绘制标题部分
        ctx.fillStyle = '#0f172a' // slate-900
        ctx.font = 'bold 72px Arial, sans-serif'
        ctx.fillText('RedFlag.buzz', 100, 150)

        ctx.fillStyle = '#475569' // slate-600
        ctx.font = '36px Arial, sans-serif'
        ctx.fillText('Job Description Risk Analysis', 100, 220)

        // 绘制左侧 - 分数和风险等级
        const scoreColor = riskLevel === 'High' ? '#dc2626' :
                         riskLevel === 'Medium' ? '#d97706' : '#059669'
        const levelColor = riskLevel === 'High' ? '#b91c1c' :
                         riskLevel === 'Medium' ? '#b45309' : '#047857'

        // 风险分数
        ctx.fillStyle = scoreColor
        ctx.font = 'bold 144px Arial, sans-serif'
        ctx.fillText(`${result.riskScore}`, 100, 400)

        ctx.fillStyle = '#475569'
        ctx.font = '72px Arial, sans-serif'
        // 增加更多间距，确保"/100"不会与分数重叠
        const scoreWidth = ctx.measureText(`${result.riskScore}`).width
        ctx.fillText('/ 100', 100 + scoreWidth + 100, 400)

        // 风险等级徽章
        ctx.fillStyle = levelColor
        ctx.font = 'bold 36px Arial, sans-serif'
        ctx.fillText(`Risk Level: ${riskLevel.toUpperCase()}`, 100, 480)

        // 工作信息 - 从风险等级徽章下方开始
        let currentInfoY = 520  // 从风险等级徽章下方40像素开始

        if (result.companyName) {
          ctx.fillStyle = '#1e293b'
          ctx.font = 'bold 48px Arial, sans-serif'
          const companyName = result.companyName.length > 30 ?
            result.companyName.substring(0, 27) + '...' : result.companyName
          ctx.fillText(companyName, 100, currentInfoY)
          currentInfoY += 60  // 企业名称高度 + 间距
        }

        if (result.jobTitle) {
          ctx.fillStyle = '#334155'
          ctx.font = '36px Arial, sans-serif'
          const jobTitle = result.jobTitle.length > 40 ?
            result.jobTitle.substring(0, 37) + '...' : result.jobTitle
          ctx.fillText(jobTitle, 100, currentInfoY)
          // 不需要再增加currentInfoY，因为这是最后一行
        }

        // 绘制右侧 - 顶部红旗（如果有）
        if (topFlags.length > 0) {
          const startX = 650
          let currentY = 250  // 从250开始，为3个条目留出足够空间

          ctx.fillStyle = '#1e293b'
          ctx.font = 'bold 42px Arial, sans-serif'
          ctx.fillText('Top Red Flags:', startX, currentY)
          currentY += 50  // 减少标题与第一个条目的间距

          // 绘制前3个红旗
          topFlags.slice(0, 3).forEach((flag, index) => {
            const flagColor = flag.severity === 'High' ? '#ef4444' :
                            flag.severity === 'Medium' ? '#f59e0b' : '#3b82f6'

            // 红旗编号
            ctx.fillStyle = flagColor
            ctx.font = 'bold 24px Arial, sans-serif'
            ctx.fillText(`${index + 1}.`, startX, currentY)

            // 红旗引用（如果太长则截断）- 减少字体大小和截断长度
            ctx.fillStyle = '#334155'
            ctx.font = 'italic 24px Arial, sans-serif'  // 从28px减小到24px
            const quote = flag.quote.length > 80 ? flag.quote.substring(0, 77) + '...' : flag.quote
            ctx.fillText(`"${quote}"`, startX + 40, currentY)

            currentY += 40  // 减少引用文本与徽章的间距

            // 严重性徽章
            ctx.fillStyle = flag.severity === 'High' ? '#fef2f2' :
                          flag.severity === 'Medium' ? '#fffbeb' : '#f0fdf4'
            ctx.fillRect(startX + 40, currentY - 8, 100, 25)  // 减小徽章尺寸

            ctx.fillStyle = flag.severity === 'High' ? '#991b1b' :
                          flag.severity === 'Medium' ? '#92400e' : '#065f46'
            ctx.font = 'bold 18px Arial, sans-serif'  // 减小字体
            ctx.fillText(`${flag.severity} Risk`, startX + 45, currentY + 8)

            currentY += 40  // 减少条目之间的间距
          })
        }

        dataUrl = canvas.toDataURL('image/png')
      } catch (canvasError) {
        console.error('Canvas drawing failed:', canvasError)

        // 如果canvas绘制失败，尝试使用html2canvas
        const shareCardElement = document.getElementById('share-card-container')
        if (!shareCardElement) {
          throw new Error('Share card element not found')
        }

        // 临时显示元素以便html2canvas可以捕获
        const originalStyle = shareCardElement.style.cssText
        shareCardElement.style.cssText = 'position: absolute; left: 0; top: 0; opacity: 1; z-index: 9999;'

        try {
          const canvas = await html2canvas(shareCardElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: true,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 10000,
            removeContainer: true,
            width: 1200,
            height: 630
          })
          dataUrl = canvas.toDataURL('image/png')
        } finally {
          // 恢复原始样式
          shareCardElement.style.cssText = originalStyle
        }
      }

      const companyPart = result.companyName ? result.companyName.replace(/[^a-z0-9]/gi, '-').toLowerCase() : 'job'
      const titlePart = result.jobTitle ? result.jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase() : 'description'
      const filename = `redflag-analysis-${companyPart}-${titlePart}.png`

      downloadImage(dataUrl, filename)
    } catch (error) {
      console.error('Failed to download image:', error)
      setError('Failed to generate download image. Please try again.')
    }
  }

  const handleShareOnX = async () => {
    if (!result) return

    try {
      let dataUrl
      try {
        // 使用canvas直接绘制分享图片
        const canvas = document.createElement('canvas')
        canvas.width = 1200
        canvas.height = 630
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          throw new Error('Failed to get canvas context')
        }

        const riskLevel = result.riskScore >= 80 ? 'Low' : result.riskScore >= 60 ? 'Medium' : 'High'
        const topFlags = getTopFlags((result.flags || []).map(flag => ({
          severity: flag.severity,
          quote: flag.quote
        })))

        // 设置背景颜色
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, 1200, 630)

        // 根据风险等级添加背景渐变
        let bgGradient
        if (riskLevel === 'High') {
          bgGradient = ctx.createLinearGradient(0, 0, 1200, 630)
          bgGradient.addColorStop(0, 'rgba(254, 242, 242, 0.3)') // red-50 with opacity
          bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
        } else if (riskLevel === 'Medium') {
          bgGradient = ctx.createLinearGradient(0, 0, 1200, 630)
          bgGradient.addColorStop(0, 'rgba(255, 251, 235, 0.3)') // amber-50 with opacity
          bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
        } else {
          bgGradient = ctx.createLinearGradient(0, 0, 1200, 630)
          bgGradient.addColorStop(0, 'rgba(240, 253, 244, 0.3)') // green-50 with opacity
          bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
        }

        ctx.fillStyle = bgGradient
        ctx.fillRect(0, 0, 1200, 630)

        // 绘制标题部分
        ctx.fillStyle = '#0f172a' // slate-900
        ctx.font = 'bold 72px Arial, sans-serif'
        ctx.fillText('RedFlag.buzz', 100, 150)

        ctx.fillStyle = '#475569' // slate-600
        ctx.font = '36px Arial, sans-serif'
        ctx.fillText('Job Description Risk Analysis', 100, 220)

        // 绘制左侧 - 分数和风险等级
        const scoreColor = riskLevel === 'High' ? '#dc2626' :
                         riskLevel === 'Medium' ? '#d97706' : '#059669'
        const levelColor = riskLevel === 'High' ? '#b91c1c' :
                         riskLevel === 'Medium' ? '#b45309' : '#047857'

        // 风险分数
        ctx.fillStyle = scoreColor
        ctx.font = 'bold 144px Arial, sans-serif'
        ctx.fillText(`${result.riskScore}`, 100, 400)

        ctx.fillStyle = '#475569'
        ctx.font = '72px Arial, sans-serif'
        // 增加更多间距，确保"/100"不会与分数重叠
        const scoreWidth = ctx.measureText(`${result.riskScore}`).width
        ctx.fillText('/ 100', 100 + scoreWidth + 100, 400)

        // 风险等级徽章
        ctx.fillStyle = levelColor
        ctx.font = 'bold 36px Arial, sans-serif'
        ctx.fillText(`Risk Level: ${riskLevel.toUpperCase()}`, 100, 480)

        // 工作信息 - 从风险等级徽章下方开始
        let currentInfoY = 520  // 从风险等级徽章下方40像素开始

        if (result.companyName) {
          ctx.fillStyle = '#1e293b'
          ctx.font = 'bold 48px Arial, sans-serif'
          const companyName = result.companyName.length > 30 ?
            result.companyName.substring(0, 27) + '...' : result.companyName
          ctx.fillText(companyName, 100, currentInfoY)
          currentInfoY += 60  // 企业名称高度 + 间距
        }

        if (result.jobTitle) {
          ctx.fillStyle = '#334155'
          ctx.font = '36px Arial, sans-serif'
          const jobTitle = result.jobTitle.length > 40 ?
            result.jobTitle.substring(0, 37) + '...' : result.jobTitle
          ctx.fillText(jobTitle, 100, currentInfoY)
          // 不需要再增加currentInfoY，因为这是最后一行
        }

        // 绘制右侧 - 顶部红旗（如果有）
        if (topFlags.length > 0) {
          const startX = 650
          let currentY = 250  // 从250开始，为3个条目留出足够空间

          ctx.fillStyle = '#1e293b'
          ctx.font = 'bold 42px Arial, sans-serif'
          ctx.fillText('Top Red Flags:', startX, currentY)
          currentY += 50  // 减少标题与第一个条目的间距

          // 绘制前3个红旗
          topFlags.slice(0, 3).forEach((flag, index) => {
            const flagColor = flag.severity === 'High' ? '#ef4444' :
                            flag.severity === 'Medium' ? '#f59e0b' : '#3b82f6'

            // 红旗编号
            ctx.fillStyle = flagColor
            ctx.font = 'bold 24px Arial, sans-serif'
            ctx.fillText(`${index + 1}.`, startX, currentY)

            // 红旗引用（如果太长则截断）- 减少字体大小和截断长度
            ctx.fillStyle = '#334155'
            ctx.font = 'italic 24px Arial, sans-serif'  // 从28px减小到24px
            const quote = flag.quote.length > 80 ? flag.quote.substring(0, 77) + '...' : flag.quote
            ctx.fillText(`"${quote}"`, startX + 40, currentY)

            currentY += 40  // 减少引用文本与徽章的间距

            // 严重性徽章
            ctx.fillStyle = flag.severity === 'High' ? '#fef2f2' :
                          flag.severity === 'Medium' ? '#fffbeb' : '#f0fdf4'
            ctx.fillRect(startX + 40, currentY - 8, 100, 25)  // 减小徽章尺寸

            ctx.fillStyle = flag.severity === 'High' ? '#991b1b' :
                          flag.severity === 'Medium' ? '#92400e' : '#065f46'
            ctx.font = 'bold 18px Arial, sans-serif'  // 减小字体
            ctx.fillText(`${flag.severity} Risk`, startX + 45, currentY + 8)

            currentY += 40  // 减少条目之间的间距
          })
        }

        dataUrl = canvas.toDataURL('image/png')
      } catch (canvasError) {
        console.error('Canvas drawing failed for share:', canvasError)

        // 如果canvas绘制失败，尝试使用html2canvas
        const shareCardElement = document.getElementById('social-share-card-container')
        if (!shareCardElement) {
          throw new Error('Social share card element not found')
        }

        // 临时显示元素以便html2canvas可以捕获
        const originalStyle = shareCardElement.style.cssText
        shareCardElement.style.cssText = 'position: absolute; left: 0; top: 0; opacity: 1; z-index: 9999;'

        try {
          const canvas = await html2canvas(shareCardElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: true,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 10000,
            removeContainer: true,
            width: 1200,
            height: 630
          })
          dataUrl = canvas.toDataURL('image/png')
        } finally {
          // 恢复原始样式
          shareCardElement.style.cssText = originalStyle
        }
      }

      // Create a temporary link to download the image first
      const link = document.createElement('a')
      link.download = 'redflag-analysis-share.png'
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Prepare text for X post - Three different modes
      const riskLevel = result.riskScore >= 80 ? 'Low' : result.riskScore >= 60 ? 'Medium' : 'High'
      const topFlags = getTopFlags((result.flags || []).map(flag => ({
        severity: flag.severity,
        quote: flag.quote
      })))
      const topFlagQuote = topFlags.length > 0 ? topFlags[0].quote : ''

      // Three different sharing modes
      const modes = [
        // Mode A: 震惊/警示风 (The "Dodged a Bullet" Vibe)
        () => {
          let text = `🚩 I just analyzed a ${result.jobTitle || 'job'} role and it got a ${result.riskScore}/100 Risk Score.\n\n`
          if (topFlagQuote) {
            text += `"${topFlagQuote}"? No thanks. 🙅‍♂️\n\n`
          }
          text += `Check your target JD before applying: https://redflag.buzz`
          return text
        },

        // Mode B: 数据/极客风 (The "Smart Tool" Vibe)
        () => {
          let text = `Running my potential job applications through AI audits. 🤖\n\n`
          text += `This one for ${result.jobTitle || 'a position'} is flagged as ${riskLevel} Risk (Score: ${result.riskScore}). `
          if (result.flags && result.flags.length > 0) {
            text += `The AI detected ${result.flags.length} red flag${result.flags.length > 1 ? 's' : ''}.\n\n`
          }
          text += `Save your time reading corporate jargon: https://redflag.buzz`
          return text
        },

        // Mode C: 讽刺/幽默风 (The "Sarcastic" Vibe)
        () => {
          let text = `Translation: "${topFlagQuote || 'Corporate jargon'}" = "We have no management." 🫠\n\n`
          text += `Used RedFlag.buzz to scan this ${result.jobTitle ? result.jobTitle + ' ' : ''}JD. `
          text += `The reality check is brutal but accurate.\n\n`
          text += `👇 Look at these red flags: https://redflag.buzz`
          return text
        }
      ]

      // Randomly select a mode
      const randomMode = modes[Math.floor(Math.random() * modes.length)]
      const shareText = randomMode()

      // Open X share dialog in a popup window
      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`

      // Calculate popup position to center it on screen
      const width = 550
      const height = 420
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2

      const popupFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`

      window.open(xUrl, 'ShareOnX', popupFeatures)
    } catch (error) {
      console.error('Failed to share on X:', error)
      setError('Failed to share on X. Please try again.')
    }
  }

  const handleTrySample = () => {
    // Get a random sample job description
    const sampleJD = getRandomSampleJD()

    setTextInput(sampleJD.description)
    setInputType('text')

    // Scroll to textarea for better UX
    setTimeout(() => {
      const textarea = document.getElementById('text')
      if (textarea) {
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const getRiskScoreDisplay = (score: number) => {
    const colors = getRiskScoreColor(score)
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} ${colors.border} border`}>
        <span className={`text-2xl font-bold ${colors.text}`}>{score}</span>
        <span className={`font-medium ${colors.text}`}>/ 100</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <HeroCarousel />
            </div>

            {result && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={handleNewAnalysis} className="w-full sm:w-auto min-w-[140px]">
                  Scan Another
                </Button>
                <Button variant="outline" onClick={handleDownloadImage} className="w-full sm:w-auto min-w-[140px]">
                  Download Image
                </Button>
                <Button variant="default" onClick={handleShareOnX} className="w-full sm:w-auto min-w-[140px] bg-slate-900 hover:bg-slate-800 text-white">
                  share on X
                </Button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Input */}
            <div className="lg:col-span-3">
              {!result ? (
                <Card className="min-h-[320px] md:min-h-[360px] flex flex-col !pb-3">
                  <CardContent className="flex flex-col flex-1 px-6 pt-6 pb-3">
                    <Tabs value={inputType} onValueChange={(v) => setInputType(v as 'url' | 'text')} className="flex flex-col flex-1">
                      <div className="flex justify-center mb-6">
                        <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 p-1 transition-colors duration-200 hover:bg-slate-200/80">
                          <TabsTrigger
                            value="text"
                            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-800 data-[state=inactive]:hover:bg-slate-50"
                          >
                            <FileText className="w-4 h-4 transition-transform duration-200 group-data-[state=active]/trigger:scale-110" />
                            Paste Text
                          </TabsTrigger>
                          <TabsTrigger
                            value="url"
                            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-800 data-[state=inactive]:hover:bg-slate-50"
                          >
                            <Link className="w-4 h-4 transition-transform duration-200 group-data-[state=active]/trigger:scale-110" />
                            Paste Link
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="text" className="space-y-4 flex-1">
                        <div className="space-y-2 flex flex-col flex-1">
                          <div className="typewriter-textarea-container">
                            <Textarea
                              id="text"
                              placeholder="Paste the full job description here..."
                              value={textInput}
                              onChange={(e) => setTextInput(e.target.value)}
                              disabled={isLoading}
                              rows={8}
                              className="resize-none min-h-[200px] md:min-h-[240px] flex-1"
                            />
                            {textInput === '' && (
                              <div className="typewriter-textarea-placeholder-text">
                                Paste the full job description here...
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="url" className="space-y-4 flex-1">
                        <div className="space-y-2 flex flex-col flex-1">
                          <div className="typewriter-placeholder-container">
                            <Input
                              id="url"
                              placeholder="https://linkedin.com/jobs/view/..."
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              disabled={isLoading}
                              className="h-14"
                            />
                            {urlInput === '' && (
                              <div className="typewriter-placeholder-text">
                                https://linkedin.com/jobs/view/...
                              </div>
                            )}
                          </div>

                          {/* Helper text for protected sites */}
                          <div className="text-amber-600 text-xs mt-2 flex items-start gap-1">
                            <span>⚠️</span>
                            <span>
                              If the link fails, please use the 'Paste Text' tab for the best results.
                            </span>
                          </div>

                          {/* Supported Platforms - Subtle Trust Signals */}
                          <div className="pt-2 mt-3">
                            <div className="flex items-center justify-center gap-2">
                              {/* LinkedIn */}
                              <div className="group relative w-8 h-8 flex items-center justify-center rounded bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                                <span className="text-xs font-bold">in</span>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                  LinkedIn
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                </div>
                              </div>

                              {/* Indeed */}
                              <div className="group relative w-8 h-8 flex items-center justify-center rounded bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                                <span className="text-xs font-bold">ind</span>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                  Indeed
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                </div>
                              </div>

                              {/* Glassdoor */}
                              <div className="group relative w-8 h-8 flex items-center justify-center rounded bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                                <span className="text-xs font-bold">gd</span>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                  Glassdoor
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                </div>
                              </div>

                              {/* Monster */}
                              <div className="group relative w-8 h-8 flex items-center justify-center rounded bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                                <span className="text-xs font-bold">M</span>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                  Monster
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                </div>
                              </div>

                              {/* More */}
                              <div className="group relative w-8 h-8 flex items-center justify-center rounded bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                                <span className="text-xs font-bold">+</span>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                  More platforms
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {error && (
                      <div className={`mt-4 p-3 rounded-lg ${
                        isProtectedUrlError
                          ? 'bg-amber-50 border border-amber-200'
                          : error.includes('✅')
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          {isProtectedUrlError && (
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          )}
                          <p className={`text-sm ${
                            isProtectedUrlError
                              ? 'text-amber-700'
                              : error.includes('✅')
                                ? 'text-green-700'
                                : 'text-red-700'
                          }`}>{error}</p>
                        </div>
                      </div>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="w-full mt-6 shadow-lg hover:shadow-xl transition-all duration-200 group"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing Risks...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
                            Analyze Risks
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Try a Sample Link - Only show when no result and in text mode */}
                    {!result && inputType === 'text' && (
                      <div className="text-center mt-4">
                        <button
                          onClick={handleTrySample}
                          className="text-sm text-slate-500 hover:text-slate-700 transition-colors inline-flex items-center gap-1 group"
                        >
                          <span>Want to see how it works?</span>
                          <span className="font-medium text-slate-600 group-hover:text-slate-800 underline decoration-dotted underline-offset-2">
                            Try a random sample
                          </span>
                          <svg
                            className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 5l7 7-7 7M5 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                /* Results Display */
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle>Risk Analysis Results</CardTitle>
                        <CardDescription className="mt-2">
                          {result.summary}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-center">
                        {getRiskScoreDisplay(result.riskScore)}
                        <span className="text-sm text-slate-500 mt-2">Risk Score</span>
                      </div>
                    </div>

                    {(result.companyName || result.jobTitle) && (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {result.companyName && (
                          <div>
                            <span className="text-sm text-slate-500">Company</span>
                            <p className="font-medium">{result.companyName}</p>
                          </div>
                        )}
                        {result.jobTitle && (
                          <div>
                            <span className="text-sm text-slate-500">Job Title</span>
                            <p className="font-medium">{result.jobTitle}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent>
                    {result.flags.length > 0 ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-4">
                            Red Flags Found ({result.flags.length})
                          </h3>

                          {/* Desktop Table View */}
                          <div className="hidden md:block border rounded-lg overflow-auto">
                            <Table className="table-fixed w-full">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[15%]">Risk Level</TableHead>
                                  <TableHead className="w-[15%]">Category</TableHead>
                                  <TableHead className="w-[35%]">The Trap</TableHead>
                                  <TableHead className="w-[35%]">The Reality</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {result.flags.map((flag) => (
                                  <TableRow key={flag.id}>
                                    <TableCell className="w-[15%] whitespace-normal">
                                      <Badge className={getRiskBadgeClasses(flag.severity)}>
                                        {flag.severity === 'High' && '🔴'}
                                        {flag.severity === 'Medium' && '🟡'}
                                        {flag.severity === 'Low' && '🔵'}
                                        {flag.severity}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="w-[15%] whitespace-normal">
                                      <span className="font-medium">{flag.category}</span>
                                    </TableCell>
                                    <TableCell className="w-[35%] whitespace-normal">
                                      <p className="text-sm italic text-slate-600 break-words">"{flag.quote}"</p>
                                    </TableCell>
                                    <TableCell className="w-[35%] whitespace-normal">
                                      <p className="text-sm break-words">{flag.reality}</p>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Mobile Card View */}
                          <div className="md:hidden space-y-4">
                            {result.flags.map((flag) => (
                              <div key={flag.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <Badge className={getRiskBadgeClasses(flag.severity)}>
                                    {flag.severity === 'High' && '🔴'}
                                    {flag.severity === 'Medium' && '🟡'}
                                    {flag.severity === 'Low' && '🔵'}
                                    {flag.severity}
                                  </Badge>
                                  <span className="font-medium text-sm text-slate-700">{flag.category}</span>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-slate-500 mb-1">The Trap</h4>
                                  <p className="text-sm italic text-slate-600 break-words">"{flag.quote}"</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-slate-500 mb-1">The Reality</h4>
                                  <p className="text-sm text-slate-700 break-words">{flag.reality}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">No Red Flags Found</h3>
                        <p className="text-slate-600">
                          This job description appears to be relatively safe based on our analysis.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Info & Risk Guide */}
            <div className="space-y-6">
              {/* Risk Guide */}
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-slate-700">Risk Guide</CardTitle>
                  <CardDescription className="text-xs text-slate-500">Understanding the risk levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className={`${riskColors.high.bg} ${riskColors.high.border} border rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className={`w-4 h-4 ${riskColors.high.icon}`} />
                      <h4 className={`text-sm font-semibold ${riskColors.high.text}`}>High Risk</h4>
                    </div>
                    <p className="text-xs text-slate-700">
                      Critical issues: burnout culture, toxic management, unrealistic expectations.
                    </p>
                  </div>

                  <div className={`${riskColors.medium.bg} ${riskColors.medium.border} border rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className={`w-4 h-4 ${riskColors.medium.icon}`} />
                      <h4 className={`text-sm font-semibold ${riskColors.medium.text}`}>Medium Risk</h4>
                    </div>
                    <p className="text-xs text-slate-700">
                      Potential concerns: work-life balance, compensation, stability.
                    </p>
                  </div>

                  <div className={`${riskColors.low.bg} ${riskColors.low.border} border rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle className={`w-4 h-4 ${riskColors.low.icon}`} />
                      <h4 className={`text-sm font-semibold ${riskColors.low.text}`}>Low Risk</h4>
                    </div>
                    <p className="text-xs text-slate-700">
                      Generally safe: clear expectations, fair practices, reasonable demands.
                    </p>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm"
          >
            <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
              <motion.a
                href="https://github.com/keenbingwood-bot/redflag2601"
                className="hover:text-slate-700 transition-colors font-medium text-slate-500 hover:text-red-500 hover:glitch-effect px-3 py-1 rounded-lg hover:bg-slate-100"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                GitHub
              </motion.a>
              <span className="text-slate-400">•</span>
              <motion.a
                href="mailto:feedback@koalyn.ai"
                className="hover:text-slate-700 transition-colors font-medium text-slate-500 hover:text-red-500 hover:glitch-effect px-3 py-1 rounded-lg hover:bg-slate-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.a>
              <span className="text-slate-400">•</span>
              <motion.button
                onClick={() => window.location.href = '/legal'}
                className="hover:text-slate-700 transition-colors font-medium text-slate-500 hover:text-red-500 hover:glitch-effect px-3 py-1 rounded-lg hover:bg-slate-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Privacy & Terms
              </motion.button>
            </div>
            <motion.p
              className="text-slate-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              RedFlag.buzz • AI-powered job description analysis
            </motion.p>
            <motion.p
              className="mt-2 text-xs text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              For informational purposes only. Not career or professional advice. Use at your own discretion.
            </motion.p>
          </motion.footer>

          {/* Hidden share cards for image generation */}
          {result && (
            <>
              {/* Original share card (for download) */}
              <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
                <div id="share-card-container">
                  <ShareCard
                    riskScore={result.riskScore}
                    jobTitle={result.jobTitle}
                    companyName={result.companyName}
                    topFlags={getTopFlags((result.flags || []).map(flag => ({
                      severity: flag.severity,
                      quote: flag.quote
                    })))}
                  />
                </div>
              </div>

              {/* Social media share card (for X sharing) */}
              <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
                <div id="social-share-card-container">
                  <SocialShareCard
                    riskScore={result.riskScore}
                    jobTitle={result.jobTitle}
                    companyName={result.companyName}
                    topFlags={getTopFlags((result.flags || []).map(flag => ({
                      severity: flag.severity,
                      quote: flag.quote
                    })))}
                  />
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
