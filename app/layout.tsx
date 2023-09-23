import { ThemeProvider } from './contexts/ThemeContext';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ClassInsights',
  description: 'Admin Dashboard for ClassInsights',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='de'>
      <body className='bg-background dark:bg-dark-background text-white'>
        <main className='relative mx-4 min-h-screen md:mx-auto md:w-5/6 xl:w-[65%] 2xl:w-3/5'>
          <ThemeProvider>{children}</ThemeProvider>
        </main>
      </body>
    </html>
  );
}
