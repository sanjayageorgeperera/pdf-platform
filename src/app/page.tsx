import Link from 'next/link';

export default function Home() {
  return (
    <div className="container animate-fade-in">
      <header className="flex justify-between items-center glass" style={{ padding: '1rem 2rem', borderRadius: 'var(--radius-full)', marginTop: '1rem' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>Read & Quiz</div>
        <nav className="flex gap-4 items-center">
          <Link href="/pdfs" className="btn btn-secondary">Explore PDFs</Link>
          <Link href="/login" className="btn btn-primary">Sign In</Link>
        </nav>
      </header>

      <main style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 className="mb-4">Master Knowledge with Free PDFs & Quizzes</h1>
        <p className="mb-8" style={{ color: 'var(--foreground)', opacity: 0.8, maxWidth: '600px', margin: '0 auto 2rem' }}>
          Join our global community. Read high-quality PDFs for free, test your knowledge with interactive quizzes, and earn scores.
        </p>

        {/* Premium Search Bar */}
        <form action="/pdfs" method="GET" style={{ maxWidth: '550px', margin: '0 auto 2.5rem', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.08)' }} className="hover:border-[rgba(255,255,255,0.15)] transition-all">
          <input 
            type="text" 
            name="q" 
            placeholder="Search free PDFs (e.g., share market, stock)..."
            required
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              background: 'none',
              color: 'white',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.75rem 1.75rem', fontSize: '0.9rem' }}>
            Search 🔍
          </button>
        </form>

        <div className="flex justify-center gap-4 mb-8">
          <Link href="/pdfs" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Start Reading
          </Link>
          <Link href="/upload" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Upload a PDF
          </Link>
        </div>

        {/* Ad Placeholder */}
        <div className="card mb-8" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderStyle: 'dashed' }}>
          <p style={{ opacity: 0.5, fontSize: '0.875rem' }}>Advertisement Space</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8" style={{ textAlign: 'left' }}>
          <Link href="/pdfs" className="card hover:scale-[1.02] transition-all" style={{ textDecoration: 'none', color: 'inherit', display: 'block', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="mb-2">📖 Read & Download</h3>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.4' }}>Access thousands of free educational and entertaining PDFs uploaded by our community.</p>
          </Link>
          <Link href="/quizzes" className="card hover:scale-[1.02] transition-all" style={{ textDecoration: 'none', color: 'inherit', display: 'block', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="mb-2">🧠 Take Quizzes</h3>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.4' }}>Test your understanding of the PDFs. Answer questions and see how you score against others.</p>
          </Link>
          <Link href="/discussions" className="card hover:scale-[1.02] transition-all" style={{ textDecoration: 'none', color: 'inherit', display: 'block', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="mb-2">⭐ Review & Discuss</h3>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.4' }}>Share your thoughts, rate documents, and engage with readers from around the world.</p>
          </Link>
        </section>
      </main>

      <footer className="text-center" style={{ padding: '2rem 0', opacity: 0.5, fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} Read & Quiz. All rights reserved.
      </footer>
    </div>
  );
}
