import { useEffect, useState } from 'react'
import { s, colors } from '../styles'

// Highlights on the public site render as "<Landmark> — <Description>".
// We keep the data shape as an array of strings (so frontend rendering
// doesn't change) but expose two fields per row in the admin so editing
// the landmark vs. the description is clearer.

const SEPARATOR = ' — ' // em-dash with spaces, matches existing tours.json

function split(value) {
  const str = typeof value === 'string' ? value : ''
  const idx = str.indexOf(SEPARATOR)
  if (idx === -1) return { landmark: str, description: '' }
  return { landmark: str.slice(0, idx), description: str.slice(idx + SEPARATOR.length) }
}

function join(landmark, description) {
  const l = (landmark || '').trim()
  const d = (description || '').trim()
  if (l && d) return `${l}${SEPARATOR}${d}`
  return l || d
}

function HighlightRow({ raw, idx, total, onUpdate, onRemove, onMove }) {
  const parsed = split(raw)
  const [landmark, setLandmark] = useState(parsed.landmark)
  const [description, setDescription] = useState(parsed.description)

  // Sync local state when the parent row value changes externally (e.g. reorder)
  useEffect(() => {
    const p = split(raw)
    setLandmark(p.landmark)
    setDescription(p.description)
  }, [raw])

  const commit = (lm, desc) => onUpdate(join(lm.trim(), desc.trim()))

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        columnGap: 8,
        rowGap: 8,
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'grid', gap: 6 }}>
        <div>
          <label style={fieldLabel}>Landmark</label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            onBlur={() => commit(landmark, description)}
            placeholder="e.g. Latin Bridge & Assassination Site"
            style={{ ...s.input, fontWeight: 600 }}
          />
        </div>
        <div>
          <label style={fieldLabel}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => commit(landmark, description)}
            placeholder="What the visitor sees, learns, or experiences here."
            style={{ ...s.textarea, minHeight: 64 }}
          />
        </div>
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px' }} onClick={() => onMove(-1)} disabled={idx === 0}>↑</button>
      <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px' }} onClick={() => onMove(1)} disabled={idx === total - 1}>↓</button>
      <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px', color: colors.danger }} onClick={onRemove}>✕</button>
    </div>
  )
}

export default function HighlightsEditor({ value, onChange, label, hint }) {
  const items = Array.isArray(value) ? value : []

  const update = (idx, joined) => {
    const copy = items.slice()
    copy[idx] = joined
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
  const add = () => onChange([...items, ''])

  const empty = items.length === 0

  return (
    <div>
      {label && (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <h3 style={s.subheading}>
            {label}
            <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: colors.textMuted }}>
              {items.length}
            </span>
          </h3>
        </div>
      )}
      {hint && <p style={s.subheadingHint}>{hint}</p>}
      {empty ? (
        <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>
          No highlights yet.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 18 }}>
          {items.map((raw, idx) => (
            <HighlightRow
              key={idx}
              raw={raw}
              idx={idx}
              total={items.length}
              onUpdate={(joined) => update(idx, joined)}
              onRemove={() => remove(idx)}
              onMove={(dir) => move(idx, dir)}
            />
          ))}
        </div>
      )}
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 12 }} onClick={add}>
        + Add highlight
      </button>
    </div>
  )
}

const fieldLabel = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  color: colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  marginBottom: 4,
}
