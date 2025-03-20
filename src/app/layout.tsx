import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Demo Application',
  description: 'Demo Application for UX',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
      <footer className='flex items-center justify-center w-full h-24 border-t text-emerald-700 font-semibold'>
        <a
          className='flex items-center justify-center'
          href='https://vrrnestpaintdemo.vercel.app/'
          target='_blank'
          rel='noopener noreferrer'
        >
          Demo Application
        </a>
      </footer>
    </html>
  );
}
