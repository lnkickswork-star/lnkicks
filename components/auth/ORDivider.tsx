/**
 * ORDivider.tsx — "─────── OR ───────" horizontal divider.
 *
 * Used between Email login and Social login (Google / Phone OTP)
 * to match Google's standard auth page pattern.
 */

import { theme } from '@/lib/mobile/theme/theme';

export function ORDivider({ label = 'OR' }: { label?: string }) {
  return (
    <div
      role="separator"
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        margin: `${theme.spacing.xxl}px 0`,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(to right, transparent, ${theme.colors.grey300})`,
        }}
      />
      <span
        style={{
          fontSize: theme.fontSize.caption,
          fontWeight: theme.fontWeight.bold,
          color: theme.colors.textTertiary,
          letterSpacing: theme.letterSpacing.wider,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(to left, transparent, ${theme.colors.grey300})`,
        }}
      />
    </div>
  );
}

export default ORDivider;
