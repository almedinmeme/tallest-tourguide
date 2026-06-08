import { useEffect, useState } from 'react'
import { s, colors } from '../styles'

// Accepts whatever a user is likely to paste from Google Maps:
//   "43.857760, 18.428882"   (right-click → copy coordinates)
//   "43.857760,18.428882"
//   "43.857760 18.428882"
//   "https://www.google.com/maps/place/Foo/@43.857760,18.428882,17z/data=…"
//   "https://maps.app.goo.gl/…?q=43.857760,18.428882"
// Returns { lat, lng } or null if no valid pair could be extracted.
function parseCoords(input) {
  if (!input) return null
  const str = String(input).trim()

  // 1. Google Maps URL: /@<lat>,<lng>,…
  const url = str.match(/[@?](-?\d+\.\d+),(-?\d+\.\d+)/)
  if (url) {
    const lat = parseFloat(url[1])
    const lng = parseFloat(url[2])
    if (isValidLatLng(lat, lng)) return { lat, lng }
  }

  // 2. Plain "lat, lng" (comma, semicolon, or whitespace separator)
  const plain = str.match(/^(-?\d+(?:\.\d+)?)[\s,;]+(-?\d+(?:\.\d+)?)$/)
  if (plain) {
    const lat = parseFloat(plain[1])
    const lng = parseFloat(plain[2])
    if (isValidLatLng(lat, lng)) return { lat, lng }
  }

  return null
}

function isValidLatLng(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

function formatCoords(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return ''
  // Six decimal places ≈ ~11 cm precision — plenty for waypoints.
  const round = (n) => Number(n.toFixed(6)).toString()
  return `${round(lat)}, ${round(lng)}`
}

export default function WaypointEditor({ value, onChange, label }) {
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
  const add = () => onChange([...items, { lat: 0, lng: 0, label: '' }])

  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      <div style={{ display: 'grid', gap: 8 }}>
        {items.map((wp, idx) => (
          <WaypointRow
            key={idx}
            wp={wp}
            onChange={(patch) => update(idx, patch)}
            onMoveUp={() => move(idx, -1)}
            onMoveDown={() => move(idx, 1)}
            onRemove={() => remove(idx)}
            isFirst={idx === 0}
            isLast={idx === items.length - 1}
          />
        ))}
      </div>
      {items.length === 0 && (
        <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>
          No waypoints yet.
        </p>
      )}
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 10 }} onClick={add}>
        + Add waypoint
      </button>
      <p style={{ fontSize: 11.5, color: colors.textMuted, marginTop: 8, margin: '8px 0 0' }}>
        Tip: in Google Maps, right-click a spot → click the coordinates to copy → paste here.
        Full place URLs work too.
      </p>
    </div>
  )
}

function WaypointRow({ wp, onChange, onMoveUp, onMoveDown, onRemove, isFirst, isLast }) {
  // Local text state so the user can type/paste freely without us
  // immediately reformatting their input. We sync to the parent's
  // lat/lng only when the text parses cleanly.
  const initialText = formatCoords(wp.lat, wp.lng)
  const [text, setText] = useState(initialText)
  const [touched, setTouched] = useState(false)

  // If lat/lng change from outside (e.g., row reordering), reseed the text.
  useEffect(() => {
    setText(formatCoords(wp.lat, wp.lng))
    setTouched(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wp.lat, wp.lng])

  const parsed = parseCoords(text)
  const isEmpty = text.trim() === ''
  const isInvalid = touched && !isEmpty && !parsed

  const handleChange = (next) => {
    setText(next)
    setTouched(true)
    const result = parseCoords(next)
    if (result) onChange({ lat: result.lat, lng: result.lng })
  }

  const handleBlur = () => {
    setTouched(true)
    if (parsed) {
      // Snap the displayed text to the canonical format on blur.
      setText(formatCoords(parsed.lat, parsed.lng))
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: 8, alignItems: 'flex-start' }}>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder="43.8578, 18.4289"
          style={{
            ...s.input,
            fontFamily: 'ui-monospace, monospace',
            fontSize: 13,
            borderColor: isInvalid ? colors.danger : undefined,
          }}
        />
        {isInvalid && (
          <div style={{ fontSize: 11, color: colors.danger, marginTop: 4 }}>
            Couldn't read coordinates. Try “lat, lng” or paste a Google Maps URL.
          </div>
        )}
      </div>
      <input
        type="text"
        value={wp.label || ''}
        onChange={(e) => onChange({ label: e.target.value })}
        placeholder="Label (e.g. Latin Bridge)"
        style={s.input}
      />
      <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px' }} onClick={onMoveUp} disabled={isFirst}>↑</button>
      <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px' }} onClick={onMoveDown} disabled={isLast}>↓</button>
      <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px', color: colors.danger }} onClick={onRemove}>✕</button>
    </div>
  )
}
