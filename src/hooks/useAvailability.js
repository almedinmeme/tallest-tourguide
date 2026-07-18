// Live "spots left" data via /api/availability (a Netlify Function in
// production, admin-server/dev-api.js in dev). The endpoint aggregates
// confirmed future bookings server-side and the CDN caches it, so visitors
// never call Airtable directly and no token ships in the bundle.
import { useState, useEffect } from 'react'

let cache = null

export function useAvailability() {
  const [bookings, setBookings] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cache) { setBookings(cache); return }
    const controller = new AbortController()

    async function fetchBookings() {
      setLoading(true)
      try {
        const res = await fetch('/api/availability', { signal: controller.signal })
        if (!res.ok) throw new Error(`availability error: ${res.status}`)
        const map = await res.json()
        cache = map
        setBookings(map)
      } catch (err) {
        // Fail open: an empty map means full availability is shown.
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
