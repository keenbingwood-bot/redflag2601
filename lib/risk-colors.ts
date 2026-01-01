/**
 * Risk color utility functions for RedFlag.buzz
 * Risk analysis color system
 */

export const riskColors = {
  // High Risk (Red Flag)
  high: {
    text: 'text-[oklch(0.577_0.245_27.325)]', // Red-600
    bg: 'bg-[oklch(0.97_0.05_27.325)]', // Red-50
    border: 'border-[oklch(0.922_0.1_27.325)]', // Red-200
    icon: 'text-[oklch(0.577_0.245_27.325)]',
  },

  // Medium Risk (Warning)
  medium: {
    text: 'text-[oklch(0.769_0.188_70.08)]', // Amber-600
    bg: 'bg-[oklch(0.97_0.05_70.08)]', // Amber-50
    border: 'border-[oklch(0.922_0.1_70.08)]', // Amber-200
    icon: 'text-[oklch(0.769_0.188_70.08)]',
  },

  // Low Risk / Safe (Info)
  low: {
    text: 'text-[oklch(0.398_0.07_227.392)]', // Blue-600
    bg: 'bg-[oklch(0.97_0.05_227.392)]', // Blue-50
    border: 'border-[oklch(0.922_0.1_227.392)]', // Blue-200
    icon: 'text-[oklch(0.398_0.07_227.392)]',
  },

  // Neutral / Info
  info: {
    text: 'text-[oklch(0.398_0.07_227.392)]', // Blue-600
    bg: 'bg-[oklch(0.97_0.05_227.392)]', // Blue-50
    border: 'border-[oklch(0.922_0.1_227.392)]', // Blue-200
    icon: 'text-[oklch(0.398_0.07_227.392)]',
  },
}

export function getRiskColorClasses(severity: 'High' | 'Medium' | 'Low' | 'Info') {
  const severityKey = severity.toLowerCase() as keyof typeof riskColors
  return riskColors[severityKey] || riskColors.info
}

export function getRiskBadgeClasses(severity: 'High' | 'Medium' | 'Low' | 'Info') {
  const colors = getRiskColorClasses(severity)
  return `${colors.bg} ${colors.text} ${colors.border} border px-3 py-1 rounded-full text-sm font-medium`
}

export function getRiskScoreColor(score: number) {
  if (score >= 80) return riskColors.low // Safe (80-100)
  if (score >= 60) return riskColors.medium // Warning (60-79)
  return riskColors.high // High Risk (0-59)
}