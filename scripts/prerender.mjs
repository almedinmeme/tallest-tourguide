// Post-build prerender.
// Boots `vite preview` against the built dist/, then uses Puppeteer to visit
// every route and write the fully-rendered HTML (incl. react-helmet-async
// <head> tags) to dist/<route>/index.html. This gives crawlers real content
// and meta without an SSR rewrite.
//
// Hardened: a failed or wrong prerender used to ship silently, which served
// the homepage's HTML (title, meta, canonical → /) for the broken routes and
// made Google index them as homepage duplicates. Now:
//   - readiness = the page's canonical matches the route (proves the Helmet
//     tags belong to THIS route, not stale bleed from the previous one)
//   - each route retries twice in a fresh tab before counting as failed
//   - any failure fails the build (escape hatch: PRERENDER_ALLOW_FAIL=1)
//   - a validation pass re-reads every written file and asserts exactly one
//     correct canonical and a non-empty title
//   - missing Puppeteer is only tolerated locally, never in CI/Netlify

import { preview } from 'vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getRoutes } from './routes.mjs'
import { writeSitemap } from './sitemap.mjs'
import { writeRss } from './rss.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const PORT = 5099
const ORIGIN = 'https://tallesttourguide.com'
const RETRIES = 2
const PAGE_RECYCLE_EVERY = 15
const IS_CI = !!(process.env.CI || process.env.NETLIFY)
const ALLOW_FAIL = process.env.PRERENDER_ALLOW_FAIL === '1'

function expectedCanonical(route) {
  const clean = route.replace(/^\/+|\/+$/g, '')
  return clean ? `${ORIGIN}/${clean}/` : `${ORIGIN}/`
}

async function loadPuppeteer() {
  try {
    const mod = await import('puppeteer')
    return mod.default || mod
  } catch {
    return null
  }
}

function outPathFor(route) {
  // '/' -> dist/index.html ; '/a/b' -> dist/a/b/index.html
  const clean = route.replace(/^\/+|\/+$/g, '')
  return clean ? path.join(DIST, clean, 'index.html') : path.join(DIST, 'index.html')
}

async function newMobilePage(browser) {
  const page = await browser.newPage()
  // Prerender at a phone-width viewport so the static HTML is mobile-first.
  // The site's layout is driven by window.innerWidth (useWindowWidth). A desktop
  // prerender bakes a wide layout that overflows phones, which inflates
  // innerWidth on load so the client stays stuck on the desktop layout. A
  // mobile-first prerender fits phones (correct immediately) while desktop simply
  // re-renders wider once JS runs.
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
  return page
}

async function renderRoute(page, base, route) {
  await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  // Ready when the canonical in <head> belongs to THIS route and a title is
  // set. Stronger than waiting on #root content: it also catches stale tags
  // bled from the previously rendered route.
  await page.waitForFunction(
    (expected) =>
      document.querySelector('link[rel="canonical"]')?.href === expected &&
      document.title.trim().length > 0,
    { timeout: 15000 },
    expectedCanonical(route),
  )
  return '<!DOCTYPE html>\n' + (await page.content()).replace(/^<!DOCTYPE html>/i, '')
}

function validateHtml(route, html) {
  const problems = []
  const canonicals = [...html.matchAll(/<link[^>]+rel="canonical"[^>]*>/g)]
  if (canonicals.length !== 1) {
    problems.push(`${canonicals.length} canonical tags (expected 1)`)
  } else if (!canonicals[0][0].includes(`href="${expectedCanonical(route)}"`)) {
    problems.push(`canonical is not ${expectedCanonical(route)}`)
  }
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/)
  if (!title || !title[1].trim()) problems.push('missing or empty <title>')
  return problems
}

