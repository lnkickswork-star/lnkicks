import React from 'react';
import type { Metadata } from 'next';
import { Oswald, Playfair_Display, Inter } from 'next/font/google';
import { AppProvider } from '@/components/context/AppContext';

/* ------------------------------------------------------------------
   next/font/google — self-hosted Google Fonts
   ------------------------------------------------------------------
   Replaces the previous <link rel="stylesheet" href="https://fonts.googleapis.com/...">
   CDN approach. Benefits:
     • No external request → faster TTFB
     • No layout shift (font files preloaded)
     • No FOUT (font-display: swap handled automatically)
     • CSS variable exposed for inline style consumption

   The three CSS variables (--font-oswald, --font-playfair, --font-inter)
   are applied to <html> via the .variable property of each font instance.
   Every inline fontFamily: "var(--font-oswald), sans-serif" reference in the
   codebase has been migrated to fontFamily: 'var(--font-oswald), sans-serif'
   (and likewise for Playfair Display and Inter).
   ------------------------------------------------------------------ */

const oswald = Oswald({
  subsets: ['latin'],
  // Oswald on Google Fonts only ships weights 200–700. The original
  // Google CDN request asked for 600/700/800, but 800 was silently
  // synthesized as 700 by the browser. We keep 600 and 700 here so
  // the visual output is identical to the pre-migration state.
  weight: ['600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LNKICKS — Stocked & Loaded',
  description:
    "India's premier destination for authentic luxury sneakers and hyped drops.",
  metadataBase: new URL('https://www.lnkicks.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LNKICKS — Stocked & Loaded',
    description:
      "India's premier destination for authentic luxury sneakers and hyped drops.",
    url: 'https://www.lnkicks.com',
    siteName: 'LNKICKS',
    type: 'website',
    images: [
      {
        url: '/jordan_powder_blue_nobg.png',
        width: 1200,
        height: 630,
        alt: 'LNKICKS — Stocked & Loaded',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lnkicks',
    title: 'LNKICKS — Stocked & Loaded',
    description:
      "India's premier destination for authentic luxury sneakers and hyped drops.",
    images: ['/jordan_powder_blue_nobg.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${playfair.variable} ${inter.variable}`}
    >
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: 'var(--font-inter), sans-serif',
          background: '#0A0A0A',
          color: '#0A0A0A',
        }}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
