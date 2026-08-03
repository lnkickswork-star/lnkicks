import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({ title: 'Integrations — LNKICKS Admin', path: '/admin/integrations', description: 'LNKICKS admin integration center', noIndex: true });
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
