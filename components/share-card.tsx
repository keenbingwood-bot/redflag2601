'use client'

import { getShareRiskScoreColor, getShareCardBackground } from '@/lib/share-colors'
import { Shield } from 'lucide-react'

interface ShareCardProps {
  riskScore: number
  jobTitle?: string | null
  companyName?: string | null
  topFlags: Array<{
    severity: 'High' | 'Medium' | 'Low'
    quote: string
  }>
}

export function ShareCard({ riskScore, jobTitle, companyName, topFlags }: ShareCardProps) {
  const colors = getShareRiskScoreColor(riskScore)
  const bgColor = getShareCardBackground(riskScore)

  // Text colors based on risk score
  const scoreColor = riskScore >= 80 ? '#059669' : riskScore >= 60 ? '#d97706' : '#dc2626' // green-600, amber-600, red-600
  const scoreTextColor = riskScore >= 80 ? '#059669' : riskScore >= 60 ? '#d97706' : '#dc2626'

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
        aspectRatio: '1.91 / 1',
        background: `linear-gradient(135deg, ${bgColor} 0%, white 100%)`
      }}
    >
      {/* Background Pattern */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '16rem',
          height: '16rem',
          borderRadius: '9999px',
          backgroundColor: 'currentColor',
          transform: 'translateY(-8rem) translateX(8rem)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '24rem',
          height: '24rem',
          borderRadius: '9999px',
          backgroundColor: 'currentColor',
          transform: 'translateY(12rem) translateX(-12rem)'
        }}></div>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <Shield style={{ width: '2rem', height: '2rem', color: '#334155' }} />
          </div>
          <div>
            <h1 style={{ color: '#0f172a', fontSize: '2.25rem', fontWeight: 'bold' }}>RedFlag.buzz</h1>
            <p style={{ color: '#475569', fontSize: '1.125rem' }}>Job Description Risk Analysis</p>
          </div>
        </div>

        {/* Job Info */}
        <div style={{ marginBottom: '2.5rem' }}>
          {companyName && (
            <h2 style={{ color: '#1e293b', fontSize: '1.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>{companyName}</h2>
          )}
          {jobTitle && (
            <h3 style={{ color: '#334155', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{jobTitle}</h3>
          )}
        </div>

        {/* Risk Score */}
        <div className="mb-12">
          <div className="flex items-baseline gap-4 mb-4">
            <span style={{ color: scoreTextColor, fontSize: '4.5rem', fontWeight: 'bold' }}>{riskScore}</span>
            <span style={{ color: '#475569', fontSize: '1.875rem' }}>/ 100</span>
          </div>
          <div style={{ width: '16rem', height: '0.75rem', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                backgroundColor: colors.bg === '#fef2f2' ? '#f87171' : colors.bg === '#fffbeb' ? '#fbbf24' : '#60a5fa',
                width: `${riskScore}%`
              }}
            ></div>
          </div>
          <p style={{ color: '#334155', fontSize: '1.25rem', marginTop: '1rem' }}>
            {riskScore >= 80 ? 'Generally Safe' : riskScore >= 60 ? 'Proceed with Caution' : 'High Risk Alert'}
          </p>
        </div>

        {/* Top Flags */}
        {topFlags.length > 0 && (
          <div>
            <h4 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Top Red Flags:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topFlags.slice(0, 3).map((flag, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem',
                    backgroundColor: flag.severity === 'High' ? '#ef4444' :
                                    flag.severity === 'Medium' ? '#f59e0b' : '#3b82f6'
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ color: '#334155', fontSize: '1.125rem', flex: 1 }}>"{flag.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 10, paddingTop: '2rem', borderTop: '1px solid rgba(203, 213, 225, 0.5)' }}>
        <p style={{ color: '#475569', fontSize: '1.125rem' }}>
          Analyzed by <span style={{ fontWeight: '600' }}>redflag.buzz</span> • AI job description analysis
        </p>
      </div>
    </div>
  )
}