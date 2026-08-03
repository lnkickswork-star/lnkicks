/**
 * LNKICKS Enterprise Admin — Auth Service
 * ------------------------------------------------------------
 * localStorage-backed admin auth that structurally mirrors
 * Firebase Admin Auth + Custom Claims. Swappable to Firebase
 * by replacing the function bodies; types stay identical.
 *
 * Security model:
 *  - 6 roles with strict permission matrix (see types.ts)
 *  - 8h sliding session expiry
 *  - All auth events (login / logout / failed) appended to audit log
 *  - 2FA hook (TOTP stub — wired but not enforced until verified)
 *  - Seeded with a default super-admin on first run
 *
 * Default admin credentials (dev only):
 *   email: admin@lnkicks.com
 *   pass:  Admin@123
 */

'use client';

import type {
  AdminUser, AdminSession, AdminRole, AuditLogEntry,
} from './types';

const LS_USERS = 'lnk_admin_users';
const LS_SESSION = 'lnk_admin_session';
const LS_AUDIT = 'lnk_admin_audit';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8h

const AVATAR_COLORS = ['#0A0A0A', '#1E40AF', '#6D28D9', '#B45309', '#047857', '#BE123C'];
const SUPER_ADMIN_EMAIL = 'admin@lnkicks.com';

/* ------------------------------------------------------------------ */
/* Seeding                                                             */
/* ------------------------------------------------------------------ */

interface StoredAdmin extends AdminUser {
  passwordHash: string;   // simple hash (NOT for production — placeholder for bcrypt)
}

function hash(s: string): string {
  // Lightweight FNV-1a — placeholder. Swap for bcrypt/argon2 server-side.
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `h${(h >>> 0).toString(16)}`;
}

function ensureSeed(): void {
  if (typeof window === 'undefined') return;
  const existing = readUsers();
  if (existing.length > 0) return;

  const now = Date.now();
  const seedUsers: StoredAdmin[] = [
    {
      uid: 'admin-001',
      email: SUPER_ADMIN_EMAIL,
      name: 'LNKICKS Founder',
      role: 'admin',
      avatarColor: AVATAR_COLORS[0],
      phone: '+91 98765 43210',
      twoFactorEnabled: false,
      createdAt: now - 90 * 24 * 60 * 60 * 1000,
      lastLoginAt: undefined,
      isActive: true,
      passwordHash: hash('Admin@123'),
    },
    {
      uid: 'mgr-001',
      email: 'manager@lnkicks.com',
      name: 'Operations Manager',
      role: 'manager',
      avatarColor: AVATAR_COLORS[1],
      phone: '+91 98765 11111',
      twoFactorEnabled: false,
      createdAt: now - 60 * 24 * 60 * 60 * 1000,
      isActive: true,
      passwordHash: hash('Manager@123'),
    },
    {
      uid: 'wh-001',
      email: 'warehouse@lnkicks.com',
      name: 'Warehouse Lead',
      role: 'warehouse',
      avatarColor: AVATAR_COLORS[4],
      twoFactorEnabled: false,
      createdAt: now - 30 * 24 * 60 * 60 * 1000,
      isActive: true,
      passwordHash: hash('Warehouse@123'),
    },
  ];
  writeUsers(seedUsers);
}

/* ------------------------------------------------------------------ */
/* Storage helpers                                                     */
/* ------------------------------------------------------------------ */

