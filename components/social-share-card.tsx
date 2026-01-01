'use client'

import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

interface SocialShareCardProps {
  riskScore: number
  jobTitle?: string | null
  companyName?: string | null
  topFlags: Array<{
    severity: 'High' | 'Medium' | 'Low'
    quote: string
  }>
}

export function SocialShareCard({ riskScore, jobTitle, companyName, topFlags }: SocialShareCardProps) {
  // Determine risk level and colors
  const riskLevel = riskScore >= 80 ? 'Low' : riskScore >= 60 ? 'Medium' : 'High'

  // Background colors based on risk level
  const bgColors = {
    High: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)', // red-50 to white
    Medium: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)', // amber-50 to white
    Low: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' // green-50 to white
  }

  // Text colors based on risk level
  const scoreColors = {
    High: '#dc2626', // red-600
    Medium: '#d97706', // amber-600
    Low: '#059669' // green-600
  }

  const levelColors = {
    High: '#b91c1c', // red-700
    Medium: '#b45309', // amber-700
    Low: '#047857' // green-700
  }

  const iconColors = {
    High: '#ef4444', // red-500
    Medium: '#f59e0b', // amber-500
    Low: '#10b981' // green-500
  }

  const Icon = riskLevel === 'High' ? AlertTriangle :
                riskLevel === 'Medium' ? AlertCircle : CheckCircle

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        background: bgColors[riskLevel],
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Background Pattern */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '16rem',
          height: '16rem',
          borderRadius: '9999px',
          backgroundColor: scoreColors[riskLevel],
          transform: 'translateY(-8rem) translateX(8rem)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '24rem',
          height: '24rem',
          borderRadius: '9999px',
          backgroundColor: scoreColors[riskLevel],
          transform: 'translateY(12rem) translateX(-12rem)'
        }}></div>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon style={{ width: '2rem', height: '2rem', color: iconColors[riskLevel] }} />
          </div>
          <div>
            <h1 style={{ color: '#0f172a', fontSize: '2.25rem', fontWeight: 'bold', margin: 0 }}>
              RedFlag.buzz
            </h1>
            <p style={{ color: '#475569', fontSize: '1.125rem', margin: 0 }}>
              Job Description Risk Analysis
            </p>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div style={{ display: 'flex', flex: 1, gap: '3rem' }}>
          {/* Left Column - Score and Job Info */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Risk Score */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ color: scoreColors[riskLevel], fontSize: '5rem', fontWeight: 'bold' }}>
                  {riskScore}
                </span>
                <span style={{ color: '#475569', fontSize: '2.5rem' }}>/ 100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  color: levelColors[riskLevel],
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  border: `1px solid ${levelColors[riskLevel]}20`
                }}>
                  Risk Level: {riskLevel.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Job Info */}
            <div style={{ marginTop: 'auto' }}>
              {companyName && (
                <h2 style={{ color: '#1e293b', fontSize: '2rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                  {companyName}
                </h2>
              )}
              {jobTitle && (
                <h3 style={{ color: '#334155', fontSize: '1.5rem', margin: 0 }}>
                  {jobTitle}
                </h3>
              )}
            </div>
          </div>

          {/* Right Column - Top Flags */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 style={{ color: '#1e293b', fontSize: '1.75rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Top Red Flags:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topFlags.slice(0, 3).map((flag, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginTop: '0.25rem',
                    backgroundColor: flag.severity === 'High' ? '#ef4444' :
                                    flag.severity === 'Medium' ? '#f59e0b' : '#3b82f6'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      color: '#334155',
                      fontSize: '1.125rem',
                      fontStyle: 'italic',
                      margin: '0 0 0.25rem 0',
                      lineHeight: 1.4
                    }}>
                      "{flag.quote}"
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                        backgroundColor: flag.severity === 'High' ? '#fef2f2' :
                                        flag.severity === 'Medium' ? '#fffbeb' : '#f0fdf4',
                        color: flag.severity === 'High' ? '#991b1b' :
                              flag.severity === 'Medium' ? '#92400e' : '#065f46',
                        fontWeight: '500'
                      }}>
                        {flag.severity} Risk
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(203, 213, 225, 0.5)',
        marginTop: '1.5rem'
      }}>
        <p style={{ color: '#475569', fontSize: '1rem', margin: 0 }}>
          Analyzed by <span style={{ fontWeight: '600' }}>redflag.buzz</span> • The TL;DR for Job Descriptions
        </p>
      </div>
    </div>
  )
}