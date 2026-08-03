/**
 * LNKICKS Enterprise Admin — Form System Extensions
 * ------------------------------------------------------------
 * ADDITIVE only. The original `Input`, `Textarea`, `Select`,
 * `Checkbox`, `Toggle`, `SearchInput`, `NumberInput`, `Radio`,
 * `Tag`, `FileUpload` in `ui.tsx` remain canonical.
 *
 * This file adds the missing typed inputs and form scaffolding:
 *
 *   - EmailInput       (type=email + validation hint)
 *   - PhoneInput       (country code + tel input)
 *   - PasswordInput    (show/hide toggle)
 *   - CurrencyInput    (₹ prefix + formatted display)
 *   - DateInput        (native date + clear button)
 *   - TimeInput        (native time)
 *   - Switch           (large iOS/Material 3 switch)
 *   - Autocomplete     (combobox with typeahead + keyboard nav)
 *   - CharacterCounter (live count vs max)
 *   - FormField        (label + control + hint + error wrapper)
 *   - FormRow          (horizontal grid for fields)
 *   - FormSection      (visually grouped form region)
 *   - ValidationMessage (inline error/success/warning)
 *
 * Every input follows the same:
 *   height (38px), radius (8px), border (1px subtle),
 *   focus ring (3px halo at primary color + 12% opacity),
 *   transition (140ms ease).
 */

'use client';

import {
  useState, useRef, useEffect, useId, type ReactNode, type CSSProperties,
  type InputHTMLAttributes, type ChangeEvent,
} from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';
import { dt } from '@/lib/admin/designTokens';
import { Icon } from '@/components/admin/icons/Icon';

type Tk = AdminThemeTokens;

/* ─── Shared base ────────────────────────────────────────────── */

function baseInput(tokens: Tk): CSSProperties {
  return {
    width: '100%', height: 38, padding: '0 12px',
    borderRadius: dt.radius.md,
    border: `1px solid ${tokens.border.subtle}`,
    background: tokens.bg.surface, color: tokens.text.primary,
    fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif',
    outline: 'none', boxSizing: 'border-box',
    transition: `border-color ${dt.motion.duration.quick}ms ease, box-shadow ${dt.motion.duration.quick}ms ease`,
  };
}

function applyFocus(tokens: Tk, error?: boolean) {
  return (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = error ? tokens.status.error : tokens.border.focus;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${(error ? tokens.status.error : tokens.border.focus)}26`;
  };
}
function applyBlur(tokens: Tk, error?: boolean) {
  return (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = error ? tokens.status.error : tokens.border.subtle;
    e.currentTarget.style.boxShadow = 'none';
  };
}

/* =========================================================== */
/* FormField — universal wrapper                               */
/* =========================================================== */
/**
 * Wraps any control with a label, hint, error, character counter,
 * and consistent vertical rhythm. All inputs in the admin suite
 * should be wrapped in FormField for unified label/error UX.
 */
export function FormField({
  tokens, label, hint, error, required, counter, counterMax,
  children, style, htmlFor, id,
}: {
  tokens: Tk; label?: ReactNode; hint?: ReactNode; error?: ReactNode;
  required?: boolean; counter?: number; counterMax?: number;
  children: ReactNode; style?: CSSProperties; htmlFor?: string; id?: string;
}) {
  return (
    <div id={id} style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }}>
      {(label || counter !== undefined) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {label && (
            <label
              htmlFor={htmlFor}
              style={{
                fontSize: 11, fontWeight: 600, color: tokens.text.secondary,
                fontFamily: 'Inter, sans-serif', letterSpacing: 0.2,
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}
            >
              {label}
              {required && <span style={{ color: tokens.status.error, fontWeight: 700 }}>*</span>}
            </label>
          )}
          {counter !== undefined && counterMax !== undefined && (
            <CharacterCounter tokens={tokens} value={counter} max={counterMax} />
          )}
        </div>
      )}
      {children}
      {error && <ValidationMessage tokens={tokens} tone="error">{error}</ValidationMessage>}
      {hint && !error && <ValidationMessage tokens={tokens} tone="hint">{hint}</ValidationMessage>}
    </div>
  );
}

/* =========================================================== */
/* FormRow / FormSection — layout                              */
/* =========================================================== */
export function FormRow({
  cols = 2, gap = 16, children, style,
}: {
  cols?: 1 | 2 | 3 | 4; gap?: number; children: ReactNode; style?: CSSProperties;
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap, ...style,
    }}>
      {children}
    </div>
  );
}

export function FormSection({
  tokens, title, description, children, action, gap = 16, style,
}: {
  tokens: Tk; title?: ReactNode; description?: ReactNode;
  children: ReactNode; action?: ReactNode; gap?: number; style?: CSSProperties;
}) {
  return (
    <section style={{
      background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: dt.radius.lg, overflow: 'hidden',
      ...style,
    }}>
      {(title || description || action) && (
        <div style={{
          padding: '14px 18px', borderBottom: `1px solid ${tokens.border.subtle}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
        }}>
          <div>
            {title && (
              <h3 style={{
                margin: 0, fontSize: 13, fontWeight: 700, color: tokens.text.primary,
                fontFamily: 'Inter, sans-serif',
              }}>{title}</h3>
            )}
            {description && (
              <p style={{
                margin: '3px 0 0 0', fontSize: 11, color: tokens.text.secondary,
                fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
              }}>{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap }}>
        {children}
      </div>
    </section>
  );
}

