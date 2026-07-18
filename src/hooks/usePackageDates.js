import { useMemo } from 'react'
import { packages } from '../data/packages'
import departureDates from '../data/airtable/departure-dates.json'

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

// Dates are static now (bundled at build time), so no fetch, no loading
// state — the hook keeps its { dates, loading } contract for the consumers.
export function usePackageDates(slug) {
  const dates = useMemo(() => {
    if (!slug) return []
    const today = new Date().toISOString().slice(0, 10)
    if (import.meta.env.DEV) {
      // In dev, mirror the admin-entered dates from packages.json so the
      // booking card is demoable locally without a fresh Airtable sync.
      const pkg = packages.find((p) => p.slug === slug)
      return (pkg?.dates || [])
        .map((d) => proseToISO(d.date))
        .filter((d) => d && d >= today)
        .sort()
    }
    // Production: dates come from the build-time Airtable sync
    // (src/data/airtable/departure-dates.json). The sync keeps all records,
    // so filter out past dates here — the JSON can be up to a week old.
    return (departureDates[slug] || []).filter((d) => d >= today)
  }, [slug])

  return { dates, loading: false }
}
