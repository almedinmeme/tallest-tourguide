// Reviews — picks what the homepage reviews section and the tour pages show.
//
// Two halves, because the two sources work differently:
//   • Curated highlights (src/data/featuredReviews.json) — added, edited,
//     reordered and hidden here. These are reviews copied verbatim from
//     Tripadvisor or sent to us directly.
//   • Google (src/data/google/reviews.json) — read-only. Google's API returns
//     at most five reviews and chooses which; all we can do is hide ones we'd
//     rather not feature, stored as settings.hiddenGoogleReviewIds.
//
// Built for a long list. Pulling a few hundred Tripadvisor reviews across
// turns this page into a library, so every row is collapsed to one line of
// evidence (who, where it was left, which tour, whether it's live) and opens
// only when it's the one being edited. Search and the filters narrow the list;
// reordering is deliberately disabled while they're active, because dragging
// row 4 of a filtered view past row 9 of the real one is a coin toss.
//
// Everything saves in one go, then goes live on the next Publish.

import { useEffect, useMemo, useRef, useState } from 'react'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import SaveButton from '../components/SaveButton'
import ConfirmDialog from '../components/ConfirmDialog'
import { SearchBox } from '../components/ListChrome'
import { useToast } from '../hooks/useToast'
import { useDirtyTracker } from '../hooks/dirtyContext'

const SOURCES = [
  { value: 'tripadvisor', label: 'Tripadvisor' },
  { value: 'google', label: 'Google' },
  { value: 'direct', label: 'Sent to us directly' },
]

// How many cards the homepage reviews section shows, and how it builds them:
// the Google cards and the curated ones are interleaved, then cut at six.
// Mirrored from src/data/reviewFeed.js so this page can tell you which of your
// reviews actually made it onto the homepage — the first thing anyone asks
// once the list is longer than the section.
const HOMEPAGE_SLOTS = 6

function homepageCuratedIds(published, googleCount) {
  const ids = []
  for (let i = 0; i < Math.max(googleCount, published.length); i++) {
    if (i < googleCount) ids.push(null)
    if (published[i]) ids.push(published[i].id)
  }
  return new Set(ids.slice(0, HOMEPAGE_SLOTS).filter((id) => id !== null))
}

// Catalogue titles can carry a subtitle after a colon; the dropdown only
// needs the part before it.
const shortTitle = (title) => (title || '').split(':')[0].trim()

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december']

// Words that say nothing about which tour a review is for.
const TITLE_NOISE = new Set(['tour', 'tours', 'trip', 'day', 'full', 'from', 'the', 'a', 'an',
  'and', 'of', 'in', 'to', 'with', 'for', 'private', 'experience', 'guide', 'guided', 'visit'])

const words = (str) =>
  (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9šđčćžăâîșț\s]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !TITLE_NOISE.has(w))

// "Reviewed March 8, 2020" / "12 June 2025" / "Date of experience: March 2020"
// all reduce to the month it happened.
function monthYear(str) {
  const m = (str || '').toLowerCase().match(new RegExp(`(${MONTHS.join('|')})\\w*\\s+(?:\\d{1,2},?\\s+)?(\\d{4})`))
  if (m) return `${m[2]}-${String(MONTHS.indexOf(m[1]) + 1).padStart(2, '0')}`
  const dm = (str || '').toLowerCase().match(new RegExp(`(\\d{1,2})\\s+(${MONTHS.join('|')})\\w*\\s+(\\d{4})`))
  if (dm) return `${dm[3]}-${String(MONTHS.indexOf(dm[2]) + 1).padStart(2, '0')}`
  return ''
}

