// Shared booking submission.
// Extracted from the (previously duplicated) handleBooking logic in
// TourDetail.jsx and PackageDetail.jsx so the new /checkout screen and any
// future flow submit a booking the same way.
//
// Behavior is intentionally identical to the old inline version:
//   1. Save the booking via /api/submit → Airtable (best-effort, never blocks).
//   2. Send the customer confirmation email (best-effort).
//   3. Send the admin notification email — this is the promise we surface,
//      so callers can show a success / error state.
//   4. On success, fire the GA4 `purchase` event.
import { sendEmail } from './email'
import { trackEvent } from './analytics'

export function submitBooking({ airtableFields, templateParams, analytics }) {
  // Airtable — best-effort. A failure here (e.g. unknown field) must never
  // stop the booking, so we only warn.
  fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table: 'Bookings', fields: airtableFields, website: '' }),
  }).catch((err) => console.warn('Airtable booking save failed:', err))

  // Customer confirmation — best-effort.
  sendEmail('bookingConfirmation', templateParams).catch(() => {})

  // Admin notification — the promise the caller awaits.
  return sendEmail('bookingAdmin', templateParams).then((res) => {
    if (analytics) trackEvent('purchase', analytics)
    return res
  })
}

// Placeholder for the real payment gateway.
// Today this just simulates a brief "processing" step and resolves — no card
// is charged. When a real gateway is wired up (Stripe Checkout redirect or
// Payment Element), replace the body of this function; the rest of the
// checkout flow stays the same.
export function processCardPayment() {
  return new Promise((resolve) => setTimeout(resolve, 700))
}

