import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Frequently Asked Questions — LNKICKS',
  description: 'Answers to common LNKICKS questions on authenticity, shipping, returns, and sizing.',
  path: '/faqs',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
