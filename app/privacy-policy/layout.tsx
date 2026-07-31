import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Privacy Policy — LNKICKS',
  description: 'Read the LNKICKS privacy policy — how we collect, use, and protect your personal data.',
  path: '/privacy-policy',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
