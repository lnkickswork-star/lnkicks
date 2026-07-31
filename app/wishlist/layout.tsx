import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'My Wishlist — LNKICKS',
  description: 'Your saved LNKICKS wishlist — authentic luxury sneakers and apparel you love, ready to buy.',
  path: '/wishlist',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
