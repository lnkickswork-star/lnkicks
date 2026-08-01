'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * CustomersManagementPage — Admin Customers list.
 *
 * Stage 4g (admin) — Pattern C FULL REWRITE.
 * The original file used undefined Tailwind utility classes
 * (`bg-surface`, `text-headline-lg-mobile`, `font-headline-lg-mobile`,
 * `material-symbols-outlined`, `rounded-xl`, `bg-surface-container-lowest`,
 * `border-outline-variant`, `space-y-stack-md`, etc.) and Material Symbols
 * font icons — it rendered unstyled in production. This rewrite rebuilds
 * the page from scratch with MobileLayout + token-driven inline styles +
 * inline SVG icons.
 *
 * Layout:
 *  - `<MobileLayout headerVariant="back" title="Customers" hideBottomNav>`.
 *  - Page title + sub-copy.
 *  - Search bar with leading magnifier SVG.
 *  - Stats grid (2-col bento): Total Users (black card) + New Today
 *    (white card with border).
 *  - Customer cards: avatar + name + email + order count + Manage Account
 *    CTA + person-action icon button.
 *  - Load-more link at the bottom.
 *
 * Token usage:
 *  - Customer cards: theme.radius.xxl + 1px solid theme.colors.grey150 +
 *    theme.shadows.xs on theme.colors.white.
 *  - Search input: theme.radius.lg + grey100 bg + 1.5px solid grey300 border,
 *    focus → black border.
 *  - Manage Account CTA: black + radius.pill + uppercase + display font +
 *    haptic.medium() + showToast() on click.
 *  - Stat cards: theme.radius.lg + large numeric value in theme.fontSize.h1
 *    + theme.fontWeight.extrabold (Total Users card uses inverted black bg
 *    + white text — matches the original's "asymmetric" bento layout).
 *
 * All 4 customer records (Julian Vos / Elena Rossi / Marcus Thorne /
 * Sasha Kim — each with avatar URL + email + order count) preserved verbatim
 * from the original. Image components preserved (next/image, unoptimized,
 * remote URLs).
 */
export default function CustomersManagementPage() {
  const { showToast } = useApp();
  const [query, setQuery] = useState('');

  const customers = [
    {
      name: 'Julian Vos',
      email: 'julian.vos@gmail.com',
      orders: 24,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB0gXLzCAbeUa0JoBkcUoR-72FUiHVdwxgC_Qw44SlLGVf3k0j0qSbT66jNn-ZfVeB0HhM_DlKyghsIc1OrKlhoJuCPzzPCgcqCIoA-Ftm6gaf4NScz1DIsuh7OsbDtfKEaUKkEFTYZ3gG5eZORXrABJd70HMjHfhqFunWS5z58OFzTdCXwMHhaGEqNxqlu4CyY_SIneIcjLtDDGO9yCGGi-0AkHC0gEeP9hxoRQUWpYh6zoH3tyz8JHQbqWmpuwdwFr64QcIPh4Zm3',
      alt: 'Close up professional portrait of a stylish male customer in his late 20s.',
    },
    {
      name: 'Elena Rossi',
      email: 'e.rossi@luxury.it',
      orders: 18,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA1kYG6RbNcgBFV49SMttRhpq_vRm30S_xmINKpHi-aEAALaLM6K9byBMXWyB6WPtKUTiJZHH8FfhuadbTikATl-jowo0-kdBXcs3FEYa3d9muvQD68jXoyJwo8fysbBtKhR7iTLWTA31zmC1vya0Flqv_FV2dfQ52voAirIsCArQ4zDaLDglH52EtbP6aaFtnqxq6H1yyJu1CihLKZmpbWvX-tRn0sF4Qj33OY_1MQ0wLcQcCcAD0C8ID0P2UNzkrce4SofracTyqJ',
      alt: 'A sophisticated woman in high-fashion attire, photographed in a brightly lit, minimalist studio setting.',
    },
    {
      name: 'Marcus Thorne',
      email: 'm.thorne@design.co',
      orders: 9,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAfcFN2Rpl5B_R0axNlvW8eDxcSancUSjCaoWdwRuZhIiLiBt8gAAOl7u33las1fPeD55L1qVd7yylCIhdUriQ0EnWpRYnE1rT8ZruCJ9YQCyIBWnXkWsFSgdT7oyBUj4O4__fGnILtkmQ9oCOm_K3JsSt_UuMTFzVRGCSKjdwJkh5rn0sBDbAbBu7z0eBhE_l-Odr2DHLIXx2lo93yVEDv19oGNHcUwtb8cuB6Ld5-K4kwyzJyA3yTOiTTaCm0UKH01i8o06rbx_-F',
      alt: 'Candid, sharp portrait of a modern urban man with a minimalist aesthetic.',
    },
    {
      name: 'Sasha Kim',
      email: 'skim@archive.io',
      orders: 31,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDEb4dZ9t7C9Gma3hFR8xhGvbfFECUy0X6e7V27hgBcW0Yt7YcZ7GaGq62p3C8UH1AyIVrOXBIyjPrG5XQFCO6VpCIDf4XzrStL5IrmqwzG7_2GH7UVjYUmJFAbSUdeR4xWLjS9W129QzDl_PsZgtd3bbmt4CUpDoOW7xzUxyLQeoP-aaneFjAP0VdP3VMLpjJV8pLokmu-M2YowDmoJGwMy482cJDLz1bJ5xRdkPqnMEPQeXvnwhNSoPUkBfHj00O3LY8btMQRCfFe',
      alt: 'Editorial style portrait of a creative professional woman in a minimalist, high-end studio.',
    },
  ];

  const handleManage = (name: string) => {
    haptic.medium();
    showToast(`Manage ${name}`);
  };

  const handleLoadMore = () => {
    haptic.light();
    showToast('Loading 20 more customers');
  };

  return (
    <MobileLayout headerVariant="back" title="Customers" hideBottomNav>
      <div style={{ padding: `0 ${theme.spacing.pad}px` }}>
        {/* TITLE */}
        <div style={{ marginBottom: theme.spacing.lg, paddingTop: theme.spacing.sm }}>
          <h1
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h1,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.textPrimary,
              margin: 0,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Customers
          </h1>
          <p
            style={{
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.xs,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Manage your boutique&apos;s clientele
          </p>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: theme.spacing.xl, position: 'relative' }}>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke={theme.colors.textSecondary}
            strokeWidth="2"
            aria-hidden
            style={{
              position: 'absolute',
              left: theme.spacing.lg,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              haptic.selection();
            }}
            placeholder="Search by name or email..."
            aria-label="Search customers"
            className="cm-search"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: theme.colors.grey100,
              border: `1.5px solid ${theme.colors.grey300}`,
              borderRadius: theme.radius.lg,
              padding: `${theme.spacing.md}px ${theme.spacing.md}px ${
                theme.spacing.md
              }px ${theme.spacing.xxl + theme.spacing.lg}px`,
              fontSize: theme.fontSize.md,
              fontFamily: theme.fontFamily.body,
              color: theme.colors.textPrimary,
              transition: 'border-color 180ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* STATS — 2-col bento */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xxl,
          }}
        >
          {/* Total Users — inverted black card */}
          <div
            style={{
              background: theme.colors.black,
              color: theme.colors.white,
              padding: theme.spacing.xl,
              borderRadius: theme.radius.lg,
              boxShadow: theme.shadows.xs,
            }}
          >
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                opacity: 0.7,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              Total Users
            </div>
            <div
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.h1,
                fontWeight: theme.fontWeight.extrabold,
                marginTop: theme.spacing.xs,
                letterSpacing: theme.letterSpacing.tight,
                lineHeight: theme.lineHeight.tight,
              }}
            >
              1,284
            </div>
          </div>

          {/* New Today — white card */}
          <div
            style={{
              background: theme.colors.white,
              padding: theme.spacing.xl,
              borderRadius: theme.radius.lg,
              border: `1px solid ${theme.colors.grey150}`,
              boxShadow: theme.shadows.xs,
            }}
          >
            <div
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textSecondary,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
              }}
            >
              New Today
            </div>
            <div
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.h1,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                marginTop: theme.spacing.xs,
                letterSpacing: theme.letterSpacing.tight,
                lineHeight: theme.lineHeight.tight,
              }}
            >
              +12
            </div>
          </div>
        </div>

        {/* CUSTOMER CARDS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          {customers.map((c) => (
            <div
              key={c.email}
              style={{
                background: theme.colors.white,
                padding: theme.spacing.lg,
                borderRadius: theme.radius.xxl,
                border: `1px solid ${theme.colors.grey150}`,
                boxShadow: theme.shadows.xs,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md,
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: theme.spacing.md,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: theme.colors.grey100,
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={c.avatar}
                      alt={c.alt}
                      width={120}
                      height={120}
                      unoptimized
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: theme.fontFamily.display,
                        fontSize: theme.fontSize.lg,
                        fontWeight: theme.fontWeight.extrabold,
                        color: theme.colors.textPrimary,
                        letterSpacing: theme.letterSpacing.tight,
                        lineHeight: theme.lineHeight.snug,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        fontSize: theme.fontSize.xs,
                        color: theme.colors.textSecondary,
                        marginTop: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.email}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: theme.fontSize.xs,
                      color: theme.colors.textSecondary,
                      letterSpacing: theme.letterSpacing.wider,
                      textTransform: 'uppercase',
                      fontWeight: theme.fontWeight.bold,
                    }}
                  >
                    Orders
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fontFamily.display,
                      fontSize: theme.fontSize.lg,
                      fontWeight: theme.fontWeight.extrabold,
                      color: theme.colors.textPrimary,
                      letterSpacing: theme.letterSpacing.tight,
                    }}
                  >
                    {String(c.orders).padStart(2, '0')}
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                <button
                  type="button"
                  onClick={() => handleManage(c.name)}
                  className="pressable cm-manage"
                  style={{
                    flex: 1,
                    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
                    background: theme.colors.black,
                    color: theme.colors.white,
                    borderRadius: theme.radius.pill,
                    border: 'none',
                    fontFamily: theme.fontFamily.display,
                    fontSize: theme.fontSize.body,
                    fontWeight: theme.fontWeight.bold,
                    cursor: 'pointer',
                    letterSpacing: theme.letterSpacing.wider,
                    textTransform: 'uppercase',
                  }}
                >
                  Manage Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    haptic.light();
                    showToast(`View ${c.name} profile`);
                  }}
                  aria-label={`View ${c.name} profile`}
                  className="pressable cm-profile"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: theme.colors.white,
                    border: `1.5px solid ${theme.colors.grey300}`,
                    color: theme.colors.textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 20a8 8 0 0116 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* LOAD MORE */}
        <div
          style={{
            textAlign: 'center',
            paddingBottom: theme.spacing.giant,
          }}
        >
          <button
            type="button"
            onClick={handleLoadMore}
            className="pressable cm-load"
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.colors.textSecondary,
              fontSize: theme.fontSize.md,
              fontWeight: theme.fontWeight.bold,
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 4,
            }}
          >
            Load 20 more customers
          </button>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .cm-search:focus {
          outline: none;
          border-color: ${theme.colors.black};
        }
        .cm-manage:active {
          transform: scale(0.97);
        }
        .cm-manage:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .cm-profile:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .cm-load:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 4px;
        }
      `}</style>
    </MobileLayout>
  );
}
