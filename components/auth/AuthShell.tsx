/**
 * AuthShell.tsx — Shared responsive layout wrapper for all LNKICKS auth pages.
 *
 * Phase 31 Rev 2 — Fully Responsive
 *
 * Layout adapts across 320px → 1920px:
 *
 *  Mobile (≤768px, inside MobileLayout):
 *    - Single centered card, width: min(100%, 440px)
 *    - 16px horizontal padding
 *    - box-sizing: border-box on ALL elements (prevents overflow)
 *    - Branding panel hidden
 *
 *  Tablet / small desktop (769px–1023px, bare children):
 *    - Full-page white background
 *    - Card centered both axes, max-width 480px
 *    - More breathing room (padding: 40px)
 *    - Branding panel still hidden
 *
 *  Desktop (≥1024px, bare children):
 *    - Two-column split layout, max-width 1200px
 *    - LEFT: Dark branding panel with LNKICKS wordmark, welcome headline,
 *            benefits list, sneaker lifestyle image (decorative)
 *    - RIGHT: White form panel, card vertically centered
 *    - Premium feel — no "mobile card on desktop" look
 *
 * Typography uses clamp() for smooth scaling:
 *  - Wordmark:   clamp(24px, 5vw, 36px)
 *  - Headline:   clamp(20px, 4vw, 26px)
 *  - Subtext:    clamp(13px, 2.5vw, 15px)
 *  - Card pad:   clamp(20px, 4vw, 36px)
 *
 * All elements use box-sizing: border-box — the card with width:100% +
 * padding + border will never overflow its parent.
 */

'use client';

import React from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

