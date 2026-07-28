// Turns the prose duration on a tour ("3 hours", "Full day (~13h)", "2,5
// hours", "~6.5 hours", "3–4 hours") into minutes, so a booking can be
// written to the calendar as an event with a sensible end time.
//
// This is deliberately a CLIENT-side concern: the duration is cosmetic —
// no seat maths reads it, it only decides how long the block looks in the
// owner's calendar — so parsing prose is not worth doing on the server,
// where getting it wrong would be a 400 on a real booking. The server just
// clamps whatever arrives to a sane range (see validateBooking in
// netlify/functions/_lib/gcal.mjs).

const DEFAULT_MINUTES = 180
const FULL_DAY_MINUTES = 480

export function parseDuration(text) {
  const raw = String(text || '').toLowerCase()
  if (!raw) return DEFAULT_MINUTES

  // "2,5 hours" is written with a comma in some entries; a range like
  // "3–4 hours" takes the lower bound, which under-books the calendar
  // rather than over-booking it.
  const match = /(\d+(?:[.,]\d+)?)/.exec(raw)
  const value = match ? Number(match[1].replace(',', '.')) : null

  if (value == null || !Number.isFinite(value) || value <= 0) {
    // "Full day" with no number at all.
    return raw.includes('full day') ? FULL_DAY_MINUTES : DEFAULT_MINUTES
  }

  // "90 min" / "45 minutes"
  if (/\bmin/.test(raw)) return clamp(value)

  // Everything else in the catalogue is hours, whether spelled "hours",
  // "h", or left implicit after a "full day (~13h)".
  return clamp(value * 60)
}

const clamp = (minutes) => Math.max(30, Math.min(720, Math.round(minutes)))

export default parseDuration
