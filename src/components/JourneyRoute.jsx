import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

// Groups consecutive itinerary days by city into route stops.
// Day numbers follow the itinerary's index+1 convention.
function buildStops(days) {
  const stops = []
  days.forEach((day, i) => {
    const city = (day.city || '').trim()
    if (!city) return
    const prev = stops[stops.length - 1]
    if (prev && prev.city.toLowerCase() === city.toLowerCase()) {
      prev.endDay = i + 1
      if (!prev.photo && day.photo) prev.photo = day.photo
    } else {
      stops.push({ city, startDay: i + 1, endDay: i + 1, photo: day.photo || null })
    }
  })
  return stops
}

function dayLabel({ startDay, endDay }) {
  return startDay === endDay ? `Day ${startDay}` : `Days ${startDay}–${endDay}`
}

function routeSummary(stops, dayCount) {
  const start = stops[0].city
  const end = stops[stops.length - 1].city
  const trip = start.toLowerCase() === end.toLowerCase()
    ? `round trip from ${start}`
    : `${start} to ${end}`
  return `${stops.length} stops · ${dayCount} days · ${trip}`
}

// Circular stop photo with a graceful fallback: data may carry photo paths
// whose files don't exist, so the pin fallback reacts to the load error,
// not just a missing path.
function StopPhoto({ stop, size, radius }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = Boolean(stop.photo) && !failed

  return (
    <span
      className="route-disc"
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius,
        backgroundColor: '#EEF5F2',
        boxShadow: '0 0 0 1px rgba(46,125,94,0.18), 0 2px 8px rgba(0,0,0,0.10)',
        border: '3px solid #fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {showPhoto ? (
        <img
          src={stop.photo}
          alt=""
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setFailed(true)}
        />
      ) : (
        <MapPin size={Math.round(size * 0.36)} color="var(--color-forest-green)" strokeWidth={2} />
      )}
    </span>
  )
}

function OrderBadge({ number, size = 20 }) {
  return (
    <span
      style={{
        position: 'absolute',
        top: '-3px',
        right: '-3px',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--color-forest-green)',
        border: '2px solid #fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        fontWeight: '700',
        fontSize: '10px',
        color: '#fff',
        zIndex: 1,
      }}
    >
      {number}
    </span>
  )
}

function Caption({ kind }) {
  return (
    <span
      style={{
        marginTop: '7px',
        fontFamily: 'var(--font-body)',
        fontWeight: '700',
        fontSize: '9.5px',
        letterSpacing: '1.3px',
        textTransform: 'uppercase',
        color: kind === 'finish' ? 'var(--color-amber)' : 'var(--color-forest-green)',
      }}
    >
      {kind}
    </span>
  )
}

// ---- Desktop: serpentine trail map -----------------------------------------
// Stops sit on a dotted travel-map path that winds left-to-right, U-turns at
// the row edge, and continues right-to-left — so any number of stops fits the
// column without wrapping artifacts, and every stop keeps room for its label.

const DISC = 64
const LABEL_H = 70
const ROW_GAP = 30
const WOBBLE = 9
const TOP_PAD = 12

function trailLayout(stops, width) {
  const n = stops.length
  const perRow = Math.max(2, Math.min(5, Math.floor(width / 170)))
  const cols = Math.min(perRow, n)
  const colW = width / cols
  const rowH = DISC + LABEL_H + ROW_GAP

  const points = stops.map((_, i) => {
    const row = Math.floor(i / perRow)
    const col = i % perRow
    const displayCol = row % 2 === 0 ? col : perRow - 1 - col
    return {
      row,
      x: colW * displayCol + colW / 2,
      y: TOP_PAD + row * rowH + DISC / 2 + (i % 2 === 0 ? -WOBBLE : WOBBLE),
    }
  })

  const rows = Math.ceil(n / perRow)
  const height = TOP_PAD + rows * rowH - ROW_GAP + WOBBLE + 6
  return { points, colW, height }
}

