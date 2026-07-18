// Single source of truth for the site's routes.
// Read by scripts/prerender.mjs (static HTML) and scripts/sitemap.mjs, so
// adding content (a tour, a destination, a journal post) flows into the
// sitemap and the prerendered static HTML automatically.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function readJson(rel) {
  try {
    return JSON.parse(readFileSync(path.join(ROOT, rel), 'utf-8'))
  } catch {
    return []
  }
}

// Static, content-light or editorial routes that always exist.
const STATIC_ROUTES = [
  '/',
  '/tours',
  '/multi-day-tours',
  '/destinations',
  '/about',
  '/hospitality',
  '/signature',
  '/partners',
  '/consult',
  '/where-we-stay',
  '/journal',
  '/contact',
  '/personalised',
  '/booking-conditions',
  '/safe-travels',
  '/practical-info',
  '/bosnia-guide',
]

export function getRoutes() {
  const tours = readJson('src/data/tours.json').map((t) => `/tours/${t.slug}`)
  const packages = readJson('src/data/packages.json').map((p) => `/multi-day-tours/${p.slug}`)
  const destinations = readJson('src/data/destinations.json').map((d) => `/destinations/${d.slug}`)
  const journal = readJson('src/data/journal.json')
    .filter((p) => p.published !== false && p.slug)
    .map((p) => `/journal/${p.slug}`)
  // De-dupe while preserving order.
  return [...new Set([...STATIC_ROUTES, ...tours, ...packages, ...destinations, ...journal])]
}

export default getRoutes