/* =========================================================== */
/* ValidationMessage — inline feedback                         */
/* =========================================================== */
export function ValidationMessage({
  tokens, tone = 'hint', children, icon = true,
}: {
  tokens: Tk; tone?: 'error' | 'success' | 'warning' | 'hint';
  children: ReactNode; icon?: boolean;
}) {
  const color = tone === 'error' ? tokens.status.error
    : tone === 'success' ? tokens.status.success
    : tone === 'warning' ? tokens.status.warning
    : tokens.text.tertiary;
  const iconName: 'xCircle' | 'checkCircle' | 'alertTriangle' | 'info' = tone === 'error' ? 'xCircle'
    : tone === 'success' ? 'checkCircle'
    : tone === 'warning' ? 'alertTriangle'
    : 'info';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontFamily: 'Inter, sans-serif', fontWeight: 500, color,
      marginTop: 2,
    }}>
      {icon && <Icon name={iconName} size={11} color={color} />}
      {children}
    </div>
  );
}

/* =========================================================== */
/* CharacterCounter                                            */
/* =========================================================== */
export function CharacterCounter({
  tokens, value, max, warnAt = 0.85,
}: {
  tokens: Tk; value: number; max: number; warnAt?: number;
}) {
  const ratio = value / max;
  const color = ratio >= 1 ? tokens.status.error
    : ratio >= warnAt ? tokens.status.warning
    : tokens.text.tertiary;
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, fontFamily: 'Inter, sans-serif',
      color, fontVariantNumeric: 'tabular-nums', letterSpacing: 0.2,
    }}>
      {value}/{max}
    </span>
  );
}

/* =========================================================== */
/* EmailInput                                                  */
/* =========================================================== */
export function EmailInput({
  tokens, value, onChange, placeholder = 'name@example.com', error, disabled,
  style, ...rest
}: {
  tokens: Tk; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; disabled?: boolean; style?: CSSProperties;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>) {
  const id = useId();
  const valid = value.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: tokens.text.tertiary, pointerEvents: 'none', display: 'inline-flex',
      }}>
        <Icon name="mail" size={14} color={tokens.text.tertiary} />
      </span>
      <input
        id={id}
        type="email"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="email"
        inputMode="email"
        style={{
          ...baseInput(tokens),
          paddingLeft: 34,
          paddingRight: valid ? 36 : 12,
          borderColor: error ? tokens.status.error : valid ? tokens.status.success : tokens.border.subtle,
          opacity: disabled ? 0.55 : 1,
          ...style,
        }}
        onFocus={applyFocus(tokens, !!error)}
        onBlur={applyBlur(tokens, !!error)}
        {...rest}
      />
      {valid && (
        <span style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          color: tokens.status.success, display: 'inline-flex', pointerEvents: 'none',
        }}>
          <Icon name="checkCircle" size={14} color={tokens.status.success} />
        </span>
      )}
    </div>
  );
}

