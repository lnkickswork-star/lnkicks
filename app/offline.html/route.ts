/**
 * /offline.html — Route Handler returning raw HTML for the service worker
 * to cache as the offline fallback.
 *
 * Why a route handler (not a page)?
 *  - Bypasses the root layout's AppProvider + client JS bundle
 *  - Returns pure HTML that the SW can cache during install with zero
 *    runtime dependencies (no React, no fonts, no external CSS)
 *  - Loads instantly on a completely dead connection
 *
 * Style: matches LN KICKS mobile — pure white, black wordmark, soft grey
 * caption, premium minimal. Inline CSS only.
 */

export const dynamic = 'force-static';

export function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#ffffff" />
<title>Offline — LNKICKS</title>
<meta name="robots" content="noindex, nofollow" />
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    color: #0A0A0A;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    padding:
      env(safe-area-inset-top)
      env(safe-area-inset-right)
      env(safe-area-inset-bottom)
      env(safe-area-inset-left);
    text-align: center;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
  }
  .wordmark {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: 0.18em;
    margin-bottom: 12px;
  }
  .headline {
    font-size: 14px;
    font-weight: 600;
    color: #0A0A0A;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    margin: 0 0 8px 0;
  }
  .caption {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
    max-width: 280px;
  }
  .retry {
    margin-top: 28px;
    padding: 12px 28px;
    background: #0A0A0A;
    color: #ffffff;
    border: none;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }
  .retry:active { transform: scale(0.97); }
</style>
</head>
<body>
  <div class="wordmark">LNKICKS</div>
  <p class="headline">You&rsquo;re offline</p>
  <p class="caption">Connect to the internet and try again. Cached pages will load automatically.</p>
  <button class="retry" type="button" onclick="window.location.reload()">Retry</button>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
}
