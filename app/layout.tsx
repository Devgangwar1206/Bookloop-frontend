import type {Metadata, Viewport} from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'BookLoop — Buy. Sell. Exchange. Read Again.',
  description: 'A community-driven marketplace to buy, sell, and exchange new and used books from readers and verified sellers around you.',
  openGraph: {
    title: 'BookLoop — Buy. Sell. Exchange. Read Again.',
    description: 'A community-driven marketplace to buy, sell, and exchange new and used books from readers and verified sellers around you.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookLoop — Buy. Sell. Exchange. Read Again.',
    description: 'A community-driven marketplace to buy, sell, and exchange new and used books from readers and verified sellers around you.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen selection:bg-blue-500/20 selection:text-blue-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
