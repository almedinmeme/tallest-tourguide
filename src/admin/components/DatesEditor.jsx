import { s, colors } from '../styles'

export default function DatesEditor({ value, onChange }) {
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
  const move = (idx, dir) => {
    const t = idx + dir
    if (t < 0 || t >= items.length) return
    const c = items.slice()
    const [it] = c.splice(idx, 1)
    c.splice(t, 0, it)
    onChange(c)
  }
  const add = () => {
    const nextId = items.length ? Math.max(...items.map((d) => Number(d.id) || 0)) + 1 : 1
    onChange([...items, { id: nextId, date: '', spots: 8, total: 8 }])
  }

  return (
    <div>
      <label style={s.label}>Departure dates</label>
      <div style={{ display: 'grid', gap: 6 }}>
        {items.map((d, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px auto auto auto', gap: 6 }}>
            <input style={s.input} value={d.date || ''} onChange={(e) => update(idx, { date: e.target.value })} placeholder="e.g. April 12–14, 2026" />
            <input type="number" style={s.input} value={d.spots ?? ''} onChange={(e) => update(idx, { spots: parseInt(e.target.value) || 0 })} placeholder="spots" />
            <input type="number" style={s.input} value={d.total ?? ''} onChange={(e) => update(idx, { total: parseInt(e.target.value) || 0 })} placeholder="total" />
            <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
            <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
            <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
          </div>
        ))}
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 8 }} onClick={add}>+ Add date</button>
    </div>
  )
}
