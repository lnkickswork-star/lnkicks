import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';

export const metadata: Metadata = createRouteMetadata({
  title: 'Design System Foundation — LNKICKS Admin',
  path: '/admin/foundation',
  description: 'LNKICKS Enterprise Admin Design System — tokens, primitives, icons',
  noIndex: true,
});

export default function FoundationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
