import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Terms & Conditions — LNKICKS',
  description: 'The terms and conditions governing your use of LNKICKS and purchases of authentic luxury sneakers.',
  path: '/terms-conditions',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
