import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Manage Customers — LNKICKS Admin',
  description: 'View and manage LNKICKS customer accounts, order history, and support tickets.',
  path: '/customers-management',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
