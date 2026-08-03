'use client';

import React from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';

/**
 * ErrorBoundary — global error fallback.
 *
 * Mounted automatically by Next.js when a route throws during render.
 * Uses MobileLayout so the user sees the same header/footer/nav as
 * every other page (and the recovery CTA is one tap away).
 *
 * Design tokens match the homepage: black on white, Inter font,
 * 999px pill CTA, 16px card radius, cubic-bezier(0.16,1,0.3,1) easing.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <MobileLayout
      headerVariant="default"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Error' },
      ]}
      desktopMaxWidth={640}
      desktopPaddingTop={64}
      desktopPaddingBottom={96}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '64px 24px',
          maxWidth: 560,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Error glyph */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#fafafa',
            border: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0a0a0a',
            marginBottom: 8,
          }}
          aria-hidden
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#9ca3af',
          }}
        >
          Something went wrong
        </div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#0a0a0a',
            margin: '0 0 8px 0',
            lineHeight: 1.1,
          }}
        >
          We hit a snag
        </h1>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: '#6b7280',
            margin: '0 0 24px 0',
            maxWidth: 420,
          }}
        >
          {error.message ||
            'An unexpected error occurred while loading this page. Please try again — if the problem persists, our concierge team is here to help.'}
        </p>

        {/* CTA row */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => reset()}
            style={{
              padding: '16px 28px',
              background: '#0a0a0a',
              color: '#ffffff',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 200ms ease, transform 200ms ease',
              fontFamily: 'inherit',
            }}
            className="lnk-err-cta"
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: '16px 28px',
              background: '#ffffff',
              color: '#0a0a0a',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'border-color 200ms ease',
            }}
            className="lnk-err-secondary"
          >
            Return Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .lnk-err-cta:hover {
          background: #1f2937 !important;
          transform: translateY(-1px);
        }
        .lnk-err-cta:active {
          transform: scale(0.98);
        }
        .lnk-err-secondary:hover {
          border-color: #0a0a0a !important;
        }
      `}</style>
    </MobileLayout>
  );
}
