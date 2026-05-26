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
      const width = customWidth || 728
      const height = customHeight || 90
      
      const isAdsterraKeyValid = /^[a-f0-9]{32}$/i.test(dataAdSlot)

      if (!isAdsterraKeyValid) {
        containerRef.current.innerHTML = ''
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
        containerRef.current.appendChild(placeholder)
        return
      }

      // Calculate scale if screen is smaller than ad width
      const scale = window.innerWidth < width ? window.innerWidth / width : 1;
      
      containerRef.current.innerHTML = ''
      const adWrapper = document.createElement('div')
      adWrapper.style.transform = `scale(${scale})`
      adWrapper.style.transformOrigin = 'center top'
      adWrapper.style.width = `${width}px`
      adWrapper.style.height = `${height}px`
      adWrapper.style.display = 'flex'
      adWrapper.style.justifyContent = 'center'

      const iframe = document.createElement('iframe')
      iframe.width = width.toString()
      iframe.height = height.toString()
      iframe.style.border = 'none'
      iframe.style.overflow = 'hidden'
      iframe.scrolling = 'no'

      adWrapper.appendChild(iframe)
      containerRef.current.appendChild(adWrapper)
      
      containerRef.current.style.height = `${height * scale}px`
      containerRef.current.style.minHeight = `${height * scale}px`

      const doc = iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : '${dataAdSlot}',
                  'format' : 'iframe',
                  'height' : ${height},
                  'width' : ${width},
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/${dataAdSlot}/invoke.js"></script>
            </body>
          </html>
        `)
        doc.close()
      }
    }
  }, [dataAdSlot, network, customWidth, customHeight])

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

