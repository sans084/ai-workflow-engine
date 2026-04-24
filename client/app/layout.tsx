import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Workflow Engine',
  description: 'AI-powered request intake and triage system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: '#F8F7FF' }}>
        <nav style={{ background: 'white', borderBottom: '0.5px solid #CECBF6' }} className="px-6 py-3 flex items-center justify-between">
          <span style={{ color: '#534AB7' }} className="font-semibold text-sm tracking-tight">
            AI Workflow Engine
          </span>
          <div className="flex gap-4">
            <a href="/submit" style={{ color: '#888780' }} className="text-sm hover:text-gray-900 transition-colors">
              Submit
            </a>
            <a href="/dashboard" style={{ color: '#888780' }} className="text-sm hover:text-gray-900 transition-colors">
              Dashboard
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}