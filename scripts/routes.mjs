// Single source of truth for the site's routes.
// Read by BOTH vite.config.js (sitemap `dynamicRoutes`) and
// scripts/prerender.mjs, so adding content (a tour, a destination) flows
// into the sitemap and the prerendered static HTML automatically.
//
// Note: /journal post pages come from Airtable at runtime, so they can't be
// enumerated at build time and are intentionally omitted here.

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
  const packages = readJson('src/data/packages.json').map((p) => `/packages/${p.slug}`)
  const destinations = readJson('src/data/destinations.json').map((d) => `/destinations/${d.slug}`)
  // De-dupe while preserving order.
  return [...new Set([...STATIC_ROUTES, ...tours, ...packages, ...destinations])]
}

export default getRoutes
