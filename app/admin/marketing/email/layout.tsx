import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({
  title: 'Email Marketing — LNKICKS Admin',
  path: '/admin/marketing/email',
  description: 'LNKICKS admin email marketing suite',
  noIndex: true,
});
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
