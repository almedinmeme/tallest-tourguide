import RichTextEditor from './RichTextEditor'
import ImageUpload from './ImageUpload'
import DragHandle from './DragHandle'
import RelationPicker from './RelationPicker'
import { useListDrag } from '../hooks/useListDrag'
import { s, colors } from '../styles'

// Unlimited, reorderable journal body: text blocks (TipTap), full-width
// images with captions, and any number of inline booking cards, each
// pointing at its own tour or package.
// Emits [{ id, type: 'text'|'image'|'promo', ... }].

const newBlockId = () => Math.random().toString(36).slice(2, 8)

const TYPE_META = {
  text: { label: 'Text', color: colors.primary },
  image: { label: 'Image', color: colors.accent },
  promo: { label: 'Booking card', color: colors.success },
}

export default function BlogBlocksEditor({ value, onChange, slug }) {
  const blocks = Array.isArray(value) ? value : []
  const drag = useListDrag(blocks, onChange)

  const update = (idx, patch) => {
    const copy = blocks.slice()
    copy[idx] = { ...copy[idx], ...patch }
    onChange(copy)
  }
  const remove = (idx) => {
    const copy = blocks.slice()
    copy.splice(idx, 1)
    onChange(copy)
  }
  const move = (idx, dir) => {
    const target = idx + dir
    if (target < 0 || target >= blocks.length) return
    const copy = blocks.slice()
    const [it] = copy.splice(idx, 1)
    copy.splice(target, 0, it)
    onChange(copy)
  }
  const add = (block) => onChange([...blocks, { id: newBlockId(), ...block }])

  return (
    <div>
      {blocks.length === 0 && (
        <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: '0 0 10px' }}>
          No blocks yet — add your first text block below.
        </p>
      )}

      <div style={{ display: 'grid', gap: 14 }}>
        {blocks.map((block, idx) => {
          const meta = TYPE_META[block.type] || TYPE_META.text
          const { style: dropStyle, ...dropProps } = drag.rowProps(idx)
          return (
            <div
              key={block.id || `i${idx}`}
              {...dropProps}
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                backgroundColor: colors.panel,
                opacity: drag.dragIndex === idx ? 0.4 : 1,
                ...dropStyle,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderBottom: `1px solid ${colors.border}`,
                  backgroundColor: colors.panelMuted,
                  borderRadius: '8px 8px 0 0',
                }}
              >
                <DragHandle {...drag.handleProps(idx)} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: meta.color }}>
                  {meta.label}
                </span>
                <span style={{ fontSize: 11, color: colors.textMuted }}>#{idx + 1}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '3px 8px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                  <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '3px 8px' }} onClick={() => move(idx, 1)} disabled={idx === blocks.length - 1}>↓</button>
                  <button type="button" title="Remove block" style={{ ...s.btn, ...s.btnGhost, padding: '3px 8px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
                </div>
              </div>

              <div style={{ padding: 12 }}>
                {block.type === 'text' && (
                  <RichTextEditor value={block.html || ''} onChange={(html) => update(idx, { html })} slug={slug} />
                )}
                {block.type === 'image' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' }}>
                    <ImageUpload value={block.src} onChange={(src) => update(idx, { src })} slug={slug} />
                    <div>
                      <label style={s.label}>Caption</label>
                      <input
                        style={s.input}
                        value={block.caption || ''}
                        onChange={(e) => update(idx, { caption: e.target.value })}
                        placeholder="Shown under the image, italic. Optional."
                      />
                    </div>
                  </div>
                )}
                {block.type === 'promo' && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 8, alignItems: 'start' }}>
                      <div>
                        <label style={s.label}>Type</label>
                        <select
                          style={s.input}
                          value={block.cardType === 'package' ? 'package' : 'tour'}
                          onChange={(e) => update(idx, { cardType: e.target.value, slug: '' })}
                        >
                          <option value="tour">Tour</option>
                          <option value="package">Package</option>
                        </select>
                      </div>
                      <div>
                        <label style={s.label}>{block.cardType === 'package' ? 'Package' : 'Tour'}</label>
                        <RelationPicker
                          kind={block.cardType === 'package' ? 'package' : 'tour'}
                          value={block.slug || ''}
                          onChange={(v) => update(idx, { slug: v })}
                          allowEmpty={false}
                        />
                      </div>
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: 12, color: colors.textMuted }}>
                      Renders as a highlighted booking card, visually set off from the story.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={() => add({ type: 'text', html: '' })}>
          + Text block
        </button>
        <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={() => add({ type: 'image', src: '', caption: '' })}>
          + Image
        </button>
        <button
          type="button"
          style={{ ...s.btn, ...s.btnSecondary }}
          title="Inline booking card for a tour or package — add as many as the post needs"
          onClick={() => add({ type: 'promo', cardType: 'tour', slug: '' })}
        >
          + Booking card
        </button>
      </div>
    </div>
  )
}
