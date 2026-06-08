import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import RichTextEditor from '../components/RichTextEditor'
import ImageUpload from '../components/ImageUpload'
import ImageGalleryEditor from '../components/ImageGalleryEditor'
import ListEditor from '../components/ListEditor'
import HighlightsEditor from '../components/HighlightsEditor'
import FAQEditor from '../components/FAQEditor'
import WaypointEditor from '../components/WaypointEditor'
import JsonField from '../components/JsonField'
import SectionNav from '../components/SectionNav'
import AccessibilityEditor, { EMPTY_ACCESSIBILITY } from '../components/AccessibilityEditor'
import RouteStatusBadge from '../components/RouteStatusBadge'

const SECTIONS = [
  { id: 'basics', label: 'Basics' },
  { id: 'media', label: 'Hero & gallery' },
  { id: 'description', label: 'Description' },
  { id: 'lists', label: 'Highlights & lists' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'fitness', label: 'Fitness note' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'map', label: 'Map waypoints' },
  { id: 'advanced', label: 'Advanced' },
]

const EMPTY = {
  slug: '',
  title: '',
  subtitle: '',
  category: '',
  badge: '',
  price: 0,
  rating: 5,
  reviews: 0,
  duration: '',
  groupSize: 8,
  hero: '',
  detailHero: '',
  description: '',
  highlights: [],
  includes: [],
  excludes: [],
  rightFor: [],
  notRightFor: [],
  faqs: [],
  meetingPoint: '',
  startingTimes: [],
  languages: [],
  accessibility: EMPTY_ACCESSIBILITY,
  fitnessNote: null,
  gallery: [],
  mapWaypoints: [],
  mapProfile: 'foot-walking',
}

