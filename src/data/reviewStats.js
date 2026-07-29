// The headline rating numbers, and nothing else.
//
// Split out of reviewFeed.js so the site-wide schema in SiteSchema.jsx can
// state the business rating without dragging the review *cards* — and
// featuredReviews.json with them — into the main bundle. reviewFeed.js
// re-exports these, so there is still one definition of the maths.

import google from './google/reviews.json'
import settings, { TRIPADVISOR_URL } from './settings'

const round1 = (n) => Math.round(n * 10) / 10

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
