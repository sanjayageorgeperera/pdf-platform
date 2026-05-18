import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export default function Home() {
  return (
    <div className="container animate-fade-in">
      <main style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h1 className="mb-4" style={{ marginTop: '2rem' }}>Master Knowledge with Free PDFs & Quizzes</h1>
        <p className="mb-8" style={{ color: 'var(--foreground)', opacity: 0.8, maxWidth: '600px', margin: '0 auto 2rem' }}>
          Join our global community. Read high-quality PDFs for free, test your knowledge with interactive quizzes, and earn scores.
        </p>

        {/* Premium Search Bar */}
        <form action="/pdfs" method="GET" className="home-search-form">
          <input 
            type="text" 
            name="q" 
            placeholder="Search free PDFs (e.g., share market, stock)..."
            required
            className="home-search-input"
          />
          <button type="submit" className="btn btn-primary home-search-btn">
            Search 🔍
          </button>
        </form>

        <div className="flex justify-center gap-4 mb-8 home-cta-buttons">
          <Link href="/pdfs" className="btn btn-primary cta-btn">
            Start Reading
          </Link>
          <Link href="/upload" className="btn btn-secondary cta-btn">
            Upload a PDF
          </Link>
        </div>

        {/* Ad Space */}
        <AdBanner dataAdSlot="home-banner" />

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
