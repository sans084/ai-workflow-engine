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
      <body className={inter.className}>
        <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-sm tracking-tight">
            AI Workflow Engine
          </span>
          <div className="flex gap-4">
            <a href="/submit" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Submit
            </a>
            <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Dashboard
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}