import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Edit Product — LNKICKS Admin',
  description: 'Edit an existing LNKICKS catalog product — pricing, inventory, images, and metadata.',
  path: '/edit-product',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
