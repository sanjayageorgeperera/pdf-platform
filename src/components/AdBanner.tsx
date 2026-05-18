'use client'

import { useEffect, useState } from 'react'

interface AdBannerProps {
  dataAdSlot: string
  style?: React.CSSProperties
}

export default function AdBanner({ dataAdSlot, style }: AdBannerProps) {
  const [isDev, setIsDev] = useState(true)
  const [pubId, setPubId] = useState('')

  useEffect(() => {
    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || ''
    const hasValidPub = publisherId && publisherId !== 'ca-pub-placeholder' && !publisherId.includes('xxxx')
    
    setIsDev(!hasValidPub)
    setPubId(publisherId)

    if (hasValidPub) {
      try {
        // Initialize AdSense push queue safely
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense initialization error:', error)
      }
    }
  }, [dataAdSlot])

  // In development or if publisher ID is missing, show a beautiful, premium placeholder
  if (isDev) {
    return (
      <div 
        style={{
          margin: '1.5rem 0',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed rgba(255, 255, 255, 0.15)',
          background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          minHeight: '100px',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '0.8rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          width: '100%',
          boxSizing: 'border-box',
          ...style
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4285F4' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <span>Google AdSense Space</span>
        </div>
        <div style={{ opacity: 0.6, fontSize: '0.7rem' }}>
          Slot ID: {dataAdSlot} | Add your ID in .env.local to activate
        </div>
      </div>
    )
  }

  return (
    <div style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', width: '100%' }}
        data-ad-client={pubId}
        data-ad-slot={dataAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
