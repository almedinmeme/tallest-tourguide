// The booking ledger: one Google Sheet row per submission, forever.
//
// This is the piece that replaces what Airtable was actually useful for —
// a spreadsheet of every booking you can sort, filter, pivot and export.
// It shares the service account and access token with _lib/gcal.mjs, so it
// costs one env var and one extra API call, not a second vendor.
//
// ── Append-only, and nothing reads it ──────────────────────────────────
// No code path anywhere depends on this sheet. That is the whole point:
// you can re-sort it, add columns to the right, or build pivot tables on
// it without any chance of breaking the site. The moment something starts
// reading a column by position, that freedom is gone and you have rebuilt
// Airtable — so if a future feature needs booking history, it should read
// the calendar via gcal.fetchBookings() instead.
//
// Consequently a failure here is never fatal. The caller reports it into
// the admin notification email and the booking still completes.

import { googleFetch, googleError } from './google-auth.mjs'

const API = 'https://sheets.googleapis.com/v4/spreadsheets'
const TAB = 'Bookings'

// Column order must match the header row in the spreadsheet. Append-only in
// both senses: add new columns at the END, never in the middle, or historic
// rows stop lining up with their headers.
export const LEDGER_COLUMNS = [
  'bookedAt', 'bookingId', 'tourSlug', 'tourName', 'tourDate', 'startTime',
  'numPeople', 'language', 'tourType', 'guestName', 'guestEmail', 'guestPhone',
  'totalPrice', 'discountCode', 'accommodation', 'calendarStatus', 'eventId',
]

export async function appendBookingRow({ sa, sheetId, booking, result = {} }) {
  if (!sa || !sheetId) return { ok: false, error: 'Ledger not configured' }

  const row = [
    new Date().toISOString(),
    booking.bookingId || '',
    booking.tourSlug || '',
    booking.tourName || '',
    booking.tourDate || '',
    booking.startTime || '',
    booking.numPeople ?? '',
    booking.language || '',
    booking.tourType || '',
    booking.guestName || '',
    booking.guestEmail || '',
    booking.guestPhone || '',
    booking.totalPrice ?? '',
    booking.discountCode || '',
    booking.accommodation || '',
    result.calendarStatus || '',
    result.eventId || '',
  ]

  const url = new URL(`${API}/${encodeURIComponent(sheetId)}/values/${TAB}!A:A:append`)
  // USER_ENTERED so dates and numbers land as dates and numbers rather than
  // as text you'd have to re-type before you could sum a column.
  url.searchParams.set('valueInputOption', 'USER_ENTERED')
  url.searchParams.set('insertDataOption', 'INSERT_ROWS')

  const res = await googleFetch(sa, url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  })
  if (!res.ok) {
    return { ok: false, error: await googleError(res, 'Sheets values.append') }
  }
  return { ok: true }
}
