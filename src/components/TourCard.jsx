// TourCard.jsx
// The entire card is clickable — wrapping everything in a React Router
// Link makes the full card a touch target. There is no "View tour" button:
// it duplicated the link the card already is, and cost 59px of card height
// (a 44px .btn--sm plus its divider) to say nothing the card didn't. The
// hover affordance lives on the title instead.
//
// The card is laid out so every instance is the same shape regardless of
// its content — three fixed blocks under the photo: rating, a title clamped
// to three lines, and a 2×2 meta panel. Facts are grouped by kind: all the
// money on the photo's price pill, the two time facts side by side on the
// panel's top row.
import { useState } from 'react'
import { Star, Clock, AlarmClock, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getTourLanguages } from '../data/tourLanguages'
import Img from './Img'
import { useCurrency } from '../context/CurrencyContext'

// Language flags are parked, not deleted: today every tour runs in English
// and Bosnian, so the flags carry no decision value on the card. Flip this
// back on when the multi-language site/tours ship.
const SHOW_LANGUAGE_FLAGS = false

function TourCard({ id, slug, title, price, oldPrice, rating, reviews, duration, groupSize, highlights, badge, hero, startingTimes, languages }) {
  const { format } = useCurrency()
  const supportedLanguages = getTourLanguages(languages)
  const [cardHovered, setCardHovered] = useState(false)
  // Accepts the highlights array or a pre-computed count.
  const highlightCount = Array.isArray(highlights) ? highlights.length : highlights || 0
  // Display-only discount: `price` stays the single source of truth for all
  // booking math; oldPrice is the struck-through "was" price when set.
  const hasDiscount = Number(oldPrice) > Number(price)
  const discountPct = hasDiscount ? Math.round((1 - price / oldPrice) * 100) : 0
  const times = Array.isArray(startingTimes) ? startingTimes.join(' / ') : startingTimes

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

          {/* The whole money story lives in this one pill: the discount tag,
              the struck "was" price, the price, and the unit. It used to be
              split — percentage and price here, "You save €14" down in the
              footer — which scattered one decision across two ends of the
              card and said the same thing twice. */}
          <div style={styles.pricePill}>
            {hasDiscount && <span style={styles.discountTag}>−{discountPct}%</span>}
            {hasDiscount && <span style={styles.priceWas}>{format(oldPrice)}</span>}
            <span style={styles.priceAmount}>{format(price)}</span>
            <span style={styles.pricePer}>/person</span>
          </div>

        </div>

        {/* ── CARD BODY ───────────────────────────────── */}
        <div style={styles.body}>

          {/* Rating row */}
          <div style={styles.ratingRow}>
            <Star size={14} color="var(--color-amber)" fill="var(--color-amber)" />
            <span style={styles.ratingNumber}>{rating}</span>
            <span style={styles.reviews}>({reviews} reviews)</span>
          </div>

          {/* Tour title — shifts to green on card hover. The card is a link
              with no button in it, so the title carries the affordance. */}
          <div style={styles.titleWrapper}>
            <h3 style={{ ...styles.title, color: cardHovered ? 'var(--color-forest-green)' : 'var(--color-n900)' }}>
              {title}
            </h3>
          </div>

          {/* Meta panel — four facts in a fixed 2×2, not a wrapping row.
              Wrapping made every card break at a different point and let the
              nowrap chips spill past the card edge. The grid puts the two
              time facts side by side on the top row, aligns the columns
              across every card, and can never overflow. */}
          <div style={styles.metaRow}>
            {times && (
              <div style={styles.metaItem}>
                <AlarmClock size={14} color="var(--color-forest-green)" style={styles.metaIcon} />
                <span style={styles.meta}>{times}</span>
              </div>
            )}
            <div style={styles.metaItem}>
              <Clock size={14} color="var(--color-forest-green)" style={styles.metaIcon} />
              <span style={styles.meta}>{duration}</span>
            </div>
            {Number(groupSize) > 0 && (
              <div style={styles.metaItem}>
                <Users size={14} color="var(--color-forest-green)" style={styles.metaIcon} />
                <span style={styles.meta}>Max {groupSize} people</span>
              </div>
            )}
            {highlightCount > 0 && (
              <div style={styles.metaItem}>
                <Sparkles size={14} color="var(--color-forest-green)" style={styles.metaIcon} />
                <span style={styles.meta}>{highlightCount} highlights</span>
              </div>
            )}
          </div>

          {/* No footer line. The free-cancellation note used to live here and
              cost a whole row to repeat a policy that already appears on the
              tour page and in the booking flow — on a discovery card it was
              paying rent in height without helping anyone choose. The saving
              is likewise fully told by the price pill (−17%, struck price,
              lower price), so nothing needs restating down here.
              The parked language flags keep their slot for when the
              multi-language tours ship. */}
          {SHOW_LANGUAGE_FLAGS && supportedLanguages.length > 0 && (
            <div
              style={styles.footer}
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

  // Flex column so the body can stretch and the footer can pin to the
  // bottom. Without this, a card with a 3-line title or a wrapped meta row
  // ends its content higher or lower than its neighbours and the grid row
  // looks ragged — the cards have to read as one row, not as N variants.
  card: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    border: '1px solid var(--color-n200)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  photoContainer: {
    width: '100%',
    aspectRatio: '4/3',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
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
    fontSize: 'var(--text-tiny)',
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
    fontSize: 'var(--text-tiny)',
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
    fontSize: 'var(--text-tiny)',
    padding: '2px 7px',
    borderRadius: 'var(--radius-pill)',
    boxShadow: 'var(--shadow-sm)',
  },

  priceWas: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-tiny)',
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'line-through',
  },

  // No bottom padding: the meta panel below is full-bleed and supplies its
  // own, so it can run edge to edge into the card's rounded bottom corners.
  body: {
    padding: '16px 20px 0',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
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
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },

  reviews: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  // Capped at three lines. 86px is exactly three lines at --text-h3, so
  // with the clamp the title block is always that height — every card in a
  // row starts its meta row on the same baseline. The cap is a safety net
  // rather than active truncation: the longest title in the catalogue is
  // 70 characters, which still lands inside three lines at card width.
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: 0,
    lineHeight: '1.3',
    transition: 'color 0.2s ease',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  titleWrapper: {
    minHeight: '86px',
    marginBottom: '10px',
  },

  // The panel that closes the card: tinted, with a hairline above it. Two
  // fixed columns filled row-major — when it starts and how long it runs on
  // the top row, group size and scope beneath. minmax(0, 1fr) rather than
  // 1fr is what stops a long value from blowing the column out past the
  // card: a grid item's default min-width is auto, not zero.
  //
  // Negative side margins pull it out of the body's 20px padding so the
  // tint runs the full width and meets the card's rounded bottom corners
  // (the card clips with overflow hidden). marginTop auto drops it to the
  // bottom of the stretched body, so the panel sits on the same baseline on
  // every card in a row and the card ends on a deliberate edge rather than
  // trailing off into white.
  metaRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: '11px 12px',
    marginTop: 'auto',
    marginLeft: '-20px',
    marginRight: '-20px',
    marginBottom: 0,
    padding: '15px 20px 17px',
    backgroundColor: 'var(--color-n100)',
    borderTop: '1px solid var(--color-n200)',
  },

  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    minWidth: 0,
  },

  metaIcon: {
    flexShrink: 0,
  },

  // --text-small (14px), not the 13px it started as: 13 is off the project's
  // type scale (12/14/16/18/22…) and sits under the mobile legibility floor.
  // n700 on the n100 panel is 9.04:1; the forest-green icons are 5.74:1,
  // which clears the text threshold, not just the 3:1 non-text one.
  //
  // Ellipsis instead of nowrap-and-spill: the chips stay on one line each,
  // but an unusually long duration string truncates inside its column
  // rather than overlapping the card edge.
  meta: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    fontWeight: '500',
    lineHeight: '1.4',
    color: 'var(--color-n700)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: 0,
  },

  // Only ever rendered for the parked language flags. It sits below the meta
  // panel, which already carries the marginTop auto, so this just needs its
  // own padding back — the body no longer has any at the bottom.
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 0 16px',
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