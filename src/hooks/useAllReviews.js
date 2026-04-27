// Fetches ALL approved reviews in one API call and groups them by TourId.
// Returns a stats map: { [tourId]: { count, avgRating } }
// tourId keys are strings — tours use String(tour.id), packages use pkg.slug.

import { useState, useEffect } from 'react'

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TABLE = 'Reviews'

let cache = null

export function useAllReviews() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!TOKEN || !BASE_ID) return

    if (cache) {
      setStats(cache)
      return
    }

    const controller = new AbortController()

    async function fetchAll() {
      setLoading(true)
      const formula = encodeURIComponent(`{Approved}=1`)
      const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula=${formula}&pageSize=100`

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${TOKEN}` },
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`Airtable error: ${res.status}`)
        const data = await res.json()

        const grouped = {}
        for (const r of data.records || []) {
          const key = String(r.fields.TourId ?? '')
          if (!key) continue
          if (!grouped[key]) grouped[key] = { count: 0, total: 0 }
          grouped[key].count++
          grouped[key].total += r.fields.Rating || 5
        }

        const result = {}
        for (const [key, val] of Object.entries(grouped)) {
          result[key] = {
            count: val.count,
            avgRating: Math.round((val.total / val.count) * 10) / 10,
          }
        }

        cache = result
        setStats(result)
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('useAllReviews: failed to fetch', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
    return () => controller.abort()
  }, [])

  return { stats, loading }
}
