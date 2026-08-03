/**
 * LNKICKS Enterprise Admin — Settings (Apple-style System Settings)
 * ------------------------------------------------------------
 * Redesigned using Apple's System Settings philosophy:
 *  - Categorized navigation with icons
 *  - Powerful search across all settings
 *  - Each category as a focused panel
 *  - Save indicator + unsaved changes warning
 *
 * Categories:
 *  - General (store name, currency, timezone, language)
 *  - Business (GST, CIN, address, legal)
 *  - Store (brand, logo, tagline, contact)
 *  - Users (admin team members)
 *  - Payments (gateways)
 *  - Shipping (carriers, rates, zones)
 *  - Notifications (email, SMS, WhatsApp templates)
 *  - SEO (sitemap, robots.txt, meta defaults)
 *  - Security (2FA, IP whitelist, session timeout)
 *  - API Keys (tokens, webhooks secrets)
 *  - Integrations (third-party services)
 *  - Advanced (maintenance, feature flags, experiments)
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, useToast, Input, Textarea,
  Toggle, Select, Avatar, SearchInput, Skeleton,
} from '@/components/admin/ui';
import { listAdminUsers } from '@/lib/admin/adminAuth';
import type { AdminUser } from '@/lib/admin/types';

type Section = 'general' | 'business' | 'store' | 'users' | 'payments' | 'shipping' | 'notifications' | 'seo' | 'security' | 'apikeys' | 'integrations' | 'advanced';

interface SectionMeta { key: Section; label: string; icon: string; desc: string; keywords: string[] }

const SECTIONS: SectionMeta[] = [
  { key: 'general', label: 'General', icon: '⚙️', desc: 'Store name, currency, timezone, language', keywords: ['name', 'currency', 'timezone', 'language', 'date format', 'maintenance'] },
  { key: 'business', label: 'Business', icon: '🏢', desc: 'GST, CIN, legal entity', keywords: ['gst', 'cin', 'pan', 'tan', 'business', 'legal', 'tax'] },
  { key: 'store', label: 'Store', icon: '🏪', desc: 'Brand, logo, tagline, contact', keywords: ['logo', 'tagline', 'description', 'address', 'guest checkout', 'gst invoice'] },
  { key: 'users', label: 'Users', icon: '👥', desc: 'Admin team members', keywords: ['admin', 'user', 'team', 'invite', 'role', '2fa'] },
  { key: 'payments', label: 'Payments', icon: '💳', desc: 'Payment gateways', keywords: ['razorpay', 'stripe', 'paypal', 'cod', 'phonepe', 'upi', 'gateway'] },
  { key: 'shipping', label: 'Shipping', icon: '🚚', desc: 'Carriers, rates, zones', keywords: ['bluedart', 'delhivery', 'dtdc', 'ekart', 'shipping rate', 'free shipping', 'cod charge', 'courier'] },
  { key: 'notifications', label: 'Notifications', icon: '🔔', desc: 'Email, SMS, WhatsApp templates', keywords: ['email', 'sms', 'whatsapp', 'sendgrid', 'msg91', 'smtp', 'template'] },
  { key: 'seo', label: 'SEO', icon: '🔍', desc: 'Sitemap, robots.txt, meta defaults', keywords: ['sitemap', 'robots', 'meta', 'seo', 'canonical', 'index'] },
  { key: 'security', label: 'Security', icon: '🛡️', desc: '2FA, IP whitelist, sessions', keywords: ['2fa', 'totp', 'ip whitelist', 'session', 'timeout', 'password', 'https', 'login attempts'] },
  { key: 'apikeys', label: 'API Keys', icon: '🔑', desc: 'Tokens, webhook secrets', keywords: ['api', 'key', 'token', 'webhook', 'secret', 'production', 'test'] },
  { key: 'integrations', label: 'Integrations', icon: '🔌', desc: 'Third-party services', keywords: ['google analytics', 'facebook pixel', 'clarity', 'merchant center', 'shiprocket', 'whatsapp'] },
  { key: 'advanced', label: 'Advanced', icon: '⚡', desc: 'Maintenance, experiments, feature flags', keywords: ['maintenance', 'feature flag', 'experiment', 'cache', 'debug', 'migration'] },
];

/* ----------------------------- Page ----------------------------- */

