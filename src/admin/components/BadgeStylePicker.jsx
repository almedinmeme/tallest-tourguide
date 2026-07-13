import { useState } from 'react'
import { s, colors } from '../styles'
import FormField from './FormField'

// Preset badge color pairs use the public site's CSS variables (defined in
// src/index.css, available under /admin too since the site stylesheet is
// global). "Custom" keeps the old free-text inputs for arbitrary values.
const PRESETS = [
  { name: 'Amber', bg: 'var(--color-amber)', text: 'var(--color-n900)' },
  { name: 'Forest green', bg: 'var(--color-forest-green)', text: 'var(--color-n000)' },
  { name: 'Mid green', bg: 'var(--color-mid-green)', text: 'var(--color-n000)' },
  { name: 'Charcoal', bg: 'var(--color-n900)', text: 'var(--color-n000)' },
  { name: 'Light amber', bg: 'var(--color-amber-light)', text: 'var(--color-n900)' },
]

export default function BadgeStylePicker({ badge, color, textColor, onChange }) {
  const matchesPreset = PRESETS.some((p) => p.bg === (color || '') && p.text === (textColor || ''))
  const isEmpty = !color && !textColor
  const [customMode, setCustomMode] = useState(!isEmpty && !matchesPreset)

  return (
    <div>
      <div style={s.grid2}>
        <FormField label="Badge text" hint="Leave empty for no badge.">
          <input style={s.input} value={badge || ''} onChange={(e) => onChange({ badge: e.target.value })} placeholder="Most Popular" />
        </FormField>
        <FormField label="Preview">
          <div style={{ display: 'flex', alignItems: 'center', minHeight: 38 }}>
            {badge ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  backgroundColor: color || 'var(--color-forest-green)',
                  color: textColor || 'var(--color-n000)',
                }}
              >
                {badge}
              </span>
            ) : (
              <span style={{ fontSize: 12.5, color: colors.textMuted, fontStyle: 'italic' }}>No badge</span>
            )}
          </div>
        </FormField>
      </div>

      <FormField label="Badge colors">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {PRESETS.map((p) => {
            const active = !customMode && p.bg === (color || '') && p.text === (textColor || '')
            return (
              <button
                key={p.name}
                type="button"
                title={p.name}
                onClick={() => {
                  setCustomMode(false)
                  onChange({ badgeColor: p.bg, badgeTextColor: p.text })
                }}
                style={{
                  appearance: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  backgroundColor: p.bg,
                  color: p.text,
                  border: active ? `2px solid ${colors.text}` : '2px solid transparent',
                  outlineOffset: 2,
                  boxShadow: active ? `0 0 0 2px ${colors.panel}, 0 0 0 4px ${colors.primaryRing}` : 'none',
                }}
              >
                {p.name}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setCustomMode((v) => !v)}
            style={{
              ...s.btn,
              ...s.btnGhost,
              padding: '4px 12px',
              fontSize: 12,
              ...(customMode ? { borderColor: colors.primary, color: colors.primary } : {}),
            }}
          >
            Custom…
          </button>
        </div>
      </FormField>

      {customMode && (
        <div style={s.grid2}>
          <FormField label="Badge bg" hint="CSS color or var(--…)">
            <input style={s.input} value={color || ''} onChange={(e) => onChange({ badgeColor: e.target.value })} placeholder="var(--color-amber)" />
          </FormField>
          <FormField label="Badge text color">
            <input style={s.input} value={textColor || ''} onChange={(e) => onChange({ badgeTextColor: e.target.value })} placeholder="var(--color-n900)" />
          </FormField>
        </div>
      )}
    </div>
  )
}
