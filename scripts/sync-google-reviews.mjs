// Build-time Google → JSON sync.
//
// Fetches the Google Business Profile rating and the reviews Google exposes
// for our Place once per build (Places API New, Place Details) and writes them
// to src/data/google/reviews.json, which the reviews section imports
// statically. The API key therefore never reaches the browser bundle and the
// review text ends up in the prerendered HTML for SEO.
//
// Freshness = every deploy (admin publish) + the weekly rebuild Action, which
// also keeps us inside Google's caching terms.
//
// Google only ever returns up to five reviews and picks which ones — there is
// no "all reviews" endpoint. The section pairs them with the curated
// highlights in src/data/featuredReviews.js.
//
// Failure policy is deliberately softer than sync-airtable: Google reviews are
// supplementary social proof, so a missing key or a failed fetch keeps the
// committed JSON and logs loudly instead of failing the deploy. Set
// GOOGLE_REVIEWS_SYNC_STRICT=1 to fail the build on CI instead.
//
// Setup:
//   1. Google Cloud console → enable "Places API (New)" → create an API key,
//      restricted to that API. Never expose it client-side.
//   2. Put the Place ID in src/data/settings.json ("googlePlaceId", editable
//      in /admin → Settings) or in GOOGLE_PLACE_ID.
//   3. GOOGLE_MAPS_API_KEY=… in .env locally and in the Netlify build env.
// Step-by-step walkthrough: docs/google-reviews-setup.md
//
// Usage:  node scripts/sync-google-reviews.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from './lib/env.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'src/data/google')
const OUT_FILE = path.join(OUT_DIR, 'reviews.json')
const SETTINGS_FILE = path.join(ROOT, 'src/data/settings.json')

const IS_CI = Boolean(process.env.NETLIFY || process.env.CI)
const STRICT = process.env.GOOGLE_REVIEWS_SYNC_STRICT === '1'

function bail(message) {
  if (IS_CI && STRICT) {
    console.error(`[sync-google-reviews] ${message}`)
    console.error('[sync-google-reviews] Failing the build — GOOGLE_REVIEWS_SYNC_STRICT=1 is set.')
    process.exit(1)
  }
  console.warn(`[sync-google-reviews] ${message}`)
  console.warn('[sync-google-reviews] Keeping the existing committed src/data/google/reviews.json.')
  process.exit(0)
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf-8'))
  } catch {
    return fallback
  }
}

// The field mask is billed per SKU — rating/userRatingCount/reviews put this
// call in the Enterprise + Atmosphere tier, so keep it to what we render.
const FIELD_MASK = [
  'id',
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'reviews',
].join(',')

async function fetchPlace(placeId, key) {
  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`)
  // Ask for English so a German or Bosnian review arrives translated rather
  // than in a language most of the site's visitors can't read.
  url.searchParams.set('languageCode', 'en')

  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': FIELD_MASK,
    },
  })
  if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`)
  return res.json()
}

// Google's terms require the review to keep its attribution: author name,
// their profile photo, the relative time ("2 months ago") and a link back to
// the review on Google. All of that is carried through here and rendered.
function normalise(review) {
  const author = review.authorAttribution || {}
  return {
    id: review.name || `${author.displayName}-${review.publishTime}`,
    rating: review.rating || 5,
    text: (review.originalText?.languageCode === 'en'
      ? review.originalText?.text
      : review.text?.text) || review.text?.text || '',
    relativeTime: review.relativePublishTimeDescription || '',
    publishTime: review.publishTime || '',
    authorName: author.displayName || 'Google user',
    authorPhoto: author.photoUri || '',
    authorUrl: author.uri || '',
    url: review.googleMapsUri || '',
  }
}

async function main() {
  const env = loadEnv()
  const key = env.GOOGLE_MAPS_API_KEY || env.GOOGLE_PLACES_API_KEY || ''
  const settings = await readJson(SETTINGS_FILE, {})
  const placeId = env.GOOGLE_PLACE_ID || settings.googlePlaceId || ''

  if (!key) bail('Missing GOOGLE_MAPS_API_KEY.')
  if (!placeId) bail('No Place ID — set googlePlaceId in /admin → Settings (or GOOGLE_PLACE_ID).')

  const place = await fetchPlace(placeId, key)
  const reviews = (place.reviews || [])
    .map(normalise)
    .filter((r) => r.text.trim())
    // Newest first; Google returns its own "most relevant" order.
    .sort((a, b) => (b.publishTime || '').localeCompare(a.publishTime || ''))

  const payload = {
    placeId: place.id || placeId,
    rating: typeof place.rating === 'number' ? place.rating : null,
    userRatingCount: place.userRatingCount || 0,
    // Where "read all reviews on Google" points when no explicit URL is set.
    mapsUri: place.googleMapsUri || '',
    reviews,
    fetchedAt: new Date().toISOString(),
  }

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf-8')

  console.log(
    `[sync-google-reviews] wrote ${reviews.length} reviews, ` +
      `${payload.rating ?? '—'} ★ from ${payload.userRatingCount} ratings → src/data/google/reviews.json`
  )
}

main().catch((e) => bail(`sync failed: ${e.message}`))
