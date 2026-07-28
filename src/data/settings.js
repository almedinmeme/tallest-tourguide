// Site-wide contact & social settings. Single source of truth is
// src/data/settings.json, edited via the local /admin panel under "Settings".
// Import from here — never hardcode the email/phone/links in components.
import settings from './settings.json'

export const CONTACT_EMAIL = settings.contactEmail
export const PHONE_DISPLAY = settings.phoneDisplay
export const WHATSAPP_URL = `https://wa.me/${settings.whatsappNumber}`
export const INSTAGRAM_URL = settings.instagramUrl
export const TRIPADVISOR_URL = settings.tripadvisorUrl

// Review headline numbers. TripAdvisor has no free API, so its rating and
// count are typed in by hand under Settings; Google's equivalents come from
// the build-time sync in scripts/sync-google-reviews.mjs. GOOGLE_REVIEWS_URL
// is optional — the sync falls back to the place's own Google Maps link.
export const TRIPADVISOR_RATING = settings.tripadvisorRating
export const TRIPADVISOR_REVIEW_COUNT = settings.tripadvisorReviewCount
export const GOOGLE_PLACE_ID = settings.googlePlaceId
export const GOOGLE_REVIEWS_URL = settings.googleReviewsUrl

// EUR→other exchange rates for the currency switcher. Admin-editable in
// Settings; sensible defaults so the site works before they're ever touched.
export const CURRENCY_RATES = settings.currencyRates || { USD: 1.08, GBP: 0.86, BAM: 1.95583 }

export default settings
