# Tallest Tourguide — tallesttourguide.com

Tour-guide website for Sarajevo/Bosnia: React 19 + Vite 8 SPA with a
Puppeteer prerender step that bakes real static HTML (meta tags, JSON-LD,
content) for every route, a local JSON-file CMS at `/admin`, and Netlify
hosting.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server + admin CMS at `/admin` (Express API mounted dev-only) |
| `npm run build` | Production build: `vite build` + prerender + sitemap + `200.html` fallback. **Fails if any route prerenders incorrectly.** |
| `npm run build:spa` | Vite build only, no prerender (debugging) |
| `npm run prerender` | Re-run prerender against an existing `dist/` |
| `npm run lint` | ESLint |

## Architecture notes

- **Content** lives in `src/data/*.json` (tours, packages, destinations,
  accommodations, pages, journal), edited via the `/admin` CMS (dev-only).
  Publishing = commit + push.
- **Routes** are enumerated in `scripts/routes.mjs` from the JSON data —
  single source of truth for the prerender (`scripts/prerender.mjs`) and the
  sitemap (`scripts/sitemap.mjs`).
- **Canonical URLs use the trailing-slash form** (`/tours/x/`) because
  Netlify serves the prerendered directories. `src/utils/seo.js` (`siteUrl`)
  is the single builder — use it for every absolute URL in meta/schema.
- **SPA fallback is `200.html`** (pristine tag-free shell), not
  `index.html` — falling back to the prerendered homepage made Google index
  unknown URLs as homepage duplicates. See `public/_redirects`.
- **Journal** was migrated from Airtable to `src/data/journal.json`
  (`scripts/migrate-journal.mjs`) so posts are prerendered and in the
  sitemap. Airtable still handles bookings, reviews and availability.
- **Prerender failures fail the build** (exit 1) so broken pages can't ship;
  emergency override: `PRERENDER_ALLOW_FAIL=1 npm run build`.

## Deployment

Netlify builds with `npm run build` and publishes `dist/` (see
`netlify.toml`).

One-time setup (Netlify + GitHub UI):

1. **Auto-deploy on push** — Netlify → Site configuration → Build & deploy →
   Link repository → `almedinmeme/tallest-tourguide`, branch `main`.
   Every push then builds and deploys automatically.
2. **Failure emails** — Netlify → Site configuration → Notifications →
   add "Deploy failed" email. Matters: prerender failures now block deploys
   by design.
3. **Weekly safety-net rebuild** — Netlify → Build & deploy → Build hooks →
   create a hook; add its URL as the `NETLIFY_BUILD_HOOK_URL` secret in
   GitHub → Settings → Secrets and variables → Actions. The workflow
   `.github/workflows/weekly-rebuild.yml` POSTs it every Monday.

## SEO invariants (don't break these)

- Every public page renders `<SEO …>` (`src/components/SEO.jsx`) with a
  unique title/description and its own `url` prop.
- `index.html` carries **no** static title/meta — the prerender bakes exact
  per-page tags; a static fallback would create duplicate tags.
- New content types must be added to `scripts/routes.mjs` or they will be
  invisible to crawlers (served the `200.html` shell).
- Old URLs get 301s in `public/_redirects` (see the `/blog → /journal`
  entries) — never delete a published URL without a redirect.
