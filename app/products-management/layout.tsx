import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Manage Catalog — LNKICKS Admin',
  description: 'Manage the LNKICKS product catalog — add, edit, and inventory-track authentic luxury sneakers.',
  path: '/products-management',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
