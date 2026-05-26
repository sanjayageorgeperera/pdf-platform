'use client'

interface FullscreenButtonProps {
  targetId: string;
}

export default function FullscreenButton({ targetId }: FullscreenButtonProps) {
  const handleFullscreen = () => {
    const elem = document.getElementById(targetId);
    if (!elem) return;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      /* Safari */
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      /* IE11 */
      (elem as any).msRequestFullscreen();
    }
  };

  return (
    <button 
      onClick={handleFullscreen} 
      className="btn btn-secondary" 
      style={{ 
        marginBottom: '1rem', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
      </svg>
      Read in Fullscreen
    </button>
  );
}