function trailPath(points, colW) {
  const bulge = Math.min(64, colW * 0.4)
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1]
    const p1 = points[i]
    if (p0.row === p1.row) {
      const mx = (p0.x + p1.x) / 2
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`
    } else {
      const sign = p0.row % 2 === 0 ? 1 : -1
      d += ` C ${p0.x + sign * bulge} ${p0.y}, ${p1.x + sign * bulge} ${p1.y}, ${p1.x} ${p1.y}`
    }
  }
  return d
}

function TrailMap({ stops, onStopClick }) {
  const wrapRef = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const layout = width > 0 ? trailLayout(stops, width) : null

  return (
    <div ref={wrapRef} style={{ position: 'relative', minHeight: layout ? layout.height : 180 }}>
      {layout && (
        <>
          <svg
            width={width}
            height={layout.height}
            viewBox={`0 0 ${width} ${layout.height}`}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
          >
            <path
              d={trailPath(layout.points, layout.colW)}
              fill="none"
              stroke="var(--color-forest-green)"
              strokeOpacity="0.07"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d={trailPath(layout.points, layout.colW)}
              fill="none"
              stroke="var(--color-forest-green)"
              strokeOpacity="0.55"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray="0.5 10"
            />
          </svg>
          <ol aria-label="Trip route" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {stops.map((stop, i) => {
              const p = layout.points[i]
              const labelW = Math.min(layout.colW - 10, 160)
              const caption = i === 0 ? 'start' : i === stops.length - 1 ? 'finish' : null
              return (
                <li key={`${stop.city}-${stop.startDay}`}>
                  <button
                    type="button"
                    className="route-stop"
                    aria-label={`${stop.city}, ${dayLabel(stop)} — open in itinerary`}
                    onClick={() => onStopClick?.(stop.startDay)}
                    style={{
                      position: 'absolute',
                      left: p.x - labelW / 2,
                      top: p.y - DISC / 2,
                      width: labelW,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      font: 'inherit',
                    }}
                  >
                    <span style={{ position: 'relative', display: 'block' }}>
                      <StopPhoto stop={stop} size={DISC} radius="50%" />
                      <OrderBadge number={i + 1} />
                    </span>
                    {caption && <Caption kind={caption} />}
                    <span style={{ ...textStyles.city, marginTop: caption ? '3px' : '9px' }}>{stop.city}</span>
                    <span style={textStyles.dayPill}>{dayLabel(stop)}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </>
      )}
    </div>
  )
}

// ---- Mobile: vertical trail legend -----------------------------------------

function TrailList({ stops, onStopClick }) {
  const last = stops.length - 1
  return (
    <ol aria-label="Trip route" style={{ position: 'relative', listStyle: 'none', margin: 0, padding: 0 }}>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '24px',
          top: '30px',
          bottom: '30px',
          borderLeft: '2px dashed rgba(46,125,94,0.35)',
        }}
      />
      {stops.map((stop, i) => {
        const endpoint = i === 0 || i === last
        const caption = i === 0 ? 'Start' : i === last ? 'Finish' : null
        return (
          <li key={`${stop.city}-${stop.startDay}`} style={{ position: 'relative' }}>
            <button
              type="button"
              className="route-row"
              aria-label={`${stop.city}, ${dayLabel(stop)} — open in itinerary`}
              onClick={() => onStopClick?.(stop.startDay)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '13px',
                width: '100%',
                padding: '8px 8px 8px 10px',
                borderRadius: '12px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                font: 'inherit',
              }}
            >
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '30px',
                  height: '30px',
                  flexShrink: 0,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '700',
                  fontSize: '12px',
                  backgroundColor: endpoint ? 'var(--color-forest-green)' : '#fff',
                  border: '2px solid var(--color-forest-green)',
                  color: endpoint ? '#fff' : 'var(--color-forest-green)',
                }}
              >
                {i + 1}
              </span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                {caption && (
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: '700',
                      fontSize: '9px',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: i === last ? 'var(--color-amber)' : 'var(--color-forest-green)',
                      marginBottom: '2px',
                    }}
                  >
                    {caption}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: '600',
                    fontSize: '14.5px',
                    lineHeight: '1.3',
                    color: 'var(--color-n900)',
                  }}
                >
                  {stop.city}
                </span>
                <span
                  style={{
                    marginTop: '2px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '600',
                    fontSize: '11px',
                    letterSpacing: '0.3px',
                    color: 'var(--color-forest-green)',
                  }}
                >
                  {dayLabel(stop)}
                </span>
              </span>
              <StopPhoto stop={stop} size={50} radius="12px" />
            </button>
          </li>
        )
      })}
    </ol>
  )
}

// Route infographic derived from the itinerary — a serpentine trail map on
// desktop, a vertical trail legend on mobile. Stops open their itinerary day.
// Renders nothing for single-city trips, where a route carries no information.
function JourneyRoute({ days, isMobile, onStopClick }) {
  const stops = useMemo(() => buildStops(days || []), [days])
  if (stops.length < 2) return null

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>The route</h2>
      <p style={styles.sectionSubtitle}>{routeSummary(stops, days.length)}</p>
      {isMobile
        ? <TrailList stops={stops} onStopClick={onStopClick} />
        : <TrailMap stops={stops} onStopClick={onStopClick} />}
    </div>
  )
}

const textStyles = {
  city: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '13.5px',
    lineHeight: '1.3',
    color: 'var(--color-n900)',
    textAlign: 'center',
  },

  dayPill: {
    marginTop: '6px',
    padding: '3px 9px',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: 'rgba(46,125,94,0.08)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '10.5px',
    letterSpacing: '0.3px',
    color: 'var(--color-forest-green)',
    textAlign: 'center',
  },
}

const styles = {
  section: {
    paddingBottom: '36px',
    marginBottom: '36px',
    borderBottom: '1px solid var(--color-n300)',
  },

  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '8px',
  },

  sectionSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    marginBottom: '20px',
  },
}

export default JourneyRoute
