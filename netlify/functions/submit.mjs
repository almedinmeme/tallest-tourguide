// POST /api/submit  (via the /api/* redirect in public/_redirects)
//
// The single write endpoint for bookings: creates the Google Calendar event
// that holds the seats and appends a row to the booking ledger. Credentials
// stay server-side, so the client bundle carries none.
//
// This used to accept a `table` and write to Airtable. It is bookings-only
// now — reviews moved to Google/Tripadvisor — so the body is simply:
//   { booking: {...}, website?: '' }
// `website` is a honeypot: bots that fill the hidden input get a fake
// success and nothing is written.

import { parseServiceAccount } from './_lib/google-auth.mjs'
import { validateBooking, MAX_BODY_BYTES } from './_lib/gcal.mjs'
import { submitBooking } from './_lib/booking.mjs'

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body
  try {
    const raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ error: 'Payload too large' }, { status: 413 })
    }
    body = JSON.parse(raw)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body?.website === 'string' && body.website.trim() !== '') {
    return Response.json({ ok: true }) // honeypot tripped — silently drop
  }

  let booking
  try {
    booking = validateBooking(body?.booking)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 })
  }

  const sa = parseServiceAccount(process.env.GOOGLE_SA_KEY_B64 || '')
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!sa || !calendarId) {
    console.error('submit: Google Calendar credentials not configured')
    return Response.json({ error: 'Booking storage not configured' }, { status: 503 })
  }

  // The ledger is valuable but not load-bearing: without a sheet id we still
  // take the booking rather than turning it away.
  const sheetId = process.env.GOOGLE_SHEET_ID || ''

  const result = await submitBooking({ sa, calendarId, sheetId, booking })
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status })
  }
  return Response.json(result)
}
