import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({ title: 'Roles & Permissions — LNKICKS Admin', path: '/admin/roles', description: 'LNKICKS admin RBAC matrix', noIndex: true });
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
