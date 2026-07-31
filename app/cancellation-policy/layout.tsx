import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Cancellation Policy — LNKICKS',
  description: 'LNKICKS order cancellation policy — eligibility, timelines, and refund processing.',
  path: '/cancellation-policy',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
