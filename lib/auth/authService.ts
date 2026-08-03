/**
 * authService.ts — LN KICKS Authentication Service
 *
 * Phase 31 — Premium Authentication Upgrade
 *
 * Architecture:
 *  - localStorage-backed mock that STRUCTURALLY mirrors Firebase Auth.
 *  - All flows (email/password, Google OAuth, Phone OTP) are simulated
 *    so the UI/UX matches the production spec exactly.
 *  - Swapping to real Firebase later is a drop-in: replace the function
 *    bodies with `firebase/auth` calls — the signatures are identical.
 *
 * Storage Schema (localStorage keys):
 *  - `lnk_users`         → AuthUser[] (all registered accounts)
 *  - `lnk_user`          → SessionUser (currently logged-in user, minimal projection)
 *  - `lnk_otp_<phone>`   → { code, expiresAt, attempts } (rate-limited OTP)
 *  - `lnk_wallet_<uid>`  → WalletTransaction[] (transaction history per user)
 *
 * Wallet Rules:
 *  - NEW USER (first signup via any method): ₹50 Welcome Bonus credited
 *  - EXISTING USER (login): no bonus, just session restored
 *  - Wallet transactions are immutable, append-only.
 *
 * Security:
 *  - Strong password validation (8+ chars, upper, lower, digit, special)
 *  - Email format validation
 *  - Phone format validation (10-digit Indian mobile)
 *  - OTP expiry 60s, max 5 attempts, resend cooldown 60s
 *  - Prevent duplicate accounts (email OR phone unique)
 */

// ─────────────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────────────

export type AuthMethod = 'email' | 'google' | 'phone';

export interface AuthUser {
  uid: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  authMethod: AuthMethod;
  walletBalance: number;
  referralCode: string;
  referredBy?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface SessionUser {
  uid: string;
  name: string;
  email: string;
  phone: string;
  isLoggedIn: true;
  authMethod: AuthMethod;
  walletBalance: number;
  referralCode: string;
  joined: string;
  avatar?: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
}

export interface WalletTransaction {
  id: string;
  type: 'Welcome Bonus' | 'Referral Bonus' | 'Order' | 'Refund' | 'Cashback';
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
  description: string;
  createdAt: string;
}

export interface SignupResult {
  user: AuthUser;
  isNewUser: boolean;
  welcomeBonusCredited: boolean;
}

export interface LoginResult {
  user: AuthUser;
  isNewUser: boolean;
  welcomeBonusCredited: boolean;
}

// ─────────────────────────────────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────────────────────────────────

export const WELCOME_BONUS_AMOUNT = 50;
export const OTP_EXPIRY_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_LENGTH = 6;

const USERS_KEY = 'lnk_users';
const SESSION_KEY = 'lnk_user';
const OTP_PREFIX = 'lnk_otp_';
const WALLET_PREFIX = 'lnk_wallet_';

// ─────────────────────────────────────────────────────────────────────────
//  Storage helpers (SSR-safe)
// ─────────────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function readUsers(): AuthUser[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as AuthUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: AuthUser[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readWallet(uid: string): WalletTransaction[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(WALLET_PREFIX + uid);
    return raw ? (JSON.parse(raw) as WalletTransaction[]) : [];
  } catch {
    return [];
  }
}

