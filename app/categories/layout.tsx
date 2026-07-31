import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Categories — LNKICKS',
  description: 'Browse all sneaker and apparel categories — Sneakers, Running, Basketball, Lifestyle, Training, Slides, Limited Edition.',
  path: '/categories',
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
