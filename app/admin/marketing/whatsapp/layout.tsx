import type { Metadata } from 'next';
import { createRouteMetadata } from '@/lib/route-metadata';
export const metadata: Metadata = createRouteMetadata({
  title: 'WhatsApp Marketing — LNKICKS Admin',
  path: '/admin/marketing/whatsapp',
  description: 'LNKICKS admin WhatsApp marketing suite',
  noIndex: true,
});
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
