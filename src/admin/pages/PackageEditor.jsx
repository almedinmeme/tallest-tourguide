import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import RichTextEditor from '../components/RichTextEditor'
import ImageUpload from '../components/ImageUpload'
import ImageGalleryEditor from '../components/ImageGalleryEditor'
import ListEditor from '../components/ListEditor'
import DayEditor from '../components/DayEditor'
import WaypointEditor from '../components/WaypointEditor'
import ActivitiesEditor from '../components/ActivitiesEditor'
import ImportantInfoEditor from '../components/ImportantInfoEditor'
import BreakdownEditor from '../components/BreakdownEditor'
import SuitabilityEditor from '../components/SuitabilityEditor'
import FitnessNotesEditor from '../components/FitnessNotesEditor'
import JsonField from '../components/JsonField'
import SectionNav from '../components/SectionNav'
import AccessibilityEditor, { EMPTY_ACCESSIBILITY } from '../components/AccessibilityEditor'
import RouteStatusBadge from '../components/RouteStatusBadge'

const SECTIONS = [
  { id: 'basics',       label: 'Basics' },
  { id: 'pricing',      label: 'Pricing' },
  { id: 'badge',        label: 'Badge' },
  { id: 'media',        label: 'Hero & gallery' },
  { id: 'description',  label: 'Description' },
  { id: 'activities',   label: 'Activities' },
  { id: 'itinerary',    label: 'Itinerary' },
  { id: 'map',          label: 'Map' },
  { id: 'inclusions',   label: 'Inclusions' },
  { id: 'breakdown',    label: 'Breakdown' },
  { id: 'suitability',  label: 'Suitability' },
  { id: 'fitness',      label: 'Fitness notes' },
  { id: 'accessibility',label: 'Accessibility' },
  { id: 'important',    label: 'Important info' },
  { id: 'advanced',     label: 'Advanced' },
]

const EMPTY = {
  slug: '',
  name: '',
  subtitle: '',
  duration: '',
  groupSize: 8,
  difficulty: 'Easy',
  price: 0,
  originalPrice: null,
  priceWith: null,
  priceWithout: null,
  rating: 5,
  reviews: 0,
  badge: '',
  badgeColor: '',
  badgeTextColor: '',
  hero: '',
  heroImage: '',
  locations: 1,
  countries: 1,
  countryList: [],
  description: '',
  about: '',
  highlights: [],
  includes: [],
  inclusions: [],
  exclusions: [],
  days: [],
  gallery: [],
  mapWaypoints: [],
  mapProfile: 'driving-car',
  activities: [],
  importantInfo: [],
  dates: [],
  breakdown: {},
  suitability: { goodFor: [], thinkTwice: [] },
  fitnessNotes: [],
  accessibility: EMPTY_ACCESSIBILITY,
}

const numFields = ['groupSize', 'price', 'originalPrice', 'priceWith', 'priceWithout', 'rating', 'reviews', 'locations', 'countries']

