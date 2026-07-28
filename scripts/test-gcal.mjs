// Offline test of _lib/gcal.mjs — the booking store's pure logic.
//
// Stubs global fetch, so it needs no credentials, no network and no Google
// project: run it with `npm run test:gcal` any time that module changes.
//
// It covers the things that would otherwise regress silently and only show
// up as a wrong booking: DST handling either side of the October change,
// the "visible start wins over the stored date" rule that makes rescheduling
// work, the description-line recovery path, and the capacity/idempotency
// checks that guard against overselling and double-submits.
import { createBooking, validateBooking, fetchAvailability } from '../netlify/functions/_lib/gcal.mjs'

let pass = 0, fail = 0
const ok = (label, cond, extra = '') => {
  if (cond) { pass++; console.log(`  ok   ${label}`) }
  else { fail++; console.log(`  FAIL ${label}${extra ? `\n       ${extra}` : ''}`) }
}

// ── fetch stub ──────────────────────────────────────────────────────────
let listItems = []
let inserted = null
globalThis.fetch = async (url, options = {}) => {
  const u = String(url)
  if (u.includes('oauth2.googleapis.com')) {
    return { ok: true, json: async () => ({ access_token: 'fake', expires_in: 3600 }) }
  }
  if (u.includes('?fields=timeZone')) {
    return { ok: true, json: async () => ({ timeZone: 'Europe/Sarajevo' }) }
  }
  if (options.method === 'POST' && u.includes('/events')) {
    inserted = JSON.parse(options.body)
    return { ok: true, json: async () => ({ id: 'evt_new' }) }
  }
  return { ok: true, json: async () => ({ items: listItems }) }
}

// A real throwaway RSA key: getAccessToken signs before it fetches, so the
// signing itself can't be stubbed away. This also proves the RS256 path works.
const { generateKeyPairSync } = await import('node:crypto')
const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
})
const sa = { clientEmail: 'x@y.iam.gserviceaccount.com', privateKey }
const calendarId = 'cal'
const base = {
  tourSlug: 'sarajevo-walking-tour', tourName: 'Sarajevo Walking Tour',
  tourDate: '2026-08-14', numPeople: 4, language: 'english',
  startTime: '10 AM', durationMinutes: 180, tourType: 'shared',
  guestName: 'Ana Kovač', guestEmail: 'ana@example.com', guestPhone: '+38762123456',
  totalPrice: 100, bookingId: 'bk_1',
}

// ── validation ──────────────────────────────────────────────────────────
console.log('\nvalidateBooking')
const v = validateBooking({ ...base, groupSize: 12, evil: 'dropme' })
ok('keeps known fields', v.tourSlug === 'sarajevo-walking-tour' && v.numPeople === 4)
ok('drops unknown fields', !('evil' in v))
ok('lowercases language', validateBooking({ ...base, language: 'ENGLISH' }).language === 'english')
ok('defaults durationMinutes', validateBooking({ ...base, durationMinutes: undefined }).durationMinutes === 180)
ok('clamps absurd duration', validateBooking({ ...base, durationMinutes: 99999 }).durationMinutes === 180)
ok('rejects bad date', (() => { try { validateBooking({ ...base, tourDate: '14-08-2026' }); return false } catch { return true } })())
ok('rejects zero people', (() => { try { validateBooking({ ...base, numPeople: 0 }); return false } catch { return true } })())
ok('rejects missing slug', (() => { try { validateBooking({ ...base, tourSlug: '' }); return false } catch { return true } })())
ok('unknown tourType falls back to shared', validateBooking({ ...base, tourType: 'hacked' }).tourType === 'shared')

// ── timed event shape ───────────────────────────────────────────────────
console.log('\nbuildEvent — day tour')
listItems = []
await createBooking({ sa, calendarId, booking: validateBooking(base) })
ok('start has named zone, no offset',
  inserted.start.dateTime === '2026-08-14T10:00:00' && inserted.start.timeZone === 'Europe/Sarajevo',
  JSON.stringify(inserted.start))
ok('end = start + 3h', inserted.end.dateTime === '2026-08-14T13:00:00')
ok('never sets attendees', !('attendees' in inserted))
ok('src=site marker', inserted.extendedProperties.private.src === 'site')
ok('pax stored as string', inserted.extendedProperties.private.pax === '4')
ok('description has machine line',
  /slug: sarajevo-walking-tour \| date: 2026-08-14 \| pax: 4 \| lang: english/.test(inserted.description))
ok('summary is scannable', inserted.summary === '4× Sarajevo Walking Tour (English)', inserted.summary)

