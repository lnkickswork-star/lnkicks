/**
 * interactions.ts — Reusable interaction utilities for LN KICKS Mobile.
 *
 * Centralizes button-press handlers, focus ring styles, and pressed state
 * classes so every interactive surface feels identical.
 *
 * Usage:
 *   import { focusRing, pressedState } from '@/lib/mobile/utils/interactions';
 *   <button style={{ ...focusRing }}>...</button>
 *   <button className="pressable" data-pressed={false}>...</button>
 *
 * Or use the `usePressed` hook for controlled pressed state:
 *   const { pressed, bind } = usePressed();
 *   <button {...bind}>...</button>
 */

import { useState, useCallback } from 'react';
import { colors } from '@/lib/mobile/theme/colors';
import { transitions } from '@/lib/mobile/theme/motion';
import { haptic } from './haptics';

/**
 * Focus ring style — applied to all interactive elements for keyboard
 * accessibility. Visible only on :focus-visible (mouse clicks don't show it).
 */
export const focusRing = {
  outline: 'none',
  // We use boxShadow so the ring doesn't shift layout
  // The actual :focus-visible ring is applied via styled-jsx in components
} as const;

/**
 * CSS class for pressable surfaces — applies scale-down on active +
 * background flash. Drop into any element that should feel tappable.
 *
 * Used in styled-jsx:
 *   <style jsx>{pressableStyle}</style>
 *   <button className="pressable">...</button>
 */
export const pressableStyle = `
  .pressable {
    transition: ${transitions.transform}, ${transitions.press};
    transform: scale(1);
    -webkit-tap-highlight-color: transparent;
  }
  .pressable:active {
    transform: scale(0.96);
    background-color: ${colors.pressLight};
  }
  .pressable:focus-visible {
    outline: 2px solid ${colors.black};
    outline-offset: 2px;
  }
`;

/**
 * Stronger pressable — for primary CTAs (Get Started, Add to Cart).
 */
export const pressableStrongStyle = `
  .pressable-strong {
    transition: ${transitions.transform}, ${transitions.press};
    transform: scale(1);
    -webkit-tap-highlight-color: transparent;
  }
  .pressable-strong:active {
    transform: scale(0.97);
  }
  .pressable-strong:focus-visible {
    outline: 2px solid ${colors.black};
    outline-offset: 3px;
  }
`;

/**
 * usePressed — controlled pressed-state hook with haptic feedback.
 *
 * Returns spread props for pointer events + the current pressed state.
 * Use when you need to know the pressed state in JS (e.g. to swap colors).
 *
 * @param hapticOnPress — 'light' | 'medium' | 'heavy' | 'none' (default 'light')
 */
export function usePressed(hapticOnPress: 'light' | 'medium' | 'heavy' | 'none' = 'light') {
  const [pressed, setPressed] = useState(false);

  const onPointerDown = useCallback(() => {
    setPressed(true);
    if (hapticOnPress !== 'none') haptic[hapticOnPress]();
  }, [hapticOnPress]);

  const onPointerUp = useCallback(() => setPressed(false), []);
  const onPointerLeave = useCallback(() => setPressed(false), []);
  const onPointerCancel = useCallback(() => setPressed(false), []);

  return {
    pressed,
    bind: {
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      onPointerCancel,
    },
  };
}

const interactions = { focusRing, pressableStyle, pressableStrongStyle, usePressed };
export default interactions;
