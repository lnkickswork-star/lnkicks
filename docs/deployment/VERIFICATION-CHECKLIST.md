# ✅ Post-Deployment Verification Checklist

> Run through this checklist after EVERY deployment to confirm production is healthy. The GitHub Actions workflow automates most of this, but manual verification catches issues the automated checks miss.

---

## Automated Checks (Run by GitHub Actions)

These run automatically during the deploy workflow. If any fail, the deploy auto-rolls back.

- [ ] **Homepage loads** — `GET /` returns HTTP 200
- [ ] **Product detail page loads** — `GET /product/air-jordan-1-low-black-powder-blue` returns HTTP 200
- [ ] **Categories page loads** — `GET /categories` returns HTTP 200
- [ ] **Static favicon loads** — `GET /favicon.ico` returns HTTP 200
- [ ] **Service worker loads** — `GET /sw.js` returns HTTP 200
- [ ] **PWA manifest loads** — `GET /manifest.webmanifest` returns HTTP 200

**If all automated checks pass:** the workflow reports success and you're done with automated verification. Proceed to manual checks below.

**If any automated check fails:** auto-rollback fires. Do NOT run manual checks until rollback completes and you've diagnosed the issue.

---

## Manual Checks — Run After Every Deploy

### 1. Smoke Test Critical User Flows (5 min)

Visit the production URL in a fresh incognito window and verify each flow:

#### Homepage

- [ ] Page loads without errors (open browser DevTools → Console — no red errors)
- [ ] Hero banner image loads
- [ ] Product carousels (Trending, Designer Sneakers, Luxury Shoes) load and scroll
- [ ] Instant Ship grid loads (no Add to Cart button on these cards — removed per spec)
- [ ] Product cards show: image, brand, name, price, strikethrough price (if applicable)
- [ ] Product cards show "Add to Cart" CTA pill (Premium/Designer/Luxury sections only)
- [ ] Footer loads with all links
- [ ] No 404 images (broken image icons)

#### Mobile Homepage (responsive)

- [ ] Switch to mobile viewport (DevTools → Toggle device toolbar)
- [ ] Mobile layout loads (MobileHome component, not DesktopHome)
- [ ] Bottom navigation bar visible
- [ ] Touch swipe works on discovery/carousel sections
- [ ] No horizontal scroll on mobile

#### Product Detail Page

- [ ] Click any product on homepage → product detail page loads
- [ ] Product images load
- [ ] Size selector works
- [ ] "Add to Cart" button works (opens cart drawer or redirects to cart)
- [ ] Related products section loads

#### Cart & Checkout

- [ ] Add a product to cart
- [ ] Cart page loads with the product
- [ ] Click "Checkout" → checkout page loads
- [ ] Checkout form renders (do NOT submit a real order)
- [ ] Payment method selector works

#### Authentication

- [ ] Click login → login page loads
- [ ] Login form renders (do NOT submit real credentials)
- [ ] Click "Register" → register page loads
- [ ] Register form renders

#### Admin Dashboard

- [ ] Navigate to `/admin-login` → admin login page loads
- [ ] (If you have admin credentials) Log in → dashboard loads
- [ ] Dashboard shows KPIs, charts, recent orders
- [ ] Navigate to a sub-page (e.g. `/products-management`) → loads

### 2. Verify Static Assets (2 min)

```bash
# Run from your local machine

# Homepage
curl -sI https://your-domain.com/ | head -5
# Expect: HTTP/2 200

# A product image
curl -sI https://your-domain.com/af1_black.png | head -5
# Expect: HTTP/2 200, Content-Type: image/png

# CSS bundle (Next.js generates hashed filenames — find one in page source)
curl -s https://your-domain.com/ | grep -oE '/_next/static/css/[^"]+\.css' | head -1 | xargs -I{} curl -sI https://your-domain.com{} | head -3
# Expect: HTTP/2 200, Content-Type: text/css

# JS bundle
curl -s https://your-domain.com/ | grep -oE '/_next/static/chunks/[^"]+\.js' | head -1 | xargs -I{} curl -sI https://your-domain.com{} | head -3
# Expect: HTTP/2 200, Content-Type: application/javascript
```

### 3. Check Server Logs (2 min)

```bash
ssh -p 22 aqualit1@your-host.com

# Check for errors in the last 10 minutes
tail -100 ~/logs/lnkicks.com.error.log | grep -iE "(error|fail|exception|cannot)" | tail -20

# Check the access log for unusual patterns
tail -100 ~/logs/lnkicks.com.log | awk '{print $9}' | sort | uniq -c | sort -rn
# Expect: mostly 200s, some 304s. Any 500s or 503s indicate problems.

# Check Node.js process is running
ps aux | grep -E "(node|next|app\.js)" | grep -v grep
# Expect: 1+ processes running node cpanel/app.js
```

### 4. Verify Deploy Metadata (1 min)

```bash
ssh -p 22 aqualit1@your-host.com

# What's currently live?
cat /home/aqualit1/lnkicks/current/.next/BUILD_ID
# Should match the commit SHA deployed by GitHub Actions

# When was the last restart?
stat -c '%y' /home/aqualit1/lnkicks/current/tmp/restart.txt
# Should be recent (within last 10 minutes)

# List recent deployments
ls -1dt /home/aqualit1/lnkicks/releases/*/ | head -5
# Most recent should match today's date
```

