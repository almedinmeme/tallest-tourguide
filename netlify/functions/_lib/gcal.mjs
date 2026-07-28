// Google Calendar as the booking store. Replaces the Airtable `Bookings`
// table that _lib/airtable.mjs used to read and write.
//
// The calendar is the LIVE STATE: every event written by the site holds a
// seat the moment it exists, and deleting or cancelling the event releases
// that seat. (Airtable's Pending/Confirmed split is gone — a booking that
// doesn't hold a seat until someone manually confirms it is an overselling
// risk.) The permanent record of every submission is the append-only ledger
// in _lib/gsheet.mjs; nothing here reads it.
//
// ── The hand-edit rule ─────────────────────────────────────────────────
// The DATE comes from the event's visible `start`. Everything else comes
// from extendedProperties.private. So:
//   • drag an event to another day  → the seat moves with it (reschedule
//     works for free; trusting the private `date` would silently keep
//     blocking the old day)
//   • delete or cancel it           → the seat is released
//   • create an event by hand       → no src=site, so it is ignored and
//     your own diary entries never eat seats
//   • edit the head count by hand   → drift. Don't: delete the event and
//     record the seats under /admin → Availability → External bookings.

import { googleFetch, googleError } from './google-auth.mjs'

const API = 'https://www.googleapis.com/calendar/v3/calendars'
const TIME_ZONE = 'Europe/Sarajevo'

const DAY_MS = 86_400_000
const iso = (d) => new Date(d).toISOString()
const ymd = (d) => new Date(d).toISOString().slice(0, 10)

// ── Availability ───────────────────────────────────────────────────────

// The map the client's useAvailability hook consumes. Byte-identical to
// what the Airtable version returned so nothing downstream changed:
//   { "<tourSlug>_<YYYY-MM-DD>_<language lowercase>": totalPeopleBooked }
export async function fetchAvailability({ sa, calendarId }) {
  const map = {}
  for (const row of await fetchBookings({ sa, calendarId })) {
    const key = `${row.tourSlug}_${row.date}_${row.language}`
    map[key] = (map[key] || 0) + row.numPeople
  }
  return map
}

// One paged list, shared by fetchAvailability and the admin Bookings page.
// `days` bounds how far ahead to look; journeys are booked ~18 months out
// at the outside.
export async function fetchBookings({ sa, calendarId, days = 550 }) {
  await warnOnCalendarTimeZone(sa, calendarId)

  // Deliberately "now − 36h" rather than midnight in Sarajevo: computing a
  // local midnight needs a UTC offset, which is exactly the DST bug class
  // this module avoids everywhere else. Over-fetching a day and a half is
  // free, and keys for past dates are harmless because the client only ever
  // asks about future ones.
  //
  // Note this includes TODAY, where Airtable's IS_AFTER({TourDate}, today)
  // excluded it. That's a fix, not a regression: it stops same-day
  // overselling.
  const now = Date.now()
  const rows = []
  let pageToken

  do {
    const url = new URL(`${API}/${encodeURIComponent(calendarId)}/events`)
    url.searchParams.set('timeMin', iso(now - 1.5 * DAY_MS))
    url.searchParams.set('timeMax', iso(now + days * DAY_MS))
    url.searchParams.set('singleEvents', 'true')
    url.searchParams.set('showDeleted', 'false')
    url.searchParams.set('maxResults', '2500')
    url.searchParams.set('orderBy', 'startTime')
    // Server-side filter, so events you created by hand never even reach us.
    url.searchParams.set('privateExtendedProperty', 'src=site')
    // Cuts the response ~5x. Everything we read is in this projection.
    url.searchParams.set(
      'fields',
      'nextPageToken,items(id,htmlLink,start,end,summary,description,extendedProperties/private)'
    )
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    const res = await googleFetch(sa, url)
    if (!res.ok) throw new Error(await googleError(res, 'Calendar events.list'))
    const data = await res.json()

    for (const item of data.items || []) {
      const row = toBookingRow(item)
      if (row) rows.push(row)
    }
    pageToken = data.nextPageToken
  } while (pageToken)

  return rows
}

