// CTABanner.jsx
// The homepage's closing argument. The "story" idea is made literal: a small
// cluster of tilted snapshots — real photos from the top tours — sits beside
// the headline like pages from a travel journal. Deep forest background so
// the section reads as a distinct final chapter, not another light strip.

import { ArrowRight } from 'lucide-react'
import Button from './Button'
import tours from '../data/tours'
import useWindowWidth from '../hooks/useWindowWidth'

function CTABanner() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  // The first three tours (admin drag-order) supply the snapshots.
  const snapshots = tours.slice(0, 3).map((t) => ({
    src: t.hero,
    caption: t.city || 'Bosnia',
    slug: t.slug,
  }))

  const rotations = ['-5deg', '3deg', '-2deg']

  return (
    <section style={styles.section}>
      <div style={styles.glow} />

      <div
        style={{
          ...styles.inner,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '48px' : '72px',
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        {/* ── TEXT SIDE ─────────────────────────────────── */}
        <div style={{ ...styles.textSide, alignItems: isMobile ? 'center' : 'flex-start' }}>
          <span style={styles.eyebrow}>
            Vidimo se <span style={styles.eyebrowNote}>— “see you there”, in Bosnian</span>
          </span>

          <h2 style={{ ...styles.headline, fontSize: isMobile ? '32px' : '46px' }}>
            <span style={styles.headlineThin}>Your next great story</span>{' '}
            <span style={styles.headlineBold}>starts here.</span>
          </h2>

          <p style={{ ...styles.subtext, maxWidth: isMobile ? '340px' : '440px' }}>
            Every tour ends the same way — someone saying “I didn't expect that.”
            Come collect a story worth retelling.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              flexWrap: 'wrap',
              gap: '12px',
              width: isMobile ? '100%' : 'auto',
              marginTop: '8px',
            }}
          >
            <Button to="/tours" variant="primary" style={{ width: isMobile ? '100%' : 'auto' }}>
              <span>Book a tour</span>
              <ArrowRight size={16} color="var(--color-n900)" />
            </Button>
            <Button to="/personalised" variant="secondary" onDark style={{ width: isMobile ? '100%' : 'auto' }}>
              Plan your trip — it's free
            </Button>
          </div>

          <div style={{ ...styles.trustRow, justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <span style={styles.trustItem}>✓ Free cancellation</span>
            <span style={styles.trustDot}>·</span>
            <span style={styles.trustItem}>✓ Confirmed within 24h</span>
            <span style={styles.trustDot}>·</span>
            <span style={styles.trustItem}>✓ Small groups only</span>
          </div>
        </div>

        {/* ── SNAPSHOT CLUSTER ──────────────────────────── */}
        <div
          style={{
            ...styles.photoCluster,
            transform: isMobile ? 'scale(0.82)' : 'none',
            margin: isMobile ? '-24px 0' : '0',
          }}
          aria-hidden
        >
          {snapshots.map((snap, i) => (
            <div
              key={snap.slug}
              className="cta-snapshot"
              style={{
                ...styles.snapshot,
                transform: `rotate(${rotations[i]})`,
                marginLeft: i === 0 ? 0 : '-36px',
                marginTop: i === 1 ? '28px' : 0,
                zIndex: i === 1 ? 2 : 1,
              }}
            >
              <img src={snap.src} alt="" loading="lazy" style={styles.snapshotImg} />
              <span style={styles.snapshotCaption}>{snap.caption}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    backgroundColor: 'var(--color-forest-deep)',
    padding: '104px 40px',
    position: 'relative',
    overflow: 'hidden',
  },

  // Warm glow behind the photos — candlelight against the deep green.
  glow: {
    position: 'absolute',
    top: '50%',
    right: '10%',
    transform: 'translateY(-50%)',
    width: '640px',
    height: '480px',
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(244,161,48,0.10) 0%, transparent 65%)',
    pointerEvents: 'none',
  },

  inner: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '1080px',
    margin: '0 auto',
  },

  textSide: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },

  eyebrow: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-amber)',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
  },

  eyebrowNote: {
    fontWeight: '500',
    textTransform: 'none',
    letterSpacing: '0.2px',
    color: 'rgba(255,255,255,0.55)',
    fontStyle: 'italic',
  },

  headline: {
    fontFamily: 'var(--font-hero)',
    color: 'var(--color-n000)',
    lineHeight: '1.12',
    margin: 0,
  },

  headlineThin: {
    fontWeight: '300',
    fontStyle: 'italic',
    opacity: 0.92,
  },

  headlineBold: {
    fontWeight: '800',
  },

  subtext: {
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'rgba(255,255,255,0.72)',
    lineHeight: '1.7',
    margin: 0,
  },

  trustRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '4px',
  },

  trustItem: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    whiteSpace: 'nowrap',
  },

  trustDot: {
    color: 'rgba(255,255,255,0.3)',
  },

  // ── Snapshots ──────────────────────────────────────────
  photoCluster: {
    display: 'flex',
    alignItems: 'flex-start',
    flexShrink: 0,
  },

  snapshot: {
    backgroundColor: '#FDFBF6',
    padding: '8px 8px 30px',
    borderRadius: '4px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
    width: '192px',
    transition: 'transform 0.25s ease',
  },

  snapshotImg: {
    width: '100%',
    height: '172px',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '2px',
  },

  snapshotCaption: {
    display: 'block',
    fontFamily: 'var(--font-hero)',
    fontStyle: 'italic',
    fontSize: '14px',
    color: '#3a352c',
    textAlign: 'center',
    marginTop: '8px',
  },
}

export default CTABanner
