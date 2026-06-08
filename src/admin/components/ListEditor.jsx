import { s, colors } from '../styles'

export default function ListEditor({ value, onChange, label, hint, placeholder, multiline = false }) {
  const items = Array.isArray(value) ? value : []

  const update = (idx, next) => {
    const copy = items.slice()
    copy[idx] = next
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

  const Field = multiline ? 'textarea' : 'input'
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
          No items yet.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 6 }}>
          {items.map((it, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 6, alignItems: 'flex-start' }}>
              <Field
                value={it}
                onChange={(e) => update(idx, e.target.value)}
                placeholder={placeholder}
                style={multiline ? s.textarea : s.input}
              />
              <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
              <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px' }} onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
              <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
            </div>
          ))}
        </div>
      )}
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 10 }} onClick={add}>
        + Add {label ? label.toLowerCase().replace(/s$/, '') : 'item'}
      </button>
    </div>
  )
}
