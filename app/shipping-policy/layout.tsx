import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Shipping Policy — LNKICKS',
  description: 'LNKICKS shipping policy — express dispatch, delivery timelines, and shipping coverage across India.',
  path: '/shipping-policy',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
