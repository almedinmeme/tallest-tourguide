import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_RAIL, NAV_PLACES, DEFAULT_PLACE_ID, NAV_TRUST } from '../../data/navigation'

// Desktop-only Destinations panel: a left rail of places; hovering/focusing a
// place swaps the middle column to its day tours + journeys and the photo
// column to its image. Rendered as a direct child of <nav> so it anchors to
// the full bar width — centering is done with flex, never translateX, because
// the .nav-dropdown keyframe ends in a transform that would override it.

function DestinationsMegaMenu({ width, onNavigate, onClose, onMouseEnter, onMouseLeave }) {
  const [activeId, setActiveId] = useState(DEFAULT_PLACE_ID)
  const active = NAV_PLACES.find((p) => p.id === activeId) || NAV_PLACES[0]
  const showPhoto = width >= 1024

  const tourCap = 5
  const visibleTours = active.dayTours.slice(0, tourCap)
  const moreTours = active.dayTours.length > tourCap
  const visibleJourneys = active.journeys.slice(0, tourCap)
  const journeysLabel = active.dayTours.length ? 'Journeys' : `Journeys through ${active.label}`

  return (
    <div
      style={styles.wrapper}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
    >
      <div className="nav-mega" style={styles.panel}>
        {/* minmax(0, 1fr): a plain 1fr's auto minimum would let a long tour
            title widen the middle column and push the photo column out of
            reach — this keeps it shrinkable so titles ellipsize instead. */}
        <div style={{ ...styles.grid, gridTemplateColumns: showPhoto ? '230px minmax(0, 1fr) 280px' : '230px minmax(0, 1fr)' }}>

          {/* Left rail — places */}
          <div style={styles.rail}>
            {NAV_RAIL.map((group, gi) => (
              <div key={group.group} style={{ marginTop: gi ? 14 : 0 }}>
                <span style={styles.groupLabel}>{group.group}</span>
                {group.items.map((place) => {
                  const isActive = place.id === active.id
                  return (
                    <Link
                      key={place.id}
                      to={place.href}
                      className="mega-rail-item"
                      style={{
                        ...styles.railItem,
                        color: isActive ? 'var(--color-forest-green)' : 'var(--color-n600)',
                        fontWeight: isActive ? 600 : 500,
                        boxShadow: isActive ? 'inset 2px 0 0 var(--color-forest-green)' : 'none',
                        backgroundColor: isActive ? 'var(--color-n100)' : 'transparent',
                      }}
                      onMouseEnter={() => setActiveId(place.id)}
                      onFocus={() => setActiveId(place.id)}
                      onClick={onNavigate}
                    >
                      {place.label}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Middle — the active place's tours & journeys */}
          <div style={styles.content}>
            <h3 style={styles.placeTitle}>{active.label}</h3>
            {active.blurb && <p style={styles.placeBlurb}>{active.blurb}</p>}

            {visibleTours.length > 0 && (
              <>
                <span style={{ ...styles.groupLabel, padding: '14px 0 2px' }}>Day tours</span>
                <div>
                  {visibleTours.map((t, i) => (
                    <Link key={t.slug} to={t.href} className="mega-row" style={{ ...styles.row, borderTop: i ? '1px solid var(--color-n200)' : 'none' }} onClick={onNavigate}>
                      <span className="mega-row-title" style={styles.rowTitle}>{t.title}</span>
                      <span style={styles.rowMeta}>{t.meta}</span>
                    </Link>
                  ))}
                </div>
                {moreTours && (
                  <Link to={active.href} style={styles.moreLink} onClick={onNavigate}>
                    All {active.label} day tours →
                  </Link>
                )}
              </>
            )}

            {visibleJourneys.length > 0 && (
              <>
                <span style={{ ...styles.groupLabel, padding: '14px 0 2px' }}>{journeysLabel}</span>
                <div>
                  {visibleJourneys.map((j, i) => (
                    <Link key={j.slug} to={j.href} className="mega-row" style={{ ...styles.row, borderTop: i ? '1px solid var(--color-n200)' : 'none' }} onClick={onNavigate}>
                      <span className="mega-row-title" style={styles.rowTitle}>{j.title}</span>
                      <span style={styles.rowMeta}>{j.meta}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {visibleTours.length === 0 && visibleJourneys.length === 0 && (
              <Link to="/consult" style={styles.moreLink} onClick={onNavigate}>
                Ask us about {active.label} →
              </Link>
            )}
          </div>

          {/* Photo column */}
          {showPhoto && (
            <div style={styles.photoCol}>
              <div style={styles.photoFrame}>
                {active.image && (
                  <img
                    key={active.id}
                    src={active.image}
                    alt={active.label}
                    loading="lazy"
                    decoding="async"
                    style={styles.photoImg}
                  />
                )}
              </div>
              <Link to={active.exploreHref} style={styles.exploreLink} onClick={onNavigate}>
                {active.exploreLabel} →
              </Link>
            </div>
          )}

          {/* Footer strip */}
          <div style={styles.footer}>
            <span style={styles.trust}>{NAV_TRUST}</span>
            <div style={styles.footerLinks}>
              <Link to="/destinations" style={styles.footerLink} onClick={onNavigate}>All destinations →</Link>
              <Link to="/contact" style={styles.footerLink} onClick={onNavigate}>Contact</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'absolute',
    // -17.5px lifts the panel so its top edge lines up with the regular
    // dropdowns, which anchor to their trigger (trigger bottom + 12px), not
    // to the bar's bottom edge like this full-width wrapper does.
    top: 'calc(100% - 17.5px)',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    // Hover bridge between the bar and the panel — keeps the menu open while
    // the cursor crosses the gap.
    paddingTop: '10px',
    zIndex: 200,
  },

  panel: {
    width: 'min(1040px, calc(100vw - 48px))',
    backgroundColor: 'var(--color-n000)',
    border: '1px solid var(--color-n200)',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
  },

  grid: {
    display: 'grid',
  },

  rail: {
    padding: '20px 16px 16px',
    borderRight: '1px solid var(--color-n200)',
  },

  railItem: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    lineHeight: 1.35,
  },

  content: {
    padding: '20px 28px 16px',
    minHeight: '300px',
  },

  placeTitle: {
    fontFamily: 'var(--font-hero)',
    fontSize: '24px',
    fontWeight: 500,
    color: 'var(--color-n900)',
    margin: 0,
    lineHeight: 1.2,
  },

  placeBlurb: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n500)',
    margin: '4px 0 0',
    lineHeight: 1.5,
  },

  groupLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '10px',
    color: 'var(--color-n500)',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    padding: '0 12px 4px',
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '16px',
    textDecoration: 'none',
    padding: '9px 8px',
    margin: '0 -8px',
    borderRadius: '8px',
  },

  rowTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-n900)',
    minWidth: 0,
  },

  rowMeta: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-n500)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  moreLink: {
    display: 'inline-block',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
    padding: '8px 4px 0',
  },

  photoCol: {
    padding: '20px 24px 16px',
    borderLeft: '1px solid var(--color-n200)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  photoFrame: {
    height: '240px',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'var(--color-n100)',
  },

  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  exploreLink: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },

  footer: {
    gridColumn: '1 / -1',
    borderTop: '1px solid var(--color-n200)',
    padding: '12px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },

  trust: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n500)',
  },

  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },

  footerLink: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },
}

export default DestinationsMegaMenu
