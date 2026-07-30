import React from 'react';
import { AppProvider } from '@/components/context/AppContext';

export const metadata = {
  title: 'LNKICKS — Stocked & Loaded',
  description: 'India's premier destination for authentic luxury sneakers and hyped drops.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', sans-serif", background: '#0A0A0A', color: '#0A0A0A' }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
