import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Track Your Order — LNKICKS',
  description: 'Track your LNKICKS order in real time — from authentication verification to delivery at your doorstep.',
  path: '/track-order',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
