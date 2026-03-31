import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, Users, Map, ArrowRight,
  CheckCircle, Star, Sparkles,
} from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'
import package1Hero from '../assets/package-1-hero.webp'
import package2Hero from '../assets/package-2-hero.webp'

const standardPackages = [
  {
    id: 1,
    name: 'Sarajevo Essential',
    subtitle: 'Stories, Survival & Soul',
    duration: '2 Days',
    groupSize: 8,
    price: 199,
    originalPrice: 275,
    rating: 4.9,
    reviews: 47,
    badge: 'Most Popular',
    badgeColor: 'var(--color-amber)',
    badgeTextColor: 'var(--color-n900)',
    hero: package1Hero,
    description: 'Two days that tell the complete story of Sarajevo. A home-hosted meal, the golden hour walking tour, and the siege explained by someone who lived through it.',
    highlights: [
      'Home-hosted welcome meal',
      'Sarajevo Sunset Walking Tour',
      'Siege of Sarajevo Tour',
    ],
    includes: [
      'Private transfer on arrival and departure',
      'Welcome meal with a local family',
      'Small group — maximum 8 people',
      'Free cancellation up to 48 hours before',
    ],
  },
  {
    id: 2,
    name: 'Bosnia Deep Dive',
    subtitle: 'Real Bosnia, Deeply Experienced',
    duration: '5 Days',
    groupSize: 8,
    price: 349,
    originalPrice: 550,
    rating: 4.9,
    reviews: 31,
    badge: 'Best Value',
    badgeColor: 'var(--color-forest-green)',
    badgeTextColor: 'var(--color-n000)',
    hero: package2Hero,
    description: 'Five days through Sarajevo, Herzegovina, and Yugoslavia\'s strangest legacy. Waterfalls, wine cellars, a nuclear bunker, and white water rafting.',
    highlights: [
      'Kravice Waterfalls & Swimming',
      'Tito\'s Nuclear Bunker',
      'White Water Rafting',
    ],
    includes: [
      'Private transport throughout',
      'Welcome and farewell meals included',
      'All tour entries and activities',
      'Free cancellation up to 72 hours before',
    ],
  },
]

