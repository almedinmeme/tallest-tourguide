import { useParams } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import RichTextEditor from '../components/RichTextEditor'
import ImageUpload from '../components/ImageUpload'
import JsonField from '../components/JsonField'
import SectionNav from '../components/SectionNav'
import RelationPicker from '../components/RelationPicker'
import SaveButton from '../components/SaveButton'
import GuardedLink from '../components/GuardedLink'
import SlugField from '../components/SlugField'
import { useEditorForm } from '../hooks/useEditorForm'
import { toNumberOrNull } from '../utils/validate'

const SECTIONS = [
  { id: 'basics', label: 'Basics' },
  { id: 'media', label: 'Hero image' },
  { id: 'content', label: 'Editorial copy' },
  { id: 'featured', label: 'Featured places' },
  { id: 'related', label: 'Related tours' },
  { id: 'advanced', label: 'Advanced' },
]

const EMPTY = {
  slug: '',
  name: '',
  country: '',
  order: 0,
  hero: '',
  teaser: '',
  intro: '',
  distinct: '',
  bestTime: '',
  featured: [],
  relatedTours: [],
  relatedPackages: [],
}

export default function DestinationEditor() {
  const { id } = useParams()

  const { item, setItem, set, err, saving, dirty, fieldErrors, onSave, isNew } = useEditorForm({
    collection: api.destinations,
    id,
    empty: EMPTY,
    titleField: 'name',
    titleLabel: 'Region name',
    clean: (it) => ({ ...it, slug: it.slug.trim(), order: toNumberOrNull(it.order) ?? 0 }),
    editorPath: (newId) => `/admin/destinations/${newId}`,
    savedMessage: 'Destination saved',
  })

  if (err && !item) return <div style={{ color: 'crimson' }}>{err}</div>
  if (!item) return <div>Loading…</div>

  return (
    <div>
      <div style={s.stickyHeader}>
        <div style={{ minWidth: 0 }}>
          <GuardedLink to="/admin/destinations" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: 13 }}>← All destinations</GuardedLink>
          <h1 style={{ ...s.h1, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isNew ? 'New destination' : item.name || 'Untitled'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {!isNew && item.slug && (
            <a href={`/destinations/${item.slug}`} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>
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
              <FormField label="Region name" error={fieldErrors.name}>
                <input style={s.input} value={item.name || ''} onChange={(e) => set({ name: e.target.value })} placeholder="Bosnia, Montenegro…" />
              </FormField>
              <SlugField
                value={item.slug}
                onChange={(v) => set({ slug: v })}
                titleValue={item.name}
                isNew={isNew}
                error={fieldErrors.slug}
                hint="URL path: /destinations/your-slug"
              />
            </div>
            <div style={s.grid2}>
              <FormField label="Country">
                <input style={s.input} value={item.country || ''} onChange={(e) => set({ country: e.target.value })} />
              </FormField>
              <FormField label="Order" hint="Lower numbers appear first on the hub.">
                <input type="number" style={s.input} value={item.order ?? ''} onChange={(e) => set({ order: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Teaser" hint="Two lines shown on the destinations hub card.">
              <textarea style={s.textarea} value={item.teaser || ''} onChange={(e) => set({ teaser: e.target.value })} />
            </FormField>
            <FormField label="Best time to visit">
              <input style={s.input} value={item.bestTime || ''} onChange={(e) => set({ bestTime: e.target.value })} />
            </FormField>
          </section>

          <section id="media" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Hero image</h2>
            <p style={s.subheadingHint}>A strong landscape image — a real road or place, not a group photo.</p>
            <ImageUpload value={item.hero} onChange={(v) => set({ hero: v })} slug={item.slug || 'destination'} />
          </section>

          <section id="content" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Editorial copy</h2>
            <h3 style={s.subheading}>Intro</h3>
            <p style={s.subheadingHint}>The opening — what you actually feel when you're there.</p>
            <RichTextEditor value={item.intro || ''} onChange={(v) => set({ intro: v })} slug={item.slug || 'destination'} />
            <div style={{ height: 1, backgroundColor: colors.border, margin: '24px 0' }} />
            <h3 style={s.subheading}>What makes it distinct</h3>
            <RichTextEditor value={item.distinct || ''} onChange={(v) => set({ distinct: v })} slug={item.slug || 'destination'} />
          </section>

          <section id="featured" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Featured places</h2>
            <p style={s.subheadingHint}>3–5 places that define the region.</p>
            <FeaturedEditor value={item.featured} onChange={(v) => set({ featured: v })} slug={item.slug || 'destination'} />
          </section>

          <section id="related" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Related tours & packages</h2>
            <p style={s.subheadingHint}>Link this region to bookable trips. No dead ends.</p>
            <div style={{ ...s.grid2, rowGap: 28, alignItems: 'start' }}>
              <FormField label="Related tours">
                <RelationPicker kind="tour" multiple value={item.relatedTours} onChange={(v) => set({ relatedTours: v })} placeholder="+ Add tour" />
              </FormField>
              <FormField label="Related packages">
                <RelationPicker kind="package" multiple value={item.relatedPackages} onChange={(v) => set({ relatedPackages: v })} placeholder="+ Add package" />
              </FormField>
            </div>
          </section>

          <details id="advanced" style={{ ...s.card, scrollMarginTop: 100 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Advanced — raw JSON</summary>
            <JsonField value={item} onChange={(v) => v && setItem(v)} rows={20} />
          </details>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <GuardedLink to="/admin/destinations" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }}>Cancel</GuardedLink>
            <SaveButton dirty={dirty} saving={saving} isNew={isNew} onClick={onSave} />
          </div>

        </div>
      </div>
    </div>
  )
}

function FeaturedEditor({ value, onChange, slug }) {
  const items = Array.isArray(value) ? value : []
  const update = (idx, patch) => {
    const copy = items.slice()
    copy[idx] = { ...copy[idx], ...patch }
    onChange(copy)
  }
  const remove = (idx) => {
    const copy = items.slice()
    copy.splice(idx, 1)
    onChange(copy)
  }
  const move = (idx, dir) => {
    const target = idx + dir
    if (target < 0 || target >= items.length) return
    const copy = items.slice()
    const [it] = copy.splice(idx, 1)
    copy.splice(target, 0, it)
    onChange(copy)
  }
  const add = () => onChange([...items, { name: '', blurb: '', image: '' }])

  return (
    <div>
      {items.length === 0 && (
        <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>No places yet.</p>
      )}
      <div style={{ display: 'grid', gap: 16 }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted }}>Place {idx + 1}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
              </div>
            </div>
            <div style={s.grid2}>
              <FormField label="Name">
                <input style={s.input} value={it.name || ''} onChange={(e) => update(idx, { name: e.target.value })} />
              </FormField>
              <FormField label="Blurb">
                <input style={s.input} value={it.blurb || ''} onChange={(e) => update(idx, { blurb: e.target.value })} />
              </FormField>
            </div>
            <ImageUpload value={it.image} onChange={(v) => update(idx, { image: v })} slug={slug} label="Image" />
          </div>
        ))}
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 12 }} onClick={add}>+ Add place</button>
    </div>
  )
}
