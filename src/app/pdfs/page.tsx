import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import CategoryBar from './CategoryBar'

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; lang?: string }>
}

export default async function PdfsPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { q, category, lang } = await searchParams

  // Fetch only approved PDFs, optionally filtered by search query and category
  let query = supabase
    .from('documents')
    .select('*, profiles(full_name)')
    .eq('status', 'approved')

  if (q && q.trim()) {
    query = query.or(`title.ilike.%${q.trim()}%,description.ilike.%${q.trim()}%`)
  }

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  if (lang && lang !== 'All') {
    query = query.eq('language', lang)
  }

  const { data: pdfs, error } = await query.order('created_at', { ascending: false })

  const categories = [
    'All',
    'Education & Academics',
    'Science & Technology',
    'Business & Finance',
    'Self-Development & Motivation',
    'Fiction & Novels',
    'History & Biography',
    'Health & Fitness',
    'Kids & Family',
    'Arts & Photography',
    'Computers & Programming',
    'Religious & Spiritual',
    'Lifestyle & Travel',
    'Law & Politics',
    'General'
  ]

  const languages = [
    'English',
    'Sinhala',
    'Tamil',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Hindi',
    'Arabic',
    'Russian',
    'Portuguese',
    'Bengali',
    'Japanese',
    'Korean',
    'Urdu',
    'Italian',
    'Turkish',
    'Vietnamese',
    'Other'
  ]

  return (
    <div className="container mt-8 animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header className="explore-header">
        <h1>Explore PDFs</h1>
        <Link href="/upload" className="btn btn-primary">Upload PDF</Link>
      </header>

      {/* Search Bar */}
      <form action="/pdfs" method="GET" className="explore-search-form">
        <input 
          type="text" 
          name="q" 
          defaultValue={q || ''} 
          placeholder="Search by title or description..." 
          className="explore-search-input"
        />

        {/* Language Filter Dropdown */}
        <select 
          name="lang"
          defaultValue={lang || 'All'}
          className="explore-search-select"
        >
          <option value="All" style={{ background: '#111827', color: 'white' }}>🌐 All Languages</option>
          {languages.map((l) => (
            <option key={l} value={l} style={{ background: '#111827', color: 'white' }}>
              {l === 'Sinhala' ? 'Sinhala (සිංහල)' : l === 'Tamil' ? 'Tamil (தமிழ்)' : l}
            </option>
          ))}
        </select>

        {category && <input type="hidden" name="category" value={category} />}
        
        <div className="explore-search-actions">
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Search
          </button>
          {(q || category || (lang && lang !== 'All')) && (
            <Link href="/pdfs" className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              Clear
            </Link>
          )}
        </div>
      </form>

      <CategoryBar categories={categories} currentCategory={category || 'All'} searchQuery={q} languageQuery={lang} />

      {/* Ad Space */}
      <div className="card mb-8 text-center" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderStyle: 'dashed' }}>
        <p style={{ opacity: 0.5, fontSize: '0.875rem' }}>Advertisement Banner Placement</p>
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>Failed to load PDFs.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pdfs && pdfs.length > 0 ? (
          pdfs.map((pdf) => (
            <Link 
              href={`/pdfs/${pdf.id}`} 
              key={pdf.id} 
              className="card hover:scale-[1.02] transition-all duration-300" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                padding: 0, 
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              {/* Premium PDF Live Cover Preview */}
              <div style={{ position: 'relative', height: '150px', width: '100%', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <iframe
                  src={`${pdf.file_url}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  style={{
                    width: '100%',
                    height: '220px', // taller to crop margins
                    border: 'none',
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                  scrolling="no"
                  title={`Preview of ${pdf.title}`}
                />
                
                {/* Dark Sleek Fading Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(0deg, rgba(15,23,42,1) 0%, rgba(15,23,42,0.3) 50%, rgba(15,23,42,0) 100%)',
                  pointerEvents: 'none'
                }} />

                {/* Floating "Read Book" Circle Indicator */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--accent)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  zIndex: 2
                }}>
                  📖
                </div>
              </div>

              {/* Card Contents Wrapper */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span 
                    style={{ 
                      fontSize: '0.775rem', 
                      background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)', 
                      color: 'white', 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '999px',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px -2px rgba(139, 92, 246, 0.5)',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {pdf.category || 'General'}
                  </span>
                  <span 
                    style={{ 
                      fontSize: '0.775rem', 
                      background: 'rgba(255,255,255,0.08)', 
                      color: 'rgba(255,255,255,0.85)', 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '999px',
                      fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.05)',
                      letterSpacing: '0.5px'
                    }}
                  >
                    🌐 {pdf.language || 'English'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{pdf.title}</h3>
                <p style={{ opacity: 0.7, fontSize: '0.875rem', flex: 1 }}>
                  {pdf.description && pdf.description.length > 100 
                    ? pdf.description.substring(0, 100) + '...' 
                    : pdf.description}
                </p>
                <div className="flex justify-between items-center mt-4" style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                  <span>By: {pdf.profiles?.full_name || 'Anonymous'}</span>
                  <span>Views: {pdf.view_count}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full card text-center py-8">
            <p style={{ opacity: 0.5 }}>{q || category ? 'No results found matching your filters.' : 'No approved PDFs available yet.'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