function readUsers(): StoredAdmin[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_USERS);
    return raw ? (JSON.parse(raw) as StoredAdmin[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredAdmin[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function readAudit(): AuditLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_AUDIT);
    return raw ? (JSON.parse(raw) as AuditLogEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAudit(entries: AuditLogEntry[]): void {
  if (typeof window === 'undefined') return;
  // keep last 500 entries
  const trimmed = entries.slice(-500);
  localStorage.setItem(LS_AUDIT, JSON.stringify(trimmed));
}

function getMeta(): { ip: string; ua: string } {
  if (typeof window === 'undefined') return { ip: 'server', ua: 'server' };
  return {
    ip: 'client-side',  // real IP would be set by server middleware
    ua: navigator.userAgent.substring(0, 200),
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export interface LoginResult {
  ok: boolean;
  error?: 'invalid_credentials' | 'account_disabled' | '2fa_required';
  session?: AdminSession;
  requires2FA?: boolean;
}

export function loginWithPassword(email: string, password: string): LoginResult {
  ensureSeed();
  const users = readUsers();
  const u = users.find(x => x.email.toLowerCase() === email.toLowerCase().trim());

  if (!u || u.passwordHash !== hash(password)) {
    appendAudit({
      action: 'login_failed',
      actorUid: 'unknown',
      actorName: email,
      actorRole: 'admin',
      target: email,
      targetKind: 'admin_session',
    });
    return { ok: false, error: 'invalid_credentials' };
  }

  if (!u.isActive) {
    appendAudit({
      action: 'login_failed',
      actorUid: u.uid,
      actorName: u.name,
      actorRole: u.role,
      target: u.email,
      targetKind: 'admin_session',
      metadata: { reason: 'account_disabled' },
    });
    return { ok: false, error: 'account_disabled' };
  }

  if (u.twoFactorEnabled) {
    // Stub — real flow would issue a TOTP challenge here
    return { ok: false, requires2FA: true, error: '2fa_required' };
  }

  const { ip, ua } = getMeta();
  const now = Date.now();
  const session: AdminSession = {
    uid: u.uid,
    email: u.email,
    name: u.name,
    role: u.role,
    avatarColor: u.avatarColor,
    twoFactorEnabled: u.twoFactorEnabled,
    loggedInAt: now,
    expiresAt: now + SESSION_TTL_MS,
    ipAddress: ip,
    userAgent: ua,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_SESSION, JSON.stringify(session));
  }

  // update lastLoginAt
  u.lastLoginAt = now;
  writeUsers(users);

  appendAudit({
    action: 'login',
    actorUid: u.uid,
    actorName: u.name,
    actorRole: u.role,
    targetKind: 'admin_session',
  });

  return { ok: true, session };
}

export function logout(): void {
  const session = getCurrentSession();
  if (session) {
    appendAudit({
      action: 'logout',
      actorUid: session.uid,
      actorName: session.name,
      actorRole: session.role,
      targetKind: 'admin_session',
    });
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LS_SESSION);
  }
}

export function getCurrentSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (Date.now() > session.expiresAt) {
      // expired — clean up
      localStorage.removeItem(LS_SESSION);
      return null;
    }
    // sliding renewal
    session.expiresAt = Date.now() + SESSION_TTL_MS;
    localStorage.setItem(LS_SESSION, JSON.stringify(session));
    return session;
  } catch {
    return null;
  }
}

export function listAdminUsers(): AdminUser[] {
  ensureSeed();
  return readUsers().map(({ passwordHash, ...rest }) => rest);
}

export function appendAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>): void {
  if (typeof window === 'undefined') return;
  const { ip, ua } = getMeta();
  const full: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    ipAddress: ip,
    userAgent: ua,
  };
  const all = readAudit();
  all.push(full);
  writeAudit(all);
}

export function getAuditLog(limit = 100): AuditLogEntry[] {
  const all = readAudit();
  return all.slice(-limit).reverse();
}

export function toggle2FA(uid: string): boolean {
  const users = readUsers();
  const u = users.find(x => x.uid === uid);
  if (!u) return false;
  u.twoFactorEnabled = !u.twoFactorEnabled;
  writeUsers(users);
  const session = getCurrentSession();
  appendAudit({
    action: '2fa.toggle',
    actorUid: session?.uid ?? 'unknown',
    actorName: session?.name ?? 'unknown',
    actorRole: session?.role ?? 'admin',
    target: u.email,
    targetKind: 'admin_user',
    metadata: { enabled: u.twoFactorEnabled },
  });
  return u.twoFactorEnabled;
}

export function createAdminUser(input: {
  email: string;
  name: string;
  role: AdminRole;
  password: string;
  phone?: string;
}): { ok: boolean; error?: string; uid?: string } {
  ensureSeed();
  const users = readUsers();
  if (users.some(u => u.email.toLowerCase() === input.email.toLowerCase().trim())) {
    return { ok: false, error: 'Email already exists' };
  }
  const uid = `admin-${Date.now().toString(36)}`;
  const newU: StoredAdmin = {
    uid,
    email: input.email.trim(),
    name: input.name.trim(),
    role: input.role,
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    phone: input.phone,
    twoFactorEnabled: false,
    createdAt: Date.now(),
    isActive: true,
    passwordHash: hash(input.password),
  };
  users.push(newU);
  writeUsers(users);
  const session = getCurrentSession();
  appendAudit({
    action: 'user.create',
    actorUid: session?.uid ?? 'unknown',
    actorName: session?.name ?? 'unknown',
    actorRole: session?.role ?? 'admin',
    target: newU.email,
    targetKind: 'admin_user',
    metadata: { role: newU.role },
  });
  return { ok: true, uid };
}

export function setAdminActive(uid: string, active: boolean): void {
  const users = readUsers();
  const u = users.find(x => x.uid === uid);
  if (!u) return;
  u.isActive = active;
  writeUsers(users);
  const session = getCurrentSession();
  appendAudit({
    action: 'user.disable',
    actorUid: session?.uid ?? 'unknown',
    actorName: session?.name ?? 'unknown',
    actorRole: session?.role ?? 'admin',
    target: u.email,
    targetKind: 'admin_user',
    metadata: { disabled: !active },
  });
}
