import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Search, X, Map, CalendarDays, BookOpen, Info, Sparkles, Compass } from 'lucide-react'
import { useBlog } from '../../hooks/useBlog'
import tours from '../../data/tours'
import { NAV_RAIL, searchPackageLinks, discoverLinks } from '../../data/navigation'
import { SearchGroup, SearchResult } from './SearchResults'

function match(query, ...fields) {
  const q = query.toLowerCase()
  return fields.some((f) => f && f.toLowerCase().includes(q))
}

// Mobile bottom-sheet navigation: search, an accordion of places (each
// expanding to its day tours + journeys, mirroring the desktop mega-menu),
// the top-level browse links, Discover pages, and the Plan Your Trip CTA.
function MobileNavSheet({ open, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { posts } = useBlog()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [balkansOpen, setBalkansOpen] = useState(false)
  const [discoverOpen, setDiscoverOpen] = useState(false)

  // Self-close on route change so taps on links always dismiss the sheet.
  useEffect(() => {
    setExpandedId(null)
    setBalkansOpen(false)
    setDiscoverOpen(false)
    setSearchQuery('')
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search])

  const q = searchQuery.trim()
  const tourResults = q ? tours.filter((t) => match(q, t.title, t.badge, t.duration)).slice(0, 4) : []
  const packageResults = q ? searchPackageLinks.filter((p) => match(q, p.name, p.meta)).slice(0, 4) : []
  const blogResults = q ? posts.filter((p) => match(q, p.title, p.excerpt, p.category)).slice(0, 3) : []
  const hasResults = tourResults.length + packageResults.length + blogResults.length > 0

  const handleSearchKey = (e) => {
    if (e.key === 'Escape') { setSearchFocused(false); setSearchQuery('') }
    if (e.key === 'Enter' && q) {
      navigate(`/tours?search=${encodeURIComponent(q)}`)
      onClose()
    }
  }

  const handleLinkClick = () => {
    setSearchQuery('')
    onClose()
  }

  const sheetLinkStyle = (active) => ({
    fontFamily: 'var(--font-body)',
    fontWeight: active ? '700' : '500',
    fontSize: '17px',
    textDecoration: 'none',
    padding: '13px 16px',
    margin: '0 8px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: active ? 'var(--color-forest-green)' : 'var(--color-n700)',
    backgroundColor: active ? 'rgba(46,125,94,0.08)' : 'transparent',
  })

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 198,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--color-n000)',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        zIndex: 199,
        maxHeight: '85vh',
        overflowY: 'auto',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: open ? 'auto' : 'none',
        paddingBottom: '32px',
      }}>

        {/* Handle pill */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--color-n300)' }} />
        </div>

        {/* Search */}
        <div style={{
          ...styles.searchRow,
          borderColor: searchFocused ? 'var(--color-forest-green)' : 'var(--color-n300)',
          boxShadow: searchFocused ? '0 0 0 3px rgba(46,125,94,0.12)' : 'none',
        }}>
          <Search size={16} color={searchFocused ? 'var(--color-forest-green)' : 'var(--color-n600)'} style={{ flexShrink: 0, transition: 'color 0.15s' }} />
          <input
            type="text"
            placeholder="Search tours, packages…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchFocused(true) }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={handleSearchKey}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button style={styles.searchClearBtn} onClick={() => { setSearchQuery(''); setSearchFocused(false) }} aria-label="Clear">
              <X size={13} color="var(--color-n600)" />
            </button>
          )}
        </div>

        <div style={styles.divider} />

        {/* Search results or nav links */}
        {q ? (
          <div style={styles.searchResults}>
            {!hasResults && (
              <p style={styles.noResults}>
                No results for "<strong>{q}</strong>" — try a tour name, destination, or activity.
              </p>
            )}
            {tourResults.length > 0 && (
              <SearchGroup label="Tours">
                {tourResults.map((t) => (
                  <SearchResult key={t.id} to={`/tours/${t.slug}`} title={t.title} meta={`${t.duration} · €${t.price}`} onClick={handleLinkClick} />
                ))}
              </SearchGroup>
            )}
            {packageResults.length > 0 && (
              <SearchGroup label="Multi-day tours">
                {packageResults.map((p) => (
                  <SearchResult key={p.slug} to={p.href} title={p.name} meta={p.meta} onClick={handleLinkClick} />
                ))}
              </SearchGroup>
            )}
            {blogResults.length > 0 && (
              <SearchGroup label="The Journal">
                {blogResults.map((p) => (
                  <SearchResult key={p.id} to={`/journal/${p.slug}`} title={p.title} meta={p.category || 'Journal'} onClick={handleLinkClick} />
                ))}
              </SearchGroup>
            )}
          </div>
        ) : (
          <div style={styles.nav}>

            {/* Places accordion — mirrors the desktop mega-menu. The wider
                Balkan destinations sit behind their own dropdown so the core
                Bosnia places stay front and centre without a long list. */}
            {NAV_RAIL.map((group) => {
              const isBalkans = group.group === 'Across the Balkans'
              const places = group.items.map((place) => (
                <PlaceAccordion
                  key={place.id}
                  place={place}
                  expanded={expandedId === place.id}
                  onToggle={() => setExpandedId(expandedId === place.id ? null : place.id)}
                  onLinkClick={handleLinkClick}
                  linkStyle={sheetLinkStyle}
                  indent={isBalkans}
                />
              ))
              if (!isBalkans) {
                return (
                  <div key={group.group}>
                    <span style={styles.groupLabel}>{group.group}</span>
                    {places}
                  </div>
                )
              }
              // Its own section, separated from the Bosnia group so it reads
              // as a sibling — not another Bosnian place.
              return (
                <div key={group.group}>
                  <div style={styles.divider} />
                  <span style={styles.groupLabel}>Beyond Bosnia</span>
                  <button
                    style={{ ...sheetLinkStyle(balkansOpen), width: 'calc(100% - 16px)', border: 'none', background: balkansOpen ? 'rgba(46,125,94,0.08)' : 'transparent', cursor: 'pointer', justifyContent: 'space-between', textAlign: 'left' }}
                    onClick={() => setBalkansOpen((o) => !o)}
                    aria-expanded={balkansOpen}
                    aria-controls="acc-balkans"
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Compass size={16} style={{ flexShrink: 0 }} />
                      Across the Balkans
                    </span>
                    <ChevronDown size={16} style={{ flexShrink: 0, transform: balkansOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform var(--t-fast)' }} />
                  </button>
                  {balkansOpen && <div id="acc-balkans">{places}</div>}
                </div>
              )
            })}

            <div style={styles.divider} />
            <span style={styles.groupLabel}>Browse</span>
            <Link to="/tours" style={sheetLinkStyle(location.pathname.startsWith('/tours'))} onClick={handleLinkClick}>
              <Map size={16} style={{ flexShrink: 0 }} />
              All day tours
            </Link>
            <Link to="/multi-day-tours" style={sheetLinkStyle(location.pathname.startsWith('/multi-day-tours') || location.pathname.startsWith('/packages') || location.pathname === '/personalised')} onClick={handleLinkClick}>
              <CalendarDays size={16} style={{ flexShrink: 0 }} />
              Journeys
            </Link>
            <Link to="/journal" style={sheetLinkStyle(location.pathname.startsWith('/journal'))} onClick={handleLinkClick}>
              <BookOpen size={16} style={{ flexShrink: 0 }} />
              The Journal
            </Link>

            <div style={styles.divider} />
            {/* Collapsed by default — the sheet was getting too long. */}
            <button
              style={{ ...sheetLinkStyle(discoverOpen), width: 'calc(100% - 16px)', border: 'none', background: discoverOpen ? 'rgba(46,125,94,0.08)' : 'transparent', cursor: 'pointer', justifyContent: 'space-between', textAlign: 'left' }}
              onClick={() => setDiscoverOpen((o) => !o)}
              aria-expanded={discoverOpen}
              aria-controls="acc-discover"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Info size={16} style={{ flexShrink: 0 }} />
                Discover
              </span>
              <ChevronDown size={16} style={{ flexShrink: 0, transform: discoverOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform var(--t-fast)' }} />
            </button>
            {discoverOpen && (
              <div id="acc-discover" style={{ paddingLeft: '14px' }}>
                {discoverLinks.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    style={{ ...sheetLinkStyle(location.pathname === item.href), fontSize: '16px', padding: '11px 16px' }}
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <div style={{ padding: '16px 12px 0' }}>
              {/* Free questionnaire, not the €90 consult — see Navbar note. */}
              <Link to="/personalised" style={styles.ctaBtn} onClick={handleLinkClick}>
                <Sparkles size={16} style={{ flexShrink: 0 }} />
                Plan Your Trip
              </Link>
              <Link to="/contact" style={styles.contactAlt} onClick={handleLinkClick}>
                or contact us →
              </Link>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

// One expandable place row (day tours + journeys + explore link) — used for
// the Bosnia cities at the top level and, indented, inside "Across the
// Balkans".
function PlaceAccordion({ place, expanded, onToggle, onLinkClick, linkStyle, indent = false }) {
  return (
    <div style={indent ? { paddingLeft: '14px' } : undefined}>
      <button
        style={{ ...linkStyle(expanded), width: indent ? 'calc(100% - 30px)' : 'calc(100% - 16px)', border: 'none', background: expanded ? 'rgba(46,125,94,0.08)' : 'transparent', cursor: 'pointer', justifyContent: 'space-between', textAlign: 'left', ...(indent ? { fontSize: '16px', padding: '11px 16px' } : {}) }}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`acc-${place.id}`}
      >
        {place.label}
        <ChevronDown size={16} style={{ flexShrink: 0, transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform var(--t-fast)' }} />
      </button>
      {expanded && (
        <div id={`acc-${place.id}`} className="sheet-acc-panel" style={styles.accPanel}>
          {place.dayTours.length > 0 && (
            <>
              <span style={styles.accLabel}>Day tours</span>
              {place.dayTours.slice(0, 4).map((t, i) => (
                <Link key={t.slug} to={t.href} style={{ ...styles.accRow, borderTop: i ? '1px solid var(--color-n200)' : 'none' }} onClick={onLinkClick}>
                  <span style={styles.accRowTitle}>{t.title}</span>
                  <span style={styles.accRowMeta}>{t.meta}</span>
                </Link>
              ))}
            </>
          )}
          {place.journeys.length > 0 && (
            <>
              <span style={styles.accLabel}>{place.dayTours.length ? 'Journeys' : `Journeys through ${place.label}`}</span>
              {place.journeys.slice(0, 3).map((j, i) => (
                <Link key={j.slug} to={j.href} style={{ ...styles.accRow, borderTop: i ? '1px solid var(--color-n200)' : 'none' }} onClick={onLinkClick}>
                  <span style={styles.accRowTitle}>{j.title}</span>
                  <span style={styles.accRowMeta}>{j.meta}</span>
                </Link>
              ))}
            </>
          )}
          <Link to={place.exploreHref} style={styles.accExplore} onClick={onLinkClick}>
            {place.exploreLabel} →
          </Link>
        </div>
      )}
    </div>
  )
}

const styles = {
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'var(--color-n000)',
    border: '1.5px solid var(--color-n300)',
    borderRadius: '12px',
    padding: '12px 16px',
    margin: '16px 20px 12px',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },

  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--color-n900)',
    minWidth: 0,
  },

  searchClearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },

  searchResults: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '8px',
  },

  noResults: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    padding: '24px 20px',
    margin: 0,
    lineHeight: '1.6',
  },

  divider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    margin: '4px 0',
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 4px',
  },

  groupLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'var(--color-n500)',
    padding: '12px 20px 4px',
    display: 'block',
  },

  accPanel: {
    padding: '2px 24px 10px 28px',
  },

  accLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    color: 'var(--color-n500)',
    padding: '10px 0 2px',
  },

  accRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '12px',
    textDecoration: 'none',
    padding: '9px 0',
  },

  accRowTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    fontWeight: 500,
    color: 'var(--color-n900)',
    lineHeight: 1.35,
    minWidth: 0,
  },

  accRowMeta: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-n500)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  accExplore: {
    display: 'inline-block',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
    padding: '8px 0 2px',
  },

  ctaBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    height: '48px',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    textDecoration: 'none',
    margin: '0 8px',
    borderRadius: '14px',
    backgroundColor: 'var(--color-amber)',
  },

  contactAlt: {
    display: 'block',
    textAlign: 'center',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-n600)',
    textDecoration: 'none',
    padding: '12px 0 0',
  },
}

export default MobileNavSheet
