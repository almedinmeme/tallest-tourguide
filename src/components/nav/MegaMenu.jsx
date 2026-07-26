import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { railPlaces, NAV_TRUST } from '../../data/navigation'
import { useCurrency } from '../../context/CurrencyContext'

// Desktop-only mega panel shared by the Day Tours and Journeys menus: a left
// rail of items; hovering/focusing one swaps the middle column to its day
// tours + journeys and the photo column to its image. Rendered as a direct
// child of <nav> so it anchors to the full bar width — centering is done with
// flex, never translateX, because the .nav-dropdown keyframe ends in a
// transform that would override it.

function MegaMenu({ rail, defaultId, footerLinks = [], label, width, onNavigate, onClose, onMouseEnter, onMouseLeave }) {
  const { format } = useCurrency()
  const places = railPlaces(rail)
  const [activeId, setActiveId] = useState(defaultId)
  const active = places.find((p) => p.id === activeId) || places[0]
  const showPhoto = width >= 1024

  const rowCap = 5
  // "Full day · from €85" — meta is currency-agnostic, price formats live.
  const rowMeta = (r) => (r.price != null ? `${r.meta} · from ${format(r.price)}` : r.meta)

  return (
    <div
      style={styles.wrapper}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
    >
      <div className="nav-mega" style={styles.panel} role="region" aria-label={label}>
        {/* minmax(0, 1fr): a plain 1fr's auto minimum would let a long tour
            title widen the middle column and push the photo column out of
            reach — this keeps it shrinkable so titles ellipsize instead. */}
        <div style={{ ...styles.grid, gridTemplateColumns: showPhoto ? '230px minmax(0, 1fr) 280px' : '230px minmax(0, 1fr)' }}>

          {/* Left rail */}
          <div style={styles.rail}>
            {rail.map((group, gi) => (
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
                        ...(place.icon ? styles.railItemWithIcon : {}),
                        color: isActive ? 'var(--color-forest-green)' : 'var(--color-n600)',
                        fontWeight: isActive ? 600 : 500,
                        boxShadow: isActive ? 'inset 2px 0 0 var(--color-forest-green)' : 'none',
                        backgroundColor: isActive ? 'var(--color-n100)' : 'transparent',
                      }}
                      onMouseEnter={() => setActiveId(place.id)}
                      onFocus={() => setActiveId(place.id)}
                      onClick={onNavigate}
                    >
                      {place.icon === 'sparkles' && <Sparkles size={13} color="var(--color-amber)" style={{ flexShrink: 0 }} />}
                      {place.label}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Middle — every item's tours & journeys, stacked in one grid
              cell. Inactive layers are visibility:hidden but still size the
              cell, so the panel holds the height of the most populated item
              instead of jumping as the hover moves down the rail. */}
          <div style={styles.content}>
            {places.map((place) => {
              const isActive = place.id === active.id
              const visibleTours = place.dayTours.slice(0, rowCap)
              const moreTours = place.dayTours.length > rowCap
              const visibleJourneys = place.journeys.slice(0, rowCap)
              const moreJourneys = place.journeys.length > rowCap
              const journeysLabel =
                place.journeysLabel || (place.dayTours.length ? 'Journeys' : `Journeys through ${place.label}`)

              return (
                <div key={place.id} style={{ gridArea: '1 / 1', visibility: isActive ? 'visible' : 'hidden' }}>
                  <h3 style={styles.placeTitle}>{place.label}</h3>
                  {place.blurb && <p style={styles.placeBlurb}>{place.blurb}</p>}

                  {visibleTours.length > 0 && (
                    <>
                      {/* Count only when capped — it signals there's more than shown. */}
                      <span style={{ ...styles.groupLabel, padding: '14px 0 2px' }}>
                        {moreTours ? `${place.dayTours.length} day tours` : 'Day tours'}
                      </span>
                      <div>
                        {visibleTours.map((t, i) => (
                          <Link key={t.slug} to={t.href} className="mega-row" style={{ ...styles.row, borderTop: i ? '1px solid var(--color-n200)' : 'none' }} onClick={onNavigate}>
                            <span className="mega-row-title" style={styles.rowTitle}>{t.title}</span>
                            <span style={styles.rowMeta}>{rowMeta(t)}</span>
                          </Link>
                        ))}
                      </div>
                      {moreTours && (
                        <Link to={place.href} style={styles.moreLink} onClick={onNavigate}>
                          +{place.dayTours.length - rowCap} more →
                        </Link>
                      )}
                    </>
                  )}

                  {visibleJourneys.length > 0 && (
                    <>
                      <span style={{ ...styles.groupLabel, padding: '14px 0 2px' }}>
                        {moreJourneys ? `${place.journeys.length} ${journeysLabel.toLowerCase()}` : journeysLabel}
                      </span>
                      <div>
                        {visibleJourneys.map((j, i) => (
                          <Link key={j.slug} to={j.href} className="mega-row" style={{ ...styles.row, borderTop: i ? '1px solid var(--color-n200)' : 'none' }} onClick={onNavigate}>
                            <span className="mega-row-title" style={styles.rowTitle}>{j.title}</span>
                            <span style={styles.rowMeta}>{rowMeta(j)}</span>
                          </Link>
                        ))}
                      </div>
                      {moreJourneys && (
                        <Link to={place.href} style={styles.moreLink} onClick={onNavigate}>
                          +{place.journeys.length - rowCap} more →
                        </Link>
                      )}
                    </>
                  )}

                  {visibleTours.length === 0 && visibleJourneys.length === 0 && (
                    <>
                      {(place.details || []).map((d, i) => (
                        <p key={d} style={{ ...styles.detailRow, borderTop: i ? '1px solid var(--color-n200)' : 'none', marginTop: i ? 0 : 14 }}>
                          {d}
                        </p>
                      ))}
                      {place.cta ? (
                        <Link to={place.cta.href} style={styles.moreLink} onClick={onNavigate}>
                          {place.cta.label} →
                        </Link>
                      ) : (
                        <Link to="/consult" style={styles.moreLink} onClick={onNavigate}>
                          Ask us about {place.label} →
                        </Link>
                      )}
                    </>
                  )}
                </div>
              )
            })}
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
              {footerLinks.map((l) => (
                <Link key={l.href} to={l.href} style={styles.footerLink} onClick={onNavigate}>{l.label}</Link>
              ))}
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

  railItemWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  // A grid so the stacked place layers share one cell (gridArea 1/1) and the
  // tallest one sets the column height.
  content: {
    display: 'grid',
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

  // Quiet explainer rows for items with no list (Personalised Journey).
  detailRow: {
    fontFamily: 'var(--font-body)',
    fontSize: '13.5px',
    color: 'var(--color-n700)',
    lineHeight: 1.5,
    margin: 0,
    padding: '10px 0',
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

export default MegaMenu
