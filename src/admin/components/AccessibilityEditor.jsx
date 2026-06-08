import { s, colors } from '../styles'
import { totalDistanceKm } from '../utils/distance'

// The full shape this editor reads/writes. Matches the migrated data.
export const EMPTY_ACCESSIBILITY = {
  walkingDistanceKm: null,
  drivingDistanceKm: null,
  walkingDurationMin: null,
  drivingDurationMin: null,
  durationMin: null, // total tour duration, including stops
  elevationGainM: null,
  effortLevel: null,
  suitability: {
    wheelchair: null,
    stroller: null,
    smallChildren: null,
    children: null,
    pregnancy: null,
    seniors: null,
    pets: null,
  },
  requirements: [],
  terrain: '',
  notes: '',
}

const SUITABILITY_ROWS = [
  { key: 'wheelchair',    label: 'Wheelchair accessible' },
  { key: 'stroller',      label: 'Stroller-friendly' },
  { key: 'smallChildren', label: 'Small children (0–5)' },
  { key: 'children',      label: 'Children (6–12)' },
  { key: 'pregnancy',     label: 'During pregnancy' },
  { key: 'seniors',       label: 'Seniors (65+)' },
  { key: 'pets',          label: 'Pet-friendly' },
]

const REQUIREMENT_PRESETS = [
  { key: 'stairs',    label: 'Climb a flight of stairs' },
  { key: 'walkingKm', label: 'Walk a minimum distance on uneven ground' },
  { key: 'standing',  label: 'Stand for long periods' },
  { key: 'luggage',   label: 'Carry own luggage' },
  { key: 'swimming',  label: 'Swim or be comfortable in water' },
  { key: 'altitude',  label: 'Tolerate high altitude' },
  { key: 'sun',       label: 'Tolerate prolonged sun exposure' },
  { key: 'custom',    label: '' },
]

const EFFORT_LEVELS = [
  { value: null,        label: '—' },
  { value: 'low',       label: 'Low' },
  { value: 'moderate',  label: 'Moderate' },
  { value: 'high',      label: 'High' },
  { value: 'extreme',   label: 'Extreme' },
]

