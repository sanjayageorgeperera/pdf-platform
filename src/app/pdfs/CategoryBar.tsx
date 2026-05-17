'use client'

import { useRef } from 'react'
import Link from 'next/link'

interface CategoryBarProps {
  categories: string[]
  currentCategory: string
  searchQuery?: string
  languageQuery?: string
}

export default function CategoryBar({ categories, currentCategory, searchQuery, languageQuery }: CategoryBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -250, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 250, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
      {/* Swipe indicator overlay on the LEFT side */}
      <div 
        style={{ 
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: '0.75rem',
          width: '60px',
          background: 'linear-gradient(90deg, rgba(15,23,42,1) 0%, rgba(15,23,42,0.95) 20%, rgba(15,23,42,0) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: '0.5rem',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <button 
          onClick={scrollLeft}
          className="animate-bounce-horizontal-left"
          style={{ 
            fontSize: '0.9rem', 
            color: 'var(--accent)', 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            fontWeight: 700,
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)',
            pointerEvents: 'auto', // Allow clicks specifically on the button
            cursor: 'pointer'
          }}
          title="Scroll Left"
        >
          ←
        </button>
      </div>

      {/* Scrollable Categories Container */}
      <div 
        ref={containerRef}
        style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          overflowX: 'auto', 
          paddingBottom: '0.75rem', 
          width: '100%',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: '40px', // Space for left arrow overlay
          paddingRight: '40px' // Space for right arrow overlay
        }}
        className="no-scrollbar"
      >
        {categories.map((cat) => {
          const isActive = currentCategory === cat
          
          // Build search URL
          const params = new URLSearchParams()
          if (searchQuery) params.set('q', searchQuery)
          if (languageQuery && languageQuery !== 'All') params.set('lang', languageQuery)
          if (cat !== 'All') params.set('category', cat)
          const searchUrl = `/pdfs${params.toString() ? `?${params.toString()}` : ''}`

          return (
            <Link
              key={cat}
              href={searchUrl}
              className="btn hover:scale-[1.02] transition-transform"
              style={{
                background: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                whiteSpace: 'nowrap',
                padding: '0.4rem 0.9rem',
                fontSize: '0.8rem',
                textDecoration: 'none',
                borderRadius: '999px'
              }}
            >
              {cat}
            </Link>
          )
        })}
      </div>

      {/* Swipe indicator overlay on the RIGHT side */}
      <div 
        style={{ 
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: '0.75rem',
          width: '60px',
          background: 'linear-gradient(90deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.95) 80%, rgba(15,23,42,1) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '0.5rem',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <button 
          onClick={scrollRight}
          className="animate-bounce-horizontal"
          style={{ 
            fontSize: '0.9rem', 
            color: 'var(--accent)', 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            fontWeight: 700,
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)',
            pointerEvents: 'auto', // Allow clicks specifically on the button
            cursor: 'pointer'
          }}
          title="Scroll Right"
        >
          →
        </button>
      </div>
    </div>
  )
}
