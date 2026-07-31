import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Payment Methods — LNKICKS',
  description: 'Manage your saved payment methods for secure and fast LNKICKS checkout.',
  path: '/payment-methods',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
