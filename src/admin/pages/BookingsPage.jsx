// Bookings — the one screen that answers "can I take this group?".
//
// Google Calendar already shows you your day, and shows it better than this
// ever will. What it can't show is the number you actually need: how many
// seats are left once the site's own bookings AND the seats sold on OTAs are
// counted against the tour's group size. That merge lives nowhere else.
//
// Read-only by design. The admin server only runs on this machine, while the
// calendar app on your phone already has a delete button — so every row links
// out to its event rather than pretending to manage it here.
//
// Note this is the only admin screen whose data doesn't ship with a publish:
// it reads the calendar live, so there is nothing to save.

import { useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import * as api from '../api'
import { s, colors } from '../styles'
import manualBookings from '../../data/manual-bookings.json'

const cap = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '')
const shortTitle = (title) => (title || '').split(':')[0].trim()

const key = (slug, date, language) => `${slug}_${date}_${(language || '').toLowerCase()}`

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function BookingsPage() {
  const [rows, setRows] = useState(null)
  const [catalogue, setCatalogue] = useState([])
  const [err, setErr] = useState(null)

  useEffect(() => {
    Promise.all([api.bookings.list(), api.tours.list(), api.packages.list()])
      .then(([data, trs, pkgs]) => {
        setRows(data.bookings || [])
        setCatalogue([
          ...trs.map((t) => ({ slug: t.slug, label: shortTitle(t.title), groupSize: t.groupSize })),
          ...pkgs.map((p) => ({ slug: p.slug, label: shortTitle(p.name), groupSize: p.groupSize })),
        ])
      })
      .catch((e) => setErr(e.message))
  }, [])

  const bySlug = useMemo(() => new Map(catalogue.map((c) => [c.slug, c])), [catalogue])

  // Seats sold on OTAs, which count against the same capacity but never
  // appear on the calendar. Keyed the same way, but keeping the parts so
  // nothing has to parse a slug back out of a composite key.
  const otaSeats = useMemo(() => {
    const totals = new Map()
    for (const b of manualBookings) {
      if (!b.tourSlug || !b.date) continue
      const k = key(b.tourSlug, b.date, b.language)
      const existing = totals.get(k)
      if (existing) existing.seats += Number(b.numPeople || 0)
      else {
        totals.set(k, {
          k,
          seats: Number(b.numPeople || 0),
          tourSlug: b.tourSlug,
          date: b.date,
          language: (b.language || '').toLowerCase(),
        })
      }
    }
    return totals
  }, [])

  // One departure = one tour on one date in one language. That's the unit
  // capacity applies to, so it's the unit worth grouping by.
  const departures = useMemo(() => {
    if (!rows) return []
    const map = new Map()

    for (const r of rows) {
      const k = key(r.tourSlug, r.date, r.language)
      if (!map.has(k)) {
        map.set(k, { k, date: r.date, tourSlug: r.tourSlug, language: r.language, seats: 0, ota: 0, guests: [] })
      }
      const d = map.get(k)
      d.seats += r.numPeople
      d.guests.push(r)
    }

    // A date can be fully sold on OTAs with nothing booked here, and that
    // still needs to show up — otherwise the screen implies free capacity.
    const today = new Date().toISOString().slice(0, 10)
    for (const o of otaSeats.values()) {
      if (map.has(o.k) || o.date < today) continue
      map.set(o.k, { k: o.k, date: o.date, tourSlug: o.tourSlug, language: o.language, seats: 0, ota: 0, guests: [] })
    }

    for (const d of map.values()) d.ota = otaSeats.get(d.k)?.seats || 0

    return [...map.values()].sort((a, b) => a.date.localeCompare(b.date))
  }, [rows, otaSeats])

  if (err) {
    return (
      <>
        <Header />
        <div style={{ ...s.card, borderColor: colors.danger, backgroundColor: colors.dangerSoft }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Couldn&rsquo;t load bookings</div>
          <div style={s.subtle}>{err}</div>
          <div style={{ ...s.subtle, marginTop: 10 }}>
            Setup walkthrough: <code>docs/google-calendar-setup.md</code>
          </div>
        </div>
      </>
    )
  }

  if (!rows) return (<><Header /><div style={s.subtle}>Loading…</div></>)

  if (departures.length === 0) {
    return (
      <>
        <Header />
        <div style={s.card}>
          <div style={s.subtle}>
            No upcoming bookings. Ones taken on the site land here automatically;
            seats sold on OTAs go in Availability → External bookings.
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header count={departures.length} />
      {departures.map((d) => {
        const tour = bySlug.get(d.tourSlug)
        const total = d.seats + d.ota
        const capacity = tour?.groupSize || null
        const left = capacity ? capacity - total : null
        const full = left !== null && left <= 0

        return (
          <div key={d.k} style={s.card}>
            <div style={styles.head}>
              <div>
                <div style={styles.tourName}>{tour?.label || d.tourSlug}</div>
                <div style={s.subtle}>
                  {fmtDate(d.date)}
                  {d.language ? ` · ${cap(d.language)}` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...styles.seats, color: full ? colors.danger : colors.text }}>
                  {capacity ? `${total} / ${capacity}` : `${total}`}
                  <span style={styles.seatsUnit}>{total === 1 ? ' seat' : ' seats'}</span>
                </div>
                <div style={s.subtle}>
                  {left === null
                    ? 'no group size set'
                    : full ? 'full' : `${left} left`}
                  {d.ota > 0 && ` · ${d.ota} from OTAs`}
                </div>
              </div>
            </div>

            {d.guests.length > 0 && (
              <div style={styles.guests}>
                {d.guests.map((g) => (
                  <div key={g.eventId} style={styles.guest}>
                    <span style={styles.guestName}>{g.guestName || 'Name not given'}</span>
                    <span style={s.subtle}>
                      {g.numPeople} {g.numPeople === 1 ? 'person' : 'people'}
                      {g.startTime ? ` · ${g.startTime}` : ''}
                      {g.guestEmail ? ` · ${g.guestEmail}` : ''}
                    </span>
                    {g.htmlLink && (
                      <a
                        href={g.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                        title="Open in Google Calendar"
                      >
                        Open <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {d.guests.length === 0 && d.ota > 0 && (
              <div style={{ ...s.subtle, marginTop: 12 }}>
                All {d.ota} seats came from OTAs — nothing booked on the site for this date.
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

function Header({ count }) {
  return (
    <div style={s.pageHeader}>
      <div>
        <h1 style={s.h1}>Bookings</h1>
        <div style={{ ...s.subtle, marginTop: 6 }}>
          Live from the Bookings calendar, with OTA seats counted in. Nothing to save here —
          to cancel a booking, open it and delete the event.
        </div>
      </div>
      {count > 0 && <div style={s.subtle}>{count} upcoming {count === 1 ? 'departure' : 'departures'}</div>}
    </div>
  )
}

const styles = {
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  tourName: { fontSize: 15, fontWeight: 600, color: colors.text, marginBottom: 3 },
  seats: { fontSize: 18, fontWeight: 700, letterSpacing: -0.2 },
  seatsUnit: { fontSize: 12, fontWeight: 500, color: colors.textMuted },
  guests: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  guest: { display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
  guestName: { fontSize: 13.5, fontWeight: 600, color: colors.text },
  link: {
    marginLeft: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: colors.primary,
    textDecoration: 'none',
  },
}