/* =========================================================== */
/* PhoneInput                                                  */
/* =========================================================== */
export function PhoneInput({
  tokens, value, onChange, countryCode = '+91', onCountryChange,
  placeholder = '98765 43210', error, disabled, style, ...rest
}: {
  tokens: Tk; value: string; onChange: (v: string) => void;
  countryCode?: string; onCountryChange?: (code: string) => void;
  placeholder?: string; error?: string; disabled?: boolean; style?: CSSProperties;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'stretch',
      borderRadius: dt.radius.md, overflow: 'hidden',
      border: `1px solid ${error ? tokens.status.error : tokens.border.subtle}`,
      transition: `border-color ${dt.motion.duration.quick}ms ease, box-shadow ${dt.motion.duration.quick}ms ease`,
      opacity: disabled ? 0.55 : 1,
      ...style,
    }}>
      <select
        value={countryCode}
        onChange={(e) => onCountryChange?.(e.target.value)}
        disabled={disabled}
        aria-label="Country code"
        style={{
          appearance: 'none', border: 'none',
          background: tokens.bg.surfaceAlt, color: tokens.text.secondary,
          padding: '0 28px 0 10px', fontSize: 12, fontWeight: 600,
          fontFamily: 'Inter, sans-serif', cursor: 'pointer',
          borderRight: `1px solid ${tokens.border.subtle}`,
          outline: 'none',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
        }}
      >
        {['+91', '+1', '+44', '+971', '+65', '+61'].map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        inputMode="tel"
        autoComplete="tel-national"
        style={{
          ...baseInput(tokens),
          border: 'none', borderRadius: 0,
          paddingLeft: 12,
        }}
        onFocus={applyFocus(tokens, !!error)}
        onBlur={applyBlur(tokens, !!error)}
        {...rest}
      />
    </div>
  );
}

