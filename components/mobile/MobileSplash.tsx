'use client';

import React, { useState, useEffect, useCallback } from 'react';

/**
 * MobileSplash — luxury fullscreen splash screen.
 *
 * Premium white background. Black LNKICKS wordmark. Two floating
 * sneaker PNGs with soft drop-shadow. "Get Started" black pill CTA.
 * Auto-dismisses after 4s. SKIP button in top-right.
 *
 * LN KICKS theme: pure white + black + soft grey. No blue, no gradients.
 *
 * NOTE: Uses external CDN image URLs because the local /public/*.png
 * files are Git LFS pointers (broken in this repo). See worklog
 * phase-2-enterprise-modernization for details.
 */
export default function MobileSplash({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    // Allow fade-out to play before unmount
    setTimeout(onDone, 380);
  }, [exiting, onDone]);

  // Auto-dismiss after 4s
  useEffect(() => {
    const t = setTimeout(dismiss, 4000);
    return () => clearTimeout(t);
  }, [dismiss]);

  return (
    <div
      className={`m-splash ${exiting ? 'm-splash--out' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#ffffff',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 24px 32px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top row: wordmark + skip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#0A0A0A',
          }}
        >
          LNKICKS
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Skip splash"
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#6b7280',
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.04)',
            borderRadius: 999,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Skip
        </button>
      </div>

      {/* Middle: floating sneakers + vertical wordmark */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '24px 0',
          overflow: 'hidden',
        }}
      >
        {/* Vertical LNKICKS wordmark behind */}
        <div
          aria-hidden
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: '#0A0A0A',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 0.9,
            opacity: 0.06,
            zIndex: 1,
          }}
        >
          LNKICKS
        </div>

        {/* Floating sneaker 1 — top-left, rotated */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjy1zqlV3EVBiXx6CndhW4Uod-pFa2fG-_cPEfelTsFndJz-fEx1lsu-A1XSvHM9-i6Ada7WTAVt5jhebotTMjSp98LvV2NBo4xI1FlRWch2IOk6gFOs3PGJbPJGzOW7_EeYNyF-98n-tr4UfhW_J1ws1_Ez_CcGI4KgsDAwMhNA1ad0fjXksuwyvitp84wSjZRP-J3laTKpA1Yu4vvkeGHiL-YkACNIjlZXfc810QFnt_KF1zbBHwHw"
          alt="Air Jordan 1"
          width={180}
          height={180}
          style={{
            position: 'absolute',
            top: '4%',
            left: '0%',
            width: 180,
            height: 'auto',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.18))',
            transform: 'rotate(-28deg)',
            zIndex: 3,
          }}
        />

        {/* Floating sneaker 2 — bottom-right, rotated */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB0xkKsnEs6tXbeN6ykf3LHxA6rAeJieitEfz_vZkBo-KwCLRHz0uAsDRyq4bMjuTB7EdEMrcf7GgtOFj6GmzcuianfIJ4IUmky0_mhFl2AcMZsHbsWsAjAw_3KypPeo0CzISpDUQvOmwEcg3jDb8yhVC3DtYHlbJdtQmonY13ba3kaTl2Gp3hs8bvLdLGkRNyIC3eCVdB_gTzu_pdqPTtjPVY83KAQR57Th7caAqCpqBVSRyvnysQIw"
          alt="Adidas Samba OG"
          width={190}
          height={190}
          style={{
            position: 'absolute',
            bottom: '6%',
            right: '0%',
            width: 190,
            height: 'auto',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.18))',
            transform: 'rotate(24deg)',
            zIndex: 3,
          }}
        />
      </div>

      {/* Bottom: headline + CTA */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            margin: '0 0 14px 0',
          }}
        >
          Authenticated Luxury
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 38,
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#0A0A0A',
            letterSpacing: '-0.02em',
            margin: '0 0 28px 0',
            textTransform: 'uppercase',
          }}
        >
          Start your<br />sneaker journey
        </h1>
        <button
          type="button"
          onClick={dismiss}
          style={{
            width: '100%',
            background: '#0A0A0A',
            borderRadius: 999,
            padding: '18px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            Get Started
          </span>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .m-splash {
          opacity: 1;
          transition: opacity 380ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .m-splash--out {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
