'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { useApp } from '@/components/context/AppContext';

/**
 * SizeGuidePage — Pattern C rewrite.
 *
 * The previous file used undefined Tailwind utility classes
 * (`bg-surface`, `text-primary`, `text-headline-lg-mobile`,
 * `material-symbols-outlined`, etc.) and Material Symbols font icons — it
 * rendered unstyled in production. This rewrite rebuilds the layout from
 * scratch with MobileLayout + tokens + inline SVG icons.
 *
 * Semantic content preserved 1:1:
 *  - Men / Women / Kids segmented tabs (Men active by default; Women/Kids
 *    show a "concierge" placeholder — original page only rendered the
 *    Men's chart and left Women/Kids tabs non-functional).
 *  - Conversion Chart table: US / UK / EU / CM with the original 5 rows
 *    (US 8 → 10, with the US 9 row highlighted as the "default fit").
 *  - "Recommended: Size up if between sizes." italic caption.
 *  - 3-step "How to measure" with the original Google-hosted images.
 *  - "Find My Perfect Fit" CTA + "Still unsure? Our fit specialists are
 *    available 24/7." caption.
 */
type TabKey = 'Men' | 'Women' | 'Kids';

const SIZE_ROWS: { us: string; uk: string; eu: string; cm: string; highlight?: boolean }[] = [
  { us: '8', uk: '7', eu: '41', cm: '26' },
  { us: '8.5', uk: '7.5', eu: '42', cm: '26.5' },
  { us: '9', uk: '8', eu: '42.5', cm: '27', highlight: true },
  { us: '9.5', uk: '8.5', eu: '43', cm: '27.5' },
  { us: '10', uk: '9', eu: '44', cm: '28' },
];

const STEPS: { img: string; alt: string; title: string; body: string }[] = [
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjJxkNFgDxyyt4V15vk3og0qhojL8pcPlzNvRvGFzQamaGDrobSE6rmL6YBUvN05bdPyEK6M3rqcdRuCnxYcpY4Qh60Mx5HXWJ7GsqfkgZ4G9BVl7A1rZkWRXLqviO4uUkg9rryKsLYkkjxUd9qOzSTswkQvb3bhuBcxu-P8jXwp4rXNi1u9O-6vGECu5J_WfqE-CV1xN6vyx1IXc6umKez6cVlc4IX7l-VAMPJN4x2vWSplhRYnZ45B0XDe8KYyRADEEeWfhPiltW',
    alt: 'Minimalist line illustration of a human foot placed flat against a wall on paper, demonstrating the proper heel-to-wall positioning for measuring foot length.',
    title: '1. Heel to Wall',
    body: 'Place your heel against a wall on a flat piece of paper.',
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsR9dm-8ViwYSv3vYNwv3VCh5jqkPs1iw06coG8hM81Yde-0CalTUVkvdRSt237gHOcR95kjQ1SaXdWvVNcE4txhf_FsKzwag7EHXNx6Cc9tpO67GD6AqcY5VtHEEcu9JAVApQpft_i0rPPuGRE3uuqDBcFwckF2tK79lOHzuwYTfCSsrv5a1wZv55q4fb2IHemiSAgcfXo15iWqKm5cdQm0Aglan19RYykYcrqua0zm38w2_Ts6b7QtmdCVAYGygv349Gwni6V4jf',
    alt: 'Minimalist line drawing focusing on a pencil marking the tip of the longest toe on a piece of paper with sharp black strokes on a neutral surface.',
    title: '2. Mark the Length',
    body: 'Mark the longest part of your foot on the paper.',
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUWon-VFZFyd8lZsgi1xVJaoTVLEkQ33uLeFhmWbkrwMa3AqsyRqgAoB8xoGzLHPNarMxpGRSbc0UAu8DT-_lFKJEg9bXpCsvsJN50_GYiE4Zmm2Z57GT7UIL0xZx-dTFOgZK6nQ1ZyYNevXagMifE4eO98vHG7DHSfZ4jzqjhWKz6RckSoGMroKj3DHILRKv_QCPxjxYd8N5tKJy7hkGEQhxMz2hb_Uh5MPNUUcaS9YQaEPLjkqu60z0eSKKakAtuw5EnltF8vlmh',
    alt: 'Simple line illustration of a ruler measuring the distance between two marked points on paper, in a high-contrast minimalist aesthetic.',
    title: '3. Measure',
    body: 'Measure the distance from the wall to your mark in centimeters.',
  },
];

const TABS: TabKey[] = ['Men', 'Women', 'Kids'];

