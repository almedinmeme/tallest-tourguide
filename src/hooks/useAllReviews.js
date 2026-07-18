// Review stats grouped by TourId, from the build-time Airtable sync
// (src/data/airtable/reviews.json) — no runtime API calls.
// Returns a stats map: { [tourId]: { count, avgRating } }
// tourId keys are strings — tours use String(tour.id), packages use pkg.slug.

import reviews from '../data/airtable/reviews.json'

const grouped = {}
for (const r of reviews) {
  const key = r.tourId
  if (!key) continue
  if (!grouped[key]) grouped[key] = { count: 0, total: 0 }
  grouped[key].count++
  grouped[key].total += r.rating || 5
}

const stats = {}
for (const [key, val] of Object.entries(grouped)) {
  stats[key] = {
    count: val.count,
    avgRating: Math.round((val.total / val.count) * 10) / 10,
  }
}

export function useAllReviews() {
  return { stats, loading: false }
}
