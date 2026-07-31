import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Manage Orders — LNKICKS Admin',
  description: 'Manage and fulfill LNKICKS customer orders from the admin portal.',
  path: '/orders-management',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
