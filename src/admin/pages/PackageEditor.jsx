import { useParams } from 'react-router-dom'
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
import SaveButton from '../components/SaveButton'
import GuardedLink from '../components/GuardedLink'
import SlugField from '../components/SlugField'
import BadgeStylePicker from '../components/BadgeStylePicker'
import RelationPicker from '../components/RelationPicker'
import { useEditorForm } from '../hooks/useEditorForm'
import { invalidateOptionsCache } from '../hooks/useCollectionOptions'
import { toNumberOrNull } from '../utils/validate'

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
  { id: 'journal',      label: 'Journal stories' },
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
  journalPosts: [],
}

// Optional prices stay null when empty; the rest fall back to 0 as before.
const nullableNumFields = ['originalPrice', 'priceWith', 'priceWithout']
const numFields = ['groupSize', 'price', 'rating', 'reviews', 'locations', 'countries']

function validatePackage(p) {
  const errors = {}
  const price = toNumberOrNull(p.price)
  if (price == null || price < 0) errors.price = 'Price must be a number ≥ 0.'
  const rating = toNumberOrNull(p.rating)
  if (p.rating !== '' && p.rating != null && (rating == null || rating < 0 || rating > 5)) errors.rating = 'Rating must be between 0 and 5.'
  const groupSize = toNumberOrNull(p.groupSize)
  if (groupSize == null || groupSize < 1) errors.groupSize = 'Capacity must be at least 1.'
  return errors
}

export default function PackageEditor() {
  const { id } = useParams()

  const { item: pkg, setItem: setPkg, set, err, saving, dirty, fieldErrors, onSave, isNew } = useEditorForm({
    collection: api.packages,
    id,
    empty: EMPTY,
    titleField: 'name',
    validate: validatePackage,
    clean: (p) => {
      const cleaned = { ...p, slug: p.slug.trim() }
      for (const f of nullableNumFields) cleaned[f] = toNumberOrNull(cleaned[f])
      for (const f of numFields) cleaned[f] = toNumberOrNull(cleaned[f]) ?? 0
      return cleaned
    },
    editorPath: (newId) => `/admin/packages/${newId}`,
    savedMessage: 'Package saved',
    afterSave: () => invalidateOptionsCache('package'),
  })

  if (err && !pkg) return <div style={{ color: 'crimson' }}>{err}</div>
  if (!pkg) return <div>Loading…</div>

  return (
    <div>
      <div style={s.stickyHeader}>
        <div style={{ minWidth: 0 }}>
          <GuardedLink to="/admin/packages" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: 13 }}>← All packages</GuardedLink>
          <h1 style={{ ...s.h1, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isNew ? 'New package' : pkg.name || 'Untitled package'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {!isNew && pkg.slug && (
            <a href={`/multi-day-tours/${pkg.slug}`} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>
              View on site ↗
            </a>
          )}
          <SaveButton dirty={dirty} saving={saving} isNew={isNew} onClick={onSave} />
        </div>
      </div>

      {err && <div style={{ ...s.card, color: colors.danger }}>{err}</div>}

      <div style={s.editorLayout}>
        <SectionNav sections={SECTIONS} />
        <div style={{ minWidth: 0 }}>

      <section id="basics" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Basics</h2>
        <FormField label="Name" error={fieldErrors.name}>
          <input style={s.input} value={pkg.name || ''} onChange={(e) => set({ name: e.target.value })} />
        </FormField>
        <FormField label="Subtitle">
          <input style={s.input} value={pkg.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
        </FormField>
        <div style={s.grid2}>
          <SlugField
            value={pkg.slug}
            onChange={(v) => set({ slug: v })}
            titleValue={pkg.name}
            isNew={isNew}
            error={fieldErrors.slug}
            hint="URL: /multi-day-tours/your-slug"
          />
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
          <FormField label="Capacity" error={fieldErrors.groupSize} hint="Internal booking cap — the number is never shown on the site; pages say “Small group”.">
            <input type="number" min="1" style={s.input} value={pkg.groupSize ?? ''} onChange={(e) => set({ groupSize: e.target.value })} />
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
          <FormField label="Price (€)" error={fieldErrors.price} hint="Card price">
            <input type="number" min="0" style={s.input} value={pkg.price ?? ''} onChange={(e) => set({ price: e.target.value })} />
          </FormField>
          <FormField label="Price without (€)" hint="Without single-supplement">
            <input type="number" style={s.input} value={pkg.priceWithout ?? ''} onChange={(e) => set({ priceWithout: e.target.value })} />
          </FormField>
          <FormField label="Price with (€)" hint="With single-supplement">
            <input type="number" style={s.input} value={pkg.priceWith ?? ''} onChange={(e) => set({ priceWith: e.target.value })} />
          </FormField>
        </div>
        <div style={s.grid2}>
          <FormField label="Rating" error={fieldErrors.rating}>
            <input type="number" step="0.1" min="0" max="5" style={s.input} value={pkg.rating ?? ''} onChange={(e) => set({ rating: e.target.value })} />
          </FormField>
          <FormField label="Reviews">
            <input type="number" style={s.input} value={pkg.reviews ?? ''} onChange={(e) => set({ reviews: e.target.value })} />
          </FormField>
        </div>
      </section>

      <section id="badge" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Badge</h2>
        <BadgeStylePicker
          badge={pkg.badge}
          color={pkg.badgeColor}
          textColor={pkg.badgeTextColor}
          onChange={(patch) => set(patch)}
        />
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

      <section id="journal" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Journal stories</h2>
        <p style={s.subheadingHint}>
          Hand-pick the posts shown in “From the Journal” on this package's page, in this order.
          Leave empty to automatically show posts that link to this package.
        </p>
        <RelationPicker
          kind="journal"
          multiple
          value={pkg.journalPosts}
          onChange={(v) => set({ journalPosts: v })}
          placeholder="+ Add post"
        />
      </section>

      <details id="advanced" style={{ ...s.card, scrollMarginTop: 100 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Advanced — raw JSON</summary>
        <p style={s.hint}>Edit the entire package as JSON. Use this only if a field isn't covered above.</p>
        <JsonField value={pkg} onChange={(v) => v && setPkg(v)} rows={20} />
      </details>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <GuardedLink to="/admin/packages" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }}>Cancel</GuardedLink>
        <SaveButton dirty={dirty} saving={saving} isNew={isNew} onClick={onSave} />
      </div>

        </div>
      </div>
    </div>
  )
}
