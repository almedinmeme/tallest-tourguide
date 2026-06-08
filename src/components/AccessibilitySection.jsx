import {
  Footprints, Car, Clock, Mountain, Accessibility, Baby, Heart, PawPrint,
  Users, BabyIcon, Check, Minus, X, CircleAlert,
} from 'lucide-react'

// Renders the unified accessibility block for tours AND packages.
// Designed to gracefully hide every individual field when it's null/empty,
// so a half-filled tour still looks intentional.

const SUITABILITY_LABELS = {
  wheelchair:    { label: 'Wheelchair accessible', Icon: Accessibility },
  stroller:      { label: 'Stroller-friendly',     Icon: BabyIcon || Baby },
  smallChildren: { label: 'Small children (0–5)',  Icon: Baby },
  children:      { label: 'Children (6–12)',       Icon: Users },
  pregnancy:     { label: 'During pregnancy',      Icon: Heart },
  seniors:       { label: 'Seniors (65+)',         Icon: Users },
  pets:          { label: 'Pet-friendly',          Icon: PawPrint },
}

const STATUS_STYLE = {
  yes:     { label: 'Yes',     color: '#0f7a4a', bg: 'rgba(15,122,74,0.10)',  border: 'rgba(15,122,74,0.30)',  Icon: Check },
  partial: { label: 'Partial', color: '#a16207', bg: 'rgba(161,98,7,0.10)',   border: 'rgba(161,98,7,0.28)',   Icon: CircleAlert },
  no:      { label: 'No',      color: '#b8332a', bg: 'rgba(184,51,42,0.10)',  border: 'rgba(184,51,42,0.28)',  Icon: X },
}

const EFFORT_DESCRIPTIONS = {
  low:      'A relaxed pace, suitable for most fitness levels.',
  moderate: 'Some walking and standing; a reasonable base level of fitness is helpful.',
  high:     'Significant physical activity; arrive well-rested and prepared.',
  extreme:  'Demanding effort — for confident, experienced active travellers.',
}

const EFFORT_INDEX = { low: 0, moderate: 1, high: 2, extreme: 3 }
const EFFORT_LABELS = ['Easy', 'Moderate', 'Hard', 'Extreme']
const EFFORT_COLORS = ['#0f7a4a', '#0f7a4a', '#c98a2b', '#b8332a']

function hasContent(acc) {
  if (!acc) return false
  const numericKeys = [
    'walkingDistanceKm', 'drivingDistanceKm',
    'walkingDurationMin', 'drivingDurationMin', 'durationMin',
    'elevationGainM',
  ]
  if (numericKeys.some((k) => typeof acc[k] === 'number')) return true
  if (acc.effortLevel) return true
  if (Array.isArray(acc.requirements) && acc.requirements.length) return true
  if ((acc.terrain || '').trim() || (acc.notes || '').trim()) return true
  if (acc.suitability && Object.values(acc.suitability).some((v) => v)) return true
  return false
}

