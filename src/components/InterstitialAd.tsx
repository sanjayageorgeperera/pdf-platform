'use client'

import { useState, useEffect } from 'react'
import AdBanner from './AdBanner'

interface InterstitialAdProps {
  dataAdSlot: string
}

export default function InterstitialAd({ dataAdSlot }: InterstitialAdProps) {
  const [isClosed, setIsClosed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isClosed) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)', /* For iOS Safari */
      zIndex: 99999, /* Extremely high to ensure it covers everything */
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem' /* Prevent touching the edges on small screens */
    }}>
      <div style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '1.5rem 1rem', /* Reduced padding for mobile */
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '380px' /* Constrain width on desktop */
      }}>
        <button 
          onClick={() => setIsClosed(true)}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            background: 'var(--danger)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            transition: 'transform 0.2s ease',
            zIndex: 10
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ×
        </button>
        
        <h3 style={{ fontSize: '1rem', opacity: 0.8, letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center' }}>
          Advertisement
        </h3>
        
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <AdBanner 
            dataAdSlot={dataAdSlot} 
            width={300} 
            height={250} 
            style={{ margin: 0, minHeight: '250px' }}
          />
        </div>
        
        <button 
          onClick={() => setIsClosed(true)}
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.9rem' }}
        >
          Close Ad to View PDF
        </button>
      </div>
    </div>
  )
}
