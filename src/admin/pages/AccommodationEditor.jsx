import { useParams } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import RichTextEditor from '../components/RichTextEditor'
import ImageUpload from '../components/ImageUpload'
import JsonField from '../components/JsonField'
import SectionNav from '../components/SectionNav'
import FeaturedOnEditor from '../components/FeaturedOnEditor'
import SaveButton from '../components/SaveButton'
import GuardedLink from '../components/GuardedLink'
import SlugField from '../components/SlugField'
import { useEditorForm } from '../hooks/useEditorForm'
import { toNumberOrNull } from '../utils/validate'

const SECTIONS = [
  { id: 'basics', label: 'Basics' },
  { id: 'media', label: 'Image' },
  { id: 'content', label: 'Description' },
  { id: 'map', label: 'Map & links' },
  { id: 'advanced', label: 'Advanced' },
]

const EMPTY = {
  slug: '',
  name: '',
  location: '',
  country: '',
  type: 'homestay',
  order: 0,
  image: '',
  teaser: '',
  description: '',
  lat: '',
  lng: '',
  featuredOn: [],
}

function validateAccommodation(it) {
  const errors = {}
  const lat = toNumberOrNull(it.lat)
  if (it.lat !== '' && it.lat != null && (lat == null || lat < -90 || lat > 90)) errors.lat = 'Latitude must be between −90 and 90.'
  const lng = toNumberOrNull(it.lng)
  if (it.lng !== '' && it.lng != null && (lng == null || lng < -180 || lng > 180)) errors.lng = 'Longitude must be between −180 and 180.'
  return errors
}

export default function AccommodationEditor() {
  const { id } = useParams()

  const { item, setItem, set, err, saving, dirty, fieldErrors, onSave, isNew } = useEditorForm({
    collection: api.accommodations,
    id,
    empty: EMPTY,
    titleField: 'name',
    titleLabel: 'Property name',
    validate: validateAccommodation,
    clean: (it) => ({
      ...it,
      slug: it.slug.trim(),
      order: toNumberOrNull(it.order) ?? 0,
      lat: toNumberOrNull(it.lat),
      lng: toNumberOrNull(it.lng),
    }),
    editorPath: (newId) => `/admin/accommodations/${newId}`,
    savedMessage: 'Accommodation saved',
  })

  if (err && !item) return <div style={{ color: 'crimson' }}>{err}</div>
  if (!item) return <div>Loading…</div>

  return (
    <div>
      <div style={s.stickyHeader}>
        <div style={{ minWidth: 0 }}>
          <GuardedLink to="/admin/accommodations" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: 13 }}>← All accommodations</GuardedLink>
          <h1 style={{ ...s.h1, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isNew ? 'New accommodation' : item.name || 'Untitled'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <a href="/where-we-stay" target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>View page ↗</a>
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
              <FormField label="Property name" error={fieldErrors.name}>
                <input style={s.input} value={item.name || ''} onChange={(e) => set({ name: e.target.value })} />
              </FormField>
              <SlugField
                value={item.slug}
                onChange={(v) => set({ slug: v })}
                titleValue={item.name}
                isNew={isNew}
                error={fieldErrors.slug}
              />
            </div>
            <div style={s.grid3}>
              <FormField label="Location">
                <input style={s.input} value={item.location || ''} onChange={(e) => set({ location: e.target.value })} placeholder="Town, region" />
              </FormField>
              <FormField label="Country">
                <input style={s.input} value={item.country || ''} onChange={(e) => set({ country: e.target.value })} />
              </FormField>
              <FormField label="Type">
                <select style={s.input} value={item.type || 'homestay'} onChange={(e) => set({ type: e.target.value })}>
                  <option value="homestay">Homestay</option>
                  <option value="agrotourism">Agrotourism</option>
                  <option value="boutique-hotel">Boutique hotel</option>
                </select>
              </FormField>
            </div>
            <div style={s.grid2}>
              <FormField label="Teaser" hint="Two lines shown on the card.">
                <textarea style={s.textarea} value={item.teaser || ''} onChange={(e) => set({ teaser: e.target.value })} />
              </FormField>
              <FormField label="Order" hint="Lower numbers appear first.">
                <input type="number" style={s.input} value={item.order ?? ''} onChange={(e) => set({ order: e.target.value })} />
              </FormField>
            </div>
          </section>

          <section id="media" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Image</h2>
            <ImageUpload value={item.image} onChange={(v) => set({ image: v })} slug={item.slug || 'stay'} />
          </section>

          <section id="content" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Description</h2>
            <p style={s.subheadingHint}>What makes it worth stopping for — the host, the food, the connection to the place.</p>
            <RichTextEditor value={item.description || ''} onChange={(v) => set({ description: v })} slug={item.slug || 'stay'} />
          </section>

          <section id="map" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Map & links</h2>
            <div style={s.grid2}>
              <FormField label="Latitude" error={fieldErrors.lat}>
                <input type="number" step="0.0001" min="-90" max="90" style={s.input} value={item.lat ?? ''} onChange={(e) => set({ lat: e.target.value })} placeholder="43.85" />
              </FormField>
              <FormField label="Longitude" error={fieldErrors.lng}>
                <input type="number" step="0.0001" min="-180" max="180" style={s.input} value={item.lng ?? ''} onChange={(e) => set({ lng: e.target.value })} placeholder="18.43" />
              </FormField>
            </div>
            <FormField label="Featured on tours/packages" hint="Pages where this stay is mentioned — links the stay card to the trip.">
              <FeaturedOnEditor value={item.featuredOn} onChange={(v) => set({ featuredOn: v })} />
            </FormField>
          </section>

          <details id="advanced" style={{ ...s.card, scrollMarginTop: 100 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Advanced — raw JSON</summary>
            <JsonField value={item} onChange={(v) => v && setItem(v)} rows={20} />
          </details>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <GuardedLink to="/admin/accommodations" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }}>Cancel</GuardedLink>
            <SaveButton dirty={dirty} saving={saving} isNew={isNew} onClick={onSave} />
          </div>

        </div>
      </div>
    </div>
  )
}
