import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ArrowUpDown, X, Check } from 'lucide-react'
import SEO from '../components/SEO'
import TourCard from '../components/TourCard'
import useWindowWidth from '../hooks/useWindowWidth'
import tours from '../data/tours'
import { useAllReviews } from '../hooks/useAllReviews'

const CATEGORY_LABELS = {
  'city-walks':   'City Walks',
  'day-trips':    'Day Trips',
  'history':      'History & War',
  'food-culture': 'Food & Culture',
  'adventure':    'Adventure',
}

const CATEGORIES = Object.keys(CATEGORY_LABELS)

const LENGTH_OPTIONS = [
  { value: 'all',      label: 'Any' },
  { value: 'short',    label: 'Under 2h' },
  { value: 'half-day', label: 'Half Day' },
  { value: 'full-day', label: 'Full Day' },
]

const SORT_OPTIONS = [
  { value: 'default',       label: 'Default order' },
  { value: 'price-asc',     label: 'Price: Low to High' },
  { value: 'price-desc',    label: 'Price: High to Low' },
  { value: 'duration-asc',  label: 'Duration: Shortest' },
  { value: 'duration-desc', label: 'Duration: Longest' },
]

const SORT_SHORT = {
  'default':       'Sort',
  'price-asc':     'Price ↑',
  'price-desc':    'Price ↓',
  'duration-asc':  'Shortest',
  'duration-desc': 'Longest',
}

function getLengthBucket(duration) {
  if (!duration) return 'half-day'
  if (duration.toLowerCase().includes('full')) return 'full-day'
  const hours = parseFloat(duration)
  if (hours <= 2) return 'short'
  return 'half-day'
}

function durationToHours(duration) {
  if (!duration) return 0
  if (duration.toLowerCase().includes('full')) return 8
  return parseFloat(duration) || 0
}

