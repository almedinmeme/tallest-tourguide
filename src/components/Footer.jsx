// Footer.jsx
// Redesigned to match the dark, minimal energy of the
// Reviews and CTA Banner sections.
// Background: the same deep dark green-black as the CTA Banner
// so the bottom third of the page feels like one cohesive
// dark environment — Reviews → CTA → Footer flow seamlessly.

import useWindowWidth from '../hooks/useWindowWidth'

import { Link } from 'react-router-dom'
import {
  MapPin,
  Mail,
  Camera,
  Globe,
  ArrowUpRight,
} from 'lucide-react'

function Footer() {

  // Current year — auto-updates every year automatically.
  const year = new Date().getFullYear()

  const width = useWindowWidth()
const isMobile = width <= 768

  return (
   <footer style={{
  ...styles.footer,
  paddingTop: isMobile ? '40px' : '64px',
}}>

      {/* Thin top border — a single amber line that visually
          separates the footer from the CTA banner above it
          while keeping the dark colour continuity.
          Amber was chosen deliberately — it's the brand's
          accent colour and it creates a warm moment of
          transition between the two dark sections. */}
      <div style={styles.topAccent} />

      {/* ── MAIN FOOTER CONTENT ───────────────────────── */}
     <div style={{
  ...styles.inner,
  gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr 1fr 1fr',
  gap: isMobile ? '40px' : '48px',
  paddingBottom: isMobile ? '40px' : '64px',
}}>

        {/* ── COLUMN 1 — Brand ──────────────────────────
            Larger brand presence than the old footer —
            the name, a short brand statement, and
            the social links grouped together. */}
        <div style={styles.brandColumn}>

          <span style={styles.brandName}>Tallest Tourguide</span>

          <p style={styles.brandStatement}>
            Local knowledge. Small groups.<br />
            Real Bosnia. Since day one.
          </p>

          {/* Social links — icon buttons with hover-ready styling */}
          <div style={styles.socialRow}>

            
             <a href="https://www.instagram.com/tallest.tourguide/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialBtn}
              aria-label="Instagram"
            >
              <Camera size={18} color="rgba(255,255,255,0.7)" />
            </a>

            
             <a href="https://www.tripadvisor.com/Attraction_Review-g294450-d14011605-Reviews-Tallest_Tourguide_Tours_and_Excursions-Sarajevo_Sarajevo_Canton_Federation_of_Bo.html"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialBtn}
              aria-label="TripAdvisor"
            >
              {/* TripAdvisor doesn't have an official Lucide icon.
                  Globe is the cleanest semantic substitute —
                  it signals "find us on the web" without
                  misrepresenting any brand. */}
              <Globe size={18} color="rgba(255,255,255,0.7)" />
            </a>

          </div>

        </div>

        {/* ── COLUMN 2 — Navigation ─────────────────────
            Clean minimal link list — no heavy labels,
            just the page names in muted white. */}
        <div style={styles.column}>
          <span style={styles.columnLabel}>Explore</span>
          <nav style={styles.linkList}>
            <Link to="/" style={styles.footerLink}>Home</Link>
            <Link to="/tours" style={styles.footerLink}>Tours</Link>
            <Link to="/packages" style={styles.footerLink}>Packages</Link>
            <Link to="/contact" style={styles.footerLink}>Contact</Link>
          </nav>
        </div>

        {/* ── COLUMN 3 — Contact ────────────────────────
            Direct contact details with Lucide icons.
            Same icon language used throughout the site. */}
        <div style={styles.column}>
          <span style={styles.columnLabel}>Find Us</span>
          <div style={styles.contactList}>

            <div style={styles.contactItem}>
              <MapPin size={14} color="var(--color-mid-green)" />
              <span style={styles.contactText}>
                Sarajevo, Bosnia & Herzegovina
              </span>
            </div>

            <div style={styles.contactItem}>
              <Mail size={14} color="var(--color-mid-green)" />
              
               <a href="mailto:tallest.tourguide@gmail.com"
                style={styles.contactLink}
              >
                hello@tallesttourguide.com
              </a>
            </div>

          </div>
        </div>

        {/* ── COLUMN 4 — TripAdvisor CTA ────────────────
            A dedicated column for the TripAdvisor link —
            elevated from a simple text link to a proper
            card-like element that signals its importance.
            180 reviews is a serious social proof number
            and it deserves more than a footer footnote. */}
        <div style={styles.column}>
          <span style={styles.columnLabel}>Reviews</span>

          
            <a href="https://www.tripadvisor.com/Attraction_Review-g294450-d14011605-Reviews-Tallest_Tourguide_Tours_and_Excursions-Sarajevo_Sarajevo_Canton_Federation_of_Bo.html"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.tripAdvisorCard}
          >
            <div style={styles.tripAdvisorTop}>
              <Globe size={20} color="var(--color-mid-green)" />
              <ArrowUpRight size={16} color="rgba(255,255,255,0.4)" />
            </div>
            <p style={styles.tripAdvisorRating}>★★★★★</p>
            <p style={styles.tripAdvisorCount}>180 reviews</p>
            <p style={styles.tripAdvisorLabel}>Read on TripAdvisor</p>
          </a>

        </div>

      </div>

      {/* ── BOTTOM BAR ────────────────────────────────── */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomDivider} />
        <div style={{
  ...styles.bottomRow,
  flexDirection: isMobile ? 'column' : 'row',
  gap: isMobile ? '8px' : '0',
  textAlign: isMobile ? 'center' : 'left',
}}>
          <span style={styles.copyright}>
            © {year} Tallest Tourguide. All rights reserved.
          </span>
          <span style={styles.madeWith}>
            Sarajevo, Bosnia & Herzegovina
          </span>
        </div>
      </div>

    </footer>
  )
}

