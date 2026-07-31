import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Add Product — LNKICKS Admin',
  description: 'Add a new authentic luxury sneaker or apparel product to the LNKICKS catalog.',
  path: '/add-product',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
