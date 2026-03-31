import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Sparkles } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'

const tourLinks = [
  { id: 1, label: 'Sarajevo War & Peace Tour', price: '€29' },
  { id: 2, label: 'Mostar & Old Bridge Day Trip', price: '€49' },
  { id: 3, label: 'Sarajevo Walking Tour', price: '€22' },
  { id: 4, label: 'Jewish Heritage of Sarajevo', price: '€25' },
  { id: 5, label: 'Sarajevo Food Tour', price: '€35' },
  { id: 6, label: 'Yellow Fortress Sunset Walk', price: '€18' },
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
    description: '2 days · From €199',
    href: '/packages/1',
    isSpecial: false,
  },
  {
    id: 2,
    label: 'Bosnia Deep Dive',
    description: '5 days · From €349',
    href: '/packages/2',
    isSpecial: false,
  },
]

function Navbar() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const location = useLocation()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false)
  const [packagesDropdownOpen, setPackagesDropdownOpen] = useState(false)

  const toursTimer = useRef(null)
  const packagesTimer = useRef(null)
  const toursRef = useRef(null)
  const packagesRef = useRef(null)

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
    <nav style={styles.nav}>

      <div style={styles.bar}>

        {/* Brand */}
        <Link to="/" style={styles.brand} onClick={handleHomeClick}>
          Tallest Tourguide
        </Link>

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
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {toursDropdownOpen && (
                <div
                  style={styles.dropdown}
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
  to={`/tours/${tour.id}`}
  style={styles.dropdownItem}
  className="dropdown-item"
  onClick={handleLinkClick}
>
                          <div style={styles.dropdownItemLeft}>
                            <div style={styles.dropdownItemDot} />
                            <span style={styles.dropdownItemLabel}>
                              {tour.label}
                            </span>
                          </div>
                          <span style={styles.dropdownItemPrice}>
                            {tour.price}
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
                  location.pathname.startsWith('/packages') ||
                  location.pathname === '/personalised'
                    ? ' active' : ''
                }`}
                style={{
                  ...styles.dropdownTrigger,
                  color:
                    location.pathname.startsWith('/packages') ||
                    location.pathname === '/personalised'
                      ? 'var(--color-forest-green)'
                      : 'var(--color-n600)',
                  fontWeight:
                    location.pathname.startsWith('/packages') ||
                    location.pathname === '/personalised'
                      ? '700' : '500',
                }}
              >
                Packages
                <ChevronDown
                  size={14}
                  style={{
                    transform: packagesDropdownOpen
                      ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {packagesDropdownOpen && (
                <div
                  style={styles.dropdown}
                  onMouseEnter={() =>
                    clearTimeout(packagesTimer.current)
                  }
                  onMouseLeave={closePackages}
                >
                  <div style={styles.dropdownHeader}>
                    <span style={styles.dropdownHeaderTitle}>
                      Packages
                    </span>
                    <Link
                      to="/packages"
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
                              <div style={styles.dropdownItemDot} />
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

            <Link to="/contact" style={styles.contactBtn}>
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

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div style={styles.mobileMenu}>

          <Link
            to="/"
            style={getMobileLinkStyle('/')}
            onClick={handleHomeClick}
          >
            Home
          </Link>

          <div style={styles.mobileSectionLabel}>Tours</div>
          <Link
            to="/tours"
            style={styles.mobileSubLink}
            onClick={handleLinkClick}
          >
            All Tours
          </Link>
          {tourLinks.map((tour) => (
            <Link
              key={tour.id}
              to={`/tours/${tour.id}`}
              style={styles.mobileSubLink}
              onClick={handleLinkClick}
            >
              <span>{tour.label}</span>
              <span style={styles.mobileSubLinkMeta}>
                {tour.price}
              </span>
            </Link>
          ))}

          <div style={styles.mobileSectionLabel}>Packages</div>
          <Link
            to="/packages"
            style={styles.mobileSubLink}
            onClick={handleLinkClick}
          >
            All Packages
          </Link>
          {packageLinks.map((pkg) => (
            <Link
              key={pkg.id}
              to={pkg.href}
              style={{
                ...styles.mobileSubLink,
                backgroundColor: pkg.isSpecial
                  ? 'rgba(244,161,48,0.08)'
                  : 'transparent',
              }}
              onClick={handleLinkClick}
            >
              <span>{pkg.label}</span>
              {pkg.isSpecial && (
                <Sparkles size={13} color="var(--color-amber)" />
              )}
            </Link>
          ))}

          <Link
            to="/about"
            style={getMobileLinkStyle('/about')}
            onClick={handleLinkClick}
          >
            About
          </Link>

          <Link
            to="/contact"
            style={styles.mobileContactBtn}
            onClick={handleLinkClick}
          >
            Contact
          </Link>

        </div>
      )}

    </nav>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    height: '68px',
  },

  brand: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '20px',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
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
    // No transition — background change is instant
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
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-amber)',
    textDecoration: 'none',
    padding: '12px 20px',
    margin: '8px 8px 0 8px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-amber)',
  },
}

export default Navbar