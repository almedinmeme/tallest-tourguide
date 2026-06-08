import RichTextEditor from './RichTextEditor'
import ImageUpload from './ImageUpload'
import ListEditor from './ListEditor'
import FormField from './FormField'
import { s, colors } from '../styles'

// Schema-driven editor for a page's bespoke `extra` content, so each page gets
// real fields instead of a raw-JSON box. Field types: text, textarea, richtext,
// image, list (string[]), objectList (array of objects with their own fields).
export default function ExtraEditor({ schema, value, onChange, slug }) {
  const extra = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const setKey = (key, v) => onChange({ ...extra, [key]: v })

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {schema.map((field) => (
        <Field key={field.key} field={field} value={extra[field.key]} onChange={(v) => setKey(field.key, v)} slug={slug} />
      ))}
    </div>
  )
}

function Field({ field, value, onChange, slug }) {
  const { type, label, hint, placeholder } = field

  if (type === 'text') {
    return (
      <FormField label={label} hint={hint}>
        <input style={s.input} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      </FormField>
    )
  }
  if (type === 'textarea') {
    return (
      <FormField label={label} hint={hint}>
        <textarea style={s.textarea} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      </FormField>
    )
  }
  if (type === 'richtext') {
    return (
      <FormField label={label} hint={hint}>
        <RichTextEditor value={value || ''} onChange={onChange} slug={slug} />
      </FormField>
    )
  }
  if (type === 'image') {
    return (
      <FormField label={label} hint={hint}>
        <ImageUpload value={value} onChange={onChange} slug={slug} />
      </FormField>
    )
  }
  if (type === 'list') {
    return <ListEditor value={value} onChange={onChange} label={label} hint={hint} placeholder={placeholder} multiline={field.multiline} />
  }
  if (type === 'objectList') {
    return <ObjectListEditor field={field} value={value} onChange={onChange} slug={slug} />
  }
  return null
}

function singular(label) {
  return (label || 'Item').replace(/s$/, '')
}

function ObjectListEditor({ field, value, onChange, slug }) {
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
  const add = () => onChange([...items, Object.fromEntries(field.fields.map((f) => [f.key, '']))])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <h3 style={s.subheading}>
          {field.label}
          <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: colors.textMuted }}>{items.length}</span>
        </h3>
      </div>
      {field.hint && <p style={s.subheadingHint}>{field.hint}</p>}

      <div style={{ display: 'grid', gap: 16 }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted }}>{singular(field.label)} {idx + 1}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>↑</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>↓</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => remove(idx)}>✕</button>
              </div>
            </div>
            {field.fields.map((sub) => (
              <Field key={sub.key} field={sub} value={it[sub.key]} onChange={(v) => update(idx, { [sub.key]: v })} slug={slug} />
            ))}
          </div>
        ))}
        {items.length === 0 && <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: 0 }}>No items yet.</p>}
      </div>

      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 12 }} onClick={add}>
        + Add {singular(field.label).toLowerCase()}
      </button>
    </div>
  )
}
