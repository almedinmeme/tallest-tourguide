// Footer.jsx
import { useState } from 'react'
import useWindowWidth from '../hooks/useWindowWidth'
import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react'
import logo from '../assets/logo.svg'

function Footer() {
  const year = new Date().getFullYear()
  const width = useWindowWidth()
  const isMobile = width <= 768

  const [igHovered, setIgHovered] = useState(false)
  const [taHovered, setTaHovered] = useState(false)
  const [waHovered, setWaHovered] = useState(false)
  const [taCardHovered, setTaCardHovered] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)

  return (
   <footer style={{
    ...styles.footer,
    paddingTop: isMobile ? '40px' : '64px',
  }}>

      <div style={styles.topAccent} />

      <div style={{
        ...styles.inner,
        gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr 1fr 1fr',
        gap: isMobile ? '40px' : '48px',
        paddingBottom: isMobile ? '40px' : '64px',
      }}>

        {/* ── COLUMN 1 — Brand ── */}
        <div style={styles.brandColumn}>
          <Link to="/" style={{ display: 'block' }}>
            <img src={logo} alt="Tallest Tourguide" style={styles.footerLogo} />
          </Link>
          <p style={styles.brandStatement}>
            Local knowledge. Small groups.<br />
            Real Bosnia and Herzegovina. Raw Balkan.
          </p>

          {/* Social links — text links */}
          <div style={styles.socialRow}>
            <a
              href="https://www.instagram.com/tallest.tourguide/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.socialLink,
                color: igHovered ? 'var(--color-amber)' : 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={() => setIgHovered(true)}
              onMouseLeave={() => setIgHovered(false)}
            >
              Instagram
            </a>
            <span style={styles.socialDot}>·</span>
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g294450-d14011605-Reviews-Tallest_Tourguide_Tours_and_Excursions-Sarajevo_Sarajevo_Canton_Federation_of_Bo.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.socialLink,
                color: taHovered ? 'var(--color-amber)' : 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={() => setTaHovered(true)}
              onMouseLeave={() => setTaHovered(false)}
            >
              TripAdvisor
            </a>
            <span style={styles.socialDot}>·</span>
            <a
              href="https://wa.me/38762664244"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.socialLink,
                color: waHovered ? 'var(--color-amber)' : 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={() => setWaHovered(true)}
              onMouseLeave={() => setWaHovered(false)}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* ── COLUMN 2 — Navigation ── */}
        <div style={styles.column}>
          <span style={styles.columnLabel}>Explore</span>
          <nav style={styles.linkList}>
            {[
              { to: '/tours', label: 'Tours' },
              { to: '/multi-day-tours', label: 'Multi-day tours' },
              { to: '/personalised', label: 'Personalised Tour' },
              { to: '/blog', label: 'Blog' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  ...styles.footerLink,
                  color: hoveredLink === to ? 'var(--color-amber)' : 'rgba(255,255,255,0.55)',
                }}
                onMouseEnter={() => setHoveredLink(to)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── COLUMN 3 — Info ── */}
        <div style={styles.column}>
          <span style={styles.columnLabel}>Info</span>
          <nav style={styles.linkList}>
            {[
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
              { to: '/safe-travels', label: 'Safe Travels' },
              { to: '/booking-conditions', label: 'Booking Conditions' },
              { to: '/practical-info', label: 'Practical Info' },
              { to: '/bosnia-guide', label: 'Bosnia Travel Guide' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  ...styles.footerLink,
                  color: hoveredLink === to ? 'var(--color-amber)' : 'rgba(255,255,255,0.55)',
                }}
                onMouseEnter={() => setHoveredLink(to)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── COLUMN 4 — TripAdvisor CTA ── */}
        <div style={styles.column}>
          <span style={styles.columnLabel}>Reviews</span>
          <a
            href="https://www.tripadvisor.com/Attraction_Review-g294450-d14011605-Reviews-Tallest_Tourguide_Tours_and_Excursions-Sarajevo_Sarajevo_Canton_Federation_of_Bo.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...styles.tripAdvisorCard,
              backgroundColor: taCardHovered ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
              borderColor: taCardHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              transform: taCardHovered ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={() => setTaCardHovered(true)}
            onMouseLeave={() => setTaCardHovered(false)}
          >
            <div style={styles.tripAdvisorTop}>
              <span style={styles.tripAdvisorBrand}>TripAdvisor</span>
              <ArrowUpRight size={16} color="rgba(255,255,255,0.4)" />
            </div>
            <p style={styles.tripAdvisorRating}>★★★★★</p>
            <p style={styles.tripAdvisorCount}>180 reviews</p>
            <p style={styles.tripAdvisorLabel}>Read on TripAdvisor</p>
          </a>
        </div>

      </div>

      {/* ── FIND US BAR ── */}
      <div style={styles.findUsBar}>
        <div style={styles.bottomDivider} />
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: isMobile ? '16px' : '32px',
          justifyContent: isMobile ? 'center' : 'flex-start',
        }}>
          <span style={styles.columnLabel}>Find Us</span>
          <div style={styles.contactItem}>
            <MapPin size={13} color="var(--color-mid-green)" style={{ flexShrink: 0 }} />
            <a
              href="https://www.google.com/maps/place/Tallest+Tourguide+%26+Friends/@43.8568344,18.4235815,17z/data=!3m1!4b1!4m6!3m5!1s0x4758c99dd99dd453:0xdf1f0c03f4626494!8m2!3d43.8568344!4d18.4265152!16s%2Fg%2F11nc0x5ysx?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.contactLink}
            >
              Hamdije Kreševljakovića 61, Sarajevo
            </a>
          </div>
          <div style={styles.contactItem}>
            <Mail size={13} color="var(--color-mid-green)" style={{ flexShrink: 0 }} />
            <a href="mailto:tallest.tourguide@gmail.com" style={styles.contactLink}>
              tallest.tourguide@gmail.com
            </a>
          </div>
          <div style={styles.contactItem}>
            <Phone size={13} color="var(--color-mid-green)" style={{ flexShrink: 0 }} />
            <a href="https://wa.me/38762664244" target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
              +387 62 664 244
            </a>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
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
          <span style={styles.madeWith}>Sarajevo, Bosnia & Herzegovina</span>
        </div>
      </div>

    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: '#0D1F18',
    paddingTop: '64px',
  },

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
    alignItems: 'flex-start',
    gap: '16px',
  },

  footerLogo: {
    height: '60px',
    width: 'auto',
    display: 'block',
    opacity: 0.9,
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
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
    flexWrap: 'wrap',
  },

  socialLink: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },

  socialDot: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: '14px',
  },

  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

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
    transition: 'color 0.2s ease',
  },

  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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

  tripAdvisorCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    textDecoration: 'none',
    cursor: 'pointer',
  },

  tripAdvisorTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },

  tripAdvisorBrand: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '12px',
    color: 'var(--color-mid-green)',
    letterSpacing: '0.3px',
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

  findUsBar: {
    padding: '0 40px 24px 40px',
    maxWidth: '1100px',
    margin: '0 auto',
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
  legalLink: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-tiny)',
    color: 'rgba(255,255,255,0.35)',
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
}

export default Footer