import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import RichTextEditor from '../components/RichTextEditor'
import ImageUpload from '../components/ImageUpload'
import JsonField from '../components/JsonField'
import ExtraEditor from '../components/ExtraEditor'
import SectionNav from '../components/SectionNav'
import { PAGE_ROUTES } from './PagesList'

const LAYOUTS = ['text', 'image-right', 'image-left', 'full-image']

// What each page actually renders on the public site, so the editor only shows
// controls that do something and gives structured fields for the bespoke
// `extra` content instead of a raw-JSON box. Unknown pages fall back to the
// full generic editor (DEFAULT_CONFIG).
const PAGE_CONFIG = {
  'our-story': {
    sections: true, quotes: true, cta: true,
    extra: [
      { key: 'credentials', type: 'objectList', label: 'Credentials', hint: 'The “what fourteen years gives you” grid.', fields: [
        { key: 'title', type: 'text', label: 'Title' },
        { key: 'body', type: 'textarea', label: 'Body' },
      ] },
      { key: 'areasOfDepth', type: 'list', label: 'Areas of depth', placeholder: 'e.g. Ottoman Sarajevo' },
    ],
  },
  hospitality: { sections: true, quotes: true, cta: true, extra: [] },
  signature: {
    sections: true, quotes: false, cta: true,
    extra: [
      { key: 'scarcity', type: 'text', label: 'Scarcity line', hint: 'Small amber line above the journeys (optional).' },
      { key: 'journeys', type: 'objectList', label: 'Signature journeys', fields: [
        { key: 'title', type: 'text', label: 'Title' },
        { key: 'blurb', type: 'textarea', label: 'Blurb' },
        { key: 'image', type: 'image', label: 'Photo' },
        { key: 'duration', type: 'text', label: 'Length' },
        { key: 'maxGuests', type: 'text', label: 'Group size' },
        { key: 'expert', type: 'text', label: 'Led by' },
        { key: 'fromPrice', type: 'text', label: 'From price', hint: 'A number, or “On request”.' },
      ] },
      { key: 'process', type: 'objectList', label: 'Design process steps', fields: [
        { key: 'step', type: 'text', label: 'Step' },
        { key: 'detail', type: 'textarea', label: 'Detail' },
      ] },
    ],
  },
  partners: {
    sections: false, quotes: false, cta: true,
    extra: [
      { key: 'stats', type: 'objectList', label: 'Trust stats', fields: [
        { key: 'value', type: 'text', label: 'Value' },
        { key: 'label', type: 'text', label: 'Label' },
      ] },
      { key: 'services', type: 'objectList', label: 'Services', fields: [
        { key: 'title', type: 'text', label: 'Title' },
        { key: 'detail', type: 'textarea', label: 'Detail' },
      ] },
      { key: 'tiers', type: 'objectList', label: 'Engagement tiers', fields: [
        { key: 'name', type: 'text', label: 'Name' },
        { key: 'detail', type: 'textarea', label: 'Detail' },
      ] },
      { key: 'pdfUrl', type: 'text', label: 'Capability PDF URL', hint: 'Link to a one-page DMC capability PDF.' },
    ],
  },
  consult: {
    sections: false, quotes: false, cta: false,
    extra: [
      { key: 'price', type: 'text', label: 'Price', hint: 'e.g. €90' },
      { key: 'priceNote', type: 'text', label: 'Price note' },
      { key: 'calendlyUrl', type: 'text', label: 'Calendly URL', hint: 'Paste your Calendly embed URL; the scheduler appears on the page.' },
      { key: 'includes', type: 'list', label: 'What the session includes' },
      { key: 'forWho', type: 'list', label: "Who it's for" },
      { key: 'worthIt', type: 'richtext', label: 'Why it’s worth it' },
      { key: 'testimonials', type: 'objectList', label: 'Testimonials', fields: [
        { key: 'quote', type: 'textarea', label: 'Quote' },
        { key: 'name', type: 'text', label: 'Name' },
      ] },
      { key: 'faqs', type: 'objectList', label: 'FAQs', fields: [
        { key: 'q', type: 'text', label: 'Question' },
        { key: 'a', type: 'textarea', label: 'Answer' },
      ] },
    ],
  },
  'where-we-stay': {
    sections: false, quotes: false, cta: false,
    extra: [
      { key: 'types', type: 'objectList', label: 'Accommodation types', hint: 'The kinds of places — each shown with a photo on the page.', fields: [
        { key: 'tag', type: 'text', label: 'Tag', hint: 'e.g. The authentic end' },
        { key: 'name', type: 'text', label: 'Name' },
        { key: 'image', type: 'image', label: 'Photo' },
        { key: 'body', type: 'textarea', label: 'Description' },
      ] },
    ],
  },
}

