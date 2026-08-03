import React from 'react';
import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Verify OTP — LNKICKS',
  description: 'Verify your mobile number with the OTP sent to your phone.',
  path: '/verify-otp',
  noIndex: true,
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