export default function PackageEditor() {
  const { id } = useParams()
  const isNew = !id
  const nav = useNavigate()

  const [pkg, setPkg] = useState(isNew ? EMPTY : null)
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) return
    api.packages
      .get(id)
      .then(setPkg)
      .catch((e) => setErr(e.message))
  }, [id, isNew])

  const set = (patch) => setPkg((p) => ({ ...p, ...patch }))

  const onSave = async () => {
    setSaving(true)
    setErr(null)
    try {
      const cleaned = { ...pkg }
      for (const f of numFields) {
        if (cleaned[f] === '' || cleaned[f] === null || cleaned[f] === undefined) {
          if (f === 'originalPrice' || f === 'priceWith' || f === 'priceWithout') cleaned[f] = null
          else cleaned[f] = 0
        } else {
          cleaned[f] = Number(cleaned[f])
        }
      }
      if (isNew) {
        const created = await api.packages.create(cleaned)
        nav(`/admin/packages/${created.id}`, { replace: true })
      } else {
        await api.packages.update(id, cleaned)
      }
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (err && !pkg) return <div style={{ color: 'crimson' }}>{err}</div>
  if (!pkg) return <div>Loading…</div>

  return (
    <div>
      <div style={s.stickyHeader}>
        <div style={{ minWidth: 0 }}>
          <Link to="/admin/packages" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: 13 }}>← All packages</Link>
          <h1 style={{ ...s.h1, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isNew ? 'New package' : pkg.name || 'Untitled package'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {!isNew && pkg.slug && (
            <a href={`/packages/${pkg.slug}`} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>
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
        <FormField label="Name">
          <input style={s.input} value={pkg.name || ''} onChange={(e) => set({ name: e.target.value })} />
        </FormField>
        <FormField label="Subtitle">
          <input style={s.input} value={pkg.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
        </FormField>
        <div style={s.grid2}>
          <FormField label="Slug" hint="URL: /packages/your-slug">
            <input style={s.input} value={pkg.slug || ''} onChange={(e) => set({ slug: e.target.value })} />
          </FormField>
          <FormField label="Duration">
            <input style={s.input} value={pkg.duration || ''} onChange={(e) => set({ duration: e.target.value })} placeholder="e.g. 5 Days" />
          </FormField>
        </div>
        <div style={s.grid3}>
          <FormField label="Difficulty">
            <select style={s.input} value={pkg.difficulty || 'Easy'} onChange={(e) => set({ difficulty: e.target.value })}>
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
          </FormField>
          <FormField label="Group size (max)">
            <input type="number" style={s.input} value={pkg.groupSize ?? ''} onChange={(e) => set({ groupSize: e.target.value })} />
          </FormField>
          <FormField label="Locations">
            <input type="number" style={s.input} value={pkg.locations ?? ''} onChange={(e) => set({ locations: e.target.value })} />
          </FormField>
        </div>
        <div style={s.grid2}>
          <FormField label="Countries">
            <input type="number" style={s.input} value={pkg.countries ?? ''} onChange={(e) => set({ countries: e.target.value })} />
          </FormField>
          <FormField>
            <ListEditor label="Country list" value={pkg.countryList} onChange={(v) => set({ countryList: v })} placeholder="e.g. Bosnia" />
          </FormField>
        </div>
      </section>

      <section id="pricing" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Pricing</h2>
        <div style={s.grid2}>
          <FormField label="Price (€)" hint="Card price">
            <input type="number" style={s.input} value={pkg.price ?? ''} onChange={(e) => set({ price: e.target.value })} />
          </FormField>
          <FormField label="Price without (€)" hint="Without single-supplement">
            <input type="number" style={s.input} value={pkg.priceWithout ?? ''} onChange={(e) => set({ priceWithout: e.target.value })} />
          </FormField>
          <FormField label="Price with (€)" hint="With single-supplement">
            <input type="number" style={s.input} value={pkg.priceWith ?? ''} onChange={(e) => set({ priceWith: e.target.value })} />
          </FormField>
        </div>
        <div style={s.grid2}>
          <FormField label="Rating">
            <input type="number" step="0.1" style={s.input} value={pkg.rating ?? ''} onChange={(e) => set({ rating: e.target.value })} />
          </FormField>
          <FormField label="Reviews">
            <input type="number" style={s.input} value={pkg.reviews ?? ''} onChange={(e) => set({ reviews: e.target.value })} />
          </FormField>
        </div>
      </section>

      <section id="badge" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Badge</h2>
        <div style={s.grid3}>
          <FormField label="Badge text">
            <input style={s.input} value={pkg.badge || ''} onChange={(e) => set({ badge: e.target.value })} placeholder="Most Popular" />
          </FormField>
          <FormField label="Badge bg" hint="CSS color or var(--…)">
            <input style={s.input} value={pkg.badgeColor || ''} onChange={(e) => set({ badgeColor: e.target.value })} placeholder="var(--color-amber)" />
          </FormField>
          <FormField label="Badge text color">
            <input style={s.input} value={pkg.badgeTextColor || ''} onChange={(e) => set({ badgeTextColor: e.target.value })} placeholder="var(--color-n900)" />
          </FormField>
        </div>
      </section>

      <section id="media" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Hero & gallery</h2>
        <div style={s.grid2}>
          <FormField label="Hero (card)">
            <ImageUpload value={pkg.hero} onChange={(v) => set({ hero: v })} slug={pkg.slug || 'package'} />
          </FormField>
          <FormField label="Hero image (detail)">
            <ImageUpload value={pkg.heroImage} onChange={(v) => set({ heroImage: v })} slug={pkg.slug || 'package'} />
          </FormField>
        </div>
        <FormField>
          <ImageGalleryEditor label="Gallery" value={pkg.gallery} onChange={(v) => set({ gallery: v })} slug={pkg.slug || 'package'} />
        </FormField>
      </section>

      <section id="description" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Description</h2>
        <FormField label="Description (short, plain)">
          <textarea style={s.textarea} value={pkg.description || ''} onChange={(e) => set({ description: e.target.value })} />
        </FormField>
        <FormField label="About (long, rich text)">
          <RichTextEditor value={pkg.about || ''} onChange={(v) => set({ about: v })} slug={pkg.slug || 'package'} />
        </FormField>
      </section>

      <section id="activities" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Activities</h2>
        <ActivitiesEditor value={pkg.activities} onChange={(v) => set({ activities: v })} />
      </section>

      <section id="itinerary" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Itinerary</h2>
        <DayEditor value={pkg.days} onChange={(v) => set({ days: v })} slug={pkg.slug} />
      </section>

      <section id="map" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Map</h2>
        <FormField label="Map profile" hint="Use foot-hiking for trails through mountains, forests or off-road paths.">
          <select style={s.input} value={pkg.mapProfile || 'driving-car'} onChange={(e) => set({ mapProfile: e.target.value })}>
            <option value="driving-car">driving-car</option>
            <option value="foot-walking">foot-walking</option>
            <option value="foot-hiking">foot-hiking</option>
            <option value="cycling-regular">cycling-regular</option>
          </select>
        </FormField>
        <RouteStatusBadge waypoints={pkg.mapWaypoints} profile={pkg.mapProfile || 'driving-car'} />
        <WaypointEditor label="Waypoints" value={pkg.mapWaypoints} onChange={(v) => set({ mapWaypoints: v })} />
      </section>

      <section id="inclusions" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Inclusions / exclusions</h2>
        <div style={s.grid2}>
          <FormField>
            <ListEditor label="Inclusions" value={pkg.inclusions} onChange={(v) => set({ inclusions: v })} />
          </FormField>
          <FormField>
            <ListEditor label="Exclusions" value={pkg.exclusions} onChange={(v) => set({ exclusions: v })} />
          </FormField>
        </div>
      </section>

      <section id="breakdown" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Breakdown</h2>
        <BreakdownEditor value={pkg.breakdown} onChange={(v) => set({ breakdown: v })} />
      </section>

      <section id="suitability" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Suitability</h2>
        <SuitabilityEditor value={pkg.suitability} onChange={(v) => set({ suitability: v })} />
      </section>

      <section id="fitness" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Fitness / content notes</h2>
        <FitnessNotesEditor value={pkg.fitnessNotes} onChange={(v) => set({ fitnessNotes: v })} />
      </section>

      <section id="accessibility" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Accessibility & suitability</h2>
        <p style={{ ...s.subheadingHint, marginTop: -6, marginBottom: 20 }}>
          Distances, suitability flags, and physical requirements — shown as the "Accessibility & Suitability" section on the package page.
        </p>
        <AccessibilityEditor
          value={pkg.accessibility}
          onChange={(v) => set({ accessibility: v })}
          waypoints={pkg.mapWaypoints}
          mapProfile={pkg.mapProfile}
        />
      </section>

      <section id="important" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Important info</h2>
        <ImportantInfoEditor value={pkg.importantInfo} onChange={(v) => set({ importantInfo: v })} />
      </section>

      <details id="advanced" style={{ ...s.card, scrollMarginTop: 100 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Advanced — raw JSON</summary>
        <p style={s.hint}>Edit the entire package as JSON. Use this only if a field isn't covered above.</p>
        <JsonField value={pkg} onChange={(v) => v && setPkg(v)} rows={20} />
      </details>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Link to="/admin/packages" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }}>Cancel</Link>
        <button style={s.btn} onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

        </div>
      </div>
    </div>
  )
}
