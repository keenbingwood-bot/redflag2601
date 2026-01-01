/**
 * Share card color utility functions for RedFlag.buzz
 * Uses hex colors for html2canvas compatibility
 */

export const shareColors = {
  // High Risk (Red Flag)
  high: {
    text: '#dc2626', // Red-600
    bg: '#fef2f2', // Red-50
    border: '#fecaca', // Red-200
    icon: '#dc2626',
  },

  // Medium Risk (Warning)
  medium: {
    text: '#d97706', // Amber-600
    bg: '#fffbeb', // Amber-50
    border: '#fde68a', // Amber-200
    icon: '#d97706',
  },

  // Low Risk / Safe (Info)
  low: {
    text: '#2563eb', // Blue-600
    bg: '#eff6ff', // Blue-50
    border: '#bfdbfe', // Blue-200
    icon: '#2563eb',
  },

  // Neutral / Info
  info: {
    text: '#2563eb', // Blue-600
    bg: '#eff6ff', // Blue-50
    border: '#bfdbfe', // Blue-200
    icon: '#2563eb',
  },
}

export function getShareRiskScoreColor(score: number) {
  if (score >= 80) return shareColors.low // Safe (80-100)
  if (score >= 60) return shareColors.medium // Warning (60-79)
  return shareColors.high // High Risk (0-59)
}

export function getShareCardBackground(score: number): string {
  if (score >= 80) return '#f0f9ff' // Light blue for safe
  if (score >= 60) return '#fffbeb' // Light amber for warning
  return '#fef2f2' // Light red for high risk
}