function Packages() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <div>

      

      {/* Page header */}
      <section style={styles.pageHeader}>
        <div style={styles.headerInner}>
          <span style={styles.eyebrow}>Curated Experiences</span>
          <h1 style={styles.headline}>Tour Packages</h1>
          <p style={styles.subheading}>
            From two focused days in Sarajevo to a five-day journey
            across the country — or a fully personalised itinerary
            built entirely around you.
          </p>
        </div>
      </section>

      {/* Personalised Tour Package — standalone feature card */}
        <div style={{
  ...styles.sectionLabel,
  marginTop: '40px',           // Already handled by section padding
  marginBottom: '20px',
  margin: isMobile ? '40px 20px 20px 20px' : '0 auto 60px auto',
}}>
          <span style={styles.sectionLabelText}>
            Want Something Unique?
          </span>
        </div>

        <div style={{
          ...styles.personalisedCard,
          flexDirection: isMobile ? 'column' : 'row',
          margin: isMobile ? '0 20px 0px 20px' : '0 auto 20px auto',
        }}>

          {/* Left — dark background with headline */}
          <div style={styles.personalisedLeft}>
            <div style={styles.personalisedIconWrapper}>
              <Sparkles
                size={28}
                color="var(--color-amber)"
                strokeWidth={1.5}
              />
            </div>
            <h2 style={styles.personalisedTitle}>
              Personalised Tour Package
            </h2>
            <p style={styles.personalisedTagline}>
              Your interests. Your pace. Your Bosnia.
            </p>
            <p style={styles.personalisedDesc}>
              Not every traveller fits a template. If you have
              specific interests, a custom group, or a vision
              for what Bosnia should feel like for you — we
              build it from scratch. Fill in our short
              questionnaire and we'll come back to you
              within 24 hours with a proposal.
            </p>
          </div>

          {/* Right — what you get + CTA */}
          <div style={styles.personalisedRight}>

            <span style={styles.personalisedLabel}>
              What you get
            </span>

            <div style={styles.personalisedFeatures}>
              {[
                'Itinerary built entirely around your interests',
                'Private guide — no shared groups',
                'Flexible dates and duration',
                'Accommodation arranged on request',
                'Response within 24 hours',
              ].map((feature, i) => (
                <div key={i} style={styles.personalisedFeature}>
                  <CheckCircle
                    size={15}
                    color="var(--color-amber)"
                  />
                  <span style={styles.personalisedFeatureText}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/personalised"
              style={styles.personalisedBtn}
            >
              <span>Start Your Questionnaire</span>
              <ArrowRight size={16} color="var(--color-n900)" />
            </Link>

            <p style={styles.personalisedNote}>
              No commitment — just a conversation starter.
            </p>

          </div>

        </div>

      {/* Standard packages — horizontal cards */}
      <section style={styles.packagesSection}>

        <div style={styles.sectionLabel}>
          <span style={styles.sectionLabelText}>
            Our Curated Packages
          </span>
        </div>

        

        <div style={styles.cardsList}>
          {standardPackages.map((pkg, index) => (
            <div
              key={pkg.id}
              style={{
                ...styles.card,
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
                <span style={{
                  ...styles.badge,
                  backgroundColor: pkg.badgeColor,
                  color: pkg.badgeTextColor,
                }}>
                  {pkg.badge}
                </span>
              </div>

              {/* Content side */}
              <div style={styles.contentSide}>

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

                <h3 style={styles.packageName}>{pkg.name}</h3>
                <p style={styles.packageSubtitle}>{pkg.subtitle}</p>

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
                      Max {pkg.groupSize}
                    </span>
                  </div>
                </div>

                <p style={styles.description}>{pkg.description}</p>

                <div style={styles.highlightsList}>
                  {pkg.highlights.map((h, i) => (
                    <div key={i} style={styles.highlightItem}>
                      <div style={styles.highlightDot} />
                      <span style={styles.highlightText}>{h}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.cardFooter}>
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

      </section>

      {/* Bottom CTA */}
      <section style={styles.ctaBanner}>
        <div style={styles.ctaBannerInner}>
          <h2 style={styles.ctaBannerTitle}>
            Not Sure Which Package Is Right for You?
          </h2>
          <p style={styles.ctaBannerText}>
            Send a message and we'll recommend the best option
            based on your travel dates, group size, and interests.
          </p>
          <Link to="/contact" style={styles.ctaBannerBtn}>
            Get a Recommendation
            <ArrowRight size={16} color="var(--color-n900)" />
          </Link>
        </div>
      </section>

    </div>
  )
}

const styles = {
   pageHeader: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '72px 40px 80px 90px',  // 80px bottom — was likely less
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

  packagesSection: {
    padding: '80px 40px 80px 40px',
    backgroundColor: 'var(--color-n100)',
  },

  sectionLabel: {
    maxWidth: '1000px',
    margin: '0 auto 20px auto',
  },

  sectionLabelText: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
  },

  cardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto 56px auto',
  },

  card: {
    display: 'flex',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    border: '1px solid var(--color-n300)',
    minHeight: '300px',
  },

  photoSide: {
    flex: '0 0 42%',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '240px',
  },

  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  badge: {
    position: 'absolute',
    top: '14px',
    left: '14px',
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
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
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
    gap: '5px',
  },

  highlightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  highlightDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-forest-green)',
    flexShrink: 0,
  },

  highlightText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  includesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },

  includeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },

  includeText: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
  },

  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '14px',
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
    gap: '6px',
    height: '40px',
    padding: '0 18px',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
  },

  // Personalised card — dark background, two column layout.
  // Visually distinct from the standard package cards above —
  // signals this is a different category of offering.
  personalisedCard: {
    display: 'flex',
    borderRadius: '16px',
    overflow: 'hidden',
    maxWidth: '1000px',
    margin: '0 auto 0 auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  },

  personalisedLeft: {
    flex: 1,
    backgroundColor: '#1A3D2B',  // Deep forest green — premium but not oppressive
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  personalisedIconWrapper: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    backgroundColor: 'rgba(244,161,48,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },

  personalisedTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n000)',
    margin: 0,
    lineHeight: '1.2',
  },

 personalisedTagline: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-amber)',
    margin: 0,
    fontWeight: '500',
  },


  personalisedDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
  },

 personalisedRight: {
    flex: '0 0 42%',
    backgroundColor: '#143222',  // Slightly darker — creates subtle depth
    borderLeft: '1px solid rgba(255,255,255,0.08)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  personalisedLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  },

  personalisedFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },

  personalisedFeature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },

  personalisedFeatureText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'rgba(255,255,255,0.9)',  // Near white — clear contrast on dark green
    lineHeight: '1.4',
  },

  personalisedBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '48px',
    padding: '0 24px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    marginTop: 'auto',
  },

   personalisedNote: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    margin: 0,
  },

  ctaBanner: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '72px 40px',
  },

  ctaBannerInner: {
    maxWidth: '560px',
    margin: '0 auto',
    textAlign: 'center',
  },

  ctaBannerTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n000)',
    marginBottom: '16px',
  },

  ctaBannerText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-amber-light)',
    lineHeight: 'var(--leading-body)',
    marginBottom: '32px',
  },

  ctaBannerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '52px',
    padding: '0 28px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
  },
}

export default Packages