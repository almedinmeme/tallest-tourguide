// Dates unavailable for booking, from the build-time Airtable sync
// (src/data/airtable/blocked-dates.json) — no runtime API calls.
// The sync keeps ALL records; past dates are filtered out here because the
// JSON can be up to a week old between rebuilds.

import blockedDatesData from '../data/airtable/blocked-dates.json'

const today = new Date().toISOString().split('T')[0]
const blockedDates = blockedDatesData.filter((b) => b.date >= today)

export function useBlockedDates() {
  // Returns true if the given date is blocked for this tour.
  // A record with an empty TourSlug blocks all tours.
  function isBlocked(slug, date) {
    return blockedDates.some(
      (b) => b.date === date && (b.tourSlug === '' || b.tourSlug === slug)
    )
  }

  return { isBlocked }
}