// Which catalogue entry a pasted "Review of …" line is talking about.
//
// Tripadvisor's product names are not ours — "Sarajevo Siege War Tour | Tunnel,
// Bobsled Track & Jewish Cemetery" is our "Sarajevo War Tour: Siege, Tunnel of
// Hope & Fall of Yugoslavia" — so this scores shared words, weighting each by
// how rare it is across the catalogue: "sarajevo" is in a dozen titles and
// counts for almost nothing, "siege" is in one and counts for a lot.
//
// It only returns a slug when one entry wins clearly. A near-tie means leave
// it blank and let a human pick: attaching a real person's words to the wrong
// tour is the one mistake worth being paranoid about here.
function matchTourSlug(title, bookables) {
  const asked = words(title)
  if (asked.length === 0 || bookables.length === 0) return ''

  const frequency = new Map()
  const indexed = bookables.map((b) => {
    const set = new Set(words(b.label))
    set.forEach((w) => frequency.set(w, (frequency.get(w) || 0) + 1))
    return { slug: b.slug, set }
  })

  const scores = indexed
    .map(({ slug, set }) => ({
      slug,
      score: asked.reduce((sum, w) => (set.has(w) ? sum + 1 / (frequency.get(w) || 1) : sum), 0),
    }))
    .sort((a, b) => b.score - a.score)

  const [best, next] = scores
  if (!best || best.score < 1) return ''
  if (next && next.score > 0 && best.score < next.score * 1.5) return ''
  return best.slug
}

