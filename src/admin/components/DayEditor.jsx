import { useState } from 'react'
import RichTextEditor from './RichTextEditor'
import ListEditor from './ListEditor'
import ImageUpload from './ImageUpload'
import FormField from './FormField'
import { s, colors } from '../styles'

function DayCard({ day, idx, total, slug, onPatch, onRemove, onMove }) {
  const [open, setOpen] = useState(false)

  const patch = (k, v) => onPatch(idx, { [k]: v })

  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 6, backgroundColor: '#fff', marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: open ? `1px solid ${colors.border}` : 'none',
          backgroundColor: colors.panelMuted,
          borderRadius: open ? '6px 6px 0 0' : 6,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', flex: 1, padding: 0, fontSize: 14 }}
        >
          <strong>Day {idx + 1}</strong> {day.title ? `— ${day.title}` : <span style={{ color: colors.textMuted }}>untitled</span>}
          {day.city && <span style={{ color: colors.textMuted, marginLeft: 8 }}>· {day.city}</span>}
          <span style={{ marginLeft: 8, color: colors.textMuted, fontSize: 12 }}>{open ? '▼' : '▶'}</span>
        </button>
        <div style={{ display: 'flex', gap: 4 }}>
          <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => onMove(idx, -1)} disabled={idx === 0}>↑</button>
          <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => onMove(idx, 1)} disabled={idx === total - 1}>↓</button>
          <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => onRemove(idx)}>✕</button>
        </div>
      </div>

      {open && (
        <div style={{ padding: 14 }}>
          <div style={s.grid2}>
            <FormField label="Title">
              <input style={s.input} value={day.title || ''} onChange={(e) => patch('title', e.target.value)} />
            </FormField>
            <FormField label="City">
              <input style={s.input} value={day.city || ''} onChange={(e) => patch('city', e.target.value)} />
            </FormField>
          </div>
          <FormField label="Summary">
            <input style={s.input} value={day.summary || ''} onChange={(e) => patch('summary', e.target.value)} />
          </FormField>
          <FormField label="Photo">
            <ImageUpload value={day.photo} onChange={(v) => patch('photo', v)} slug={`${slug || 'day'}-${idx + 1}`} />
          </FormField>
          <FormField label="Accommodation">
            <input style={s.input} value={day.accommodation || ''} onChange={(e) => patch('accommodation', e.target.value)} />
          </FormField>

          <FormField label="Morning">
            <RichTextEditor value={day.morning || ''} onChange={(v) => patch('morning', v)} slug={slug} />
          </FormField>
          <FormField label="Afternoon">
            <RichTextEditor value={day.afternoon || ''} onChange={(v) => patch('afternoon', v)} slug={slug} />
          </FormField>
          <FormField label="Evening">
            <RichTextEditor value={day.evening || ''} onChange={(v) => patch('evening', v)} slug={slug} />
          </FormField>

          <FormField>
            <ListEditor label="Meals" value={day.meals} onChange={(v) => patch('meals', v)} placeholder="e.g. Lunch with local family" />
          </FormField>
          <FormField>
            <ListEditor label="Included activities" value={day.includedActivities} onChange={(v) => patch('includedActivities', v)} />
          </FormField>
          <FormField>
            <ListEditor label="Optional activities" value={day.optionalActivities} onChange={(v) => patch('optionalActivities', v)} />
          </FormField>
          <FormField label="Note">
            <textarea style={s.textarea} value={day.note || ''} onChange={(e) => patch('note', e.target.value)} />
          </FormField>
        </div>
      )}
    </div>
  )
}

export default function DayEditor({ value, onChange, slug }) {
  const items = Array.isArray(value) ? value : []

  const patch = (idx, patchObj) => {
    const copy = items.slice()
    copy[idx] = { ...copy[idx], ...patchObj }
    onChange(copy)
  }
  const remove = (idx) => {
    if (!window.confirm(`Delete day ${idx + 1}?`)) return
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
  const add = () => {
    const nextId = items.length ? Math.max(...items.map((d) => Number(d.id) || 0)) + 1 : 1
    onChange([...items, { id: nextId, title: '', city: '', summary: '', morning: '', afternoon: '', evening: '', meals: [], includedActivities: [], optionalActivities: [] }])
  }

  return (
    <div>
      <label style={s.label}>Itinerary days</label>
      {items.map((day, idx) => (
        <DayCard
          key={day.id ?? idx}
          day={day}
          idx={idx}
          total={items.length}
          slug={slug}
          onPatch={patch}
          onRemove={remove}
          onMove={move}
        />
      ))}
      <button type="button" style={{ ...s.btn, ...s.btnSecondary }} onClick={add}>
        + Add day
      </button>
    </div>
  )
}
