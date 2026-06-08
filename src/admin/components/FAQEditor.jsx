import RichTextEditor from './RichTextEditor'
import { s, colors } from '../styles'

export default function FAQEditor({ value, onChange, slug }) {
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
  const add = () => onChange([...items, { question: '', answer: '' }])

  return (
    <div>
      <div style={{ display: 'grid', gap: 22 }}>
        {items.map((faq, idx) => (
          <div
            key={idx}
            style={{
              paddingLeft: 14,
              borderLeft: `2px solid ${colors.border}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                Question {idx + 1}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
              </div>
            </div>
            <input
              type="text"
              value={faq.question || ''}
              onChange={(e) => update(idx, { question: e.target.value })}
              placeholder="Question"
              style={{ ...s.input, marginBottom: 8, fontWeight: 600 }}
            />
            <RichTextEditor
              value={faq.answer || ''}
              onChange={(html) => update(idx, { answer: html })}
              slug={slug}
            />
          </div>
        ))}
        {items.length === 0 && (
          <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: 0 }}>
            No FAQs yet.
          </p>
        )}
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 14 }} onClick={add}>
        + Add FAQ
      </button>
    </div>
  )
}
