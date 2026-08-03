import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Order Details — LNKICKS',
  description: 'View detailed information about your LNKICKS order including items, shipping, and tracking.',
  path: '/order-detail',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
