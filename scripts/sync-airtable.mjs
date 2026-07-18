// Build-time Airtable → JSON sync.
//
// Fetches the read-only Airtable content (approved Reviews, DepartureDates,
// BlockedDates) once per build and writes it to src/data/airtable/*.json,
// which the hooks import statically. Visitors therefore never call the
// Airtable API for reads — the free plan's monthly API-call cap is spent
// only on actual bookings — and review text ends up in the prerendered HTML.
//
// Freshness = every deploy (admin publish) + the weekly rebuild Action.
// Date cutoffs ("only future dates") are NOT applied here for that reason:
// the JSON can be up to a week old, so consumers filter >= today at runtime.
//
// Failure policy mirrors the fail-fast prerender: on Netlify/CI a missing
// token or failed fetch fails the build (escape hatch:
// AIRTABLE_SYNC_ALLOW_FAIL=1 keeps the committed JSON and logs loudly).
// Locally it warns and keeps the committed JSON so the repo builds without
// the Airtable PAT. Usage:  node scripts/sync-airtable.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv, airtableCredentials } from './lib/env.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'src/data/airtable')

const IS_CI = Boolean(process.env.NETLIFY || process.env.CI)
const ALLOW_FAIL = process.env.AIRTABLE_SYNC_ALLOW_FAIL === '1'

function bail(message, { transient = false } = {}) {
  if (IS_CI && !ALLOW_FAIL && !transient) {
    console.error(`[sync-airtable] ${message}`)
    console.error('[sync-airtable] Failing the build — set AIRTABLE_SYNC_ALLOW_FAIL=1 to ship the committed JSON instead.')
    process.exit(1)
  }
  console.warn(`[sync-airtable] ${message}`)
  console.warn('[sync-airtable] Keeping the existing committed JSON in src/data/airtable/.')
  process.exit(0)
}

async function fetchAll(token, baseId, table, params = {}) {
  const records = []
  let offset
  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`)
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
    if (offset) url.searchParams.set('offset', offset)
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`Airtable ${table} ${res.status}: ${await res.text()}`)
    const data = await res.json()
    records.push(...(data.records || []))
    offset = data.offset
  } while (offset)
  return records
}

async function main() {
  const { token, baseId } = airtableCredentials(loadEnv())
  if (!token || !baseId) {
    bail('Missing AIRTABLE_TOKEN / AIRTABLE_BASE_ID.')
  }

  // Approved reviews, newest first. TourId is stored as a string because
  // tours use their numeric id while journeys use their slug.
  const reviewRecords = await fetchAll(token, baseId, 'Reviews', {
    filterByFormula: '{Approved}=1',
    'sort[0][field]': 'Date',
    'sort[0][direction]': 'desc',
  })
  const reviews = reviewRecords.map((r) => ({
    id: r.id,
    tourId: String(r.fields.TourId ?? ''),
    name: r.fields.Name || 'Anonymous',
    country: r.fields.Country || '',
    title: r.fields.Title || '',
    review: r.fields.Review || '',
    rating: r.fields.Rating || 5,
    date: r.fields.Date || '',
  }))

  // Journey departure dates, grouped by slug: { [tourSlug]: ['2026-08-01', …] }
  const departureDates = {}
  for (const r of await fetchAll(token, baseId, 'DepartureDates', {})) {
    const slug = r.fields.TourSlug
    const date = r.fields.Date
    if (!slug || !date) continue
    ;(departureDates[slug] ||= []).push(date)
  }
  for (const slug of Object.keys(departureDates)) departureDates[slug].sort()

  // Blocked dates: [{ date, tourSlug }] — empty tourSlug blocks all tours.
  const blockedRecords = await fetchAll(token, baseId, 'BlockedDates', {})
  const blockedDates = blockedRecords
    .map((r) => ({ date: r.fields.Date || '', tourSlug: r.fields.TourSlug || '' }))
    .filter((b) => b.date)

  await mkdir(OUT_DIR, { recursive: true })
  const write = (name, data) =>
    writeFile(path.join(OUT_DIR, name), JSON.stringify(data, null, 2) + '\n', 'utf-8')
  await write('reviews.json', reviews)
  await write('departure-dates.json', departureDates)
  await write('blocked-dates.json', blockedDates)

  console.log(
    `[sync-airtable] wrote ${reviews.length} reviews, ` +
      `${Object.values(departureDates).flat().length} departure dates, ` +
      `${blockedDates.length} blocked dates → src/data/airtable/`
  )
}

main().catch((e) =>
  bail(`sync failed: ${e.message}`, {
    // The monthly API-call cap being exhausted must never block a deploy:
    // shipping with the committed (stale) JSON is strictly better than not
    // shipping — especially since deploying is what stops the API-call burn.
    transient: e.message.includes('BILLING_LIMIT_EXCEEDED'),
  })
)
