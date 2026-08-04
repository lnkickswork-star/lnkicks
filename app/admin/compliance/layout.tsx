import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Copyright & Brand Compliance Center — LNKICKS Admin',
  description: 'Pre-publish compliance screening for copyright, trademark, branding, SEO, and policy risks.',
  path: '/admin/compliance',
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