// Rebuilds one booking from an event. Returns null rather than guessing:
// a row we can't read confidently is better dropped from the seat maths
// than counted wrongly.
function toBookingRow(item) {
  const p = item.extendedProperties?.private || {}
  const fallback = parseDescription(item.description)

  // `start` wins over the stored date — see the hand-edit rule above.
  const date =
    item.start?.date ||                    // all-day: already a local YYYY-MM-DD
    item.start?.dateTime?.slice(0, 10) ||  // timed: returned in the calendar's own zone
    p.date ||
    fallback.date

  const tourSlug = p.tourSlug || fallback.slug
  const numPeople = Number(p.pax || fallback.pax) || 0
  const language = (p.lang ?? fallback.lang ?? '').toLowerCase()

  if (!tourSlug || !date || !numPeople) return null

  return {
    eventId: item.id,
    htmlLink: item.htmlLink || '',
    date,
    tourSlug,
    numPeople,
    language,
    startTime: item.start?.dateTime ? item.start.dateTime.slice(11, 16) : '',
    tourName: p.tourName || '',
    tourType: p.tourType || 'shared',
    guestName: p.guestName || '',
    guestEmail: p.email || '',
    bookingId: p.bookingId || '',
  }
}

// Recovery path for the one failure we otherwise couldn't detect: an event
// that kept src=site but lost its other private properties (copied between
// calendars, restored from trash by some clients). The same values are
// written as a trailing line of the description for exactly this reason.
function parseDescription(description) {
  const m = /slug:\s*([^|\n]+)\|\s*date:\s*([^|\n]+)\|\s*pax:\s*([^|\n]+)\|\s*lang:\s*([^|\n]*)/i
    .exec(description || '')
  if (!m) return {}
  return {
    slug: m[1].trim(),
    date: m[2].trim(),
    pax: m[3].trim(),
    lang: m[4].trim(),
  }
}

// If the calendar isn't in Europe/Sarajevo, events.list returns dateTimes in
// whatever zone it IS in, and the YYYY-MM-DD slice above silently produces
// off-by-one dates near midnight. Checked once per warm container — a
// warning, not a throw, because a wrong zone still mostly works and taking
// bookings down over it would be worse.
let timeZoneChecked = false
async function warnOnCalendarTimeZone(sa, calendarId) {
  if (timeZoneChecked) return
  timeZoneChecked = true
  try {
    const res = await googleFetch(sa, `${API}/${encodeURIComponent(calendarId)}?fields=timeZone`)
    if (!res.ok) return
    const { timeZone } = await res.json()
    if (timeZone && timeZone !== TIME_ZONE) {
      console.warn(
        `[gcal] Bookings calendar is ${timeZone}, expected ${TIME_ZONE}. ` +
        'Dates near midnight may be off by one — fix it in Calendar settings.'
      )
    }
  } catch { /* diagnostics only, never block a booking */ }
}

// ── Writing a booking ──────────────────────────────────────────────────

export async function createBooking({ sa, calendarId, booking }) {
  // One narrow list over the booking's own day answers both questions we
  // need before writing: is there room, and have we already written this
  // exact booking? (Two privateExtendedProperty filters would be ANDed by
  // Google, so they can't be separate filters — but a duplicate would be on
  // this same date anyway, so scanning the day covers it.)
  let sameDay
  try {
    sameDay = await fetchDay({ sa, calendarId, date: booking.tourDate })
  } catch (err) {
    return { ok: false, status: 502, error: err.message }
  }

  const duplicate = booking.bookingId
    && sameDay.find((r) => r.bookingId === booking.bookingId)
  if (duplicate) {
    // A retried submit (double-click, flaky mobile) must not burn a second
    // set of seats. Report the original as the result.
    return { ok: true, status: 200, eventId: duplicate.eventId, duplicate: true }
  }

  // groupSize is client-supplied, so it's a guard against honest
  // double-booking, never an authority. Absent → nothing to check against.
  if (booking.groupSize) {
    const key = `${booking.tourSlug}_${booking.tourDate}_${booking.language}`
    const booked = sameDay
      .filter((r) => `${r.tourSlug}_${r.date}_${r.language}` === key)
      .reduce((sum, r) => sum + r.numPeople, 0)
    const left = booking.groupSize - booked
    if (booking.numPeople > left) {
      return {
        ok: false,
        status: 409,
        error: left > 0
          ? `Only ${left} ${left === 1 ? 'seat' : 'seats'} left for that date.`
          : 'That date is now fully booked.',
      }
    }
  }

  const res = await googleFetch(
    sa,
    `${API}/${encodeURIComponent(calendarId)}/events?sendUpdates=none`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildEvent(booking)),
    }
  )
  if (!res.ok) {
    return { ok: false, status: 502, error: await googleError(res, 'Calendar events.insert') }
  }
  const data = await res.json()
  return { ok: true, status: 200, eventId: data.id }
}

