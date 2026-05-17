import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { signout, makeMeAdmin } from '@/app/login/actions';
import Toast from '@/components/Toast';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Knowledge Platform",
  description: "Share and review PDFs online",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userRole = 'user';
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    const rawRole = profile?.role || 'user';
    userRole = rawRole.trim().toLowerCase();
    
    // Auto-fix: if they have no profile at all, create it as admin for testing
    if (!profile) {
       await supabase.from('profiles').insert([{ id: user.id, full_name: user.email?.split('@')[0] || 'User', role: 'admin' }]);
       userRole = 'admin';
    } else if (userRole === 'admin' && rawRole !== 'admin') {
       // Normalize DB value to avoid RLS strict policy match failure
       await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
    }
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>PDFHub</Link>
            <Link href="/pdfs" style={{ opacity: 0.8, textDecoration: 'none' }} className="hover:opacity-100 transition-opacity">Explore</Link>
            <Link href="/quizzes" style={{ opacity: 0.8, textDecoration: 'none' }} className="hover:opacity-100 transition-opacity">Quizzes</Link>
            <Link href="/discussions" style={{ opacity: 0.8, textDecoration: 'none' }} className="hover:opacity-100 transition-opacity">Discussions</Link>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {user ? (
              <>
                 {userRole === 'admin' && (
                  <Link href="/admin" style={{ opacity: 0.8, color: 'var(--success)' }} className="hover:opacity-100 transition-opacity">Admin</Link>
                )}
                <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Role: {userRole}</span>
                {userRole === 'user' && (
                  <form action={makeMeAdmin}>
                    <button type="submit" style={{ padding: '0.2rem 0.5rem', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Make Admin (Dev Only)</button>
                  </form>
                )}
                <Link href="/dashboard" style={{ opacity: 0.8 }} className="hover:opacity-100 transition-opacity">Dashboard</Link>
                <form action={signout}>
                  <button type="submit" style={{ opacity: 0.8, background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1rem' }} className="hover:opacity-100 transition-opacity">Logout</button>
                </form>
              </>
            ) : (
               <Link href="/login" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Login</Link>
            )}
          </div>
        </nav>
        <main>
          {children}
        </main>
        <Suspense fallback={null}>
          <Toast />
        </Suspense>
      </body>
    </html>
  );
}
