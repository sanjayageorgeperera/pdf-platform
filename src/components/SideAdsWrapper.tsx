'use client'

import { useEffect, useState } from 'react'
import AdBanner from './AdBanner'

export default function SideAdsWrapper() {
  const [showAds, setShowAds] = useState(false)

  useEffect(() => {
    // Only show side ads on large desktop screens
    const checkWidth = () => {
      setShowAds(window.innerWidth > 1400)
    }
    
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  if (!showAds) return null

  // Usually side banners are 160x600 skyscraper format
  return (
    <>
      <div style={{ position: 'fixed', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '160px', height: '600px' }}>
        <AdBanner 
          dataAdSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDE_LEFT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || "side-left"} 
          width={160} 
          height={600} 
          style={{ margin: 0, minHeight: '600px' }}
        />
      </div>
      <div style={{ position: 'fixed', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '160px', height: '600px' }}>
        <AdBanner 
          dataAdSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDE_RIGHT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || "side-right"} 
          width={160} 
          height={600} 
          style={{ margin: 0, minHeight: '600px' }}
        />
      </div>
    </>
  )
}
