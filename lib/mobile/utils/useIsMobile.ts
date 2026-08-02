'use client';

import { useEffect, useState } from 'react';

/**
 * useIsMobile — client-side mobile detection hook.
 *
 * Mirrors the detection logic used by `MobileLayout` and
 * `ResponsiveAppLayout` (UA pattern OR viewport width ≤ 768).
 *
 * Returns `null` during SSR + first paint (to avoid hydration mismatch),
 * then `true`/`false` after the effect runs.
 *
 * Usage:
 *   const isMobile = useIsMobile();
 *   if (isMobile === null) return null; // or a skeleton
 *   return isMobile ? <MobileCard /> : <DesktopCard />;
 */

// Mirrors the pattern in components/layout/MobileLayout.tsx
const MOBILE_UA_PATTERN =
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|BlackBerry|Windows Phone|webOS|Mobile/i;

export function useIsMobile(): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const detect = () => {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
      setIsMobile(MOBILE_UA_PATTERN.test(ua) || vw <= 768);
    };
    detect();
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  return isMobile;
}

export default useIsMobile;
