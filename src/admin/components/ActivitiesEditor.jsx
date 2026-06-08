import { s, colors } from '../styles'

const ICONS = [
  'sunset', 'history', 'war', 'food', 'coffee', 'family', 'home',
  'hike', 'mountain', 'walk', 'bike', 'sea', 'waterfall', 'rafting', 'boat',
  'wine', 'car', 'shield', 'bunker', 'camera', 'landmark', 'market',
  'night', 'tent', 'forest', 'fire',
]

export default function ActivitiesEditor({ value, onChange }) {
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
  const add = () => onChange([...items, { icon: 'sunset', name: '', description: '' }])

  return (
    <div>
      <label style={s.label}>Activities</label>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((a, idx) => (
          <div key={idx} style={{ border: `1px solid ${colors.border}`, borderRadius: 6, padding: 10, backgroundColor: '#fff' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto auto auto', gap: 6, marginBottom: 6 }}>
              <select style={s.input} value={a.icon || ''} onChange={(e) => update(idx, { icon: e.target.value })}>
                {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
              <input style={s.input} value={a.name || ''} onChange={(e) => update(idx, { name: e.target.value })} placeholder="Activity name" />
              <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
              <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
              <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
            </div>
            <textarea style={s.textarea} value={a.description || ''} onChange={(e) => update(idx, { description: e.target.value })} placeholder="Description" rows={2} />
          </div>
        ))}
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 8 }} onClick={add}>+ Add activity</button>
    </div>
  )
}
