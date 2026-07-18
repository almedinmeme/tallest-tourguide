import { useMemo, useState } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'

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

// Height reserved above every node so the Start/Finish captions on the
// endpoints don't push their circles out of line with the connectors.
const CAPTION_H = 18

// Circular stop marker: the day's photo when it actually loads, otherwise a
// soft green disc with a map pin. Data may carry photo paths whose files
// don't exist, so the fallback reacts to the load error, not just a missing
// path. The order badge stays on in both states.
function StopDisc({ stop, number, size }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = Boolean(stop.photo) && !failed

  return (
    <div style={{ ...styles.disc, width: size, height: size }}>
      {showPhoto ? (
        <img
          src={stop.photo}
          alt={stop.city}
          loading="lazy"
          style={styles.photo}
          onError={() => setFailed(true)}
        />
      ) : (
        <MapPin size={Math.round(size * 0.34)} color="var(--color-forest-green)" strokeWidth={2} />
      )}
      <span style={styles.orderBadge}>{number}</span>
    </div>
  )
}

// Static route infographic derived from the itinerary — replaces the
// interactive map on multi-day journeys. Renders nothing for single-city
// trips, where a route diagram carries no information.
function JourneyRoute({ days, isMobile }) {
  const stops = useMemo(() => buildStops(days || []), [days])
  if (stops.length < 2) return null

  const discSize = isMobile ? 56 : 68
  const nodeWidth = isMobile ? 88 : 108

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>The route</h2>
      <p style={styles.sectionSubtitle}>
        {stops.length} stops over {days.length} days
      </p>
      <ol style={styles.strip} aria-label="Trip route">
        {stops.map((stop, i) => {
          const caption = i === 0 ? 'Start' : i === stops.length - 1 ? 'Finish' : ''
          return (
            <li
              key={`${stop.city}-${stop.startDay}`}
              style={{ ...styles.stopItem, flex: i > 0 ? '1 1 auto' : '0 0 auto' }}
            >
              {i > 0 && (
                <div aria-hidden="true" style={{ ...styles.connector, height: discSize, marginTop: CAPTION_H }}>
                  <span style={styles.connectorLine} />
                  <ArrowRight size={15} color="var(--color-forest-green)" strokeWidth={2.5} style={{ flexShrink: 0, margin: '0 2px' }} />
                  <span style={styles.connectorLine} />
                </div>
              )}
              <div style={{ ...styles.node, width: nodeWidth }}>
                <span style={styles.caption}>{caption}</span>
                <StopDisc stop={stop} number={i + 1} size={discSize} />
                <span style={styles.cityName}>{stop.city}</span>
                <span style={styles.dayRange}>{dayLabel(stop)}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
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
    marginBottom: '16px',
  },

  strip: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    rowGap: '24px',
    listStyle: 'none',
    margin: '4px 0 0',
    padding: 0,
  },

  stopItem: {
    display: 'flex',
    alignItems: 'flex-start',
    minWidth: 0,
  },

  connector: {
    flex: '1 1 30px',
    minWidth: '26px',
    display: 'flex',
    alignItems: 'center',
  },

  connectorLine: {
    flex: 1,
    borderTop: '2px dashed rgba(46,125,94,0.35)',
  },

  node: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
  },

  caption: {
    height: `${CAPTION_H}px`,
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '9.5px',
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    color: 'var(--color-n400)',
  },

  disc: {
    position: 'relative',
    borderRadius: '50%',
    backgroundColor: 'rgba(46,125,94,0.08)',
    boxShadow: '0 0 0 1px rgba(46,125,94,0.18), 0 2px 8px rgba(0,0,0,0.10)',
    border: '3px solid #fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  photo: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },

  orderBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '20px',
    height: '20px',
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
  },

  cityName: {
    marginTop: '10px',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '13px',
    lineHeight: '1.3',
    color: 'var(--color-n900)',
    textAlign: 'center',
  },

  dayRange: {
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

export default JourneyRoute
