// TourCard.jsx
// This is a reusable card component that displays a single tour.
// It receives "props" — short for properties — which are the specific
// details for each tour: its name, price, rating, duration, and badge.
//
// Think of props exactly like parameters in a function.
// The card design is the function — it always looks the same.
// The props are the arguments — they change per tour.
// One design, infinite tours.

import { Link } from 'react-router-dom'

function TourCard({ id, title, price, rating, reviews, duration, groupSize, badge, hero}) {
  return (
    <div style={styles.card}>

      {/* ── PHOTO PLACEHOLDER ──────────────────────────────
          We'll replace this with a real <img> tag once you
          add your tour photos to the assets folder.
          For now it shows a green placeholder so the layout
          is visible and testable without images. */}
      <div style={styles.photoContainer}>
  {badge && (
    <span style={styles.badge}>{badge}</span>
  )}
  {hero ? (
    // Real photo — shown when a hero image has been provided
    <img
      src={hero}
      alt={title}
      style={styles.photo}
    />
  ) : (
    // Fallback placeholder — shown if no photo exists yet
    // This means adding a new tour without a photo won't break the layout
    <div style={styles.photoPlaceholder} />
  )}
</div>

      {/* ── CARD BODY ──────────────────────────────────────
          Everything below the photo lives here. */}
      <div style={styles.body}>

        {/* Star rating row */}
        <div style={styles.ratingRow}>
          <span style={styles.star}>★</span>
          <span style={styles.ratingNumber}>{rating}</span>
          <span style={styles.reviews}>({reviews} reviews)</span>
        </div>

        {/* Tour title */}
        <h3 style={styles.title}>{title}</h3>

        {/* Tour meta — duration and group size */}
        <div style={styles.metaRow}>
          <span style={styles.meta}>⏱ {duration}</span>
          <span style={styles.meta}>👥 Max {groupSize}</span>
        </div>

        {/* Divider line */}
        <div style={styles.divider} />

        {/* Price and CTA row */}
        <div style={styles.footer}>
          <div>
            <span style={styles.price}>€{price}</span>
            <span style={styles.perPerson}> / person</span>
          </div>
          <Link to={`/tours/${id}`} style={styles.bookBtn}>Book Now →</Link>
        </div>

      </div>
    </div>
  )
}

const styles = {
  // The card itself is a white rounded box with a subtle shadow.
  // The shadow lifts it off the page background visually —
  // this is called "elevation" in design systems.
  card: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    overflow: 'hidden',         // Keeps the photo corners rounded
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },

  // Green placeholder until real photos are added.
  // aspect-ratio 4/3 gives it a landscape photo proportion.
 photoContainer: {
    width: '100%',
    aspectRatio: '4/3',
    position: 'relative',
    overflow: 'hidden',
  },

  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',   // Fills the container without stretching —
                          // same as "fill" in Figma or Procreate's
                          // image fill mode. Crops rather than distorts.
    display: 'block',
  },

  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-mid-green)',
  },

  // Badge in the top-left corner of the photo.
  // Uses your Forest Green as background for contrast against the mid-green placeholder.
  badge: {
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '4px',
  },

  body: {
    padding: '20px',
  },

  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '8px',
  },

  star: {
    color: 'var(--color-amber)',
    fontSize: '14px',
  },

  ratingNumber: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },

  reviews: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '12px',
    lineHeight: '1.3',
  },

  metaRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },

  meta: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  divider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    marginBottom: '16px',
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  price: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-forest-green)',
  },

  perPerson: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  // Small inline Book Now button on the card.
  bookBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '36px',
    padding: '0 16px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
  },
}

export default TourCard