/* =========================================================== */
/* PasswordInput                                               */
/* =========================================================== */
export function PasswordInput({
  tokens, value, onChange, placeholder = '••••••••', error, disabled,
  showStrength = false, style, ...rest
}: {
  tokens: Tk; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; disabled?: boolean;
  showStrength?: boolean; style?: CSSProperties;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>) {
  const [show, setShow] = useState(false);
  const strength = computeStrength(value);
  const strengthColor = strength >= 4 ? tokens.status.success
    : strength === 3 ? tokens.status.warning
    : strength >= 1 ? tokens.status.error
    : tokens.text.tertiary;
  const strengthLabel = strength >= 4 ? 'Strong' : strength === 3 ? 'Fair' : strength >= 1 ? 'Weak' : '';
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="current-password"
          style={{
            ...baseInput(tokens),
            paddingRight: 38,
            borderColor: error ? tokens.status.error : tokens.border.subtle,
            opacity: disabled ? 0.55 : 1,
            ...style,
          }}
          onFocus={applyFocus(tokens, !!error)}
          onBlur={applyBlur(tokens, !!error)}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          disabled={disabled}
          style={{
            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
            width: 28, height: 28, borderRadius: dt.radius.sm,
            border: 'none', background: 'transparent',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: tokens.text.tertiary,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            transition: `color ${dt.motion.duration.quick}ms ease, background ${dt.motion.duration.quick}ms ease`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; e.currentTarget.style.color = tokens.text.secondary; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = tokens.text.tertiary; }}
        >
          <Icon name={show ? 'eyeOff' : 'eye'} size={14} color="currentColor" />
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= strength ? strengthColor : tokens.bg.surfaceAlt,
                transition: `background ${dt.motion.duration.base}ms ease`,
              }} />
            ))}
          </div>
          {strengthLabel && (
            <span style={{ fontSize: 10, fontWeight: 600, color: strengthColor, fontFamily: 'Inter, sans-serif' }}>
              {strengthLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function computeStrength(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

/* =========================================================== */
/* CurrencyInput                                               */
/* =========================================================== */
export function CurrencyInput({
  tokens, value, onChange, currency = '₹', locale = 'en-IN',
  placeholder = '0', error, disabled, min = 0, style, ...rest
}: {
  tokens: Tk; value: number; onChange: (v: number) => void;
  currency?: string; locale?: string; placeholder?: string;
  error?: string; disabled?: boolean; min?: number; style?: CSSProperties;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>) {
  const [text, setText] = useState<string>(
    value > 0 ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value) : ''
  );
  useEffect(() => {
    const formatted = value > 0 ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value) : '';
    if (formatted !== text) setText(formatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, locale]);

  function handle(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d.]/g, '');
    const num = raw === '' ? 0 : Number(raw);
    if (Number.isNaN(num)) return;
    if (min !== undefined && num < min) return;
    const formatted = num > 0 ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(num) : '';
    setText(formatted);
    onChange(num);
  }

  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: tokens.text.secondary, pointerEvents: 'none',
        fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif',
      }}>{currency}</span>
      <input
        type="text"
        value={text}
        onChange={handle}
        placeholder={placeholder}
        disabled={disabled}
        inputMode="decimal"
        style={{
          ...baseInput(tokens),
          paddingLeft: 28,
          borderColor: error ? tokens.status.error : tokens.border.subtle,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          opacity: disabled ? 0.55 : 1,
          ...style,
        }}
        onFocus={applyFocus(tokens, !!error)}
        onBlur={applyBlur(tokens, !!error)}
        {...rest}
      />
    </div>
  );
}

/* =========================================================== */
/* DateInput                                                   */
/* =========================================================== */
export function DateInput({
  tokens, value, onChange, placeholder = 'Select date', error, disabled,
  min, max, clearable = true, style, ...rest
}: {
  tokens: Tk; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; disabled?: boolean;
  min?: string; max?: string; clearable?: boolean; style?: CSSProperties;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        style={{
          ...baseInput(tokens),
          paddingRight: clearable && value ? 38 : 12,
          borderColor: error ? tokens.status.error : tokens.border.subtle,
          opacity: disabled ? 0.55 : 1,
          color: value ? tokens.text.primary : tokens.text.tertiary,
          ...style,
        }}
        onFocus={applyFocus(tokens, !!error)}
        onBlur={applyBlur(tokens, !!error)}
        {...rest}
      />
      {clearable && value && !disabled && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear date"
          style={{
            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
            width: 22, height: 22, borderRadius: dt.radius.sm,
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: tokens.text.tertiary,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="x" size={11} color="currentColor" />
        </button>
      )}
    </div>
  );
}

/* =========================================================== */
/* TimeInput                                                   */
/* =========================================================== */
export function TimeInput({
  tokens, value, onChange, placeholder = 'Select time', error, disabled,
  style, ...rest
}: {
  tokens: Tk; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; disabled?: boolean; style?: CSSProperties;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        ...baseInput(tokens),
        borderColor: error ? tokens.status.error : tokens.border.subtle,
        opacity: disabled ? 0.55 : 1,
        color: value ? tokens.text.primary : tokens.text.tertiary,
        ...style,
      }}
      onFocus={applyFocus(tokens, !!error)}
      onBlur={applyBlur(tokens, !!error)}
      {...rest}
    />
  );
}