// Events on a single day (± a day of slack so timezone boundaries can't hide
// a neighbour), used for the capacity and duplicate checks.
async function fetchDay({ sa, calendarId, date }) {
  const mid = Date.parse(`${date}T12:00:00Z`)
  const url = new URL(`${API}/${encodeURIComponent(calendarId)}/events`)
  url.searchParams.set('timeMin', iso(mid - DAY_MS))
  url.searchParams.set('timeMax', iso(mid + DAY_MS))
  url.searchParams.set('singleEvents', 'true')
  url.searchParams.set('showDeleted', 'false')
  url.searchParams.set('maxResults', '2500')
  url.searchParams.set('privateExtendedProperty', 'src=site')
  url.searchParams.set('fields', 'items(id,start,description,extendedProperties/private)')

  const res = await googleFetch(sa, url)
  if (!res.ok) throw new Error(await googleError(res, 'Calendar events.list'))
  const data = await res.json()
  return (data.items || []).map(toBookingRow).filter(Boolean)
}

function buildEvent(b) {
  const people = `${b.numPeople} ${b.numPeople === 1 ? 'person' : 'people'}`
  const label = b.tourName || b.tourSlug

  const event = {
    summary: `${b.numPeople}× ${label}${b.language ? ` (${titleCase(b.language)})` : ''}`,
    description: buildDescription(b),
    // The service account has no domain-wide delegation, so it CANNOT add
    // attendees — that's why the guest lives in the description instead, and
    // why their confirmation still goes out over EmailJS.
    transparency: 'opaque',
    guestsCanModify: false,
    extendedProperties: {
      private: pruneEmpty({
        src: 'site',
        tourSlug: b.tourSlug,
        date: b.tourDate,
        lang: b.language,
        pax: String(b.numPeople),
        tourType: b.tourType,
        bookingId: b.bookingId,
        tourName: b.tourName,
        guestName: b.guestName,
        email: b.guestEmail,
      }),
    },
  }

  // Journeys span days, so they're all-day events. end.date is EXCLUSIVE.
  if (b.tourType === 'package') {
    const end = new Date(Date.parse(`${b.tourDate}T12:00:00Z`) + (b.durationDays || 1) * DAY_MS)
    event.start = { date: b.tourDate }
    event.end = { date: ymd(end) }
    return event
  }

  const start = parseStartTime(b.startTime)
  if (!start) {
    // No parseable start time — an all-day event is honest, whereas an event
    // silently sitting at 00:00 is not.
    const end = new Date(Date.parse(`${b.tourDate}T12:00:00Z`) + DAY_MS)
    event.start = { date: b.tourDate }
    event.end = { date: ymd(end) }
    return event
  }

  // The dateTime carries NO offset and the zone is named instead. That makes
  // DST correct by construction: hand-building "+01:00"/"+02:00" is the bug.
  const endMinutes = start.minutes + (b.durationMinutes || 180)
  event.start = { dateTime: `${b.tourDate}T${hhmm(start.minutes)}:00`, timeZone: TIME_ZONE }
  event.end = { dateTime: `${b.tourDate}T${hhmm(Math.min(endMinutes, 23 * 60 + 59))}:00`, timeZone: TIME_ZONE }
  return event
}