const styles = {
  // Same dark background as CTABanner — the two sections
  // flow into each other as one unified dark environment.
  footer: {
    backgroundColor: '#0D1F18',
    paddingTop: '64px',
  },

  // Thin amber line at the very top of the footer.
  // Creates a moment of warmth between CTA and footer
  // without breaking the dark continuity.
  topAccent: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, var(--color-amber), transparent)',
    marginBottom: '64px',
  },

  inner: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
    gap: '48px',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 40px 64px 40px',
  },

  brandColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  brandName: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '22px',
    color: 'var(--color-n000)',
    letterSpacing: '-0.3px',
  },

  brandStatement: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: '1.7',
    margin: 0,
  },

  socialRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '4px',
  },

  // Social icon buttons — minimal dark pill shape.
  // Large enough to tap on mobile, small enough
  // not to dominate the brand column.
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
  },

  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  // Column labels — small uppercase tracking, muted.
  // Clearly labels each column without competing with
  // the content below it.
  columnLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },

  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  footerLink: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.55)',
    textDecoration: 'none',
  },

  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },

  contactText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: '1.5',
  },

  contactLink: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.55)',
    textDecoration: 'none',
  },

  // TripAdvisor card — a small dark card with a border
  // that elevates the review count above a plain text link.
  // It functions like a mini widget — self-contained,
  // clearly clickable, with the star rating displayed
  // prominently in amber.
  tripAdvisorCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
  },

  tripAdvisorTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },

  tripAdvisorRating: {
    color: 'var(--color-amber)',
    fontSize: '16px',
    margin: 0,
    letterSpacing: '2px',
  },

  tripAdvisorCount: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '20px',
    color: 'var(--color-n000)',
    margin: 0,
  },

  tripAdvisorLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
  },

  bottomBar: {
    padding: '0 40px 32px 40px',
    maxWidth: '1100px',
    margin: '0 auto',
  },

  bottomDivider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginBottom: '24px',
  },

  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  copyright: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-tiny)',
    color: 'rgba(255,255,255,0.25)',
  },

  madeWith: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-tiny)',
    color: 'rgba(255,255,255,0.25)',
  },
}

export default Footer