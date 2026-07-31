import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Settings Panel — LNKICKS Admin',
  description: 'Configure LNKICKS store settings — payments, shipping, taxes, and integrations.',
  path: '/settings-panel',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