export default function AccessibilityEditor({ value, onChange, waypoints, mapProfile }) {
  // Always merge into the empty template so partial data renders without crashes.
  const acc = { ...EMPTY_ACCESSIBILITY, ...(value || {}), suitability: { ...EMPTY_ACCESSIBILITY.suitability, ...(value?.suitability || {}) } }

  const set = (patch) => onChange({ ...acc, ...patch })
  const setNumber = (key, raw) => {
    const trimmed = String(raw).trim()
    set({ [key]: trimmed === '' ? null : Number(raw) })
  }
  const setSuit = (key, v) => set({ suitability: { ...acc.suitability, [key]: v } })

  // Straight-line distance is only useful for walking tours — driving routes
  // diverge wildly from straight lines, so we never auto-calc driving distance.
  const isDrivingTour = mapProfile === 'driving-car'
  const recalcWalkingDistance = () => {
    const km = totalDistanceKm(waypoints)
    const rounded = Math.round(km * 10) / 10
    set({ walkingDistanceKm: rounded })
  }

  // --- Requirements list helpers ---
  const updateReq = (idx, patch) => {
    const next = acc.requirements.slice()
    next[idx] = { ...next[idx], ...patch }
    set({ requirements: next })
  }
  const removeReq = (idx) => {
    const next = acc.requirements.slice()
    next.splice(idx, 1)
    set({ requirements: next })
  }
  const moveReq = (idx, dir) => {
    const target = idx + dir
    if (target < 0 || target >= acc.requirements.length) return
    const next = acc.requirements.slice()
    const [it] = next.splice(idx, 1)
    next.splice(target, 0, it)
    set({ requirements: next })
  }
  const addReq = () => set({ requirements: [...acc.requirements, { key: 'stairs', label: 'Climb a flight of stairs', detail: '' }] })

  const onPresetChange = (idx, presetKey) => {
    const preset = REQUIREMENT_PRESETS.find((p) => p.key === presetKey)
    if (!preset) return
    if (preset.key === 'custom') {
      updateReq(idx, { key: 'custom' })
    } else {
      updateReq(idx, { key: preset.key, label: preset.label })
    }
  }

  const hasWaypoints = Array.isArray(waypoints) && waypoints.length >= 2

  return (
    <div style={{ display: 'grid', gap: 26 }}>

      {/* 1. Distances & duration */}
      <div>
        <h3 style={s.subheading}>Distances & duration</h3>
        <p style={s.subheadingHint}>
          Leave any field blank to hide it on the public page. Walking distance can be auto-filled from waypoints; driving distance is always manual since straight-line numbers are misleading for roads.
        </p>

        {/* Distances */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
          <NumField label="Walking distance (km)" value={acc.walkingDistanceKm} onChange={(v) => setNumber('walkingDistanceKm', v)} step="0.1" />
          <NumField label="Driving distance (km)" value={acc.drivingDistanceKm} onChange={(v) => setNumber('drivingDistanceKm', v)} step="1" />
        </div>

        {!isDrivingTour && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
            <button
              type="button"
              style={{ ...s.btn, ...s.btnSecondary, opacity: hasWaypoints ? 1 : 0.5, cursor: hasWaypoints ? 'pointer' : 'not-allowed' }}
              onClick={recalcWalkingDistance}
              disabled={!hasWaypoints}
            >
              ↻ Recalculate walking distance from {waypoints?.length || 0} waypoints
            </button>
            <span style={{ fontSize: 11, color: colors.textMuted }}>
              Approx., straight-line distance.
            </span>
          </div>
        )}

        {/* Durations */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
          <NumField
            label="Walking time (min)"
            value={acc.walkingDurationMin}
            onChange={(v) => setNumber('walkingDurationMin', v)}
            step="5"
            hint="Active walking minutes"
          />
          <NumField
            label="Driving time (min)"
            value={acc.drivingDurationMin}
            onChange={(v) => setNumber('drivingDurationMin', v)}
            step="15"
            hint="Time spent in the vehicle"
          />
          <NumField
            label="Total duration (min)"
            value={acc.durationMin}
            onChange={(v) => setNumber('durationMin', v)}
            step="15"
            hint="Whole tour incl. stops"
          />
        </div>

        {/* Elevation + effort */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          <NumField label="Elevation gain (m)" value={acc.elevationGainM} onChange={(v) => setNumber('elevationGainM', v)} step="10" />
          <div>
            <label style={s.label}>Overall effort</label>
            <select
              style={s.input}
              value={acc.effortLevel || ''}
              onChange={(e) => set({ effortLevel: e.target.value || null })}
            >
              {EFFORT_LEVELS.map((opt) => (
                <option key={opt.value || 'none'} value={opt.value || ''}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Divider />

      {/* 2. Suitability matrix */}
      <div>
        <h3 style={s.subheading}>Suitability</h3>
        <p style={s.subheadingHint}>
          For each group, mark whether the tour is a good fit. Rows you leave blank are hidden on the public page.
        </p>
        <div style={{ display: 'grid', gap: 6 }}>
          {SUITABILITY_ROWS.map((row) => (
            <SuitabilityRow
              key={row.key}
              label={row.label}
              value={acc.suitability[row.key]}
              onChange={(v) => setSuit(row.key, v)}
            />
          ))}
        </div>
      </div>

      <Divider />

      {/* 3. Physical requirements */}
      <div>
        <h3 style={s.subheading}>
          Physical requirements
          <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: colors.textMuted }}>
            {acc.requirements.length}
          </span>
        </h3>
        <p style={s.subheadingHint}>
          What guests must be able to do. Shown as a checklist on the public page.
        </p>
        {acc.requirements.length === 0 ? (
          <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>
            No requirements listed yet.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {acc.requirements.map((req, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr auto auto auto', gap: 6, alignItems: 'flex-start' }}>
                <select
                  style={s.input}
                  value={req.key || 'custom'}
                  onChange={(e) => onPresetChange(idx, e.target.value)}
                >
                  {REQUIREMENT_PRESETS.map((p) => (
                    <option key={p.key} value={p.key}>{p.key === 'custom' ? 'Custom…' : p.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  style={{ ...s.input, fontWeight: 600 }}
                  value={req.label || ''}
                  onChange={(e) => updateReq(idx, { label: e.target.value })}
                  placeholder="What guests must be able to do"
                />
                <input
                  type="text"
                  style={s.input}
                  value={req.detail || ''}
                  onChange={(e) => updateReq(idx, { detail: e.target.value })}
                  placeholder="Optional detail"
                />
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px' }} onClick={() => moveReq(idx, -1)} disabled={idx === 0}>↑</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px' }} onClick={() => moveReq(idx, 1)} disabled={idx === acc.requirements.length - 1}>↓</button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '6px 9px', color: colors.danger }} onClick={() => removeReq(idx)}>✕</button>
              </div>
            ))}
          </div>
        )}
        <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 12 }} onClick={addReq}>
          + Add requirement
        </button>
      </div>

      <Divider />

      {/* 4. Terrain */}
      <div>
        <h3 style={s.subheading}>Terrain</h3>
        <p style={s.subheadingHint}>One short sentence about the surfaces and gradients.</p>
        <textarea
          style={{ ...s.textarea, minHeight: 64 }}
          value={acc.terrain || ''}
          onChange={(e) => set({ terrain: e.target.value })}
          placeholder="e.g. Cobblestone streets through the old town; no steep climbs"
        />
      </div>

      {/* 5. Notes */}
      <div>
        <h3 style={s.subheading}>Additional notes</h3>
        <p style={s.subheadingHint}>Anything else a guest should know.</p>
        <textarea
          style={{ ...s.textarea, minHeight: 80 }}
          value={acc.notes || ''}
          onChange={(e) => set({ notes: e.target.value })}
          placeholder="e.g. Comfortable walking shoes strongly recommended."
        />
      </div>
    </div>
  )
}

function NumField({ label, value, onChange, step, hint }) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      <input
        type="number"
        step={step}
        style={s.input}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function SuitabilityRow({ label, value, onChange }) {
  const opts = [
    { v: 'yes',     glyph: '✓', tint: colors.success,    bg: colors.successSoft },
    { v: 'partial', glyph: '~', tint: colors.warning,    bg: colors.warningSoft },
    { v: 'no',      glyph: '✕', tint: colors.danger,     bg: colors.dangerSoft },
    { v: null,      glyph: '—', tint: colors.textMuted,  bg: colors.panelMuted },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '6px 0' }}>
      <div style={{ fontSize: 13.5, color: colors.text }}>{label}</div>
      <div style={{ display: 'flex', gap: 4 }}>
        {opts.map((opt) => {
          const active = value === opt.v
          return (
            <button
              key={String(opt.v)}
              type="button"
              onClick={() => onChange(opt.v)}
              title={opt.v || 'Clear'}
              style={{
                width: 32,
                height: 28,
                border: `1px solid ${active ? opt.tint : colors.border}`,
                backgroundColor: active ? opt.bg : '#fff',
                color: active ? opt.tint : colors.textMuted,
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {opt.glyph}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: colors.border }} />
}
