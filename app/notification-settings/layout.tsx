import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Notification Settings — LNKICKS',
  description: 'Manage how LNKICKS contacts you — order updates, drop alerts, and promotional notifications.',
  path: '/notification-settings',
  noIndex: true,});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
