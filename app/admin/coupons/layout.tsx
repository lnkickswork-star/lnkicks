import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({ title: 'Coupons — LNKICKS Admin', path: '/admin/coupons', description: "LNKICKS admin", noIndex: true });
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
