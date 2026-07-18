// Shared Airtable core used by both Netlify Functions (production) and the
// dev API plugin (admin-server/dev-api.js), so the two transports can never
// drift. The underscore directory keeps this from being deployed as a
// function itself.

const API = 'https://api.airtable.com/v0'

// Confirmed future bookings, aggregated into the availability map the
// client's useAvailability hook consumes:
//   { "<tourSlug>_<date>_<language lowercase>": totalPeopleBooked }
export async function fetchAvailability({ token, baseId }) {
  const today = new Date().toISOString().split('T')[0]
  const map = {}
  let offset
  do {
    const url = new URL(`${API}/${baseId}/Bookings`)
    url.searchParams.set(
      'filterByFormula',
      `AND({Status}='Confirmed',IS_AFTER({TourDate},'${today}'))`
    )
    for (const f of ['TourSlug', 'TourDate', 'NumPeople', 'Language']) {
      url.searchParams.append('fields[]', f)
    }
    if (offset) url.searchParams.set('offset', offset)
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`)
    const data = await res.json()
    for (const r of data.records || []) {
      const { TourSlug, TourDate, NumPeople, Language } = r.fields
      if (!TourSlug || !TourDate) continue
      const key = `${TourSlug}_${TourDate}_${(Language || '').toLowerCase()}`
      map[key] = (map[key] || 0) + (NumPeople || 0)
    }
    offset = data.offset
  } while (offset)
  return map
}

// Only these tables accept submissions, and only these fields survive —
// everything else a client sends is dropped. `force` values are set
// server-side and cannot be overridden by the client (a review can't
// approve itself with a doctored request, and bookings always arrive
// as Pending).
const SUBMIT_TABLES = {
  Bookings: {
    fields: [
      'TourSlug', 'TourName', 'TourDate', 'StartTime', 'NumPeople',
      'TourType', 'Language', 'Accommodation', 'TotalPrice',
      'GuestName', 'GuestEmail', 'GuestPhone', 'DiscountCode',
    ],
    force: { Status: 'Pending' },
  },
  Reviews: {
    fields: ['Name', 'Country', 'Title', 'Review', 'Rating', 'TourId', 'TourName', 'Date'],
    // Reviews go live immediately (current site behavior). Flip to false
    // here to switch to manual moderation via the Approved checkbox.
    force: { Approved: true },
  },
}

// Validates and writes one record. Returns { ok, status, error }.
export async function submitRecord({ token, baseId, table, fields }) {
  const spec = SUBMIT_TABLES[table]
  if (!spec) return { ok: false, status: 400, error: `Unknown table: ${table}` }
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
    return { ok: false, status: 400, error: 'Missing fields' }
  }

  const clean = {}
  for (const key of spec.fields) {
    const v = fields[key]
    if (v === undefined || v === null || v === '') continue
    if (typeof v !== 'string' && typeof v !== 'number') {
      return { ok: false, status: 400, error: `Invalid value for ${key}` }
    }
    clean[key] = v
  }
  Object.assign(clean, spec.force)

  const res = await fetch(`${API}/${baseId}/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: clean }),
  })
  if (!res.ok) {
    let message = `Airtable ${res.status}`
    try {
      const data = await res.json()
      message = data?.error?.message || data?.message || message
    } catch { /* keep generic message */ }
    return { ok: false, status: 502, error: message }
  }
  return { ok: true, status: 200 }
}

// Parses/validates a /api/submit request body (already JSON.parse'd).
// Returns { table, fields } or throws with a client-safe message.
export function validateSubmitBody(body) {
  if (!body || typeof body !== 'object') throw new Error('Invalid body')
  const { table, fields } = body
  if (typeof table !== 'string' || !SUBMIT_TABLES[table]) throw new Error('Unknown table')
  return { table, fields }
}

export const MAX_BODY_BYTES = 10_000