export default function SizeGuidePage() {
  const { showToast } = useApp();
  const [tab, setTab] = useState<TabKey>('Men');

  return (
    <MobileLayout headerVariant="back" title="Size Guide"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Size Guide' },
      ]}
      desktopMaxWidth={1024}
    >
      <div
        style={{
          padding: `0 ${theme.spacing.pad}px`,
          paddingTop: theme.spacing.lg,
          paddingBottom: theme.spacing.xxl,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xxl,
        }}
      >
        {/* CATEGORY TABS */}
        <div
          style={{
            background: theme.colors.grey100,
            borderRadius: theme.radius.pill,
            padding: theme.spacing.xs,
            display: 'flex',
          }}
        >
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  haptic.selection();
                  setTab(t);
                }}
                aria-pressed={active}
                className="pressable sg-tab"
                style={{
                  flex: 1,
                  padding: `${theme.spacing.md}px ${theme.spacing.sm}px`,
                  textAlign: 'center',
                  borderRadius: theme.radius.pill,
                  background: active ? theme.colors.black : 'transparent',
                  color: active ? theme.colors.white : theme.colors.textSecondary,
                  border: 'none',
                  fontFamily: theme.fontFamily.body,
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.bold,
                  cursor: 'pointer',
                  transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* CONVERSION TABLE */}
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: theme.spacing.md,
            }}
          >
            <h2
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.h2,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                margin: 0,
                letterSpacing: theme.letterSpacing.tight,
                lineHeight: theme.lineHeight.tight,
              }}
            >
              Conversion Chart
            </h2>
            <span
              style={{
                fontSize: theme.fontSize.sm,
                color: theme.colors.textSecondary,
                fontWeight: theme.fontWeight.medium,
              }}
            >
              Standard Fit
            </span>
          </div>

          {tab === 'Men' ? (
            <div
              style={{
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.colors.grey150}`,
                background: theme.colors.white,
                boxShadow: theme.shadows.xs,
                overflow: 'hidden',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: theme.colors.grey50,
                      borderBottom: `1px solid ${theme.colors.grey150}`,
                    }}
                  >
                    {['US', 'UK', 'EU', 'CM'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
                          fontSize: theme.fontSize.lg,
                          fontWeight: theme.fontWeight.bold,
                          color: theme.colors.textPrimary,
                          letterSpacing: theme.letterSpacing.wider,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SIZE_ROWS.map((row) => (
                    <tr
                      key={row.us}
                      style={{
                        background: row.highlight
                          ? theme.colors.black
                          : theme.colors.white,
                        color: row.highlight
                          ? theme.colors.white
                          : theme.colors.textPrimary,
                        borderBottom: `1px solid ${theme.colors.grey150}`,
                      }}
                    >
                      <td
                        style={{
                          padding: `${theme.spacing.md}px`,
                          fontSize: theme.fontSize.md,
                          fontWeight: row.highlight
                            ? theme.fontWeight.bold
                            : theme.fontWeight.bold,
                          color: row.highlight
                            ? theme.colors.white
                            : theme.colors.textPrimary,
                        }}
                      >
                        {row.us}
                      </td>
                      <td
                        style={{
                          padding: `${theme.spacing.md}px`,
                          fontSize: theme.fontSize.md,
                          color: row.highlight
                            ? 'rgba(255,255,255,0.82)'
                            : theme.colors.textSecondary,
                        }}
                      >
                        {row.uk}
                      </td>
                      <td
                        style={{
                          padding: `${theme.spacing.md}px`,
                          fontSize: theme.fontSize.md,
                          color: row.highlight
                            ? 'rgba(255,255,255,0.82)'
                            : theme.colors.textSecondary,
                        }}
                      >
                        {row.eu}
                      </td>
                      <td
                        style={{
                          padding: `${theme.spacing.md}px`,
                          fontSize: theme.fontSize.md,
                          color: row.highlight
                            ? 'rgba(255,255,255,0.82)'
                            : theme.colors.textSecondary,
                        }}
                      >
                        {row.cm}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.colors.grey150}`,
                background: theme.colors.white,
                padding: theme.spacing.xxl,
                textAlign: 'center',
                color: theme.colors.textSecondary,
                fontSize: theme.fontSize.md,
                lineHeight: theme.lineHeight.relaxed,
                boxShadow: theme.shadows.xs,
              }}
            >
              {tab}’s size chart is being curated. Please reach out to our fit
              concierge for personalized sizing assistance.
            </div>
          )}

          <p
            style={{
              marginTop: theme.spacing.sm,
              fontSize: theme.fontSize.sm,
              color: theme.colors.textSecondary,
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            Recommended: Size up if between sizes.
          </p>
        </section>

        {/* HOW TO MEASURE */}
        <section>
          <h2
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h2,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.md,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            How to measure
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg,
            }}
          >
            {STEPS.map((s) => (
              <div
                key={s.title}
                style={{
                  display: 'flex',
                  gap: theme.spacing.md,
                  alignItems: 'center',
                  background: theme.colors.white,
                  padding: theme.spacing.md,
                  borderRadius: theme.radius.lg,
                  border: `1px solid ${theme.colors.grey150}`,
                  boxShadow: theme.shadows.xs,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: theme.colors.grey100,
                    borderRadius: theme.radius.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={s.img}
                    alt={s.alt}
                    width={400}
                    height={300}
                    unoptimized
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: theme.fontSize.lg,
                      fontWeight: theme.fontWeight.bold,
                      color: theme.colors.textPrimary,
                      margin: `0 0 ${theme.spacing.xs}px 0`,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: theme.fontSize.md,
                      color: theme.colors.textSecondary,
                      margin: 0,
                      lineHeight: theme.lineHeight.relaxed,
                    }}
                  >
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <button
            type="button"
            onClick={() => {
              haptic.success();
              showToast('Fit analysis complete — your size is highlighted');
            }}
            className="pressable-strong sg-cta"
            style={{
              width: '100%',
              padding: `${theme.spacing.lg + 2}px ${theme.spacing.md}px`,
              background: theme.colors.black,
              color: theme.colors.white,
              borderRadius: theme.radius.pill,
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.bold,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: theme.letterSpacing.wider,
              textTransform: 'uppercase',
              boxShadow: theme.shadows.md,
            }}
          >
            Find My Perfect Fit
          </button>
          <p
            style={{
              marginTop: theme.spacing.md,
              textAlign: 'center',
              fontSize: theme.fontSize.md,
              color: theme.colors.textSecondary,
              lineHeight: theme.lineHeight.relaxed,
            }}
          >
            Still unsure? Our fit specialists are available 24/7.
          </p>
        </section>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .sg-tab:active {
          transform: scale(0.97);
        }
        .sg-tab:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .sg-cta:active {
          transform: scale(0.97);
        }
        .sg-cta:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
