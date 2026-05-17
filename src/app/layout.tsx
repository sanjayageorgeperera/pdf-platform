import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from '@/utils/supabase/server';
import Toast from '@/components/Toast';
import { Suspense } from 'react';
import Navbar from "@/components/Navbar";

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
        <Navbar user={user} userRole={userRole} />
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
