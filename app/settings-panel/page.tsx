/**
 * LNKICKS Enterprise Admin — Settings
 * ------------------------------------------------------------
 * Comprehensive settings panel with sections:
 *  - General (store name, currency, timezone)
 *  - Store (brand, logo, contact)
 *  - Payments (Stripe, Razorpay, PayPal, COD)
 *  - Shipping (carriers, flat rate, free shipping threshold)
 *  - Tax (GST, state-wise)
 *  - Authentication (login methods, 2FA enforcement)
 *  - Email (SMTP, transactional)
 *  - SMS (provider, templates)
 *  - Google & Microsoft integrations
 *  - Integrations (third-party)
 *  - API Keys
 *  - Security (IP restrictions, session timeout)
 *  - Roles & Permissions
 *  - Backup & Restore
 *  - Logs
 */

'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, Panel, useToast, Input, Textarea,
  Toggle, Select, Avatar,
} from '@/components/admin/ui';
import { listAdminUsers } from '@/lib/admin/adminAuth';

type Section = 'general' | 'store' | 'payments' | 'shipping' | 'tax' | 'auth' | 'email' | 'sms' | 'integrations' | 'apikeys' | 'security' | 'roles' | 'backup' | 'logs';

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: 'general', label: 'General', icon: '⚙️' },
  { key: 'store', label: 'Store', icon: '🏪' },
  { key: 'payments', label: 'Payments', icon: '💳' },
  { key: 'shipping', label: 'Shipping', icon: '🚚' },
  { key: 'tax', label: 'Tax', icon: '🧾' },
  { key: 'auth', label: 'Authentication', icon: '🔐' },
  { key: 'email', label: 'Email', icon: '✉️' },
  { key: 'sms', label: 'SMS', icon: '💬' },
  { key: 'integrations', label: 'Integrations', icon: '🔌' },
  { key: 'apikeys', label: 'API Keys', icon: '🔑' },
  { key: 'security', label: 'Security', icon: '🛡️' },
  { key: 'roles', label: 'Roles', icon: '👥' },
  { key: 'backup', label: 'Backup', icon: '💾' },
  { key: 'logs', label: 'Logs', icon: '📋' },
];

export default function SettingsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [section, setSection] = useState<Section>('general');
  const [saveLoading, setSaveLoading] = useState(false);

  function handleSave() {
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      pushToast({ tone: 'success', title: 'Settings saved', message: 'Your changes are now live.' });
    }, 600);
  }

  return (
    <AdminLayout
      title="Settings"
      subtitle="Configuration & preferences"
      requirePermission="settings.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'System' }, { label: 'Settings' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Settings"
        subtitle="Configure your store, payments, shipping, security, and integrations."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'System' }, { label: 'Settings' }]}
        actions={
          <Button tokens={tokens} variant="primary" size="md" loading={saveLoading} onClick={handleSave}>
            Save Changes
          </Button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)', gap: 16 }}>
        {/* Section nav */}
        <aside style={{
          background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
          borderRadius: 12, padding: 6, height: 'fit-content', position: 'sticky', top: 80,
        }}>
          {SECTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '8px 10px',
                borderRadius: 7, border: 'none',
                background: section === s.key ? tokens.bg.hover : 'transparent',
                color: section === s.key ? tokens.text.primary : tokens.text.secondary,
                fontSize: 12, fontWeight: section === s.key ? 700 : 500,
                fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                textAlign: 'left', transition: 'all 120ms ease',
              }}
              onMouseEnter={(e) => { if (section !== s.key) e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={(e) => { if (section !== s.key) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span style={{ flex: 1 }}>{s.label}</span>
            </button>
          ))}
        </aside>

        {/* Section content */}
        <div style={{ minWidth: 0 }}>
          {section === 'general' && <GeneralSection tokens={tokens} />}
          {section === 'store' && <StoreSection tokens={tokens} />}
          {section === 'payments' && <PaymentsSection tokens={tokens} pushToast={pushToast} />}
          {section === 'shipping' && <ShippingSection tokens={tokens} />}
          {section === 'tax' && <TaxSection tokens={tokens} />}
          {section === 'auth' && <AuthSection tokens={tokens} pushToast={pushToast} />}
          {section === 'email' && <EmailSection tokens={tokens} />}
          {section === 'sms' && <SMSSection tokens={tokens} />}
          {section === 'integrations' && <IntegrationsSection tokens={tokens} pushToast={pushToast} />}
          {section === 'apikeys' && <ApiKeysSection tokens={tokens} pushToast={pushToast} />}
          {section === 'security' && <SecuritySection tokens={tokens} />}
          {section === 'roles' && <RolesSection tokens={tokens} pushToast={pushToast} />}
          {section === 'backup' && <BackupSection tokens={tokens} pushToast={pushToast} />}
          {section === 'logs' && <LogsSection tokens={tokens} pushToast={pushToast} />}
        </div>
      </div>
    </AdminLayout>
  );
}

