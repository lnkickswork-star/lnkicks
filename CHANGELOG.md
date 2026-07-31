# Changelog

All notable changes to **lnkicks** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Given a version `MAJOR.MINOR.PATCH`:
- **MAJOR** — incompatible API changes
- **MINOR** — backwards-compatible new functionality
- **PATCH** — backwards-compatible bug fixes

## [Unreleased]

### Added
- Repository connected to GitHub via OAuth + SSH authentication.
- Enterprise-grade community files: `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, `CODEOWNERS`, `.editorconfig`, this `CHANGELOG.md`.
- GitHub Issue Templates (`bug_report.md`, `feature_request.md`) and Pull Request Template.
- Dependabot configuration for npm ecosystem.
- GitHub Actions CI workflow (`ci.yml`) and Release workflow (`release.yml`).
- Pre-commit hooks documentation.

### Changed
- `.gitignore` now excludes workspace-internal `skills/` and `upload/` directories.
- `.gitignore` now excludes `.env`, `.env.local`, `.env.*.local` (secrets).
- README.md updated to reflect repository connection.

### Removed
- `.env` removed from git tracking (local file preserved).
- `skills/` directory removed from git tracking (local files preserved).

### Security
- Stopped tracking `.env` (previously committed `DATABASE_URL` value
  `file:/home/z/my-project/db/custom.db` — a local SQLite path, **low severity**).
- Authentication now uses SSH public key auth (`git@github.com:...`) instead of
  HTTPS token-based auth, eliminating PAT exposure risk.

---

## [2.0.0] — 2026-07-30

### Added — Enterprise Sneaker Commerce Platform (v2)
- Interactive sneaker catalog and "Vault" with premium brand filtering.
- Tinder-style swipe discovery interface (mobile-first).
- Modern Next.js 14 App Router architecture.
- Responsive layout engine scaling from ultra-widescreen to mobile.
- Full e-commerce flow: cart, checkout, wishlist, shipping, cancellations, returns.
- Admin dashboard: products, orders, customers, analytics.
- Dark-themed premium aesthetic with micro-interactions.
- Python automation scripts for layout compilation, image transparency
  conversion, and compliance auditing.
- Production deployment preparation scripts.

### Stack
- Next.js 14.2.5, React 18.3.1, TypeScript 5.5.3
- TailwindCSS with CSS-variable design tokens
- Webpack + SWC compiler

---

## Versioning & release flow

```text
1. Update this CHANGELOG.md under [Unreleased] → bump version header
2. Update package.json "version" field to match
3. Commit: `chore(release): vX.Y.Z`
4. Tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
5. Push: `git push origin main --tags`
6. GitHub Actions release.yml will create the GitHub Release automatically
```

---

## Link conventions

- `[Unreleased]` — accumulated changes since the last release, not yet tagged.
- `[X.Y.Z] — YYYY-MM-DD` — released version with date.
- Compare links at the bottom of each section should point to
  `https://github.com/lnkickswork-star/lnkicks/compare/vPREV...vNEXT`.
