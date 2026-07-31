import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Reports & Analytics — LNKICKS Admin',
  description: 'Sales, inventory, and customer analytics reports for LNKICKS admin staff.',
  path: '/reports-analytics',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
