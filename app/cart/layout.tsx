import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Shopping Cart — LNKICKS',
  description: 'Review the authentic luxury sneakers and apparel in your LNKICKS shopping bag before checkout.',
  path: '/cart',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
