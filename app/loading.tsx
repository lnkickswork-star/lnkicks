
/**
 * Loading — global route-segment loading UI.
 *
 * Mounted automatically by Next.js App Router while a route segment
 * is loading (suspense fallback for the route's data). Kept minimal
 * and SSR-safe (no client-only hooks) so it renders immediately.
 *
 * Design tokens match the homepage: white background, black logo
 * mark, Inter font, cubic-bezier(0.16,1,0.3,1) easing on the spinner.
 */
export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#ffffff',
        gap: 20,
        fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
      }}
    >
      {/* Brand mark */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '0.02em',
            lineHeight: 1,
            color: '#0a0a0a',
            textTransform: 'uppercase',
          }}
        >
          LN
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.18em',
            lineHeight: 1,
            color: '#0a0a0a',
            textTransform: 'uppercase',
          }}
        >
          KICKS
        </span>
      </div>

      {/* Spinner */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '2px solid #f0f0f0',
          borderTopColor: '#0a0a0a',
          animation: 'lnk-loading-spin 700ms linear infinite',
        }}
      />

      {/* Inline keyframes — scoped to this page via <style jsx> is not
          possible in a server component, so we use a <style> tag. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes lnk-loading-spin {
              to { transform: rotate(360deg); }
            }
          `,
        }}
      />
    </div>
  );
}
