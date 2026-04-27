import { useState, useEffect } from 'react'

export function usePackageDates(slug) {
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const today = new Date().toISOString().slice(0, 10)
    const filter = encodeURIComponent(`AND({TourSlug}='${slug}',IS_AFTER({Date},'${today}'))`)
    fetch(
      `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/DepartureDates?filterByFormula=${filter}&fields[]=Date&sort[0][field]=Date&sort[0][direction]=asc`,
      { headers: { Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}` } }
    )
      .then((r) => r.json())
      .then((data) => {
        const ds = (data.records || []).map((r) => r.fields.Date).filter(Boolean)
        setDates(ds)
      })
      .catch(() => setDates([]))
      .finally(() => setLoading(false))
  }, [slug])

  return { dates, loading }
}
