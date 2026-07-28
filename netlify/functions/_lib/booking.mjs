// One booking submission, start to finish. Shared by the production
// Netlify Function (netlify/functions/submit.mjs) and the dev mirror
// (admin-server/dev-api.js) so the write ORDER can't drift between them —
// which matters, because the order is what makes the ledger trustworthy.
//
// ── Why calendar first, then ledger ────────────────────────────────────
// 1. The calendar write is the only step that can REJECT a booking: the
//    date sold out, or this is a retry of one we already wrote.
// 2. On a rejection we stop, and no ledger row is written — the booking
//    didn't happen, so recording it would be a lie.
// 3. Otherwise the ledger row is written either way, carrying the calendar
//    outcome. A Google Calendar outage therefore still leaves a permanent
//    record, and the row itself tells you which bookings need re-entering.
//
// Neither a calendar failure nor a ledger failure is fatal to the guest.
// Both surface in the admin notification email instead (see the
// calendar_status template param in src/utils/booking.js): losing a booking
// silently is far worse than telling the owner to check something.

import { createBooking } from './gcal.mjs'
import { appendBookingRow } from './gsheet.mjs'

export async function submitBooking({ sa, calendarId, sheetId, booking }) {
  const calendar = await createBooking({ sa, calendarId, booking })

  // Sold out / duplicate — the one case the guest is told about.
  if (!calendar.ok && calendar.status === 409) {
    return { ok: false, status: 409, error: calendar.error }
  }

  const calendarStatus = calendar.ok
    ? (calendar.duplicate ? 'ok (duplicate submit ignored)' : 'ok')
    : `FAILED: ${calendar.error}`

  if (!calendar.ok) {
    console.error('submit: calendar write failed —', calendar.error)
  }

  let ledgerStatus = 'skipped (no sheet configured)'
  if (sheetId) {
    const ledger = await appendBookingRow({
      sa,
      sheetId,
      booking,
      result: { calendarStatus, eventId: calendar.eventId },
    })
    ledgerStatus = ledger.ok ? 'ok' : `FAILED: ${ledger.error}`
    if (!ledger.ok) console.error('submit: ledger append failed —', ledger.error)
  }

  return {
    // The guest's booking succeeds even when Google didn't cooperate; the
    // owner finds out via calendarStatus in the admin email.
    ok: true,
    status: 200,
    eventId: calendar.eventId || '',
    bookingId: booking.bookingId || '',
    calendarStatus,
    ledgerStatus,
  }
}
