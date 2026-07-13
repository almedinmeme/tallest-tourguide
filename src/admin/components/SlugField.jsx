import { useEffect, useRef } from 'react'
import { s, colors } from '../styles'
import FormField from './FormField'
import { slugify } from '../utils/validate'

// Slug input that auto-fills from the title while creating a new item (until
// the user types their own slug), plus a "from title" regenerate button.
export default function SlugField({ value, onChange, titleValue, isNew, error, hint, label = 'Slug' }) {
  const lastAutoRef = useRef(value || '')

  useEffect(() => {
    if (!isNew) return
    const current = value || ''
    if (current !== '' && current !== lastAutoRef.current) return
    const next = slugify(titleValue || '')
    if (next === current) return
    lastAutoRef.current = next
    onChange(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue, isNew])

  return (
    <FormField label={label} hint={hint} error={error}>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          style={{ ...s.input, fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 13, ...(error ? { borderColor: colors.danger } : {}) }}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
        />
        <button
          type="button"
          title="Generate from title"
          style={{ ...s.btn, ...s.btnGhost, flexShrink: 0, padding: '8px 10px' }}
          onClick={() => {
            const next = slugify(titleValue || '')
            lastAutoRef.current = next
            onChange(next)
          }}
        >
          ↻ from title
        </button>
      </div>
    </FormField>
  )
}
