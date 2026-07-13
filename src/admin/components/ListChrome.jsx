// Shared bits for the collection list pages (search box, thumbnail, skeleton).
import { s, colors } from '../styles'

export function SearchBox({ value, onChange, placeholder }) {
  return (
    <div style={{ position: 'relative', flex: '0 0 auto' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={s.searchInput}
      />
    </div>
  )
}

export function Thumb({ src, alt }) {
  if (!src) {
    return (
      <div
        style={{
          width: 64,
          height: 44,
          borderRadius: 6,
          backgroundColor: colors.panelMuted,
          border: `1px solid ${colors.border}`,
        }}
      />
    )
  }
  return (
    <img
      src={src}
      alt={alt || ''}
      style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 6, border: `1px solid ${colors.border}`, display: 'block' }}
    />
  )
}

export function SkeletonRows() {
  return (
    <div style={{ ...s.card, padding: 0 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 16px', borderBottom: i < 3 ? `1px solid ${colors.border}` : 'none' }}>
          <div style={{ ...s.skeleton, width: 64, height: 44 }} />
          <div style={{ flex: 1 }}>
            <div style={{ ...s.skeleton, width: '40%', height: 14, marginBottom: 6 }} />
            <div style={{ ...s.skeleton, width: '60%', height: 11 }} />
          </div>
        </div>
      ))}
    </div>
  )
}
