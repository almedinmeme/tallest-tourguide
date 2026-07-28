// Reviews — picks what the homepage reviews section shows.
//
// Two halves, because the two sources work differently:
//   • Curated highlights (src/data/featuredReviews.json) — added, edited,
//     reordered and hidden here. These are reviews copied verbatim from
//     Tripadvisor or sent to us directly.
//   • Google (src/data/google/reviews.json) — read-only. Google's API returns
//     at most five reviews and chooses which; all we can do is hide ones we'd
//     rather not feature, stored as settings.hiddenGoogleReviewIds.
//
// Everything saves in one go, then goes live on the next Publish.

import { useEffect, useMemo, useRef, useState } from 'react'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import SaveButton from '../components/SaveButton'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../hooks/useToast'
import { useDirtyTracker } from '../hooks/dirtyContext'

const SOURCES = [
  { value: 'tripadvisor', label: 'Tripadvisor' },
  { value: 'google', label: 'Google' },
  { value: 'direct', label: 'Sent to us directly' },
]

// Catalogue titles can carry a subtitle after a colon; the dropdown only
// needs the part before it.
const shortTitle = (title) => (title || '').split(':')[0].trim()

// New rows get a temporary negative id so React keys stay stable until the
// server assigns a real one on save.
let tempId = -1

