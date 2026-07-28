// Shared booking submission, used by the /checkout screen for both day
// tours and journeys.
//
//   1. Save the booking via /api/submit — a Google Calendar event that holds
//      the seats, plus a row in the booking ledger. AWAITED.
//   2. Send the customer confirmation email (best-effort).
//   3. Send the admin notification email — this is the promise we surface,
//      so callers can show a success / error state.
//   4. On success, fire the GA4 `purchase` event.
//
// ── Why step 1 is awaited but still can't fail the booking ─────────────
// It used to be fire-and-forget, which was survivable when Airtable was
// just a copy of the data. It isn't now: the calendar is what decides how
// many seats are left, so a silently dropped write means the seat gets
// resold. But making it hard-fail would be worse in the other direction —
// telling a guest "booking failed" after the payment step because Google
// returned a transient 503 is a support disaster.
//
// So the failure is made loud to the OWNER instead of to the guest: the
// outcome rides along in the admin email as `calendar_status`. The booking
// completes, and the owner is told to add it by hand.
//
// The one exception — and the only hard failure here — is a 409: the date
// genuinely sold out (or this is a duplicate submit) while the guest was
// filling in the form. Taking money for a seat that doesn't exist is worse
// than an apology, so that one throws.
import { sendEmail } from './email'
import { trackEvent } from './analytics'
import { invalidateAvailability } from '../hooks/useAvailability'

export async function submitBooking({ bookingFields, templateParams, analytics }) {
  let calendarStatus = ''
  let bookingRef = bookingFields?.bookingId || ''

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking: bookingFields, website: '' }),
    })
    const data = await res.json().catch(() => ({}))

    if (res.status === 409) {
      const err = new Error(data.error || 'That date is no longer available.')
      err.code = 'SOLD_OUT'
      throw err
    }
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)

    bookingRef = data.bookingId || bookingRef
    calendarStatus = data.calendarStatus === 'ok'
      ? 'Saved to the Bookings calendar.'
      : `Calendar: ${data.calendarStatus || 'unknown'}`
  } catch (err) {
    if (err.code === 'SOLD_OUT') throw err
    console.warn('booking save failed:', err)
    calendarStatus = '⚠ NOT SAVED TO CALENDAR — add this booking manually.'
  }

  // The seats just changed, so the cached availability map is stale. Without
  // this a guest booking twice in one session sees the pre-booking numbers.
  invalidateAvailability()

  const params = { ...templateParams, calendar_status: calendarStatus, booking_ref: bookingRef }

  // Customer confirmation — best-effort.
  sendEmail('bookingConfirmation', params).catch(() => {})

  // Admin notification — the promise the caller awaits.
  const res = await sendEmail('bookingAdmin', params)
  if (analytics) trackEvent('purchase', analytics)
  return res
}

// Placeholder for the real payment gateway.
// Today this just simulates a brief "processing" step and resolves — no card
// is charged. When a real gateway is wired up (Stripe Checkout redirect or
// Payment Element), replace the body of this function; the rest of the
// checkout flow stays the same.
export function processCardPayment() {
  return new Promise((resolve) => setTimeout(resolve, 700))
}
