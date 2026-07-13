// TourCard.jsx
// The entire card is now clickable — wrapping everything
// in a React Router Link makes the full card a touch target.
// "Book Now" replaced with "View Tour →" — a lower pressure
// invitation that matches the card's role as a discovery surface.
// The booking action lives on the detail page where the visitor
// has full information to make a confident decision.
import { useState } from 'react'
import { Star, Clock, Sparkles, ArrowRight, Watch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getTourLanguages } from '../data/tourLanguages'
import { CANCEL_SHORT_TOUR } from '../data/policy'
import Img from './Img'

// Language flags are parked, not deleted: today every tour runs in English
// and Bosnian, so the flags carry no decision value on the card. Flip this
// back on when the multi-language site/tours ship.
const SHOW_LANGUAGE_FLAGS = false

function TourCard({ id, slug, title, price, oldPrice, rating, reviews, duration, highlights, badge, hero, startingTimes, languages }) {
  const supportedLanguages = getTourLanguages(languages)
  const [cardHovered, setCardHovered] = useState(false)
  // Accepts the highlights array or a pre-computed count.
  const highlightCount = Array.isArray(highlights) ? highlights.length : highlights || 0
  // Display-only discount: `price` stays the single source of truth for all
  // booking math; oldPrice is the struck-through "was" price when set.
  const hasDiscount = Number(oldPrice) > Number(price)
  const discountPct = hasDiscount ? Math.round((1 - price / oldPrice) * 100) : 0

  return (
    // The entire card is wrapped in a Link component.
    // style={{ display: 'block' }} is required because Link
    // renders as an inline element by default — block makes
    // it fill the full grid cell correctly.
    // textDecoration: none removes the default blue underline
    // that browsers apply to all anchor elements.
    <Link
  to={`/tours/${slug || id}`}
  style={styles.cardLink}
  className="tour-card-link"
>
      <div style={styles.card} onMouseEnter={() => setCardHovered(true)} onMouseLeave={() => setCardHovered(false)}>

        {/* ── PHOTO ───────────────────────────────────── */}
        <div style={styles.photoContainer}>
          {hero ? (
            <Img
              src={hero}
              alt={title}
              sizes="(max-width: 768px) 92vw, 380px"
              style={{ ...styles.photo, transform: cardHovered ? 'scale(1.05)' : 'none' }}
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
            {hasDiscount && <span style={styles.discountTag}>−{discountPct}%</span>}
            {hasDiscount && <span style={styles.priceWas}>€{oldPrice}</span>}
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
          <div style={styles.titleWrapper}>
            <h3 style={styles.title}>{title}</h3>
          </div>

          {/* Meta row — duration and group size */}
          <div style={styles.metaRow}>
  <div style={styles.metaItem}>
    <Clock size={13} color="var(--color-n600)" />
    <span style={styles.meta}>{duration}</span>
  </div>
  {highlightCount > 0 && (
    <div style={styles.metaItem}>
      <Sparkles size={13} color="var(--color-n600)" />
      <span style={styles.meta}>{highlightCount} highlights</span>
    </div>
  )}
  {startingTimes && startingTimes.length > 0 && (
    <div style={styles.metaItem}>
      <Watch size={13} color="var(--color-n600)" />
      <span style={styles.meta}>
        {Array.isArray(startingTimes) ? startingTimes.join(' / ') : startingTimes}
      </span>
    </div>
  )}
</div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Footer row — View Tour link replacing Book Now button.
              ArrowRight icon reinforces the directional action —
              this is an invitation to explore, not a demand to commit. */}
          {/* Footer — View Tour CTA */}
          <div style={styles.footer}>
            {/* div, not a Button/Link — the whole card is the anchor; the fill
                follows the card's hover state rather than the button's own */}
            <div
              className="btn btn--secondary btn--sm"
              style={cardHovered ? { backgroundColor: 'var(--color-forest-green)', color: '#fff' } : undefined}
            >
              <span>View tour</span>
              <ArrowRight size={14} color={cardHovered ? '#ffffff' : 'var(--color-forest-green)'} />
            </div>

            {SHOW_LANGUAGE_FLAGS && supportedLanguages.length > 0 && (
              <div
                style={styles.languageFlags}
                aria-label={`Available in ${supportedLanguages.map((language) => language.label).join(' and ')}`}
              >
                {supportedLanguages.map((language) => (
                  <span
                    key={language.id}
                    style={styles.languageFlag}
                    title={language.label}
                    aria-label={language.label}
                  >
                    {language.flag}
                  </span>
                ))}
              </div>
            )}

            {/* The freed slot earns its keep: savings when discounted,
                the true 24h promise otherwise. */}
            {!SHOW_LANGUAGE_FLAGS && (
              hasDiscount
                ? <span style={styles.saveNote}>You save €{oldPrice - price}</span>
                : <span style={styles.cancelNote}>{CANCEL_SHORT_TOUR}</span>
            )}
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
    borderRadius: 'var(--radius-lg)',
    transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  card: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    border: '1px solid var(--color-n200)',
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
    borderRadius: '8px',
    padding: '5px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    zIndex: 1,
  },

  priceAmount: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '20px',
    color: 'var(--color-n000)',
  },

  pricePer: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.7)',
  },

  // Discount treatment — display only. The percent tag floats on the pill's
  // upper-left shoulder instead of cramming into the price row, so the pill
  // stays clean while the amber accent keeps the deal prominent.
  discountTag: {
    position: 'absolute',
    top: '-10px',
    left: '10px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    padding: '2px 7px',
    borderRadius: 'var(--radius-pill)',
    boxShadow: 'var(--shadow-sm)',
  },

  priceWas: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'line-through',
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
    marginBottom: 0,
    lineHeight: '1.3',
  },

  titleWrapper: {
    minHeight: '86px',
    marginBottom: '10px',
  },

  // Wraps between items, never inside them — on narrow cards the row breaks
  // into tidy lines of whole chips instead of splitting "Small group" mid-word.
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px 14px',
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
    whiteSpace: 'nowrap',
  },

  divider: {
    height: '1px',
    backgroundColor: 'var(--color-n200)',
    marginBottom: '14px',
  },

 footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },

  languageFlags: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Soft amber chip — reads as a deal without shouting.
  saveNote: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12.5px',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-amber-light)',
    padding: '4px 12px',
    borderRadius: 'var(--radius-pill)',
    whiteSpace: 'nowrap',
  },

  cancelNote: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '12.5px',
    color: 'var(--color-n500)',
    whiteSpace: 'nowrap',
  },

  languageFlag: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n300)',
    fontSize: '16px',
    lineHeight: 1,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },

}

export default TourCard