// Best-effort parse of a review block copied straight off Tripadvisor. The
// real thing pastes in this order, with any of the middle lines missing:
//
//   Albert P                                    ← name
//   42                                          ← their contribution count
//   Great tour with Meme, the best guide !      ← the review's own title
//   Review of Sarajevo Siege War Tour | Tunnel… ← which product
//   Reviewed March 8, 2020
//   We learned a lot about the siege…           ← the review itself
//   Date of experience: March 2020
//
// Two rules keep it honest. Order beats content: the title sits directly
// above the "Review of" line, which is how it avoids being mistaken for a
// location just because it happens to contain a comma. And anything it can't
// work out is left blank rather than invented — a wrong name on a real
// person's words is worse than no name. Everything lands in the form for
// checking; nothing is saved until you save.
function parseReview(raw, bookables = []) {
  const lines = (raw || '').split('\n').map((l) => l.trim()).filter(Boolean)
  const out = {
    name: '', location: '', rating: 5, date: '', text: '', tour: '', tourSlug: '',
    missing: [],
  }
  if (lines.length === 0) return out

  const leftovers = []
  let reviewOfAt = -1
  let experienceDate = ''
  let ratingFound = false

  lines.forEach((line, i) => {
    // A bare number is the contribution counter under the name; the same goes
    // for "42 contributions" and the interface furniture around the review.
    if (/^[\d,.\s]+$/.test(line)) return
    if (/^\d[\d,]*\s+(contributions?|reviews?|helpful votes?|cities visited)/i.test(line)) return
    if (/^(read more|show less|helpful|share|like|report|write a review)$/i.test(line)) return
    if (/^written\s/i.test(line)) return

    let m
    if ((m = line.match(/^review of[:\s]+(.+)$/i))) {
      // Only the headline part — "Sarajevo Siege War Tour | Tunnel, Bobsled…"
      // is a product name, not something to print under someone's byline.
      out.tour = m[1].split(/[|:–—]/)[0].trim()
      reviewOfAt = i
      return
    }
    if ((m = line.match(/^reviewed[:\s]+(.+)$/i))) {
      out.date = monthYear(m[1]) || out.date
      return
    }
    if ((m = line.match(/^date of experience[:\s]+(.+)$/i))) {
      experienceDate = monthYear(m[1])
      return
    }
    if ((m = line.match(/(\d)(?:[.,]\d)?\s*(?:of|\/)\s*5/i)) || (m = line.match(/^([1-5])\s*bubbles?$/i))) {
      out.rating = Number(m[1])
      ratingFound = true
      return
    }
    leftovers.push({ i, line })
  })

  // When they didn't write a review date, when they travelled is the honest
  // second choice.
  if (!out.date && experienceDate) out.date = experienceDate

  // The review's own title sits directly above the "Review of" line. We don't
  // display titles anywhere, so it's dropped rather than folded into the text.
  if (reviewOfAt > -1) {
    const titleAt = leftovers.filter((l) => l.i < reviewOfAt).pop()
    if (titleAt) leftovers.splice(leftovers.indexOf(titleAt), 1)
  }

  // The review itself: the long lines, kept in order so a review written in
  // paragraphs survives as paragraphs.
  const body = leftovers.filter((l) => l.line.length >= 60)
  if (body.length > 0) {
    out.text = body.map((l) => l.line).join('\n\n')
    body.forEach((l) => leftovers.splice(leftovers.indexOf(l), 1))
  }

  // What's left is the name, then possibly where they're from.
  if (leftovers.length > 0) out.name = leftovers.shift().line
  const maybeLocation = leftovers[0]?.line || ''
  if (
    maybeLocation.includes(',') &&
    maybeLocation.length <= 48 &&
    maybeLocation.split(/\s+/).length <= 6 &&
    !/[!?]/.test(maybeLocation)
  ) {
    out.location = maybeLocation
  }

  if (out.tour) out.tourSlug = matchTourSlug(out.tour, bookables)

  if (!ratingFound) out.missing.push('the star rating (left at 5)')
  if (!out.name) out.missing.push('their name')
  if (!out.date) out.missing.push('the month')
  if (out.tour && !out.tourSlug) out.missing.push('which tour page it belongs to')
  return out
}

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
  const [openId, setOpenId] = useState(null)
  const [query, setQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [tourFilter, setTourFilter] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [paste, setPaste] = useState('')
  const [pasteOpen, setPasteOpen] = useState(false)
  // Pulling a batch off one tour's Tripadvisor page means every review in the
  // batch belongs to the same tour, so the next one starts where you left off.
  const [lastTourSlug, setLastTourSlug] = useState('')
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

  const moveToTop = (id) =>
    setItems((list) => {
      const i = list.findIndex((r) => r.id === id)
      if (i <= 0) return list
      const next = [...list]
      next.unshift(next.splice(i, 1)[0])
      return next
    })

  // New rows go to the top: a review you've just added is the one you want to
  // see, and the bottom of a list of two hundred is nowhere.
  const addNew = (fields = {}) => {
    const id = tempId--
    setItems((list) => [
      {
        id,
        source: 'tripadvisor',
        name: '',
        location: '',
        tour: '',
        tourSlug: lastTourSlug,
        rating: 5,
        date: '',
        text: '',
        published: true,
        ...fields,
      },
      ...list,
    ])
    setQuery('')
    setSourceFilter('all')
    setTourFilter('all')
    setStateFilter('all')
    setOpenId(id)
  }

  const addFromPaste = () => {
    if (!paste.trim()) return
    const { missing, ...fields } = parseReview(paste, bookables)
    // A blank tourSlug from the parser shouldn't wipe the tour the last few
    // pastes were pinned to — a batch usually comes off one tour's page.
    addNew({ ...fields, tourSlug: fields.tourSlug || lastTourSlug })
    setPaste('')
    if (missing.length > 0) {
      toast.success(`Added — check ${missing.join(', ')} before saving`)
    } else {
      toast.success('Added — check it reads right, then save')
    }
  }

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

  const googleReviews = google?.reviews || []
  const googleShown = googleReviews.filter((r) => !hidden.includes(r.id))
  const published = items.filter((r) => r.published !== false)
  const onHomepage = homepageCuratedIds(published, googleShown.length)
  const attachedCount = items.filter((r) => r.tourSlug).length

  const labelForSlug = (slug) => bookables.find((b) => b.slug === slug)?.label || slug

  const filtering = query.trim() !== '' || sourceFilter !== 'all' || tourFilter !== 'all' || stateFilter !== 'all'
  const q = query.trim().toLowerCase()
  const filtered = items.filter((r) => {
    if (sourceFilter !== 'all' && (r.source || 'tripadvisor') !== sourceFilter) return false
    if (tourFilter === 'none' && r.tourSlug) return false
    if (tourFilter !== 'all' && tourFilter !== 'none' && r.tourSlug !== tourFilter) return false
    if (stateFilter === 'live' && r.published === false) return false
    if (stateFilter === 'hidden' && r.published !== false) return false
    if (stateFilter === 'homepage' && !onHomepage.has(r.id)) return false
    if (!q) return true
    return `${r.name} ${r.text} ${r.location} ${r.tour}`.toLowerCase().includes(q)
  })

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Reviews</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            {items.length} curated ({published.length} live){googleShown.length > 0 && `, ${googleShown.length} from Google`} ·
            {' '}homepage has room for {HOMEPAGE_SLOTS}: {onHomepage.size} of yours
            {googleShown.length > 0 && ` + ${Math.min(googleShown.length, HOMEPAGE_SLOTS - onHomepage.size)} from Google`} ·{' '}
            {attachedCount} pinned to a tour page
          </div>
        </div>
        <SaveButton dirty={dirty} saving={saving} onClick={onSave} />
      </div>

      {/* ── CURATED ──────────────────────────────────────── */}
      <section style={s.card}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <div>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Chosen reviews</h2>
            <p style={{ ...s.subheadingHint, maxWidth: 640, marginBottom: 0 }}>
              Copy these verbatim from Tripadvisor (or from a message a traveller sent you) —
              never reword someone&rsquo;s review. The order here is the order they appear;
              the top few are the ones the homepage has room for. Pin one to a tour and it
              also shows on that tour&rsquo;s page.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              style={{ ...s.btn, ...s.btnSecondary }}
              onClick={() => setPasteOpen((v) => !v)}
              aria-expanded={pasteOpen}
            >
              Paste from Tripadvisor
            </button>
            <button style={s.btn} onClick={() => addNew()}>+ Add review</button>
          </div>
        </div>

        {/* Copying two hundred reviews across by hand is the actual work here,
            so the paste box takes a first guess at the fields and hands them
            over for checking. Nothing is saved until you save. */}
        {pasteOpen && (
          <div style={{ ...filterBar, display: 'block', marginBottom: 12 }}>
            <div style={{ ...s.subtle, marginBottom: 8 }}>
              Select a whole review on Tripadvisor and paste it here — all of it, from their
              name down to the date of experience. The contribution count and the review&rsquo;s
              own headline are ignored, and &ldquo;Review of…&rdquo; picks the tour page where
              it&rsquo;s obvious which one it is. Everything is a guess; check it before saving.
            </div>
            <textarea
              style={{ ...s.textarea, minHeight: 130, backgroundColor: colors.panel }}
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder={'Albert P\n42\nGreat tour with Meme, the best guide !\nReview of Sarajevo Siege War Tour | Tunnel, Bobsled Track & Jewish Cemetery\nReviewed March 8, 2020\nWe learned a lot about the siege of the city between 1992 and 1995…\n\nDate of experience: March 2020'}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button style={s.btn} onClick={addFromPaste} disabled={!paste.trim()}>
                Add as a new review
              </button>
              <button style={{ ...s.btn, ...s.btnGhost }} onClick={() => { setPaste(''); setPasteOpen(false) }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={filterBar}>
          <SearchBox value={query} onChange={setQuery} placeholder="Search name or words…" />
          <select style={selectStyle} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="all">Anywhere</option>
            {SOURCES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select style={selectStyle} value={tourFilter} onChange={(e) => setTourFilter(e.target.value)}>
            <option value="all">Any tour</option>
            <option value="none">Not pinned to a tour</option>
            {bookables.map((b) => <option key={b.slug} value={b.slug}>{b.label}</option>)}
          </select>
          <select style={selectStyle} value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
            <option value="all">Live and hidden</option>
            <option value="live">Live only</option>
            <option value="hidden">Hidden only</option>
            <option value="homepage">On the homepage</option>
          </select>
          {filtering && (
            <button
              style={{ ...s.btn, ...s.btnGhost }}
              onClick={() => { setQuery(''); setSourceFilter('all'); setTourFilter('all'); setStateFilter('all') }}
            >
              Clear
            </button>
          )}
          <span style={{ ...s.subtle, marginLeft: 'auto', fontSize: 13 }}>
            {filtered.length === items.length
              ? `${items.length} reviews`
              : `${filtered.length} of ${items.length}`}
          </span>
        </div>

        {items.length === 0 && <div style={s.emptyState}>No reviews yet — add the first one.</div>}
        {items.length > 0 && filtered.length === 0 && (
          <div style={s.emptyState}>Nothing matches those filters.</div>
        )}

        {filtered.map((r) => {
          const i = items.indexOf(r)
          const isOpen = openId === r.id
          const isHidden = r.published === false
          return (
            <div
              key={r.id}
              style={{
                border: `1px solid ${isOpen ? colors.primary : colors.border}`,
                borderRadius: 10,
                marginTop: 10,
                backgroundColor: isHidden ? colors.panelMuted : colors.panel,
                boxShadow: isOpen ? `0 0 0 3px ${colors.primaryRing}` : 'none',
                overflow: 'hidden',
              }}
            >
              {/* ── Collapsed row: everything you need to find it again ── */}
              <div style={rowStyle}>
                <span style={{ ...s.pillNeutral, fontFamily: mono, minWidth: 34, justifyContent: 'center', flexShrink: 0 }}>
                  {i + 1}
                </span>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: 14, opacity: isHidden ? 0.6 : 1 }}>
                      {r.name || <em style={{ color: colors.textMuted, fontWeight: 400 }}>Unnamed</em>}
                    </strong>
                    <span style={{ color: colors.accent, fontSize: 12, letterSpacing: 1 }}>
                      {'★'.repeat(Math.max(0, Math.min(5, Math.round(r.rating ?? 5))))}
                    </span>
                    <span style={s.pillNeutral}>{SOURCES.find((o) => o.value === (r.source || 'tripadvisor'))?.label}</span>
                    {r.tourSlug && <span style={s.pill}>{labelForSlug(r.tourSlug)}</span>}
                    {onHomepage.has(r.id) && <span style={{ ...s.pill, backgroundColor: colors.warningSoft, color: colors.warning, borderColor: `${colors.warning}33` }}>Homepage</span>}
                  </div>
                  <div style={{ ...s.subtle, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: isHidden ? 0.6 : 1 }}>
                    {r.text || 'No text yet'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <button
                    style={{ ...s.btn, ...(isHidden ? s.btnGhost : s.btnSecondary), padding: '6px 12px', color: isHidden ? colors.textMuted : colors.success }}
                    onClick={() => patch(r.id, { published: isHidden })}
                    title={isHidden ? 'Hidden from the site' : 'Live on the site'}
                  >
                    {isHidden ? 'Hidden' : '● Live'}
                  </button>
                  <button
                    style={{ ...s.btn, ...s.btnGhost, padding: '6px 10px' }}
                    onClick={() => moveToTop(r.id)}
                    disabled={filtering || i === 0}
                    title={filtering ? 'Clear the filters to reorder' : 'Move to the top'}
                  >
                    ⤒
                  </button>
                  <button
                    style={{ ...s.btn, ...s.btnGhost, padding: '6px 10px' }}
                    onClick={() => move(r.id, -1)}
                    disabled={filtering || i === 0}
                    title={filtering ? 'Clear the filters to reorder' : 'Move up'}
                  >
                    ↑
                  </button>
                  <button
                    style={{ ...s.btn, ...s.btnGhost, padding: '6px 10px' }}
                    onClick={() => move(r.id, 1)}
                    disabled={filtering || i === items.length - 1}
                    title={filtering ? 'Clear the filters to reorder' : 'Move down'}
                  >
                    ↓
                  </button>
                  <button
                    style={{ ...s.btn, ...s.btnSecondary, padding: '6px 12px' }}
                    onClick={() => setOpenId(isOpen ? null : r.id)}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'Done' : 'Edit'}
                  </button>
                </div>
              </div>

              {/* ── Expanded: the whole record ── */}
              {isOpen && (
                <div style={{ padding: '4px 16px 16px', borderTop: `1px solid ${colors.border}` }}>
                  <FormField label="Review text" hint="Exactly as they wrote it. Trim with an ellipsis if it's very long.">
                    <textarea
                      style={{ ...s.textarea, minHeight: 110 }}
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
                        onChange={(e) => {
                          patch(r.id, { tourSlug: e.target.value })
                          setLastTourSlug(e.target.value)
                        }}
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

                  <div style={s.grid3}>
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
                    <FormField label="Month it was written" hint="Optional, YYYY-MM. Leave blank if unsure — don't guess.">
                      <input
                        style={s.input}
                        placeholder="2025-06"
                        value={r.date || ''}
                        onChange={(e) => patch(r.id, { date: e.target.value })}
                      />
                    </FormField>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <button
                      style={{ ...s.btn, ...s.btnGhost, color: colors.danger }}
                      onClick={() => setPendingDelete({ id: r.id, name: r.name })}
                    >
                      Delete this review
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </section>

      {/* ── GOOGLE ───────────────────────────────────────── */}
      <section style={s.card}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>From Google</h2>
        <p style={{ ...s.subheadingHint, maxWidth: 640 }}>
          Pulled from your Google Business Profile every time the site is built. Google returns at
          most five reviews and decides which ones — you can hide any of them here, but the text
          can&rsquo;t be edited, and your Google star rating and total review count always come
          straight from Google.
        </p>

        {googleReviews.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Not connected yet</div>
            <div style={{ ...s.subtle, maxWidth: 560, margin: '0 auto' }}>
              Add your Google Place ID under Settings and set GOOGLE_MAPS_API_KEY in the build
              environment, then run <code style={{ fontFamily: mono }}>npm run sync:google</code>.
              The full walkthrough is in <code style={{ fontFamily: mono }}>docs/google-reviews-setup.md</code>.
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
                  padding: '12px 16px',
                  marginTop: 10,
                  backgroundColor: isHidden ? colors.panelMuted : colors.panel,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: 14, opacity: isHidden ? 0.6 : 1 }}>{r.authorName}</strong>
                  <span style={{ color: colors.accent, fontSize: 12, letterSpacing: 1 }}>
                    {'★'.repeat(Math.round(r.rating || 5))}
                  </span>
                  <span style={s.subtle}>{r.relativeTime}</span>
                  <button
                    style={{ ...s.btn, ...(isHidden ? s.btnGhost : s.btnSecondary), padding: '6px 12px', marginLeft: 'auto', color: isHidden ? colors.textMuted : colors.success }}
                    onClick={() => toggleGoogle(r.id)}
                  >
                    {isHidden ? 'Hidden' : '● Live'}
                  </button>
                </div>
                <p
                  style={{
                    ...s.subtle,
                    margin: '8px 0 0',
                    lineHeight: 1.6,
                    opacity: isHidden ? 0.6 : 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {r.text}
                </p>
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

const mono = 'ui-monospace, SFMono-Regular, monospace'

const filterBar = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
  padding: '12px 14px',
  borderRadius: 10,
  backgroundColor: colors.panelMuted,
  border: `1px solid ${colors.border}`,
}

const selectStyle = {
  ...s.input,
  width: 'auto',
  maxWidth: 220,
  padding: '9px 10px',
  fontSize: 13,
}

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 14px',
}
