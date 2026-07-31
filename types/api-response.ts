/* =========================================================
   APIResponse — standard envelope for API routes
   ---------------------------------------------------------
   Every App Router route handler (app/api/<route>/route.ts)
   MUST return this envelope. Client fetchers can then
   uniformly destructure `.data` or surface `.error` to UI.
   ========================================================= */

export interface APIResponse<T = unknown> {
  /** True on success, false on failure. */
  success: boolean;
  /** Response payload (present iff success === true). */
  data?: T;
  /** Machine-readable error code (present iff success === false). */
  error?: string;
  /** Human-readable error message (present iff success === false). */
  message?: string;
  /** Optional server timestamp (ISO 8601). */
  timestamp?: string;
}

/** Convenience constructors — keeps call sites terse & typed. */
export function ok<T>(data: T, message?: string): APIResponse<T> {
  return { success: true, data, message, timestamp: new Date().toISOString() };
}

export function fail<T = never>(
  error: string,
  message?: string,
): APIResponse<T> {
  return {
    success: false,
    error,
    message,
    timestamp: new Date().toISOString(),
  };
}
