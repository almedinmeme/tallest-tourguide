// One feed for the homepage reviews section: the synced Google reviews
// (src/data/google/reviews.json, written at build time by
// scripts/sync-google-reviews.mjs) merged with the curated TripAdvisor
// highlights in featuredReviews.js, plus the headline rating numbers.
//
// Everything is static — no runtime API calls, so the reviews are in the
// prerendered HTML. Before the Place ID and API key are configured the Google
// side is simply empty and the section shows the TripAdvisor highlights alone.

import google from './google/reviews.json'
import { publishedFeaturedReviews } from './featuredReviews'
import settings from './settings'

// ── Platform summaries ──────────────────────────────────────────────
// Defined in reviewStats.js and re-exported here, so the schema can quote
// the same numbers without pulling the review cards into the main bundle.
// Imported as well as re-exported — the card builders below use them.
import {
  tripadvisorStats,
  googleStats,
  platforms,
  overallStats,
} from './reviewStats'

export { tripadvisorStats, googleStats, platforms, overallStats }

// What a card calls its source. 'direct' reviews reached us by email or
// message, so they're labelled as what they are rather than borrowing a
// platform's name.
export const SOURCE_LABEL = {
  google: 'Google',
  tripadvisor: 'Tripadvisor',
  direct: 'Guest review',
}

// ── The cards ───────────────────────────────────────────────────────
// Google reviews an admin has hidden under /admin → Reviews. Hiding one only
// removes the card — the rating and count in the headline stay Google's own.
const hiddenGoogleIds = new Set(settings.hiddenGoogleReviewIds || [])

const googleCards = (google.reviews || []).filter((r) => !hiddenGoogleIds.has(r.id)).map((r) => ({
  id: r.id,
  source: 'google',
  name: r.authorName,
  // Google gives no location or tour name — the relative time is what it
  // requires us to show instead, and it doubles as the freshness signal.
  location: '',
  tour: '',
  meta: r.relativeTime,
  rating: r.rating,
  text: r.text,
  photo: r.authorPhoto,
  url: r.url || googleStats.url,
}))

const platformUrl = { google: googleStats.url, tripadvisor: tripadvisorStats.url }

const curatedCards = publishedFeaturedReviews.map((r) => ({
  id: `f-${r.id}`,
  // 'direct' reviews came to us by email or message rather than a platform, so
  // they carry no logo — claiming a platform badge for them would be a lie.
  source: r.source || 'tripadvisor',
  name: r.name,
  location: r.location,
  tour: r.tour,
  meta: r.date
    ? new Date(`${r.date}-01`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : '',
  rating: r.rating,
  text: r.text,
  photo: '',
  url: platformUrl[r.source] || '',
}))

// Interleave so the grid always reads as a mix of both platforms instead of
// three Google cards followed by three TripAdvisor ones.
function interleave(a, b) {
  const out = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i])
    if (b[i]) out.push(b[i])
  }
  return out
}

export const reviewCards = interleave(googleCards, curatedCards)

export default reviewCards
