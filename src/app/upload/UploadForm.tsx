'use client';

import { useState, useEffect } from 'react';

interface UploadFormProps {
  uploadAction: (formData: FormData) => Promise<void>;
  serverError?: string;
}

export default function UploadForm({ uploadAction, serverError }: UploadFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (serverError) {
      setError(decodeURIComponent(serverError));
      setIsUploading(false);
    }
  }, [serverError]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setError(null);
    const fileInput = document.getElementById('pdf_file') as HTMLInputElement;
    const titleInput = document.getElementById('title') as HTMLInputElement;

    const file = fileInput?.files?.[0];
    const title = titleInput?.value;

    if (!file || file.size === 0) {
      e.preventDefault();
      setError("Please select a valid PDF file.");
      return;
    }

    // Verify it's a PDF
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      e.preventDefault();
      setError("Only PDF files are allowed.");
      return;
    }

    // 20MB limit (20 * 1024 * 1024 bytes)
    const maxSizeBytes = 20 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      e.preventDefault();
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum size allowed is 20 MB.`);
      return;
    }

    if (!title || !title.trim()) {
      e.preventDefault();
      setError("Document Title is required.");
      return;
    }

    // Validation passed! Show progress overlay
    setIsUploading(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Premium Loading Overlay */}
      {isUploading && (
        <div className="loading-overlay animate-fade-in">
          <div className="spinner-large"></div>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: '0.2px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Uploading Document...
          </p>
          <p style={{ fontSize: '0.85rem', opacity: 0.8, maxWidth: '280px', textAlign: 'center', lineHeight: 1.4 }}>
            Uploading your PDF to our secure servers. Please do not close this tab or refresh.
          </p>
        </div>
      )}

      <form 
        action={uploadAction} 
        onSubmit={handleFormSubmit}
        className="flex" 
        style={{ flexDirection: 'column', gap: '1.25rem' }}
        noValidate
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="title" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            Document Title *
          </label>
          <input 
            id="title" 
            name="title" 
            type="text" 
            required 
            disabled={isUploading}
            placeholder="e.g. Introduction to Next.js"
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid rgba(255,255,255,0.08)', 
              background: 'rgba(255,255,255,0.03)', 
              color: 'white',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
            }}
            className="input-focus"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="description" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            Description
          </label>
          <textarea 
            id="description" 
            name="description" 
            rows={3}
            disabled={isUploading}
            placeholder="Briefly describe what this PDF is about..."
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid rgba(255,255,255,0.08)', 
              background: 'rgba(255,255,255,0.03)', 
              color: 'white', 
              resize: 'vertical',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
            }}
            className="input-focus"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="category" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              disabled={isUploading}
              style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                background: 'rgba(30, 41, 59, 0.9)', 
                color: 'white',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                colorScheme: 'dark',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="Education & Academics" style={{ background: '#111827', color: 'white' }}>Education & Academics</option>
              <option value="Science & Technology" style={{ background: '#111827', color: 'white' }}>Science & Technology</option>
              <option value="Business & Finance" style={{ background: '#111827', color: 'white' }}>Business & Finance</option>
              <option value="Self-Development & Motivation" style={{ background: '#111827', color: 'white' }}>Self-Development & Motivation</option>
              <option value="Fiction & Novels" style={{ background: '#111827', color: 'white' }}>Fiction & Novels</option>
              <option value="History & Biography" style={{ background: '#111827', color: 'white' }}>History & Biography</option>
              <option value="Health & Fitness" style={{ background: '#111827', color: 'white' }}>Health & Fitness</option>
              <option value="Kids & Family" style={{ background: '#111827', color: 'white' }}>Kids & Family</option>
              <option value="Arts & Photography" style={{ background: '#111827', color: 'white' }}>Arts & Photography</option>
              <option value="Computers & Programming" style={{ background: '#111827', color: 'white' }}>Computers & Programming</option>
              <option value="Religious & Spiritual" style={{ background: '#111827', color: 'white' }}>Religious & Spiritual</option>
              <option value="Lifestyle & Travel" style={{ background: '#111827', color: 'white' }}>Lifestyle & Travel</option>
              <option value="Law & Politics" style={{ background: '#111827', color: 'white' }}>Law & Politics</option>
              <option value="General" style={{ background: '#111827', color: 'white' }}>General</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="language" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
              Language *
            </label>
            <select
              id="language"
              name="language"
              required
              disabled={isUploading}
              style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                background: 'rgba(30, 41, 59, 0.9)', 
                color: 'white',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                colorScheme: 'dark',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="English" style={{ background: '#111827', color: 'white' }}>English</option>
              <option value="Sinhala" style={{ background: '#111827', color: 'white' }}>Sinhala (සිංහල)</option>
              <option value="Tamil" style={{ background: '#111827', color: 'white' }}>Tamil (தமிழ்)</option>
              <option value="Spanish" style={{ background: '#111827', color: 'white' }}>Spanish</option>
              <option value="French" style={{ background: '#111827', color: 'white' }}>French</option>
              <option value="German" style={{ background: '#111827', color: 'white' }}>German</option>
              <option value="Chinese" style={{ background: '#111827', color: 'white' }}>Chinese</option>
              <option value="Hindi" style={{ background: '#111827', color: 'white' }}>Hindi</option>
              <option value="Arabic" style={{ background: '#111827', color: 'white' }}>Arabic</option>
              <option value="Russian" style={{ background: '#111827', color: 'white' }}>Russian</option>
              <option value="Portuguese" style={{ background: '#111827', color: 'white' }}>Portuguese</option>
              <option value="Bengali" style={{ background: '#111827', color: 'white' }}>Bengali</option>
              <option value="Japanese" style={{ background: '#111827', color: 'white' }}>Japanese</option>
              <option value="Korean" style={{ background: '#111827', color: 'white' }}>Korean</option>
              <option value="Urdu" style={{ background: '#111827', color: 'white' }}>Urdu</option>
              <option value="Italian" style={{ background: '#111827', color: 'white' }}>Italian</option>
              <option value="Turkish" style={{ background: '#111827', color: 'white' }}>Turkish</option>
              <option value="Vietnamese" style={{ background: '#111827', color: 'white' }}>Vietnamese</option>
              <option value="Other" style={{ background: '#111827', color: 'white' }}>Other</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="pdf_file" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            PDF File *
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              id="pdf_file" 
              name="pdf_file" 
              type="file" 
              accept="application/pdf"
              required 
              disabled={isUploading}
              style={{ 
                padding: '1.25rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                border: '2.5px dashed rgba(255,255,255,0.15)', 
                background: 'rgba(0,0,0,0.15)', 
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                width: '100%',
                fontSize: '0.9rem',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
              className="file-input-mobile"
            />
          </div>
          <span style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '2px' }}>
            Only PDF files up to 20 MB are supported.
          </span>
        </div>

        {error && (
          <div style={{ 
            color: 'var(--danger)', 
            fontSize: '0.875rem', 
            background: 'rgba(239, 68, 68, 0.08)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            padding: '0.75rem 1rem', 
            borderRadius: 'var(--radius-md)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isUploading}
          className="btn btn-primary mt-2" 
          style={{ 
            padding: '0.85rem', 
            fontSize: '1rem', 
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isUploading ? 'Uploading...' : 'Submit for Approval'}
        </button>
      </form>

      <style jsx global>{`
        .spinner-large {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(59, 130, 246, 0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .loading-overlay {
          position: absolute;
          top: -24px;
          left: -24px;
          right: -24px;
          bottom: -24px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          border-radius: var(--radius-lg);
          z-index: 100;
          color: white;
        }

        .input-focus:focus {
          border-color: rgba(59, 130, 246, 0.4) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), inset 0 2px 4px rgba(0,0,0,0.2) !important;
        }

        .file-input-mobile:hover {
          border-color: rgba(59, 130, 246, 0.4) !important;
          background: rgba(59, 130, 246, 0.03) !important;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
