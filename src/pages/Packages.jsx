import SEO from '../components/SEO'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Gauge, MapPin, Globe, Sparkles, CheckCircle,
  ChevronDown, ArrowUpDown, X, Check,
} from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'
import package1Hero from '../assets/package-1-hero.webp'
import package2Hero from '../assets/package-2-hero.webp'
import package3Hero from '../assets/package-3-hero.webp'
import package4Hero from '../assets/package-4-hero.webp'
import package5Hero from '../assets/package-5-hero.webp'
import package6Hero from '../assets/package-6-hero.webp'
import package7Hero from '../assets/package-7-hero.webp'

const DURATION_OPTIONS = [
  { value: 'all',      label: 'All' },
  { value: 'short',    label: '≤3 Days' },
  { value: 'medium',   label: '5–7 Days' },
  { value: 'extended', label: '10+ Days' },
]

const DIFFICULTY_OPTIONS = [
  { value: 'all',         label: 'Any difficulty' },
  { value: 'Easy',        label: 'Easy' },
  { value: 'Moderate',    label: 'Moderate' },
  { value: 'Challenging', label: 'Challenging' },
]

const SORT_OPTIONS = [
  { value: 'default',      label: 'Default order' },
  { value: 'price-asc',    label: 'Price: Low to High' },
  { value: 'price-desc',   label: 'Price: High to Low' },
  { value: 'duration-asc', label: 'Duration: Shortest' },
  { value: 'duration-desc',label: 'Duration: Longest' },
]

const SORT_SHORT = {
  'default':       'Sort',
  'price-asc':     'Price ↑',
  'price-desc':    'Price ↓',
  'duration-asc':  'Shortest',
  'duration-desc': 'Longest',
}

function getDurationBucket(duration) {
  const days = parseInt(duration) || 0
  if (days <= 3)  return 'short'
  if (days <= 7)  return 'medium'
  return 'extended'
}

const COUNTRIES = [
  'Bosnia', 'Serbia', 'Croatia', 'Montenegro',
  'Slovenia', 'Albania', 'Macedonia', 'Greece', 'Romania', 'Bulgaria',
]

const DIFFICULTY_COLOR = {
  Easy: { color: 'var(--color-forest-green)', bg: 'rgba(46,125,94,0.10)', border: 'rgba(46,125,94,0.20)' },
  Moderate: { color: '#b45309', bg: 'rgba(180,83,9,0.08)', border: 'rgba(180,83,9,0.18)' },
  Challenging: { color: '#c0392b', bg: 'rgba(192,57,43,0.08)', border: 'rgba(192,57,43,0.18)' },
}

