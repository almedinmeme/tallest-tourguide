import { useState, useEffect } from 'react'

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TABLE = 'BlockedDates'

let cache = null

export function useBlockedDates() {
  const [blockedDates, setBlockedDates] = useState([])

  useEffect(() => {
    if (!TOKEN || !BASE_ID) return
    if (cache) { setBlockedDates(cache); return }

    const controller = new AbortController()
    const today = new Date().toISOString().split('T')[0]
    const filter = encodeURIComponent(`IS_AFTER({Date},'${today}')`)
    const url =
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE}` +
      `?filterByFormula=${filter}&fields[]=Date&fields[]=TourSlug`

    fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        const parsed = (data.records || []).map((r) => ({
          date: r.fields.Date || '',
          tourSlug: r.fields.TourSlug || '',
        }))
        cache = parsed
        setBlockedDates(parsed)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.warn('useBlockedDates:', err)
      })

    return () => controller.abort()
  }, [])

  // Returns true if the given date is blocked for this tour.
  // A record with an empty TourSlug blocks all tours.
  function isBlocked(slug, date) {
    return blockedDates.some(
      (b) => b.date === date && (b.tourSlug === '' || b.tourSlug === slug)
    )
  }

  return { isBlocked }
}
