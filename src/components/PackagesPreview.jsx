import { Link } from 'react-router-dom'
import { ArrowRight, Star, Gauge, MapPin, Globe } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'
import { useAllReviews } from '../hooks/useAllReviews'
import package1Hero from '../assets/package-1-hero.webp'
import package2Hero from '../assets/package-2-hero.webp'
import package3Hero from '../assets/package-3-hero.webp'

const packages = [
  {
    id: 1,
    slug: 'sarajevo-essential',
    name: '3-Day Complete Sarajevo Experience: Let us show you our home',
    subtitle: 'Stories, Survival & Soul',
    duration: '3 Days',
    price: 99,
    rating: 5,
    reviews: 1,
    badge: 'Most Popular',
    badgeStyle: 'amber',
    hero: package1Hero,
    difficulty: 'Easy',
    locations: 3,
    countries: 1,
  },
  {
    id: 2,
    slug: 'bosnia-deep-dive',
    name: 'Bosnia Deep Dive',
    subtitle: 'Real Bosnia, Deeply Experienced',
    duration: '5 Days',
    price: 480,
    rating: 5,
    reviews: 31,
    badge: 'Best Value',
    badgeStyle: 'green',
    hero: package2Hero,
    difficulty: 'Easy',
    locations: 7,
    countries: 1,
  },
  {
    id: 3,
    slug: 'sarajevo-to-dubrovnik',
    name: 'Sarajevo to Dubrovnik',
    subtitle: 'Empires, Mountains & the Adriatic Coast',
    duration: '7 Days',
    price: 890,
    rating: 5,
    reviews: 0,
    badge: 'New',
    badgeStyle: 'dark',
    hero: package3Hero,
    difficulty: 'Moderate',
    locations: 8,
    countries: 2,
  },
]

const DIFFICULTY_COLOR = {
  Easy: { color: 'var(--color-forest-green)', bg: 'rgba(46,125,94,0.10)', border: 'rgba(46,125,94,0.20)' },
  Moderate: { color: '#b45309', bg: 'rgba(180,83,9,0.08)', border: 'rgba(180,83,9,0.18)' },
  Challenging: { color: '#c0392b', bg: 'rgba(192,57,43,0.08)', border: 'rgba(192,57,43,0.18)' },
}

function PackagesPreview() {
  const width = useWindowWidth()
  const { stats } = useAllReviews()
  const isMobile = width <= 640
  const isTablet = width <= 960

  const cols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'

  return (
    <section style={styles.section}>

      <div style={styles.header}>
        <span style={styles.eyebrow}>Curated Experiences</span>
        <h2 style={styles.title}>Multi-day tours</h2>
        <p style={styles.subtitle}>
          Want more than a single tour? These packages combine
          our best experiences into a complete story —
          planned, guided, and taken care of from arrival to departure.
        </p>
      </div>

      <div style={{ ...styles.cardsList, gridTemplateColumns: cols }}>
        {packages.map((pkg) => {
          const diff = DIFFICULTY_COLOR[pkg.difficulty] ?? DIFFICULTY_COLOR.Easy
          const avgRating = stats[pkg.slug]?.avgRating ?? pkg.rating
          const reviewCount = stats[pkg.slug]?.count ?? pkg.reviews

          return (
            <Link key={pkg.id} to={`/packages/${pkg.slug}`} style={styles.cardLink}>
              <div style={styles.card} className="pkg-card">

                <div style={styles.imageWrapper}>
                  <img src={pkg.hero} alt={pkg.name} style={styles.photo} className="pkg-card-img" />
                  <div style={styles.imageGradient} />

                  {/* Badge + Days */}
                  <div style={styles.imageTop}>
                    <span style={{
                      ...styles.badge,
                      ...(pkg.badgeStyle === 'amber'
                        ? { backgroundColor: 'var(--color-amber)', color: 'var(--color-n900)' }
                        : pkg.badgeStyle === 'green'
                        ? { backgroundColor: 'var(--color-forest-green)', color: 'var(--color-n000)' }
                        : { backgroundColor: 'rgba(0,0,0,0.55)', color: 'var(--color-n000)' }),
                    }}>
                      {pkg.badge}
                    </span>
                    <span style={styles.daysPill}>{pkg.duration}</span>
                  </div>

                  {/* All content overlaid at the bottom */}
                  <div style={styles.imageBottom}>
                    <h3 style={styles.packageName}>{pkg.name}</h3>
                    <p style={styles.packageSubtitle}>{pkg.subtitle}</p>
                    <div style={styles.statPills}>
                      <span style={styles.statPill}>
                        <Gauge size={11} />
                        {pkg.difficulty}
                      </span>
                      <span style={styles.statPill}>
                        <MapPin size={11} />
                        {pkg.locations} stops
                      </span>
                      <span style={styles.statPill}>
                        <Globe size={11} />
                        {pkg.countries} {pkg.countries === 1 ? 'country' : 'countries'}
                      </span>
                    </div>
                    <div style={styles.priceRow}>
                      <div style={styles.priceBlock}>
                        <span style={styles.priceFrom}>from</span>
                        <span style={styles.price}>€{pkg.price}</span>
                      </div>
                      <button className="pkg-card-btn" style={styles.ctaBtn}>
                        View Package
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </Link>
          )
        })}
      </div>

      <div style={styles.bottomRow}>
        <p style={styles.bottomText}>Looking for a longer journey or a private group?</p>
        <Link to="/multi-day-tours" style={styles.bottomLink}>
          View all 7 packages
          <ArrowRight size={14} color="var(--color-forest-green)" />
        </Link>
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

  cardsList: {
    display: 'grid',
    gap: '20px',
    maxWidth: '1160px',
    margin: '0 auto',
  },

  cardLink: {
    display: 'block',
    textDecoration: 'none',
    borderRadius: '16px',
  },

  card: {
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
  },

  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '420px',
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
    borderRadius: '100px',
    letterSpacing: '0.2px',
  },

  badge: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '4px 11px',
    borderRadius: '100px',
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
    fontSize: '11px',
    color: 'rgba(255,255,255,0.92)',
    backgroundColor: 'rgba(0,0,0,0.42)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.16)',
    padding: '3px 9px',
    borderRadius: '100px',
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

  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
  },

  priceBlock: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },

  priceFrom: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
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

  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '34px',
    padding: '0 14px',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    letterSpacing: '0.3px',
    borderRadius: '100px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },

  bottomRow: {
    textAlign: 'center',
    marginTop: '36px',
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