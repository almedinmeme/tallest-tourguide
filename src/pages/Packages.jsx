import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, Users, Map, ChevronRight,
  CheckCircle, XCircle, ArrowRight
} from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'

const packages = [
  {
    id: 1,
    name: 'Sarajevo Essential',
    tagline: 'Stories, Survival & Soul',
    duration: '2 Days',
    price: 199,
    originalPrice: 275,
    groupSize: 8,
    badge: 'Most Popular',
    badgeColor: 'var(--color-amber)',
    badgeTextColor: 'var(--color-n900)',
    targetTraveller: 'Perfect for visitors with 2–3 days in Sarajevo who want to understand the city deeply without planning anything themselves.',
    tours: [
      'Sarajevo Sunset Walking Tour',
      'Between Empires: Sarajevo Walking Tour',
      'Siege of Sarajevo: Survival & Resistance',
      'Bosnian Coffee Ceremony',
      'Home-hosted welcome meal',
    ],
    includes: [
      'Private transfer on arrival and departure',
      'Welcome meal with a local family',
      'Small group — maximum 8 people',
      'Free cancellation up to 48 hours before',
    ],
    description: 'Two days that tell the complete story of Sarajevo — from its Ottoman origins to the siege that defined a generation. This is the sequence your guide recommends for every first-time visitor because each experience builds on the last, turning separate moments into one coherent understanding of a city that survived the impossible.',
  },
  {
    id: 2,
    name: 'Bosnia Deep Dive',
    tagline: 'Real Bosnia, Deeply Experienced',
    duration: '5 Days',
    price: 349,
    originalPrice: 550,
    groupSize: 8,
    badge: 'Best Value',
    badgeColor: 'var(--color-forest-green)',
    badgeTextColor: 'var(--color-n000)',
    targetTraveller: 'Designed for travellers with genuine curiosity about Bosnia — its history, its food, its people, and the places most visitors never find.',
    tours: [
      'Sarajevo Sunset Walking Tour',
      'Between Empires: Sarajevo Walking Tour',
      'Siege of Sarajevo: Survival & Resistance',
      'True Herzegovina Day Tour',
      'Kravice Waterfalls & Swimming',
      'Herzegovina Wine Cellar Tasting',
      'Tito\'s Nuclear Bunker',
      'White Water Rafting on the Neretva',
    ],
    includes: [
      'Private transport throughout',
      'Welcome and farewell meals included',
      'All tour entries and activities',
      'Small group — maximum 8 people',
      'Free cancellation up to 72 hours before',
    ],
    description: 'Five days through three distinct worlds — the Ottoman and Austro-Hungarian complexity of Sarajevo, the raw natural beauty of Herzegovina, and the surreal Yugoslav legacy of a dictator\'s nuclear bunker. You will swim in a waterfall, raft a river, taste wine in a medieval cellar, and leave with the kind of understanding that no guidebook can give you.',
  },
  {
    id: 3,
    name: 'Private Group Experience',
    tagline: 'Your group. Your pace. Your itinerary.',
    duration: 'Flexible',
    price: null,
    originalPrice: null,
    groupSize: null,
    badge: 'Private',
    badgeColor: 'var(--color-n900)',
    badgeTextColor: 'var(--color-n000)',
    targetTraveller: 'Families, friend groups, corporate teams, or anyone who wants an exclusive experience built entirely around their interests.',
    tours: [
      'Any combination of our tours',
      'Custom routes on request',
      'Private transport available',
      'Multilingual options available',
    ],
    includes: [
      'Exclusive private guide — no shared groups',
      'Fully customisable itinerary',
      'Flexible dates and duration',
      'Corporate and team building options',
    ],
    description: 'Every private experience starts with a conversation. You tell us who\'s coming, how long you have, and what you\'re curious about. We build the rest. Private groups get undivided attention, flexible pacing, and the freedom to stop wherever the conversation takes you — which is usually somewhere that never makes it onto any map.',
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
            Not sure where to start? We've done the planning for you.
            Each package combines our best tours into a complete
            experience built around a specific type of traveller.
          </p>
        </div>
      </section>

      {/* Packages list */}
      <section style={styles.packagesSection}>
        <div style={{
          ...styles.packagesList,
          maxWidth: isMobile ? '100%' : '900px',
        }}>

          {packages.map((pkg) => (
            <div key={pkg.id} style={styles.packageCard}>

              {/* Card header */}
              <div style={{
                ...styles.cardHeader,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '20px' : '32px',
              }}>

                <div style={styles.cardHeaderLeft}>

                  {/* Badge */}
                  <span style={{
                    ...styles.badge,
                    backgroundColor: pkg.badgeColor,
                    color: pkg.badgeTextColor,
                  }}>
                    {pkg.badge}
                  </span>

                  <h2 style={styles.packageName}>{pkg.name}</h2>
                  <p style={styles.packageTagline}>{pkg.tagline}</p>

                  {/* Meta row — Lucide icons, no emojis */}
                  <div style={styles.metaRow}>

                    <div style={styles.metaItem}>
                      <Clock
                        size={14}
                        color="var(--color-forest-green)"
                      />
                      <span style={styles.meta}>{pkg.duration}</span>
                    </div>

                    {pkg.groupSize && (
                      <div style={styles.metaItem}>
                        <Users
                          size={14}
                          color="var(--color-forest-green)"
                        />
                        <span style={styles.meta}>
                          Max {pkg.groupSize} people
                        </span>
                      </div>
                    )}

                    <div style={styles.metaItem}>
                      <Map
                        size={14}
                        color="var(--color-forest-green)"
                      />
                      <span style={styles.meta}>
                        {pkg.tours.length} experiences
                      </span>
                    </div>

                  </div>

                  {/* Target traveller */}
                  <p style={styles.targetTraveller}>
                    {pkg.targetTraveller}
                  </p>

                  {/* Tours included — as a clean tag list */}
                  <div style={styles.tourTags}>
                    {pkg.tours.map((tour, index) => (
                      <span key={index} style={styles.tourTag}>
                        {tour}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Right side — price and CTA */}
                <div style={{
                  ...styles.cardHeaderRight,
                  alignItems: isMobile ? 'flex-start' : 'flex-end',
                }}>

                  {pkg.price ? (
                    <div style={styles.priceBlock}>
                      <span style={styles.originalPrice}>
                        €{pkg.originalPrice}
                      </span>
                      <span style={styles.price}>€{pkg.price}</span>
                      <span style={styles.perPerson}>per person</span>
                      <span style={styles.saving}>
                        Save €{pkg.originalPrice - pkg.price}
                      </span>
                    </div>
                  ) : (
                    <div style={styles.priceBlock}>
                      <span style={styles.customQuote}>
                        Custom Quote
                      </span>
                      <span style={styles.perPerson}>
                        based on group size
                      </span>
                    </div>
                  )}

                  {/* See Details — links to individual page */}
                  <Link
                    to={pkg.id === 3 ? '/contact' : `/packages/${pkg.id}`}
                    style={styles.detailsBtn}
                  >
                    <span>
                      {pkg.id === 3 ? 'Request a Quote' : 'See Details'}
                    </span>
                    <ArrowRight size={14} color="var(--color-forest-green)" />
                  </Link>

                </div>

              </div>

              {/* Divider */}
              <div style={styles.cardDivider} />

              {/* Bottom row — inclusions preview */}
              <div style={{
                ...styles.cardBottom,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '12px' : '24px',
              }}>
                {pkg.includes.map((item, index) => (
                  <div key={index} style={styles.includeItem}>
                    <CheckCircle
                      size={13}
                      color="var(--color-success)"
                    />
                    <span style={styles.includeText}>{item}</span>
                  </div>
                ))}
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

  packagesSection: {
    padding: '64px 40px 80px 40px',
    backgroundColor: 'var(--color-n100)',
  },

  packagesList: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  packageCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    border: '1px solid var(--color-n300)',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
  },

  cardHeaderLeft: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  badge: {
    display: 'inline-block',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '4px',
    width: 'fit-content',
  },

  packageName: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n900)',
    margin: 0,
  },

  packageTagline: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    margin: 0,
  },

  metaRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
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

  targetTraveller: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    fontStyle: 'italic',
    lineHeight: '1.6',
    margin: 0,
  },

  // Tour tags — small pill-shaped labels showing
  // each included experience. Cleaner than a bullet list,
  // more informative than a simple count.
  tourTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },

  tourTag: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '11px',
    color: 'var(--color-n600)',
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n300)',
    borderRadius: '100px',
    padding: '3px 10px',
  },

  cardHeaderRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '160px',
  },

  priceBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
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
    fontSize: 'var(--text-h1)',
    color: 'var(--color-forest-green)',
  },

  perPerson: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  saving: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-success)',
  },

  customQuote: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-forest-green)',
  },

  detailsBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '40px',
    padding: '0 16px',
    backgroundColor: 'transparent',
    color: 'var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-forest-green)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },

  cardDivider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    margin: '24px 0',
  },

  cardBottom: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },

  includeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  includeText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
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