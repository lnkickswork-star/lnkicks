import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'LNKICKS — Mobile App',
  description: 'Mobile experience for LNKICKS — browse authentic luxury sneakers on the go.',
  path: '/mobile',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
