import { useState, useEffect } from 'react'

const cache = {}

export function usePackageDates(slug) {
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    if (import.meta.env.DEV) { setLoading(false); return }
    if (cache[slug]) { setDates(cache[slug]); setLoading(false); return }
    const today = new Date().toISOString().slice(0, 10)
    const filter = encodeURIComponent(`AND({TourSlug}='${slug}',IS_AFTER({Date},'${today}'))`)
    fetch(
      `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/DepartureDates?filterByFormula=${filter}&fields[]=Date&sort[0][field]=Date&sort[0][direction]=asc`,
      { headers: { Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}` } }
    )
      .then((r) => r.json())
      .then((data) => {
        const ds = (data.records || []).map((r) => r.fields.Date).filter(Boolean)
        cache[slug] = ds
        setDates(ds)
      })
      .catch(() => setDates([]))
      .finally(() => setLoading(false))
  }, [slug])

  return { dates, loading }
}