/* --------- Sections --------- */

function GeneralSection({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  return (
    <Panel tokens={tokens} title="General Settings" subtitle="Basic marketplace configuration">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input tokens={tokens} label="Marketplace Name" defaultValue="LNKICKS" hint="Displayed across the website and emails." />
        <Input tokens={tokens} label="Support Email" defaultValue="support@lnkicks.com" type="email" />
        <Input tokens={tokens} label="Support Phone" defaultValue="+91 98765 43210" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Select tokens={tokens} label="Currency"
            options={[
              { value: 'INR', label: '₹ Indian Rupee (INR)' },
              { value: 'USD', label: '$ US Dollar (USD)' },
              { value: 'EUR', label: '€ Euro (EUR)' },
            ]}
            defaultValue="INR"
          />
          <Select tokens={tokens} label="Timezone"
            options={[
              { value: 'IST', label: 'Asia/Kolkata (IST)' },
              { value: 'UTC', label: 'UTC' },
              { value: 'EST', label: 'America/New_York (EST)' },
            ]}
            defaultValue="IST"
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Select tokens={tokens} label="Date Format"
            options={[
              { value: 'dmy', label: 'DD/MM/YYYY' },
              { value: 'mdy', label: 'MM/DD/YYYY' },
              { value: 'ymd', label: 'YYYY-MM-DD' },
            ]}
          />
          <Select tokens={tokens} label="Language"
            options={[
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'हिन्दी (Hindi)' },
              { value: 'ta', label: 'தமிழ் (Tamil)' },
            ]}
          />
        </div>
        <ToggleRow tokens={tokens} label="Maintenance Mode" desc="Temporarily disable the storefront for customers" checked={false} />
        <ToggleRow tokens={tokens} label="Automatic SEO Optimization" desc="AI generates meta tags when products are added" checked={true} />
        <ToggleRow tokens={tokens} label="Auto-generate Sitemap" desc="Update sitemap.xml when products change" checked={true} />
      </div>
    </Panel>
  );
}

