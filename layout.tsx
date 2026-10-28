import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Digital Heroes | Golf Performance & Charity Draw Platform',
  description: 'A subscription-driven platform combining golf performance tracking, charitable giving, and monthly algorithmic prize pools.',
  keywords: ['golf performance', 'Stableford score', 'charity draw', 'golf philanthropy', 'prize pool'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fbf9f5] text-[#1c1917] antialiased selection:bg-purple-200 selection:text-purple-900">
        <AppProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