### 5. Performance Check (1 min)

```bash
# From your local machine (with curl)
# Measure Time To First Byte (TTFB)
curl -sI -o /dev/null -w "TTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://your-domain.com/

# TTFB should be < 1s on cPanel shared hosting
# Total should be < 2s for the homepage
```

If TTFB is > 2s:
- Check if the page is being statically optimized (it should be — Next.js prerenders pages)
- Check Passenger's process count (cPanel → Setup Node.js App → "Application processes" — should be 1+)
- Check server load (`uptime` — should be < 1.0)

### 6. Mobile Performance (2 min)

Use Google's PageSpeed Insights:
- https://pagespeed.web.dev/?url=https://your-domain.com

Check:
- [ ] Mobile Performance score > 70 (target: 85+)
- [ ] Desktop Performance score > 85
- [ ] No "largest contentful paint" issues > 4s
- [ ] No "cumulative layout shift" > 0.1

---

## Post-Deploy Tasks (Only After All Checks Pass)

### 1. Notify the Team

If you use Slack/Discord:
- Post in the deploy channel: "Deployed commit `<short SHA>` to production ✅"
- Include a link to the GitHub Actions run

### 2. Monitor for 15 Minutes

For the first 15 minutes after deploy:
- Watch error logs: `tail -f ~/logs/lnkicks.com.error.log`
- Watch GitHub Actions for any triggered workflows
- Be ready to roll back if user-reported issues spike

### 3. Update Tracking

If you use a changelog:
```bash
# Edit CHANGELOG.md with what changed in this deploy
git add CHANGELOG.md
git commit -m "docs: update changelog for deploy <SHA>"
git push origin main
# (This will trigger another deploy — fine if it's just docs)
```

---

## Red Flags — Stop and Investigate

If you observe ANY of these, do NOT consider the deploy successful:

### 🚨 Critical (Roll Back Immediately)

- Homepage returns 5xx error
- Any page returns 500 Internal Server Error
- Error log shows `Cannot find module` or `SyntaxError`
- Error log shows `EADDRINUSE` or `EACCES`
- Database connection errors
- Payment gateway returns 401 (auth failure — env vars wrong)
- Users report being unable to log in
- Users report being unable to checkout

### ⚠️ Warning (Investigate Before Deciding)

- Page load times > 3s (was < 1s before)
- 404s for assets that existed before
- Console errors that didn't exist before (check browser DevTools)
- Missing images (could be CDN issue, not deploy issue)
- Specific browser/device doesn't work (could be browser-specific bug)

### ℹ️ Informational (Note but Don't Panic)

- 404s for old URLs (expected if you removed pages — check redirects)
- Increase in 304 responses (normal — caching working)
- Slightly slower TTFB during peak traffic (normal)

---

## Monthly Verification (Recommended)

Once a month, run a deeper verification:

### Backup Integrity

```bash
ssh -p 22 aqualit1@your-host.com

# List all backups
ls -1 /home/aqualit1/lnkicks/releases/ | wc -l
# Should be ≤ 10 (pruned automatically)

# Pick the oldest backup, verify it's still intact
OLDEST=$(ls -1dt /home/aqualit1/lnkicks/releases/*/ | tail -1)
test -f "$OLDEST/.next/BUILD_ID" && echo "OK: oldest backup intact" || echo "BAD: oldest backup is corrupt"

# Check disk space
df -h /home/aqualit1/
# Should have > 1GB free
```

### Secret Rotation Check

Review the list of secrets in [ENVIRONMENT-VARIABLES.md](./ENVIRONMENT-VARIABLES.md) under "Secret Rotation":
- [ ] When was `JWT_SECRET` last rotated? (Should be < 12 months)
- [ ] When was `STRIPE_SECRET_KEY` last rotated?
- [ ] When was the SSH key last regenerated?

### Dependency Updates

```bash
# Check for security vulnerabilities
cd /home/aqualit1/lnkicks/current
npm audit --omit=dev
# Should show 0 high/critical vulnerabilities

# Check for outdated packages
npm outdated
# Major version bumps require testing — schedule time to upgrade
```

---

## Quick Verification Script

For a fast post-deploy check, run this one-liner from your local machine:

```bash
URL="https://your-domain.com"
echo "=== Homepage ===" && curl -sI "$URL/" | head -1
echo "=== Product page ===" && curl -sI "$URL/product/air-jordan-1-low-black-powder-blue" | head -1
echo "=== Categories ===" && curl -sI "$URL/categories" | head -1
echo "=== Favicon ===" && curl -sI "$URL/favicon.ico" | head -1
echo "=== Service worker ===" && curl -sI "$URL/sw.js" | head -1
echo "=== TTFB ===" && curl -sI -o /dev/null -w "%{time_starttransfer}s\n" "$URL/"
```

Expected output:
```
=== Homepage ===
HTTP/2 200
=== Product page ===
HTTP/2 200
=== Categories ===
HTTP/2 200
=== Favicon ===
HTTP/2 200
=== Service worker ===
HTTP/2 200
=== TTFB ===
0.453s
```

If any line shows non-200 or TTFB > 2s, investigate before considering the deploy complete.
