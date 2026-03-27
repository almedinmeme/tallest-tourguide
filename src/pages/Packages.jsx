// Packages.jsx
// This page presents curated multi-tour bundles aimed at specific
// visitor profiles. Unlike the Tours page which lists individual
// experiences, this page sells complete itineraries — removing
// the planning burden from the visitor and increasing your
// average booking value in the process.

import { useState } from 'react'
import { Link } from 'react-router-dom'

// Each package is an object with everything needed to render
// its card and its expanded detail view.
// The "tours" array inside each package lists which individual
// tours are included — this creates a natural link back to your
// Tours page and reinforces the value of the bundle.
const packages = [
  {
    id: 1,
    name: 'Sarajevo Essential',
    tagline: 'The perfect two-day introduction to Bosnia\'s capital.',
    duration: '2 days',
    price: 75,
    originalPrice: 95,
    groupSize: 8,
    badge: 'Most Popular',
    badgeColor: 'var(--color-amber)',
    targetTraveller: 'Perfect for visitors with 2–3 days in Sarajevo who want to understand the city deeply without planning anything themselves.',
    tours: [
      'Sarajevo War & Peace Tour',
      'Tunnel of Hope Tour',
      'Yellow Fortress Sunset Walk',
    ],
    includes: [
      'All three tours with the same local guide',
      'Small group — maximum 8 people',
      'Flexible scheduling across two days',
      'Free cancellation up to 48 hours before',
    ],
    description: 'Three tours that tell the complete story of Sarajevo — from its Ottoman origins to the siege that defined a generation. This is the sequence your guide recommends for every first-time visitor because each tour builds on the last, turning three separate experiences into one coherent narrative about a city that survived the impossible.',
  },
  {
    id: 2,
    name: 'Bosnia Deep Dive',
    tagline: 'Four days. Two cities. The full picture.',
    duration: '4 days',
    price: 145,
    originalPrice: 180,
    groupSize: 6,
    badge: 'Best Value',
    badgeColor: 'var(--color-forest-green)',
    targetTraveller: 'Designed for travellers with a genuine curiosity about Bosnia — its history, its food, its people, and the places most visitors never find.',
    tours: [
      'Sarajevo War & Peace Tour',
      'Jewish Heritage of Sarajevo',
      'Sarajevo Food Tour',
      'Mostar & Old Bridge Day Trip',
    ],
    includes: [
      'All four tours across four days',
      'Transport to Mostar included',
      'Food tastings on the Food Tour included',
      'Small group — maximum 6 people',
      'Free cancellation up to 72 hours before',
    ],
    description: 'Bosnia is one of the most misunderstood countries in Europe. Most visitors leave knowing only the war. This four-day sequence is designed to show you everything else — the Jewish community that survived here against the odds, the food culture that has never been written about properly, and the town of Mostar that proves beauty and tragedy can occupy the same geography.',
  },
  {
    id: 3,
    name: 'Private Group Experience',
    tagline: 'Your group. Your pace. Your itinerary.',
    duration: 'Flexible',
    price: null,   // null because price is quoted per group
    originalPrice: null,
    groupSize: null,
    badge: 'Private',
    badgeColor: 'var(--color-n900)',
    targetTraveller: 'Families, friend groups, corporate teams, or anyone who wants an exclusive experience built entirely around their interests.',
    tours: [
      'Any combination of our six tours',
      'Custom routes on request',
      'Private transport available',
    ],
    includes: [
      'Exclusive private guide — no shared groups',
      'Fully customisable itinerary',
      'Flexible dates and duration',
      'Corporate and team building options available',
      'Multilingual options on request',
    ],
    description: 'Every private experience starts with a conversation. You tell us who\'s coming, how long you have, and what you\'re curious about. We build the rest. Private groups get undivided attention, flexible pacing, and the freedom to stop wherever the conversation takes you — which is usually somewhere that never makes it onto any map.',
  },
]

