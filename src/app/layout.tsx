import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CDR City Shuttle - Mobile Ticketing & Boarding Pass System',
  description: 'Housing society shuttle ticketing service between CDR City and Karachi. Easy mobile booking, NOC verification, and EasyPaisa online payments.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-100 text-slate-900 min-h-screen antialiased flex flex-col items-center">
        <div className="w-full max-w-md min-h-screen bg-slate-50 flex flex-col shadow-2xl relative">
          {children}
        </div>
      </body>
    </html>
  );
}
