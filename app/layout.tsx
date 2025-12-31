import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'OmniChannel Agent Studio',
  description: 'Design, simulate, and launch Messenger and WhatsApp agents in one unified workspace.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-b from-midnight to-slate-950 text-slate-100">
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-messenger/20 blur-3xl" />
            <div className="absolute -right-20 top-40 h-96 w-96 rounded-full bg-whatsapp/20 blur-3xl" />
          </div>
          <main className="relative z-10 flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