export default function ReviewsPage() {
  const [items, setItems] = useState(null)
  const [google, setGoogle] = useState(null)
  const [settings, setSettings] = useState(null)
  const [bookables, setBookables] = useState([])
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const toast = useToast()

  // Snapshot of what's on disk, so save only sends what actually changed.
  const savedRef = useRef({ items: [], hidden: [] })

  const hidden = useMemo(() => settings?.hiddenGoogleReviewIds || [], [settings])
  const dirtyState = useMemo(
    () => (items && settings ? { items, hidden } : null),
    [items, settings, hidden],
  )
  const { dirty, markSaved } = useDirtyTracker(dirtyState)

  useEffect(() => {
    Promise.all([
      api.reviews.list(), api.googleReviews.get(), api.settings.get(),
      api.tours.list(), api.packages.list(),
    ])
      .then(([list, g, st, trs, pkgs]) => {
        setItems(list)
        setGoogle(g)
        setSettings(st)
        setBookables([
          ...trs.map((t) => ({ slug: t.slug, label: shortTitle(t.title) })),
          ...pkgs.map((p) => ({ slug: p.slug, label: shortTitle(p.name) })),
        ])
        savedRef.current = { items: list, hidden: st.hiddenGoogleReviewIds || [] }
      })
      .catch((e) => setErr(e.message))
  }, [])

  const patch = (id, changes) =>
    setItems((list) => list.map((r) => (r.id === id ? { ...r, ...changes } : r)))

  const move = (id, delta) =>
    setItems((list) => {
      const i = list.findIndex((r) => r.id === id)
      const j = i + delta
      if (i === -1 || j < 0 || j >= list.length) return list
      const next = [...list]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const addNew = () =>
    setItems((list) => [
      ...list,
      {
        id: tempId--,
        source: 'tripadvisor',
        name: '',
        location: '',
        tour: '',
        tourSlug: '',
        rating: 5,
        date: '',
        text: '',
        published: true,
      },
    ])

  const toggleGoogle = (id) =>
    setSettings((st) => {
      const current = st.hiddenGoogleReviewIds || []
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
      return { ...st, hiddenGoogleReviewIds: next }
    })

  const confirmDelete = async () => {
    const { id, name } = pendingDelete
    setPendingDelete(null)
    // Unsaved rows only exist in local state.
    if (id < 0) {
      setItems((list) => list.filter((r) => r.id !== id))
      return
    }
    try {
      await api.reviews.remove(id)
      const list = await api.reviews.list()
      setItems(list)
      savedRef.current = { ...savedRef.current, items: list }
      toast.success(`Deleted the review from ${name || 'this traveller'}`)
    } catch (e) {
      toast.error(`Delete failed: ${e.message}`)
    }
  }

  const onSave = async () => {
    setSaving(true)
    try {
      const before = new Map(savedRef.current.items.map((r) => [r.id, JSON.stringify(r)]))
      const ids = []
      for (const item of items) {
        if (item.id < 0) {
          const { id: _tmp, ...body } = item
          const created = await api.reviews.create(body)
          ids.push(created.id)
        } else {
          if (before.get(item.id) !== JSON.stringify(item)) await api.reviews.update(item.id, item)
          ids.push(item.id)
        }
      }
      // Array order is render order on the site.
      await api.reviews.reorder(ids)

      if (JSON.stringify(hidden) !== JSON.stringify(savedRef.current.hidden)) {
        await api.settings.update(settings)
      }

      const list = await api.reviews.list()
      setItems(list)
      savedRef.current = { items: list, hidden }
      markSaved({ items: list, hidden })
      toast.success('Reviews saved — hit Publish to put them live')
    } catch (e) {
      toast.error(`Save failed: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (err) return <div style={{ color: colors.danger }}>{err}</div>
  if (!items || !settings) return <div>Loading…</div>

  const shownCount = items.filter((r) => r.published !== false).length
  const googleReviews = google?.reviews || []
  const googleShown = googleReviews.filter((r) => !hidden.includes(r.id)).length

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Reviews</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            What the homepage reviews section shows — {shownCount} curated
            {googleReviews.length > 0 && ` + ${googleShown} from Google`}, in this order.
          </div>
        </div>
        <SaveButton dirty={dirty} saving={saving} onClick={onSave} />
      </div>

      {/* ── CURATED ──────────────────────────────────────── */}
      <section style={s.card}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Chosen reviews</h2>
            <p style={{ ...s.subheadingHint, maxWidth: 620 }}>
              Copy these verbatim from Tripadvisor (or from a message a traveller sent you) —
              never reword someone's review. Untick “Show on the site” to park one without
              deleting it. The order here is the order they appear.
            </p>
          </div>
          <button style={{ ...s.btn, ...s.btnSecondary, flexShrink: 0 }} onClick={addNew}>+ Add review</button>
        </div>

        {items.length === 0 && (
          <div style={s.emptyState}>No reviews yet — add the first one.</div>
        )}

        {items.map((r, i) => (
          <div
            key={r.id}
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 16,
              marginTop: 14,
              backgroundColor: r.published === false ? colors.panelMuted : colors.panel,
              opacity: r.published === false ? 0.75 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ ...s.pillNeutral, fontFamily: fonts.mono }}>{i + 1}</span>

              <label style={checkboxLabel}>
                <input
                  type="checkbox"
                  checked={r.published !== false}
                  onChange={(e) => patch(r.id, { published: e.target.checked })}
                />
                Show on the site
              </label>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button
                  style={{ ...s.btn, ...s.btnGhost, padding: '6px 10px' }}
                  onClick={() => move(r.id, -1)}
                  disabled={i === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  style={{ ...s.btn, ...s.btnGhost, padding: '6px 10px' }}
                  onClick={() => move(r.id, 1)}
                  disabled={i === items.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  style={{ ...s.btn, ...s.btnGhost, color: colors.danger }}
                  onClick={() => setPendingDelete({ id: r.id, name: r.name })}
                >
                  Delete
                </button>
              </div>
            </div>

            <FormField label="Review text" hint="Exactly as they wrote it. Trim with an ellipsis if it's very long.">
              <textarea
                style={{ ...s.textarea, minHeight: 96 }}
                value={r.text || ''}
                onChange={(e) => patch(r.id, { text: e.target.value })}
              />
            </FormField>

            <div style={s.grid2}>
              <FormField label="Name" hint="As shown on the review, e.g. “Michael P.”">
                <input style={s.input} value={r.name || ''} onChange={(e) => patch(r.id, { name: e.target.value })} />
              </FormField>
              <FormField label="Where they're from" hint="Optional, e.g. “Nicosia, Cyprus”.">
                <input style={s.input} value={r.location || ''} onChange={(e) => patch(r.id, { location: e.target.value })} />
              </FormField>
            </div>

            <div style={s.grid2}>
              <FormField
                label="Show on which tour page"
                hint="Pick the tour and this review appears on that page too. Leave blank and it only shows on the homepage."
              >
                <select
                  style={s.input}
                  value={r.tourSlug || ''}
                  onChange={(e) => patch(r.id, { tourSlug: e.target.value })}
                >
                  <option value="">— homepage only —</option>
                  {bookables.map((b) => (
                    <option key={b.slug} value={b.slug}>{b.label}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Tour they took" hint="Optional — the wording shown under their name, e.g. “Sarajevo Siege Tour”.">
                <input style={s.input} value={r.tour || ''} onChange={(e) => patch(r.id, { tour: e.target.value })} />
              </FormField>
            </div>

            <div style={s.grid2}>
              <FormField label="Where it was left" hint="Sets the little logo on the card.">
                <select
                  style={s.input}
                  value={r.source || 'tripadvisor'}
                  onChange={(e) => patch(r.id, { source: e.target.value })}
                >
                  {SOURCES.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <div style={s.grid2}>
              <FormField label="Stars" hint="1–5.">
                <input
                  style={s.input}
                  type="number"
                  min="1"
                  max="5"
                  step="1"
                  value={r.rating ?? 5}
                  onChange={(e) => patch(r.id, { rating: Number(e.target.value) })}
                />
              </FormField>
              <FormField label="Month it was written" hint="Optional, YYYY-MM (e.g. 2025-06). Leave blank if you're unsure — don't guess.">
                <input
                  style={s.input}
                  placeholder="2025-06"
                  value={r.date || ''}
                  onChange={(e) => patch(r.id, { date: e.target.value })}
                />
              </FormField>
            </div>
          </div>
        ))}
      </section>

      {/* ── GOOGLE ───────────────────────────────────────── */}
      <section style={s.card}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>From Google</h2>
        <p style={{ ...s.subheadingHint, maxWidth: 620 }}>
          Pulled from your Google Business Profile every time the site is built. Google returns at
          most five reviews and decides which ones — you can hide any of them here, but the text
          can't be edited, and your Google star rating and total review count always come straight
          from Google.
        </p>

        {googleReviews.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Not connected yet</div>
            <div style={{ ...s.subtle, maxWidth: 560, margin: '0 auto' }}>
              Add your Google Place ID under Settings and set GOOGLE_MAPS_API_KEY in the build
              environment, then run <code style={{ fontFamily: fonts.mono }}>npm run sync:google</code>.
              The full walkthrough is in <code style={{ fontFamily: fonts.mono }}>docs/google-reviews-setup.md</code>.
              Until then the homepage shows your curated reviews only.
            </div>
          </div>
        ) : (
          googleReviews.map((r) => {
            const isHidden = hidden.includes(r.id)
            return (
              <div
                key={r.id}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  padding: 16,
                  marginTop: 12,
                  backgroundColor: isHidden ? colors.panelMuted : colors.panel,
                  opacity: isHidden ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: 14 }}>{r.authorName}</strong>
                  <span style={s.pillNeutral}>{'★'.repeat(Math.round(r.rating || 5))}</span>
                  <span style={s.subtle}>{r.relativeTime}</span>
                  <label style={{ ...checkboxLabel, marginLeft: 'auto' }}>
                    <input type="checkbox" checked={!isHidden} onChange={() => toggleGoogle(r.id)} />
                    Show on the site
                  </label>
                </div>
                <p style={{ ...s.subtle, margin: 0, lineHeight: 1.6 }}>{r.text}</p>
              </div>
            )
          })
        )}
      </section>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this review?"
        body={<>The review from “{pendingDelete?.name || 'this traveller'}” will be removed. This cannot be undone.</>}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

const fonts = { mono: 'ui-monospace, SFMono-Regular, monospace' }

const checkboxLabel = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  fontSize: 13,
  fontWeight: 600,
  color: colors.textSubtle,
  cursor: 'pointer',
}
