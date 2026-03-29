// Navbar.jsx
// Handles both desktop and mobile navigation.
// On desktop: horizontal bar with links and CTA button.
// On mobile: brand + hamburger icon, with a dropdown menu
// that opens and closes via a boolean state variable.
//
// Key concept: the hamburger menu state (isMenuOpen) is local
// to this component — it doesn't need to be shared with anything
// else in the app, so useState inside this component is exactly
// the right tool.

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useWindowWidth from '../hooks/useWindowWidth'

function Navbar() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  // isMenuOpen tracks whether the mobile menu is currently visible.
  // false = closed (default), true = open.
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // useLocation gives us the current URL path — we use this to
  // highlight the active link so visitors always know which page
  // they're on. This is called an "active state" and it's a small
  // but meaningful trust signal in navigation design.
  const location = useLocation()

  const navigate = useNavigate()

  // When clicking the logo or Home link while already on the
  // homepage, React Router won't trigger a navigation event
  // because the route hasn't changed — so ScrollToTop won't fire.
  // This handler detects that case and scrolls manually.
  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // If on another page, let the Link navigate normally —
    // ScrollToTop will handle the scroll reset automatically.
    setIsMenuOpen(false)
  }

  // This function is called when any mobile nav link is clicked.
  // It closes the menu immediately so the visitor doesn't have to
  // manually dismiss it after navigating. Small detail, big impact.
  const handleLinkClick = () => setIsMenuOpen(false)

  // This helper function returns the correct style for each nav link —
  // the active page gets the Forest Green colour to indicate "you are here",
  // while inactive links stay in the neutral body text colour.
  const getLinkStyle = (path) => ({
    ...styles.link,
    color: location.pathname === path
      ? 'var(--color-forest-green)'
      : 'var(--color-n600)',
    fontWeight: location.pathname === path ? '700' : '500',
  })

  // Same active style logic but for mobile links —
  // slightly larger and full-width for easy tapping.
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
    // The outer nav wrapper uses position:relative so that the
    // mobile dropdown menu can be positioned absolutely below it
    // without pushing any page content downward.
    <nav style={styles.nav}>

      {/* ── NAVBAR BAR ──────────────────────────────────
          This is always visible on both desktop and mobile.
          On desktop it shows brand + links + CTA.
          On mobile it shows brand + hamburger icon. */}
      <div style={styles.bar}>

        {/* Brand name */}
<Link to="/" style={styles.brand} onClick={handleHomeClick}>
  Tallest Tourguide
</Link>

        {/* Desktop navigation — hidden on mobile */}
        {!isMobile && (
          <div style={styles.links}>
            <Link to="/" style={getLinkStyle('/')} onClick={handleHomeClick}>Home</Link>
            <Link to="/tours" style={getLinkStyle('/tours')}>Tours</Link>
            <Link to="/packages" style={getLinkStyle('/packages')}>Packages</Link>
            <Link to="/contact" style={getLinkStyle('/contact')}>Contact</Link>
          </div>
        )}

        {/* Right side — CTA button on desktop, hamburger on mobile */}
        {isMobile ? (

          // Hamburger button — three lines that transform into an X when open.
          // The transformation gives the visitor visual confirmation that
          // clicking again will close the menu — a small but important affordance.
          <button
            style={styles.hamburger}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {/* We render either the hamburger (☰) or close (✕) icon
                depending on menu state. The aria-label on the button
                ensures screen readers announce it correctly regardless
                of which icon is showing — accessibility matters for SEO too. */}
            {isMenuOpen ? '✕' : '☰'}
          </button>

        ) : (

          <Link to="/tours" style={styles.cta}>
            Book Now
          </Link>

        )}

      </div>

      {/* ── MOBILE DROPDOWN MENU ────────────────────────
          Only rendered when isMenuOpen is true AND we're on mobile.
          The && operator means: both conditions must be true.
          On desktop this entire block never appears regardless of state.
          
          Position absolute means it floats over the page content below
          rather than pushing it down — this is the standard behaviour
          visitors expect from mobile navigation menus. */}
      {isMobile && isMenuOpen && (
        <div style={styles.mobileMenu}>

          <Link
            to="/"
            style={getMobileLinkStyle('/')}
            onClick={handleLinkClick}
          >
            Home
          </Link>

          <Link
            to="/tours"
            style={getMobileLinkStyle('/tours')}
            onClick={handleLinkClick}
          >
            Tours
          </Link>

          <Link
            to="/packages"
            style={getMobileLinkStyle('/packages')}
            onClick={handleLinkClick}
          >
            Packages
          </Link>

          <Link
            to="/contact"
            style={getMobileLinkStyle('/contact')}
            onClick={handleLinkClick}
          >
            Contact
          </Link>

          {/* Book Now CTA inside the mobile menu —
              large, full-width, and Amber so it stands out
              from the regular navigation links clearly.
              This is the most important action on the page
              and it should be impossible to miss. */}
          <Link
            to="/tours"
            style={styles.mobileCtaBtn}
            onClick={handleLinkClick}
          >
            Book Now
          </Link>

        </div>
      )}

    </nav>
  )
}

const styles = {
  // position: relative on the nav is critical —
  // it creates the positioning context for the absolute
  // dropdown menu so it appears directly below the navbar.
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n300)',
  },

  // The bar is the always-visible horizontal strip.
  // flexbox with space-between pushes brand to the left
  // and the CTA/hamburger to the right automatically.
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
    gap: '32px',
  },

  link: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },

  cta: {
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    padding: '0 20px',
    height: 'var(--touch-target)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },

  // The hamburger button needs no background or border —
  // just the icon itself, large enough to tap comfortably.
  // 44px minimum touch target size from your design system.
  hamburger: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: 'var(--color-n900)',
    cursor: 'pointer',
    width: 'var(--touch-target)',
    height: 'var(--touch-target)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius)',
  },

  // The mobile dropdown menu sits absolutely below the navbar.
  // Full viewport width, white background, clear visual separation
  // from the page content with a shadow.
  mobileMenu: {
    position: 'absolute',
    top: '68px',        // Exactly the height of the navbar bar
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n300)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0 16px 0',
    zIndex: 99,
  },

  // Mobile links are full-width with generous padding —
  // easy to tap with a thumb, even in the corner of the screen.
  mobileLink: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    textDecoration: 'none',
    padding: '14px 24px',
    display: 'block',
    borderRadius: '8px',
    margin: '2px 8px',
    transition: 'background-color 0.15s ease',
  },

  // The mobile Book Now button is full-width inside the menu,
  // clearly differentiated from the nav links by its Amber colour.
  mobileCtaBtn: {
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    textDecoration: 'none',
    padding: '14px 24px',
    margin: '8px 8px 0 8px',
    borderRadius: 'var(--radius)',
    display: 'block',
    textAlign: 'center',
  },
}

export default Navbar