function StoreSection({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  return (
    <Panel tokens={tokens} title="Store Configuration" subtitle="Branding and storefront settings">
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
    </Panel>
  );
}

function PaymentsSection({ tokens, pushToast }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; pushToast: (t: any) => void }) {
  const gateways = [
    { name: 'Razorpay', icon: '💳', status: 'connected', desc: 'Indian payment gateway — UPI, cards, netbanking, wallets' },
    { name: 'Stripe', icon: '💳', status: 'connected', desc: 'International cards, Apple Pay, Google Pay' },
    { name: 'PayPal', icon: '🅿️', status: 'disconnected', desc: 'International payments in 200+ countries' },
    { name: 'Cash on Delivery (COD)', icon: '💵', status: 'connected', desc: 'Allow customers to pay on delivery' },
    { name: 'PhonePe', icon: '📱', status: 'disconnected', desc: 'UPI payments via PhonePe' },
  ];
  return (
    <Panel tokens={tokens} title="Payment Gateways" subtitle="Configure payment methods for customers">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {gateways.map(g => (
          <div key={g.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 9, background: tokens.bg.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{g.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{g.name}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{g.desc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StatusPill tokens={tokens} status={g.status === 'connected' ? 'Active' : 'Inactive'} />
              <Button tokens={tokens} variant={g.status === 'connected' ? 'outline' : 'primary'} size="sm"
                onClick={() => pushToast({ tone: g.status === 'connected' ? 'info' : 'success', title: g.status === 'connected' ? 'Configure' : 'Connecting', message: g.name })}
              >{g.status === 'connected' ? 'Configure' : 'Connect'}</Button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ShippingSection({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  const carriers = [
    { name: 'BlueDart', status: 'Active' },
    { name: 'Delhivery', status: 'Active' },
    { name: 'DTDC', status: 'Active' },
    { name: 'Ekart', status: 'Inactive' },
    { name: 'India Post', status: 'Inactive' },
  ];
  return (
    <Panel tokens={tokens} title="Shipping Configuration" subtitle="Carriers, rates, and delivery zones">
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
    </Panel>
  );
}

function TaxSection({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  return (
    <Panel tokens={tokens} title="Tax Configuration" subtitle="GST and tax rules for India">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ToggleRow tokens={tokens} label="Charge GST" desc="Apply GST to all orders" checked={true} />
        <Input tokens={tokens} label="GST Number" defaultValue="29ABCDE1234F1Z5" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Select tokens={tokens} label="Default GST Rate"
            options={[
              { value: '0', label: '0% (Exempt)' },
              { value: '5', label: '5% (Essential goods)' },
              { value: '12', label: '12% (Standard)' },
              { value: '18', label: '18% (Most goods)' },
              { value: '28', label: '28% (Luxury goods)' },
            ]}
            defaultValue="18"
          />
          <Select tokens={tokens} label="Tax Inclusive Pricing"
            options={[
              { value: 'inclusive', label: 'Tax included in price' },
              { value: 'exclusive', label: 'Tax added at checkout' },
            ]}
          />
        </div>
        <ToggleRow tokens={tokens} label="State-wise Tax Rules" desc="Apply different rates for different states" checked={true} />
      </div>
    </Panel>
  );
}

function AuthSection({ tokens, pushToast }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; pushToast: (t: any) => void }) {
  return (
    <Panel tokens={tokens} title="Authentication" subtitle="Customer and admin login methods">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Customer Login Methods</div>
          <ToggleRow tokens={tokens} label="Email + Password" desc="Traditional email/password login" checked={true} />
          <ToggleRow tokens={tokens} label="Google OAuth" desc="Sign in with Google account" checked={true} />
          <ToggleRow tokens={tokens} label="Mobile OTP" desc="Login with phone number + OTP" checked={true} />
          <ToggleRow tokens={tokens} label="Apple Sign In" desc="Sign in with Apple ID" checked={false} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Admin Security</div>
          <ToggleRow tokens={tokens} label="Force 2FA for all admins" desc="Require two-factor authentication" checked={false} />
          <ToggleRow tokens={tokens} label="IP Whitelist" desc="Only allow login from specific IPs" checked={false} />
          <ToggleRow tokens={tokens} label="Session timeout after 8 hours" desc="Auto logout inactive sessions" checked={true} />
        </div>
        <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'info', title: '2FA setup', message: 'Configure TOTP app' })}>
          Configure 2FA
        </Button>
      </div>
    </Panel>
  );
}

function EmailSection({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  return (
    <Panel tokens={tokens} title="Email Configuration" subtitle="SMTP and transactional email">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Select tokens={tokens} label="Email Provider"
          options={[
            { value: 'smtp', label: 'Custom SMTP' },
            { value: 'sendgrid', label: 'SendGrid' },
            { value: 'ses', label: 'Amazon SES' },
            { value: 'mailgun', label: 'Mailgun' },
            { value: 'postmark', label: 'Postmark' },
          ]}
          defaultValue="sendgrid"
        />
        <Input tokens={tokens} label="SMTP Host" defaultValue="smtp.sendgrid.net" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input tokens={tokens} label="Port" type="number" defaultValue="587" />
          <Select tokens={tokens} label="Encryption"
            options={[
              { value: 'tls', label: 'TLS' },
              { value: 'ssl', label: 'SSL' },
              { value: 'none', label: 'None' },
            ]}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input tokens={tokens} label="Username" defaultValue="apikey" />
          <Input tokens={tokens} label="Password / API Key" type="password" defaultValue="••••••••••••" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input tokens={tokens} label="From Name" defaultValue="LNKICKS" />
          <Input tokens={tokens} label="From Email" defaultValue="noreply@lnkicks.com" />
        </div>
        <Button tokens={tokens} variant="outline" size="md">Send Test Email</Button>
      </div>
    </Panel>
  );
}

function SMSSection({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  return (
    <Panel tokens={tokens} title="SMS Configuration" subtitle="OTP and notification SMS">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Select tokens={tokens} label="SMS Provider"
          options={[
            { value: 'twilio', label: 'Twilio' },
            { value: 'msg91', label: 'MSG91' },
            { value: 'textlocal', label: 'TextLocal' },
            { value: 'gupshup', label: 'Gupshup' },
          ]}
          defaultValue="msg91"
        />
        <Input tokens={tokens} label="Sender ID" defaultValue="LNKICKS" hint="6-character alphanumeric sender ID" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input tokens={tokens} label="API Key" type="password" defaultValue="••••••••••••" />
          <Input tokens={tokens} label="OTP Length" type="number" defaultValue="6" />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>SMS Templates</div>
          {['Order Confirmation', 'Order Shipped', 'Out for Delivery', 'Order Delivered', 'OTP Verification'].map(t => (
            <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: 6, background: tokens.bg.surfaceAlt, marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: tokens.text.primary }}>{t}</span>
              <Button tokens={tokens} variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </div>
        <Button tokens={tokens} variant="outline" size="md">Send Test SMS</Button>
      </div>
    </Panel>
  );
}

function IntegrationsSection({ tokens, pushToast }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; pushToast: (t: any) => void }) {
  const integrations = [
    { name: 'Google Analytics 4', status: 'connected' },
    { name: 'Google Search Console', status: 'connected' },
    { name: 'Facebook Pixel', status: 'connected' },
    { name: 'Microsoft Clarity', status: 'connected' },
    { name: 'Google Merchant Center', status: 'disconnected' },
    { name: 'WhatsApp Business API', status: 'disconnected' },
    { name: 'Razorpay X (Payouts)', status: 'disconnected' },
    { name: 'Shiprocket', status: 'connected' },
  ];
  return (
    <Panel tokens={tokens} title="Integrations" subtitle="Third-party services and tools">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {integrations.map(int => (
          <div key={int.name} style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, marginBottom: 4 }}>{int.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <StatusPill tokens={tokens} status={int.status === 'connected' ? 'Active' : 'Inactive'} />
              <Button tokens={tokens} variant={int.status === 'connected' ? 'outline' : 'primary'} size="sm"
                onClick={() => pushToast({ tone: int.status === 'connected' ? 'info' : 'success', title: int.status === 'connected' ? 'Configure' : 'Connecting', message: int.name })}
              >{int.status === 'connected' ? 'Configure' : 'Connect'}</Button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ApiKeysSection({ tokens, pushToast }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; pushToast: (t: any) => void }) {
  const keys = [
    { name: 'Production API Key', key: 'lnk_live_sk_9876543210abcdef', created: '2026-01-15', lastUsed: '2 hours ago' },
    { name: 'Test API Key', key: 'lnk_test_sk_1234567890abcdef', created: '2026-01-15', lastUsed: '5 days ago' },
    { name: 'Webhook Secret', key: 'whsec_••••••••••••••••', created: '2026-02-01', lastUsed: '1 hour ago' },
  ];
  return (
    <Panel tokens={tokens} title="API Keys" subtitle="Manage API access for integrations"
      action={<Button tokens={tokens} variant="primary" size="sm" onClick={() => pushToast({ tone: 'success', title: 'API key created' })}>Generate New Key</Button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {keys.map(k => (
          <div key={k.name} style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{k.name}</span>
              <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Copied to clipboard' })}>Copy</Button>
            </div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: tokens.text.secondary, background: tokens.bg.surface, padding: '6px 8px', borderRadius: 6, wordBreak: 'break-all' }}>{k.key}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10, color: tokens.text.tertiary }}>
              <span>Created: {k.created}</span>
              <span>Last used: {k.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SecuritySection({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  return (
    <Panel tokens={tokens} title="Security Settings" subtitle="Protect your admin panel">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ToggleRow tokens={tokens} label="Force HTTPS" desc="Redirect all HTTP to HTTPS" checked={true} />
        <ToggleRow tokens={tokens} label="Two-Factor Authentication" desc="Require TOTP code on login" checked={false} />
        <ToggleRow tokens={tokens} label="IP Whitelist" desc="Only allow admin login from specified IPs" checked={false} />
        <Input tokens={tokens} label="Allowed IPs (comma separated)" placeholder="192.168.1.1, 10.0.0.1" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input tokens={tokens} label="Session Timeout (hours)" type="number" defaultValue="8" />
          <Input tokens={tokens} label="Max Login Attempts" type="number" defaultValue="5" />
        </div>
        <ToggleRow tokens={tokens} label="Activity Logging" desc="Log all admin actions to audit trail" checked={true} />
        <ToggleRow tokens={tokens} label="Failed Login Alerts" desc="Email admins on repeated failed logins" checked={true} />
      </div>
    </Panel>
  );
}

function RolesSection({ tokens, pushToast }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; pushToast: (t: any) => void }) {
  const users = listAdminUsers();
  return (
    <Panel tokens={tokens} title="Roles & Permissions" subtitle="Manage admin team members"
      action={<Button tokens={tokens} variant="primary" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Invite admin', message: 'Send invite email' })}>+ Invite Admin</Button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {users.map(u => (
          <div key={u.uid} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar tokens={tokens} name={u.name} size={36} color={u.avatarColor} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{u.name}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{u.email}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <Badge tokens={tokens} tone="neutral" size="sm">{u.role}</Badge>
                  {u.twoFactorEnabled && <Badge tokens={tokens} tone="success" size="sm" dot>2FA</Badge>}
                  <StatusPill tokens={tokens} status={u.isActive ? 'Active' : 'Disabled'} />
                </div>
              </div>
            </div>
            <Button tokens={tokens} variant="outline" size="sm">Edit Role</Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function BackupSection({ tokens, pushToast }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; pushToast: (t: any) => void }) {
  const backups = [
    { name: 'Automatic daily backup', date: 'Today, 03:00 AM', size: '24.8 MB', type: 'auto' },
    { name: 'Manual backup before product update', date: 'Yesterday, 5:42 PM', size: '24.5 MB', type: 'manual' },
    { name: 'Automatic daily backup', date: '2 days ago, 03:00 AM', size: '24.2 MB', type: 'auto' },
  ];
  return (
    <Panel tokens={tokens} title="Backup & Restore" subtitle="Database and file backups"
      action={<Button tokens={tokens} variant="primary" size="sm" onClick={() => pushToast({ tone: 'success', title: 'Backup started', message: 'Will complete in 2-3 minutes.' })}>Create Backup</Button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ToggleRow tokens={tokens} label="Automatic Daily Backups" desc="Backup database every day at 3 AM" checked={true} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recent Backups</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {backups.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{b.date} · {b.size}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Restore started', message: 'This will take 5-10 minutes.' })}>Restore</Button>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'success', title: 'Download started' })}>Download</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function LogsSection({ tokens, pushToast }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; pushToast: (t: any) => void }) {
  const logTypes = ['Application Logs', 'Error Logs', 'Access Logs', 'Email Logs', 'SMS Logs', 'Webhook Logs', 'Cron Jobs'];
  return (
    <Panel tokens={tokens} title="System Logs" subtitle="View application and system logs">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {logTypes.map((log, i) => (
          <div key={log} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{log}</div>
              <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>
                {`${100 + i * 50} entries · Last updated ${i + 1} hour${i === 0 ? '' : 's'} ago`}
              </div>
            </div>
            <Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Opening log', message: log })}>View</Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ToggleRow({ tokens, label, desc, checked }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; label: string; desc: string; checked: boolean }) {
  const [enabled, setEnabled] = useState(checked);
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt,
      cursor: 'pointer',
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{label}</div>
        <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{desc}</div>
      </div>
      <Toggle tokens={tokens} checked={enabled} onChange={setEnabled} />
    </label>
  );
}
