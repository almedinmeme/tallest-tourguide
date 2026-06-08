// Post-build prerender.
// Boots `vite preview` against the built dist/, then uses Puppeteer to visit
// every route and write the fully-rendered HTML (incl. react-helmet-async
// <head> tags) to dist/<route>/index.html. This gives crawlers real content
// and meta for the new editorial / destination pages without an SSR rewrite.
//
// Resilient by design: if Puppeteer isn't installed, this logs a notice and
// exits 0 so `npm run build` still produces a working SPA.

import { preview } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getRoutes } from './routes.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const PORT = 5099

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

async function main() {
  const puppeteer = await loadPuppeteer()
  if (!puppeteer) {
    console.log('\n[prerender] Puppeteer not installed — skipping static prerender.')
    console.log('[prerender] Install it to enable SEO prerendering:  npm i -D puppeteer\n')
    return
  }

  const routes = getRoutes()
  const server = await preview({ preview: { port: PORT, strictPort: false } })
  const base = server.resolvedUrls?.local?.[0]?.replace(/\/$/, '') || `http://localhost:${PORT}`

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()

  // Render everything into memory FIRST. If we wrote files during the crawl,
  // prerendering '/' would overwrite dist/index.html — the file vite preview
  // serves as the SPA fallback for every other route — and bleed home's tags
  // (e.g. its canonical) onto subsequent pages. Buffer now, write at the end.
  const rendered = []
  let failed = 0
  for (const route of routes) {
    const url = `${base}${route}`
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
      // Wait until the SPA has actually rendered something into #root.
      await page.waitForFunction(
        () => {
          const el = document.getElementById('root')
          return el && el.innerHTML.trim().length > 200
        },
        { timeout: 15000 },
      ).catch(() => {})
      // Small settle for Helmet head writes.
      await new Promise((r) => setTimeout(r, 250))

      const html = '<!DOCTYPE html>\n' + (await page.content()).replace(/^<!DOCTYPE html>/i, '')
      rendered.push({ out: outPathFor(route), html })
    } catch (e) {
      failed += 1
      console.warn(`[prerender] failed ${route}: ${e.message}`)
    }
  }

  await browser.close()
  await server.httpServer.close()

  // Now persist — safe to overwrite dist/index.html since the crawl is done.
  for (const { out, html } of rendered) {
    await mkdir(path.dirname(out), { recursive: true })
    await writeFile(out, html, 'utf-8')
  }
  console.log(`\n[prerender] wrote ${rendered.length} pages${failed ? `, ${failed} failed` : ''}.`)
}

main().catch((e) => {
  console.error('[prerender] error:', e)
  // Don't fail the build — the SPA still works without prerendered HTML.
  process.exit(0)
})
