// Navbar.jsx
// This component appears on every single page of your site.
// It handles your branding, navigation links, and the primary CTA button.
// We import Link from React Router instead of using <a> tags — 
// this keeps navigation within React without triggering a full page reload.

import { Link } from 'react-router-dom'
import useWindowWidth from '../hooks/useWindowWidth'

function Navbar() {
  const width = useWindowWidth()
const isMobile = width <= 768
  return (
    <nav style={styles.nav}>

      {/* Your brand name on the left — links back to the homepage */}
      <Link to="/" style={styles.brand}>
        Tallest Tourguide
      </Link>

      {/* Navigation links in the center */}
  {!isMobile && (
  <div style={styles.links}>
    <Link to="/" style={styles.link}>Home</Link>
    <Link to="/tours" style={styles.link}>Tours</Link>
    <Link to="/packages" style={styles.link}>Packages</Link>
    <Link to="/contact" style={styles.link}>Contact</Link>
  </div>
)}
      {/* Primary CTA button on the right — this is your Warm Amber "Book Now" */}
      <Link to="/tours" style={styles.cta}>
        Book Now
      </Link>

    </nav>
  )
}

// We're writing styles directly in this file for now using JavaScript objects.
// Every CSS property name is camelCase here — so "background-color" becomes "backgroundColor".
// We'll move to proper CSS files once the structure is solid.
const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    height: '68px',
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n300)',
    position: 'sticky',       // Stays at the top as the user scrolls
    top: 0,
    zIndex: 100,              // Sits above all other content
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
    fontWeight: '500',
    color: 'var(--color-n600)',
    textDecoration: 'none',
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
}

export default Navbar