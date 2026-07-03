// Sitemap generator — replaces vite-plugin-sitemap, whose URL normalization
// stripped the trailing slashes our canonicals require (Netlify serves the
// prerendered directories at /route/, so slashless sitemap entries all 301).
//
// Called from scripts/prerender.mjs with the same route list that drives the
// prerender, so the sitemap and static HTML can never drift apart.

import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://tallesttourguide.com'

const LISTING_ROUTES = ['/tours', '/multi-day-tours', '/destinations', '/journal']
const EVERGREEN_ROUTES = ['/booking-conditions', '/safe-travels', '/practical-info']

function journalLastmods() {
  try {
    const posts = JSON.parse(readFileSync(path.join(ROOT, 'src/data/journal.json'), 'utf-8'))
    return new Map(
      posts
        .filter((p) => p.slug && (p.updatedDate || p.publishedDate))
        .map((p) => [`/journal/${p.slug}`, (p.updatedDate || p.publishedDate).slice(0, 10)]),
    )
  } catch {
    return new Map()
  }
}

// Realistic signals instead of the old blanket daily/1.0 on every URL:
// listings change weekly, detail pages monthly, legal pages ~never.
// lastmod only where we genuinely know it (journal publish dates) — Google
// ignores lastmod unless it's consistently accurate.
function classify(route, lastmods) {
  if (route === '/') return { changefreq: 'weekly', priority: '1.0' }
  if (LISTING_ROUTES.includes(route)) return { changefreq: 'weekly', priority: '0.9' }
  if (route.startsWith('/journal/')) {
    return { changefreq: 'monthly', priority: '0.7', lastmod: lastmods.get(route) }
  }
  if (/^\/(tours|packages|destinations)\//.test(route)) return { changefreq: 'monthly', priority: '0.8' }
  if (EVERGREEN_ROUTES.includes(route)) return { changefreq: 'yearly', priority: '0.3' }
  return { changefreq: 'monthly', priority: '0.6' }
}

function urlFor(route) {
  const clean = route.replace(/^\/+|\/+$/g, '')
  return clean ? `${ORIGIN}/${clean}/` : `${ORIGIN}/`
}

export function writeSitemap(routes, distDir) {
  const lastmods = journalLastmods()
  const entries = routes.map((route) => {
    const { changefreq, priority, lastmod } = classify(route, lastmods)
    return [
      '  <url>',
      `    <loc>${urlFor(route)}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n')
  })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')

  writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf-8')
  return routes.length
}

export default writeSitemap
