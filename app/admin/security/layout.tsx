import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({ title: 'Security Center — LNKICKS Admin', path: '/admin/security', description: 'LNKICKS admin security center', noIndex: true });
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
