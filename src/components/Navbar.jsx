import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Sparkles, Search, X } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'
import logo from '../assets/logo.svg'
import { useBlog } from '../hooks/useBlog'
import tours from '../data/tours'

const searchPackages = [
  { slug: 'sarajevo-essential', name: '3-Day Complete Sarajevo Experience: Let us show you our home', meta: '3 days · €99', href: '/packages/sarajevo-essential' },
  { slug: 'bosnia-deep-dive', name: 'Bosnia Deep Dive', meta: '5 days · €759', href: '/packages/bosnia-deep-dive' },
  { slug: 'personalised', name: 'Personalised Tour Package', meta: 'Custom experience', href: '/personalised' },
]

function match(query, ...fields) {
  const q = query.toLowerCase()
  return fields.some((f) => f && f.toLowerCase().includes(q))
}

const tourLinks = [
  { id: 1, slug: 'sarajevo-walking-tour', label: 'Essential Sarajevo Walking Tour', price: '€25' },
  { id: 2, slug: 'mostar-day-trip-from-sarajevo', label: 'Mostar Day Trip from Sarajevo', price: '€65' },
  { id: 8, slug: 'lukomir-hike-bosnia', label: 'Lukomir Hike Bosnia', price: '€65' },
  { id: 4, slug: 'bosnian-cooking-class-sarajevo', label: 'Bosnian Cooking Class in Sarajevo', price: '€45' },
  { id: 5, slug: 'jajce-travnik-day-trip-sarajevo', label: 'Jajce & Travnik Day Trip', price: '€65' },
 { id: 6, slug: 'sarajevo-morning-walk-tour', label: 'Sarajevo Morning Walk Tour', price: '€15' },
  { id: 7, slug: 'sarajevo-jewish-heritage-tour', label: 'Sarajevo Jewish Heritage Tour', price: '€25' },
    { id: 3, slug: 'sarajevo-war-tour', label: 'Sarajevo War Tour', price: '€30' },
  { id: 9, slug: 'srebrenica-day-trip-from-sarajevo', label: 'Srebrenica Day Trip from Sarajevo', price: '€65' },

]

const packageLinks = [
  {
    id: 'personalised',
    label: 'Personalised Tour Package',
    description: 'Built entirely around you',
    href: '/personalised',
    isSpecial: true,
  },
  {
    id: 1,
    label: 'Sarajevo Essential',
    description: '2 days · From €99',
    href: '/packages/sarajevo-essential',
    isSpecial: false,
  },
  {
    id: 2,
    label: 'Bosnia Deep Dive',
    description: '5 days · From €759',
    href: '/packages/bosnia-deep-dive',
    isSpecial: false,
  },
]

