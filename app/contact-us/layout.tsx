import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Contact Us — LNKICKS',
  description: 'Get in touch with LNKICKS customer support for orders, authenticity, and general inquiries.',
  path: '/contact-us',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
