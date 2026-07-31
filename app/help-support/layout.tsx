import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Help & Support — LNKICKS',
  description: 'LNKICKS help center — authenticity guarantee, shipping, returns, and account support.',
  path: '/help-support',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