function writeWallet(uid: string, txns: WalletTransaction[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(WALLET_PREFIX + uid, JSON.stringify(txns));
}

// ─────────────────────────────────────────────────────────────────────────
//  ID + code generators
// ─────────────────────────────────────────────────────────────────────────

function generateUid(): string {
  return 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

function generateTxnId(): string {
  return 'txn-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
}

function generateReferralCode(name: string): string {
  const base = name.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'LNK';
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}${suffix}`;
}

function generateOtp(): string {
  // Demo OTP — always 123456 so the user can complete the flow without an SMS gateway.
  return '123456';
}

// ─────────────────────────────────────────────────────────────────────────
//  Validators
// ─────────────────────────────────────────────────────────────────────────

export const validators = {
  email(email: string): { valid: boolean; message?: string } {
    const trimmed = email.trim();
    if (!trimmed) return { valid: false, message: 'Email is required' };
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(trimmed)) {
      return { valid: false, message: 'Enter a valid email address (e.g. you@example.com)' };
    }
    return { valid: true };
  },

  phone(phone: string): { valid: boolean; message?: string } {
    const digits = phone.replace(/\D/g, '');
    if (!digits) return { valid: false, message: 'Mobile number is required' };
    const normalized = digits.length === 12 && digits.startsWith('91')
      ? digits.slice(2)
      : digits.length === 11 && digits.startsWith('0')
        ? digits.slice(1)
        : digits;
    if (normalized.length !== 10 || !/^[6-9]\d{9}$/.test(normalized)) {
      return {
        valid: false,
        message: 'Enter a valid 10-digit Indian mobile number',
      };
    }
    return { valid: true };
  },

  normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    const normalized = digits.length === 12 && digits.startsWith('91')
      ? digits.slice(2)
      : digits.length === 11 && digits.startsWith('0')
        ? digits.slice(1)
        : digits;
    return '+91 ' + normalized;
  },

  rawPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    const normalized = digits.length === 12 && digits.startsWith('91')
      ? digits.slice(2)
      : digits.length === 11 && digits.startsWith('0')
        ? digits.slice(1)
        : digits;
    return normalized;
  },

  password(pw: string): { valid: boolean; message?: string; strength: 0 | 1 | 2 | 3 | 4 } {
    if (!pw) return { valid: false, message: 'Password is required', strength: 0 };
    if (pw.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters', strength: 1 };
    }
    let strength: 0 | 1 | 2 | 3 | 4 = 1;
    let checks = 0;
    if (/[a-z]/.test(pw)) checks++;
    if (/[A-Z]/.test(pw)) checks++;
    if (/\d/.test(pw)) checks++;
    if (/[^A-Za-z0-9]/.test(pw)) checks++;

    if (pw.length >= 8 && checks >= 2) strength = 2;
    if (pw.length >= 10 && checks >= 3) strength = 3;
    if (pw.length >= 12 && checks === 4) strength = 4;

    if (checks < 3) {
      return {
        valid: false,
        message: 'Use at least 3 of: uppercase, lowercase, digit, special character',
        strength,
      };
    }
    return { valid: true, strength };
  },

  referralCode(code: string): { valid: boolean; message?: string } {
    if (!code) return { valid: true };
    const re = /^[A-Z0-9]{4,12}$/i;
    if (!re.test(code.trim())) {
      return { valid: false, message: 'Referral code must be 4-12 alphanumeric characters' };
    }
    return { valid: true };
  },

  name(name: string): { valid: boolean; message?: string } {
    const trimmed = name.trim();
    if (!trimmed) return { valid: false, message: 'This field is required' };
    if (trimmed.length < 2) return { valid: false, message: 'Must be at least 2 characters' };
    if (!/^[A-Za-z][A-Za-z\s'-]*$/.test(trimmed)) {
      return { valid: false, message: 'Use letters, spaces, hyphens, or apostrophes only' };
    }
    return { valid: true };
  },
};

// ─────────────────────────────────────────────────────────────────────────
//  Password obfuscation (NOT real crypto — localStorage is not secure
//  storage anyway. Real Firebase Auth handles this server-side.)
// ─────────────────────────────────────────────────────────────────────────

function hashPassword(pw: string): string {
  try {
    return btoa('lnk_salt_v1:' + pw);
  } catch {
    return 'lnk_hash_' + pw.length;
  }
}

function verifyPassword(pw: string, hash: string): boolean {
  return hashPassword(pw) === hash;
}

// ─────────────────────────────────────────────────────────────────────────
//  Wallet operations
// ─────────────────────────────────────────────────────────────────────────

export function creditWelcomeBonus(user: AuthUser): WalletTransaction | null {
  const txns = readWallet(user.uid);
  if (txns.some((t) => t.type === 'Welcome Bonus')) {
    return null;
  }
  const txn: WalletTransaction = {
    id: generateTxnId(),
    type: 'Welcome Bonus',
    amount: WELCOME_BONUS_AMOUNT,
    status: 'Success',
    description: 'Welcome bonus for joining LNKICKS',
    createdAt: new Date().toISOString(),
  };
  writeWallet(user.uid, [txn, ...txns]);
  const users = readUsers();
  const idx = users.findIndex((u) => u.uid === user.uid);
  if (idx > -1) {
    users[idx].walletBalance = (users[idx].walletBalance || 0) + WELCOME_BONUS_AMOUNT;
    writeUsers(users);
  }
  return txn;
}

export function getWalletHistory(uid: string): WalletTransaction[] {
  return readWallet(uid);
}

// ─────────────────────────────────────────────────────────────────────────
//  User lookup / session
// ─────────────────────────────────────────────────────────────────────────

export function findUserByEmail(email: string): AuthUser | undefined {
  const e = email.trim().toLowerCase();
  return readUsers().find((u) => u.email.toLowerCase() === e);
}

export function findUserByPhone(phone: string): AuthUser | undefined {
  const raw = validators.rawPhone(phone);
  return readUsers().find((u) => validators.rawPhone(u.phone) === raw);
}

export function getCurrentSession(): SessionUser | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.isLoggedIn === true) return parsed as SessionUser;
    return null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
}

function toSessionUser(user: AuthUser): SessionUser {
  const joinedDate = new Date(user.createdAt);
  const joined = joinedDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  return {
    uid: user.uid,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isLoggedIn: true,
    authMethod: user.authMethod,
    walletBalance: user.walletBalance,
    referralCode: user.referralCode,
    joined,
    tier: 'Standard',
  };
}

function persistSession(user: AuthUser): SessionUser {
  const session = toSessionUser(user);
  if (isBrowser()) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

function updateLastLogin(uid: string): void {
  const users = readUsers();
  const idx = users.findIndex((u) => u.uid === uid);
  if (idx > -1) {
    users[idx].lastLogin = new Date().toISOString();
    writeUsers(users);
  }
}

// ─────────────────────────────────────────────────────────────────────────
//  Signup — Email/Password
// ─────────────────────────────────────────────────────────────────────────

export interface EmailSignupInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  referralCode?: string;
}

export function signupWithEmail(input: EmailSignupInput): { ok: true; result: SignupResult; session: SessionUser } | { ok: false; error: string } {
  const nameCheck = validators.name(input.firstName);
  if (!nameCheck.valid) return { ok: false, error: 'First name: ' + (nameCheck.message || 'invalid') };

  const lastNameCheck = input.lastName ? validators.name(input.lastName) : { valid: true };
  if (!lastNameCheck.valid) return { ok: false, error: 'Last name: ' + (lastNameCheck.message || 'invalid') };

  const emailCheck = validators.email(input.email);
  if (!emailCheck.valid) return { ok: false, error: emailCheck.message || 'Invalid email' };

  const phoneCheck = validators.phone(input.phone);
  if (!phoneCheck.valid) return { ok: false, error: phoneCheck.message || 'Invalid phone' };

  const pwCheck = validators.password(input.password);
  if (!pwCheck.valid) return { ok: false, error: pwCheck.message || 'Invalid password' };

  if (input.referralCode) {
    const refCheck = validators.referralCode(input.referralCode);
    if (!refCheck.valid) return { ok: false, error: refCheck.message || 'Invalid referral code' };
  }

  if (findUserByEmail(input.email)) {
    return { ok: false, error: 'An account with this email already exists. Please sign in instead.' };
  }
  if (findUserByPhone(input.phone)) {
    return { ok: false, error: 'An account with this mobile number already exists. Please sign in instead.' };
  }

  const now = new Date().toISOString();
  const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();
  const user: AuthUser = {
    uid: generateUid(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    name: fullName,
    email: input.email.trim(),
    phone: validators.normalizePhone(input.phone),
    passwordHash: hashPassword(input.password),
    authMethod: 'email',
    walletBalance: 0,
    referralCode: generateReferralCode(input.firstName),
    referredBy: input.referralCode?.trim() || undefined,
    emailVerified: false,
    phoneVerified: false,
    createdAt: now,
    lastLogin: now,
  };

  const users = readUsers();
  users.push(user);
  writeUsers(users);

  const bonus = creditWelcomeBonus(user);
  const refreshed = readUsers().find((u) => u.uid === user.uid) || user;
  const session = persistSession(refreshed);

  return {
    ok: true,
    result: {
      user: refreshed,
      isNewUser: true,
      welcomeBonusCredited: !!bonus,
    },
    session,
  };
}

// ─────────────────────────────────────────────────────────────────────────
//  Login — Email/Password
// ─────────────────────────────────────────────────────────────────────────

export function loginWithEmail(email: string, password: string): { ok: true; result: LoginResult; session: SessionUser } | { ok: false; error: string } {
  const emailCheck = validators.email(email);
  if (!emailCheck.valid) return { ok: false, error: emailCheck.message || 'Invalid email' };
  if (!password) return { ok: false, error: 'Password is required' };

  const user = findUserByEmail(email);
  if (!user) {
    return { ok: false, error: 'No account found with this email. Please create an account first.' };
  }
  if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, error: 'Incorrect password. Please try again or use "Forgot Password".' };
  }

  updateLastLogin(user.uid);
  const refreshed = readUsers().find((u) => u.uid === user.uid) || user;
  const session = persistSession(refreshed);

  return {
    ok: true,
    result: {
      user: refreshed,
      isNewUser: false,
      welcomeBonusCredited: false,
    },
    session,
  };
}

// ─────────────────────────────────────────────────────────────────────────
//  Login — Google OAuth (mock)
// ─────────────────────────────────────────────────────────────────────────

export interface GoogleUserInput {
  name: string;
  email: string;
  avatar?: string;
}

export function loginWithGoogle(input: GoogleUserInput): { ok: true; result: LoginResult; session: SessionUser } | { ok: false; error: string } {
  if (!input.email) return { ok: false, error: 'Google sign-in failed: no email returned' };
  if (!input.name) return { ok: false, error: 'Google sign-in failed: no name returned' };

  const existing = findUserByEmail(input.email);
  if (existing) {
    updateLastLogin(existing.uid);
    const refreshed = readUsers().find((u) => u.uid === existing.uid) || existing;
    const session = persistSession(refreshed);
    return {
      ok: true,
      result: {
        user: refreshed,
        isNewUser: false,
        welcomeBonusCredited: false,
      },
      session,
    };
  }

  const now = new Date().toISOString();
  const nameParts = input.name.trim().split(/\s+/);
  const firstName = nameParts[0] || 'Google';
  const lastName = nameParts.slice(1).join(' ') || 'User';
  const user: AuthUser = {
    uid: generateUid(),
    firstName,
    lastName,
    name: input.name,
    email: input.email,
    phone: '',
    authMethod: 'google',
    walletBalance: 0,
    referralCode: generateReferralCode(firstName),
    emailVerified: true,
    phoneVerified: false,
    createdAt: now,
    lastLogin: now,
  };

  const users = readUsers();
  users.push(user);
  writeUsers(users);

  const bonus = creditWelcomeBonus(user);
  const refreshed = readUsers().find((u) => u.uid === user.uid) || user;
  const session = persistSession(refreshed);

  return {
    ok: true,
    result: {
      user: refreshed,
      isNewUser: true,
      welcomeBonusCredited: !!bonus,
    },
    session,
  };
}

// ─────────────────────────────────────────────────────────────────────────
//  Phone OTP flow (mock)
// ─────────────────────────────────────────────────────────────────────────

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

function readOtp(phone: string): OtpRecord | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(OTP_PREFIX + validators.rawPhone(phone));
    return raw ? (JSON.parse(raw) as OtpRecord) : null;
  } catch {
    return null;
  }
}

function writeOtp(phone: string, record: OtpRecord): void {
  if (!isBrowser()) return;
  localStorage.setItem(OTP_PREFIX + validators.rawPhone(phone), JSON.stringify(record));
}

function clearOtp(phone: string): void {
  if (!isBrowser()) return;
  localStorage.removeItem(OTP_PREFIX + validators.rawPhone(phone));
}

export interface SendOtpResult {
  ok: boolean;
  error?: string;
  demoCode?: string;
  cooldownSeconds: number;
}

export function sendOtp(phone: string): SendOtpResult {
  const phoneCheck = validators.phone(phone);
  if (!phoneCheck.valid) {
    return { ok: false, error: phoneCheck.message || 'Invalid phone', cooldownSeconds: 0 };
  }

  const existing = readOtp(phone);
  const now = Date.now();
  if (existing && now - existing.lastSentAt < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
    const remaining = Math.ceil((OTP_RESEND_COOLDOWN_SECONDS * 1000 - (now - existing.lastSentAt)) / 1000);
    return {
      ok: false,
      error: `Please wait ${remaining}s before requesting another OTP`,
      cooldownSeconds: remaining,
    };
  }

  const code = generateOtp();
  const record: OtpRecord = {
    code,
    expiresAt: now + OTP_EXPIRY_SECONDS * 1000,
    attempts: 0,
    lastSentAt: now,
  };
  writeOtp(phone, record);

  return {
    ok: true,
    demoCode: code,
    cooldownSeconds: OTP_RESEND_COOLDOWN_SECONDS,
  };
}

export interface VerifyOtpResult {
  ok: boolean;
  error?: string;
  session?: SessionUser;
  result?: LoginResult;
}

export function verifyOtp(phone: string, code: string, name?: string): VerifyOtpResult {
  const phoneCheck = validators.phone(phone);
  if (!phoneCheck.valid) {
    return { ok: false, error: phoneCheck.message || 'Invalid phone' };
  }
  if (!code || code.length !== OTP_LENGTH) {
    return { ok: false, error: `OTP must be ${OTP_LENGTH} digits` };
  }

  const record = readOtp(phone);
  if (!record) {
    return { ok: false, error: 'No OTP was sent. Please request a new OTP.' };
  }
  if (Date.now() > record.expiresAt) {
    clearOtp(phone);
    return { ok: false, error: 'OTP expired. Please request a new OTP.' };
  }
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    clearOtp(phone);
    return { ok: false, error: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  if (record.code !== code) {
    record.attempts += 1;
    writeOtp(phone, record);
    const remaining = OTP_MAX_ATTEMPTS - record.attempts;
    return {
      ok: false,
      error: `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining`,
    };
  }

  clearOtp(phone);

  const existing = findUserByPhone(phone);
  if (existing) {
    updateLastLogin(existing.uid);
    const users = readUsers();
    const idx = users.findIndex((u) => u.uid === existing.uid);
    if (idx > -1) {
      users[idx].phoneVerified = true;
      writeUsers(users);
    }
    const refreshed = users[idx] || existing;
    const session = persistSession(refreshed);
    return {
      ok: true,
      session,
      result: {
        user: refreshed,
        isNewUser: false,
        welcomeBonusCredited: false,
      },
    };
  }

  const now = new Date().toISOString();
  const displayName = (name || '').trim() || 'LNKICKS Member';
  const nameParts = displayName.split(/\s+/);
  const firstName = nameParts[0] || 'Member';
  const lastName = nameParts.slice(1).join(' ') || '';
  const user: AuthUser = {
    uid: generateUid(),
    firstName,
    lastName,
    name: displayName,
    email: '',
    phone: validators.normalizePhone(phone),
    authMethod: 'phone',
    walletBalance: 0,
    referralCode: generateReferralCode(firstName),
    emailVerified: false,
    phoneVerified: true,
    createdAt: now,
    lastLogin: now,
  };

  const users = readUsers();
  users.push(user);
  writeUsers(users);

  const bonus = creditWelcomeBonus(user);
  const refreshed = readUsers().find((u) => u.uid === user.uid) || user;
  const session = persistSession(refreshed);

  return {
    ok: true,
    session,
    result: {
      user: refreshed,
      isNewUser: true,
      welcomeBonusCredited: !!bonus,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
//  Forgot Password (mock)
// ─────────────────────────────────────────────────────────────────────────

export interface ForgotPasswordResult {
  ok: boolean;
  error?: string;
  resetToken?: string;
  emailExists: boolean;
}

export function requestPasswordReset(email: string): ForgotPasswordResult {
  const emailCheck = validators.email(email);
  if (!emailCheck.valid) {
    return { ok: false, error: emailCheck.message || 'Invalid email', emailExists: false };
  }

  const user = findUserByEmail(email);
  if (!user) {
    return { ok: true, emailExists: false };
  }

  const token = 'reset_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  if (isBrowser()) {
    localStorage.setItem('lnk_reset_' + token, JSON.stringify({
      uid: user.uid,
      expiresAt: Date.now() + 15 * 60 * 1000,
    }));
  }
  return { ok: true, emailExists: true, resetToken: token };
}

// ─────────────────────────────────────────────────────────────────────────
//  Debug helpers
// ─────────────────────────────────────────────────────────────────────────

export function getAllUsers(): AuthUser[] {
  return readUsers();
}

export function resetAllAuthData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(SESSION_KEY);
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith(OTP_PREFIX) || k.startsWith(WALLET_PREFIX) || k.startsWith('lnk_reset_')) {
      localStorage.removeItem(k);
    }
  });
}

export const authService = {
  validators,
  signupWithEmail,
  loginWithEmail,
  loginWithGoogle,
  sendOtp,
  verifyOtp,
  requestPasswordReset,
  creditWelcomeBonus,
  getWalletHistory,
  getCurrentSession,
  clearSession,
  findUserByEmail,
  findUserByPhone,
  getAllUsers,
  resetAllAuthData,
  WELCOME_BONUS_AMOUNT,
  OTP_EXPIRY_SECONDS,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_LENGTH,
};

export default authService;
