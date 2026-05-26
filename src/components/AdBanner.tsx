'use client'

import { useEffect, useRef, useState } from 'react'

interface AdBannerProps {
  dataAdSlot: string
  style?: React.CSSProperties
  width?: number
  height?: number
}

export default function AdBanner({ dataAdSlot, style, width: customWidth, height: customHeight }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDev, setIsDev] = useState(false)
  const network = process.env.NEXT_PUBLIC_AD_NETWORK || 'adsterra'

  useEffect(() => {
    setIsDev(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    if (typeof window === 'undefined' || !containerRef.current) return

    // If active network is Adsterra
    if (network === 'adsterra') {
      containerRef.current.innerHTML = ''
      
      const width = customWidth || 728
      const height = customHeight || 90
      
      // Calculate scale if screen is smaller than ad width
      const scale = window.innerWidth < width ? window.innerWidth / width : 1;
      
      const adWrapper = document.createElement('div');
      adWrapper.style.transform = `scale(${scale})`;
      adWrapper.style.transformOrigin = 'center top';
      adWrapper.style.width = `${width}px`;
      adWrapper.style.height = `${height}px`;
      adWrapper.style.display = 'flex';
      adWrapper.style.justifyContent = 'center';
      
      // Adsterra keys are 32-character hexadecimal hashes
      const isAdsterraKeyValid = /^[a-f0-9]{32}$/i.test(dataAdSlot)

      if (!isAdsterraKeyValid) {
        // If not a valid key, render a premium layout placeholder
        const placeholder = document.createElement('div')
        Object.assign(placeholder.style, {
          width: '100%',
          height: `${height}px`,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: '0.8rem',
          letterSpacing: '1px',
          textAlign: 'center'
        })
        placeholder.innerText = `📢 ADSTERRA BANNER (Paste 32-char key in .env.local: "${dataAdSlot}")`
        adWrapper.appendChild(placeholder)
        containerRef.current.appendChild(adWrapper)
        containerRef.current.style.minHeight = `${height * scale}px`
        return
      }

      // Create configuration script
      const scriptConfig = document.createElement('script')
      scriptConfig.type = 'text/javascript'
      scriptConfig.innerHTML = `
        atOptions = {
          'key' : '${dataAdSlot}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `

      // Create invoke script
      const scriptInvoke = document.createElement('script')
      scriptInvoke.type = 'text/javascript'
      scriptInvoke.src = `//www.highperformanceformat.com/${dataAdSlot}/invoke.js`

      adWrapper.appendChild(scriptConfig)
      adWrapper.appendChild(scriptInvoke)
      containerRef.current.appendChild(adWrapper)
      
      containerRef.current.style.height = `${height * scale}px`
      containerRef.current.style.minHeight = `${height * scale}px`
    }
  }, [dataAdSlot, network])

  useEffect(() => {
    if (network === 'adsense' && !isDev && typeof window !== 'undefined') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error', err);
      }
    }
  }, [network, isDev, dataAdSlot])

  // If using AdSense
  if (network === 'adsense') {
    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-5432611796767770'
    return (
      <div style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden', ...style }}>
        {isDev ? (
          <div style={{
            width: '100%',
            height: '90px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '0.8rem',
            letterSpacing: '1px'
          }}>
            📢 GOOGLE ADSENSE (Localhost Test - Slot: {dataAdSlot})
          </div>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center', width: '100%' }}
            data-ad-client={publisherId}
            data-ad-slot={dataAdSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        margin: '1.5rem 0', 
        display: 'flex', 
        justifyContent: 'center', 
        width: '100%', 
        overflow: 'hidden', 
        minHeight: '90px',
        ...style 
      }} 
    />
  )
}

