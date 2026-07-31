# Contributing to lnkicks

First off — thanks for taking the time to contribute! 🎉

This document describes how to set up the project, the conventions we follow, and the workflow for getting changes merged.

## Code of Conduct

Participation in this project is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Quick start

```bash
# 1. Clone (SSH recommended)
git clone git@github.com:lnkickswork-star/lnkicks.git
cd lnkicks

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# Open http://localhost:3000
```

Prerequisites:
- Node.js ≥ 20.x (LTS recommended)
- npm ≥ 10.x (or pnpm/yarn — pick one and stick with it)
- Git ≥ 2.40

## Project layout

```
lnkicks/
├── app/                  # Next.js App Router pages, layouts, and API routes
│   ├── account/          # User account pages (orders, profile)
│   ├── admin/            # Admin dashboard
│   ├── cart/             # Cart & checkout
│   ├── categories/       # Browse by category
│   └── ...               # Other routes
├── components/           # Shared React components (if applicable)
├── public/               # Static assets served as-is
├── scripts/              # Build helpers & automation (Python)
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json
```

## Development workflow

### 1. Pick (or create) an issue

- Browse [open issues](https://github.com/lnkickswork-star/lnkicks/issues) for something that interests you.
- For non-trivial changes, **open an issue first** to discuss the approach before writing code.
- Comment on the issue to let others know you're working on it.

### 2. Create a branch

```bash
git checkout main
git pull --ff-only
git checkout -b feat/short-descriptive-name
```

Branch naming conventions:
- `feat/<short-name>` — new features
- `fix/<short-name>` — bug fixes
- `chore/<short-name>` — tooling, deps, refactors with no behaviour change
- `docs/<short-name>` — documentation only
- `perf/<short-name>` — performance improvements

### 3. Make your changes

Follow the existing code style. The repo includes an [`.editorconfig`](./.editorconfig) — most editors will pick it up automatically.

General guidelines:
- **TypeScript**: keep types strict; avoid `any` where a more specific type is feasible.
- **React**: prefer function components; lift state up only when needed.
- **Styling**: use the existing Tailwind / CSS-variable system; do not introduce inline styles for layout.
- **Naming**: `PascalCase` for components and types, `camelCase` for functions and variables, `kebab-case` for filenames of non-component files.
- **Imports**: use the `@/` alias for absolute imports from the project root.

### 4. Test locally

```bash
npm run lint     # ESLint via next lint
npm run build    # Production build — must succeed with no errors
npm run dev      # Smoke-test the affected route(s) in the browser
```

Before opening a PR, please confirm:
- [ ] `npm run lint` produces no new warnings
- [ ] `npm run build` succeeds
- [ ] You've manually smoke-tested the affected pages
- [ ] No new secrets, `.env` files, or large binary assets are committed

### 5. Commit your changes

We follow **Conventional Commits** for clean, machine-parseable history:

```
<type>(<optional scope>): <short imperative summary>

<optional body explaining why, not what>

<optional footer with breaking changes or issue refs>
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`.

Examples:
```
feat(cart): apply promo code discount at checkout
fix(admin): correct product sort order on dashboard
docs(readme): add deployment section
chore(deps): bump next from 14.2.5 to 14.2.10
```

### 6. Push and open a pull request

```bash
git push -u origin feat/short-descriptive-name
```

Then open a PR against `main` and fill in the [PR template](./.github/PULL_REQUEST_TEMPLATE.md).

A maintainer will review your PR. CODEOWNERS will automatically be requested as reviewers.

## Coding standards

### TypeScript
- Target: ES2017+
- Strict mode is currently **off** (see `tsconfig.json`) — new code should still be written as if it were on
- Avoid `any`; use `unknown` + narrowing where the type is genuinely unknown
- Prefer `interface` for object shapes, `type` for unions and utility types

### React
- Function components only (no class components)
- Hooks: follow the Rules of Hooks
- Avoid `useEffect` for derived state — compute during render

### Styling
- Tailwind utility classes first; CSS modules only for complex scoped styles
- Design tokens live in CSS variables — reuse, don't hard-code values

### Accessibility
- Semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`, etc.)
- All interactive elements must be keyboard accessible
- Images require meaningful `alt` text (or `alt=""` if decorative)
- Color contrast must meet WCAG AA

## Reporting bugs

Open a [bug report issue](https://github.com/lnkickswork-star/lnkicks/issues/new?template=bug_report.md) and include:
- Steps to reproduce
- Expected vs. actual behaviour
- Screenshots (if UI)
- Browser/OS, Node version
- Any relevant console errors

## Requesting features

Open a [feature request issue](https://github.com/lnkickswork-star/lnkicks/issues/new?template=feature_request.md) and describe:
- The problem you're trying to solve
- The proposed solution
- Any alternatives you've considered

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
