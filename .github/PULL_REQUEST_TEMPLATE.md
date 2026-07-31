<!-- Thank you for opening a PR! Please fill in every section. -->
<!-- Maintainers: reviewers are auto-requested via CODEOWNERS. -->

## 📌 Summary

<!-- One or two sentences describing what this PR changes and why. -->

## 🔗 Related issue(s)

<!--
Link issues that this PR closes / fixes / relates to.
Use the keywords so GitHub auto-closes them on merge:
  Closes #123
  Fixes #456
  Refs #789
-->

Closes #

## 🔄 Type of change

<!-- Check all that apply -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] ♻️ Refactor (no functional change, no API change)
- [ ] ⚡ Performance improvement
- [ ] 🎨 Styling / UI polish
- [ ] 📝 Documentation update
- [ ] 🔧 Build / CI / tooling change
- [ ] 🧪 Test addition / fix
- [ ] 🔒 Security fix

## 📸 Screenshots / recordings

<!-- For UI changes, attach before/after screenshots or a short recording. -->

| Before | After |
|--------|-------|
|        |       |

## ✅ Pre-merge checklist

<!-- Tick every box before requesting review. -->

- [ ] **Branch**: I'm targeting `main` from a feature branch (not `main` → `main`)
- [ ] **Lint**: `npm run lint` passes with no new warnings
- [ ] **Build**: `npm run build` succeeds
- [ ] **Smoke test**: I've manually tested the affected routes in the browser
- [ ] **Types**: No new `any` types introduced (or justified below)
- [ ] **Tests**: New code has tests; existing tests still pass
- [ ] **Docs**: Updated README / CONTRIBUTING / CHANGELOG if behaviour changed
- [ ] **Secrets**: No `.env`, API keys, tokens, or private keys committed
- [ ] **Migrations**: If DB schema changed, I've added a migration & updated seed data
- [ ] **Accessibility**: New UI is keyboard-navigable and meets WCAG AA contrast
- [ ] **Mobile**: New UI works on mobile-width viewports (≥ 360px)
- [ ] **CHANGELOG**: Added an entry under `[Unreleased]` in `CHANGELOG.md`

## 🧪 How to test

<!-- Step-by-step instructions for the reviewer to verify the change. -->

1. Checkout this branch: `git checkout <branch-name>`
2. `npm install` (only if dependencies changed)
3. `npm run dev`
4. Open http://localhost:3000/...
5. Verify that ...

## 📝 Notes for reviewer

<!-- Anything the reviewer should pay extra attention to? Edge cases? Trade-offs made? -->

## 📦 Deployment notes

<!-- If this PR requires deployment steps (env vars, migrations, infra), list them. -->

- [ ] No special deployment steps required
- [ ] New env vars required (listed below)
- [ ] DB migration required
- [ ] Cache invalidation required

```
New env vars (if any):
EXAMPLE_NEW_VAR=example_value
```
