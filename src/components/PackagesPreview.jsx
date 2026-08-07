import { useState, useRef } from 'react'
import useWindowWidth from '../hooks/useWindowWidth'
import Button from './Button'
import CarouselNav from './CarouselNav'
import JourneyCard from './JourneyCard'

import { packages } from '../data/packages'

function PackagesPreview() {
  const width = useWindowWidth()
  const isMobile = width <= 640
  const [page, setPage] = useState(0)
  const touchStartX = useRef(null)

  const visibleCount = isMobile ? 1 : 3
  const totalPages = Math.ceil(packages.length / visibleCount)

  return (
    <section style={styles.section}>

      <div style={styles.header}>
        <span style={styles.eyebrow}>Curated Experiences</span>
        <h2 style={styles.title}>Multi-day journeys</h2>
        <p style={styles.subtitle}>
          Want more than a single tour? These journeys combine
          our best experiences into a complete story —
          planned, guided, and taken care of from arrival to departure.
        </p>
      </div>

      {/* Carousel */}
      <div style={styles.carouselOuter}>
        <div
          style={{ ...styles.carouselWrapper, ...(isMobile ? null : styles.carouselBreathe) }}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return
            const delta = touchStartX.current - e.changedTouches[0].clientX
            if (Math.abs(delta) > 40) {
              if (delta > 0) setPage((p) => Math.min(totalPages - 1, p + 1))
              else setPage((p) => Math.max(0, p - 1))
            }
            touchStartX.current = null
          }}
        >
          <div style={{
            ...styles.carouselTrack,
            transform: `translateX(calc(${page} * (-100% - 24px)))`,
          }}>
            {Array.from({ length: totalPages }).map((_, pageIdx) => (
              <div key={pageIdx} style={{
                ...styles.carouselPage,
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              }}>
                {packages.slice(pageIdx * visibleCount, (pageIdx + 1) * visibleCount).map((pkg) => (
                  <JourneyCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>

      <CarouselNav
        page={page}
        total={totalPages}
        onChange={setPage}
        label="journeys"
      />

      <div style={styles.bottomRow}>
        <p style={styles.bottomText}>Looking for a longer journey or a private group?</p>
        <Button to="/multi-day-tours" variant="secondary" arrow>View All Journeys</Button>
      </div>

    </section>
  )
}

const styles = {
  section: {
    backgroundColor: 'var(--color-n000)',
    padding: '88px 40px',
  },

  header: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto 48px auto',
  },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n900)',
    marginBottom: '16px',
  },

  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
  },

  carouselOuter: {
    position: 'relative',
  },

  carouselWrapper: {
    maxWidth: '1160px',
    margin: '0 auto',
    overflow: 'hidden',
  },

  // Desktop only: the wrapper clips (overflow hidden) flush against the
  // cards, amputating the hover lift's shadow (0 20px 56px on
  // .pkg-card:hover). Pad the clip box (12px sides, more vertically) and
  // cancel it with negative margins + a wider max-width so cards sit
  // exactly where they were. The 24px gap between pages (carouselPage
  // marginRight + the track's calc() stride) keeps the next page fully
  // outside the padded clip window — no peeking.
  carouselBreathe: {
    maxWidth: '1184px',
    margin: '-24px auto -32px',
    padding: '24px 12px 32px',
  },

  carouselTrack: {
    display: 'flex',
    transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  carouselPage: {
    display: 'grid',
    gap: '20px',
    minWidth: '100%',
    alignItems: 'stretch',
    marginRight: '24px',
  },

  // Standardized with the "View All Tours" row on Home — same pitch-line +
  // shared <Button> pattern on both sections.
  bottomRow: {
    textAlign: 'center',
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },

  bottomText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    margin: 0,
  },
}

export default PackagesPreview