function Navbar() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const location = useLocation()

  const navigate = useNavigate()
  const { posts } = useBlog()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false)
  const [packagesDropdownOpen, setPackagesDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const lastScrollY = useRef(0)

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

  const toursTimer = useRef(null)
  const packagesTimer = useRef(null)
  const toursRef = useRef(null)
  const packagesRef = useRef(null)
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

  const q = searchQuery.trim()
  const showResults = searchFocused && q.length > 0

  const tourResults = showResults
    ? tours.filter((t) => match(q, t.title, t.badge, t.duration)).slice(0, 4)
    : []
  const packageResults = showResults
    ? searchPackages.filter((p) => match(q, p.name, p.meta))
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
    setToursDropdownOpen(false)
    setPackagesDropdownOpen(false)
  }, [location.pathname])

  // Hover handlers with small delay to prevent accidental close
  const openTours = () => {
    clearTimeout(toursTimer.current)
    setToursDropdownOpen(true)
    setPackagesDropdownOpen(false)
  }

  const closeTours = () => {
    toursTimer.current = setTimeout(
      () => setToursDropdownOpen(false), 150
    )
  }

  const openPackages = () => {
    clearTimeout(packagesTimer.current)
    setPackagesDropdownOpen(true)
    setToursDropdownOpen(false)
  }

  const closePackages = () => {
    packagesTimer.current = setTimeout(
      () => setPackagesDropdownOpen(false), 150
    )
  }

  const handleLinkClick = () => {
    setIsMenuOpen(false)
    setToursDropdownOpen(false)
    setPackagesDropdownOpen(false)
  }

  const sheetLinkStyle = (active) => ({
    fontFamily: 'var(--font-body)',
    fontWeight: active ? '700' : '500',
    fontSize: '17px',
    textDecoration: 'none',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    color: active ? 'var(--color-forest-green)' : 'var(--color-n600)',
  })

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    handleLinkClick()
  }

  const getLinkStyle = (path) => ({
    ...styles.link,
    color: location.pathname === path
      ? 'var(--color-forest-green)'
      : 'var(--color-n600)',
    fontWeight: location.pathname === path ? '700' : '500',
  })

  const getMobileLinkStyle = (path) => ({
    ...styles.mobileLink,
    color: location.pathname === path
      ? 'var(--color-forest-green)'
      : 'var(--color-n600)',
    fontWeight: location.pathname === path ? '700' : '500',
    backgroundColor: location.pathname === path
      ? 'var(--color-amber-light)'
      : 'transparent',
  })

  return (
    <>
    <nav style={{
      ...styles.nav,
      backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : 'var(--color-n000)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      borderBottom: scrolled ? 'none' : '1px solid var(--color-n300)',
      transform: navHidden ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'background-color var(--t-base), box-shadow var(--t-base), transform 0.3s ease',
    }}>

      <div style={{
        ...styles.bar,
        gridTemplateColumns: isMobile ? 'auto auto' : 'auto 1fr auto',
        justifyContent: isMobile ? 'space-between' : undefined,
      }}>

        {/* Brand */}
        <Link to="/" style={styles.brand} onClick={handleHomeClick}>
          <img src={logo} alt="Tallest Tourguide" style={styles.logoImg} />
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
                placeholder="Search tours, packages, blog…"
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
                      <SearchResult key={t.id} to={`/tours/${t.slug}`} title={t.title} meta={`${t.duration} · €${t.price}`} onClick={handleSearchResultClick} />
                    ))}
                  </SearchGroup>
                )}
                {packageResults.length > 0 && (
                  <SearchGroup label="Multi-day tours">
                    {packageResults.map((p) => (
                      <SearchResult key={p.slug} to={p.href} title={p.name} meta={p.meta} onClick={handleSearchResultClick} />
                    ))}
                  </SearchGroup>
                )}
                {blogResults.length > 0 && (
                  <SearchGroup label="Blog">
                    {blogResults.map((p) => (
                      <SearchResult key={p.id} to={`/blog/${p.slug}`} title={p.title} meta={p.category || 'Blog'} onClick={handleSearchResultClick} />
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

            <Link
              to="/"
              style={getLinkStyle('/')}
              onClick={handleLinkClick}
            >
              Home
            </Link>

            {/* Tours dropdown */}
            <div
              ref={toursRef}
              style={styles.dropdownWrapper}
              onMouseEnter={openTours}
              onMouseLeave={closeTours}
            >
              <button
                className={`nav-trigger${location.pathname.startsWith('/tours') ? ' active' : ''}`}
                style={{
                  ...styles.dropdownTrigger,
                  color: location.pathname.startsWith('/tours')
                    ? 'var(--color-forest-green)'
                    : 'var(--color-n600)',
                  fontWeight: location.pathname.startsWith('/tours')
                    ? '700' : '500',
                }}
              >
                
                Tours
                <ChevronDown
                  size={14}
                  style={{
                    transform: toursDropdownOpen
                      ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform var(--t-fast)',
                  }}
                />
              </button>

              {toursDropdownOpen && (
                <div
                  style={styles.dropdown}
                  className="nav-dropdown"
                  onMouseEnter={() =>
                    clearTimeout(toursTimer.current)
                  }
                  onMouseLeave={closeTours}
                >
                  <div style={styles.dropdownHeader}>
                    <span style={styles.dropdownHeaderTitle}>
                      Our Tours
                    </span>
                    <Link
                      to="/tours"
                      style={styles.dropdownViewAll}
                      onClick={handleLinkClick}
                    >
                      View all →
                    </Link>
                  </div>

                  <div style={styles.dropdownDivider} />

                  <div style={styles.dropdownItems}>
                    {tourLinks.map((tour, index) => (
                      <div key={tour.id}>
                        <Link
  to={`/tours/${tour.slug}`}
  style={styles.dropdownItem}
  className="dropdown-item"
  onClick={handleLinkClick}
>
                          <span style={styles.dropdownItemLabel}>
                            {tour.label}
                          </span>
                        </Link>
                        {index < tourLinks.length - 1 && (
                          <div style={styles.dropdownItemDivider} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Packages dropdown */}
            <div
              ref={packagesRef}
              style={styles.dropdownWrapper}
              onMouseEnter={openPackages}
              onMouseLeave={closePackages}
            >
              <button
                className={`nav-trigger${
                  location.pathname.startsWith('/multi-day-tours') || location.pathname.startsWith('/packages') ||
                  location.pathname === '/personalised'
                    ? ' active' : ''
                }`}
                style={{
                  ...styles.dropdownTrigger,
                  color:
                    location.pathname.startsWith('/multi-day-tours') || location.pathname.startsWith('/packages') ||
                    location.pathname === '/personalised'
                      ? 'var(--color-forest-green)'
                      : 'var(--color-n600)',
                  fontWeight:
                    location.pathname.startsWith('/multi-day-tours') || location.pathname.startsWith('/packages') ||
                    location.pathname === '/personalised'
                      ? '700' : '500',
                }}
              >
                Multi-day tours
                <ChevronDown
                  size={14}
                  style={{
                    transform: packagesDropdownOpen
                      ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform var(--t-fast)',
                  }}
                />
              </button>

              {packagesDropdownOpen && (
                <div
                  style={styles.dropdown}
                  className="nav-dropdown"
                  onMouseEnter={() =>
                    clearTimeout(packagesTimer.current)
                  }
                  onMouseLeave={closePackages}
                >
                  <div style={styles.dropdownHeader}>
                    <span style={styles.dropdownHeaderTitle}>
                      Multi-day tours
                    </span>
                    <Link
                      to="/multi-day-tours"
                      style={styles.dropdownViewAll}
                      onClick={handleLinkClick}
                    >
                      View all →
                    </Link>
                  </div>

                  <div style={styles.dropdownDivider} />

                  {/* Personalised — special highlighted item */}
                  <Link
  to="/personalised"
  style={styles.dropdownSpecialItem}
  className="dropdown-special-item"
  onClick={handleLinkClick}
>
                    <div style={styles.dropdownSpecialItemLeft}>
                      <Sparkles
                        size={14}
                        color="var(--color-amber)"
                      />
                      <div style={styles.dropdownItemContent}>
                        <span style={styles.dropdownSpecialItemLabel}>
                          Personalised Tour Package
                        </span>
                        <span style={styles.dropdownItemDescription}>
                          Built entirely around you
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div style={styles.dropdownDivider} />

                  <div style={styles.dropdownItems}>
                    {packageLinks
                      .filter((p) => !p.isSpecial)
                      .map((pkg, index, arr) => (
                        <div key={pkg.id}>
                          <Link
  to={pkg.href}
  style={styles.dropdownItem}
  className="dropdown-item"
  onClick={handleLinkClick}
>
                            <div style={styles.dropdownItemLeft}>
                              <div style={styles.dropdownItemContent}>
                                <span style={styles.dropdownItemLabel}>
                                  {pkg.label}
                                </span>
                                <span style={styles.dropdownItemDescription}>
                                  {pkg.description}
                                </span>
                              </div>
                            </div>
                          </Link>
                          {index < arr.length - 1 && (
                            <div style={styles.dropdownItemDivider} />
                          )}
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              style={getLinkStyle('/about')}
              onClick={handleLinkClick}
            >
              About
            </Link>

            <Link
              to="/blog"
              style={getLinkStyle('/blog')}
              onClick={handleLinkClick}
            >
              Blog
            </Link>

            <Link
              to="/contact"
              style={styles.contactBtn}
              className="nav-contact-btn"
            >
              Contact
            </Link>

          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            style={styles.hamburger}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        )}

      </div>

    </nav>

    {/* Mobile backdrop */}
    {isMobile && (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 198,
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={() => setIsMenuOpen(false)}
      />
    )}

    {/* Mobile bottom sheet */}
    {isMobile && (
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
        transform: isMenuOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: isMenuOpen ? 'auto' : 'none',
        paddingBottom: '32px',
      }}>

        {/* Handle pill */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--color-n300)' }} />
        </div>

        {/* Search */}
        <div style={{
          ...styles.mobileSearchRow,
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
            onKeyDown={handleSearchKey}
            style={styles.mobileSearchInput}
          />
          {searchQuery && (
            <button style={styles.searchClearBtn} onClick={() => { setSearchQuery(''); setSearchFocused(false) }}>
              <X size={13} color="var(--color-n600)" />
            </button>
          )}
        </div>

        <div style={styles.sheetDivider} />

        {/* Search results or nav links */}
        {q ? (
          <div style={styles.mobileSearchResults}>
            {!hasResults && (
              <p style={styles.mobileSearchNoResults}>
                No results for "<strong>{q}</strong>" — try a tour name, destination, or activity.
              </p>
            )}
            {tourResults.length > 0 && (
              <SearchGroup label="Tours">
                {tourResults.map((t) => (
                  <SearchResult key={t.id} to={`/tours/${t.slug}`} title={t.title} meta={`${t.duration} · €${t.price}`} onClick={() => { handleSearchResultClick(); handleLinkClick() }} />
                ))}
              </SearchGroup>
            )}
            {packageResults.length > 0 && (
              <SearchGroup label="Multi-day tours">
                {packageResults.map((p) => (
                  <SearchResult key={p.slug} to={p.href} title={p.name} meta={p.meta} onClick={() => { handleSearchResultClick(); handleLinkClick() }} />
                ))}
              </SearchGroup>
            )}
            {blogResults.length > 0 && (
              <SearchGroup label="Blog">
                {blogResults.map((p) => (
                  <SearchResult key={p.id} to={`/blog/${p.slug}`} title={p.title} meta={p.category || 'Blog'} onClick={() => { handleSearchResultClick(); handleLinkClick() }} />
                ))}
              </SearchGroup>
            )}
          </div>
        ) : (
          <div style={styles.sheetNav}>
            <Link to="/" style={sheetLinkStyle(location.pathname === '/')} onClick={handleHomeClick}>
              Home
            </Link>
            <Link to="/tours" style={sheetLinkStyle(location.pathname.startsWith('/tours'))} onClick={handleLinkClick}>
              Tours
            </Link>
            <Link to="/multi-day-tours" style={sheetLinkStyle(location.pathname.startsWith('/multi-day-tours') || location.pathname.startsWith('/packages') || location.pathname === '/personalised')} onClick={handleLinkClick}>
              Multi-day tours
            </Link>
            <Link to="/about" style={sheetLinkStyle(location.pathname === '/about')} onClick={handleLinkClick}>
              About
            </Link>
            <Link to="/blog" style={sheetLinkStyle(location.pathname === '/blog')} onClick={handleLinkClick}>
              Blog
            </Link>
            <div style={styles.sheetDivider} />
            <Link to="/contact" style={styles.mobileContactBtn} onClick={handleLinkClick}>
              Contact Us
            </Link>
          </div>
        )}

      </div>
    )}

    </>
  )
}

function SearchGroup({ label, children }) {
  return (
    <div style={searchStyles.group}>
      <span style={searchStyles.groupLabel}>{label}</span>
      {children}
    </div>
  )
}

function SearchResult({ to, title, meta, onClick }) {
  return (
    <Link to={to} style={searchStyles.result} className="search-result-item" onClick={onClick}>
      <div style={searchStyles.resultText}>
        <span style={searchStyles.resultTitle}>{title}</span>
        <span style={searchStyles.resultMeta}>{meta}</span>
      </div>
    </Link>
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
    gridTemplateColumns: 'auto 1fr auto',
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

  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '14px',
    border: '1px solid var(--color-n300)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    minWidth: '260px',
    padding: '12px',
    zIndex: 200,
  },

  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 4px 8px 4px',
  },

  dropdownHeaderTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '11px',
    color: 'var(--color-n600)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  dropdownViewAll: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },

  dropdownDivider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    margin: '4px 0',
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

  dropdownItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
  },

  dropdownItemDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-forest-green)',
    flexShrink: 0,
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
    fontSize: '11px',
    color: 'var(--color-n600)',
  },

  dropdownItemPrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--color-forest-green)',
    whiteSpace: 'nowrap',
    marginLeft: '8px',
  },

  dropdownItemDivider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    margin: '0 8px',
    opacity: 0.5,
  },

  dropdownSpecialItem: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    padding: '10px 8px',
    borderRadius: '8px',
    backgroundColor: 'rgba(244,161,48,0.06)',
    margin: '4px 0',
  },

  dropdownSpecialItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  dropdownSpecialItemLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },

  searchWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
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
    borderRadius: '100px',
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

  mobileSearchRow: {
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

  mobileSearchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--color-n900)',
    minWidth: 0,
  },

  mobileSearchResults: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '8px',
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

  mobileSearchNoResults: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    padding: '24px 20px',
    margin: 0,
    lineHeight: '1.6',
  },

  contactBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '36px',
    padding: '0 16px',
    backgroundColor: 'transparent',
    color: 'var(--color-amber)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    border: '1.5px solid var(--color-amber)',
    marginLeft: '4px',
  },

  hamburger: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    color: 'var(--color-n900)',
    cursor: 'pointer',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius)',
  },

  mobileMenu: {
    position: 'absolute',
    top: '68px',
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n300)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0 16px 0',
    zIndex: 99,
    maxHeight: '80vh',
    overflowY: 'auto',
  },

  mobileLink: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    textDecoration: 'none',
    padding: '12px 20px',
    display: 'block',
    borderRadius: '8px',
    margin: '2px 8px',
  },

  mobileSectionLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10px',
    color: 'var(--color-n600)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    padding: '12px 20px 4px 20px',
    marginTop: '4px',
  },

  mobileSubLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    textDecoration: 'none',
    padding: '10px 20px 10px 28px',
    borderRadius: '8px',
    margin: '1px 8px',
  },

  mobileSubLinkMeta: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
    fontWeight: '600',
  },

  mobileContactBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    textDecoration: 'none',
    margin: '8px 20px 0',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--color-amber)',
    border: 'none',
  },

  sheetDivider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    margin: '4px 0',
  },

  sheetNav: {
    display: 'flex',
    flexDirection: 'column',
  },
}

const searchStyles = {
  group: {
    padding: '4px 0',
  },
  groupLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10px',
    color: 'var(--color-n600)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    padding: '8px 14px 4px',
  },
  result: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 14px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  resultText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  resultTitle: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resultMeta: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--color-n600)',
  },
}

export default Navbar