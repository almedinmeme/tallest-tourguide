// TourCard.jsx
// The entire card is now clickable — wrapping everything
// in a React Router Link makes the full card a touch target.
// "Book Now" replaced with "View Tour →" — a lower pressure
// invitation that matches the card's role as a discovery surface.
// The booking action lives on the detail page where the visitor
// has full information to make a confident decision.

import { Link } from 'react-router-dom'
import { Star, Clock, Users, ArrowRight } from 'lucide-react'

function TourCard({ id, title, price, rating, reviews, duration, groupSize, badge, hero }) {
  return (
    // The entire card is wrapped in a Link component.
    // style={{ display: 'block' }} is required because Link
    // renders as an inline element by default — block makes
    // it fill the full grid cell correctly.
    // textDecoration: none removes the default blue underline
    // that browsers apply to all anchor elements.
    <Link
  to={`/tours/${id}`}
  style={styles.cardLink}
  className="tour-card-link"
>
      <div style={styles.card}>

        {/* ── PHOTO ───────────────────────────────────── */}
        <div style={styles.photoContainer}>
          {hero ? (
            <img
              src={hero}
              alt={title}
              style={styles.photo}
            />
          ) : (
            <div style={styles.photoPlaceholder} />
          )}

          {badge && (
            <span style={styles.badge}>{badge}</span>
          )}

          {/* Price pill overlaid on the bottom right of the photo.
              Moving the price here frees up space in the card body
              and creates a cleaner, more modern card layout.
              Visitors see the price immediately without scrolling
              through the card details first. */}
          <div style={styles.pricePill}>
            <span style={styles.priceAmount}>€{price}</span>
            <span style={styles.pricePer}>/person</span>
          </div>

        </div>

        {/* ── CARD BODY ───────────────────────────────── */}
        <div style={styles.body}>

          {/* Rating row */}
          <div style={styles.ratingRow}>
            <Star size={13} color="var(--color-amber)" fill="var(--color-amber)" />
            <span style={styles.ratingNumber}>{rating}</span>
            <span style={styles.reviews}>({reviews} reviews)</span>
          </div>

          {/* Tour title */}
          <h3 style={styles.title}>{title}</h3>

          {/* Meta row — duration and group size */}
          <div style={styles.metaRow}>
            <div style={styles.metaItem}>
              <Clock size={13} color="var(--color-n600)" />
              <span style={styles.meta}>{duration}</span>
            </div>
            <div style={styles.metaItem}>
              <Users size={13} color="var(--color-n600)" />
              <span style={styles.meta}>Max {groupSize}</span>
            </div>
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Footer row — View Tour link replacing Book Now button.
              ArrowRight icon reinforces the directional action —
              this is an invitation to explore, not a demand to commit. */}
          {/* Footer — View Tour CTA */}
          <div style={styles.footer}>
            <div style={styles.viewTourBtn}>
              <span style={styles.viewTour}>View Tour</span>
              <ArrowRight size={14} color="var(--color-forest-green)" />
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}

const styles = {
  // cardLink wraps the entire card in a Link.
  // display block fills the grid cell fully.
  // All hover effect is applied here so the entire
  // card lifts on hover — not just the button.
cardLink: {
    display: 'block',
    textDecoration: 'none',
    borderRadius: '12px',
    transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  card: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    border: '1px solid var(--color-n300)',
    height: '100%',
  },

  photoContainer: {
    width: '100%',
    aspectRatio: '4/3',
    position: 'relative',
    overflow: 'hidden',
  },

  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    // Subtle zoom on hover — the card link transition
    // handles the lift, this handles the photo zoom.
    // Both together create a premium interactive feel.
    transition: 'transform 0.4s ease',
  },

  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-mid-green)',
  },

  // Badge — absolute position inside photo container.
  // Never affects layout, always overlays the photo.
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '4px',
    zIndex: 1,
  },

  // Price pill — bottom right of photo.
  // Dark semi-transparent background ensures readability
  // against any photo colour — light or dark.
  pricePill: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(4px)',
    borderRadius: '6px',
    padding: '5px 10px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '3px',
    zIndex: 1,
  },

  priceAmount: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '16px',
    color: 'var(--color-n000)',
  },

  pricePer: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.7)',
  },

  body: {
    padding: '16px 20px 20px 20px',
  },

  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '8px',
  },

  ratingNumber: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--color-n900)',
  },

  reviews: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
  },

  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '10px',
    lineHeight: '1.3',
  },

  metaRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '14px',
  },

  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },

  meta: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
  },

  divider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    marginBottom: '14px',
  },

 footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  viewTourBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '34px',
    padding: '0 14px',
    border: '1.5px solid var(--color-forest-green)',
    borderRadius: '100px',   // Full pill shape
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s ease',
  },

  viewTour: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-forest-green)',
    letterSpacing: '0.3px',
  },
}

export default TourCard