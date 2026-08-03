/**
 * LNKICKS Enterprise Admin — Theme System
 * ------------------------------------------------------------
 * Premium dark/light tokens inspired by Linear / Vercel / Stripe.
 * - Light mode: cool whites, subtle blue-grey neutrals
 * - Dark mode: deep charcoal, never pure black (reduces eye strain)
 * - Persisted choice in localStorage, falls back to system preference
 * - Listens to `prefers-color-scheme` when mode === 'system'
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { AdminThemeMode, AdminThemeTokens } from './types';

const LS_KEY = 'lnk_admin_theme';

const LIGHT: AdminThemeTokens = {
  mode: 'light',
  bg: {
    app: '#F8F9FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F3F5',
    sidebar: '#FFFFFF',
    topbar: '#FFFFFF',
    hover: '#F1F3F5',
    overlay: 'rgba(15, 23, 42, 0.55)',
  },
  text: {
    primary: '#0A0A0A',
    secondary: '#475569',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
    accent: '#0A0A0A',
  },
  border: {
    subtle: '#E5E7EB',
    strong: '#CBD5E1',
    focus: '#0A0A0A',
  },
  status: {
    success: '#15803D',
    successBg: '#DCFCE7',
    warning: '#B45309',
    warningBg: '#FEF3C7',
    error: '#B91C1C',
    errorBg: '#FEE2E2',
    info: '#1D4ED8',
    infoBg: '#DBEAFE',
  },
  chart: {
    grid: '#E5E7EB',
    axis: '#94A3B8',
    series: ['#0A0A0A', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
  },
  shadow: {
    sm: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
    md: '0 4px 8px -2px rgba(15,23,42,0.06), 0 2px 4px -2px rgba(15,23,42,0.04)',
    lg: '0 12px 24px -6px rgba(15,23,42,0.10), 0 4px 8px -4px rgba(15,23,42,0.06)',
  },
};

const DARK: AdminThemeTokens = {
  mode: 'dark',
  bg: {
    app: '#0B0F14',
    surface: '#131820',
    surfaceAlt: '#1A2029',
    sidebar: '#0F141B',
    topbar: '#131820',
    hover: '#1A2029',
    overlay: 'rgba(0, 0, 0, 0.70)',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    tertiary: '#64748B',
    inverse: '#0A0A0A',
    accent: '#F1F5F9',
  },
  border: {
    subtle: '#1F2937',
    strong: '#334155',
    focus: '#F1F5F9',
  },
  status: {
    success: '#4ADE80',
    successBg: 'rgba(34, 197, 94, 0.12)',
    warning: '#FBBF24',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    error: '#F87171',
    errorBg: 'rgba(239, 68, 68, 0.12)',
    info: '#60A5FA',
    infoBg: 'rgba(59, 130, 246, 0.12)',
  },
  chart: {
    grid: '#1F2937',
    axis: '#475569',
    series: ['#F1F5F9', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F472B6'],
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.40)',
    md: '0 4px 8px -2px rgba(0,0,0,0.50)',
    lg: '0 12px 24px -6px rgba(0,0,0,0.60)',
  },
};

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveMode(mode: AdminThemeMode): 'light' | 'dark' {
  if (mode === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return mode;
}

export function getStoredThemeMode(): AdminThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const raw = localStorage.getItem(LS_KEY) as AdminThemeMode | null;
    return raw ?? 'system';
  } catch {
    return 'system';
  }
}

export function getThemeTokens(mode: 'light' | 'dark'): AdminThemeTokens {
  return mode === 'dark' ? DARK : LIGHT;
}

/**
 * React hook — subscribes to theme changes, listens to system
 * preference changes when in 'system' mode, and persists choice.
 */
export function useAdminTheme(): {
  mode: AdminThemeMode;
  resolvedMode: 'light' | 'dark';
  tokens: AdminThemeTokens;
  setMode: (m: AdminThemeMode) => void;
  toggle: () => void;
} {
  const [mode, setModeState] = useState<AdminThemeMode>('system');
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');

  // hydrate from localStorage
  useEffect(() => {
    setModeState(getStoredThemeMode());
  }, []);

  // resolve + listen to system changes
  useEffect(() => {
    const apply = () => {
      const m = resolveMode(mode);
      setResolvedMode(m);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-admin-theme', m);
      }
    };
    apply();
    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [mode]);

  const setMode = useCallback((m: AdminThemeMode) => {
    setModeState(m);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_KEY, m);
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(resolvedMode === 'dark' ? 'light' : 'dark');
  }, [resolvedMode, setMode]);

  return {
    mode,
    resolvedMode,
    tokens: getThemeTokens(resolvedMode),
    setMode,
    toggle,
  };
}
