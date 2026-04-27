# Context

Tallest Tourguide is a React + Vite JAMstack SPA (deployed on Netlify) for a tour company in Sarajevo, Bosnia and Herzegovina. The company and bank are registered in BiH. It currently collects bookings via email (EmailJS) and stores them in Airtable — no online payment exists. Prices range from €25–€480.

**Note on Stripe:** Stripe does not support Bosnia and Herzegovina as a merchant country. Monri Payments is used instead — it is a Sarajevo-based payment processor built for the Western Balkans, integrates directly with BiH banks, and supports Visa/Mastercard.

---

# Recommended Approach: Monri Hosted Payment Page + Netlify Functions

**Why Monri?**
- Headquartered in Sarajevo — built for BiH banks and the Western Balkans market
- Supports Visa, Mastercard, Maestro (the cards international tourists carry)
- Provides a hosted payment page (redirect-based) — zero card data on client, PCI compliant
- REST API with HMAC-based transaction signing
- [monri.com](https://monri.com)

**Why Netlify Functions?**
- No backend exists — Netlify Functions is the only server-side execution environment available without changing the hosting setup
- The Monri secret key must never be in the browser bundle

**Secondary option: PayPal Buttons** (can be added alongside Monri as an alternative checkout method for tourists who prefer it — simpler client-side SDK integration)

---

# Architecture

```
User fills booking form
        ↓
POST /.netlify/functions/create-payment-order
  → saves Airtable record (Status: 'AwaitingPayment', MonriOrderId: '...')
  → creates Monri order via REST API (HMAC-signed)
  → returns { redirectUrl: 'https://ipg.monri.com/v2/payment/...' }
        ↓
window.location.href = redirectUrl   (redirect to Monri hosted page)
        ↓  (user pays)
Monri redirects → /booking-success?order_number=...
        ↓
GET /.netlify/functions/get-booking-by-order?order_number=...
  → fetches booking details from Airtable for display
        ↓  (async, Monri → our server)
POST /.netlify/functions/monri-webhook
  → verifies HMAC digest
  → updates Airtable Status → 'Paid'
  → sends EmailJS confirmation emails via REST API
```

If the user cancels on Monri, they're redirected back to the tour page (fresh load).

---

# Files to Create

### 1. `netlify/functions/create-payment-order.js`
- Receives booking fields: `tourSlug`, `tourName`, `tourDate`, `startTime`, `numPeople`, `totalPrice`, `guestName`, `guestEmail`, `guestPhone`, `discountCode`, `tourType`, `tourLanguage`
- Writes to Airtable Bookings with `Status: 'AwaitingPayment'` and `MonriOrderId` (a UUID generated server-side)
- Creates a Monri payment order via their REST API:
  - Signs request with HMAC-SHA512: `digest = HMAC-SHA512(key, "WP3-v2:" + SHA512(timestamp + authenticityToken + orderNumber + amount))`
  - Amount in lowest denomination (cents × 100 — for EUR, `totalPrice * 100`)
  - `currency: 'EUR'`, `order_info: tourName`, `ch_full_name: guestName`, `ch_email: guestEmail`
  - `success_url`: `https://tallesttourguide.com/booking-success?order_number={order_number}`
  - `cancel_url`: back to originating tour page
- Returns `{ redirectUrl }` to client

### 2. `netlify/functions/monri-webhook.js`
- Monri POSTs transaction result to this endpoint
- Verifies the HMAC digest: `SHA512(authenticityToken + SHA512(key + orderNumber))`
- On `status: 'approved'`:
  - Queries Airtable for `MonriOrderId = order_number`, updates `Status → 'Paid'`
  - Sends both EmailJS emails via REST POST to `https://api.emailjs.com/api/v1.0/email/send`
    - Same `templateParams` shape as the existing code in `TourDetail.jsx:286-303`
    - Uses server-side copies of the EmailJS env vars (no `VITE_` prefix)
- Returns `200` on success

### 3. `netlify/functions/get-booking-by-order.js`
- GET `?order_number=...`
- Queries Airtable: `filterByFormula=({MonriOrderId}='...')`
- Returns safe subset: `{ guestName, tourName, tourDate, numPeople, totalPrice, status }`
- Returns 404 if not found

### 4. `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
```
(The existing `public/_redirects` handles SPA routing and stays unchanged.)

---

# Files to Modify

### `src/pages/TourDetail.jsx` — `handleBooking` (lines 278–354)
Split on `tourType`:
- **`tourType === 'private'`**: keep existing EmailJS-only flow untouched
- **`tourType === 'shared'`**: replace the Airtable write + EmailJS calls with:
  ```js
  const res = await fetch('/.netlify/functions/create-payment-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...bookingFields })
  })
  const { redirectUrl } = await res.json()
  trackEvent('begin_checkout', { ... })
  window.location.href = redirectUrl
  ```
- Change Step 2 button label: `Confirm & Book - €{total}` → `Pay €{total} — Secure Checkout`

### `src/pages/PackageDetail.jsx`
- Same pattern. Include accommodation type in the Monri `order_info` description.

### `src/hooks/useAvailability.js` — line 19
```js
// Before:
`AND({Status}='Confirmed',IS_AFTER({TourDate},'${today}'))`

