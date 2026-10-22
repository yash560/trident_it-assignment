import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://tridentit.vercel.app'),
  title: 'Trident IT — Promotional Offers & Supermarket REST API Platform',
  description:
    'Production-grade REST API and interactive platform for supermarket business registration, promotional offer publishing, and real-time shopper deal discovery. Powered by TheWebVale.',
  keywords: [
    'Trident IT',
    'Promotional Offers',
    'Supermarket Discounts',
    'Retail REST API',
    'OpenAPI 3.1',
    'TheWebVale',
    'Next.js 15',
    'TypeScript',
    'Prisma',
  ],
  authors: [{ name: 'Trident IT & TheWebVale' }],
  creator: 'TheWebVale',
  publisher: 'Trident IT',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tridentit.vercel.app',
    siteName: 'Trident IT — Promotional Offers Platform',
    title: 'Trident IT — Supermarket REST API Platform | Powered by TheWebVale',
    description:
      'Publish, manage, and discover verified supermarket promotional discounts in real time with OpenAPI 3.1 documentation and automated capacity validation.',
    images: [
      {
        url: 'https://tridentit.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trident IT Promotional Offers Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trident IT — Supermarket Deals Platform | Powered by TheWebVale',
    description:
      'Real-time supermarket discount publishing and discovery API platform. Powered by TheWebVale.',
    images: ['https://tridentit.vercel.app/og-image.png'],
    creator: '@TheWebVale',
  },
  alternates: {
    canonical: 'https://tridentit.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏛️</text></svg>" />
      </head>
      <body className="antialiased min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-[#0f172a] dark:text-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