async function main() {
  // Capture the pristine SPA shell as the fallback BEFORE anything else —
  // before the '/' prerender overwrites dist/index.html, and even if Puppeteer
  // is unavailable. Netlify's `/* /200.html 200` rule serves this tag-free
  // shell for any URL without a prerendered file, so unknown routes render
  // client-side with their own Helmet tags instead of being served the
  // homepage's baked HTML (which made Google index them as home duplicates).
  //
  // A pristine shell has no canonical (index.html carries no static meta by
  // design). If dist/index.html already HAS one, this is a re-run on a
  // prerendered dist — vite preview serves index.html as the SPA fallback for
  // every slashless route, and Helmet cannot cleanly take over a baked page
  // (its data-rh tags survive → duplicate canonicals, so every route times
  // out). Restore the pristine shell from 200.html first, or bail.
  const indexPath = path.join(DIST, 'index.html')
  const fallbackPath = path.join(DIST, '200.html')
  let shell = await readFile(indexPath, 'utf-8')
  if (shell.includes('rel="canonical"')) {
    const fallback = await readFile(fallbackPath, 'utf-8').catch(() => null)
    if (fallback && !fallback.includes('rel="canonical"')) {
      shell = fallback
      await writeFile(indexPath, shell, 'utf-8')
      console.log('[prerender] re-run on a prerendered dist — restored the pristine shell from 200.html.')
    } else {
      console.error('[prerender] dist/index.html is already prerendered and no pristine 200.html exists.')
      console.error('[prerender] Run the full `npm run build` instead.')
      process.exit(1)
    }
  }
  await writeFile(fallbackPath, shell, 'utf-8')

  // Sitemap + RSS before the Puppeteer check so they exist even on a
  // SPA-only build.
  const routes = getRoutes()
  const sitemapCount = writeSitemap(routes, DIST)
  console.log(`[sitemap] wrote ${sitemapCount} URLs to dist/sitemap.xml`)
  const rssCount = writeRss(DIST)
  console.log(`[rss] wrote ${rssCount} posts to dist/rss.xml`)

  const puppeteer = await loadPuppeteer()
  if (!puppeteer) {
    console.log('\n[prerender] Puppeteer not installed — skipping static prerender.')
    console.log('[prerender] Install it to enable SEO prerendering:  npm i -D puppeteer\n')
    if (IS_CI) {
      console.error('[prerender] Refusing to ship an unprerendered site from CI.')
      process.exit(1)
    }
    return
  }

  const server = await preview({ preview: { port: PORT, strictPort: false } })
  const base = server.resolvedUrls?.local?.[0]?.replace(/\/$/, '') || `http://localhost:${PORT}`

  // Airtable is blocked at the DNS level: tour pages call it live for
  // availability/reviews, it rate-limits under 51-route × retry load, and the
  // static HTML must not embed live data anyway — the client refetches after
  // hydration. A resolver rule (vs request interception) can't deadlock the
  // crawl: the fetch fails instantly and the app's fallbacks render.
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--host-resolver-rules=MAP api.airtable.com ~NOTFOUND'],
  })
  let page = await newMobilePage(browser)

  // Render everything into memory FIRST. If we wrote files during the crawl,
  // prerendering '/' would overwrite dist/index.html — the file vite preview
  // serves as the SPA fallback for every other route — and bleed home's tags
  // (e.g. its canonical) onto subsequent pages. Buffer now, write at the end.
  const rendered = []
  const failures = []
  let sinceRecycle = 0

  for (const route of routes) {
    let lastError = null
    for (let attempt = 0; attempt <= RETRIES; attempt++) {
      try {
        if (attempt > 0 || sinceRecycle >= PAGE_RECYCLE_EVERY) {
          // Fresh tab on retry (guards against wedged page state) and
          // periodically during the crawl (bounds memory).
          await page.close().catch(() => {})
          page = await newMobilePage(browser)
          sinceRecycle = 0
        }
        const html = await renderRoute(page, base, route)
        rendered.push({ route, out: outPathFor(route), html })
        sinceRecycle += 1
        lastError = null
        break
      } catch (e) {
        lastError = e
        console.warn(`[prerender] ${route} attempt ${attempt + 1}/${RETRIES + 1} failed: ${e.message}`)
      }
    }
    if (lastError) failures.push({ route, message: lastError.message })
  }

  await browser.close()
  await server.httpServer.close()

  // Now persist — safe to overwrite dist/index.html since the crawl is done.
  for (const { out, html } of rendered) {
    await mkdir(path.dirname(out), { recursive: true })
    await writeFile(out, html, 'utf-8')
  }

  // Validation pass: re-read what we wrote and prove every page carries its
  // own tags. Final backstop against shipping homepage-duplicate HTML.
  const invalid = []
  for (const { route, out } of rendered) {
    const html = await readFile(out, 'utf-8')
    const problems = validateHtml(route, html)
    if (problems.length) invalid.push({ route, message: problems.join('; ') })
  }

  console.log(`\n[prerender] wrote ${rendered.length}/${routes.length} pages.`)
  const broken = [...failures, ...invalid]
  if (broken.length) {
    console.error(`[prerender] ${broken.length} route(s) failed:`)
    for (const { route, message } of broken) console.error(`  ✗ ${route} — ${message}`)
    if (ALLOW_FAIL) {
      console.warn('[prerender] PRERENDER_ALLOW_FAIL=1 — shipping anyway (failed routes fall back to 200.html).')
    } else {
      console.error('[prerender] Failing the build so broken pages cannot ship. Override: PRERENDER_ALLOW_FAIL=1')
      process.exit(1)
    }
  }
}

main().catch((e) => {
  console.error('[prerender] error:', e)
  process.exit(ALLOW_FAIL ? 0 : 1)
})
