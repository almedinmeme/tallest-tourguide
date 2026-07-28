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
import settings, { TRIPADVISOR_URL } from './settings'

const round1 = (n) => Math.round(n * 10) / 10

// What a card calls its source. 'direct' reviews reached us by email or
// message, so they're labelled as what they are rather than borrowing a
// platform's name.
export const SOURCE_LABEL = {
  google: 'Google',
  tripadvisor: 'Tripadvisor',
  direct: 'Guest review',
}

// ── Platform summaries ──────────────────────────────────────────────
// TripAdvisor's numbers can't be fetched (no free API), so they're
// admin-editable in /admin → Settings.
export const tripadvisorStats = {
  source: 'tripadvisor',
  label: 'Tripadvisor',
  rating: Number(settings.tripadvisorRating) || null,
  count: Number(settings.tripadvisorReviewCount) || 0,
  url: TRIPADVISOR_URL || '',
}

export const googleStats = {
  source: 'google',
  label: 'Google',
  rating: typeof google.rating === 'number' ? google.rating : null,
  count: google.userRatingCount || 0,
  url: settings.googleReviewsUrl || google.mapsUri || '',
}

export const platforms = [googleStats, tripadvisorStats].filter((p) => p.rating && p.count)

// Combined headline: ratings weighted by how many reviews each platform has,
// so "4.9 from 300 reviews" stays honest rather than averaging the averages.
export const overallStats = (() => {
  const weighted = platforms.reduce((sum, p) => sum + p.rating * p.count, 0)
  const count = platforms.reduce((sum, p) => sum + p.count, 0)
  return {
    rating: count ? round1(weighted / count) : null,
    count,
  }
})()

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