export default function SettingsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [section, setSection] = useState<Section>('general');
  const [search, setSearch] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  const filteredSections = useMemo(() => {
    if (!search.trim()) return SECTIONS;
    const q = search.toLowerCase();
    return SECTIONS.filter(s => s.label.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.keywords.some(k => k.includes(q)));
  }, [search]);

  // Mark dirty on any input change
  useEffect(() => {
    function onInput() { setDirty(true); }
    document.addEventListener('input', onInput);
    return () => document.removeEventListener('input', onInput);
  }, []);

  const handleSave = useCallback(() => {
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      setDirty(false);
      pushToast({ tone: 'success', title: 'Settings saved', message: 'Your changes are now live.' });
    }, 600);
  }, [pushToast]);

  const currentSection = SECTIONS.find(s => s.key === section);

  return (
    <AdminLayout
      title="Settings"
      subtitle="Configuration & preferences"
      requirePermission="settings.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Settings' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Settings"
        subtitle="Configure your store, payments, shipping, security, and integrations. Search to jump directly to any setting."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Settings' }]}
        meta={dirty ? <Badge tokens={tokens} tone="warning" dot>Unsaved changes</Badge> : <Badge tokens={tokens} tone="success" dot>Saved</Badge>}
        actions={
          <>
            <Button tokens={tokens} variant="ghost" size="md" onClick={() => { setDirty(false); pushToast({ tone: 'info', title: 'Changes discarded' }); }}>Discard</Button>
            <Button tokens={tokens} variant="primary" size="md" loading={saveLoading} onClick={handleSave}>Save Changes</Button>
          </>
        }
      />

      <div className="set-layout">
        {/* Sidebar with search */}
        <aside className="set-sidebar">
          <div style={{ padding: '8px 8px 6px 8px' }}>
            <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search settings…" />
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 6px 6px 6px' }}>
            {filteredSections.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: tokens.text.tertiary, fontSize: 11 }}>No settings match &ldquo;{search}&rdquo;</div>
            ) : (
              filteredSections.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  className={`set-nav-item ${section === s.key ? 'active' : ''}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '8px 10px',
                    borderRadius: 8, border: 'none',
                    background: section === s.key ? tokens.bg.hover : 'transparent',
                    color: section === s.key ? tokens.text.primary : tokens.text.secondary,
                    fontSize: 12, fontWeight: section === s.key ? 700 : 500,
                    fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                    textAlign: 'left', transition: 'all 120ms ease',
                  }}
                >
                  <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{s.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</div>
                  </span>
                </button>
              ))
            )}
          </nav>
        </aside>

        {/* Content area */}
        <div className="set-content" style={{ minWidth: 0 }}>
          {currentSection && (
            <div className="set-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tokens.text.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {currentSection.icon}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: tokens.text.primary }}>{currentSection.label}</div>
                  <div style={{ fontSize: 12, color: tokens.text.secondary, marginTop: 2 }}>{currentSection.desc}</div>
                </div>
              </div>
            </div>
          )}
          {section === 'general' && <GeneralSection tokens={tokens} />}
          {section === 'business' && <BusinessSection tokens={tokens} />}
          {section === 'store' && <StoreSection tokens={tokens} />}
          {section === 'users' && <UsersSection tokens={tokens} pushToast={pushToast} />}
          {section === 'payments' && <PaymentsSection tokens={tokens} pushToast={pushToast} />}
          {section === 'shipping' && <ShippingSection tokens={tokens} />}
          {section === 'notifications' && <NotificationsSection tokens={tokens} />}
          {section === 'seo' && <SEOSection tokens={tokens} />}
          {section === 'security' && <SecuritySection tokens={tokens} />}
          {section === 'apikeys' && <ApiKeysSection tokens={tokens} pushToast={pushToast} />}
          {section === 'integrations' && <IntegrationsSection tokens={tokens} pushToast={pushToast} />}
          {section === 'advanced' && <AdvancedSection tokens={tokens} pushToast={pushToast} />}
        </div>
      </div>

      <style jsx>{`
        :global(.set-layout) {
          display: grid;
          grid-template-columns: minmax(0, 240px) minmax(0, 1fr);
          gap: 16px;
          align-items: start;
        }
        :global(.set-sidebar) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          padding: 6px;
          box-shadow: ${tokens.shadow.sm};
          position: sticky;
          top: 80px;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
        }
        :global(.set-content) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          padding: 20px;
          box-shadow: ${tokens.shadow.sm};
          min-height: 600px;
        }
        :global(.set-header) {
          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid ${tokens.border.subtle};
        }
        :global(.set-nav-item:hover) {
          background: ${tokens.bg.hover} !important;
        }
        @media (max-width: 1100px) {
          :global(.set-layout) { grid-template-columns: minmax(0, 1fr); }
          :global(.set-sidebar) { position: static; max-height: none; }
        }
      `}</style>
    </AdminLayout>
  );
}

/* ----------------------------- Sections ----------------------------- */

type Tk = ReturnType<typeof useAdminTheme>['tokens'];

function GeneralSection({ tokens }: { tokens: Tk }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input tokens={tokens} label="Marketplace Name" defaultValue="LNKICKS" hint="Displayed across the website and emails." />
      <Input tokens={tokens} label="Support Email" defaultValue="support@lnkicks.com" type="email" />
      <Input tokens={tokens} label="Support Phone" defaultValue="+91 98765 43210" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Select tokens={tokens} label="Currency" options={[{ value: 'INR', label: '₹ Indian Rupee (INR)' }, { value: 'USD', label: '$ US Dollar (USD)' }, { value: 'EUR', label: '€ Euro (EUR)' }]} defaultValue="INR" />
        <Select tokens={tokens} label="Timezone" options={[{ value: 'IST', label: 'Asia/Kolkata (IST)' }, { value: 'UTC', label: 'UTC' }, { value: 'EST', label: 'America/New_York (EST)' }]} defaultValue="IST" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Select tokens={tokens} label="Date Format" options={[{ value: 'dmy', label: 'DD/MM/YYYY' }, { value: 'mdy', label: 'MM/DD/YYYY' }, { value: 'ymd', label: 'YYYY-MM-DD' }]} />
        <Select tokens={tokens} label="Language" options={[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिन्दी (Hindi)' }, { value: 'ta', label: 'தமிழ் (Tamil)' }]} />
      </div>
      <ToggleRow tokens={tokens} label="Maintenance Mode" desc="Temporarily disable the storefront for customers" checked={false} />
      <ToggleRow tokens={tokens} label="Automatic SEO Optimization" desc="AI generates meta tags when products are added" checked={true} />
      <ToggleRow tokens={tokens} label="Auto-generate Sitemap" desc="Update sitemap.xml when products change" checked={true} />
    </div>
  );
}

function BusinessSection({ tokens }: { tokens: Tk }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: 14, borderRadius: 10, background: tokens.bg.surfaceAlt, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.6 }}>
        <strong style={{ color: tokens.text.primary }}>Legal entity information</strong> — Used for GST invoices, e-invoicing, and statutory compliance. Changes here affect all future transactions.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="Legal Entity Name" defaultValue="LNKICKS Pvt Ltd" />
        <Input tokens={tokens} label="PAN Number" defaultValue="ABCDE1234F" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="GST Number" defaultValue="29ABCDE1234F1Z5" />
        <Input tokens={tokens} label="CIN" defaultValue="U74999KA2020PTC123456" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="TAN" defaultValue="BLRL12345B" />
        <Input tokens={tokens} label="MSME Registration" placeholder="UDYAM-KA-03-0012345" />
      </div>
      <Textarea tokens={tokens} label="Registered Address" defaultValue="LNKICKS Pvt Ltd, Brigade Road, Bengaluru, Karnataka 560001, India" />
      <Select tokens={tokens} label="Default GST Rate" options={[{ value: '0', label: '0% (Exempt)' }, { value: '5', label: '5% (Essential goods)' }, { value: '12', label: '12% (Standard)' }, { value: '18', label: '18% (Most goods)' }, { value: '28', label: '28% (Luxury goods)' }]} defaultValue="18" />
      <ToggleRow tokens={tokens} label="Show GST Invoice" desc="Allow customers to download GST invoices" checked={true} />
      <ToggleRow tokens={tokens} label="E-invoicing (IRP)" desc="Auto-generate IRN for B2B invoices above ₹50,000" checked={false} />
    </div>
  );
}

function StoreSection({ tokens }: { tokens: Tk }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 600, color: tokens.text.secondary }}>Logo</label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: tokens.text.primary, color: tokens.bg.app, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900 }}>L</div>
          <div>
            <Button tokens={tokens} variant="outline" size="sm">Upload New Logo</Button>
            <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>PNG, SVG · Max 1MB · 256×256 recommended</div>
          </div>
        </div>
      </div>
      <Input tokens={tokens} label="Store Tagline" defaultValue="India's #1 Premium Sneaker Marketplace" />
      <Input tokens={tokens} label="Store Description" defaultValue="Shop authentic Air Jordan, Yeezy, Adidas & Nike sneakers with 7-day returns." />
      <Textarea tokens={tokens} label="Store Address" defaultValue="LNKICKS Pvt Ltd, Brigade Road, Bengaluru, Karnataka 560001, India" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="GST Number" defaultValue="29ABCDE1234F1Z5" />
        <Input tokens={tokens} label="CIN" defaultValue="U74999KA2020PTC123456" />
      </div>
      <ToggleRow tokens={tokens} label="Show GST Invoice" desc="Allow customers to download GST invoices" checked={true} />
      <ToggleRow tokens={tokens} label="Enable Guest Checkout" desc="Allow purchases without an account" checked={true} />
    </div>
  );
}

function UsersSection({ tokens, pushToast }: { tokens: Tk; pushToast: (t: any) => void }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setUsers(listAdminUsers()); setLoading(false); }, 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Admin Team · {users.length} members</div>
        <Button tokens={tokens} variant="primary" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Invite admin', message: 'Send invite email' })}>+ Invite Admin</Button>
      </div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ padding: 14, borderRadius: 10, background: tokens.bg.surfaceAlt }}><Skeleton tokens={tokens} w="40%" h={12} /></div>)}
        </div>
      ) : (
        users.map(u => (
          <div key={u.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt, gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
              <Avatar tokens={tokens} name={u.name} size={40} color={u.avatarColor} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{u.name}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{u.email}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                  <Badge tokens={tokens} tone="neutral" size="sm">{u.role}</Badge>
                  {u.twoFactorEnabled && <Badge tokens={tokens} tone="success" size="sm" dot>2FA</Badge>}
                  <StatusPill tokens={tokens} status={u.isActive ? 'Active' : 'Disabled'} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <Button tokens={tokens} variant="outline" size="sm">Edit Role</Button>
              <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Reset password', message: u.email })}>Reset</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function PaymentsSection({ tokens, pushToast }: { tokens: Tk; pushToast: (t: any) => void }) {
  const gateways = [
    { name: 'Razorpay', icon: '💳', status: 'connected', desc: 'Indian payment gateway — UPI, cards, netbanking, wallets' },
    { name: 'Stripe', icon: '💳', status: 'connected', desc: 'International cards, Apple Pay, Google Pay' },
    { name: 'PayPal', icon: '🅿️', status: 'disconnected', desc: 'International payments in 200+ countries' },
    { name: 'Cash on Delivery (COD)', icon: '💵', status: 'connected', desc: 'Allow customers to pay on delivery' },
    { name: 'PhonePe', icon: '📱', status: 'disconnected', desc: 'UPI payments via PhonePe' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {gateways.map(g => (
        <div key={g.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: tokens.bg.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{g.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{g.name}</div>
              <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{g.desc}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <StatusPill tokens={tokens} status={g.status === 'connected' ? 'Active' : 'Inactive'} />
            <Button tokens={tokens} variant={g.status === 'connected' ? 'outline' : 'primary'} size="sm"
              onClick={() => pushToast({ tone: g.status === 'connected' ? 'info' : 'success', title: g.status === 'connected' ? 'Configure' : 'Connecting', message: g.name })}
            >{g.status === 'connected' ? 'Configure' : 'Connect'}</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShippingSection({ tokens }: { tokens: Tk }) {
  const carriers = [
    { name: 'BlueDart', status: 'Active' },
    { name: 'Delhivery', status: 'Active' },
    { name: 'DTDC', status: 'Active' },
    { name: 'Ekart', status: 'Inactive' },
    { name: 'India Post', status: 'Inactive' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="Flat Shipping Rate (₹)" type="number" defaultValue="99" />
        <Input tokens={tokens} label="Free Shipping Threshold (₹)" type="number" defaultValue="2999" hint="Orders above this get free shipping" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="COD Charge (₹)" type="number" defaultValue="49" />
        <Input tokens={tokens} label="Estimated Delivery (days)" type="number" defaultValue="3" />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Courier Partners</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {carriers.map(c => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{c.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StatusPill tokens={tokens} status={c.status} />
                <Toggle tokens={tokens} checked={c.status === 'Active'} onChange={() => {}} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToggleRow tokens={tokens} label="Saturday Delivery" desc="Allow deliveries on Saturdays" checked={true} />
      <ToggleRow tokens={tokens} label="Sunday Delivery" desc="Allow deliveries on Sundays" checked={false} />
    </div>
  );
}

function NotificationsSection({ tokens }: { tokens: Tk }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Select tokens={tokens} label="Email Provider" options={[{ value: 'smtp', label: 'Custom SMTP' }, { value: 'sendgrid', label: 'SendGrid' }, { value: 'ses', label: 'Amazon SES' }, { value: 'mailgun', label: 'Mailgun' }, { value: 'postmark', label: 'Postmark' }]} defaultValue="sendgrid" />
      <Input tokens={tokens} label="SMTP Host" defaultValue="smtp.sendgrid.net" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="Port" type="number" defaultValue="587" />
        <Select tokens={tokens} label="Encryption" options={[{ value: 'tls', label: 'TLS' }, { value: 'ssl', label: 'SSL' }, { value: 'none', label: 'None' }]} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="From Name" defaultValue="LNKICKS" />
        <Input tokens={tokens} label="From Email" defaultValue="noreply@lnkicks.com" />
      </div>
      <Select tokens={tokens} label="SMS Provider" options={[{ value: 'twilio', label: 'Twilio' }, { value: 'msg91', label: 'MSG91' }, { value: 'textlocal', label: 'TextLocal' }, { value: 'gupshup', label: 'Gupshup' }]} defaultValue="msg91" />
      <Input tokens={tokens} label="SMS Sender ID" defaultValue="LNKICKS" hint="6-character alphanumeric sender ID" />
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Notification Templates</div>
        {['Order Confirmation', 'Order Shipped', 'Out for Delivery', 'Order Delivered', 'OTP Verification', 'Welcome Email'].map(t => (
          <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: 6, background: tokens.bg.surfaceAlt, marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: tokens.text.primary }}>{t}</span>
            <Button tokens={tokens} variant="ghost" size="sm">Edit</Button>
          </div>
        ))}
      </div>
      <ToggleRow tokens={tokens} label="WhatsApp Business" desc="Send order updates via WhatsApp" checked={false} />
    </div>
  );
}

function SEOSection({ tokens }: { tokens: Tk }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input tokens={tokens} label="Default Meta Title" defaultValue="LNKICKS — Premium Sneaker Marketplace" hint="60 characters max" />
      <Textarea tokens={tokens} label="Default Meta Description" defaultValue="Shop authentic Air Jordan, Yeezy, Adidas & Nike sneakers. 7-day returns, free shipping above ₹2,999." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="Canonical URL" defaultValue="https://www.lnkicks.com" />
        <Input tokens={tokens} label="OG Image URL" defaultValue="/og-image.png" />
      </div>
      <Textarea tokens={tokens} label="robots.txt" defaultValue={'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: https://www.lnkicks.com/sitemap.xml'} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }} />
      <ToggleRow tokens={tokens} label="Auto-generate Sitemap" desc="Update sitemap.xml when products change" checked={true} />
      <ToggleRow tokens={tokens} label="Schema.org Markup" desc="Add structured data to product pages" checked={true} />
      <ToggleRow tokens={tokens} label="Breadcrumb Navigation" desc="Show breadcrumbs on product pages" checked={true} />
    </div>
  );
}

function SecuritySection({ tokens }: { tokens: Tk }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: 14, borderRadius: 10, background: `${tokens.status.warning}15`, border: `1px solid ${tokens.status.warning}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.6 }}>
        <strong style={{ color: tokens.status.warning }}>⚠ Security Review:</strong> 2 of 5 admin accounts do not have 2FA enabled. Force 2FA for all admins to improve your security score.
      </div>
      <ToggleRow tokens={tokens} label="Force HTTPS" desc="Redirect all HTTP to HTTPS" checked={true} />
      <ToggleRow tokens={tokens} label="Two-Factor Authentication" desc="Require TOTP code on login for all admins" checked={false} />
      <ToggleRow tokens={tokens} label="IP Whitelist" desc="Only allow admin login from specified IPs" checked={false} />
      <Input tokens={tokens} label="Allowed IPs (comma separated)" placeholder="192.168.1.1, 10.0.0.1" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="Session Timeout (hours)" type="number" defaultValue="8" />
        <Input tokens={tokens} label="Max Login Attempts" type="number" defaultValue="5" />
      </div>
      <ToggleRow tokens={tokens} label="Activity Logging" desc="Log all admin actions to audit trail" checked={true} />
      <ToggleRow tokens={tokens} label="Failed Login Alerts" desc="Email admins on repeated failed logins" checked={true} />
      <ToggleRow tokens={tokens} label="Password Rotation" desc="Force password change every 90 days" checked={false} />
    </div>
  );
}

