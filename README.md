# Arda Problem Docs Site (`docs.arda.io.vn`)

Modern developer portal and machine lookup API for Arda RFC 7807 problem details (`application/problem+json`), built with **Fumadocs** (Next.js 15, Tailwind CSS, Shadcn UI, Fumadocs MDX) and deployed on Cloudflare Workers.

## Architecture & Invariants

- **Single Source of Truth**: All problem markdown files (`docs/problems/*.md`) reside in [`arda-be`](https://github.com/arda-labs/arda-be). Backend CI gates (`check-problem-catalog.mjs`) validate 100% catalog coverage against Go constants and handler call sites.
- **Zero Dual-Write**: This repository (`arda-docs-site`) contains no committed problem content. During build, `scripts/sync-content.mjs` pulls specifications from `arda-be` and generates MDX pages.
- **Modern Aesthetic**: Stripe/Shadcn-inspired layout with clean typography, dual client/operator remediation panels, dark/light theme, and real-time keyboard search (`/`).
- **Edge Deployment**: Cloudflare Worker with `ASSETS` binding serving static HTML (`out/`) and programmatic JSON lookup (`/api/lookup`).

## 3 Core Contracts

1. **URL Stability**: `/problems/<code>/` resolves directly to the problem details page.
2. **Machine Contract (`/api/lookup`)**:
   - `GET /api/lookup?code=<code>` returns `200` with the 10-field remediation JSON (`code`, `title`, `status`, `summary`, `url`, `client_action`, `operator_action`, `related_routes`, `body`, `example`).
   - Returns `404` with nearest `suggestions` array for mistyped codes.
   - Headers: `cache-control: no-store`, `access-control-allow-origin: *`.
   - Used by AI agents (`arda.docs.problemLookup`), runbooks, and IDE plugins.
3. **Frontend Integration**: Error dialogs in `arda-mfe` link to `https://docs.arda.io.vn/problems/<code>/`.

## Local Development

```bash
# Install dependencies
bun install

# Start development server (pulls from arda-be automatically)
bun run dev

# Static build & emit catalog contracts
bun run build

# Run contract verification suite
bun run test

# Type check
bun run types:check
```

## Cloudflare Deployment

```bash
bun run build
bun run deploy
```
