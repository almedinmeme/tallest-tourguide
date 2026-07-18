// useReviews.js
// Approved reviews for one tour or journey, from the build-time Airtable
// sync (scripts/sync-airtable.mjs → src/data/airtable/reviews.json).
// No runtime API calls; data refreshes on every deploy. tourId keys are
// compared as strings — tours use their numeric id, journeys their slug.

import { useMemo } from 'react'
import allReviews from '../data/airtable/reviews.json'

export function useReviews(tourId) {
  const reviews = useMemo(() => {
    if (!tourId) return []
    const key = String(tourId)
    return allReviews.filter((r) => r.tourId === key)
  }, [tourId])

  return { reviews, loading: false, error: null }
}
