import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({ title: 'System Health — LNKICKS Admin', path: '/admin/system-health', description: 'LNKICKS admin system monitoring', noIndex: true });
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
