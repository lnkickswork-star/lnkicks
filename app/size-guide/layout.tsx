import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Size Guide — LNKICKS',
  description: 'LNKICKS footwear size guide — convert UK, US, and EU sizes for the perfect sneaker fit.',
  path: '/size-guide',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
