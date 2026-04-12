// PackagesPreview.jsx
// Homepage teaser section for the two standard packages.
// Shows enough detail to create desire and link through
// to the full package detail pages.
// Deliberately different layout from tour cards —
// horizontal instead of vertical, larger, more editorial.

import { Link } from 'react-router-dom'
import {
  Clock, Users, ArrowRight, Star
} from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'
import package1Hero from '../assets/package-1-hero.webp'
import package2Hero from '../assets/package-2-hero.webp'

const packages = [
  {
    id: 1,
    name: 'Sarajevo Essential',
    subtitle: 'Stories, Survival & Soul',
    duration: '2 Days',
    groupSize: 12,
    price: 99,
    originalPrice: 120,
    rating: 5,
    reviews: 1,
    badge: 'Most Popular',
    hero: package1Hero,
    description: 'Two days that tell the complete story of Sarajevo. A home-hosted meal, the golden hour walking tour, and the siege explained by someone who lived through it.',
    highlights: [
      'Home-hosted welcome meal',
      'Sarajevo Sunset Walking Tour',
      'Siege of Sarajevo Tour',
    ],
  },
  {
    id: 2,
    name: 'Bosnia Deep Dive',
    subtitle: 'Real Bosnia, Deeply Experienced',
    duration: '5 Days',
    groupSize: 12,
    price: 759,
    originalPrice: 850,
    rating: 5,
    reviews: 11,
    badge: 'Best Value',
    hero: package2Hero,
    description: 'Five days through Sarajevo, Herzegovina, and Yugoslavia\'s strangest legacy. Waterfalls, wine cellars, a nuclear bunker, and white water rafting.',
    highlights: [
      'Kravice Waterfalls & Swimming',
      'Tito\'s Nuclear Bunker',
      'White Water Rafting',
    ],
  },
]

function PackagesPreview() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <section style={styles.section}>

      {/* Section header */}
      <div style={styles.header}>
        <span style={styles.eyebrow}>Curated Experiences</span>
        <h2 style={styles.title}>Multi-Day Packages</h2>
        <p style={styles.subtitle}>
          Want more than a single tour? These packages combine
          our best experiences into a complete Bosnia story —
          planned, guided, and taken care of from arrival to departure.
        </p>
      </div>

      {/* Package cards */}
      <div style={styles.cardsList}>
        {packages.map((pkg, index) => (
          <div
            key={pkg.id}
            style={{
              ...styles.card,
              // Alternate photo position — first card photo left,
              // second card photo right. Creates visual rhythm
              // and prevents the section from feeling like a list.
              flexDirection: isMobile
                ? 'column'
                : index % 2 === 0
                  ? 'row'
                  : 'row-reverse',
            }}
          >

            {/* Photo side */}
            <div style={styles.photoSide}>
              <img
                src={pkg.hero}
                alt={pkg.name}
                style={styles.photo}
              />
              {/* Badge overlaid on photo */}
              <span style={{
                ...styles.badge,
                backgroundColor: index === 0
                  ? 'var(--color-amber)'
                  : 'var(--color-forest-green)',
                color: index === 0
                  ? 'var(--color-n900)'
                  : 'var(--color-n000)',
              }}>
                {pkg.badge}
              </span>
            </div>

            {/* Content side */}
            <div style={styles.contentSide}>

              {/* Rating */}
              <div style={styles.ratingRow}>
                <Star
                  size={13}
                  color="var(--color-amber)"
                  fill="var(--color-amber)"
                />
                <span style={styles.rating}>{pkg.rating}</span>
                <span style={styles.reviews}>
                  ({pkg.reviews} reviews)
                </span>
              </div>

              {/* Name and subtitle */}
              <h3 style={styles.packageName}>{pkg.name}</h3>
              <p style={styles.packageSubtitle}>{pkg.subtitle}</p>

              {/* Meta */}
              <div style={styles.metaRow}>
                <div style={styles.metaItem}>
                  <Clock
                    size={13}
                    color="var(--color-forest-green)"
                  />
                  <span style={styles.meta}>{pkg.duration}</span>
                </div>
                <div style={styles.metaItem}>
                  <Users
                    size={13}
                    color="var(--color-forest-green)"
                  />
                  <span style={styles.meta}>
                    Max {pkg.groupSize} people
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={styles.description}>{pkg.description}</p>

              {/* Highlights — three key experiences */}
              <div style={styles.highlightsList}>
                {pkg.highlights.map((highlight, i) => (
                  <div key={i} style={styles.highlightItem}>
                    <div style={styles.highlightDot} />
                    <span style={styles.highlightText}>
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price and CTA */}
              <div style={styles.footer}>
                <div style={styles.priceBlock}>
                  <span style={styles.originalPrice}>
                    €{pkg.originalPrice}
                  </span>
                  <span style={styles.price}>€{pkg.price}</span>
                  <span style={styles.perPerson}>per person</span>
                </div>

                <Link
                  to={`/packages/${pkg.id}`}
                  style={styles.ctaBtn}
                >
                  <span>See Package</span>
                  <ArrowRight
                    size={15}
                    color="var(--color-n000)"
                  />
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Bottom link — surfaces Private Group option */}
      <div style={styles.bottomRow}>
        <p style={styles.bottomText}>
          Looking for a private group experience?
        </p>
        <Link to="/packages" style={styles.bottomLink}>
          View all packages including private tours
          <ArrowRight size={14} color="var(--color-forest-green)" />
        </Link>
      </div>

    </section>
  )
}

const styles = {
  section: {
    backgroundColor: 'var(--color-n100)',
    padding: '88px 40px',
  },

  header: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto 56px auto',
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

  cardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
  },

  // Horizontal card — photo on one side, content on the other.
  // Each side is exactly 50% of the card width.
  // overflow hidden keeps the photo corners rounded.
  card: {
    display: 'flex',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '1px solid var(--color-n300)',
    minHeight: '320px',
  },

  photoSide: {
    flex: '0 0 45%',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '260px',
  },

  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  badge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '4px',
  },

  contentSide: {
    flex: 1,
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    justifyContent: 'center',
  },

  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  rating: {
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

  packageName: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n900)',
    margin: 0,
    lineHeight: '1.2',
  },

  packageSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    margin: 0,
  },

  metaRow: {
    display: 'flex',
    gap: '16px',
  },

  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },

  meta: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
  },

  highlightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  highlightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  // Small Forest Green dot — minimal, unobtrusive indicator.
  // Keeps the highlight list readable without the visual
  // weight of checkmarks or numbered circles here.
  highlightDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-forest-green)',
    flexShrink: 0,
  },

  highlightText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '4px',
    paddingTop: '16px',
    borderTop: '1px solid var(--color-n300)',
  },

  priceBlock: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
  },

  originalPrice: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    textDecoration: 'line-through',
  },

  price: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-forest-green)',
  },

  perPerson: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '44px',
    padding: '0 20px',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },

  bottomRow: {
    textAlign: 'center',
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },

  bottomText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    margin: 0,
  },

  bottomLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },
}

export default PackagesPreview