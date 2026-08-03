import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Flash Sale Settings — LNKICKS Admin',
  description: 'Configure the mobile homepage Flash Sale section.',
  path: '/flash-sale-settings',
  noIndex: true,
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
