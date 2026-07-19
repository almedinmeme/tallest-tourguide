// Live "spots left" data via /api/availability (a Netlify Function in
// production, admin-server/dev-api.js in dev). The endpoint aggregates
// confirmed future bookings server-side and the CDN caches it, so visitors
// never call Airtable directly and no token ships in the bundle.
//
// Manual (OTA) bookings entered in /admin/availability are baked into the
// bundle and ALWAYS count, on top of whatever the live endpoint returns —
// including when it fails (seats sold on external channels must never be
// resold just because Airtable is down).
import { useState, useEffect } from 'react'
import manualBookings from '../data/manual-bookings.json'

const manualMap = {}
for (const b of manualBookings) {
  if (!b.tourSlug || !b.date || !b.numPeople) continue
  const key = `${b.tourSlug}_${b.date}_${(b.language || '').toLowerCase()}`
  manualMap[key] = (manualMap[key] || 0) + Number(b.numPeople)
}

function withManual(liveMap) {
  const merged = { ...manualMap }
  for (const [key, count] of Object.entries(liveMap || {})) {
    merged[key] = (merged[key] || 0) + count
  }
  return merged
}

let cache = null

export function useAvailability() {
  const [bookings, setBookings] = useState(manualMap)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cache) { setBookings(cache); return }
    const controller = new AbortController()

    async function fetchBookings() {
      setLoading(true)
      try {
        const res = await fetch('/api/availability', { signal: controller.signal })
        if (!res.ok) throw new Error(`availability error: ${res.status}`)
        const map = withManual(await res.json())
        cache = map
        setBookings(map)
      } catch (err) {
        // Fail open on the live half: manual bookings still apply.
        if (err.name !== 'AbortError') console.warn('useAvailability:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
    return () => controller.abort()
  }, [])

  function getSpotsLeft(slug, date, language, groupSize) {
    if (!slug || !date || !groupSize) return null
    const key = `${slug}_${date}_${(language || '').toLowerCase()}`
    const booked = bookings[key] || 0
    return Math.max(0, groupSize - booked)
  }

  return { getSpotsLeft, loading, bookings }
}
