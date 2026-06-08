import { s, colors } from '../styles'

export default function FitnessNotesEditor({ value, onChange }) {
  const items = Array.isArray(value) ? value : []

  const update = (idx, patch) => {
    const c = items.slice()
    c[idx] = { ...c[idx], ...patch }
    onChange(c)
  }
  const remove = (idx) => {
    const c = items.slice()
    c.splice(idx, 1)
    onChange(c)
  }
  const add = () => onChange([...items, { type: 'physical', level: '', detail: '' }])

  return (
    <div>
      <label style={s.label}>Fitness / content notes</label>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ border: `1px solid ${colors.border}`, borderRadius: 6, padding: 10, backgroundColor: '#fff' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 6, marginBottom: 6 }}>
              <select style={s.input} value={it.type || 'physical'} onChange={(e) => update(idx, { type: e.target.value })}>
                <option value="physical">physical</option>
                <option value="emotional">emotional</option>
              </select>
              <input style={s.input} value={it.level || ''} onChange={(e) => update(idx, { level: e.target.value })} placeholder="Level (e.g. Moderate fitness required)" />
              <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
            </div>
            <textarea style={s.textarea} value={it.detail || ''} onChange={(e) => update(idx, { detail: e.target.value })} placeholder="Detail" rows={3} />
          </div>
        ))}
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 8 }} onClick={add}>+ Add note</button>
    </div>
  )
}
