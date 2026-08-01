'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import { useApp } from '@/components/context/AppContext';

/**
 * ContactUsPage — Pattern C rewrite.
 *
 * The previous file used undefined Tailwind utility classes
 * (`bg-surface`, `text-primary`, `text-headline-lg-mobile`,
 * `material-symbols-outlined`, etc.) and Material Symbols font
 * icons — it rendered unstyled in production. This rewrite rebuilds
 * the layout from scratch with MobileLayout + tokens + inline SVG icons.
 *
 * Semantic content preserved 1:1:
 *  - Hero boutique image + "Flagship Studio / 5th Ave, New York, NY" caption
 *  - Quick contact tiles: Email / Phone / Chat
 *  - Send-a-message form: Full Name / Email Address / Message + Send Message CTA
 *  - LNKICKS Headquarter address card (721 5th Ave, New York, NY 10022)
 *  - Mon–Sat 10 AM – 9 PM hours
 *  - "View on Map" CTA
 */
export default function ContactUsPage() {
  const { showToast } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    haptic.success();
    showToast('Message sent — our team will reach out shortly');
    setFullName('');
    setEmail('');
    setMessage('');
  };

  const quickOptions = [
    {
      label: 'Email',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" />
          <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Phone',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: 'Chat',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
    background: theme.colors.grey100,
    border: `1px solid ${theme.colors.grey200}`,
    borderRadius: theme.radius.lg,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fontFamily.body,
    color: theme.colors.textPrimary,
    outline: 'none',
  } as const;

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    letterSpacing: theme.letterSpacing.wider,
    textTransform: 'uppercase',
  } as const;

  return (
    <MobileLayout headerVariant="back" title="Contact Us">
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
        {/* HERO IMAGE */}
        <section>
          <div
            style={{
              width: '100%',
              height: 192,
              borderRadius: theme.radius.xl,
              overflow: 'hidden',
              boxShadow: theme.shadows.xs,
              background: theme.colors.grey100,
              position: 'relative',
            }}
          >
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgX3y3VxCdIBLuRkSel6rmWqkumRMqfbJ4xxvZji0k8vul9QVb-2pyXP1SrZjdHoLWfoDAhW7hCPB7emhHJVENf71kSVinCnPZl9OSwhjfm7wJGIOi4tVDFKpKbDXnmzCRR7hjzIuAsiGZFpYl3ImxkdwkQM_TXbjOrb62Qk1AK0rWwr-Wn-gfSB9OmC4YTQxlMwUo_z_A1RJTy_EFM0QrgCGgiAano932pbvG76PDyKuqkbPRXVOI8LOYjQh9E0qhA29okIV-OUp4"
              alt="Luxury high-end fashion boutique entrance on 5th Ave with bright airy lighting and minimalist signage."
              width={400}
              height={300}
              unoptimized
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.45), transparent)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: theme.spacing.lg,
                bottom: theme.spacing.lg,
                color: theme.colors.white,
              }}
            >
              <p
                style={{
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.bold,
                  margin: 0,
                  lineHeight: theme.lineHeight.snug,
                }}
              >
                Flagship Studio
              </p>
              <p
                style={{
                  fontSize: theme.fontSize.sm,
                  color: 'rgba(255,255,255,0.82)',
                  margin: `${theme.spacing.xs}px 0 0 0`,
                }}
              >
                5th Ave, New York, NY
              </p>
            </div>
          </div>
        </section>

        {/* QUICK CONTACT OPTIONS */}
        <section>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: theme.spacing.md,
            }}
          >
            {quickOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  haptic.light();
                  showToast(`${opt.label} option selected`);
                }}
                className="pressable cu-tile"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.sm,
                  padding: theme.spacing.lg,
                  background: theme.colors.white,
                  borderRadius: theme.radius.lg,
                  border: `1px solid ${theme.colors.grey150}`,
                  boxShadow: theme.shadows.xs,
                  color: theme.colors.textPrimary,
                  cursor: 'pointer',
                }}
              >
                {opt.icon}
                <span
                  style={{
                    fontSize: theme.fontSize.sm,
                    fontWeight: theme.fontWeight.bold,
                    color: theme.colors.textPrimary,
                  }}
                >
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* CONTACT FORM */}
        <section>
          <h2
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.h2,
              fontWeight: theme.fontWeight.extrabold,
              color: theme.colors.textPrimary,
              margin: `0 0 ${theme.spacing.lg}px 0`,
              letterSpacing: theme.letterSpacing.tight,
              lineHeight: theme.lineHeight.tight,
            }}
          >
            Send us a message
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg,
            }}
          >
            <div>
              <label htmlFor="cu-name" style={labelStyle}>
                Full Name
              </label>
              <input
                id="cu-name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
                className="cu-input"
              />
            </div>
            <div>
              <label htmlFor="cu-email" style={labelStyle}>
                Email Address
              </label>
              <input
                id="cu-email"
                type="email"
                placeholder="john.doe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                className="cu-input"
              />
            </div>
            <div>
              <label htmlFor="cu-message" style={labelStyle}>
                Message
              </label>
              <textarea
                id="cu-message"
                placeholder="How can we help you?"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  ...inputStyle,
                  resize: 'none',
                  minHeight: 110,
                }}
                className="cu-input"
              />
            </div>
            <button
              type="submit"
              className="pressable-strong cu-submit"
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
              Send Message
            </button>
          </form>
        </section>

        {/* PHYSICAL ADDRESS */}
        <section>
          <div
            style={{
              padding: theme.spacing.xxl,
              background: theme.colors.grey50,
              borderRadius: theme.radius.xl,
              border: `1px solid ${theme.colors.grey150}`,
            }}
          >
            <h3
              style={{
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.lg,
                fontWeight: theme.fontWeight.extrabold,
                color: theme.colors.textPrimary,
                margin: `0 0 ${theme.spacing.md}px 0`,
                letterSpacing: theme.letterSpacing.tight,
              }}
            >
              LNKICKS Headquarter
            </h3>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: theme.spacing.md,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.md,
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
                style={{ flexShrink: 0, marginTop: 2 }}
              >
                <path
                  d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p
                style={{
                  fontSize: theme.fontSize.md,
                  margin: 0,
                  lineHeight: theme.lineHeight.relaxed,
                }}
              >
                721 5th Ave, New York, NY 10022,
                <br />
                United States
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.lg,
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
                style={{ flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline
                  points="12 6 12 12 16 14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p
                style={{
                  fontSize: theme.fontSize.md,
                  margin: 0,
                  lineHeight: theme.lineHeight.relaxed,
                }}
              >
                Mon – Sat: 10:00 AM – 9:00 PM
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                haptic.light();
                showToast('Opening map view…');
              }}
              className="pressable cu-map"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
                background: 'transparent',
                border: 'none',
                color: theme.colors.textPrimary,
                fontFamily: theme.fontFamily.body,
                fontSize: theme.fontSize.lg,
                fontWeight: theme.fontWeight.bold,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              View on Map
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  d="M14 3h7v7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 14L21 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 14v7H3V3h7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .cu-tile:active {
          transform: scale(0.97);
        }
        .cu-tile:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }
        .cu-input:focus {
          border-color: ${theme.colors.black};
          box-shadow: 0 0 0 3px ${theme.colors.focusRing};
        }
        .cu-submit:active {
          transform: scale(0.97);
        }
        .cu-submit:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
        .cu-map:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 3px;
        }
      `}</style>
    </MobileLayout>
  );
}
