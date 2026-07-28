import { useMemo } from 'react'
import departureDates from '../data/availability/departure-dates.json'

// Journey departure dates, edited in /admin → Availability and baked into
// the bundle at build time — no fetch, no loading state, but the hook keeps
// its { dates, loading } contract for the consumers.
//
// Past dates are filtered here rather than at write time because the JSON is
// only as fresh as the last deploy.
//
// There used to be a DEV-only branch that also mixed in the prose dates from
// packages.json, so the booking card was demoable without a fresh Airtable
// sync. It's gone: these dates are admin-owned now, and having dev show a
// different list from production turns "I saved it and the site doesn't show
// it" into a support ticket instead of a bug you can see.
export function usePackageDates(slug) {
  const dates = useMemo(() => {
    if (!slug) return []
    const today = new Date().toISOString().slice(0, 10)
    return (departureDates[slug] || []).filter((d) => d >= today)
  }, [slug])

  return { dates, loading: false }
}
