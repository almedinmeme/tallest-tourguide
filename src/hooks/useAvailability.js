import { useState, useEffect } from 'react'

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TABLE = 'Bookings'

export function useAvailability() {
  const [bookings, setBookings] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!TOKEN || !BASE_ID) return
    const controller = new AbortController()

    async function fetchBookings() {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const filter = encodeURIComponent(
        `AND({Status}='Confirmed',IS_AFTER({TourDate},'${today}'))`
      )
      const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula=${filter}&fields[]=TourSlug&fields[]=TourDate&fields[]=NumPeople&fields[]=Language`
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${TOKEN}` },
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`Airtable error: ${res.status}`)
        const data = await res.json()
        const map = {}
        ;(data.records || []).forEach((r) => {
          const { TourSlug, TourDate, NumPeople, Language } = r.fields
          if (!TourSlug || !TourDate) return
          const key = `${TourSlug}_${TourDate}_${(Language || '').toLowerCase()}`
          map[key] = (map[key] || 0) + (NumPeople || 0)
        })
        setBookings(map)
      } catch (err) {
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
