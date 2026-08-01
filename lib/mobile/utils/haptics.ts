/**
 * haptics.ts — Haptic Feedback Helper for LN KICKS Mobile.
 *
 * Wraps navigator.vibrate with graceful degradation. Apple-quality
 * micro-interactions trigger haptics on press / select / success / error.
 *
 * On iOS Safari, navigator.vibrate is NOT supported — this is a no-op.
 * On Android Chrome, it triggers actual device vibration.
 *
 * Usage:
 *   import { haptic } from '@/lib/mobile/utils/haptics';
 *   haptic.light();   // 8ms tap
 *   haptic.medium();  // 18ms tap (button press)
 *   haptic.heavy();   // 28ms (long press / drawer open)
 *   haptic.success(); // success pattern
 *   haptic.error();   // error pattern
 */

type VibPattern = number | number[];

const VIBRATE: ((pattern: VibPattern) => void) | null =
  typeof window !== 'undefined' && 'vibrate' in navigator
    ? (pattern: VibPattern) => {
        try {
          navigator.vibrate(pattern);
        } catch {
          // Silently fail — haptics are non-critical
        }
      }
    : null;

export const haptic = {
  /** Light tap — for hover-like micro feedback */
  light: () => VIBRATE?.(8),
  /** Medium tap — for button press, toggle */
  medium: () => VIBRATE?.(18),
  /** Heavy tap — for long press, drawer open */
  heavy: () => VIBRATE?.(28),
  /** Selection tick — for segmented control / chip select */
  selection: () => VIBRATE?.(10),
  /** Success pattern — two rising taps */
  success: () => VIBRATE?.([10, 40, 20]),
  /** Error pattern — double buzz */
  error: () => VIBRATE?.([20, 60, 20]),
  /** Cancel any ongoing vibration */
  cancel: () => VIBRATE?.(0),
};

export default haptic;
