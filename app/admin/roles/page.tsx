/**
 * LNKICKS Enterprise Admin — Roles & Permissions (Enterprise RBAC)
 * ------------------------------------------------------------
 * Enterprise RBAC with:
 *  - Admin team member list with role badges
 *  - Permission Matrix (role × permission grid)
 *  - Department Access (Sales / Catalog / Operations / Marketing / Finance / IT)
 *  - Feature Access (per-feature read/write/delete/export/approve)
 *  - Role activity summary (last 7 days actions per role)
 *  - Invite admin drawer
 *
 * Inspired by AWS IAM, Google Workspace Admin, Microsoft Entra ID,
 * Okta RBAC, Shopify Plus Staff.
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, SearchInput, Tabs, useToast, Panel,
  Drawer, Input, Select, Avatar, Skeleton, Toggle,
} from '@/components/admin/ui';
import { listAdminUsers } from '@/lib/admin/adminAuth';
import { ROLE_PERMISSIONS } from '@/lib/admin/types';
import type { AdminUser, AdminRole, Permission } from '@/lib/admin/types';

/* ----------------------------- Types ----------------------------- */

interface Department { name: string; icon: string; roles: AdminRole[]; memberCount: number; color: string }
interface RoleStat { role: AdminRole; label: string; memberCount: number; actionsThisWeek: number; lastActive: string; color: string }
interface FeatureAccess { feature: string; read: AdminRole[]; write: AdminRole[]; remove: AdminRole[]; export: AdminRole[]; approve: AdminRole[] }

/* ----------------------------- Data ----------------------------- */

const DEPARTMENTS: Department[] = [
  { name: 'Sales & Operations', icon: '📦', roles: ['admin', 'manager', 'support'], memberCount: 3, color: '#3B82F6' },
  { name: 'Catalog & Content', icon: '🏷️', roles: ['editor'], memberCount: 1, color: '#10B981' },
  { name: 'Warehouse & Fulfillment', icon: '🏭', roles: ['warehouse'], memberCount: 1, color: '#F59E0B' },
  { name: 'Marketing & Growth', icon: '📣', roles: ['marketing'], memberCount: 1, color: '#8B5CF6' },
];

const ROLE_STATS: RoleStat[] = [
  { role: 'admin', label: 'Admin', memberCount: 1, actionsThisWeek: 142, lastActive: '5 min ago', color: '#EF4444' },
  { role: 'manager', label: 'Manager', memberCount: 1, actionsThisWeek: 89, lastActive: '2 hours ago', color: '#3B82F6' },
  { role: 'editor', label: 'Editor', memberCount: 1, actionsThisWeek: 67, lastActive: '4 hours ago', color: '#10B981' },
  { role: 'support', label: 'Support', memberCount: 1, actionsThisWeek: 124, lastActive: '12 min ago', color: '#EC4899' },
  { role: 'warehouse', label: 'Warehouse', memberCount: 1, actionsThisWeek: 56, lastActive: '1 hour ago', color: '#F59E0B' },
  { role: 'marketing', label: 'Marketing', memberCount: 1, actionsThisWeek: 38, lastActive: '3 hours ago', color: '#8B5CF6' },
];

const PERMISSION_GROUPS: { label: string; permissions: Permission[] }[] = [
  { label: 'Dashboard', permissions: ['dashboard.view'] },
  { label: 'Products', permissions: ['product.create', 'product.edit', 'product.delete', 'product.publish'] },
  { label: 'Orders', permissions: ['order.view', 'order.update_status', 'order.refund', 'order.cancel'] },
  { label: 'Customers', permissions: ['customer.view', 'customer.edit'] },
  { label: 'Wallet', permissions: ['wallet.credit', 'wallet.debit'] },
  { label: 'Coupons', permissions: ['coupon.create', 'coupon.edit', 'coupon.delete'] },
  { label: 'Marketing', permissions: ['banner.manage', 'seo.manage', 'notification.send'] },
  { label: 'Inventory', permissions: ['inventory.manage'] },
  { label: 'Reviews', permissions: ['review.moderate'] },
  { label: 'Reports', permissions: ['report.view', 'report.export'] },
  { label: 'System', permissions: ['settings.manage', 'user.manage', 'audit.view'] },
];

