import { Link } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'

function CTABanner() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <section style={styles.section}>

      {/* Subtle grain texture overlay — a semi-transparent
          radial gradient that adds depth to the flat dark background
          without adding any visual noise or competing elements.
          Pure CSS, zero performance cost. */}
      <div style={styles.glow} />

      <div style={{
        ...styles.inner,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '40px' : '0',
        textAlign: isMobile ? 'center' : 'left',
        alignItems: isMobile ? 'center' : 'center',
      }}>

        {/* ── LEFT SIDE — Headline ─────────────────────── */}
        <div style={{
  ...styles.leftSide,
  paddingRight: isMobile ? '0' : '64px',
}}>

          <span style={styles.eyebrow}>Sarajevo · Bosnia</span>

          <h2 style={{
            ...styles.headline,
            fontSize: isMobile ? '32px' : '52px',
          }}>
            Your next great<br />
            story starts here.
          </h2>

          <p style={styles.subtext}>
            Small groups. Local knowledge. No two tours the same.
          </p>

        </div>

        {/* Vertical divider — desktop only.
            A single 1px line that creates visual separation
            between the headline and the action side without
            using heavy visual elements like cards or boxes. */}
        {!isMobile && (
          <div style={styles.verticalDivider} />
        )}

        {/* ── RIGHT SIDE — Actions ─────────────────────── */}
       <div style={{
  ...styles.rightSide,
  alignItems: isMobile ? 'center' : 'flex-start',
  paddingLeft: isMobile ? '0' : '64px',
}}>

    

          {/* CTA buttons — stacked on mobile, side by side on desktop */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '12px',
            width: '100%',
          }}>

            <Link to="/tours" style={{
              ...styles.primaryBtn,
              justifyContent: 'center',
              flex: isMobile ? 'none' : 1,
              width: isMobile ? '100%' : 'auto',
            }} className="btn-lift btn-glow-green">
              <span>Book a Tour</span>
              <ArrowRight size={16} color="var(--color-n000)" />
            </Link>

            <Link to="/contact" style={{
              ...styles.secondaryBtn,
              justifyContent: 'center',
              flex: isMobile ? 'none' : 1,
              width: isMobile ? '100%' : 'auto',
            }} className="btn-lift">
              <Mail size={15} color="var(--color-forest-green)" />
              <span>Contact Us</span>
            </Link>

          </div>

          {/* Trust micro-copy — three signals stacked vertically
              rather than in a single line. Easier to scan,
              more breathing room per item. */}
         <div style={{
  ...styles.trustStack,
  alignItems: isMobile ? 'center' : 'flex-start',
}}>
            <span style={styles.trustItem}>✓ Free cancellation</span>
            <span style={styles.trustItem}>✓ Confirmed within 24h</span>
            <span style={styles.trustItem}>✓ Small groups only</span>
          </div>

        </div>

      </div>

    </section>
  )
}

const styles = {
  // Deep dark background — breaks completely from the
  // Forest Green of both the hero and the reviews section.
  // The slight green undertone keeps it on-brand without
  // repeating the same green.
   section: {
    backgroundColor: '#F0F7F4',  // Very light mint green — on brand but light
    padding: '96px 40px',
    position: 'relative',
    overflow: 'hidden',
  },

  // A soft radial glow in the center of the section —
  // Forest Green at 15% opacity, fading to transparent.
  // Creates depth and warmth on the dark background
  // without adding any visible element.
 glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(46,125,94,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },

  inner: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '1000px',
    margin: '0 auto',
  },

  leftSide: {
    flex: 1,
    paddingRight: '64px',
  },

eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '20px',
  },

  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: 'var(--color-n900)',  // Dark on light background
    lineHeight: '1.15',
    marginBottom: '16px',
  },

  subtext: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',  // Body text color
    lineHeight: 'var(--leading-body)',
  },

  verticalDivider: {
    width: '1px',
    backgroundColor: 'var(--color-n300)',  // Light grey on light bg
    alignSelf: 'stretch',
    flexShrink: 0,
  },

  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'var(--color-forest-green)',  // Green on light bg
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },

  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'transparent',
    color: 'var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    border: '1.5px solid var(--color-forest-green)',
    whiteSpace: 'nowrap',
  },

  trustStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '8px',
  },

  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',  // Readable on light background
  },
}

export default CTABanner