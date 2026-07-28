// Dates unavailable for booking, edited in /admin → Availability and baked
// into the bundle (src/data/availability/blocked-dates.json) — no runtime
// API calls. Past dates are filtered out here because the JSON is only as
// fresh as the last deploy.
// Also folds in each tour's fixed weekly schedule (src/data/weekly-availability.json,
// admin-owned — see AvailabilityPage), so a tour that only runs e.g. Monday
// and Tuesday reads as "blocked" every other weekday without a blocked-dates
// record for each individual date.

import blockedDatesData from '../data/availability/blocked-dates.json'
import weeklyAvailability from '../data/weekly-availability.json'

const today = new Date().toISOString().split('T')[0]
const blockedDates = blockedDatesData.filter((b) => b.date >= today)

export function useBlockedDates() {
  // Returns true if the given date is blocked for this tour.
  // A record with an empty TourSlug blocks all tours.
  function isBlocked(slug, date) {
    const explicitlyBlocked = blockedDates.some(
      (b) => b.date === date && (b.tourSlug === '' || b.tourSlug === slug)
    )
    if (explicitlyBlocked) return true

    const allowedDays = weeklyAvailability[slug]
    if (allowedDays && !allowedDays.includes(new Date(`${date}T12:00:00Z`).getDay())) {
      return true
    }
    return false
  }

  return { isBlocked }
}
