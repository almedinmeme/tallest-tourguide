// policy.js
// Single source of truth for booking-policy copy. A plain JS module (like
// navigation.js) so the /admin CMS never rewrites it. Everywhere the site
// states the policy — checkout, home trust bar, booking conditions, the
// PaymentReassurance block — reads from here, so the numbers can't drift
// apart again.
//
// The policy (owner-approved, 2026-07):
//   Day tours & experiences  — free cancellation up to 24h before, full refund.
//   Multi-day packages       — 25% deposit confirms; balance due 30 days before
//                              departure; cancel >30d full refund, 15–30d 50%,
//                              <15d none; one free date change if asked >30d out.
//   If WE cancel             — always a full refund or a free rebooking.

export const DEPOSIT_PERCENT = 25
export const BALANCE_DUE_DAYS = 30

export const CANCEL_LINE_TOUR =
  'Free cancellation up to 24 hours before your day tour — full refund.'
// Compact form for tight surfaces (tour cards).
export const CANCEL_SHORT_TOUR = 'Free cancellation 24h'
export const CANCEL_LINE_PACKAGE =
  'Full refund on journeys cancelled more than 30 days before departure.'

// Home trust bar cell — must stay true to the lines above.
export const TRUST_BAR_CANCEL = { desktop: '24h on day tours', mobile: '24h day tours' }

// No invented N-business-days promise until the owner commits to one.
export const REFUND_TIMING = 'promptly, to the original payment method'

// The ways guests can actually pay (owner-confirmed). Rendered by
// PaymentReassurance and the booking-conditions payment section.
export const PAYMENT_METHODS = [
  {
    title: 'Bank transfer (EUR)',
    body: 'An invoice with IBAN details — the usual route for journey deposits and balances.',
  },
  {
    title: 'Secure card payment link',
    body: 'We email a secure payment link; your card details never pass through our hands.',
  },
  {
    title: 'PayPal',
    body: 'Pay through your PayPal account, with its own buyer protection.',
  },
  {
    title: 'Cash on the day',
    body: 'For day tours, you can simply pay your guide in person — EUR or BAM.',
  },
]