const FEATURE_ACCESS: FeatureAccess[] = [
  { feature: 'Product Catalog', read: ['admin', 'manager', 'editor', 'warehouse'], write: ['admin', 'manager', 'editor'], remove: ['admin', 'editor'], export: ['admin', 'manager'], approve: ['admin'] },
  { feature: 'Orders', read: ['admin', 'manager', 'support', 'warehouse'], write: ['admin', 'manager', 'support', 'warehouse'], remove: ['admin'], export: ['admin', 'manager'], approve: ['admin', 'manager'] },
  { feature: 'Customer Wallet', read: ['admin', 'manager', 'support'], write: ['admin', 'manager', 'support'], remove: ['admin'], export: ['admin'], approve: ['admin'] },
  { feature: 'Coupons & Discounts', read: ['admin', 'manager', 'marketing'], write: ['admin', 'marketing'], remove: ['admin', 'marketing'], export: ['admin', 'marketing'], approve: ['admin'] },
  { feature: 'Banners & Content', read: ['admin', 'editor', 'marketing'], write: ['admin', 'editor', 'marketing'], remove: ['admin', 'editor'], export: ['admin'], approve: ['admin'] },
  { feature: 'Reviews', read: ['admin', 'manager', 'editor', 'support'], write: ['admin', 'manager', 'editor', 'support'], remove: ['admin'], export: ['admin', 'manager'], approve: ['admin', 'manager'] },
  { feature: 'Audit Logs', read: ['admin'], write: [], remove: [], export: ['admin'], approve: ['admin'] },
  { feature: 'Settings', read: ['admin'], write: ['admin'], remove: ['admin'], export: ['admin'], approve: ['admin'] },
];

const ALL_ROLES: AdminRole[] = ['admin', 'manager', 'editor', 'support', 'warehouse', 'marketing'];

/* ----------------------------- Helpers ----------------------------- */

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/* ----------------------------- Page ----------------------------- */

type Tab = 'team' | 'matrix' | 'departments' | 'features' | 'activity';