function fmtMin(min) {
  if (!Number.isFinite(min)) return null
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m} m` : `${h} h`
}

export default function AccessibilitySection({ accessibility, id = 'accessibility' }) {
  const acc = accessibility
  if (!hasContent(acc)) return null

  const stats = []
  if (Number.isFinite(acc.walkingDistanceKm) && acc.walkingDistanceKm > 0) {
    stats.push({ Icon: Footprints, value: `≈ ${acc.walkingDistanceKm} km`, label: 'Walking distance', approx: true })
  }
  if (Number.isFinite(acc.drivingDistanceKm) && acc.drivingDistanceKm > 0) {
    stats.push({ Icon: Car, value: `${acc.drivingDistanceKm} km`, label: 'Driving distance' })
  }
  if (Number.isFinite(acc.walkingDurationMin) && acc.walkingDurationMin > 0) {
    stats.push({ Icon: Footprints, value: fmtMin(acc.walkingDurationMin), label: 'Walking time' })
  }
  if (Number.isFinite(acc.drivingDurationMin) && acc.drivingDurationMin > 0) {
    stats.push({ Icon: Car, value: fmtMin(acc.drivingDurationMin), label: 'Driving time' })
  }
  if (Number.isFinite(acc.durationMin) && acc.durationMin > 0) {
    stats.push({ Icon: Clock, value: fmtMin(acc.durationMin), label: 'Total duration' })
  }
  if (Number.isFinite(acc.elevationGainM) && acc.elevationGainM > 0) {
    stats.push({ Icon: Mountain, value: `${acc.elevationGainM} m`, label: 'Elevation gain' })
  }

  const suitabilityEntries = Object.entries(acc.suitability || {})
    .filter(([, v]) => v === 'yes' || v === 'partial' || v === 'no')

  const requirements = Array.isArray(acc.requirements) ? acc.requirements.filter((r) => (r.label || '').trim()) : []
  const showEffort = !!acc.effortLevel && EFFORT_DESCRIPTIONS[acc.effortLevel]

  return (
    <section id={id} style={styles.section}>
      <div style={styles.inner}>
        <span style={styles.eyebrow}>Plan your visit</span>
        <h2 style={styles.heading}>Accessibility & Suitability</h2>
        <p style={styles.lede}>
          What to expect physically, and who this experience suits best.
        </p>

        {stats.length > 0 && (
          <div style={styles.statsRow}>
            {stats.map((stat) => (
              <div key={stat.label} style={styles.statCard}>
                <stat.Icon size={20} color="var(--color-forest-green)" />
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}{stat.approx ? ' · approx.' : ''}</div>
              </div>
            ))}
          </div>
        )}

        {showEffort && (
          <div style={styles.effortWrap}>
            <div style={styles.effortHeader}>
              <span style={styles.effortLabel}>Overall effort</span>
              <span style={{ ...styles.effortBadge, color: EFFORT_COLORS[EFFORT_INDEX[acc.effortLevel]] }}>
                {EFFORT_LABELS[EFFORT_INDEX[acc.effortLevel]]}
              </span>
            </div>
            <div style={styles.effortBar}>
              {EFFORT_LABELS.map((label, i) => {
                const active = i <= EFFORT_INDEX[acc.effortLevel]
                return (
                  <div
                    key={label}
                    style={{
                      ...styles.effortSegment,
                      backgroundColor: active ? EFFORT_COLORS[EFFORT_INDEX[acc.effortLevel]] : 'rgba(0,0,0,0.06)',
                    }}
                    title={label}
                  />
                )
              })}
            </div>
            <p style={styles.effortDesc}>{EFFORT_DESCRIPTIONS[acc.effortLevel]}</p>
          </div>
        )}

        {suitabilityEntries.length > 0 && (
          <div style={styles.subBlock}>
            <h3 style={styles.subHeading}>Is this for you?</h3>
            <div style={styles.suitabilityGrid}>
              {suitabilityEntries.map(([key, status]) => {
                const info = SUITABILITY_LABELS[key]
                if (!info) return null
                const st = STATUS_STYLE[status]
                return (
                  <div key={key} style={styles.suitabilityCell}>
                    <div style={styles.suitabilityIconWrap}>
                      <info.Icon size={18} color="var(--color-forest-green)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={styles.suitabilityLabel}>{info.label}</div>
                    </div>
                    <span
                      style={{
                        ...styles.statusPill,
                        color: st.color,
                        backgroundColor: st.bg,
                        borderColor: st.border,
                      }}
                    >
                      <st.Icon size={11} strokeWidth={3} />
                      {st.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {requirements.length > 0 && (
          <div style={styles.subBlock}>
            <h3 style={styles.subHeading}>You should be able to</h3>
            <ul style={styles.reqList}>
              {requirements.map((req, idx) => (
                <li key={idx} style={styles.reqItem}>
                  <span style={styles.reqCheck}>
                    <Check size={14} color="var(--color-forest-green)" strokeWidth={3} />
                  </span>
                  <div>
                    <div style={styles.reqLabel}>{req.label}</div>
                    {req.detail && <div style={styles.reqDetail}>{req.detail}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(acc.terrain || acc.notes) && (
          <div style={styles.subBlock}>
            {acc.terrain && (
              <div style={styles.proseBlock}>
                <h3 style={styles.subHeading}>Terrain</h3>
                <p style={styles.proseText}>{acc.terrain}</p>
              </div>
            )}
            {acc.notes && (
              <div style={{ ...styles.proseBlock, marginTop: acc.terrain ? '20px' : 0 }}>
                <h3 style={styles.subHeading}>Good to know</h3>
                <p style={styles.proseText}>{acc.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

const styles = {
  // Designed to sit inside the existing contentCard wrapper alongside other
  // sections — no own background, modest vertical rhythm.
  section: {
    padding: '40px 0 8px',
    scrollMarginTop: '120px',
  },
  inner: {
    margin: 0,
  },
  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '11px',
    color: 'var(--color-forest-green)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n900)',
    margin: '0 0 6px',
    letterSpacing: '-0.4px',
  },
  lede: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: '0 0 28px',
    maxWidth: '620px',
  },

  // Stats
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '36px',
  },
  statCard: {
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n200)',
    borderRadius: '12px',
    padding: '18px 18px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '22px',
    color: 'var(--color-n900)',
    letterSpacing: '-0.3px',
    lineHeight: 1.1,
  },
  statLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
    fontWeight: 500,
  },

  // Effort
  effortWrap: {
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n200)',
    borderRadius: '12px',
    padding: '20px 22px',
    marginBottom: '36px',
  },
  effortHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  effortLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '11px',
    color: 'var(--color-n600)',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  effortBadge: {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '13px',
  },
  effortBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '4px',
    marginBottom: '10px',
  },
  effortSegment: {
    height: '8px',
    borderRadius: '4px',
    transition: 'background-color 200ms ease',
  },
  effortDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
    margin: 0,
    lineHeight: 1.5,
  },

  // Sub-blocks
  subBlock: {
    marginBottom: '32px',
  },
  subHeading: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '17px',
    color: 'var(--color-n900)',
    margin: '0 0 14px',
    letterSpacing: '-0.1px',
  },

  // Suitability grid
  suitabilityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '10px',
  },
  suitabilityCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n200)',
    borderRadius: '10px',
  },
  suitabilityIconWrap: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'rgba(46,125,94,0.10)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  suitabilityLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '13.5px',
    fontWeight: 500,
    color: 'var(--color-n900)',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 9px',
    fontSize: '11.5px',
    fontWeight: 700,
    borderRadius: '999px',
    border: '1px solid',
    flexShrink: 0,
  },

  // Requirements
  reqList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '12px',
  },
  reqItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  reqCheck: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(46,125,94,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '1px',
  },
  reqLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    fontWeight: 600,
    color: 'var(--color-n900)',
    lineHeight: 1.4,
  },
  reqDetail: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
    marginTop: '2px',
    lineHeight: 1.5,
  },

  // Prose
  proseBlock: {},
  proseText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n700)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
    whiteSpace: 'pre-line',
  },
}
