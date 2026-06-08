import ListEditor from './ListEditor'
import { s } from '../styles'

export default function SuitabilityEditor({ value, onChange }) {
  const v = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  const set = (key, next) => onChange({ ...v, [key]: next })

  return (
    <div>
      <label style={s.label}>Suitability</label>
      <div style={s.grid2}>
        <ListEditor label="Good for" value={v.goodFor} onChange={(next) => set('goodFor', next)} multiline />
        <ListEditor label="Think twice" value={v.thinkTwice} onChange={(next) => set('thinkTwice', next)} multiline />
      </div>
    </div>
  )
}
