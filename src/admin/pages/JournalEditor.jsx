import { useParams } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import ImageUpload from '../components/ImageUpload'
import JsonField from '../components/JsonField'
import SectionNav from '../components/SectionNav'
import RelationPicker from '../components/RelationPicker'
import SaveButton from '../components/SaveButton'
import GuardedLink from '../components/GuardedLink'
import SlugField from '../components/SlugField'
import BlogBlocksEditor from '../components/BlogBlocksEditor'
import seoLengthHint from '../components/seoLengthHint'
import { useEditorForm } from '../hooks/useEditorForm'
import { postBlocks } from '../../data/journalBlocks'

const SECTIONS = [
  { id: 'basics', label: 'Basics' },
  { id: 'hero', label: 'Hero image' },
  { id: 'body', label: 'Body' },
  { id: 'related', label: 'Related content' },
  { id: 'seo', label: 'SEO' },
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
  blocks: [],
  relatedTourSlug: '',
  relatedPackageSlug: '',
  relatedExtraType: 'tour',
  relatedExtraSlug: '',
  seoTitle: '',
  seoDescription: '',
}

// Fields from the old fixed body layout (content, inlineImage1, …, plus the
// post-level inline card). Posts are migrated to blocks[]; saving strips any
// stragglers so the two never drift.
const LEGACY_BODY_KEYS = [
  'content',
  ...[2, 3, 4, 5].map((n) => `content${n}`),
  ...[1, 2, 3, 4].flatMap((n) => [`inlineImage${n}`, `inlineImage${n}Caption`]),
  'inlineCardSlug',
  'inlineCardType',
]

const stripTags = (html) => (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()

// Drop blocks with nothing in them: empty text (unless it holds an image),
// images without a photo, booking cards without a picked tour/package.
const isRealBlock = (b) =>
  b.type === 'text'
    ? Boolean(stripTags(b.html) || /<img\b/i.test(b.html || ''))
    : b.type === 'image'
      ? Boolean(b.src)
      : Boolean(b.slug)

function cleanPost(it) {
  // postBlocks also folds any legacy body fields / post-level inline card
  // into the block list before the legacy keys are stripped.
  const blocks = postBlocks(it).filter(isRealBlock)
  const cleaned = { ...it, slug: it.slug.trim(), blocks }
  for (const key of LEGACY_BODY_KEYS) delete cleaned[key]
  return cleaned
}

export default function JournalEditor() {
  const { id } = useParams()

  const { item, setItem, set, err, saving, dirty, fieldErrors, onSave, isNew } = useEditorForm({
    collection: api.journal,
    id,
    empty: EMPTY,
    titleField: 'title',
    clean: cleanPost,
    editorPath: (newId) => `/admin/journal/${newId}`,
    savedMessage: 'Post saved',
  })

  if (err && !item) return <div style={{ color: 'crimson' }}>{err}</div>
  if (!item) return <div>Loading…</div>

  return (
    <div>
      <div style={s.stickyHeader}>
        <div style={{ minWidth: 0 }}>
          <GuardedLink to="/admin/journal" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: 13 }}>← All posts</GuardedLink>
          <h1 style={{ ...s.h1, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isNew ? 'New post' : item.title || 'Untitled'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {!isNew && item.slug && (
            <a href={`/journal/${item.slug}`} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>View post ↗</a>
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
                <input style={s.input} value={item.title || ''} onChange={(e) => set({ title: e.target.value })} />
              </FormField>
              <SlugField
                value={item.slug}
                onChange={(v) => set({ slug: v })}
                titleValue={item.title}
                isNew={isNew}
                error={fieldErrors.slug}
                hint="The URL: /journal/<slug>. Changing it on a live post breaks inbound links."
              />
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
              Add as many text, image and booking-card blocks as the story needs — they render top to bottom. Drag to rearrange.
            </p>
            <BlogBlocksEditor
              value={postBlocks(item)}
              onChange={(v) => set({ blocks: v })}
              slug={item.slug || 'journal'}
            />
          </section>

          <section id="related" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>Related content</h2>
            <p style={s.subheadingHint}>
              These show as booking cards at the end of the post. For cards inside the story, add a “Booking card” block in the Body section above.
            </p>
            <div style={s.grid3}>
              <FormField label="Related tour">
                <RelationPicker kind="tour" value={item.relatedTourSlug || ''} onChange={(v) => set({ relatedTourSlug: v })} />
              </FormField>
              <FormField label="Related package">
                <RelationPicker kind="package" value={item.relatedPackageSlug || ''} onChange={(v) => set({ relatedPackageSlug: v })} />
              </FormField>
              <FormField label="Third related item" hint="Optional — adds a third card alongside the tour and package above.">
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8 }}>
                  <select
                    style={s.input}
                    value={item.relatedExtraType === 'package' ? 'package' : 'tour'}
                    onChange={(e) => set({ relatedExtraType: e.target.value, relatedExtraSlug: '' })}
                  >
                    <option value="tour">Tour</option>
                    <option value="package">Package</option>
                  </select>
                  <RelationPicker
                    kind={item.relatedExtraType === 'package' ? 'package' : 'tour'}
                    value={item.relatedExtraSlug || ''}
                    onChange={(v) => set({ relatedExtraSlug: v })}
                  />
                </div>
              </FormField>
            </div>
          </section>

          <section id="seo" style={{ ...s.card, scrollMarginTop: 100 }}>
            <h2 style={{ ...s.h2, marginTop: 0 }}>SEO</h2>
            <p style={s.subheadingHint}>
              What Google shows for this post. Empty fields fall back to the title and excerpt.
            </p>
            <FormField label="Meta title" hint={seoLengthHint(item.seoTitle, 60, 'title')}>
              <input style={s.input} value={item.seoTitle || ''} onChange={(e) => set({ seoTitle: e.target.value })} placeholder={item.title || ''} />
            </FormField>
            <FormField label="Meta description" hint={seoLengthHint(item.seoDescription, 160, 'description')}>
              <textarea style={s.textarea} value={item.seoDescription || ''} onChange={(e) => set({ seoDescription: e.target.value })} placeholder={item.excerpt || ''} />
            </FormField>
          </section>

          <details id="advanced" style={{ ...s.card, scrollMarginTop: 100 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Advanced — raw JSON</summary>
            <JsonField value={item} onChange={(v) => v && setItem(v)} rows={20} />
          </details>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <GuardedLink to="/admin/journal" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }}>Cancel</GuardedLink>
            <SaveButton dirty={dirty} saving={saving} isNew={isNew} onClick={onSave} />
          </div>

        </div>
      </div>
    </div>
  )
}
