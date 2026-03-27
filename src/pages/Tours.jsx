// Tours.jsx
// This is your main tours listing page.
// It imports and reuses the TourCard component we already built —
// this is the payoff of building reusable components.
// Notice we're not rewriting any card design here, just providing data.

import TourCard from '../components/TourCard'

// This array is your tour data — think of it as a mini database living
// inside your code for now. Each object represents one tour with all
// its details. Later, when your business grows, this data would come
// from a real database. But for a first version, this approach is
// clean, fast, and completely sufficient.
import tours from '../data/tours'

function Tours() {
  return (
    <div>

      {/* ── PAGE HEADER ─────────────────────────────────────
          A compact header section — not as tall as the homepage hero.
          Its job is to orient the visitor and set expectations quickly. */}
      <section style={styles.pageHeader}>
        <div style={styles.headerInner}>
          <span style={styles.eyebrow}>Explore Bosnia</span>
          <h1 style={styles.headline}>All Tours</h1>
          <p style={styles.subheading}>
            Six tours. One local guide. Every experience designed to show you
            the Bosnia that most visitors never find.
          </p>
        </div>
      </section>

      {/* ── TOURS GRID ──────────────────────────────────────
          All six tour cards in a responsive grid.
          Same TourCard component as the homepage —
          just with more tours and slightly different layout. */}
      <section style={styles.toursSection}>
        <div style={styles.cardGrid}>

          {/* This is one of React's most powerful patterns — .map()
              loops over your tours array and returns a TourCard for each one.
              Instead of writing six <TourCard /> blocks manually,
              you write the pattern once and React repeats it automatically.
              The "key" prop is required by React whenever you render a list —
              it helps React track which item is which when the list updates. */}
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              id={tour.id}  
              title={tour.title}
              price={tour.price}
              rating={tour.rating}
              reviews={tour.reviews}
              duration={tour.duration}
              groupSize={tour.groupSize}
              badge={tour.badge}
              hero={tour.hero}
            />
          ))}

        </div>
      </section>

    </div>
  )
}

const styles = {
  pageHeader: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '72px 40px',
  },

  headerInner: {
    maxWidth: '680px',
    margin: '0 auto',
    textAlign: 'center',
  },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-mid-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h1)',
    color: 'var(--color-n000)',
    marginBottom: '16px',
  },

  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-amber-light)',
    lineHeight: 'var(--leading-body)',
  },

  toursSection: {
    padding: '72px 40px',
    backgroundColor: 'var(--color-n100)',
  },

  // Three columns on desktop, same as the homepage grid.
  // We'll make this responsive for mobile in a later step.
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '28px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
}

export default Tours