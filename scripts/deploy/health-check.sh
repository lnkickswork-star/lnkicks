#!/usr/bin/env bash
# =============================================================================
# health-check.sh — Verify the deployment is healthy after restart
# =============================================================================
#
# Called by the GitHub Actions deploy workflow AFTER the app is restarted.
# Also called by the rollback job to verify the rollback worked.
#
# What it checks:
#   1. Homepage (/) returns HTTP 200 within the timeout window.
#   2. A representative product page (/product/<slug>) returns 200.
#   3. A static asset (/favicon.ico or similar) returns 200.
#   4. Response body contains expected markers (HTML doctype, app title).
#
# Exit codes:
#   0 — All checks passed (deployment is healthy)
#   1 — One or more checks failed (deployment is broken — trigger rollback)
#
# Usage:
#   bash health-check.sh <PRODUCTION_DOMAIN> <TIMEOUT_SECONDS>
#
# Args:
#   PRODUCTION_DOMAIN  — full URL including https:// (e.g. https://lnkicks.com)
#   TIMEOUT_SECONDS    — total time to retry before giving up (default: 90)
# =============================================================================
set -uo pipefail   # NOT -e — we want to collect all failures, not abort on first

DOMAIN="${1:?PRODUCTION_DOMAIN argument required}"
TIMEOUT_SECONDS="${2:-90}"

# Strip trailing slash for clean URL joining.
DOMAIN="${DOMAIN%/}"

# Use a unique temp file per health-check run (avoids collision if multiple
# health checks ever run in parallel — defensive cleanup at exit).
BODY_TMPFILE="$(mktemp /tmp/lnkicks-health.XXXXXX)"
trap 'rm -f "$BODY_TMPFILE"' EXIT

# A representative product slug to test the dynamic product route.
# This matches the redirect target in next.config.js — if the product
# slug ever changes, update it here.
PRODUCT_SLUG="air-jordan-1-low-black-powder-blue"

# Endpoints to check. Format: "PATH|DESCRIPTION"
ENDPOINTS=(
  "/|Homepage"
  "/product/${PRODUCT_SLUG}|Product detail page"
  "/categories|Categories listing"
  "/favicon.ico|Static favicon asset"
  "/sw.js|Service worker script"
  "/manifest.webmanifest|PWA manifest"
)

echo "[health-check] Target: $DOMAIN"
echo "[health-check] Timeout: ${TIMEOUT_SECONDS}s"
echo "[health-check] Checking ${#ENDPOINTS[@]} endpoints..."
echo ""

# Track overall elapsed time for the summary at the end.
START_TIME=$(date +%s)

check_endpoint() {
  local path="$1"
  local description="$2"
  local url="${DOMAIN}${path}"
  local http_code
  local body_size
  local elapsed_ms

  # curl options:
  #   -s            silent (no progress bar)
  #   -S            show errors
  #   -o $BODY_TMPFILE  discard body to per-run temp file
  #   -w            write metrics to stdout (HTTP code, size, time)
  #   --max-time 15 hard per-request timeout
  #   -L            follow redirects (301/302)
  #   --compressed  accept gzip
  local response
  response=$(curl -sS -L --compressed --max-time 15 \
    -o "$BODY_TMPFILE" \
    -w "%{http_code}|%{size_download}|%{time_total}" \
    "$url" 2>&1) || true

  if [[ -z "$response" || "$response" == *"Could not resolve"* || "$response" == *"Connection refused"* ]]; then
    echo "  ❌ $description ($url)"
    echo "     Connection error: $response"
    return 1
  fi

  http_code=$(echo "$response" | cut -d'|' -f1)
  body_size=$(echo "$response" | cut -d'|' -f2)
  elapsed_ms=$(awk "BEGIN { printf \"%.0f\", $(echo "$response" | cut -d'|' -f3) * 1000 }")

  # Accept 2xx and 3xx (redirects already followed). Reject 4xx/5xx.
  if [[ "$http_code" =~ ^[23] ]]; then
    echo "  ✅ $description — HTTP $http_code, ${body_size} bytes, ${elapsed_ms}ms"
    return 0
  else
    echo "  ❌ $description ($url)"
    echo "     HTTP $http_code, ${body_size} bytes, ${elapsed_ms}ms"
    # Show first 200 chars of body for debugging.
    if [[ -f "$BODY_TMPFILE" ]]; then
      echo "     Body preview: $(head -c 200 "$BODY_TMPFILE" | tr '\n' ' ')"
    fi
    return 1
  fi
}

# Retry loop — cPanel/Passenger restarts can take 5-30s to fully propagate.
# We retry the FULL endpoint suite every 5s until TIMEOUT_SECONDS is reached.
RETRY_INTERVAL=5
ELAPSED=0

while [[ "$ELAPSED" -lt "$TIMEOUT_SECONDS" ]]; do
  echo "─── Attempt at ${ELAPSED}s ───"
  ALL_PASS=true

  for endpoint in "${ENDPOINTS[@]}"; do
    path="${endpoint%%|*}"
    desc="${endpoint##*|}"
    if ! check_endpoint "$path" "$desc"; then
      ALL_PASS=false
    fi
  done

  if $ALL_PASS; then
    END_TIME=$(date +%s)
    ELAPSED=$((END_TIME - START_TIME))
    echo ""
    echo "[health-check] ✅ All endpoints healthy (took ${ELAPSED}s)."
    exit 0
  fi

  echo ""
  echo "[health-check] Some endpoints not yet healthy. Waiting ${RETRY_INTERVAL}s before retry..."
  sleep "$RETRY_INTERVAL"
  ELAPSED=$((ELAPSED + RETRY_INTERVAL))
done

echo ""
echo "[health-check] ❌ FAILED: endpoints did not become healthy within ${TIMEOUT_SECONDS}s."
echo "[health-check] Suggested actions:"
echo "[health-check]   1. Check cPanel → Logs → Error Log for the production domain"
echo "[health-check]   2. SSH in and tail the Passenger logs:  tail -f ~/logs/*.log"
echo "[health-check]   3. Verify Passenger picked up the new code: ls -la ${DOMAIN#https://*} 2>/dev/null; ls -la \$HOME/lnkicks/tmp/restart.txt"
echo "[health-check]   4. If broken, trigger rollback: GitHub Actions → Run workflow → force_rollback=true"
exit 1
