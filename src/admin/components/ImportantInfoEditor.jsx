import { s, colors } from '../styles'

// importantInfo entries can use either { title, content } or { title, text } —
// we read whichever exists and write to `content` consistently.
export default function ImportantInfoEditor({ value, onChange }) {
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
  const add = () => onChange([...items, { title: '', content: '' }])

  return (
    <div>
      <label style={s.label}>Important info</label>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((it, idx) => {
          const text = it.content ?? it.text ?? ''
          return (
            <div key={idx} style={{ border: `1px solid ${colors.border}`, borderRadius: 6, padding: 10, backgroundColor: '#fff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 6, marginBottom: 6 }}>
                <input style={s.input} value={it.title || ''} onChange={(e) => update(idx, { title: e.target.value })} placeholder="Title" />
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
              </div>
              <textarea style={s.textarea} value={text} onChange={(e) => update(idx, { content: e.target.value, text: undefined })} placeholder="Body" rows={3} />
            </div>
          )
        })}
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 8 }} onClick={add}>+ Add info block</button>
    </div>
  )
}
