import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Forgot Password — LNKICKS',
  description: 'Reset your LNKICKS account password. Enter your email to receive a password reset link.',
  path: '/forgot-password',
  noIndex: true,
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