// ── DST: the highest-value check ────────────────────────────────────────
console.log('\nDST — 10 AM either side of the Oct 2026 change')
for (const d of ['2026-10-24', '2026-10-26']) {
  listItems = []
  await createBooking({ sa, calendarId, booking: validateBooking({ ...base, tourDate: d, bookingId: `bk_${d}` }) })
  ok(`${d} stays 10:00 local`, inserted.start.dateTime === `${d}T10:00:00`, inserted.start.dateTime)
}

// ── start-time parsing ──────────────────────────────────────────────────
console.log('\nparseStartTime via event shape')
const times = [['10 AM', '10:00'], ['05 PM', '17:00'], ['09:30 AM', '09:30'], ['12 AM', '00:00'], ['12 PM', '12:00']]
for (const [input, expect] of times) {
  listItems = []
  await createBooking({ sa, calendarId, booking: validateBooking({ ...base, startTime: input, bookingId: `t_${input}` }) })
  ok(`"${input}" → ${expect}`, inserted.start.dateTime === `2026-08-14T${expect}:00`, inserted.start.dateTime)
}
listItems = []
await createBooking({ sa, calendarId, booking: validateBooking({ ...base, startTime: 'Not specified', bookingId: 't_bad' }) })
ok('unparseable time → all-day, not midnight', !!inserted.start.date && !inserted.start.dateTime, JSON.stringify(inserted.start))

// ── journeys ────────────────────────────────────────────────────────────
console.log('\nbuildEvent — journey')
listItems = []
await createBooking({ sa, calendarId, booking: validateBooking({ ...base, tourType: 'package', durationDays: 7, bookingId: 'pk_1' }) })
ok('all-day span', inserted.start.date === '2026-08-14')
ok('end.date exclusive (start + 7)', inserted.end.date === '2026-08-21', inserted.end.date)

// ── capacity ────────────────────────────────────────────────────────────
console.log('\ncapacity + idempotency')
const evt = (pax, id = 'e1', bookingId = '') => ({
  id, start: { dateTime: '2026-08-14T10:00:00+02:00' },
  extendedProperties: { private: { src: 'site', tourSlug: 'sarajevo-walking-tour', date: '2026-08-14', lang: 'english', pax: String(pax), bookingId } },
})
listItems = [evt(10)]
let r = await createBooking({ sa, calendarId, booking: validateBooking({ ...base, numPeople: 4, groupSize: 12, bookingId: 'c1' }) })
ok('rejects overbooking with 409', r.status === 409, JSON.stringify(r))
ok('409 names remaining seats', /2 seats left/.test(r.error || ''), r.error)

listItems = [evt(8)]
r = await createBooking({ sa, calendarId, booking: validateBooking({ ...base, numPeople: 4, groupSize: 12, bookingId: 'c2' }) })
ok('accepts an exact fill', r.ok === true, JSON.stringify(r))

listItems = [evt(2, 'dup', 'bk_dupe')]
r = await createBooking({ sa, calendarId, booking: validateBooking({ ...base, numPeople: 4, groupSize: 12, bookingId: 'bk_dupe' }) })
ok('duplicate bookingId returns the original', r.ok && r.duplicate && r.eventId === 'dup', JSON.stringify(r))

listItems = [evt(10)]
r = await createBooking({ sa, calendarId, booking: validateBooking({ ...base, numPeople: 4, bookingId: 'c3' }) })
ok('no groupSize → no capacity check', r.ok === true)

// different language must not share a bucket
listItems = [evt(10)]
r = await createBooking({ sa, calendarId, booking: validateBooking({ ...base, numPeople: 4, groupSize: 12, language: 'bosnian', bookingId: 'c4' }) })
ok('other language is a separate bucket', r.ok === true)

// ── availability map ────────────────────────────────────────────────────
console.log('\nfetchAvailability')
listItems = [evt(4, 'a'), evt(3, 'b'), { id: 'hand', start: { date: '2026-08-14' }, extendedProperties: { private: {} } }]
let map = await fetchAvailability({ sa, calendarId })
ok('sums same key', map['sarajevo-walking-tour_2026-08-14_english'] === 7, JSON.stringify(map))
ok('drops unreadable events', Object.keys(map).length === 1, JSON.stringify(map))

