import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({ title: 'SEO Center — LNKICKS Admin', path: '/admin/seo', description: "LNKICKS admin", noIndex: true });
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
