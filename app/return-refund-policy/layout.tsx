import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Return & Refund Policy — LNKICKS',
  description: 'LNKICKS return and refund policy — 7-day hassle-free returns and exchange on authentic sneakers.',
  path: '/return-refund-policy',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
