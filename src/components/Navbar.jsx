import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Search, X, Menu, MessageCircle } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'
import logo from '../assets/logo.svg'
import { useBlog } from '../hooks/useBlog'
import tours from '../data/tours'
import {
  DAY_TOURS_RAIL,
  DAY_TOURS_DEFAULT_ID,
  JOURNEYS_RAIL,
  JOURNEYS_DEFAULT_ID,
  searchPackageLinks,
  discoverGroups,
  discoverContact,
  discoverLinks,
} from '../data/navigation'
import MegaMenu from './nav/MegaMenu'
import MobileNavSheet from './nav/MobileNavSheet'
import CurrencySwitcher from './CurrencySwitcher'
import { useCurrency } from '../context/CurrencyContext'
import { SearchGroup, SearchResult } from './nav/SearchResults'

function match(query, ...fields) {
  const q = query.toLowerCase()
  return fields.some((f) => f && f.toLowerCase().includes(q))
}

function Navbar() {
  const { format } = useCurrency()
  const width = useWindowWidth()
  const isMobile = width <= 768
  const location = useLocation()

  const navigate = useNavigate()
  const { posts } = useBlog()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [destDropdownOpen, setDestDropdownOpen] = useState(false)
  const [packagesDropdownOpen, setPackagesDropdownOpen] = useState(false)
  const [discoverDropdownOpen, setDiscoverDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const [navHovered, setNavHovered] = useState(false)
  const lastScrollY = useRef(0)

  // The homepage hero is the only place a photo sits directly behind the
  // nav's own row (see the negative marginTop on Home's hero section) — so
  // the transparent-until-interaction treatment only makes sense there.
  // Everywhere else the nav stays solid, same as always.
  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled && !navHovered
  // The "frosted glass" solid look — used once actually scrolled (every
  // page, unchanged from before) and also as soon as the home nav is
  // hovered pre-scroll, so hovering doesn't flash a harder-edged bar.
  const blurSolid = scrolled || (isHome && navHovered)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 20)
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavHidden(true)
      } else {
        setNavHidden(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const destTimer = useRef(null)
  const packagesTimer = useRef(null)
  const discoverTimer = useRef(null)
  const navRef = useRef(null)
  const searchRef = useRef(null)

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Escape closes any open dropdown; clicks outside the nav close the mega menu.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDestDropdownOpen(false)
        setPackagesDropdownOpen(false)
        setDiscoverDropdownOpen(false)
      }
    }
    const onMouseDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setDestDropdownOpen(false)
        setPackagesDropdownOpen(false)
        setDiscoverDropdownOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  const q = searchQuery.trim()
  const showResults = searchFocused && q.length > 0

  const tourResults = showResults
    ? tours.filter((t) => match(q, t.title, t.badge, t.duration)).slice(0, 4)
    : []
  const packageResults = showResults
    ? searchPackageLinks.filter((p) => match(q, p.name, p.meta)).slice(0, 4)
    : []
  const blogResults = showResults
    ? posts.filter((p) => match(q, p.title, p.excerpt, p.category)).slice(0, 3)
    : []
  const hasResults = tourResults.length + packageResults.length + blogResults.length > 0

  const handleSearchKey = (e) => {
    if (e.key === 'Escape') { setSearchFocused(false); setSearchQuery('') }
    if (e.key === 'Enter' && q) {
      navigate(`/tours?search=${encodeURIComponent(q)}`)
      setSearchFocused(false)
    }
  }

  const handleSearchResultClick = () => {
    setSearchQuery('')
    setSearchFocused(false)
  }

  // Close on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setDestDropdownOpen(false)
    setPackagesDropdownOpen(false)
    setDiscoverDropdownOpen(false)
  }, [location.pathname])

  // Hover handlers with small delay to prevent accidental close
  const openDest = () => {
    clearTimeout(destTimer.current)
    setDestDropdownOpen(true)
    setPackagesDropdownOpen(false)
    setDiscoverDropdownOpen(false)
  }

  const closeDest = () => {
    destTimer.current = setTimeout(
      () => setDestDropdownOpen(false), 150
    )
  }

  const openPackages = () => {
    clearTimeout(packagesTimer.current)
    setPackagesDropdownOpen(true)
    setDestDropdownOpen(false)
    setDiscoverDropdownOpen(false)
  }

  const closePackages = () => {
    packagesTimer.current = setTimeout(
      () => setPackagesDropdownOpen(false), 150
    )
  }

  const openDiscover = () => {
    clearTimeout(discoverTimer.current)
    setDiscoverDropdownOpen(true)
    setDestDropdownOpen(false)
    setPackagesDropdownOpen(false)
  }

  const closeDiscover = () => {
    discoverTimer.current = setTimeout(
      () => setDiscoverDropdownOpen(false), 150
    )
  }

  const handleLinkClick = () => {
    setIsMenuOpen(false)
    setDestDropdownOpen(false)
    setPackagesDropdownOpen(false)
    setDiscoverDropdownOpen(false)
  }

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    handleLinkClick()
  }

  // Shared so every nav link/trigger recolors the same way once the bar
  // goes transparent over the hero — white text with a soft shadow so it
  // stays legible regardless of what's in the photo behind it.
  const navTextColor = (active) => transparent
    ? 'rgba(255,255,255,0.94)'
    : (active ? 'var(--color-forest-green)' : 'var(--color-n600)')

  const getLinkStyle = (path) => ({
    ...styles.link,
    color: navTextColor(location.pathname === path),
    fontWeight: location.pathname === path ? '700' : '500',
    textShadow: transparent ? '0 1px 3px rgba(0,0,0,0.35)' : 'none',
  })

  const destActive = location.pathname.startsWith('/tours')
  const journeysActive = location.pathname.startsWith('/multi-day-tours') || location.pathname === '/personalised' || location.pathname.startsWith('/destinations')
  const discoverActive = discoverLinks.some((l) => l.href === location.pathname)

  return (
    <>
    <nav ref={navRef} onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)} style={{
      ...styles.nav,
      backgroundColor: transparent ? 'transparent' : (blurSolid ? 'rgba(255,255,255,0.92)' : 'var(--color-n000)'),
      backdropFilter: transparent ? 'none' : (blurSolid ? 'blur(12px)' : 'none'),
      WebkitBackdropFilter: transparent ? 'none' : (blurSolid ? 'blur(12px)' : 'none'),
      boxShadow: transparent ? 'none' : (blurSolid ? 'var(--shadow-md)' : 'none'),
      borderBottom: transparent ? 'none' : (blurSolid ? 'none' : '1px solid var(--color-n300)'),
      transform: navHidden ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'background-color var(--t-base), box-shadow var(--t-base), transform 0.3s ease',
    }}>

      <div style={{
        ...styles.bar,
        gridTemplateColumns: isMobile ? 'auto auto' : 'auto minmax(0, 1fr) auto',
        justifyContent: isMobile ? 'space-between' : undefined,
      }}>

        {/* Brand — the logo already has white text baked into its dark-green
            ribbon (fills: #044725 green, #f7941d amber, #fff text), so a
            brightness(0)/invert(1) trick to "make it white" flattens the
            ribbon and its text to the same flat white and erases the
            wordmark. A drop-shadow for edge definition against the photo is
            enough; the logo's own colors stay as designed. */}
        <Link to="/" style={styles.brand} onClick={handleHomeClick}>
          <img
            src={logo}
            alt="Tallest Tourguide"
            style={{
              ...styles.logoImg,
              filter: transparent ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))' : 'none',
              transition: 'filter var(--t-base)',
            }}
          />
        </Link>

        {/* Centered search input — desktop only */}
        {!isMobile && (
          <div ref={searchRef} style={styles.searchWrapper}>
            <div style={{
              ...styles.searchInputRow,
              borderColor: searchFocused ? 'var(--color-forest-green)' : 'var(--color-n300)',
              boxShadow: searchFocused ? '0 0 0 3px rgba(46,125,94,0.12)' : 'none',
            }}>
              <Search size={15} color="var(--color-n600)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search tours, journeys…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKey}
                style={styles.searchInput}
              />
              {searchQuery && (
                <button
                  style={styles.searchClearBtn}
                  onClick={() => { setSearchQuery(''); setSearchFocused(false) }}
                  aria-label="Clear"
                >
                  <X size={13} color="var(--color-n600)" />
                </button>
              )}
            </div>

            {/* Dropdown results */}
            {showResults && (
              <div style={styles.searchDropdown}>
                {!hasResults && (
                  <p style={styles.searchNoResults}>
                    No results for "<strong>{q}</strong>" — try a tour name, destination, or activity.
                  </p>
                )}
                {tourResults.length > 0 && (
                  <SearchGroup label="Tours">
                    {tourResults.map((t) => (
                      <SearchResult key={t.id} to={`/tours/${t.slug}`} title={t.title} meta={`${t.duration} · ${format(t.price)}`} onClick={handleSearchResultClick} />
                    ))}
                  </SearchGroup>
                )}
                {packageResults.length > 0 && (
                  <SearchGroup label="Multi-day journeys">
                    {packageResults.map((p) => (
                      <SearchResult key={p.slug} to={p.href} title={p.name} meta={p.meta} onClick={handleSearchResultClick} />
                    ))}
                  </SearchGroup>
                )}
                {blogResults.length > 0 && (
                  <SearchGroup label="The Journal">
                    {blogResults.map((p) => (
                      <SearchResult key={p.id} to={`/journal/${p.slug}`} title={p.title} meta={p.category || 'Journal'} onClick={handleSearchResultClick} />
                    ))}
                  </SearchGroup>
                )}
              </div>
            )}
          </div>
        )}

        {/* Desktop links */}
        {!isMobile && (
          <div style={styles.links}>

            {/* Day Tours — opens the experience-led mega menu */}
            <div
              style={styles.dropdownWrapper}
              onMouseEnter={openDest}
              onMouseLeave={closeDest}
            >
              <button
                className={`nav-trigger${destActive || destDropdownOpen ? ' active' : ''}`}
                aria-haspopup="true"
                aria-expanded={destDropdownOpen}
                onClick={() => setDestDropdownOpen((o) => !o)}
                style={{
                  ...styles.dropdownTrigger,
                  color: navTextColor(destActive || destDropdownOpen),
                  fontWeight: destActive ? '700' : '500',
                  textShadow: transparent ? '0 1px 3px rgba(0,0,0,0.35)' : 'none',
                }}
              >
                Day Tours
                <ChevronDown
                  size={14}
                  style={{
                    transform: destDropdownOpen
                      ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform var(--t-fast)',
                  }}
                />
              </button>
            </div>

            {/* Journeys — opens the destination-led mega menu */}
            <div
              style={styles.dropdownWrapper}
              onMouseEnter={openPackages}
              onMouseLeave={closePackages}
            >
              <button
                className={`nav-trigger${journeysActive || packagesDropdownOpen ? ' active' : ''}`}
                aria-haspopup="true"
                aria-expanded={packagesDropdownOpen}
                onClick={() => setPackagesDropdownOpen((o) => !o)}
                style={{
                  ...styles.dropdownTrigger,
                  color: navTextColor(journeysActive || packagesDropdownOpen),
                  fontWeight: journeysActive ? '700' : '500',
                  textShadow: transparent ? '0 1px 3px rgba(0,0,0,0.35)' : 'none',
                }}
              >
                Journeys
                <ChevronDown
                  size={14}
                  style={{
                    transform: packagesDropdownOpen
                      ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform var(--t-fast)',
                  }}
                />
              </button>
            </div>

            {/* Discover dropdown — brand & service pages */}
            <div
              style={styles.dropdownWrapper}
              onMouseEnter={openDiscover}
              onMouseLeave={closeDiscover}
            >
              <button
                className={`nav-trigger${discoverActive || discoverDropdownOpen ? ' active' : ''}`}
                aria-haspopup="true"
                aria-expanded={discoverDropdownOpen}
                onClick={() => setDiscoverDropdownOpen((o) => !o)}
                style={{
                  ...styles.dropdownTrigger,
                  color: navTextColor(discoverActive || discoverDropdownOpen),
                  fontWeight: discoverActive ? '700' : '500',
                  textShadow: transparent ? '0 1px 3px rgba(0,0,0,0.35)' : 'none',
                }}
              >
                Discover
                <ChevronDown
                  size={14}
                  style={{
                    transform: discoverDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform var(--t-fast)',
                  }}
                />
              </button>

              {discoverDropdownOpen && (
                <div
                  style={{ ...styles.dropdown, minWidth: 300 }}
                  className="nav-dropdown"
                  onMouseEnter={() => clearTimeout(discoverTimer.current)}
                  onMouseLeave={closeDiscover}
                >
                  {discoverGroups.map((group, gi) => (
                    <div key={group.label} style={{ marginTop: gi ? 6 : 0 }}>
                      <span style={styles.dropdownGroupLabel}>{group.label}</span>
                      <div style={styles.dropdownItems}>
                        {group.items.map((item) => (
                          <Link key={item.id} to={item.href} style={styles.dropdownItem} className="dropdown-item" onClick={handleLinkClick}>
                            <div style={styles.dropdownItemContent}>
                              <span style={styles.dropdownItemLabel}>{item.label}</span>
                              <span style={styles.dropdownItemDescription}>{item.description}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Emphasized contact CTA — kept visually distinct from the
                      plain page links so it can't be missed. */}
                  <Link
                    to={discoverContact.href}
                    className="dropdown-contact-cta"
                    style={styles.dropdownContactCta}
                    onClick={handleLinkClick}
                  >
                    <span style={styles.dropdownContactIcon}>
                      <MessageCircle size={16} color="var(--color-forest-green)" />
                    </span>
                    <div style={styles.dropdownItemContent}>
                      <span style={{ ...styles.dropdownItemLabel, fontWeight: '700', color: 'var(--color-forest-green)' }}>
                        {discoverContact.label}
                      </span>
                      <span style={styles.dropdownItemDescription}>{discoverContact.description}</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/journal"
              style={getLinkStyle('/journal')}
              onClick={handleLinkClick}
            >
              The Journal
            </Link>

            <CurrencySwitcher variant={transparent ? 'light' : 'default'} />

            {/* Lands on the free questionnaire, not the paid consult — a €90
                price as the first click was scaring warm leads away. The
                consult stays reachable under Discover → Trip Consultation. */}
            <Link
              to="/personalised"
              style={styles.ctaBtn}
              className="btn-lift"
            >
              Plan Your Trip
            </Link>

          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            style={{
              ...styles.hamburger,
              backgroundColor: isMenuOpen
                ? 'var(--color-forest-green)'
                : transparent ? 'rgba(255,255,255,0.16)' : 'rgba(46,125,94,0.06)',
              borderColor: isMenuOpen
                ? 'var(--color-forest-green)'
                : transparent ? 'rgba(255,255,255,0.5)' : 'rgba(46,125,94,0.25)',
              color: isMenuOpen ? 'var(--color-n000)' : transparent ? '#fff' : 'var(--color-forest-green)',
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} strokeWidth={2.25} /> : <Menu size={22} strokeWidth={2.25} />}
          </button>
        )}

      </div>

      {/* Mega menus — anchored to the full nav width */}
      {!isMobile && destDropdownOpen && (
        <MegaMenu
          label="Day tours menu"
          rail={DAY_TOURS_RAIL}
          defaultId={DAY_TOURS_DEFAULT_ID}
          footerLinks={[
            { label: 'All day tours →', href: '/tours' },
            { label: 'Contact', href: '/contact' },
          ]}
          width={width}
          onNavigate={handleLinkClick}
          onClose={() => setDestDropdownOpen(false)}
          onMouseEnter={() => clearTimeout(destTimer.current)}
          onMouseLeave={closeDest}
        />
      )}
      {!isMobile && packagesDropdownOpen && (
        <MegaMenu
          label="Journeys menu"
          rail={JOURNEYS_RAIL}
          defaultId={JOURNEYS_DEFAULT_ID}
          footerLinks={[
            { label: 'All journeys →', href: '/multi-day-tours' },
            { label: 'All destinations →', href: '/destinations' },
          ]}
          width={width}
          onNavigate={handleLinkClick}
          onClose={() => setPackagesDropdownOpen(false)}
          onMouseEnter={() => clearTimeout(packagesTimer.current)}
          onMouseLeave={closePackages}
        />
      )}

    </nav>

    {/* Mobile bottom sheet + backdrop */}
    {isMobile && (
      <MobileNavSheet open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    )}

    </>
  )
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n300)',
  },

  bar: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: '24px',
    padding: '0 40px',
    height: '68px',
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    flexShrink: 0,
  },

  logoImg: {
    height: '36px',
    width: 'auto',
    display: 'block',
  },

  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  link: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    textDecoration: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    transition: 'color 0.15s ease',
    whiteSpace: 'nowrap',
  },

  dropdownWrapper: {
    position: 'relative',
  },

  dropdownTrigger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 10px',
    borderRadius: '6px',
    position: 'relative',
  },

  // Centering comes from the .nav-dropdown keyframe (translate(-50%, 0) held
  // with `forwards`) — do not add an inline transform here, the animation's
  // final state would override it.
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    left: '50%',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '14px',
    border: '1px solid var(--color-n300)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    minWidth: '260px',
    padding: '12px',
    zIndex: 200,
  },

  dropdownItems: {
    display: 'flex',
    flexDirection: 'column',
  },

  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textDecoration: 'none',
    padding: '10px 8px',
    borderRadius: '8px',
    transition: 'background-color var(--t-fast)',
  },

  dropdownItemContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },

  dropdownItemLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
    lineHeight: '1.3',
  },

  dropdownItemDescription: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },

  dropdownContactCta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '12px',
    padding: '11px 12px',
    borderRadius: '10px',
    backgroundColor: 'rgba(46,125,94,0.07)',
    border: '1px solid rgba(46,125,94,0.18)',
    textDecoration: 'none',
    transition: 'background-color var(--t-fast), border-color var(--t-fast)',
  },

  dropdownContactIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(46,125,94,0.10)',
    flexShrink: 0,
  },

  // Small-caps section label inside the Discover menu.
  dropdownGroupLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-n500)',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    padding: '8px 8px 4px',
  },

  searchWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '320px',
    margin: '0 auto',
  },

  searchInputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '38px',
    padding: '0 12px',
    backgroundColor: 'var(--color-n100)',
    border: '1.5px solid var(--color-n300)',
    borderRadius: 'var(--radius-pill)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },

  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
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

  searchDropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-n000)',
    borderRadius: '14px',
    border: '1px solid var(--color-n300)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    zIndex: 300,
    overflow: 'hidden',
    maxHeight: '400px',
    overflowY: 'auto',
  },

  searchNoResults: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    padding: '24px 20px',
    margin: 0,
    textAlign: 'center',
    lineHeight: '1.6',
  },

  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '36px',
    padding: '0 18px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius-pill)',
    textDecoration: 'none',
    marginLeft: '8px',
    whiteSpace: 'nowrap',
  },

  hamburger: {
    border: '1.5px solid rgba(46,125,94,0.25)',
    cursor: 'pointer',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius)',
    transition: 'background-color var(--t-fast), border-color var(--t-fast), color var(--t-fast)',
  },
}

export default Navbar