// After:
`AND(OR({Status}='Confirmed',{Status}='Paid'),IS_AFTER({TourDate},'${today}'))`
```
Paid bookings immediately count against availability.

### `src/App.jsx`
Add lazy import and route:
```js
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'))
// in Routes:
<Route path="/booking-success" element={<BookingSuccess />} />
```

### `vite.config.js`
Add `/booking-success` to the sitemap routes array.

---

# New Page: `src/pages/BookingSuccess.jsx`
- Reads `?order_number=` via `useSearchParams()`
- Calls `get-booking-by-order` to fetch booking details
- Renders confirmation UI (reuse the `CheckCircle` pattern from `TourDetail.jsx:375-391`)
- Fires `trackEvent('purchase', { transaction_id: orderNumber, ... })` once via `useRef` guard
- "Back to Tours" link

---

# No New npm Dependencies
Monri integration uses only the Node.js built-in `crypto` module (for HMAC signing) and `fetch`. No SDK needed.

---

# Airtable Changes
Add one field to the **Bookings** table:
- `MonriOrderId` — Single line text (stores the UUID order number used for HMAC verification and record lookup)

---

# New Environment Variables
Add to Netlify dashboard (no `VITE_` prefix — server-only):

| Variable | Value |
|---|---|
| `MONRI_AUTHENTICITY_TOKEN` | From Monri merchant dashboard |
| `MONRI_KEY` | From Monri merchant dashboard |
| `EMAILJS_SERVICE_ID` | same value as `VITE_EMAILJS_SERVICE_ID` |
| `EMAILJS_TEMPLATE_ID` | same value as `VITE_EMAILJS_TEMPLATE_ID` |
| `EMAILJS_CONFIRMATION_TEMPLATE_ID` | same value as `VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID` |
| `EMAILJS_PUBLIC_KEY` | same value as `VITE_EMAILJS_PUBLIC_KEY` |
| `AIRTABLE_TOKEN` | same value as `VITE_AIRTABLE_TOKEN` |
| `AIRTABLE_BASE_ID` | same value as `VITE_AIRTABLE_BASE_ID` |

For local dev: use `.env` (gitignored) + `netlify dev`.

---

# Implementation Order
1. Create `netlify/` directory + `netlify.toml`
2. Build + test `create-payment-order.js` (verify Airtable write + Monri redirect)
3. Build + test `monri-webhook.js` (verify HMAC, Airtable update, EmailJS)
4. Build + test `get-booking-by-order.js`
5. Build `BookingSuccess.jsx`, add to `App.jsx` + `vite.config.js`
6. Update `TourDetail.jsx` `handleBooking`
7. Update `PackageDetail.jsx` `handleBooking`
8. Update `useAvailability.js` Status filter
9. Add `MonriOrderId` field in Airtable
10. Set env vars in Netlify dashboard, register webhook URL in Monri merchant dashboard, test end-to-end with Monri test credentials

---

# Verification
- Full round-trip: fill booking form → Monri hosted checkout → success page shows booking details
- Cancel: lands back on tour page cleanly (Monri cancel_url)
- Airtable: `AwaitingPayment` record appears on checkout creation; updates to `Paid` after webhook
- Emails: both guest confirmation and operator notification sent from webhook only
- Availability: a `Paid` booking reduces spots left for that tour/date
- Private tour path: still sends EmailJS directly, completely untouched