function Tours() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const { stats } = useAllReviews()

  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLength,   setActiveLength]   = useState('all')
  const [sortBy,         setSortBy]         = useState('default')
  const [sortOpen,       setSortOpen]       = useState(false)

  const sortRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = tours.filter((tour) => {
    if (activeCategory !== 'all' && tour.category !== activeCategory) return false
    if (activeLength !== 'all' && getLengthBucket(tour.duration) !== activeLength) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc')      return a.price - b.price
    if (sortBy === 'price-desc')     return b.price - a.price
    if (sortBy === 'duration-asc')   return durationToHours(a.duration) - durationToHours(b.duration)
    if (sortBy === 'duration-desc')  return durationToHours(b.duration) - durationToHours(a.duration)
    return 0
  })

  const hasActiveFilters = activeCategory !== 'all' || activeLength !== 'all' || sortBy !== 'default'

  function clearFilters() {
    setActiveCategory('all')
    setActiveLength('all')
    setSortBy('default')
  }

  const sortIsActive = sortBy !== 'default'

  return (
    <div>
      <SEO
        title="Guided Tours in Sarajevo"
        description="Small group tours in Sarajevo and Bosnia led by a local guide. War history, food tours, day trips to Mostar and more. Max 12 people. Book online."
        url="/tours"
        image="https://tallesttourguide.com/og-image.jpg"
      />

      {/* ── PAGE HEADER ── */}
      <section style={styles.pageHeader}>
        <div style={styles.headerInner}>
          <span style={styles.eyebrow}>Explore Bosnia</span>
          <h1 style={styles.headline}>All Tours</h1>
          <p style={styles.subheading}>
            One local guide. Every experience designed to show you
            the Bosnia most visitors never find.
          </p>
        </div>
      </section>

      {/* ── FLOATING FILTER CARD ── */}
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
              {/* MOBILE: Row 1 — Horizontally scrollable category chips */}
              <div
                className="chips-scroll"
                style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}
              >
                <button
                  style={catPillStyle(activeCategory === 'all', true)}
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    style={catPillStyle(activeCategory === cat, true)}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={styles.filterDivider} />

              {/* MOBILE: Row 2 — Scrollable chips left, sort+count pinned right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>

                {/* Scrollable duration + time chips */}
                <div
                  className="chips-scroll"
                  style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}
                >
                  {LENGTH_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      style={chipStyle(activeLength === opt.value, true)}
                      onClick={() => setActiveLength(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Pinned right: count + optional clear + sort */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0,
                  paddingLeft: '10px',
                  borderLeft: '1px solid var(--color-n200)',
                  marginLeft: '4px',
                }}>
                  <span style={{ ...styles.resultCount, fontSize: '12px' }}>
                    {sorted.length}
                  </span>

                  {hasActiveFilters && (
                    <button
                      style={{ ...styles.clearBtn, padding: '0 6px' }}
                      onClick={clearFilters}
                      aria-label="Clear filters"
                    >
                      <X size={13} />
                    </button>
                  )}

                  <div style={{ position: 'relative' }} ref={sortRef}>
                    <button
                      style={sortBtnStyle(sortIsActive, true)}
                      onClick={() => setSortOpen((v) => !v)}
                    >
                      <ArrowUpDown size={13} />
                      <ChevronDown
                        size={11}
                        style={{
                          transform: sortOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform var(--t-fast)',
                        }}
                      />
                    </button>

                    {sortOpen && (
                      <div style={{ ...styles.sortDropdown, right: 0, left: 'auto' }}>
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            style={sortOptionStyle(sortBy === opt.value)}
                            onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                          >
                            {opt.label}
                            {sortBy === opt.value && (
                              <Check size={13} color="var(--color-forest-green)" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </>
          ) : (
            <>
              {/* DESKTOP: Row 1 — Category pills + result count */}
              <div style={styles.categoryRow}>
                <div style={styles.categoryPills}>
                  <button
                    style={catPillStyle(activeCategory === 'all')}
                    onClick={() => setActiveCategory('all')}
                    className="btn-lift"
                  >
                    All Tours
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      style={catPillStyle(activeCategory === cat)}
                      onClick={() => setActiveCategory(cat)}
                      className="btn-lift"
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
                <span style={styles.resultCount}>
                  {sorted.length} {sorted.length === 1 ? 'tour' : 'tours'}
                </span>
              </div>

              {/* Divider */}
              <div style={styles.filterDivider} />

              {/* DESKTOP: Row 2 — Duration | Time | Sort */}
              <div style={{ ...styles.controlsRow, flexDirection: 'row', alignItems: 'center' }}>

                <div style={{ ...styles.filterGroup, flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                  <span style={styles.filterLabel}>Duration</span>
                  <div style={styles.filterChips}>
                    {LENGTH_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        style={chipStyle(activeLength === opt.value)}
                        onClick={() => setActiveLength(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1 }} />

                <div style={{ ...styles.sortGroup }}>
                  {hasActiveFilters && (
                    <button style={styles.clearBtn} onClick={clearFilters}>
                      <X size={12} />
                      Clear filters
                    </button>
                  )}

                  <div style={{ position: 'relative' }} ref={sortRef}>
                    <button
                      style={sortBtnStyle(sortIsActive)}
                      onClick={() => setSortOpen((v) => !v)}
                    >
                      <ArrowUpDown size={13} />
                      {SORT_SHORT[sortBy]}
                      <ChevronDown
                        size={13}
                        style={{
                          transform: sortOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform var(--t-fast)',
                        }}
                      />
                    </button>

                    {sortOpen && (
                      <div style={styles.sortDropdown}>
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            style={sortOptionStyle(sortBy === opt.value)}
                            onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                          >
                            {opt.label}
                            {sortBy === opt.value && (
                              <Check size={13} color="var(--color-forest-green)" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>

      {/* ── TOURS GRID ── */}
      <section style={styles.toursSection}>
        {sorted.length === 0 ? (
          <div style={styles.noResults}>
            <p style={styles.noResultsText}>No tours match your filters.</p>
            <button style={styles.noResultsClear} onClick={clearFilters}>
              Clear filters →
            </button>
          </div>
        ) : (
          <div style={{
            ...styles.cardGrid,
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          }}>
            {sorted.map((tour) => (
              <TourCard
                key={tour.id}
                id={tour.id}
                slug={tour.slug}
                title={tour.title}
                price={tour.price}
                rating={stats[String(tour.id)]?.avgRating ?? tour.rating}
                reviews={stats[String(tour.id)]?.count ?? tour.reviews}
                duration={tour.duration}
                groupSize={tour.groupSize}
                badge={tour.badge}
                hero={tour.hero}
                startingTimes={tour.startingTimes}
                languages={tour.languages}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

/* ── Style helpers ────────────────────────────────────────────── */

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

/* ── Styles ──────────────────────────────────────────────────── */

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
    marginTop: '-44px',
    position: 'relative',
    zIndex: 10,
  },

  filterCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    border: '1px solid var(--color-n200)',
    padding: '20px 24px',
    maxWidth: '1100px',
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

  pipeDivider: {
    width: '1px',
    height: '28px',
    backgroundColor: 'var(--color-n200)',
    flexShrink: 0,
    alignSelf: 'center',
    margin: '0 20px',
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

  toursSection: {
    padding: '52px 40px 72px',
    backgroundColor: 'var(--color-n100)',
  },

  cardGrid: {
    display: 'grid',
    gap: '28px',
    maxWidth: '1100px',
    margin: '0 auto',
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
}

export default Tours
