import { s, colors } from '../styles'

// Optional booking add-ons (hotel pick-up, museum tickets, etc.) that guests
// can select while booking a tour. Stored on the tour as:
//   extras: [{ label, description, price, perPerson }]
// `perPerson` true → price is multiplied by the number of guests at checkout.
export default function ExtrasEditor({ value, onChange, label, hint }) {
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
  const add = () => onChange([...items, { label: '', description: '', price: 0, perPerson: false }])

  return (
    <div>
      {label && (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <h3 style={s.subheading}>
            {label}
            <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: colors.textMuted }}>{items.length}</span>
          </h3>
        </div>
      )}
      {hint && <p style={s.subheadingHint}>{hint}</p>}

      {items.length === 0 ? (
        <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>
          No extras yet. Add things guests can opt into when booking — pick-up, tickets, tastings…
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {items.map((it, idx) => (
            <div key={idx} style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted }}>Extra {idx + 1}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                  <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
                  <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                <div>
                  <label style={fieldLabel}>Label</label>
                  <input
                    type="text"
                    style={{ ...s.input, fontWeight: 600 }}
                    value={it.label || ''}
                    onChange={(e) => update(idx, { label: e.target.value })}
                    placeholder="e.g. Hotel pick-up & drop-off"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', columnGap: 12, alignItems: 'end' }}>
                  <div>
                    <label style={fieldLabel}>Price (€)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      style={s.input}
                      value={it.price ?? ''}
                      onChange={(e) => update(idx, { price: e.target.value })}
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, fontSize: 13, color: colors.text, cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!it.perPerson} onChange={(e) => update(idx, { perPerson: e.target.checked })} />
                    Price is per person
                  </label>
                </div>

                <div>
                  <label style={fieldLabel}>
                    Description <span style={{ fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <textarea
                    style={{ ...s.textarea, minHeight: 52 }}
                    value={it.description || ''}
                    onChange={(e) => update(idx, { description: e.target.value })}
                    placeholder="One line shown under the label on the booking form."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 12 }} onClick={add}>
        + Add extra
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
