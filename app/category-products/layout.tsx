import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Sneakers & Apparel — LNKICKS',
  description: 'Shop the full LNKICKS catalog of authentic luxury sneakers and apparel across all brands.',
  path: '/category-products',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