function buildDescription(b) {
  const lines = []
  if (b.guestName) lines.push(`Guest:  ${b.guestName}`)
  if (b.guestEmail) lines.push(`Email:  ${b.guestEmail}`)
  if (b.guestPhone) lines.push(`Phone:  ${b.guestPhone}`)

  const facts = [`${b.numPeople} ${b.numPeople === 1 ? 'person' : 'people'}`]
  if (b.language) facts.push(titleCase(b.language))
  if (b.tourType) facts.push(`${b.tourType} tour`)
  lines.push(facts.join('  ·  '))

  if (b.totalPrice != null) {
    lines.push(`Total:  €${b.totalPrice}${b.discountCode ? `   Code: ${b.discountCode}` : ''}`)
  }
  if (b.accommodation) lines.push(`Stay:   ${b.accommodation}`)
  lines.push(`Booked: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} via the website`)
  if (b.bookingId) lines.push(`Ref:    ${b.bookingId}`)

  // Machine-readable duplicate of the private properties. Deliberate
  // redundancy — see parseDescription().
  lines.push('─────────────')
  lines.push(`slug: ${b.tourSlug} | date: ${b.tourDate} | pax: ${b.numPeople} | lang: ${b.language}`)
  return lines.join('\n')
}

// Covers every value used in tours[].startingTimes: "10 AM", "05 PM",
// "09:30 AM", "6 PM". Anything else returns null and the caller falls back
// to an all-day event rather than inventing a time.
function parseStartTime(value) {
  const m = /^\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*$/i.exec(value || '')
  if (!m) return null
  let hours = Number(m[1])
  if (hours < 1 || hours > 12) return null
  const mins = Number(m[2] || 0)
  if (mins > 59) return null
  const pm = m[3].toUpperCase() === 'PM'
  if (pm && hours !== 12) hours += 12
  if (!pm && hours === 12) hours = 0
  return { minutes: hours * 60 + mins }
}

const hhmm = (total) =>
  `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`

const titleCase = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s)

function pruneEmpty(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== '') out[k] = String(v)
  }
  return out
}

// ── Request validation ─────────────────────────────────────────────────
// Replaces validateSubmitBody + SUBMIT_TABLES from _lib/airtable.mjs.
// /api/submit is bookings-only now, so there is no `table` on the wire:
// the body is { booking: {...}, website?: '' }.

export const MAX_BODY_BYTES = 10_000

const str = (v, max) => {
  if (v === undefined || v === null || v === '') return ''
  if (typeof v !== 'string' && typeof v !== 'number') throw new Error('Invalid value')
  return String(v).slice(0, max)
}

const int = (v, min, max) => {
  const n = Math.floor(Number(v))
  return Number.isFinite(n) && n >= min && n <= max ? n : null
}

export function validateBooking(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('Missing booking')
  }

  const tourSlug = str(body.tourSlug, 120)
  if (!tourSlug) throw new Error('Missing tourSlug')

  const tourDate = str(body.tourDate, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tourDate) || Number.isNaN(Date.parse(tourDate))) {
    throw new Error('Invalid tourDate')
  }

  const numPeople = int(body.numPeople, 1, 99)
  if (!numPeople) throw new Error('Invalid numPeople')

  const tourType = ['shared', 'private', 'package'].includes(body.tourType)
    ? body.tourType
    : 'shared'

  const totalPrice = Number(body.totalPrice)

  return {
    tourSlug,
    tourDate,
    numPeople,
    tourType,
    language: str(body.language, 40).toLowerCase(),
    startTime: str(body.startTime, 20),
    tourName: str(body.tourName, 200),
    accommodation: str(body.accommodation, 200),
    guestName: str(body.guestName, 200),
    guestEmail: str(body.guestEmail, 200),
    guestPhone: str(body.guestPhone, 60),
    discountCode: str(body.discountCode, 60),
    bookingId: str(body.bookingId, 40),
    totalPrice: Number.isFinite(totalPrice) && totalPrice >= 0 ? totalPrice : null,
    // Guard only — the client can lie about it, so it can only ever make us
    // reject a booking, never accept one we otherwise wouldn't.
    groupSize: int(body.groupSize, 1, 99),
    durationMinutes: int(body.durationMinutes, 30, 720) || 180,
    durationDays: int(body.durationDays, 1, 30) || 1,
  }
}
