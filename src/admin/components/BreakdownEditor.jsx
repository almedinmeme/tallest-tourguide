import ListEditor from './ListEditor'
import { s, colors } from '../styles'

const SECTIONS = [
  { key: 'accommodation', label: 'Accommodation' },
  { key: 'meals', label: 'Meals' },
  { key: 'transport', label: 'Transport' },
  { key: 'destinations', label: 'Destinations' },
  { key: 'activities', label: 'Activities' },
  { key: 'optional', label: 'Optional' },
]

export default function BreakdownEditor({ value, onChange }) {
  const v = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const set = (key, next) => onChange({ ...v, [key]: next })

  return (
    <div>
      <label style={s.label}>Breakdown</label>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        {SECTIONS.map((sec) => (
          <div key={sec.key} style={{ border: `1px solid ${colors.border}`, borderRadius: 6, padding: 10, backgroundColor: '#fff' }}>
            <ListEditor label={sec.label} value={v[sec.key]} onChange={(next) => set(sec.key, next)} />
          </div>
        ))}
      </div>
    </div>
  )
}