function ApiKeysSection({ tokens, pushToast }: { tokens: Tk; pushToast: (t: any) => void }) {
  const keys = [
    { name: 'Production API Key', key: 'lnk_live_sk_9876543210abcdef', created: '2026-01-15', lastUsed: '2 hours ago' },
    { name: 'Test API Key', key: 'lnk_test_sk_1234567890abcdef', created: '2026-01-15', lastUsed: '5 days ago' },
    { name: 'Webhook Secret', key: 'whsec_••••••••••••••••', created: '2026-02-01', lastUsed: '1 hour ago' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>API Keys · {keys.length} active</div>
        <Button tokens={tokens} variant="primary" size="sm" onClick={() => pushToast({ tone: 'success', title: 'API key created', message: 'New key generated · copy now (shown only once)' })}>+ Generate New Key</Button>
      </div>
      {keys.map(k => (
        <div key={k.name} style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{k.name}</span>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Copied to clipboard', message: k.name })}>Copy</Button>
          </div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: tokens.text.secondary, background: tokens.bg.surface, padding: '6px 8px', borderRadius: 6, wordBreak: 'break-all' }}>{k.key}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10, color: tokens.text.tertiary }}>
            <span>Created: {k.created}</span>
            <span>Last used: {k.lastUsed}</span>
          </div>
        </div>
      ))}
      <div style={{ padding: 14, borderRadius: 10, background: `${tokens.status.error}10`, border: `1px solid ${tokens.status.error}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.6 }}>
        <strong style={{ color: tokens.status.error }}>🔒 Security tip:</strong> Never commit API keys to version control. Rotate keys every 90 days. Revoke immediately if leaked.
      </div>
    </div>
  );
}

function IntegrationsSection({ tokens, pushToast }: { tokens: Tk; pushToast: (t: any) => void }) {
  const integrations = [
    { name: 'Google Analytics 4', icon: '📊', status: 'connected', desc: 'Web analytics & user behavior' },
    { name: 'Google Search Console', icon: '🔍', status: 'connected', desc: 'Search performance & indexing' },
    { name: 'Facebook Pixel', icon: '👍', status: 'connected', desc: 'Meta ad attribution' },
    { name: 'Microsoft Clarity', icon: '🎯', status: 'connected', desc: 'Session recordings & heatmaps' },
    { name: 'Google Merchant Center', icon: '🛍️', status: 'disconnected', desc: 'Product feed for Shopping ads' },
    { name: 'WhatsApp Business API', icon: '💬', status: 'disconnected', desc: 'Order updates via WhatsApp' },
    { name: 'Razorpay X (Payouts)', icon: '💸', status: 'disconnected', desc: 'Automated vendor payouts' },
    { name: 'Shiprocket', icon: '📦', status: 'connected', desc: 'Multi-carrier shipping aggregation' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
      {integrations.map(int => (
        <div key={int.name} style={{ padding: 14, borderRadius: 10, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: tokens.bg.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{int.icon}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{int.name}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{int.desc}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <StatusPill tokens={tokens} status={int.status === 'connected' ? 'Active' : 'Inactive'} />
            <Button tokens={tokens} variant={int.status === 'connected' ? 'outline' : 'primary'} size="sm"
              onClick={() => pushToast({ tone: int.status === 'connected' ? 'info' : 'success', title: int.status === 'connected' ? 'Configure' : 'Connecting', message: int.name })}
            >{int.status === 'connected' ? 'Configure' : 'Connect'}</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdvancedSection({ tokens, pushToast }: { tokens: Tk; pushToast: (t: any) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: 14, borderRadius: 10, background: `${tokens.status.error}10`, border: `1px solid ${tokens.status.error}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.6 }}>
        <strong style={{ color: tokens.status.error }}>⚠ Advanced settings:</strong> These settings can disrupt the storefront. Only modify if you understand the implications.
      </div>
      <ToggleRow tokens={tokens} label="Maintenance Mode" desc="Disable storefront for customers" checked={false} />
      <ToggleRow tokens={tokens} label="Debug Mode" desc="Show detailed error messages" checked={false} />
      <ToggleRow tokens={tokens} label="Cache API Responses" desc="Cache product/catalog API for 5 minutes" checked={true} />
      <ToggleRow tokens={tokens} label="A/B Testing" desc="Enable experiment framework" checked={false} />
      <ToggleRow tokens={tokens} label="Feature Flag: New Checkout" desc="Use new checkout v2 flow" checked={false} />
      <ToggleRow tokens={tokens} label="Feature Flag: AI Recommendations" desc="Show AI-powered product recommendations" checked={true} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Cache cleared', message: 'CDN + Redis cache flushed' })}>Clear Cache</Button>
        <Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Reindex', message: 'Search index rebuild queued' })}>Reindex Search</Button>
        <Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'warning', title: 'Are you sure?', message: 'This action is irreversible' })}>Reset Settings</Button>
      </div>
    </div>
  );
}

function ToggleRow({ tokens, label, desc, checked }: { tokens: Tk; label: string; desc: string; checked: boolean }) {
  const [enabled, setEnabled] = useState(checked);
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, cursor: 'pointer' }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{label}</div>
        <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{desc}</div>
      </div>
      <Toggle tokens={tokens} checked={enabled} onChange={setEnabled} />
    </label>
  );
}
