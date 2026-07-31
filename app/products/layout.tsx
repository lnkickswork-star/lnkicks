import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'All Products — LNKICKS',
  description: 'Browse every authentic luxury sneaker and apparel product available at LNKICKS.',
  path: '/products',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
