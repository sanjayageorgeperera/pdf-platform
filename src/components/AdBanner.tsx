'use client'

import { useEffect } from 'react'

const PUBLISHER_ID = 'ca-pub-5432611796767770'

interface AdBannerProps {
  dataAdSlot: string
  style?: React.CSSProperties
}

export default function AdBanner({ dataAdSlot, style }: AdBannerProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [dataAdSlot])

  return (
    <div style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', width: '100%' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={dataAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

