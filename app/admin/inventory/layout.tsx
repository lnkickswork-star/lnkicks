import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({ title: 'Inventory — LNKICKS Admin', path: '/admin/inventory', description: "LNKICKS admin", noIndex: true });
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
