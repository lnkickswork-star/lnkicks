import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Admin Dashboard — LNKICKS',
  description: 'LNKICKS admin dashboard — catalog, orders, customers, and analytics overview.',
  path: '/dashboard',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
