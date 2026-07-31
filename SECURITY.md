# Security Policy

## Supported Versions

This project is actively maintained on the latest `main` branch. Security fixes are applied to `main` and released via the standard pull-request workflow.

| Version | Supported          |
|---------|--------------------|
| `main`  | ✅ Active support  |
| Tags    | ✅ Latest tag only |
| Older   | ❌ Not supported   |

## Reporting a Vulnerability

We take security vulnerabilities seriously. **Please do not open a public GitHub issue for security vulnerabilities.**

### Preferred channels (in order)

1. **GitHub Security Advisory** (preferred) — use the "Report a vulnerability" button on the **Security** tab of this repository: `https://github.com/lnkickswork-star/lnkicks/security/advisories/new`
2. **Email** — if GitHub Security Advisories are unavailable, contact the repository owner via the email listed on their GitHub profile.

### What to include in your report

Please provide as much of the following as possible so we can reproduce and triage quickly:

- Description of the vulnerability and its potential impact
- Affected component(s) (file path(s), route(s), endpoint(s))
- Step-by-step reproduction instructions
- Proof-of-concept code or HTTP request/response pairs (if applicable)
- Affected versions (commit SHA or tag)
- Suggested remediation (optional but appreciated)

### Response timeline

| Stage                              | Target SLA |
|------------------------------------|------------|
| Acknowledgement of report          | ≤ 72 hours |
| Initial assessment & severity      | ≤ 7 days   |
| Fix or mitigation merged           | ≤ 30 days  (severity-dependent) |
| Public disclosure (after fix)      | Coordinated with reporter |

Please **do not** disclose the vulnerability publicly until a fix has been released and you have been notified.

## Scope

The following are **in scope** for this policy:

- The Next.js application in `/app/`
- Any API routes under `/app/api/`
- Client-side logic in TypeScript/React components
- Build & deployment configuration (`next.config.js`, `package.json`, GitHub Actions workflows)
- Authentication, session handling, and authorization logic (when present)

The following are **out of scope**:

- Vulnerabilities in third-party dependencies — report them upstream
- Theoretical issues without a concrete exploit path
- Self-XSS or social-engineering attacks
- Issues requiring physical access to a developer's machine
- Spam, rate-limiting on public forms, or denial-of-service via sheer volume

## Security best practices for contributors

- **Never commit secrets** — `.env`, `.env.local`, API keys, JWT secrets, SSH private keys, etc. The `.gitignore` already excludes the standard patterns; please extend it if you introduce new secret files.
- **Use environment variables** for any runtime configuration that varies between environments.
- **Validate all user input** on the server side; do not trust client-side validation alone.
- **Sanitize any HTML** before rendering with `dangerouslySetInnerHTML`.
- **Keep dependencies updated** — Dependabot is configured to open PRs for patch/minor updates.

## Disclosure policy

We follow **coordinated disclosure**: vulnerabilities are disclosed publicly only after a fix is available, the reporter has been credited (unless they prefer to remain anonymous), and sufficient time has passed for users to update.

## Credits

Reporters who follow this policy will be credited in the release notes / Security Advisory, unless they request anonymity.
