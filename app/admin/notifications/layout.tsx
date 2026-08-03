import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({ title: 'Notifications — LNKICKS Admin', path: '/admin/notifications', description: "LNKICKS admin", noIndex: true });
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
