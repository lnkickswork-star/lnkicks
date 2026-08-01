'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { safeArea } from '@/lib/mobile/utils/safeArea';
import { haptic } from '@/lib/mobile/utils/haptics';

/**
 * MobileFooter — premium minimal footer.
 *
 * Compact dark-on-white footer with LNKICKS wordmark, short tagline,
 * link columns (Shop / Help / Company), and social icons.
 *
 * LN KICKS theme: white bg, black text, soft grey dividers.
 *
 * Phase 3 polish: design tokens, haptics, focus-visible, memoized,
 * safe-area-aware bottom padding (clears floating bottom nav + Home Indicator).
 */

const SHOP_LINKS = [
  { label: 'All Sneakers', href: '/products' },
  { label: 'Trending', href: '/products?filter=trending' },
  { label: 'Luxury', href: '/category/luxury' },
  { label: 'New Arrivals', href: '/products?filter=new' },
] as const;

const HELP_LINKS = [
  { label: 'Track Order', href: '/track-order' },
  { label: 'Shipping', href: '/shipping-policy' },
  { label: 'Returns', href: '/return-refund-policy' },
  { label: 'Size Guide', href: '/size-guide' },
] as const;

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact-us' },
  { label: 'Terms', href: '/terms-conditions' },
  { label: 'Privacy', href: '/privacy-policy' },
] as const;

function MobileFooterImpl() {
  return (
    <footer
      style={{
        background: theme.colors.white,
        borderTop: `1px solid ${theme.colors.grey150}`,
        // Safe-area-aware: clears floating bottom nav + iOS Home Indicator
        padding: `${theme.spacing.huge + 4}px ${theme.spacing.pad}px calc(120px + ${safeArea.paddingBottom})`,
      }}
    >
      {/* Wordmark + tagline */}
      <div style={{ marginBottom: theme.spacing.huge }}>
        <div
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.title + 2,
            fontWeight: theme.fontWeight.extrabold,
            letterSpacing: theme.letterSpacing.widest,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }}
        >
          LNKICKS
        </div>
        <p
          style={{
            fontSize: theme.fontSize.base,
            color: theme.colors.textSecondary,
            margin: 0,
            lineHeight: theme.lineHeight.relaxed,
            maxWidth: 280,
          }}
        >
          India&apos;s premium destination for authenticated luxury sneakers.
          Verified by CheckCheck & LegitApp. 100% money-back guarantee.
        </p>
      </div>

      {/* Link columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: theme.spacing.xl,
          marginBottom: theme.spacing.huge,
        }}
      >
        <FooterColumn title="Shop" links={SHOP_LINKS} />
        <FooterColumn title="Help" links={HELP_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
      </div>

      {/* Social row */}
      <div
        style={{
          display: 'flex',
          gap: theme.spacing.sm + 2,
          marginBottom: theme.spacing.xxl,
        }}
      >
        {[
          { label: 'Instagram', href: '#', icon: InstagramIcon },
          { label: 'X', href: '#', icon: XIcon },
          { label: 'YouTube', href: '#', icon: YoutubeIcon },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            onPointerDown={() => haptic.light()}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: `1px solid ${theme.colors.grey300}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.textPrimary,
              textDecoration: 'none',
              transition: `background-color ${theme.motion.duration.normal} ${theme.motion.easing.out}, color ${theme.motion.duration.normal} ${theme.motion.easing.out}`,
            }}
            className="mfooter-social"
          >
            <s.icon />
          </a>
        ))}
      </div>

      {/* Bottom legal */}
      <div
        style={{
          paddingTop: theme.spacing.xl,
          borderTop: `1px solid ${theme.colors.grey150}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
          flexWrap: 'wrap',
        }}
      >
        <p style={{ fontSize: theme.fontSize.sm, color: theme.colors.textTertiary, margin: 0 }}>
          &copy; {new Date().getFullYear()} LN KICKS
        </p>
        <p style={{ fontSize: theme.fontSize.sm, color: theme.colors.textTertiary, margin: 0 }}>
          Made in India
        </p>
      </div>

      <style jsx>{`
        .mfooter-social:hover {
          background-color: ${theme.colors.black} !important;
          color: ${theme.colors.white} !important;
          border-color: ${theme.colors.black} !important;
        }
        .mfooter-social:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
      `}</style>
    </footer>
  );
}

export const MobileFooter = memo(MobileFooterImpl);
export default MobileFooter;

const FooterColumn = memo(function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h4
        style={{
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.extrabold,
          color: theme.colors.textPrimary,
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          margin: `0 0 ${theme.spacing.md + 2}px 0`,
        }}
      >
        {title}
      </h4>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm + 2,
        }}
      >
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              style={{
                fontSize: 12.5,
                color: theme.colors.textSecondary,
                textDecoration: 'none',
                fontWeight: theme.fontWeight.medium,
                transition: `color ${theme.motion.duration.normal} ${theme.motion.easing.out}`,
              }}
              className="mfooter-link"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .mfooter-link:hover {
          color: ${theme.colors.textPrimary} !important;
        }
        .mfooter-link:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
});

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}
