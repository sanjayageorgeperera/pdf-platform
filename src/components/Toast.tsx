'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function ToastContent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const message = searchParams.get('message')
    const error = searchParams.get('error')

    if (message) {
      setToast({ message, type: 'success' })
      setIsExiting(false)
      
      const exitTimer = setTimeout(() => {
        setIsExiting(true)
      }, 3500)

      const removeTimer = setTimeout(() => {
        setToast(null)
        setIsExiting(false)
        
        // Clean URL
        const params = new URLSearchParams(window.location.search)
        params.delete('message')
        params.delete('error')
        const newSearch = params.toString()
        router.replace(`${pathname}${newSearch ? `?${newSearch}` : ''}`)
      }, 4000)

      return () => {
        clearTimeout(exitTimer)
        clearTimeout(removeTimer)
      }
    } else if (error) {
      setToast({ message: error, type: 'error' })
      setIsExiting(false)

      const exitTimer = setTimeout(() => {
        setIsExiting(true)
      }, 3500)

      const removeTimer = setTimeout(() => {
        setToast(null)
        setIsExiting(false)
        
        // Clean URL
        const params = new URLSearchParams(window.location.search)
        params.delete('message')
        params.delete('error')
        const newSearch = params.toString()
        router.replace(`${pathname}${newSearch ? `?${newSearch}` : ''}`)
      }, 4000)

      return () => {
        clearTimeout(exitTimer)
        clearTimeout(removeTimer)
      }
    }
  }, [searchParams, pathname, router])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setToast(null)
      setIsExiting(false)
      const params = new URLSearchParams(window.location.search)
      params.delete('message')
      params.delete('error')
      const newSearch = params.toString()
      router.replace(`${pathname}${newSearch ? `?${newSearch}` : ''}`)
    }, 350)
  }

  if (!toast) return null

  const isSuccess = toast.type === 'success'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.9rem 1.25rem',
        borderRadius: '8px',
        borderLeft: `4px solid ${isSuccess ? 'var(--success)' : 'var(--danger)'}`,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(255,255,255,0.08)',
        color: 'white',
        minWidth: '320px',
        maxWidth: '450px',
        fontSize: '0.9rem',
        pointerEvents: 'auto',
      }}
      className={isExiting ? 'toast-exit' : 'toast-enter'}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: isSuccess ? 'var(--success)' : 'var(--danger)',
          fontWeight: 'bold',
          fontSize: '0.75rem',
          flexShrink: 0
        }}
      >
        {isSuccess ? '✓' : '✕'}
      </span>

      <div style={{ flex: 1, fontWeight: 500, paddingRight: '0.5rem', lineHeight: 1.4 }}>
        {toast.message}
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          opacity: 0.5,
          cursor: 'pointer',
          fontSize: '1rem',
          padding: '0.2rem',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0
        }}
        className="hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}

export default function Toast() {
  return (
    <Suspense fallback={null}>
      <ToastContent />
    </Suspense>
  )
}
