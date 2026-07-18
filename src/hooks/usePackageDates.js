import { useState, useEffect } from 'react'
import { packages } from '../data/packages'

const cache = {}

const MONTHS = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
}

// Admin dates are prose like "May 10–15, 2026"; the booking card needs the
// ISO start date ("2026-05-10"). Returns null for anything unparseable.
function proseToISO(text) {
  const m = /^([A-Za-z]+)\s+(\d{1,2})\s*(?:[–—-]\s*\d{1,2})?,\s*(\d{4})$/.exec((text || '').trim())
  if (!m) return null
  const month = MONTHS[m[1].toLowerCase()]
  if (!month) return null
  return `${m[3]}-${String(month).padStart(2, '0')}-${m[2].padStart(2, '0')}`
}

export function usePackageDates(slug) {
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    if (import.meta.env.DEV) {
      // Airtable isn't queried in dev — mirror it with the admin-entered
      // dates from packages.json so the booking card is demoable locally.
      const today = new Date().toISOString().slice(0, 10)
      const pkg = packages.find((p) => p.slug === slug)
      const ds = (pkg?.dates || [])
        .map((d) => proseToISO(d.date))
        .filter((d) => d && d >= today)
        .sort()
      setDates(ds)
      setLoading(false)
      return
    }
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
