import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({ title: 'Marketing Suite — LNKICKS Admin', path: '/admin/marketing', description: 'LNKICKS admin marketing command center', noIndex: true });
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
