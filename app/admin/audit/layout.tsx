import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({ title: 'Audit Log — LNKICKS Admin', path: '/admin/audit', description: "LNKICKS admin", noIndex: true });
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
