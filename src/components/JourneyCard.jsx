// JourneyCard.jsx
// The poster card for a multi-day journey. This used to be copy-pasted into
// five places (two of them with the styles inlined by hand), so a copy fix
// reached one card and left four behind — that is how PackageDetail ended up
// reading badges from a stale hard-coded map and Packages.jsx ended up with
// no badge colour fallback.
//
// The whole card is the link. There is no "View journey" button: it was a
// <button> nested inside an <a>, which is invalid HTML and left a keyboard
// tab stop that swallowed Enter. The title underlines on hover instead —
// forest green is unreadable on a white-on-photo title.
import { Link } from 'react-router-dom'
import { Gauge, MapPin, Globe, Users } from 'lucide-react'
import Img from './Img'
import { useCurrency } from '../context/CurrencyContext'

// `priceField` exists because the listing pages read `price` while the
// detail/blog strips read `priceWithout`, and one journey (bosnia-deep-dive)
// has different values for the two. Consolidating the card must not silently
// change a price, so each caller keeps the field it already used.
//
// `stretch` swaps the fixed height for flex growth, for the blog grid where
// the journey card sits beside a TourCard and has to match its row height.
function JourneyCard({ pkg, priceField = 'price', height = 483, stretch = false }) {
  const { format } = useCurrency()

  const badgeColors = pkg.badgeColor
    ? { backgroundColor: pkg.badgeColor, color: pkg.badgeTextColor || 'var(--color-n000)' }
    : pkg.badgeStyle === 'amber'
    ? { backgroundColor: 'var(--color-amber)', color: 'var(--color-n900)' }
    : pkg.badgeStyle === 'green'
    ? { backgroundColor: 'var(--color-forest-green)', color: 'var(--color-n000)' }
    : { backgroundColor: 'rgba(0,0,0,0.55)', color: 'var(--color-n000)' }

  return (
    <Link
      to={`/multi-day-tours/${pkg.slug}`}
      style={{ ...styles.cardLink, ...(stretch ? styles.cardLinkStretch : null) }}
      className="pkg-card"
    >
      <div style={{ ...styles.card, ...(stretch ? styles.cardStretch : null) }}>
        <div style={{
          ...styles.imageWrapper,
          ...(stretch ? { flex: 1, minHeight: `${height}px` } : { height: `${height}px` }),
        }}>
          <Img
            src={pkg.hero || pkg.heroImage}
            alt={pkg.name}
            sizes="(max-width: 768px) 92vw, 420px"
            style={styles.photo}
            className="pkg-card-img"
          />
          <div style={styles.imageGradient} />

          <div style={styles.imageTop}>
            {pkg.badge && <span style={{ ...styles.badge, ...badgeColors }}>{pkg.badge}</span>}
            <span style={{ ...styles.daysPill, marginLeft: 'auto' }}>{pkg.duration}</span>
          </div>

          <div style={styles.imageBottom}>
            <h3 style={styles.packageName} className="pkg-card-title">{pkg.name}</h3>
            {pkg.subtitle && <p style={styles.packageSubtitle}>{pkg.subtitle}</p>}

            {/* Three pills, always. The third slot shows the country count
                only when there is more than one — "1 country" is a non-fact.
                Otherwise it shows group size, which is present on every
                journey and is the thing that actually sets these apart. */}
            <div style={styles.statPills}>
              <span style={styles.statPill}>
                <Gauge size={11} />
                {pkg.difficulty}
              </span>
              <span style={styles.statPill}>
                <MapPin size={11} />
                {pkg.locations} stops
              </span>
              {pkg.countries > 1 ? (
                <span style={styles.statPill}>
                  <Globe size={11} />
                  {pkg.countries} countries
                </span>
              ) : Number(pkg.groupSize) > 0 ? (
                <span style={styles.statPill}>
                  <Users size={11} />
                  Max {pkg.groupSize}
                </span>
              ) : null}
            </div>

            <div style={styles.priceRow}>
              <span style={styles.priceFrom}>from</span>
              <span style={styles.price}>{format(pkg[priceField])}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const styles = {
  cardLink: {
    display: 'block',
    textDecoration: 'none',
    borderRadius: '16px',
  },

  cardLinkStretch: {
    display: 'flex',
    height: '100%',
  },

  card: {
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
  },

  cardStretch: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  imageWrapper: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },

  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  imageGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 28%, transparent 40%, rgba(0,0,0,0.88) 100%)',
  },

  imageTop: {
    position: 'absolute',
    top: '14px',
    left: '14px',
    right: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  daysPill: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-n000)',
    backgroundColor: 'rgba(0,0,0,0.40)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.18)',
    padding: '5px 12px',
    borderRadius: 'var(--radius-pill)',
    letterSpacing: '0.2px',
  },

  badge: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '4px 11px',
    borderRadius: 'var(--radius-pill)',
  },

  imageBottom: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    padding: '20px 18px 18px',
  },

  statPills: {
    display: 'flex',
    gap: '5px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },

  statPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.92)',
    backgroundColor: 'rgba(0,0,0,0.42)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.16)',
    padding: '3px 9px',
    borderRadius: 'var(--radius-pill)',
    whiteSpace: 'nowrap',
  },

  packageName: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '20px',
    color: 'var(--color-n000)',
    lineHeight: '1.2',
    letterSpacing: '-0.2px',
    margin: '0 0 4px 0',
  },

  packageSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.70)',
    margin: '0 0 10px 0',
    fontStyle: 'italic',
  },

  // The "View journey" button used to sit at the right of this row. With it
  // gone the price is the only thing here, so it reads as the focal point.
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },

  priceFrom: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.60)',
    fontWeight: '500',
    letterSpacing: '0.3px',
  },

  price: {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '28px',
    color: 'var(--color-n000)',
    lineHeight: 1,
  },
}

export default JourneyCard
