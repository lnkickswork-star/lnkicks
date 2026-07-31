import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Saved Addresses — LNKICKS',
  description: 'Manage your saved shipping and billing addresses for faster LNKICKS checkout.',
  path: '/addresses',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