// "start wins": a rescheduled event moves its seat
listItems = [{
  id: 'moved', start: { dateTime: '2026-08-20T10:00:00+02:00' },
  extendedProperties: { private: { src: 'site', tourSlug: 'sarajevo-walking-tour', date: '2026-08-14', lang: 'english', pax: '4' } },
}]
map = await fetchAvailability({ sa, calendarId })
ok('start wins over stored date', map['sarajevo-walking-tour_2026-08-20_english'] === 4, JSON.stringify(map))

// description-only recovery
listItems = [{
  id: 'lost', start: { date: '2026-09-01' },
  description: 'Guest: X\n─────\nslug: mostar-day-trip | date: 2026-09-01 | pax: 3 | lang: german',
  extendedProperties: { private: { src: 'site' } },
}]
map = await fetchAvailability({ sa, calendarId })
ok('recovers from description line', map['mostar-day-trip_2026-09-01_german'] === 3, JSON.stringify(map))

// ── submitBooking orchestration ─────────────────────────────────────────
// The write ORDER is the whole reason _lib/booking.mjs exists: a rejected
// booking must leave no ledger row, and a failed calendar write must still
// leave one.
console.log('\nsubmitBooking — calendar then ledger')
const { submitBooking } = await import('../netlify/functions/_lib/booking.mjs')

let appended = []
let calendarShouldFail = false
let ledgerShouldFail = false
globalThis.fetch = async (url, options = {}) => {
  const u = String(url)
  if (u.includes('oauth2.googleapis.com')) {
    return { ok: true, json: async () => ({ access_token: 'fake', expires_in: 3600 }) }
  }
  if (u.includes('sheets.googleapis.com')) {
    if (ledgerShouldFail) return { ok: false, status: 500, json: async () => ({ error: { message: 'sheet down' } }) }
    appended.push(JSON.parse(options.body).values[0])
    return { ok: true, json: async () => ({}) }
  }
  if (u.includes('?fields=timeZone')) return { ok: true, json: async () => ({ timeZone: 'Europe/Sarajevo' }) }
  if (options.method === 'POST') {
    if (calendarShouldFail) return { ok: false, status: 500, json: async () => ({ error: { message: 'calendar down' } }) }
    return { ok: true, json: async () => ({ id: 'evt_ok' }) }
  }
  return { ok: true, json: async () => ({ items: listItems }) }
}

const submit = (overrides = {}, sheetId = 'sheet') =>
  submitBooking({ sa, calendarId, sheetId, booking: validateBooking({ ...base, ...overrides }) })

listItems = []; appended = []; calendarShouldFail = false; ledgerShouldFail = false
let s = await submit({ bookingId: 's1' })
ok('happy path succeeds', s.ok && s.eventId === 'evt_ok', JSON.stringify(s))
ok('ledger got exactly one row', appended.length === 1)
ok('ledger records calendarStatus ok', appended[0][15] === 'ok', JSON.stringify(appended[0]))
ok('ledger records the eventId', appended[0][16] === 'evt_ok')

listItems = []; appended = []; calendarShouldFail = true
s = await submit({ bookingId: 's2' })
ok('calendar failure still completes for the guest', s.ok === true, JSON.stringify(s))
ok('calendar failure still writes a ledger row', appended.length === 1)
ok('ledger row flags the failure', /^FAILED:/.test(appended[0][15]), appended[0][15])

listItems = [evt(10)]; appended = []; calendarShouldFail = false
s = await submit({ numPeople: 4, groupSize: 12, bookingId: 's3' })
ok('sold out returns 409', s.ok === false && s.status === 409, JSON.stringify(s))
ok('sold out writes NO ledger row', appended.length === 0)

// Same rule as the 409: no booking was created, so nothing is ledgered.
// A second row here would double-count the money on the sheet.
listItems = [evt(2, 'dup2', 'dupe-ledger')]; appended = []
s = await submit({ numPeople: 2, groupSize: 12, bookingId: 'dupe-ledger' })
ok('duplicate submit succeeds', s.ok === true && s.eventId === 'dup2', JSON.stringify(s))
ok('duplicate writes NO ledger row', appended.length === 0, `${appended.length} rows`)

listItems = []; appended = []; ledgerShouldFail = true
s = await submit({ bookingId: 's4' })
ok('ledger failure is not fatal', s.ok === true, JSON.stringify(s))
ok('ledger failure is reported', /^FAILED:/.test(s.ledgerStatus), s.ledgerStatus)
ledgerShouldFail = false

listItems = []; appended = []
s = await submit({ bookingId: 's5' }, '')
ok('no sheet configured still books', s.ok === true)
ok('no sheet configured is reported', /skipped/.test(s.ledgerStatus), s.ledgerStatus)

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
