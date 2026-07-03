// Shared booking submission.
// Extracted from the (previously duplicated) handleBooking logic in
// TourDetail.jsx and PackageDetail.jsx so the new /checkout screen and any
// future flow submit a booking the same way.
//
// Behavior is intentionally identical to the old inline version:
//   1. Save the booking to Airtable (best-effort, never blocks).
//   2. Send the customer confirmation email (best-effort).
//   3. Send the admin notification email — this is the promise we surface,
//      so callers can show a success / error state.
//   4. On success, fire the GA4 `purchase` event.
import emailjs from '@emailjs/browser'
import { trackEvent } from './analytics'

const AIRTABLE_BOOKINGS_URL = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/Bookings`

export function submitBooking({ airtableFields, templateParams, analytics }) {
  // Airtable — best-effort. A failure here (e.g. unknown field) must never
  // stop the booking, so we only warn.
  fetch(AIRTABLE_BOOKINGS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: airtableFields }),
  }).catch((err) => console.warn('Airtable booking save failed:', err))

  // Customer confirmation — best-effort.
  emailjs
    .send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .catch(() => {})

  // Admin notification — the promise the caller awaits.
  return emailjs
    .send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then((res) => {
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

// 5% discount offered when the customer chooses to pay by card up front.
export const CARD_DISCOUNT_RATE = 0.05

export function applyCardDiscount(total) {
  return Math.round(total * (1 - CARD_DISCOUNT_RATE))
}