/* =========================================================== */
/* Switch — larger toggle (alternative to Toggle)              */
/* =========================================================== */
export function Switch({
  tokens, checked, onChange, label, description, size = 'md', disabled,
}: {
  tokens: Tk; checked: boolean; onChange: (v: boolean) => void;
  label?: ReactNode; description?: ReactNode;
  size?: 'sm' | 'md' | 'lg'; disabled?: boolean;
}) {
  const dim = size === 'sm' ? { w: 30, h: 18, knob: 14, travel: 12 }
    : size === 'lg' ? { w: 48, h: 28, knob: 22, travel: 20 }
    : { w: 38, h: 22, knob: 18, travel: 16 };
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none',
      opacity: disabled ? 0.55 : 1,
    }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{
          width: dim.w, height: dim.h, borderRadius: dim.h / 2,
          background: checked ? tokens.status.success : tokens.bg.surfaceAlt,
          border: `1px solid ${checked ? tokens.status.success : tokens.border.strong}`,
          cursor: disabled ? 'not-allowed' : 'pointer', position: 'relative',
          padding: 0, flexShrink: 0,
          transition: `background ${dt.motion.duration.base}ms ${dt.motion.easing.standard}, border-color ${dt.motion.duration.base}ms ${dt.motion.easing.standard}`,
        }}
      >
        <span style={{
          position: 'absolute', top: '50%',
          left: checked ? dim.travel : 2,
          transform: 'translateY(-50%)',
          width: dim.knob, height: dim.knob, borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          transition: `left ${dt.motion.duration.base}ms ${dt.motion.easing.standard}`,
        }} />
      </button>
      {(label || description) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {label && (
            <span style={{ fontSize: 13, fontWeight: 500, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
              {label}
            </span>
          )}
          {description && (
            <span style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}

/* =========================================================== */
/* Autocomplete — typeahead combobox                           */
/* =========================================================== */
export function Autocomplete<T extends string>({
  tokens, value, onChange, options, placeholder = 'Search…',
  error, disabled, style, renderOption, maxResults = 8,
}: {
  tokens: Tk; value: string; onChange: (v: string) => void;
  options: { value: T; label: string }[];
  placeholder?: string; error?: string; disabled?: boolean;
  style?: CSSProperties; renderOption?: (o: { value: T; label: string }) => ReactNode;
  maxResults?: number;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = value
    ? options.filter(o => o.label.toLowerCase().includes(value.toLowerCase())).slice(0, maxResults)
    : options.slice(0, maxResults);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  useEffect(() => { setHighlight(0); }, [value]);

  function pick(o: { value: T; label: string }) {
    onChange(o.label);
    setOpen(false);
    inputRef.current?.blur();
  }

  const listboxId = useId();

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={(e) => { setOpen(true); applyFocus(tokens, !!error)(e); }}
        onBlur={applyBlur(tokens, !!error)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={open && filtered[highlight] ? `${listboxId}-opt-${highlight}` : undefined}
        style={{
          ...baseInput(tokens),
          borderColor: error ? tokens.status.error : tokens.border.subtle,
          opacity: disabled ? 0.55 : 1,
        }}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, filtered.length - 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
          else if (e.key === 'Enter' && filtered[highlight]) { e.preventDefault(); pick(filtered[highlight]); }
          else if (e.key === 'Escape') { setOpen(false); }
        }}
      />
      {open && filtered.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: tokens.bg.surface,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: dt.radius.md, boxShadow: tokens.shadow.lg,
            padding: 4, zIndex: dt.zIndex.dropdown, maxHeight: 280, overflowY: 'auto',
            animation: `${dt.keyframes.popIn} 140ms ${dt.motion.easing.standard}`,
          }}
        >
          {filtered.map((o, i) => (
            <button
              key={o.value}
              id={`${listboxId}-opt-${i}`}
              role="option"
              aria-selected={i === highlight}
              onClick={() => pick(o)}
              onMouseEnter={() => setHighlight(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 10px',
                borderRadius: dt.radius.sm, border: 'none',
                background: i === highlight ? tokens.bg.hover : 'transparent',
                color: tokens.text.primary, cursor: 'pointer',
                fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 500,
                textAlign: 'left', transition: `background ${dt.motion.duration.quick}ms ease`,
              }}
            >
              {renderOption ? renderOption(o) : o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
