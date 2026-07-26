import { useParams } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import RichTextEditor from '../components/RichTextEditor'
import ImageUpload from '../components/ImageUpload'
import ImageGalleryEditor from '../components/ImageGalleryEditor'
import ListEditor from '../components/ListEditor'
import HighlightsEditor from '../components/HighlightsEditor'
import ExtrasEditor from '../components/ExtrasEditor'
import PrivatePricingEditor from '../components/PrivatePricingEditor'
import FAQEditor from '../components/FAQEditor'
import WaypointEditor from '../components/WaypointEditor'
import JsonField from '../components/JsonField'
import SectionNav from '../components/SectionNav'
import AccessibilityEditor, { EMPTY_ACCESSIBILITY } from '../components/AccessibilityEditor'
import RouteStatusBadge from '../components/RouteStatusBadge'
import SaveButton from '../components/SaveButton'
import GuardedLink from '../components/GuardedLink'
import SlugField from '../components/SlugField'
import RelationPicker from '../components/RelationPicker'
import { useEditorForm } from '../hooks/useEditorForm'
import { invalidateOptionsCache } from '../hooks/useCollectionOptions'
import { toNumberOrNull } from '../utils/validate'
import { TOUR_CATEGORY_LABELS } from '../../data/tourCategories'

const SECTIONS = [
  { id: 'basics', label: 'Basics' },
  { id: 'media', label: 'Hero & gallery' },
  { id: 'description', label: 'Description' },
  { id: 'lists', label: 'Highlights & lists' },
  { id: 'extras', label: 'Booking extras' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'fitness', label: 'Fitness note' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'map', label: 'Map waypoints' },
  { id: 'journal', label: 'Journal stories' },
  { id: 'advanced', label: 'Advanced' },
]

const EMPTY = {
  slug: '',
  title: '',
  subtitle: '',
  category: '',
  extraCategories: [],
  badge: '',
  price: 0,
  privatePricing: { mode: 'quote', fixedPrice: null, tiers: [] },
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
  extras: [],
  faqs: [],
  meetingPoint: '',
  startingTimes: [],
  languages: [],
  accessibility: EMPTY_ACCESSIBILITY,
  fitnessNote: null,
  gallery: [],
  mapWaypoints: [],
  mapProfile: 'foot-walking',
  journalPosts: [],
}

// Normalises the private-pricing block for saving: quote mode carries no
// numbers, fixed keeps one group price, tiered keeps valid tiers sorted by
// group size so the site can pick the first tier that fits.
function cleanPrivatePricing(pp) {
  const mode = pp?.mode || 'quote'
  if (mode === 'fixed') return { mode, fixedPrice: Number(pp.fixedPrice) || 0 }
  if (mode === 'tiered') {
    const tiers = (pp.tiers || [])
      .map((t) => ({ maxPeople: Number(t.maxPeople) || 0, price: Number(t.price) || 0 }))
      .filter((t) => t.maxPeople >= 1 && t.price > 0)
      .sort((a, b) => a.maxPeople - b.maxPeople)
    return { mode, tiers }
  }
  return { mode: 'quote' }
}

function validateTour(t) {
  const errors = {}
  const price = toNumberOrNull(t.price)
  if (price == null || price < 0) errors.price = 'Price must be a number ≥ 0.'
  const pp = t.privatePricing
  if (pp?.mode === 'fixed' && !(toNumberOrNull(pp.fixedPrice) > 0)) {
    errors.privatePricing = 'Enter the fixed price for a private group.'
  }
  if (pp?.mode === 'tiered' && !(pp.tiers || []).some((tier) => toNumberOrNull(tier.maxPeople) >= 1 && toNumberOrNull(tier.price) > 0)) {
    errors.privatePricing = 'Add at least one complete tier (group size + price).'
  }
  if (t.oldPrice !== '' && t.oldPrice != null && toNumberOrNull(t.oldPrice) == null) errors.oldPrice = 'Must be a number.'
  const rating = toNumberOrNull(t.rating)
  if (t.rating !== '' && t.rating != null && (rating == null || rating < 0 || rating > 5)) errors.rating = 'Rating must be between 0 and 5.'
  const groupSize = toNumberOrNull(t.groupSize)
  if (groupSize == null || groupSize < 1) errors.groupSize = 'Capacity must be at least 1.'
  return errors
}

