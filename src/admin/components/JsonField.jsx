import { useEffect, useState } from 'react'
import { s, colors } from '../styles'

// Escape hatch for fields whose shape isn't covered by a dedicated editor.
// Parses on blur; rejects invalid JSON visually but keeps the text so user can fix.
export default function JsonField({ value, onChange, label, hint, rows = 6 }) {
  const [text, setText] = useState(() => stringify(value))
  const [err, setErr] = useState(null)

  useEffect(() => {
    setText(stringify(value))
    setErr(null)
  }, [value])

  const commit = () => {
    if (text.trim() === '') {
      setErr(null)
      onChange(undefined)
      return
    }
    try {
      const parsed = JSON.parse(text)
      setErr(null)
      onChange(parsed)
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        rows={rows}
        spellCheck={false}
        style={{ ...s.textarea, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 12 }}
      />
      {hint && <div style={s.hint}>{hint}</div>}
      {err && <div style={{ ...s.hint, color: colors.danger }}>JSON error: {err}</div>}
    </div>
  )
}

function stringify(v) {
  if (v === undefined || v === null) return ''
  if (typeof v === 'string') return v
  try {
    return JSON.stringify(v, null, 2)
  } catch {
    return ''
  }
}
