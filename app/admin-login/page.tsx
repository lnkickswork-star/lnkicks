/**
 * LNKICKS Enterprise Admin — Login Page
 * ------------------------------------------------------------
 * Premium split layout (desktop: branding panel + form card;
 * mobile: stacked form card). Wires to the new RBAC-backed
 * admin auth service (lib/admin/adminAuth.ts) which:
 *  - Validates credentials against localStorage-seeded admin users
 *  - Supports 6 roles (admin / manager / editor / support / warehouse / marketing)
 *  - Issues 8h sliding sessions
 *  - Appends every login attempt to the audit log
 *  - Has 2FA hook (TOTP stub — wired but not enforced until verified)
 *
 * Default demo credentials are pre-filled for convenience:
 *   admin@lnkicks.com / Admin@123       (super-admin — all permissions)
 *   manager@lnkicks.com / Manager@123   (operations manager)
 *   warehouse@lnkicks.com / Warehouse@123 (fulfillment only)
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { loginWithPassword, getCurrentSession } from '@/lib/admin/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { tokens } = useAdminTheme();
  const [email, setEmail] = useState('admin@lnkicks.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // If already logged in, bounce to dashboard
  useEffect(() => {
    const s = getCurrentSession();
    if (s) router.replace('/dashboard');
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Simulate latency for premium feel
    await new Promise(r => setTimeout(r, 450));
    const result = loginWithPassword(email, password);
    setLoading(false);

    if (result.ok && result.session) {
      router.push('/dashboard');
      return;
    }
    if (result.requires2FA) {
      // 2FA stub — would navigate to /admin/2fa
      setError('2FA required — please enter your authenticator code.');
      return;
    }
    setError(
      result.error === 'account_disabled'
        ? 'This account has been disabled. Contact your administrator.'
        : 'Invalid credentials. Please try again.'
    );
  }

  function fillDemo(role: 'admin' | 'manager' | 'warehouse') {
    const creds = {
      admin: { email: 'admin@lnkicks.com', password: 'Admin@123' },
      manager: { email: 'manager@lnkicks.com', password: 'Manager@123' },
      warehouse: { email: 'warehouse@lnkicks.com', password: 'Warehouse@123' },
    }[role];
    setEmail(creds.email);
    setPassword(creds.password);
    setError(null);
  }

  return (
    <div
      className="admin-login-grid"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        background: tokens.bg.app,
        color: tokens.text.primary,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        '--admin-border': tokens.border.subtle,
      } as React.CSSProperties}>
      {/* BRANDING PANEL (desktop only) */}
      <aside style={{
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px',
        background: tokens.mode === 'dark'
          ? 'linear-gradient(160deg, #0F141B 0%, #131820 50%, #0B0F14 100%)'
          : 'linear-gradient(160deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)',
        color: '#F1F5F9',
        position: 'relative',
        overflow: 'hidden',
      }} className="admin-brand-panel">
        {/* Decorative grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }} />

        {/* Top brand */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#FFFFFF', color: '#0A0A0A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 18, letterSpacing: '-0.05em',
            }}>
              L
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>LNKICKS</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.5, marginTop: 2 }}>
                Admin Suite v2.0
              </div>
            </div>
          </div>
        </div>

        {/* Center hero */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
            padding: '5px 12px', borderRadius: 100,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
            All Systems Operational
          </div>
          <h1 style={{
            margin: 0, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16,
            fontFamily: 'Inter, sans-serif',
          }}>
            Run your sneaker<br />empire from one<br />command center.
          </h1>
          <p style={{
            margin: 0, fontSize: 15, lineHeight: 1.6, opacity: 0.7,
            maxWidth: 420,
          }}>
            Catalog, orders, customers, SEO, marketing, inventory, and
            analytics — unified in a premium dashboard built for speed,
            scale, and clarity.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
            {['Real-time Analytics', 'Role-Based Access', 'Audit Logging', '2FA Ready'].map(feat => (
              <span key={feat} style={{
                fontSize: 11, fontWeight: 600,
                padding: '5px 10px', borderRadius: 6,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}>
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
        }}>
          {[
            { v: '1,420', l: 'Orders Today' },
            { v: '8,950', l: 'Active Users' },
            { v: '₹24.9L', l: 'Monthly Sales' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{s.v}</div>
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* FORM PANEL */}
      <main style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(24px, 5vw, 48px)',
        minHeight: '100vh',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 440,
        }}>
          {/* Mobile brand (hidden on desktop) */}
          <div style={{
            display: 'none',
            alignItems: 'center', gap: 10, marginBottom: 32, justifyContent: 'center',
          }} className="admin-mobile-brand">
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: tokens.text.primary, color: tokens.bg.app,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 15, letterSpacing: '-0.05em',
            }}>
              L
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', color: tokens.text.primary }}>LNKICKS</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: tokens.text.tertiary, marginTop: 1 }}>
                Admin Suite
              </div>
            </div>
          </div>

          <div style={{
            background: tokens.bg.surface,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 16,
            padding: 'clamp(24px, 4vw, 36px)',
            boxShadow: tokens.shadow.lg,
          }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                color: tokens.text.tertiary, marginBottom: 8,
              }}>
                Sign In
              </div>
              <h2 style={{
                margin: 0, fontSize: 26, fontWeight: 800,
                letterSpacing: '-0.02em', color: tokens.text.primary, lineHeight: 1.1,
              }}>
                Welcome back
              </h2>
              <p style={{
                margin: '6px 0 0 0', fontSize: 13,
                color: tokens.text.secondary, lineHeight: 1.5,
              }}>
                Authenticate to access the enterprise admin dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Email */}
              <div>
                <label htmlFor="admin-email" style={labelStyle(tokens)}>
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="you@lnkicks.com"
                  style={inputStyle(tokens)}
                  onFocus={e => { e.currentTarget.style.borderColor = tokens.border.focus; }}
                  onBlur={e => { e.currentTarget.style.borderColor = tokens.border.subtle; }}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="admin-password" style={labelStyle(tokens)}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    style={{ ...inputStyle(tokens), paddingRight: 44 }}
                    onFocus={e => { e.currentTarget.style.borderColor = tokens.border.focus; }}
                    onBlur={e => { e.currentTarget.style.borderColor = tokens.border.subtle; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                      width: 32, height: 32, borderRadius: 6,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: tokens.text.tertiary,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {showPassword ? (
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3l18 18M10.5 10.7a2 2 0 002.8 2.8M9.9 4.2A9.5 9.5 0 0112 4c5 0 9 4.5 10 8a13 13 0 01-2.2 3.4M6.1 6.1A13 13 0 002 12c1 3.5 5 8 10 8a9.5 9.5 0 004-1" />
                      </svg>
                    ) : (
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember + forgot */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12, color: tokens.text.secondary, cursor: 'pointer',
                  userSelect: 'none',
                }}>
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={e => setRememberDevice(e.target.checked)}
                    style={{
                      width: 14, height: 14, accentColor: tokens.text.primary,
                      cursor: 'pointer',
                    }}
                  />
                  Remember this device
                </label>
                <button
                  type="button"
                  onClick={() => setError('Password reset email sent (demo).')}
                  style={{
                    fontSize: 12, fontWeight: 600,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: tokens.text.accent, fontFamily: 'inherit',
                  }}
                >
                  Forgot?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px', borderRadius: 8,
                  background: tokens.status.errorBg,
                  border: `1px solid ${tokens.status.error}40`,
                  color: tokens.status.error,
                  fontSize: 12, fontWeight: 500,
                }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="admin-submit-btn"
                style={{
                  width: '100%',
                  height: 48,
                  background: tokens.text.primary,
                  color: tokens.bg.app,
                  borderRadius: 10,
                  border: 'none',
                  cursor: loading ? 'wait' : 'pointer',
                  fontSize: 13, fontWeight: 700,
                  letterSpacing: 0.3,
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'transform 120ms ease, opacity 120ms ease',
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {loading ? (
                  <>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'admin-spin 0.8s linear infinite' }}>
                      <path d="M21 12a9 9 0 11-6.2-8.5" />
                    </svg>
                    Authenticating…
                  </>
                ) : (
                  <>
                    Authenticate
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials helper */}
            <div style={{
              marginTop: 24, paddingTop: 20,
              borderTop: `1px solid ${tokens.border.subtle}`,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
                textTransform: 'uppercase', color: tokens.text.tertiary,
                marginBottom: 8, textAlign: 'center',
              }}>
                Demo Roles (click to fill)
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {([
                  { k: 'admin', label: 'Admin' },
                  { k: 'manager', label: 'Manager' },
                  { k: 'warehouse', label: 'Warehouse' },
                ] as const).map(r => (
                  <button
                    key={r.k}
                    type="button"
                    onClick={() => fillDemo(r.k)}
                    style={{
                      flex: 1, padding: '7px 4px',
                      background: tokens.bg.surfaceAlt,
                      border: `1px solid ${tokens.border.subtle}`,
                      borderRadius: 7, cursor: 'pointer',
                      fontSize: 11, fontWeight: 600,
                      color: tokens.text.secondary, fontFamily: 'inherit',
                      transition: 'all 120ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = tokens.bg.hover;
                      e.currentTarget.style.color = tokens.text.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = tokens.bg.surfaceAlt;
                      e.currentTarget.style.color = tokens.text.secondary;
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 24, textAlign: 'center',
            fontSize: 11, color: tokens.text.tertiary, lineHeight: 1.6,
          }}>
            Protected by 256-bit encryption · Session expires in 8 hours<br />
            All actions are logged in the audit trail.
          </div>
        </div>
      </main>

      <style jsx global>{`
        @media (min-width: 960px) {
          .admin-brand-panel { display: flex !important; }
          .admin-login-grid { grid-template-columns: 1fr 1fr !important; }
          .admin-mobile-brand { display: none !important; }
          body { background: ${tokens.bg.app}; }
        }
        @media (max-width: 959px) {
          .admin-mobile-brand { display: flex !important; }
        }
        @keyframes admin-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* Style helpers */
function labelStyle(tokens: ReturnType<typeof useAdminTheme>['tokens']): React.CSSProperties {
  return {
    display: 'block', marginBottom: 6,
    fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
    textTransform: 'uppercase', color: tokens.text.secondary,
    fontFamily: 'inherit',
  };
}

function inputStyle(tokens: ReturnType<typeof useAdminTheme>['tokens']): React.CSSProperties {
  return {
    width: '100%', height: 44,
    padding: '0 14px',
    borderRadius: 9,
    border: `1px solid ${tokens.border.subtle}`,
    background: tokens.bg.surfaceAlt,
    color: tokens.text.primary,
    fontSize: 14, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 120ms ease, background 120ms ease',
  };
}