export interface AuthShellProps {
  layoutTitle: string;
  eyebrow?: string;
  headline: string;
  subtext?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({
  layoutTitle,
  eyebrow,
  headline,
  subtext,
  children,
  footer,
}: AuthShellProps) {
  return (
    <MobileLayout headerVariant="minimal" hideBottomNav title={layoutTitle}>
      <div className="auth-page">
        <div className="auth-container">
          {/* ── DESKTOP BRANDING PANEL (hidden on mobile/tablet) ── */}
          <aside className="auth-branding" aria-hidden="true">
            <div className="auth-branding-inner">
              <div className="auth-branding-logo">LNKICKS</div>

              <h2 className="auth-branding-headline">
                Step Into<br />
                Premium Style.
              </h2>

              <p className="auth-branding-subtext">
                Join 50,000+ collectors getting first access to limited drops,
                exclusive colorways, and member-only pricing on the world&apos;s
                most coveted sneakers.
              </p>

              <ul className="auth-branding-benefits">
                <li>
                  <CheckIcon />
                  100% Authenticity Guaranteed
                </li>
                <li>
                  <CheckIcon />
                  Free Shipping Over ₹2,000
                </li>
                <li>
                  <CheckIcon />
                  7-Day Easy Returns
                </li>
                <li>
                  <CheckIcon />
                  ₹50 Welcome Bonus on Signup
                </li>
              </ul>
            </div>

            {/* Decorative sneaker image */}
            <div className="auth-branding-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/jordan_powder_blue_nobg.png"
                alt=""
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </aside>

          {/* ── FORM PANEL ── */}
          <main className="auth-form-panel">
            <div className="auth-card">
              {/* BRAND HEAD */}
              <div className="auth-card-header">
                <div className="auth-wordmark">LNKICKS</div>
                {eyebrow && <div className="auth-eyebrow">{eyebrow}</div>}
              </div>

              {/* HEADLINE */}
              <h1 className="auth-headline">{headline}</h1>

              {subtext && <p className="auth-subtext">{subtext}</p>}

              {/* BODY */}
              <div className="auth-body">{children}</div>

              {/* FOOTER */}
              {footer && <div className="auth-footer">{footer}</div>}
            </div>
          </main>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        /* ── BASE (mobile-first, ≤768px inside MobileLayout) ─────────── */
        .auth-page {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          padding: 0;
        }

        .auth-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        /* Branding panel — hidden on mobile/tablet */
        .auth-branding {
          display: none;
        }

        /* Form panel */
        .auth-form-panel {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(16px, 4vw, 24px);
        }

        /* Card */
        .auth-card {
          width: min(100%, 440px);
          box-sizing: border-box;
          background: ${theme.colors.white};
          border-radius: clamp(20px, 4vw, 28px);
          padding: clamp(20px, 4vw, 32px);
          border: 1px solid ${theme.colors.grey150};
          box-shadow: ${theme.shadows.premium};
          animation: auth-card-in 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .auth-card-header {
          text-align: center;
          margin-bottom: clamp(20px, 3vw, 28px);
        }

        .auth-wordmark {
          font-family: ${theme.fontFamily.display};
          font-size: clamp(24px, 5vw, 30px);
          font-weight: ${theme.fontWeight.bold};
          color: ${theme.colors.textPrimary};
          line-height: 1;
          letter-spacing: ${theme.letterSpacing.widest};
        }

        .auth-eyebrow {
          font-size: 10px;
          font-weight: ${theme.fontWeight.bold};
          letter-spacing: ${theme.letterSpacing.widest};
          text-transform: uppercase;
          color: ${theme.colors.textSecondary};
          margin-top: 4px;
        }

        .auth-headline {
          font-family: ${theme.fontFamily.display};
          font-size: clamp(20px, 4.5vw, 26px);
          font-weight: ${theme.fontWeight.bold};
          color: ${theme.colors.textPrimary};
          text-align: center;
          margin: 0 0 8px;
          letter-spacing: ${theme.letterSpacing.tight};
          line-height: ${theme.lineHeight.tight};
        }

        .auth-subtext {
          font-size: clamp(13px, 2.5vw, 14px);
          color: ${theme.colors.textSecondary};
          text-align: center;
          margin: 0 0 clamp(20px, 3vw, 28px);
          font-family: ${theme.fontFamily.body};
          line-height: ${theme.lineHeight.body};
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }

        .auth-footer {
          margin-top: clamp(20px, 3vw, 28px);
          padding-top: clamp(16px, 2vw, 20px);
          border-top: 1px solid ${theme.colors.grey200};
          text-align: center;
          font-size: 13px;
          color: ${theme.colors.textSecondary};
          font-family: ${theme.fontFamily.body};
        }

        /* ── TABLET / SMALL DESKTOP (769px–1023px) ────────────────────── */
        @media (min-width: 769px) {
          .auth-page {
            min-height: 100vh;
            align-items: center;
            background: ${theme.colors.white};
          }

          .auth-form-panel {
            padding: clamp(32px, 5vw, 48px);
          }

          .auth-card {
            max-width: 480px;
          }
        }

        /* ── DESKTOP (≥1024px) — two-column split ─────────────────────── */
        @media (min-width: 1024px) {
          .auth-container {
            max-width: 1200px;
            flex-direction: row;
            align-items: stretch;
            min-height: 100vh;
            margin: 0 auto;
          }

          .auth-branding {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            background: linear-gradient(135deg, #0A0A0A 0%, #1F2937 50%, #111827 100%);
            color: ${theme.colors.white};
            padding: clamp(40px, 5vw, 80px);
            position: relative;
            overflow: hidden;
          }

          .auth-branding-inner {
            max-width: 440px;
            position: relative;
            z-index: 2;
          }

          .auth-branding-logo {
            font-family: ${theme.fontFamily.display};
            font-size: clamp(28px, 3vw, 36px);
            font-weight: ${theme.fontWeight.bold};
            letter-spacing: ${theme.letterSpacing.widest};
            color: ${theme.colors.white};
            margin-bottom: clamp(28px, 4vw, 48px);
            line-height: 1;
          }

          .auth-branding-headline {
            font-family: ${theme.fontFamily.display};
            font-size: clamp(28px, 3.5vw, 42px);
            font-weight: ${theme.fontWeight.bold};
            line-height: 1.15;
            letter-spacing: ${theme.letterSpacing.tight};
            margin: 0 0 20px;
            color: ${theme.colors.white};
          }

          .auth-branding-subtext {
            font-size: clamp(14px, 1.3vw, 16px);
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.7);
            margin: 0 0 36px;
            font-family: ${theme.fontFamily.body};
          }

          .auth-branding-benefits {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .auth-branding-benefits li {
            font-size: clamp(13px, 1.1vw, 15px);
            color: rgba(255, 255, 255, 0.85);
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: ${theme.fontFamily.body};
            font-weight: ${theme.fontWeight.medium};
          }

          .auth-branding-image {
            position: absolute;
            bottom: -60px;
            right: -80px;
            width: 55%;
            max-width: 420px;
            opacity: 0.85;
            pointer-events: none;
            z-index: 1;
            transform: rotate(-15deg);
          }

          .auth-branding-image img {
            width: 100%;
            height: auto;
            max-width: 100%;
            display: block;
            filter: drop-shadow(0 24px 48px rgba(0, 0, 0, 0.4));
          }

          .auth-form-panel {
            flex: 1;
            padding: clamp(40px, 5vw, 80px);
          }
        }

        /* ── LARGE DESKTOP (≥1440px) — more generous spacing ──────────── */
        @media (min-width: 1440px) {
          .auth-form-panel {
            padding: 80px;
          }

          .auth-branding {
            padding: 80px;
          }
        }

        /* ── ANIMATION ────────────────────────────────────────────────── */
        @keyframes auth-card-in {
          0% {
            transform: translateY(8px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </MobileLayout>
  );
}

/* ── Check icon for benefit list ── */
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, color: 'rgba(255,255,255,0.9)' }}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default AuthShell;
