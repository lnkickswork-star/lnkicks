/**
 * LNKICKS Enterprise Admin — Notification Settings
 */

'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Panel, Input, Select, Toggle, Tabs, useToast,
} from '@/components/admin/ui';

type Channel = 'email' | 'sms' | 'push' | 'whatsapp' | 'inapp';

const EVENTS = [
  { key: 'order_placed', label: 'Order Placed', desc: 'Customer places a new order' },
  { key: 'order_confirmed', label: 'Order Confirmed', desc: 'Admin confirms the order' },
  { key: 'order_shipped', label: 'Order Shipped', desc: 'Courier picks up the package' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Package out for delivery' },
  { key: 'order_delivered', label: 'Order Delivered', desc: 'Package delivered to customer' },
  { key: 'order_cancelled', label: 'Order Cancelled', desc: 'Order cancelled by customer or admin' },
  { key: 'order_returned', label: 'Order Returned', desc: 'Customer initiates a return' },
  { key: 'refund_processed', label: 'Refund Processed', desc: 'Refund completed' },
  { key: 'low_stock', label: 'Low Stock Alert', desc: 'Product stock below threshold' },
  { key: 'out_of_stock', label: 'Out of Stock Alert', desc: 'Product stock reaches zero' },
  { key: 'new_review', label: 'New Review', desc: 'Customer posts a review' },
  { key: 'new_customer', label: 'New Customer', desc: 'Customer signs up' },
  { key: 'wallet_credit', label: 'Wallet Credited', desc: 'Customer wallet receives credit' },
  { key: 'coupon_used', label: 'Coupon Used', desc: 'Customer applies a coupon' },
  { key: 'abandoned_cart', label: 'Abandoned Cart', desc: 'Cart abandoned for 1+ hour' },
];

export default function NotificationSettingsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [channel, setChannel] = useState<Channel>('email');
  const [settings, setSettings] = useState<Record<string, Record<Channel, boolean>>>(() => {
    const out: Record<string, Record<Channel, boolean>> = {};
    EVENTS.forEach((e, i) => {
      out[e.key] = {
        email: true,
        sms: i % 2 === 0,
        push: i % 3 === 0,
        whatsapp: false,
        inapp: true,
      };
    });
    return out;
  });

  function toggle(eventKey: string, ch: Channel) {
    setSettings(prev => ({
      ...prev,
      [eventKey]: { ...prev[eventKey], [ch]: !prev[eventKey][ch] },
    }));
  }

  return (
    <AdminLayout
      title="Notification Settings"
      subtitle="Customer communication"
      requirePermission="settings.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'System' }, { label: 'Notifications' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Notification Settings"
        subtitle="Configure which events trigger customer notifications across email, SMS, push, WhatsApp, and in-app."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'System' }, { label: 'Notifications' }]}
        actions={<Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'success', title: 'Settings saved' })}>Save Settings</Button>}
      />

      <div style={{ marginBottom: 16 }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'email', label: '✉️ Email' },
          { key: 'sms', label: '💬 SMS' },
          { key: 'push', label: '🔔 Push' },
          { key: 'whatsapp', label: '🟢 WhatsApp' },
          { key: 'inapp', label: '📱 In-App' },
        ]} active={channel} onChange={(k) => setChannel(k as Channel)} />
      </div>

      <Panel tokens={tokens} title={`${channel.toUpperCase()} Notifications`} subtitle="Enable events that should send via this channel">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {EVENTS.map(e => (
            <label key={e.key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt,
              cursor: 'pointer',
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{e.label}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{e.desc}</div>
              </div>
              <Toggle tokens={tokens} checked={settings[e.key]?.[channel] ?? false} onChange={() => toggle(e.key, channel)} />
            </label>
          ))}
        </div>
      </Panel>

      <Panel tokens={tokens} title="Channel Configuration" subtitle="Provider settings for each channel">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select tokens={tokens} label="Email Provider"
            options={[{ value: 'sendgrid', label: 'SendGrid' }, { value: 'ses', label: 'Amazon SES' }, { value: 'mailgun', label: 'Mailgun' }]}
            defaultValue="sendgrid"
          />
          <Select tokens={tokens} label="SMS Provider"
            options={[{ value: 'msg91', label: 'MSG91' }, { value: 'twilio', label: 'Twilio' }, { value: 'gupshup', label: 'Gupshup' }]}
            defaultValue="msg91"
          />
          <Select tokens={tokens} label="Push Provider"
            options={[{ value: 'fcm', label: 'Firebase Cloud Messaging' }, { value: 'onesignal', label: 'OneSignal' }]}
            defaultValue="fcm"
          />
          <Input tokens={tokens} label="WhatsApp Business API Key" type="password" defaultValue="••••••••••••" />
        </div>
      </Panel>
    </AdminLayout>
  );
}
