// Promo / referral code validation. Codes live in src/data/announcement.json
// (edited via /admin → Promotions) and are baked into the bundle at build
// time, like all site content. Matching is case-insensitive.
//
// A checkout code that does NOT match anything here is still accepted and
// forwarded on the booking as plain text — hotels and partners hand out
// attribution codes that carry no automatic discount, and those must never
// see an "invalid code" error.
import announcement from '../data/announcement.json'

export function findPromoCode(input) {
  const q = String(input || '').trim().toUpperCase()
  if (!q) return null
  const today = new Date().toISOString().slice(0, 10)
  const codes = Array.isArray(announcement.promoCodes) ? announcement.promoCodes : []
  const hit = codes.find((c) => String(c.code || '').trim().toUpperCase() === q)
  if (!hit || hit.enabled === false) return null
  if (hit.startDate && today < hit.startDate) return null
  if (hit.endDate && today > hit.endDate) return null
  const value = Number(hit.value) || 0
  if (value <= 0) return null
  return {
    code: q,
    type: hit.type === 'fixed' ? 'fixed' : 'percent',
    value,
  }
}

// The euro amount a validated promo takes off `amount`. Fixed-amount codes
// never push the total below zero.
export function promoSavingFor(promo, amount) {
  if (!promo || amount <= 0) return 0
  return promo.type === 'fixed'
    ? Math.min(Math.round(promo.value), amount)
    : Math.round((amount * promo.value) / 100)
}
