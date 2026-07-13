import { Children, cloneElement, isValidElement } from 'react'
import { s, colors } from '../styles'

export default function FormField({ label, hint, error, children, full = true }) {
  let content = children
  if (error && Children.count(children) === 1 && isValidElement(children) && typeof children.type === 'string') {
    content = cloneElement(children, {
      style: { ...children.props.style, borderColor: colors.danger },
      'aria-invalid': true,
    })
  }
  return (
    <div
      style={{ ...s.fieldRow, ...(full ? {} : { display: 'inline-block' }) }}
      data-field-error={error ? true : undefined}
    >
      {label && <label style={s.label}>{label}</label>}
      {content}
      {error ? (
        <div style={{ ...s.hint, color: colors.danger, fontWeight: 600 }}>{error}</div>
      ) : (
        hint && <div style={s.hint}>{hint}</div>
      )}
    </div>
  )
}
