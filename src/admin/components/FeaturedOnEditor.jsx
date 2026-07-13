import { s, colors } from '../styles'
import RelationPicker from './RelationPicker'

// Structured editor for an accommodation's `featuredOn` list — replaces the
// old raw-JSON textarea. Emits the same shape: [{ slug, type, label }].
export default function FeaturedOnEditor({ value, onChange }) {
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
  const add = () => onChange([...items, { slug: '', type: 'tour', label: '' }])

  return (
    <div>
      {items.length === 0 && (
        <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>
          Not featured on any tour or package yet.
        </p>
      )}
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it, idx) => {
          const kind = it.type === 'package' ? 'package' : 'tour'
          return (
            <div key={idx} style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr auto', gap: 8, alignItems: 'start' }}>
                <div>
                  <label style={s.label}>Type</label>
                  <select
                    style={s.input}
                    value={kind}
                    onChange={(e) => update(idx, { type: e.target.value, slug: '', label: '' })}
                  >
                    <option value="tour">Tour</option>
                    <option value="package">Package</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>{kind === 'tour' ? 'Tour' : 'Package'}</label>
                  <RelationPicker
                    kind={kind}
                    value={it.slug || ''}
                    onChange={(v) => update(idx, { slug: v })}
                    onPick={(option) => update(idx, { slug: option.slug, label: option.label })}
                    allowEmpty={false}
                  />
                </div>
                <button
                  type="button"
                  title="Remove"
                  style={{ ...s.btn, ...s.btnGhost, color: colors.danger, marginTop: 22 }}
                  onClick={() => remove(idx)}
                >
                  ✕
                </button>
              </div>
              <div style={{ marginTop: 8 }}>
                <label style={s.label}>Label shown on the page</label>
                <input
                  style={s.input}
                  value={it.label || ''}
                  onChange={(e) => update(idx, { label: e.target.value })}
                  placeholder="Auto-filled from the picked item"
                />
              </div>
            </div>
          )
        })}
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 12 }} onClick={add}>
        + Add tour/package
      </button>
    </div>
  )
}
