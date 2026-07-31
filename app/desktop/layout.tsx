import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'LNKICKS — Desktop Home',
  description: 'Desktop home for LNKICKS — shop authentic luxury sneakers and hyped drops.',
  path: '/desktop',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