function Packages() {

  // selectedPackage tracks which package card the visitor has
  // clicked to expand. null means no package is expanded yet.
  // When a visitor clicks a package, we set this to that package's id.
  // When they click again, we set it back to null — toggling the detail view.
  // This is a common UI pattern called an "accordion" or "expand/collapse."
  const [selectedPackage, setSelectedPackage] = useState(null)

  const handlePackageClick = (packageId) => {
    // If the visitor clicks the already-open package, close it.
    // Otherwise open the clicked one.
    // This is a ternary operator used as a toggle —
    // condition ? value_if_true : value_if_false
    setSelectedPackage(selectedPackage === packageId ? null : packageId)
  }

  return (
    <div>

      {/* ── PAGE HEADER ───────────────────────────────────
          Same green header pattern as Tours and Contact —
          consistent visual language across all pages. */}
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

      {/* ── PACKAGES LIST ─────────────────────────────────
          Unlike the Tours page which uses a grid of equal cards,
          the Packages page uses a vertical stack of larger cards.
          This gives each package more room to breathe and signals
          to the visitor that these are more substantial offerings
          worth reading carefully rather than scanning quickly. */}
      <section style={styles.packagesSection}>
        <div style={styles.packagesList}>

          {packages.map((pkg) => {

            // isOpen tells us whether this specific package
            // is currently expanded. We use it to conditionally
            // render the detail section and to change the
            // button label between "See Details" and "Hide Details."
            const isOpen = selectedPackage === pkg.id

            return (
              <div key={pkg.id} style={{
                ...styles.packageCard,
                // When a package is open, we add a green left border
                // as a visual indicator that it's the active one.
                // The spread operator (...) merges the base card styles
                // with this conditional override — a clean way to apply
                // dynamic styles without duplicating the entire style object.
                borderLeft: isOpen
                  ? '4px solid var(--color-forest-green)'
                  : '4px solid transparent',
              }}>

                {/* ── CARD HEADER ─────────────────────────
                    Always visible regardless of open/closed state.
                    Contains the badge, name, price, and CTA button. */}
                <div style={styles.cardHeader}>

                  <div style={styles.cardHeaderLeft}>

                    <span style={{
                      ...styles.badge,
                      backgroundColor: pkg.badgeColor,
                      // Private badge needs white text,
                      // others need dark text for contrast on amber/green.
                      color: pkg.id === 3
                        ? 'var(--color-n000)'
                        : pkg.id === 2
                          ? 'var(--color-n000)'
                          : 'var(--color-n900)',
                    }}>
                      {pkg.badge}
                    </span>

                    <h2 style={styles.packageName}>{pkg.name}</h2>
                    <p style={styles.packageTagline}>{pkg.tagline}</p>

                    {/* Meta row — duration and group size */}
                    <div style={styles.metaRow}>
                      <span style={styles.meta}>📅 {pkg.duration}</span>
                      {pkg.groupSize && (
                        <span style={styles.meta}>👥 Max {pkg.groupSize} people</span>
                      )}
                      {/* Tour count — derived from the tours array length */}
                      <span style={styles.meta}>
                        🗺 {pkg.tours.length} {pkg.tours.length === 1 ? 'tour' : 'tours'} included
                      </span>
                    </div>

                  </div>

                  {/* Price and CTA on the right side of the header */}
                  <div style={styles.cardHeaderRight}>

                    {/* Conditional price display —
                        if price is null (Private package), show "Custom Quote"
                        otherwise show the price with the original crossed out */}
                    {pkg.price ? (
                      <div style={styles.priceBlock}>
                        <span style={styles.originalPrice}>€{pkg.originalPrice}</span>
                        <span style={styles.price}>€{pkg.price}</span>
                        <span style={styles.perPerson}>per person</span>
                        <span style={styles.saving}>
                          Save €{pkg.originalPrice - pkg.price}
                        </span>
                      </div>
                    ) : (
                      <div style={styles.priceBlock}>
                        <span style={styles.customQuote}>Custom Quote</span>
                        <span style={styles.perPerson}>based on group size</span>
                      </div>
                    )}

                    <button
                      style={styles.detailsBtn}
                      onClick={() => handlePackageClick(pkg.id)}
                    >
                      {isOpen ? 'Hide Details' : 'See Details'}
                    </button>

                  </div>

                </div>

                {/* ── EXPANDED DETAIL SECTION ─────────────
                    Only renders when isOpen is true.
                    The && operator means: "only show this if isOpen is true."
                    When isOpen becomes false, this entire block
                    disappears from the DOM instantly. */}
                {isOpen && (
                  <div style={styles.cardDetail}>

                    <div style={styles.detailDivider} />

                    <div style={styles.detailGrid}>

                      {/* Left side — description and tours included */}
                      <div>

                        <p style={styles.targetTraveller}>
                          {pkg.targetTraveller}
                        </p>

                        <p style={styles.description}>
                          {pkg.description}
                        </p>

                        <h3 style={styles.detailSectionTitle}>
                          Tours Included
                        </h3>
                        <ul style={styles.toursList}>
                          {pkg.tours.map((tour, index) => (
                            <li key={index} style={styles.tourItem}>
                              <span style={styles.tourBullet}>→</span>
                              {tour}
                            </li>
                          ))}
                        </ul>

                      </div>

                      {/* Right side — what's included and CTA */}
                      <div>

                        <h3 style={styles.detailSectionTitle}>
                          What's Included
                        </h3>
                        <div style={styles.includesList}>
                          {pkg.includes.map((item, index) => (
                            <div key={index} style={styles.includeItem}>
                              <span style={styles.checkmark}>✓</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA — links to contact page for private,
                            links to tours page for standard packages.
                            This is a small but important UX decision:
                            private groups need a conversation before booking,
                            not a booking form. Sending them to Contact
                            sets the right expectation immediately. */}
                        {pkg.id === 3 ? (
                          <Link to="/contact" style={styles.ctaBtn}>
                            Request a Custom Quote
                          </Link>
                        ) : (
                          <Link to="/contact" style={styles.ctaBtn}>
                            Book This Package
                          </Link>
                        )}

                        <p style={styles.ctaNote}>
                          We'll confirm availability and send a payment
                          link within 24 hours.
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            )
          })}

        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ─────────────────────────────
          A final conversion opportunity for visitors who
          scrolled through everything but haven't clicked yet.
          The question format ("Not sure which package?") is
          intentional — it speaks directly to the hesitant visitor
          and reduces the barrier to making contact. */}
      <section style={styles.ctaBanner}>
        <div style={styles.ctaBannerInner}>
          <h2 style={styles.ctaBannerTitle}>
            Not Sure Which Package Is Right for You?
          </h2>
          <p style={styles.ctaBannerText}>
            Send a message and we'll recommend the best option
            based on your travel dates, group size, and interests.
            No obligation, no pressure.
          </p>
          <Link to="/contact" style={styles.ctaBannerBtn}>
            Get a Recommendation
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
    padding: '72px 40px 80px 40px',
    backgroundColor: 'var(--color-n100)',
  },

  packagesList: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  packageCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    border: '1px solid var(--color-n300)',
    transition: 'border-left 0.2s ease',
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '32px',
  },

  cardHeaderLeft: {
    flex: 1,
  },

  badge: {
    display: 'inline-block',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '4px',
    marginBottom: '12px',
  },

  packageName: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n900)',
    marginBottom: '8px',
  },

  packageTagline: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    marginBottom: '16px',
    lineHeight: 'var(--leading-body)',
  },

  metaRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },

  meta: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  cardHeaderRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '16px',
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
    height: 'var(--touch-target)',
    padding: '0 20px',
    backgroundColor: 'transparent',
    color: 'var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-forest-green)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  cardDetail: {
    marginTop: '24px',
  },

  detailDivider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    marginBottom: '28px',
  },

  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
  },

  targetTraveller: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-body)',
    color: 'var(--color-forest-green)',
    lineHeight: 'var(--leading-body)',
    marginBottom: '16px',
    fontStyle: 'italic',
  },

  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    marginBottom: '28px',
  },

  detailSectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '16px',
  },

  toursList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  tourItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
  },

  tourBullet: {
    color: 'var(--color-forest-green)',
    fontWeight: '700',
  },

  includesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '28px',
  },

  includeItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
  },

  checkmark: {
    color: 'var(--color-success)',
    fontWeight: '700',
    flexShrink: 0,
    marginTop: '2px',
  },

  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 'var(--touch-target)',
    padding: '0 24px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    marginBottom: '12px',
  },

  ctaNote: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
  },

  ctaBanner: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '72px 40px',
  },

  ctaBannerInner: {
    maxWidth: '600px',
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
    height: 'var(--touch-target)',
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