export default function TourEditor() {
  const { id } = useParams()

  const { item: tour, setItem: setTour, set, setNested, err, saving, dirty, fieldErrors, onSave, isNew } = useEditorForm({
    collection: api.tours,
    id,
    empty: EMPTY,
    titleField: 'title',
    validate: validateTour,
    clean: (t) => ({
      ...t,
      slug: t.slug.trim(),
      extraCategories: [...new Set(t.extraCategories || [])].filter((c) => c && c !== t.category),
      price: Number(t.price),
      privatePricing: cleanPrivatePricing(t.privatePricing),
      oldPrice: toNumberOrNull(t.oldPrice),
      rating: toNumberOrNull(t.rating),
      reviews: toNumberOrNull(t.reviews) ?? 0,
      groupSize: Number(t.groupSize),
      extras: (t.extras || [])
        .filter((e) => (e.label || '').trim())
        .map((e) => ({
          label: e.label.trim(),
          description: (e.description || '').trim(),
          price: Number(e.price) || 0,
          perPerson: !!e.perPerson,
        })),
    }),
    editorPath: (newId) => `/admin/tours/${newId}`,
    savedMessage: 'Tour saved',
    afterSave: () => invalidateOptionsCache('tour'),
  })

  if (err && !tour) return <div style={{ color: 'crimson' }}>{err}</div>
  if (!tour) return <div>Loading…</div>

  return (
    <div>
      <div style={s.stickyHeader}>
        <div style={{ minWidth: 0 }}>
          <GuardedLink to="/admin/tours" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: 13 }}>← All tours</GuardedLink>
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
          <SaveButton dirty={dirty} saving={saving} isNew={isNew} onClick={onSave} />
        </div>
      </div>

      {err && <div style={{ ...s.card, color: colors.danger }}>{err}</div>}

      <div style={s.editorLayout}>
        <SectionNav sections={SECTIONS} />
        <div style={{ minWidth: 0 }}>

      <section id="basics" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Basics</h2>
        <div style={s.grid2}>
          <FormField label="Title" error={fieldErrors.title}>
            <input style={s.input} value={tour.title || ''} onChange={(e) => set({ title: e.target.value })} />
          </FormField>
          <SlugField
            value={tour.slug}
            onChange={(v) => set({ slug: v })}
            titleValue={tour.title}
            isNew={isNew}
            error={fieldErrors.slug}
            hint="URL path: /tours/your-slug"
          />
        </div>
        <FormField label="Subtitle">
          <input style={s.input} value={tour.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
        </FormField>
        <div style={s.grid3}>
          <FormField label="Category">
            <select
              style={s.input}
              value={tour.category || ''}
              onChange={(e) => set({
                category: e.target.value,
                // The primary can't also be an extra — drop it if it was ticked.
                extraCategories: (tour.extraCategories || []).filter((c) => c !== e.target.value),
              })}
            >
              <option value="">— pick a category —</option>
              {Object.entries(TOUR_CATEGORY_LABELS).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
              {tour.category && !TOUR_CATEGORY_LABELS[tour.category] && (
                <option value={tour.category}>{tour.category} (unknown)</option>
              )}
            </select>
          </FormField>
          <FormField label="Badge">
            <input style={s.input} value={tour.badge || ''} onChange={(e) => set({ badge: e.target.value })} placeholder="Bestseller, Essential, …" />
          </FormField>
          <FormField label="Duration">
            <input style={s.input} value={tour.duration || ''} onChange={(e) => set({ duration: e.target.value })} placeholder="3 hours, Full day, …" />
          </FormField>
        </div>
        <FormField
          label="Also show in"
          hint="Extra categories this tour also belongs to — it appears in those rows of the Day Tours menu and under those filters on /tours (e.g. Srebrenica is History & War and a Day Trip)."
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', padding: '6px 0 2px' }}>
            {Object.entries(TOUR_CATEGORY_LABELS).filter(([id]) => id !== tour.category).map(([id, label]) => {
              const checked = (tour.extraCategories || []).includes(id)
              return (
                <label key={id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: colors.text, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => set({
                      extraCategories: e.target.checked
                        ? [...(tour.extraCategories || []), id]
                        : (tour.extraCategories || []).filter((c) => c !== id),
                    })}
                  />
                  {label}
                </label>
              )
            })}
          </div>
        </FormField>
        <div style={s.grid3}>
          <FormField label="Price (€)" error={fieldErrors.price}>
            <input type="number" min="0" style={s.input} value={tour.price ?? ''} onChange={(e) => set({ price: e.target.value })} />
          </FormField>
          <FormField label="Old price (€)" error={fieldErrors.oldPrice} hint="Optional — shows a struck-through “was” price and save % on cards and the tour page. Leave empty for no discount.">
            <input type="number" min="0" style={s.input} value={tour.oldPrice ?? ''} onChange={(e) => set({ oldPrice: e.target.value })} />
          </FormField>
          <FormField label="Rating" error={fieldErrors.rating}>
            <input type="number" step="0.1" min="0" max="5" style={s.input} value={tour.rating ?? ''} onChange={(e) => set({ rating: e.target.value })} />
          </FormField>
          <FormField label="Reviews">
            <input type="number" min="0" style={s.input} value={tour.reviews ?? ''} onChange={(e) => set({ reviews: e.target.value })} />
          </FormField>
        </div>
        <PrivatePricingEditor
          value={tour.privatePricing}
          onChange={(v) => set({ privatePricing: v })}
          error={fieldErrors.privatePricing}
        />
        <div style={s.grid2}>
          <FormField label="Capacity" error={fieldErrors.groupSize} hint="Internal booking cap — the number is never shown on the site; pages say “Small group”.">
            <input type="number" min="1" style={s.input} value={tour.groupSize ?? ''} onChange={(e) => set({ groupSize: e.target.value })} />
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

      <section id="extras" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Booking extras</h2>
        <p style={{ ...s.subheadingHint, marginTop: -6, marginBottom: 22 }}>
          Optional add-ons guests can select while booking — pick-up, tickets, tastings.
          Each selected extra is added to the booking total.
        </p>
        <ExtrasEditor
          label="Extras"
          hint="Tick “per person” to multiply the price by the number of guests (e.g. museum tickets). Leave it off for a flat charge (e.g. one private pick-up)."
          value={tour.extras}
          onChange={(v) => set({ extras: v })}
        />
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

      <section id="journal" style={{ ...s.card, scrollMarginTop: 100 }}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Journal stories</h2>
        <p style={s.subheadingHint}>
          Hand-pick the posts shown in “From the Journal” on this tour's page, in this order.
          Leave empty to automatically show posts that link to this tour.
        </p>
        <RelationPicker
          kind="journal"
          multiple
          value={tour.journalPosts}
          onChange={(v) => set({ journalPosts: v })}
          placeholder="+ Add post"
        />
      </section>

      <details id="advanced" style={{ ...s.card, scrollMarginTop: 100 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Advanced — raw JSON</summary>
        <p style={s.hint}>Edit the entire tour as JSON. Use this only if a field isn't covered above.</p>
        <JsonField value={tour} onChange={(v) => v && setTour(v)} rows={20} />
      </details>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <GuardedLink to="/admin/tours" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }}>Cancel</GuardedLink>
        <SaveButton dirty={dirty} saving={saving} isNew={isNew} onClick={onSave} />
      </div>

        </div>
      </div>
    </div>
  )
}
