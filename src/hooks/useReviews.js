// useReviews.js
// Fetches approved reviews for a specific tour or package from Airtable.
// Only records where Approved = true are returned.
// Results are cached per tourId for the lifetime of the page session.

import { useState, useEffect } from 'react'

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TABLE = 'Reviews'

// Simple in-memory cache so navigating between tours
// doesn't re-fetch data we already have this session.
const cache = {}

export function useReviews(tourId) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tourId || !TOKEN || !BASE_ID) return

    // Return cached result immediately if available
    if (cache[tourId]) {
      setReviews(cache[tourId])
      return
    }

    const controller = new AbortController()

    async function fetchReviews() {
      setLoading(true)
      setError(null)

      // Filter: Approved = true AND TourId matches
      // Airtable formula syntax requires URL encoding
      const formula = encodeURIComponent(
        `AND({Approved}=1, {TourId}=${tourId})`
      )
      const sort = encodeURIComponent(JSON.stringify([{ field: 'Date', direction: 'desc' }]))
      const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula=${formula}&sort%5B0%5D%5Bfield%5D=Date&sort%5B0%5D%5Bdirection%5D=desc`

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${TOKEN}` },
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(`Airtable error: ${res.status}`)

        const data = await res.json()
        const parsed = (data.records || []).map((r) => ({
          id: r.id,
          name: r.fields.Name || 'Anonymous',
          title: r.fields.Title || '',
          review: r.fields.Review || '',
          rating: r.fields.Rating || 5,
          date: r.fields.Date || '',
        }))

        cache[tourId] = parsed
        setReviews(parsed)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('useReviews: failed to fetch', err)
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
    return () => controller.abort()
  }, [tourId])

  return { reviews, loading, error }
}