export default function TourEditor() {
  const { id } = useParams()
  const isNew = !id
  const nav = useNavigate()

  const [tour, setTour] = useState(isNew ? EMPTY : null)
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) return
    api.tours
      .get(id)
      .then(setTour)
      .catch((e) => setErr(e.message))
  }, [id, isNew])

  const set = (patch) => setTour((t) => ({ ...t, ...patch }))

  const setNested = (key, patch) =>
    setTour((t) => ({ ...t, [key]: { ...(t[key] || {}), ...patch } }))

  const onSave = async () => {
    setSaving(true)
    setErr(null)
    try {
      const cleaned = {
        ...tour,
        price: Number(tour.price) || 0,
        rating: Number(tour.rating) || 0,
        reviews: Number(tour.reviews) || 0,
        groupSize: Number(tour.groupSize) || 0,
      }
      if (isNew) {
        const created = await api.tours.create(cleaned)
        nav(`/admin/tours/${created.id}`, { replace: true })
      } else {
        await api.tours.update(id, cleaned)
      }
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (err && !tour) return <div style={{ color: 'crimson' }}>{err}</div>
  if (!tour) return <div>Loading…</div>

  return (
    <div>
      <div style={s.stickyHeader}>
        <div style={{ minWidth: 0 }}>
          <Link to="/admin/tours" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: 13 }}>← All tours</Link>
          <h1 style={{ ...s.h1, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isNew ? 'New tour' : tour.title || 'Untitled tour'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {!isNew && tour.slug && (
            <a href={`/tours/${tour.slug}`} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>
              View on site ↗
            </a>
          )}
          <button style={s.btn} onClick={onSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {err && <div style={{ ...s.card, color: colors.danger }}>{err}</div>}

      <div style={s.editorLayout}>
        <SectionNav sections={SECTIONS} />
        <div style={{ minWidth: 0 }}>

      <section id="basics" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Basics</h2>
        <div style={s.grid2}>
          <FormField label="Title">
            <input style={s.input} value={tour.title || ''} onChange={(e) => set({ title: e.target.value })} />
          </FormField>
          <FormField label="Slug" hint="URL path: /tours/your-slug">
            <input style={s.input} value={tour.slug || ''} onChange={(e) => set({ slug: e.target.value })} />
          </FormField>
        </div>
        <FormField label="Subtitle">
          <input style={s.input} value={tour.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
        </FormField>
        <div style={s.grid3}>
          <FormField label="Category">
            <input style={s.input} value={tour.category || ''} onChange={(e) => set({ category: e.target.value })} placeholder="city-walks, day-trips, …" />
          </FormField>
          <FormField label="Badge">
            <input style={s.input} value={tour.badge || ''} onChange={(e) => set({ badge: e.target.value })} placeholder="Bestseller, Essential, …" />
          </FormField>
          <FormField label="Duration">
            <input style={s.input} value={tour.duration || ''} onChange={(e) => set({ duration: e.target.value })} placeholder="3 hours, Full day, …" />
          </FormField>
        </div>
        <div style={s.grid3}>
          <FormField label="Price (€)">
            <input type="number" style={s.input} value={tour.price ?? ''} onChange={(e) => set({ price: e.target.value })} />
          </FormField>
          <FormField label="Rating">
            <input type="number" step="0.1" style={s.input} value={tour.rating ?? ''} onChange={(e) => set({ rating: e.target.value })} />
          </FormField>
          <FormField label="Reviews">
            <input type="number" style={s.input} value={tour.reviews ?? ''} onChange={(e) => set({ reviews: e.target.value })} />
          </FormField>
        </div>
        <div style={s.grid2}>
          <FormField label="Group size (max)">
            <input type="number" style={s.input} value={tour.groupSize ?? ''} onChange={(e) => set({ groupSize: e.target.value })} />
          </FormField>
          <FormField label="Map profile" hint="Use foot-hiking for trails through mountains, forests or off-road paths.">
            <select style={s.input} value={tour.mapProfile || 'foot-walking'} onChange={(e) => set({ mapProfile: e.target.value })}>
              <option value="foot-walking">foot-walking</option>
              <option value="foot-hiking">foot-hiking</option>
              <option value="driving-car">driving-car</option>
              <option value="cycling-regular">cycling-regular</option>
            </select>
          </FormField>
        </div>
      </section>

      <section id="media" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Hero & gallery</h2>
        <div style={s.grid2}>
          <FormField label="Hero image (card)">
            <ImageUpload value={tour.hero} onChange={(v) => set({ hero: v })} slug={tour.slug || 'tour'} />
          </FormField>
          <FormField label="Detail hero">
            <ImageUpload value={tour.detailHero} onChange={(v) => set({ detailHero: v })} slug={tour.slug || 'tour'} />
          </FormField>
        </div>
        <div style={{ marginTop: 18 }}>
          <h3 style={s.subheading}>Gallery</h3>
          <p style={s.subheadingHint}>Photos shown on the tour detail page. First image is the largest.</p>
          <ImageGalleryEditor value={tour.gallery} onChange={(v) => set({ gallery: v })} slug={tour.slug || 'tour'} />
        </div>
      </section>

      <section id="description" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Description</h2>
        <RichTextEditor value={tour.description || ''} onChange={(v) => set({ description: v })} slug={tour.slug || 'tour'} />
      </section>

      <section id="lists" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Highlights & lists</h2>
        <p style={{ ...s.subheadingHint, marginTop: -6, marginBottom: 22 }}>
          Each list below appears as a labeled bullet block on the public tour page.
        </p>

        <HighlightsEditor
          label="Highlights"
          hint="Each highlight has a landmark name and a one-line description. They render as “Landmark — Description” on the tour page."
          value={tour.highlights}
          onChange={(v) => set({ highlights: v })}
        />

        <div style={{ height: 1, backgroundColor: colors.border, margin: '24px 0' }} />

        <div style={{ ...s.grid2, rowGap: 28 }}>
          <ListEditor
            label="Includes"
            hint="What's included in the price."
            value={tour.includes}
            onChange={(v) => set({ includes: v })}
          />
          <ListEditor
            label="Excludes"
            hint="What guests pay separately or arrange themselves."
            value={tour.excludes}
            onChange={(v) => set({ excludes: v })}
          />
          <ListEditor
            label="Right for"
            hint="Who this tour suits best."
            value={tour.rightFor}
            onChange={(v) => set({ rightFor: v })}
          />
          <ListEditor
            label="Not right for"
            hint="When to recommend something else."
            value={tour.notRightFor}
            onChange={(v) => set({ notRightFor: v })}
          />
        </div>
      </section>

      <section id="logistics" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Logistics</h2>
        <FormField label="Meeting point">
          <input style={s.input} value={tour.meetingPoint || ''} onChange={(e) => set({ meetingPoint: e.target.value })} />
        </FormField>
        <div style={{ ...s.grid2, rowGap: 28 }}>
          <ListEditor label="Starting times" value={tour.startingTimes} onChange={(v) => set({ startingTimes: v })} placeholder="e.g. 10 AM" />
          <ListEditor label="Languages" value={tour.languages} onChange={(v) => set({ languages: v })} placeholder="e.g. english" />
        </div>
      </section>

      <section id="accessibility" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Accessibility & suitability</h2>
        <p style={{ ...s.subheadingHint, marginTop: -6, marginBottom: 20 }}>
          Everything the public page shows in the new “Accessibility & Suitability” section.
        </p>
        <AccessibilityEditor
          value={tour.accessibility}
          onChange={(v) => set({ accessibility: v })}
          waypoints={tour.mapWaypoints}
          mapProfile={tour.mapProfile}
        />
      </section>

      <section id="fitness" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Fitness note (optional)</h2>
        {tour.fitnessNote ? (
          <>
            <div style={s.grid2}>
              <FormField label="Type">
                <select style={s.input} value={tour.fitnessNote.type || 'physical'} onChange={(e) => setNested('fitnessNote', { type: e.target.value })}>
                  <option value="physical">physical</option>
                  <option value="emotional">emotional</option>
                </select>
              </FormField>
              <FormField label="Level">
                <input style={s.input} value={tour.fitnessNote.level || ''} onChange={(e) => setNested('fitnessNote', { level: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Detail">
              <textarea style={s.textarea} value={tour.fitnessNote.detail || ''} onChange={(e) => setNested('fitnessNote', { detail: e.target.value })} />
            </FormField>
            <button type="button" style={{ ...s.btn, ...s.btnGhost, color: colors.danger }} onClick={() => set({ fitnessNote: null })}>
              Remove fitness note
            </button>
          </>
        ) : (
          <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={() => set({ fitnessNote: { type: 'physical', level: '', detail: '' } })}>
            + Add fitness note
          </button>
        )}
      </section>

      <section id="faqs" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>FAQs</h2>
        <FAQEditor value={tour.faqs} onChange={(v) => set({ faqs: v })} slug={tour.slug} />
      </section>

      <section id="map" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Map waypoints</h2>
        <RouteStatusBadge waypoints={tour.mapWaypoints} profile={tour.mapProfile || 'foot-walking'} />
        <WaypointEditor value={tour.mapWaypoints} onChange={(v) => set({ mapWaypoints: v })} />
      </section>

      <details id="advanced" style={{ ...s.card, scrollMarginTop: 100 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Advanced — raw JSON</summary>
        <p style={s.hint}>Edit the entire tour as JSON. Use this only if a field isn't covered above.</p>
        <JsonField value={tour} onChange={(v) => v && setTour(v)} rows={20} />
      </details>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Link to="/admin/tours" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }}>Cancel</Link>
        <button style={s.btn} onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

        </div>
      </div>
    </div>
  )
}
