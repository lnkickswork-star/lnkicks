import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Order Confirmed — LNKICKS',
  description: 'Your LNKICKS order is confirmed. Track your authentic luxury sneakers shipment here.',
  path: '/order-success',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
