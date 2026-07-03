import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import RichTextEditor from '../components/RichTextEditor'
import ImageUpload from '../components/ImageUpload'
import JsonField from '../components/JsonField'
import SectionNav from '../components/SectionNav'

const SECTIONS = [
  { id: 'basics', label: 'Basics' },
  { id: 'hero', label: 'Hero image' },
  { id: 'body', label: 'Body' },
  { id: 'related', label: 'Related content' },
  { id: 'advanced', label: 'Advanced' },
]

const EMPTY = {
  slug: '',
  published: true,
  title: '',
  excerpt: '',
  category: '',
  publishedDate: new Date().toISOString().slice(0, 10),
  heroImage: '',
  content: '',
  inlineImage1: '',
  inlineImage1Caption: '',
  content2: '',
  inlineImage2: '',
  inlineImage2Caption: '',
  content3: '',
  inlineImage3: '',
  inlineImage3Caption: '',
  content4: '',
  inlineImage4: '',
  inlineImage4Caption: '',
  content5: '',
  relatedTourSlug: '',
  relatedPackageSlug: '',
  inlineCardSlug: '',
  inlineCardType: 'tour',
}

// The public page (BlogPost.jsx) renders these in order:
// content → image1 → content2 → image2 → inline promo card →
// content3 → image3 → content4 → image4 → content5.
function BodyBlock({ item, set, n }) {
  const contentKey = n === 1 ? 'content' : `content${n}`
  const imageKey = `inlineImage${n}`
  const captionKey = `inlineImage${n}Caption`
  return (
    <>
      <FormField label={`Text block ${n}`}>
        <RichTextEditor
          value={item[contentKey] || ''}
          onChange={(v) => set({ [contentKey]: v })}
          slug={item.slug || 'journal'}
        />
      </FormField>
      {n < 5 && (
        <div style={{ ...s.grid2, marginTop: 12, marginBottom: 20 }}>
          <FormField label={`Image after block ${n}`} hint="Optional.">
            <ImageUpload value={item[imageKey]} onChange={(v) => set({ [imageKey]: v })} slug={item.slug || 'journal'} />
          </FormField>
          <FormField label="Caption" hint="Shown under the image, italic.">
            <input style={s.input} value={item[captionKey] || ''} onChange={(e) => set({ [captionKey]: e.target.value })} />
          </FormField>
        </div>
      )}
    </>
  )
}

export default function JournalEditor() {
  const { id } = useParams()
  const isNew = !id
  const nav = useNavigate()

  const [item, setItem] = useState(isNew ? EMPTY : null)
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) return
    api.journal.get(id).then(setItem).catch((e) => setErr(e.message))
  }, [id, isNew])

  const set = (patch) => setItem((t) => ({ ...t, ...patch }))

  const onSave = async () => {
    if (!item.slug?.trim()) {
      setErr('A slug is required — it becomes the URL: /journal/<slug>')
      return
    }
    setSaving(true)
    setErr(null)
    try {
      const cleaned = { ...item, slug: item.slug.trim() }
      if (isNew) {
        const created = await api.journal.create(cleaned)
        nav(`/admin/journal/${created.id}`, { replace: true })
      } else {
        await api.journal.update(id, cleaned)
      }
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (err && !item) return <div style={{ color: 'crimson' }}>{err}</div>
  if (!item) return <div>Loading…</div>

  return (
    <div>
      <div style={s.stickyHeader}>
        <div style={{ minWidth: 0 }}>
          <Link to="/admin/journal" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: 13 }}>← All posts</Link>
          <h1 style={{ ...s.h1, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isNew ? 'New post' : item.title || 'Untitled'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {!isNew && item.slug && (
            <a href={`/journal/${item.slug}`} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>View post ↗</a>
          )}
          <button style={s.btn} onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
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
                <input style={s.input} value={item.title || ''} onChange={(e) => set({ title: e.target.value })} />
              </FormField>
              <FormField label="Slug" hint="The URL: /journal/<slug>. Changing it on a live post breaks inbound links.">
                <input style={s.input} value={item.slug || ''} onChange={(e) => set({ slug: e.target.value })} />
              </FormField>
            </div>
            <div style={s.grid3}>
              <FormField label="Category">
                <input style={s.input} value={item.category || ''} onChange={(e) => set({ category: e.target.value })} placeholder="History, Food, Nature…" />
              </FormField>
              <FormField label="Published date">
                <input type="date" style={s.input} value={(item.publishedDate || '').slice(0, 10)} onChange={(e) => set({ publishedDate: e.target.value })} />
              </FormField>
              <FormField label="Status" hint="Drafts stay out of the site, sitemap and prerender.">
                <select style={s.input} value={item.published === false ? 'draft' : 'live'} onChange={(e) => set({ published: e.target.value === 'live' })}>
                  <option value="live">Live</option>
                  <option value="draft">Draft</option>
                </select>
              </FormField>
            </div>
            <FormField label="Excerpt" hint="Lead paragraph on the post + the meta description Google shows. 1–2 sentences.">
              <textarea style={s.textarea} value={item.excerpt || ''} onChange={(e) => set({ excerpt: e.target.value })} />
            </FormField>
          </section>

          <section id="hero" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Hero image</h2>
            <ImageUpload value={item.heroImage} onChange={(v) => set({ heroImage: v })} slug={item.slug || 'journal'} />
          </section>

          <section id="body" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Body</h2>
            <p style={s.subheadingHint}>
              Text blocks alternate with optional images. The promo card (Related content) appears between blocks 2 and 3.
            </p>
            {[1, 2, 3, 4, 5].map((n) => (
              <BodyBlock key={n} item={item} set={set} n={n} />
            ))}
          </section>

          <section id="related" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Related content</h2>
            <div style={s.grid2}>
              <FormField label="Related tour slug" hint="Shows a booking card at the end of the post.">
                <input style={s.input} value={item.relatedTourSlug || ''} onChange={(e) => set({ relatedTourSlug: e.target.value })} placeholder="sarajevo-walking-tour" />
              </FormField>
              <FormField label="Related package slug">
                <input style={s.input} value={item.relatedPackageSlug || ''} onChange={(e) => set({ relatedPackageSlug: e.target.value })} placeholder="bosnia-deep-dive" />
              </FormField>
            </div>
            <div style={s.grid2}>
              <FormField label="Inline promo card slug" hint="Card shown mid-article, between text blocks 2 and 3.">
                <input style={s.input} value={item.inlineCardSlug || ''} onChange={(e) => set({ inlineCardSlug: e.target.value })} />
              </FormField>
              <FormField label="Inline card type">
                <select style={s.input} value={item.inlineCardType || 'tour'} onChange={(e) => set({ inlineCardType: e.target.value })}>
                  <option value="tour">Tour</option>
                  <option value="package">Package</option>
                </select>
              </FormField>
            </div>
          </section>

          <details id="advanced" style={{ ...s.card, scrollMarginTop: 100 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Advanced — raw JSON</summary>
            <JsonField value={item} onChange={(v) => v && setItem(v)} rows={20} />
          </details>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Link to="/admin/journal" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }}>Cancel</Link>
            <button style={s.btn} onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>

        </div>
      </div>
    </div>
  )
}