const standardPackages = [
  {
    id: 1,
    slug: 'sarajevo-essential',
    name: '3-Day Complete Sarajevo Experience: Let us show you our home',
    subtitle: 'Stories, Survival & Soul',
    duration: '3 Days',
    groupSize: 12,
    price: 99,
    originalPrice: 120,
    rating: 5.0,
    reviews: 1,
    badge: 'Most Popular',
    badgeColor: 'var(--color-amber)',
    badgeTextColor: 'var(--color-n900)',
    difficulty: 'Easy',
    locations: 3,
    countries: 1,
    countryList: ['Bosnia'],
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
    slug: 'bosnia-deep-dive',
    name: 'Bosnia Deep Dive',
    subtitle: 'Real Bosnia, Deeply Experienced',
    duration: '5 Days',
    groupSize: 12,
    price: 759,
    originalPrice: 850,
    rating: 5.0,
    reviews: 11,
    badge: 'Best Value',
    badgeColor: 'var(--color-forest-green)',
    badgeTextColor: 'var(--color-n000)',
    difficulty: 'Easy',
    locations: 7,
    countries: 1,
    countryList: ['Bosnia'],
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
  {
    id: 3,
    slug: 'sarajevo-to-dubrovnik',
    name: 'Sarajevo to Dubrovnik',
    subtitle: 'Empires, Mountains & the Adriatic Coast',
    duration: '7 Days',
    groupSize: 10,
    price: 890,
    originalPrice: null,
    rating: 5.0,
    reviews: 0,
    badge: 'New',
    badgeColor: 'var(--color-amber)',
    badgeTextColor: 'var(--color-n900)',
    difficulty: 'Moderate',
    locations: 8,
    countries: 2,
    countryList: ['Bosnia', 'Croatia'],
    hero: package3Hero,
    description: 'Seven days from Sarajevo to Dubrovnik through Herzegovina — the Neretva canyon, Tito\'s nuclear bunker, Mostar\'s old bridge, wine country, and the walls of Dubrovnik.',
    highlights: [
      "Tito's Nuclear Bunker (ARK D-0)",
      'Mostar Old Bridge & War Walk',
      'Dubrovnik City Walls',
    ],
    includes: [
      'Private minibus transport throughout',
      'Guide for all 7 days',
      'Welcome dinner & farewell breakfast',
      'Free cancellation up to 72 hours before',
    ],
  },
  {
    id: 4,
    slug: 'balkans-full-arc',
    name: 'Balkans Full Arc',
    subtitle: 'Bosnia · Montenegro · Albania · Kosovo · Serbia',
    duration: '15 Days',
    groupSize: 8,
    price: 4490,
    originalPrice: null,
    rating: 5.0,
    reviews: 0,
    badge: 'Epic Journey',
    badgeColor: 'var(--color-forest-green)',
    badgeTextColor: 'var(--color-n000)',
    difficulty: 'Challenging',
    locations: 14,
    countries: 5,
    countryList: ['Bosnia', 'Montenegro', 'Albania', 'Serbia'],
    hero: package4Hero,
    description: 'Fifteen days across five countries — from Sarajevo\'s siege history through Montenegro\'s canyons, Albanian Alps, Kosovo\'s contradictions, and Belgrade\'s creative chaos.',
    highlights: [
      'Bay of Kotor & Lovćen National Park',
      'Valbona Valley Albanian Alps trek',
      'Belgrade nightlife and Nikola Tesla Museum',
    ],
    includes: [
      'Private minibus transport throughout',
      'Guide for all 15 days',
      'Welcome and farewell meals included',
      'Free cancellation up to 72 hours before',
    ],
  },
  {
    id: 5,
    slug: 'empires-and-edge',
    name: 'Empires & Edge',
    subtitle: 'Bosnia & Montenegro in 5 Days',
    duration: '5 Days',
    groupSize: 8,
    price: 1490,
    originalPrice: null,
    rating: 5.0,
    reviews: 0,
    badge: 'New',
    badgeColor: 'var(--color-amber)',
    badgeTextColor: 'var(--color-n900)',
    difficulty: 'Moderate',
    locations: 6,
    countries: 2,
    countryList: ['Bosnia', 'Montenegro'],
    hero: package5Hero,
    description: 'Five days from Sarajevo through Herzegovina and into Montenegro — the nuclear bunker, Mostar\'s old bridge, Kotor\'s bay, and Lovćen\'s panoramic peak.',
    highlights: [
      'Tito\'s Nuclear Bunker (ARK D-0)',
      'Mostar Old Bridge & Stari Grad',
      'Bay of Kotor from the water',
    ],
    includes: [
      'Private transport throughout',
      'Guide for all 5 days',
      'Welcome dinner included',
      'Free cancellation up to 72 hours before',
    ],
  },
  {
    id: 6,
    slug: 'mountains-of-the-balkans',
    name: 'Mountains of the Balkans',
    subtitle: 'Montenegro · Albania · Kosovo in 5 Days',
    duration: '5 Days',
    groupSize: 8,
    price: 1690,
    originalPrice: null,
    rating: 5.0,
    reviews: 0,
    badge: 'Active',
    badgeColor: 'var(--color-forest-green)',
    badgeTextColor: 'var(--color-n000)',
    difficulty: 'Challenging',
    locations: 8,
    countries: 3,
    countryList: ['Montenegro', 'Albania'],
    hero: package6Hero,
    description: 'Five days of raw mountain landscapes — Durmitor\'s glacial lakes, the Albanian Alps Valbona Valley trek, and Kosovo\'s layered history in Prizren and Pristina.',
    highlights: [
      'Durmitor National Park & Black Lake',
      'Valbona Valley trekking in the Albanian Alps',
      'Prizren — Kosovo\'s Ottoman heart',
    ],
    includes: [
      'Private transport throughout',
      'Guide for all 5 days',
      'Ferry crossing Komani Lake to Valbona',
      'Free cancellation up to 72 hours before',
    ],
  },
  {
    id: 7,
    slug: 'adriatic-crossings',
    name: 'Adriatic Crossings',
    subtitle: 'Kosovo · Serbia in 6 Days',
    duration: '6 Days',
    groupSize: 8,
    price: 1990,
    originalPrice: null,
    rating: 5.0,
    reviews: 0,
    badge: 'New',
    badgeColor: 'var(--color-amber)',
    badgeTextColor: 'var(--color-n900)',
    difficulty: 'Moderate',
    locations: 6,
    countries: 2,
    countryList: ['Serbia'],
    hero: package7Hero,
    description: 'Six days across Kosovo and Serbia — from Pristina\'s new nation energy through Novi Sad\'s Danube culture to Belgrade\'s nightlife, Nikola Tesla Museum, and Cold War relics.',
    highlights: [
      'Pristina — the world\'s newest capital',
      'Novi Sad & Petrovaradin Fortress',
      'Belgrade: Tesla Museum & Communist-era sites',
    ],
    includes: [
      'Private transport throughout',
      'Guide for all 6 days',
      'Welcome dinner included',
      'Free cancellation up to 72 hours before',
    ],
  },
]

function Packages() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const isTablet = width <= 960

  const [activeDuration,   setActiveDuration]   = useState('all')
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const [activeCountries,  setActiveCountries]  = useState([])
  const [sortBy,           setSortBy]           = useState('default')
  const [sortOpen,         setSortOpen]         = useState(false)
  const sortRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = standardPackages.filter((pkg) => {
    if (activeDuration !== 'all' && getDurationBucket(pkg.duration) !== activeDuration) return false
    if (activeDifficulty !== 'all' && pkg.difficulty !== activeDifficulty) return false
    if (activeCountries.length > 0 && !activeCountries.some((c) => pkg.countryList.includes(c))) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc')     return a.price - b.price
    if (sortBy === 'price-desc')    return b.price - a.price
    if (sortBy === 'duration-asc')  return parseInt(a.duration) - parseInt(b.duration)
    if (sortBy === 'duration-desc') return parseInt(b.duration) - parseInt(a.duration)
    return 0
  })

  const hasActiveFilters = activeDuration !== 'all' || activeDifficulty !== 'all' || activeCountries.length > 0 || sortBy !== 'default'
  const sortIsActive = sortBy !== 'default'

  function clearFilters() {
    setActiveDuration('all')
    setActiveDifficulty('all')
    setActiveCountries([])
    setSortBy('default')
  }

  function toggleCountry(country) {
    setActiveCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    )
  }

  const cols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'

  return (
    <div>

      <SEO
        title="Multi-day tours"
        description="Multi-day tour packages in Bosnia and the Adriatic. 3-Day Complete Sarajevo Experience (3 days), Bosnia Deep Dive (5 days), and Sarajevo to Dubrovnik (7 days). Includes private transfers, meals, and all guided experiences."
        url="/multi-day-tours"
        image="https://tallesttourguide.com/og-image.jpg"
      />

      {/* Page header */}
      <section style={styles.pageHeader}>
        <div style={styles.headerInner}>
          <span style={styles.eyebrow}>Curated Experiences</span>
          <h1 style={styles.headline}>Multi-day tours</h1>
          <p style={styles.subheading}>
            From two focused days in Sarajevo to a seven-day journey
            all the way to Dubrovnik — or a fully personalised itinerary
            built entirely around you.
          </p>
        </div>
      </section>

      {/* Floating filter card */}
      <div style={{
        ...styles.filterOuter,
        padding: isMobile ? '0 12px' : '0 40px',
        marginTop: isMobile ? '-24px' : '-44px',
      }}>
        <div style={{
          ...styles.filterCard,
          padding: isMobile ? '14px 16px' : '20px 24px',
        }}>

          {isMobile ? (
            <>
              <div className="chips-scroll" style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                {DURATION_OPTIONS.map((opt) => (
                  <button key={opt.value} style={catPillStyle(activeDuration === opt.value, true)} onClick={() => setActiveDuration(opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>

              <div style={styles.filterDivider} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <div className="chips-scroll" style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <button key={opt.value} style={chipStyle(activeDifficulty === opt.value, true)} onClick={() => setActiveDifficulty(opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, paddingLeft: '10px', borderLeft: '1px solid var(--color-n200)', marginLeft: '4px' }}>
                  <span style={{ ...styles.resultCount, fontSize: '12px' }}>{sorted.length}</span>
                  {hasActiveFilters && (
                    <button style={{ ...styles.clearBtn, padding: '0 6px' }} onClick={clearFilters} aria-label="Clear filters">
                      <X size={13} />
                    </button>
                  )}
                  <div style={{ position: 'relative' }} ref={sortRef}>
                    <button style={sortBtnStyle(sortIsActive, true)} onClick={() => setSortOpen((v) => !v)}>
                      <ArrowUpDown size={13} />
                      <ChevronDown size={11} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--t-fast)' }} />
                    </button>
                    {sortOpen && (
                      <div style={{ ...styles.sortDropdown, right: 0, left: 'auto' }}>
                        {SORT_OPTIONS.map((opt) => (
                          <button key={opt.value} style={sortOptionStyle(sortBy === opt.value)} onClick={() => { setSortBy(opt.value); setSortOpen(false) }}>
                            {opt.label}
                            {sortBy === opt.value && <Check size={13} color="var(--color-forest-green)" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={styles.filterDivider} />

              {/* Mobile: Countries scrollable row */}
              <div className="chips-scroll" style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                {COUNTRIES.map((country) => (
                  <button key={country} style={countryChipStyle(activeCountries.includes(country), true)} onClick={() => toggleCountry(country)}>
                    {country}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Row 1: Duration pills + count */}
              <div style={styles.categoryRow}>
                <div style={styles.categoryPills}>
                  {DURATION_OPTIONS.map((opt) => (
                    <button key={opt.value} style={catPillStyle(activeDuration === opt.value)} onClick={() => setActiveDuration(opt.value)} className="btn-lift">
                      {opt.label}
                    </button>
                  ))}
                </div>
                <span style={styles.resultCount}>
                  {sorted.length} {sorted.length === 1 ? 'package' : 'packages'}
                </span>
              </div>

              <div style={styles.filterDivider} />

              {/* Row 2: Difficulty chips + sort */}
              <div style={{ ...styles.controlsRow, flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ ...styles.filterGroup, flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                  <span style={styles.filterLabel}>Difficulty</span>
                  <div style={styles.filterChips}>
                    {DIFFICULTY_OPTIONS.map((opt) => (
                      <button key={opt.value} style={chipStyle(activeDifficulty === opt.value)} onClick={() => setActiveDifficulty(opt.value)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1 }} />

                <div style={styles.sortGroup}>
                  {hasActiveFilters && (
                    <button style={styles.clearBtn} onClick={clearFilters}>
                      <X size={12} />
                      Clear filters
                    </button>
                  )}
                  <div style={{ position: 'relative' }} ref={sortRef}>
                    <button style={sortBtnStyle(sortIsActive)} onClick={() => setSortOpen((v) => !v)}>
                      <ArrowUpDown size={13} />
                      {SORT_SHORT[sortBy]}
                      <ChevronDown size={13} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--t-fast)' }} />
                    </button>
                    {sortOpen && (
                      <div style={styles.sortDropdown}>
                        {SORT_OPTIONS.map((opt) => (
                          <button key={opt.value} style={sortOptionStyle(sortBy === opt.value)} onClick={() => { setSortBy(opt.value); setSortOpen(false) }}>
                            {opt.label}
                            {sortBy === opt.value && <Check size={13} color="var(--color-forest-green)" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={styles.filterDivider} />

              {/* Row 3: Countries multi-select */}
              <div style={{ ...styles.filterGroup, flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                <span style={styles.filterLabel}>Countries</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {COUNTRIES.map((country) => (
                    <button
                      key={country}
                      style={countryChipStyle(activeCountries.includes(country))}
                      onClick={() => toggleCountry(country)}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Packages grid */}
      <section style={styles.packagesSection}>
        {sorted.length === 0 ? (
          <div style={styles.noResults}>
            <p style={styles.noResultsText}>No packages match your filters.</p>
            <button style={styles.noResultsClear} onClick={clearFilters}>Clear filters →</button>
          </div>
        ) : (
          <div style={{ ...styles.cardsList, gridTemplateColumns: cols }}>
            {sorted.map((pkg) => (
              <Link key={pkg.id} to={`/packages/${pkg.slug}`} style={styles.cardLink}>
                <div style={styles.card} className="pkg-card">
                  <div style={styles.imageWrapper}>
                    <img src={pkg.hero} alt={pkg.name} style={styles.photo} className="pkg-card-img" />
                    <div style={styles.imageGradient} />
                    <div style={styles.imageTop}>
                      <span style={{ ...styles.badge, backgroundColor: pkg.badgeColor, color: pkg.badgeTextColor }}>{pkg.badge}</span>
                      <span style={styles.daysPill}>{pkg.duration}</span>
                    </div>
                    <div style={styles.imageBottom}>
                      <h3 style={styles.packageName}>{pkg.name}</h3>
                      <p style={styles.packageSubtitle}>{pkg.subtitle}</p>
                      <div style={styles.statPills}>
                        <span style={styles.statPill}><Gauge size={11} />{pkg.difficulty}</span>
                        <span style={styles.statPill}><MapPin size={11} />{pkg.locations} stops</span>
                        <span style={styles.statPill}><Globe size={11} />{pkg.countries} {pkg.countries === 1 ? 'country' : 'countries'}</span>
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
            ))}
          </div>
        )}
      </section>

      {/* Personalised Tour Package */}
      <section style={styles.personalisedSection}>

        <div style={{
          ...styles.sectionLabel,
          marginBottom: '24px',
        }}>
          <span style={styles.sectionLabelText}>Want Something Unique?</span>
        </div>

        <div style={{
          ...styles.personalisedCard,
          flexDirection: isMobile ? 'column' : 'row',
        }}>

          {/* Left — dark background with headline */}
          <div style={styles.personalisedLeft}>
            <div style={styles.personalisedIconWrapper}>
              <Sparkles size={28} color="var(--color-amber)" strokeWidth={1.5} />
            </div>
            <h2 style={styles.personalisedTitle}>Personalised Tour Package</h2>
            <p style={styles.personalisedTagline}>Your interests. Your pace. Your Bosnia.</p>
            <p style={styles.personalisedDesc}>
              Not every traveller fits a template. If you have specific interests,
              a custom group, or a vision for what Bosnia should feel like for you —
              we build it from scratch. Fill in our short questionnaire and we'll
              come back to you within 24 hours with a proposal.
            </p>
          </div>

          {/* Right — what you get + CTA */}
          <div style={styles.personalisedRight}>
            <span style={styles.personalisedLabel}>What you get</span>
            <div style={styles.personalisedFeatures}>
              {[
                'Itinerary built entirely around your interests',
                'Private guide — no shared groups',
                'Flexible dates and duration',
                'Accommodation arranged on request',
                'Response within 24 hours',
              ].map((feature, i) => (
                <div key={i} style={styles.personalisedFeature}>
                  <CheckCircle size={15} color="var(--color-amber)" />
                  <span style={styles.personalisedFeatureText}>{feature}</span>
                </div>
              ))}
            </div>
            <Link to="/personalised" style={styles.personalisedBtn} className="btn-lift btn-glow-amber">
              <span>Start Your Questionnaire</span>
              <ArrowRight size={16} color="var(--color-n900)" />
            </Link>
            <p style={styles.personalisedNote}>No commitment — just a conversation starter.</p>
          </div>

        </div>

      </section>

      {/* Bottom CTA */}
      <section style={styles.ctaBanner}>
        <div style={styles.ctaBannerInner}>
          <h2 style={styles.ctaBannerTitle}>
            Not sure which multi-day tour is right for you?
          </h2>
          <p style={styles.ctaBannerText}>
            Send a message and we'll recommend the best option
            based on your travel dates, group size, and interests.
          </p>
          <Link to="/contact" style={styles.ctaBannerBtn} className="btn-lift btn-glow-amber">
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
    padding: '36px 40px 72px',
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
    marginBottom: '12px',
  },

  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-amber-light)',
    lineHeight: 'var(--leading-body)',
  },

  filterOuter: {
    position: 'relative',
    zIndex: 10,
  },

  filterCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    border: '1px solid var(--color-n200)',
    maxWidth: '1160px',
    margin: '0 auto',
  },

  categoryRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },

  categoryPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },

  resultCount: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '13px',
    color: 'var(--color-n500)',
    whiteSpace: 'nowrap',
  },

  filterDivider: {
    height: '1px',
    backgroundColor: 'var(--color-n200)',
    margin: '16px 0',
  },

  controlsRow: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  filterGroup: {
    display: 'flex',
  },

  filterLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    color: 'var(--color-n400)',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },

  filterChips: {
    display: 'flex',
    gap: '2px',
  },

  sortGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  clearBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    height: '28px',
    padding: '0 10px',
    border: 'none',
    background: 'none',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '12px',
    color: 'var(--color-n500)',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },

  sortDropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '200px',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
    border: '1px solid var(--color-n200)',
    overflow: 'hidden',
    zIndex: 50,
  },

  packagesSection: {
    padding: '52px 40px 80px',
    backgroundColor: 'var(--color-n100)',
  },

  noResults: {
    textAlign: 'center',
    padding: '80px 20px',
    maxWidth: '400px',
    margin: '0 auto',
  },

  noResultsText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    marginBottom: '16px',
  },

  noResultsClear: {
    border: 'none',
    background: 'none',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-forest-green)',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },

  personalisedSection: {
    padding: '72px 40px 80px 40px',
    backgroundColor: 'var(--color-n000)',
  },

  sectionLabel: {
    maxWidth: '1160px',
    margin: '0 auto 24px auto',
  },

  sectionLabelText: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
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
    borderRadius: '20px',
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

  badge: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '4px 11px',
    borderRadius: '100px',
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

  // Personalised card — dark background, two column layout.
  // Visually distinct from the standard package cards above —
  // signals this is a different category of offering.
  personalisedCard: {
    display: 'flex',
    borderRadius: '16px',
    overflow: 'hidden',
    maxWidth: '1000px',
    margin: '0 auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  },

  personalisedLeft: {
    flex: 1,
    backgroundColor: 'var(--color-forest-deep)',
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
    backgroundColor: 'var(--color-forest-darker)',
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
    height: '44px',
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
    height: '44px',
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

function countryChipStyle(active, compact = false) {
  return {
    height: compact ? '26px' : '28px',
    padding: compact ? '0 10px' : '0 12px',
    borderRadius: '100px',
    border: active ? 'none' : '1.5px solid var(--color-n200)',
    backgroundColor: active ? 'var(--color-forest-green)' : 'var(--color-n100)',
    color: active ? 'var(--color-n000)' : 'var(--color-n700)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: compact ? '12px' : '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'background-color var(--t-fast), color var(--t-fast), border-color var(--t-fast)',
  }
}

function catPillStyle(active, compact = false) {
  return {
    height: compact ? '30px' : '34px',
    padding: compact ? '0 13px' : '0 16px',
    borderRadius: '100px',
    border: active ? 'none' : '1.5px solid var(--color-n200)',
    backgroundColor: active ? 'var(--color-forest-green)' : 'var(--color-n100)',
    color: active ? 'var(--color-n000)' : 'var(--color-n700)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: compact ? '12px' : '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background-color var(--t-fast), color var(--t-fast)',
  }
}

function chipStyle(active, compact = false) {
  return {
    height: compact ? '26px' : '28px',
    padding: compact ? '0 10px' : '0 12px',
    borderRadius: '100px',
    border: 'none',
    backgroundColor: active ? 'var(--color-n900)' : 'transparent',
    color: active ? 'var(--color-n000)' : 'var(--color-n500)',
    fontFamily: 'var(--font-body)',
    fontWeight: active ? '600' : '500',
    fontSize: compact ? '12px' : '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'background-color var(--t-fast), color var(--t-fast)',
  }
}

function sortBtnStyle(active, compact = false) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: compact ? '4px' : '6px',
    height: compact ? '30px' : '34px',
    padding: compact ? '0 10px' : '0 14px',
    borderRadius: '100px',
    border: active ? '1.5px solid var(--color-n900)' : '1.5px solid var(--color-n300)',
    backgroundColor: active ? 'var(--color-n900)' : 'var(--color-n000)',
    color: active ? 'var(--color-n000)' : 'var(--color-n600)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'border-color var(--t-fast), color var(--t-fast), background-color var(--t-fast)',
  }
}

function sortOptionStyle(active) {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 16px',
    border: 'none',
    backgroundColor: active ? 'rgba(46,125,94,0.06)' : 'transparent',
    color: active ? 'var(--color-forest-green)' : 'var(--color-n700)',
    fontFamily: 'var(--font-body)',
    fontWeight: active ? '600' : '400',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color var(--t-fast)',
  }
}

export default Packages