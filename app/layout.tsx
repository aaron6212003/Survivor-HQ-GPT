import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AccountProvider } from '@/components/AccountProvider';

export const metadata: Metadata = {
  title: 'Pickem HQ | NFL Pick\'em & Survivor Hub',
  description: 'Manage NFL Survivor entries and Pick\'em leagues with real-time pick tracking, survivor grid, schedule matrix, and analytics.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080b10] text-slate-100 min-h-screen flex flex-col font-sans antialiased">
        <AccountProvider>
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
          {children}
        </main>
        <footer className="bg-[#0b1017] border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-400">PICKEM HQ</span>
              <span>•</span>
              <span>Real NFL leagues</span>
            </div>
            <div className="flex items-center gap-4">
              <a className="hover:text-white" href="/privacy">Privacy</a>
              <a className="hover:text-white" href="/terms">Terms</a>
              <a className="hover:text-white" href="/support">Support</a>
            </div>
          </div>
        </footer>
        </AccountProvider>
      </body>
    </html>
  );
}
