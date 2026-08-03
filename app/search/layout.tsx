import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Search — LNKICKS',
  description: 'Search authentic luxury sneakers and apparel by brand, name, or category at LNKICKS.',
  path: '/search',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