export default function RolesPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('team');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setUsers(listAdminUsers()); setLoading(false); }, 240);
    return () => clearTimeout(t);
  }, []);

  const filteredUsers = useMemo(() => users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  }), [users, search]);

  const totalPermissions = useMemo(() => Object.values(ROLE_PERMISSIONS).reduce((s, ps) => s + ps.length, 0), []);

  const handleRoleChange = useCallback((uid: string, newRole: AdminRole) => {
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    pushToast({ tone: 'success', title: 'Role updated', message: `${uid} now has ${newRole} role` });
  }, [pushToast]);

  return (
    <AdminLayout
      title="Roles & Permissions"
      subtitle="Enterprise RBAC management"
      requirePermission="user.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Roles' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Roles & Permissions"
        subtitle="Manage admin team members, role assignments, permission matrices, department access, and feature-level RBAC."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Roles' }]}
        meta={<Badge tokens={tokens} tone="info">{users.length} members · {ALL_ROLES.length} roles · {totalPermissions} permissions</Badge>}
        actions={<Button tokens={tokens} variant="primary" size="md" onClick={() => setInviteOpen(true)}>+ Invite Admin</Button>}
      />

      {/* Role stats strip */}
      <div className="rol-stat-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rol-stat-card">
              <Skeleton tokens={tokens} w="60%" h={10} />
              <div style={{ height: 8 }} />
              <Skeleton tokens={tokens} w="40%" h={20} />
            </div>
          ))
        ) : (
          ROLE_STATS.map((r, i) => (
            <div key={r.role} className="rol-stat-card" style={{ borderTop: `3px solid ${r.color}`, animationDelay: `${i * 40}ms` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>{r.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginTop: 4, fontFamily: 'ui-monospace, monospace' }}>{r.memberCount}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{r.actionsThisWeek} actions this week</div>
              <div style={{ fontSize: 10, color: tokens.status.success, marginTop: 4, fontWeight: 600 }}>● {r.lastActive}</div>
            </div>
          ))
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'team', label: 'Team Members', badge: users.length },
          { key: 'matrix', label: 'Permission Matrix' },
          { key: 'departments', label: 'Department Access', badge: DEPARTMENTS.length },
          { key: 'features', label: 'Feature Access', badge: FEATURE_ACCESS.length },
          { key: 'activity', label: 'Activity Summary' },
        ]} active={tab} onChange={(t) => setTab(t as Tab)} />
      </div>

      {/* Team Members */}
      {tab === 'team' && (
        <Panel tokens={tokens} title="Admin Team" subtitle="All admin accounts with system access"
          action={<div style={{ width: 260 }}><SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search name, email, role…" /></div>}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ padding: 14, borderRadius: 10, background: tokens.bg.surfaceAlt }}><Skeleton tokens={tokens} w="40%" h={12} /></div>)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredUsers.map(u => (
                <div key={u.uid} className="rol-user-row" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 10, background: tokens.bg.surfaceAlt, gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                    <Avatar tokens={tokens} name={u.name} size={44} color={u.avatarColor} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{u.name}</span>
                        {u.twoFactorEnabled && <Badge tokens={tokens} tone="success" size="sm" dot>2FA</Badge>}
                        <StatusPill tokens={tokens} status={u.isActive ? 'Active' : 'Disabled'} />
                      </div>
                      <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{u.email}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>
                        Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {u.lastLoginAt ? ` · last login ${timeAgo(u.lastLoginAt)}` : ' · never logged in'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <Select
                      tokens={tokens}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.uid, e.target.value as AdminRole)}
                      options={ALL_ROLES.map(r => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) }))}
                      style={{ height: 32, width: 130, fontSize: 11 }}
                    />
                    <Button tokens={tokens} variant="outline" size="sm" onClick={() => setEditUser(u)}>Edit</Button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: tokens.text.tertiary, fontSize: 12 }}>No team members found.</div>
              )}
            </div>
          )}
        </Panel>
      )}

      {/* Permission Matrix */}
      {tab === 'matrix' && (
        <Panel tokens={tokens} title="Permission Matrix" subtitle="Role × Permission assignment grid">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 10px', color: tokens.text.tertiary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: `1px solid ${tokens.border.subtle}` }}>Permission</th>
                  {ALL_ROLES.map(r => (
                    <th key={r} style={{ padding: '8px 6px', color: tokens.text.tertiary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: `1px solid ${tokens.border.subtle}`, textAlign: 'center', minWidth: 70 }}>
                      <div style={{ fontWeight: 700, color: tokens.text.primary }}>{r}</div>
                      <div style={{ fontSize: 9, color: tokens.text.tertiary, marginTop: 2 }}>{ROLE_PERMISSIONS[r].length} perms</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_GROUPS.map(group => (
                  <>
                    <tr key={group.label}>
                      <td colSpan={ALL_ROLES.length + 1} style={{ padding: '10px 10px 4px 10px', fontSize: 10, fontWeight: 700, color: tokens.text.accent, textTransform: 'uppercase', letterSpacing: 0.5, background: tokens.bg.surfaceAlt }}>{group.label}</td>
                    </tr>
                    {group.permissions.map(p => (
                      <tr key={p} className="rol-matrix-row">
                        <td style={{ padding: '8px 10px', color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', fontSize: 11, borderBottom: `1px solid ${tokens.border.subtle}` }}>{p}</td>
                        {ALL_ROLES.map(r => {
                          const has = ROLE_PERMISSIONS[r].includes(p);
                          return (
                            <td key={r} style={{ padding: '8px 6px', textAlign: 'center', borderBottom: `1px solid ${tokens.border.subtle}` }}>
                              <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 22, height: 22, borderRadius: 6,
                                background: has ? `${tokens.status.success}20` : 'transparent',
                                color: has ? tokens.status.success : tokens.text.tertiary,
                                fontWeight: 700, fontSize: 12,
                              }}>{has ? '✓' : '—'}</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: `${tokens.status.info}15`, border: `1px solid ${tokens.status.info}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
            💡 The matrix shows which roles have which permissions. Changes to <code style={{ fontFamily: 'ui-monospace, monospace', color: tokens.text.primary }}>ROLE_PERMISSIONS</code> in <code style={{ fontFamily: 'ui-monospace, monospace', color: tokens.text.primary }}>lib/admin/types.ts</code> are required to modify role-permission assignments (system-level change).
          </div>
        </Panel>
      )}

      {/* Departments */}
      {tab === 'departments' && (
        <div className="rol-dept-grid">
          {DEPARTMENTS.map((d, i) => (
            <div key={d.name} className="rol-dept-card" style={{ borderTop: `3px solid ${d.color}`, animationDelay: `${i * 50}ms` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${d.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{d.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{d.name}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{d.memberCount} member{d.memberCount !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>Allowed Roles</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {d.roles.map(r => <Badge key={r} tokens={tokens} tone="neutral" size="sm">{r}</Badge>)}
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${tokens.border.subtle}`, fontSize: 10, color: tokens.text.tertiary }}>
                Members of this department can access modules assigned to these roles.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feature Access */}
      {tab === 'features' && (
        <Panel tokens={tokens} title="Feature Access Matrix" subtitle="Granular per-feature permissions: Read · Write · Delete · Export · Approve">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 800 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: tokens.text.tertiary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: `1px solid ${tokens.border.subtle}` }}>Feature</th>
                  {(['read', 'write', 'delete', 'export', 'approve'] as const).map(op => (
                    <th key={op} style={{ padding: '10px 12px', color: tokens.text.tertiary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: `1px solid ${tokens.border.subtle}`, textAlign: 'center' }}>{op}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ACCESS.map(f => (
                  <tr key={f.feature} className="rol-feature-row">
                    <td style={{ padding: '12px', color: tokens.text.primary, fontWeight: 600, fontSize: 12, borderBottom: `1px solid ${tokens.border.subtle}` }}>{f.feature}</td>
                    {[f.read, f.write, f.remove, f.export, f.approve].map((roles, i) => (
                      <td key={i} style={{ padding: '12px', borderBottom: `1px solid ${tokens.border.subtle}`, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                          {roles.length === 0 ? (
                            <span style={{ color: tokens.text.tertiary, fontSize: 10 }}>—</span>
                          ) : roles.map(r => (
                            <span key={r} style={{
                              padding: '2px 6px', borderRadius: 4,
                              background: tokens.bg.surfaceAlt, fontSize: 9, fontWeight: 600,
                              color: tokens.text.secondary, fontFamily: 'ui-monospace, monospace',
                            }}>{r.slice(0, 3)}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: `${tokens.status.warning}15`, border: `1px solid ${tokens.status.warning}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
            <strong style={{ color: tokens.status.warning }}>⚠ Note:</strong> Feature access is enforced via the RBAC layer. The &ldquo;approve&rdquo; permission requires additional elevation and is logged to the audit trail.
          </div>
        </Panel>
      )}

      {/* Activity Summary */}
      {tab === 'activity' && (
        <div className="rol-2col">
          <Panel tokens={tokens} title="Role Activity (Last 7 Days)" subtitle="Action count per role">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ROLE_STATS.map(r => {
                const max = Math.max(...ROLE_STATS.map(x => x.actionsThisWeek));
                const pct = Math.round((r.actionsThisWeek / max) * 100);
                return (
                  <div key={r.role}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{r.label}</span>
                      <span style={{ fontSize: 11, color: tokens.text.secondary }}>{r.actionsThisWeek} actions</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: tokens.bg.surfaceAlt, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: r.color, borderRadius: 4, transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
          <Panel tokens={tokens} title="Permission Distribution" subtitle="Roles by permission count">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ALL_ROLES.map(r => {
                const count = ROLE_PERMISSIONS[r].length;
                const max = Math.max(...ALL_ROLES.map(x => ROLE_PERMISSIONS[x].length));
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={r}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{r}</span>
                      <span style={{ fontSize: 11, color: tokens.text.secondary }}>{count} permissions</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: tokens.bg.surfaceAlt, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: tokens.text.accent, borderRadius: 4, transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}

      {/* Invite Drawer */}
      <Drawer
        tokens={tokens}
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite Admin"
        subtitle="Send an invitation to join the admin team"
        width={460}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={() => { pushToast({ tone: 'success', title: 'Invitation sent', message: 'Email sent · expires in 7 days' }); setInviteOpen(false); }}>Send Invite</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input tokens={tokens} label="Full Name" placeholder="John Doe" />
          <Input tokens={tokens} label="Email Address" type="email" placeholder="john@lnkicks.com" />
          <Input tokens={tokens} label="Phone (optional)" placeholder="+91 98765 43210" />
          <Select tokens={tokens} label="Role"
            options={ALL_ROLES.map(r => ({ value: r, label: `${r.charAt(0).toUpperCase() + r.slice(1)} — ${ROLE_PERMISSIONS[r].length} permissions` }))}
          />
          <div style={{ padding: 12, borderRadius: 8, background: `${tokens.status.info}15`, border: `1px solid ${tokens.status.info}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
            💡 The invitee will receive an email with a secure setup link valid for 7 days. They must set their own password and optionally enable 2FA.
          </div>
        </div>
      </Drawer>

      {/* Edit User Drawer */}
      {editUser && (
        <Drawer
          tokens={tokens}
          open={!!editUser}
          onClose={() => setEditUser(null)}
          title="Edit Team Member"
          subtitle={editUser.name}
          width={460}
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>
              <Button tokens={tokens} variant="primary" onClick={() => { pushToast({ tone: 'success', title: 'User updated', message: editUser.name }); setEditUser(null); }}>Save Changes</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, background: tokens.bg.surfaceAlt }}>
              <Avatar tokens={tokens} name={editUser.name} size={48} color={editUser.avatarColor} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary }}>{editUser.name}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{editUser.email}</div>
              </div>
            </div>
            <Select tokens={tokens} label="Role"
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value as AdminRole })}
              options={ALL_ROLES.map(r => ({ value: r, label: `${r.charAt(0).toUpperCase() + r.slice(1)} — ${ROLE_PERMISSIONS[r].length} permissions` }))}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>Two-Factor Authentication</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{editUser.twoFactorEnabled ? 'Enabled — requires TOTP on login' : 'Disabled — strongly recommended'}</div>
              </div>
              <Toggle tokens={tokens} checked={editUser.twoFactorEnabled} onChange={(v) => setEditUser({ ...editUser, twoFactorEnabled: v })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>Account Active</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{editUser.isActive ? 'Can log in and perform actions' : 'Cannot log in'}</div>
              </div>
              <Toggle tokens={tokens} checked={editUser.isActive} onChange={(v) => setEditUser({ ...editUser, isActive: v })} />
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: `${tokens.status.error}10`, border: `1px solid ${tokens.status.error}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
              <strong style={{ color: tokens.status.error }}>Danger zone:</strong> Disabling an account immediately revokes all sessions. Re-enabling requires the user to log in again.
            </div>
          </div>
        </Drawer>
      )}

      <style jsx>{`
        :global(.rol-stat-grid) {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 16px;
        }
        :global(.rol-stat-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 12px;
          padding: 12px;
          box-shadow: ${tokens.shadow.sm};
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1);
          animation: rolFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.rol-stat-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
        }
        :global(.rol-dept-grid) {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        :global(.rol-dept-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          padding: 16px;
          box-shadow: ${tokens.shadow.sm};
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1);
          animation: rolFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.rol-dept-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
        }
        :global(.rol-2col) {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
          align-items: start;
        }
        :global(.rol-user-row), :global(.rol-matrix-row), :global(.rol-feature-row) {
          transition: background 180ms ease;
        }
        :global(.rol-user-row:hover) {
          background: ${tokens.bg.hover} !important;
        }
        :global(.rol-matrix-row:hover), :global(.rol-feature-row:hover) {
          background: ${tokens.bg.hover};
        }
        @keyframes rolFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1400px) {
          :global(.rol-stat-grid) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 1100px) {
          :global(.rol-stat-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          :global(.rol-dept-grid) { grid-template-columns: minmax(0, 1fr); }
          :global(.rol-2col) { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 640px) {
          :global(.rol-stat-grid) { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </AdminLayout>
  );
}
