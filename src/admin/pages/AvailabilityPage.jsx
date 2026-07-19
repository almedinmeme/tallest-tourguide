// Availability fallback editor — journey departure dates + blocked dates,
// backed by src/data/airtable/*.json (the files the build-time Airtable
// sync regenerates). AIRTABLE IS THE PRIORITY SOURCE: any build that can
// reach Airtable overwrites what's saved here. This screen exists so dates
// can still be managed and published while Airtable is down or over its
// monthly API cap — mirror any changes into Airtable once it's back.
import { useEffect, useRef, useState } from 'react'
import * as api from '../api'
import { s, colors } from '../styles'
import SaveButton from '../components/SaveButton'
import { useToast } from '../hooks/useToast'
import { useDirtyTracker } from '../hooks/dirtyContext'

const ALL_TOURS = '' // empty tourSlug on a blocked date blocks every tour

export default function AvailabilityPage() {
  const [item, setItem] = useState(null) // { departureDates, blockedDates }
  const [journeys, setJourneys] = useState([])
  const [tours, setTours] = useState([])
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const { dirty, markSaved } = useDirtyTracker(item)

  useEffect(() => {
    Promise.all([api.availability.get(), api.packages.list(), api.tours.list()])
      .then(([availability, pkgs, trs]) => {
        setItem(availability)
        setJourneys(pkgs)
        setTours(trs)
      })
      .catch((e) => setErr(e.message))
  }, [])

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

  const tourName = (slug) =>
    slug === ALL_TOURS
      ? 'All tours'
      : tours.find((t) => t.slug === slug)?.title ||
        journeys.find((p) => p.slug === slug)?.name ||
        slug

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Availability</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            Backup for when Airtable is unavailable — departure dates and blocked dates.
          </div>
        </div>
        <SaveButton dirty={dirty} saving={saving} onClick={onSave} />
      </div>

      {/* Priority warning */}
      <div
        style={{
          backgroundColor: colors.warningSoft,
          border: `1px solid ${colors.warning}33`,
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 20,
          fontSize: 13,
          lineHeight: 1.6,
          color: colors.warning,
        }}
      >
        <strong>Airtable stays in charge.</strong> Every deploy that can reach Airtable overwrites
        these values with Airtable's data. Use this screen only while Airtable is down or over its
        API limit — and copy any dates you add here into Airtable afterwards, or the next
        successful sync will remove them.
      </div>

      {/* Departure dates per journey */}
      <section style={s.card}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Journey departure dates</h2>
        {journeys.length === 0 && <div style={s.subtle}>No journeys found.</div>}
        {journeys.map((pkg) => (
          <DepartureRow
            key={pkg.slug}
            label={pkg.name}
            dates={item.departureDates[pkg.slug] || []}
            onAdd={(date) => addDeparture(pkg.slug, date)}
            onRemove={(date) => removeDeparture(pkg.slug, date)}
          />
        ))}
      </section>

      {/* Blocked dates */}
      <section style={{ ...s.card, marginTop: 20 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Blocked dates</h2>
        <div style={{ ...s.subtle, marginBottom: 14 }}>
          Dates that can't be booked. "All tours" blocks the whole calendar for that day.
        </div>
        <BlockedAdder tours={tours} journeys={journeys} onAdd={addBlocked} />
        {item.blockedDates.length === 0 ? (
          <div style={{ ...s.subtle, marginTop: 12 }}>No blocked dates.</div>
        ) : (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {groupRuns(item.blockedDates).map((run) => (
              <div
                key={`${run.dates[0]}|${run.tourSlug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: colors.panelMuted,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  fontSize: 13,
                }}
              >
                <span>
                  <strong>
                    {run.dates.length === 1
                      ? run.dates[0]
                      : `${run.dates[0]} → ${run.dates[run.dates.length - 1]}`}
                  </strong>
                  {run.dates.length > 1 && (
                    <span style={{ color: colors.textMuted }}> ({run.dates.length} days)</span>
                  )}
                  <span style={{ color: colors.textSubtle }}> — {tourName(run.tourSlug)}</span>
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
    </div>
  )
}

// Collapse consecutive days with the same scope into one display row, so a
// blocked range reads as "2026-08-01 → 2026-08-14 (14 days)" instead of 14
// separate lines. Input is sorted by date (the save path guarantees it).
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
            style={{ ...s.input, width: 170, padding: '6px 10px' }}
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
              {d}
              <button
                type="button"
                onClick={() => onRemove(d)}
                aria-label={`Remove ${d}`}
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

function BlockedAdder({ tours, journeys, onAdd }) {
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
        style={{ ...s.input, width: 170, padding: '6px 10px' }}
      />
      <span style={{ fontSize: 13, color: colors.textSubtle }}>to</span>
      <input
        type="date"
        value={to}
        min={from || undefined}
        onChange={(e) => setTo(e.target.value)}
        title="Optional — leave empty to block a single day"
        style={{ ...s.input, width: 170, padding: '6px 10px' }}
      />
      <select value={slug} onChange={(e) => setSlug(e.target.value)} style={{ ...s.input, width: 240, padding: '6px 10px' }}>
        <option value={ALL_TOURS}>All tours</option>
        {tours.map((t) => (
          <option key={t.slug} value={t.slug}>{t.title}</option>
        ))}
        {journeys.map((p) => (
          <option key={p.slug} value={p.slug}>{p.name} (journey)</option>
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
