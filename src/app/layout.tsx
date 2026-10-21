import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trident IT — Promotional Offers & Supermarket REST API Platform',
  description:
    'Production-grade REST API and interactive platform for supermarket business registration, promotional offer publishing, and real-time shopper deal discovery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-[#0f172a] dark:text-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
