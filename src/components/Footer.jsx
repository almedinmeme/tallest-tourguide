// Footer.jsx
// The footer appears on every page, just like the Navbar.
// It serves three practical purposes:
// 1. Navigation safety net — visitors who scroll past all content
//    can still find their way around without scrolling back up.
// 2. Trust signals — showing your contact info and social links
//    tells visitors there's a real human behind this business.
// 3. Legal — copyright line at the bottom.

import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={styles.footer}>

      {/* ── TOP ROW ─────────────────────────────────────────
          Three columns: brand info, navigation, and contact.
          On mobile these will stack vertically. */}
      <div style={styles.topRow}>

        {/* Column 1 — Brand */}
        <div style={styles.column}>
          <span style={styles.brandName}>Tallest Tourguide</span>
          <p style={styles.brandTagline}>
            Local knowledge. Small groups.<br />
            Real Bosnia.
          </p>
        </div>

        {/* Column 2 — Navigation links */}
        <div style={styles.column}>
          <span style={styles.columnTitle}>Explore</span>
          <Link to="/" style={styles.footerLink}>Home</Link>
          <Link to="/tours" style={styles.footerLink}>Tours</Link>
          <Link to="/packages" style={styles.footerLink}>Packages</Link>
          <Link to="/contact" style={styles.footerLink}>Contact</Link>
        </div>

        {/* Column 3 — Contact info */}
        <div style={styles.column}>
          <span style={styles.columnTitle}>Get in Touch</span>
          <span style={styles.contactLine}>Sarajevo, Bosnia & Herzegovina</span>
          <a href="mailto:hello@tallesttourguide.com" style={styles.footerLink}>
            hello@tallesttourguide.com
          </a>
          {/* We'll wire these social links up once you have your handles */}
          <a href="#" style={styles.footerLink}>Instagram</a>
          <a href="#" style={styles.footerLink}>TripAdvisor</a>
        </div>

      </div>

      {/* ── BOTTOM ROW ──────────────────────────────────────
          Divider line + copyright. Kept minimal intentionally. */}
      <div style={styles.divider} />
      <div style={styles.bottomRow}>
        <span style={styles.copyright}>
          © {new Date().getFullYear()} Tallest Tourguide. All rights reserved.
        </span>
      </div>

    </footer>
  )
}

// A quick note on {new Date().getFullYear()} above —
// this is a tiny piece of JavaScript running inside your JSX.
// It reads the current year from the user's device automatically,
// so you never have to manually update the copyright year. Ever.

const styles = {
  footer: {
    backgroundColor: 'var(--color-n900)',
    padding: '64px 40px 32px 40px',
  },

  topRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '40px',
    maxWidth: '1100px',
    margin: '0 auto',
    paddingBottom: '48px',
  },

  column: {
    display: 'flex',
    flexDirection: 'column',  // Stacks children vertically
    gap: '12px',
  },

  brandName: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '18px',
    color: 'var(--color-n000)',
  },

  brandTagline: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n300)',
    lineHeight: 'var(--leading-body)',
  },

  columnTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n000)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },

  footerLink: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n300)',
    textDecoration: 'none',
  },

  contactLine: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n300)',
  },

  divider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    maxWidth: '1100px',
    margin: '0 auto 24px auto',
  },

  bottomRow: {
    maxWidth: '1100px',
    margin: '0 auto',
  },

  copyright: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-tiny)',
    color: 'var(--color-n300)',
  },
}

export default Footer