const DEFAULT_CONFIG = { sections: true, quotes: true, cta: true, extra: null }

export default function PageEditor() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)

  useEffect(() => {
    api.pages.get(id).then(setItem).catch((e) => setErr(e.message))
  }, [id])

  const set = (patch) => setItem((t) => ({ ...t, ...patch }))
  const setNested = (key, patch) => setItem((t) => ({ ...t, [key]: { ...(t[key] || {}), ...patch } }))

  const onSave = async () => {
    setSaving(true)
    setErr(null)
    try {
      await api.pages.update(id, item)
      setSavedAt(Date.now())
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (err && !item) return <div style={{ color: 'crimson' }}>{err}</div>
  if (!item) return <div>Loading…</div>

  const route = PAGE_ROUTES[item.slug]
  const config = PAGE_CONFIG[item.slug] || DEFAULT_CONFIG
  const nav = [
    { id: 'seo', label: 'SEO' },
    { id: 'hero', label: 'Hero' },
    ...(config.sections ? [{ id: 'sections', label: 'Sections' }] : []),
    ...(config.quotes ? [{ id: 'quotes', label: 'Pull quotes' }] : []),
    ...(config.cta ? [{ id: 'cta', label: 'Call to action' }] : []),
    { id: 'extra', label: 'Page content' },
  ]

  return (
    <div>
      <div style={s.stickyHeader}>
        <div style={{ minWidth: 0 }}>
          <Link to="/admin/pages" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: 13 }}>← All pages</Link>
          <h1 style={{ ...s.h1, marginTop: 4 }}>{item.title || item.slug}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {savedAt && <span style={{ fontSize: 12, color: colors.success }}>Saved</span>}
          {route && <a href={route} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>View on site ↗</a>}
          <button style={s.btn} onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>

      {err && <div style={{ ...s.card, color: colors.danger }}>{err}</div>}

      <div style={s.editorLayout}>
        <SectionNav sections={nav} />
        <div style={{ minWidth: 0 }}>

          <section id="seo" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>SEO</h2>
            <FormField label="Meta title">
              <input style={s.input} value={item.seo?.title || ''} onChange={(e) => setNested('seo', { title: e.target.value })} />
            </FormField>
            <FormField label="Meta description">
              <textarea style={s.textarea} value={item.seo?.description || ''} onChange={(e) => setNested('seo', { description: e.target.value })} />
            </FormField>
          </section>

          <section id="hero" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Hero</h2>
            <div style={s.grid2}>
              <FormField label="Kicker" hint="Small label above the heading.">
                <input style={s.input} value={item.hero?.kicker || ''} onChange={(e) => setNested('hero', { kicker: e.target.value })} />
              </FormField>
              <FormField label="Heading">
                <input style={s.input} value={item.hero?.heading || ''} onChange={(e) => setNested('hero', { heading: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Subheading">
              <textarea style={s.textarea} value={item.hero?.subheading || ''} onChange={(e) => setNested('hero', { subheading: e.target.value })} />
            </FormField>
            <FormField label="Hero image">
              <ImageUpload value={item.hero?.image} onChange={(v) => setNested('hero', { image: v })} slug={item.slug || 'page'} />
            </FormField>
          </section>

          {config.sections && (
            <section id="sections" style={{ ...s.card, scrollMarginTop: 100 }}>
              <h2 style={{ ...s.h2, marginTop: 0 }}>Editorial sections</h2>
              <p style={s.subheadingHint}>The long-form body, top to bottom. Each block can carry its own image and layout.</p>
              <SectionsEditor value={item.sections} onChange={(v) => set({ sections: v })} slug={item.slug || 'page'} />
            </section>
          )}

          {config.quotes && (
            <section id="quotes" style={{ ...s.card, scrollMarginTop: 100 }}>
              <h2 style={{ ...s.h2, marginTop: 0 }}>Pull quotes</h2>
              <p style={s.subheadingHint}>Large quotes placed between sections as trust signals.</p>
              <QuotesEditor value={item.pullQuotes} onChange={(v) => set({ pullQuotes: v })} />
            </section>
          )}

          {config.cta && (
          <section id="cta" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Call to action</h2>
            <div style={s.grid2}>
              <FormField label="Button label">
                <input style={s.input} value={item.cta?.label || ''} onChange={(e) => setNested('cta', { label: e.target.value })} />
              </FormField>
              <FormField label="Link (href)" hint="A route like /destinations or an anchor like #book.">
                <input style={s.input} value={item.cta?.href || ''} onChange={(e) => setNested('cta', { href: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Note under the button (optional)">
              <input style={s.input} value={item.cta?.note || ''} onChange={(e) => setNested('cta', { note: e.target.value })} />
            </FormField>
          </section>
          )}

          <section id="extra" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Page content</h2>
            {config.extra ? (
              config.extra.length === 0 ? (
                <p style={s.subheadingHint}>This page’s body is the editorial sections above — nothing else to set here.</p>
              ) : (
                <ExtraEditor schema={config.extra} value={item.extra} onChange={(v) => set({ extra: v })} slug={item.slug || 'page'} />
              )
            ) : (
              <>
                <p style={s.subheadingHint}>Structured content unique to this page. Edit as JSON.</p>
                <JsonField value={item.extra || {}} onChange={(v) => v && set({ extra: v })} rows={18} />
              </>
            )}
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Link to="/admin/pages" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }}>Back</Link>
            <button style={s.btn} onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>

        </div>
      </div>
    </div>
  )
}

function SectionsEditor({ value, onChange, slug }) {
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
  const add = () => onChange([...items, { id: `s${Date.now()}`, heading: '', body: '', image: '', imageCaption: '', layout: 'text' }])

  return (
    <div>
      {items.length === 0 && <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>No sections yet.</p>}
      <div style={{ display: 'grid', gap: 18 }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted }}>Section {idx + 1}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
              </div>
            </div>
            <div style={s.grid2}>
              <FormField label="Heading (optional)">
                <input style={s.input} value={it.heading || ''} onChange={(e) => update(idx, { heading: e.target.value })} />
              </FormField>
              <FormField label="Layout">
                <select style={s.input} value={it.layout || 'text'} onChange={(e) => update(idx, { layout: e.target.value })}>
                  {LAYOUTS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="Body">
              <RichTextEditor value={it.body || ''} onChange={(v) => update(idx, { body: v })} slug={slug} />
            </FormField>
            <div style={s.grid2}>
              <FormField label="Image (optional)">
                <ImageUpload value={it.image} onChange={(v) => update(idx, { image: v })} slug={slug} />
              </FormField>
              <FormField label="Image caption">
                <input style={s.input} value={it.imageCaption || ''} onChange={(e) => update(idx, { imageCaption: e.target.value })} />
              </FormField>
            </div>
          </div>
        ))}
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 12 }} onClick={add}>+ Add section</button>
    </div>
  )
}

function QuotesEditor({ value, onChange }) {
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
  const add = () => onChange([...items, { quote: '', attribution: '' }])

  return (
    <div>
      {items.length === 0 && <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>No quotes yet.</p>}
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'start' }}>
            <div>
              <textarea style={{ ...s.textarea, minHeight: 60 }} value={it.quote || ''} onChange={(e) => update(idx, { quote: e.target.value })} placeholder="The quote" />
              <input style={{ ...s.input, marginTop: 6 }} value={it.attribution || ''} onChange={(e) => update(idx, { attribution: e.target.value })} placeholder="Attribution (optional)" />
            </div>
            <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
          </div>
        ))}
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 10 }} onClick={add}>+ Add quote</button>
    </div>
  )
}
