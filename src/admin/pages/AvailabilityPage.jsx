// Availability — three jobs in one screen, ordered by how often they're used:
//   1. External (OTA) bookings — seats sold on GetYourGuide/Viator/etc. that
//      must count against on-site availability. Admin-owned and additive:
//      stored in src/data/manual-bookings.json, which the Airtable sync
//      NEVER touches.
//   2. Blocked dates — single days or ranges when tours can't run.
//   3. Journey departure dates.
// 2 and 3 edit the same src/data/airtable/*.json files the build-time sync
// regenerates, so for those AIRTABLE STAYS THE PRIORITY SOURCE: any build
// that reaches it overwrites them. They're the fallback for when Airtable
// is down or over its API cap.
import { useEffect, useMemo, useRef, useState } from 'react'
import * as api from '../api'
import { s, colors } from '../styles'
import SaveButton from '../components/SaveButton'
import { useToast } from '../hooks/useToast'
import { useDirtyTracker } from '../hooks/dirtyContext'

const ALL_TOURS = '' // empty tourSlug on a blocked date blocks every tour
const DEFAULT_LANGUAGES = ['english', 'bosnian']

// "2026-08-19" → "19 Aug 2026"
function fmtDate(iso) {
  if (!iso) return ''
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Compact range: same month "1–14 Aug 2026", otherwise "28 Aug – 3 Sep 2026".
function fmtRange(fromIso, toIso) {
  if (fromIso === toIso) return fmtDate(fromIso)
  if (fromIso.slice(0, 7) === toIso.slice(0, 7)) {
    return `${Number(fromIso.slice(8, 10))}–${fmtDate(toIso)}`
  }
  const noYear = (iso) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${noYear(fromIso)} – ${fmtDate(toIso)}`
}

const cap = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '')

// Tour titles can be long ("Bosnian Cooking Class in Sarajevo: Burek, …");
// list rows only need the part before the colon.
const shortTitle = (title) => (title || '').split(':')[0].trim()

function SectionHint({ tone = 'neutral', children }) {
  const palette =
    tone === 'warn'
      ? { bg: colors.warningSoft, fg: colors.warning }
      : { bg: colors.panelMuted, fg: colors.textSubtle }
  return (
    <div
      style={{
        backgroundColor: palette.bg,
        color: palette.fg,
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12.5,
        lineHeight: 1.55,
        margin: '2px 0 16px',
      }}
    >
      {children}
    </div>
  )
}

export default function AvailabilityPage() {
  const [item, setItem] = useState(null) // { departureDates, blockedDates, manualBookings }
  const [journeys, setJourneys] = useState([])
  const [tours, setTours] = useState([])
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const { dirty, markSaved } = useDirtyTracker(item)

  useEffect(() => {
    Promise.all([api.availability.get(), api.packages.list(), api.tours.list()])
      .then(([availability, pkgs, trs]) => {
        setItem({ manualBookings: [], ...availability })
        setJourneys(pkgs)
        setTours(trs)
      })
      .catch((e) => setErr(e.message))
  }, [])

  // One unified option list for selects: day tours first, then journeys.
  const bookables = useMemo(
    () => [
      ...tours.map((t) => ({
        slug: t.slug,
        label: shortTitle(t.title),
        languages: t.languages?.length ? t.languages : DEFAULT_LANGUAGES,
        groupSize: t.groupSize || null,
        kind: 'tour',
      })),
      ...journeys.map((p) => ({
        slug: p.slug,
        label: shortTitle(p.name),
        languages: DEFAULT_LANGUAGES,
        groupSize: p.groupSize || null,
        kind: 'journey',
      })),
    ],
    [tours, journeys]
  )
  const bookableBySlug = useMemo(
    () => new Map(bookables.map((b) => [b.slug, b])),
    [bookables]
  )

  // ---- Manual (OTA) bookings ----------------------------------------------

  const addManual = (booking) => {
    setItem((t) => ({ ...t, manualBookings: [...t.manualBookings, booking] }))
  }

  const removeManual = (index) => {
    setItem((t) => ({
      ...t,
      manualBookings: t.manualBookings.filter((_, i) => i !== index),
    }))
  }

  // Total manual seats per tour+date+language, to flag over-capacity entry.
  const manualTotals = useMemo(() => {
    const totals = {}
    for (const b of item?.manualBookings || []) {
      const key = `${b.tourSlug}|${b.date}|${b.language}`
      totals[key] = (totals[key] || 0) + Number(b.numPeople || 0)
    }
    return totals
  }, [item?.manualBookings])

  // ---- Departure dates ------------------------------------------------------

  const addDeparture = (slug, date) => {
    if (!date) return
    setItem((t) => {
      const existing = t.departureDates[slug] || []
      if (existing.includes(date)) return t
      return {
        ...t,
        departureDates: { ...t.departureDates, [slug]: [...existing, date].sort() },
      }
    })
  }

  const removeDeparture = (slug, date) => {
    setItem((t) => {
      const next = (t.departureDates[slug] || []).filter((d) => d !== date)
      const departureDates = { ...t.departureDates }
      if (next.length) departureDates[slug] = next
      else delete departureDates[slug]
      return { ...t, departureDates }
    })
  }

  // ---- Blocked dates --------------------------------------------------------

  // Accepts a single date or an inclusive from/to range; ranges are expanded
  // into one record per day so the stored shape (and Airtable's) stays flat.
  const addBlocked = (from, to, tourSlug) => {
    if (!from) return
    const end = to && to >= from ? to : from
    const dates = []
    const cursor = new Date(`${from}T12:00:00Z`) // midday dodges DST edge cases
    while (dates.length < 366) {
      const iso = cursor.toISOString().slice(0, 10)
      dates.push(iso)
      if (iso >= end) break
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    setItem((t) => {
      const existing = new Set(t.blockedDates.map((b) => `${b.date}|${b.tourSlug}`))
      const added = dates
        .filter((d) => !existing.has(`${d}|${tourSlug}`))
        .map((date) => ({ date, tourSlug }))
      if (!added.length) return t
      const blockedDates = [...t.blockedDates, ...added].sort((a, b) =>
        a.date.localeCompare(b.date)
      )
      return { ...t, blockedDates }
    })
  }

  const removeBlocked = (dates, tourSlug) => {
    const doomed = new Set(dates.map((d) => `${d}|${tourSlug}`))
    setItem((t) => ({
      ...t,
      blockedDates: t.blockedDates.filter((b) => !doomed.has(`${b.date}|${b.tourSlug}`)),
    }))
  }

  // ---- Save -----------------------------------------------------------------

  const savingRef = useRef(false)
  const onSave = async () => {
    if (savingRef.current || !item) return
    savingRef.current = true
    setSaving(true)
    try {
      const saved = await api.availability.update(item)
      setItem(saved)
      markSaved(saved)
      toast.success('Availability saved — goes live on the next publish')
    } catch (e) {
      toast.error(`Save failed: ${e.message}`)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  // Same Cmd/Ctrl+S affordance as the collection editors.
  const onSaveRef = useRef()
  onSaveRef.current = onSave
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        onSaveRef.current?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (err && !item) return <div style={{ color: colors.danger }}>{err}</div>
  if (!item) return <div>Loading…</div>

  const today = new Date().toISOString().slice(0, 10)
  const scopeName = (slug) =>
    slug === ALL_TOURS ? 'All tours' : bookableBySlug.get(slug)?.label || slug

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Availability</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            External bookings, blocked dates and journey departures. Changes go live on the next
            publish.
          </div>
        </div>
        <SaveButton dirty={dirty} saving={saving} onClick={onSave} />
      </div>

      {/* ── 1 · External / OTA bookings ─────────────────────────────────── */}
      <section style={s.card}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>External bookings (OTA)</h2>
        <SectionHint>
          Seats sold on other channels (GetYourGuide, Viator, phone…). They reduce the spots
          shown on the website, on top of the site's own bookings. Airtable never overwrites
          these — this list is the single place they live.
        </SectionHint>

        <ManualAdder bookables={bookables} onAdd={addManual} />

        {item.manualBookings.length === 0 ? (
          <div style={{ ...s.subtle, marginTop: 14 }}>
            No external bookings yet. Add one above when a reservation comes in from an OTA.
          </div>
        ) : (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {item.manualBookings.map((b, i) => {
              const info = bookableBySlug.get(b.tourSlug)
              const total = manualTotals[`${b.tourSlug}|${b.date}|${b.language}`]
              const over = info?.groupSize && total > info.groupSize
              const isPast = b.date < today
              return (
                <div
                  key={`${b.tourSlug}|${b.date}|${b.language}|${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '9px 12px',
                    backgroundColor: colors.panelMuted,
                    border: `1px solid ${over ? colors.danger : colors.border}`,
                    borderRadius: 6,
                    fontSize: 13,
                    opacity: isPast ? 0.55 : 1,
                  }}
                >
                  <span style={{ minWidth: 96, fontWeight: 600 }}>{fmtDate(b.date)}</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {info?.label || b.tourSlug}
                    <span style={{ color: colors.textSubtle }}> · {cap(b.language) || 'Any language'}</span>
                  </span>
                  <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {b.numPeople} {b.numPeople === 1 ? 'person' : 'people'}
                  </span>
                  {b.note && (
                    <span
                      style={{
                        backgroundColor: colors.primarySoft,
                        color: colors.primary,
                        padding: '2px 8px',
                        borderRadius: 99,
                        fontSize: 11.5,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {b.note}
                    </span>
                  )}
                  {isPast && <span style={{ color: colors.textMuted, fontSize: 11.5 }}>past</span>}
                  {over && (
                    <span style={{ color: colors.danger, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      over capacity ({total}/{info.groupSize})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeManual(i)}
                    style={{ ...s.btnGhost, color: colors.danger, padding: '2px 8px' }}
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── 2 · Blocked dates ───────────────────────────────────────────── */}
      <section style={{ ...s.card, marginTop: 20 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Blocked dates</h2>
        <SectionHint tone="warn">
          Fallback for Airtable's BlockedDates table: any deploy that can reach Airtable replaces
          this list with Airtable's. Add dates here only while Airtable is down or over its API
          limit — and mirror them into Airtable afterwards.
        </SectionHint>

        <BlockedAdder bookables={bookables} onAdd={addBlocked} />

        {item.blockedDates.length === 0 ? (
          <div style={{ ...s.subtle, marginTop: 14 }}>No blocked dates.</div>
        ) : (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {groupRuns(item.blockedDates).map((run) => (
              <div
                key={`${run.dates[0]}|${run.tourSlug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  backgroundColor: colors.panelMuted,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  fontSize: 13,
                }}
              >
                <span>
                  <strong>{fmtRange(run.dates[0], run.dates[run.dates.length - 1])}</strong>
                  {run.dates.length > 1 && (
                    <span style={{ color: colors.textMuted }}> · {run.dates.length} days</span>
                  )}
                  <span style={{ color: colors.textSubtle }}> — {scopeName(run.tourSlug)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeBlocked(run.dates, run.tourSlug)}
                  style={{ ...s.btnGhost, color: colors.danger, padding: '2px 8px' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 3 · Journey departure dates ─────────────────────────────────── */}
      <section style={{ ...s.card, marginTop: 20 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Journey departure dates</h2>
        <SectionHint tone="warn">
          Fallback for Airtable's DepartureDates table — same rule as blocked dates: Airtable
          overwrites this list on any deploy that reaches it.
        </SectionHint>
        {journeys.length === 0 && <div style={s.subtle}>No journeys found.</div>}
        {journeys.map((pkg) => (
          <DepartureRow
            key={pkg.slug}
            label={shortTitle(pkg.name)}
            dates={item.departureDates[pkg.slug] || []}
            onAdd={(date) => addDeparture(pkg.slug, date)}
            onRemove={(date) => removeDeparture(pkg.slug, date)}
          />
        ))}
      </section>
    </div>
  )
}

// Collapse consecutive days with the same scope into one display row, so a
// blocked range reads as "1–14 Aug 2026 · 14 days" instead of 14 separate
// lines. Input is sorted by date (the save path guarantees it).
function groupRuns(blockedDates) {
  const bySlug = new Map()
  for (const b of blockedDates) {
    if (!bySlug.has(b.tourSlug)) bySlug.set(b.tourSlug, [])
    bySlug.get(b.tourSlug).push(b.date)
  }
  const nextDay = (iso) => {
    const d = new Date(`${iso}T12:00:00Z`)
    d.setUTCDate(d.getUTCDate() + 1)
    return d.toISOString().slice(0, 10)
  }
  const runs = []
  for (const [tourSlug, dates] of bySlug) {
    let run = null
    for (const date of dates) {
      if (run && date === nextDay(run.dates[run.dates.length - 1])) {
        run.dates.push(date)
      } else {
        run = { tourSlug, dates: [date] }
        runs.push(run)
      }
    }
  }
  return runs.sort((a, b) => a.dates[0].localeCompare(b.dates[0]))
}

function ManualAdder({ bookables, onAdd }) {
  const [slug, setSlug] = useState('')
  const [date, setDate] = useState('')
  const [language, setLanguage] = useState(DEFAULT_LANGUAGES[0])
  const [people, setPeople] = useState(2)
  const [note, setNote] = useState('')

  const selected = bookables.find((b) => b.slug === slug)
  const languages = selected?.languages || DEFAULT_LANGUAGES

  // Keep the language valid when switching tours.
  const onSlugChange = (value) => {
    setSlug(value)
    const langs = bookables.find((b) => b.slug === value)?.languages || DEFAULT_LANGUAGES
    if (!langs.includes(language)) setLanguage(langs[0])
  }

  const canAdd = slug && date && Number(people) >= 1

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <select
        value={slug}
        onChange={(e) => onSlugChange(e.target.value)}
        style={{ ...s.input, width: 280, padding: '6px 10px', color: slug ? undefined : colors.textMuted }}
      >
        <option value="">Choose a tour or journey…</option>
        {bookables.map((b) => (
          <option key={b.slug} value={b.slug}>
            {b.label}{b.kind === 'journey' ? ' (journey)' : ''}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ ...s.input, width: 165, padding: '6px 10px' }}
      />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ ...s.input, width: 120, padding: '6px 10px' }}
      >
        {languages.map((l) => (
          <option key={l} value={l}>{cap(l)}</option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        max="99"
        value={people}
        onChange={(e) => setPeople(e.target.value)}
        aria-label="Number of people"
        style={{ ...s.input, width: 70, padding: '6px 10px' }}
      />
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Source, e.g. GetYourGuide"
        maxLength={120}
        style={{ ...s.input, width: 190, padding: '6px 10px' }}
      />
      <button
        type="button"
        disabled={!canAdd}
        onClick={() => {
          onAdd({
            tourSlug: slug,
            date,
            language,
            numPeople: Math.floor(Number(people)),
            note: note.trim(),
          })
          setDate('')
          setPeople(2)
          setNote('')
        }}
        style={{ ...s.btnSecondary, opacity: canAdd ? 1 : 0.5, cursor: canAdd ? 'pointer' : 'not-allowed' }}
      >
        Add booking
      </button>
    </div>
  )
}

function DepartureRow({ label, dates, onAdd, onRemove }) {
  const [draft, setDraft] = useState('')
  return (
    <div style={{ padding: '14px 0', borderBottom: `1px solid ${colors.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <strong style={{ fontSize: 14 }}>{label}</strong>
        <span style={{ display: 'inline-flex', gap: 8 }}>
          <input
            type="date"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={{ ...s.input, width: 165, padding: '6px 10px' }}
          />
          <button
            type="button"
            onClick={() => {
              onAdd(draft)
              setDraft('')
            }}
            style={s.btnSecondary}
          >
            Add date
          </button>
        </span>
      </div>
      {dates.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {dates.map((d) => (
            <span
              key={d}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 8px 4px 12px',
                backgroundColor: colors.primarySoft,
                color: colors.primary,
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {fmtDate(d)}
              <button
                type="button"
                onClick={() => onRemove(d)}
                aria-label={`Remove ${fmtDate(d)}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.primary,
                  fontSize: 15,
                  lineHeight: 1,
                  padding: '0 4px',
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function BlockedAdder({ bookables, onAdd }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [slug, setSlug] = useState(ALL_TOURS)
  const isRange = to && from && to > from
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{ ...s.input, width: 165, padding: '6px 10px' }}
      />
      <span style={{ fontSize: 13, color: colors.textSubtle }}>to</span>
      <input
        type="date"
        value={to}
        min={from || undefined}
        onChange={(e) => setTo(e.target.value)}
        title="Optional — leave empty to block a single day"
        style={{ ...s.input, width: 165, padding: '6px 10px' }}
      />
      <select value={slug} onChange={(e) => setSlug(e.target.value)} style={{ ...s.input, width: 240, padding: '6px 10px' }}>
        <option value={ALL_TOURS}>All tours</option>
        {bookables.map((b) => (
          <option key={b.slug} value={b.slug}>
            {b.label}{b.kind === 'journey' ? ' (journey)' : ''}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => {
          onAdd(from, to, slug)
          setFrom('')
          setTo('')
        }}
        style={s.btnSecondary}
      >
        {isRange ? 'Block range' : 'Block date'}
      </button>
      <span style={{ fontSize: 12, color: colors.textMuted, flexBasis: '100%' }}>
        Leave "to" empty to block a single day. A range blocks every day in between, inclusive.
      </span>
    </div>
  )
}
