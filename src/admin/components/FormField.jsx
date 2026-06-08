import { s } from '../styles'

export default function FormField({ label, hint, children, full = true }) {
  return (
    <div style={{ ...s.fieldRow, ...(full ? {} : { display: 'inline-block' }) }}>
      {label && <label style={s.label}>{label}</label>}
      {children}
      {hint && <div style={s.hint}>{hint}</div>}
    </div>
  )
}
