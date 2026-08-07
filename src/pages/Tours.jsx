import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ArrowUpDown, X, Check, Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import PageHero from '../components/PageHero'
import TourCard from '../components/TourCard'
import useWindowWidth from '../hooks/useWindowWidth'
import tours from '../data/tours'
import { TOUR_CATEGORY_LABELS, TOUR_CATEGORY_IDS, tourCategories } from '../data/tourCategories'
import { getPage } from '../data/pages'

// Hero photo and SEO are editable in the admin (Pages → All Tours); empty
// fields fall back to the built-ins.
const toursPage = getPage('tours')
const HERO_IMAGE = toursPage?.extra?.heroImage || '/uploads/bosnia-and-herzegovina-sarajevo.webp'

const CATEGORY_LABELS = TOUR_CATEGORY_LABELS
const CATEGORIES = TOUR_CATEGORY_IDS

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

  // Place-led entry: /tours?city=Sarajevo filters to that city's day tours.
  // ?category= (hero quick links) seeds the category filter; ?search= (hero
  // and nav search bars) free-text filters across title/city/category.
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCity = searchParams.get('city') || ''
  const activeSearch = searchParams.get('search') || ''

  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
  const [activeLength,   setActiveLength]   = useState('all')
  const [sortBy,         setSortBy]         = useState('default')
  const [sortOpen,       setSortOpen]       = useState(false)

  // The hero search field mirrors ?search= — seeded from it, resynced when
  // the param changes underneath us (e.g. a new search from the navbar).
  const [searchInput,   setSearchInput]   = useState(activeSearch)
  const [searchFocused, setSearchFocused] = useState(false)
  useEffect(() => { setSearchInput(activeSearch) }, [activeSearch])

  // The grid filters live as you type; the URL catches up on a short
  // debounce so results stay shareable without a history entry per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      const q = searchInput.trim()
      if (q === activeSearch) return
      const next = new URLSearchParams(searchParams)
      if (q) next.set('search', q)
      else next.delete('search')
      setSearchParams(next, { replace: true })
    }, 350)
    return () => clearTimeout(t)
  }, [searchInput]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const searchQuery = searchInput.trim().toLowerCase()
  const filtered = tours.filter((tour) => {
    if (activeCity && (tour.city || '').toLowerCase() !== activeCity.toLowerCase()) return false
    if (activeCategory !== 'all' && !tourCategories(tour).includes(activeCategory)) return false
    if (activeLength !== 'all' && getLengthBucket(tour.duration) !== activeLength) return false
    if (
      searchQuery &&
      ![tour.title, tour.subtitle, tour.city, tourCategories(tour).join(' '), tour.badge].some(
        (f) => f && f.toLowerCase().includes(searchQuery),
      )
    )
      return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc')      return a.price - b.price
    if (sortBy === 'price-desc')     return b.price - a.price
    if (sortBy === 'duration-asc')   return durationToHours(a.duration) - durationToHours(b.duration)
    if (sortBy === 'duration-desc')  return durationToHours(b.duration) - durationToHours(a.duration)
    return 0
  })

  const hasActiveFilters = activeCategory !== 'all' || activeLength !== 'all' || sortBy !== 'default' || !!activeCity || !!searchQuery

  function clearCity() {
    const next = new URLSearchParams(searchParams)
    next.delete('city')
    setSearchParams(next, { replace: true })
  }

  function clearSearch() {
    setSearchInput('')
    const next = new URLSearchParams(searchParams)
    next.delete('search')
    setSearchParams(next, { replace: true })
  }

  function submitSearch(e) {
    e.preventDefault()
    const q = searchInput.trim()
    const next = new URLSearchParams(searchParams)
    if (q) next.set('search', q)
    else next.delete('search')
    setSearchParams(next, { replace: true })
  }

  function clearFilters() {
    setActiveCategory('all')
    setActiveLength('all')
    setSortBy('default')
    setSearchInput('')
    const next = new URLSearchParams(searchParams)
    next.delete('city')
    next.delete('search')
    setSearchParams(next, { replace: true })
  }

  const sortIsActive = sortBy !== 'default'

  return (
    <div>
      <SEO
        title={toursPage?.seo?.title || 'Guided Tours in Sarajevo'}
        description={toursPage?.seo?.description || 'Small group tours in Sarajevo and Bosnia led by a local guide. War history, food tours, day trips to Mostar and more. Genuinely small groups. Book online.'}
        url="/tours"
        image="https://tallesttourguide.com/og-image.jpg"
      />

      {/* ── PAGE HERO ── */}
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Gazi Husrev-beg Mosque and the clock tower above the rooftops of Sarajevo"
        focal="center 42%"
        kicker={activeCity ? 'Day tours' : (toursPage?.extra?.kicker || 'Explore Bosnia')}
        title={activeCity ? `Day tours in ${activeCity}` : (toursPage?.extra?.heading || 'All Tours')}
        lede={activeCity
          ? `Our small-group day tours in ${activeCity}, each led by a local guide.`
          : (toursPage?.extra?.lede || 'One local guide. Every experience designed to show you the Bosnia most visitors never find.')}
        overlap
      >
        <form role="search" onSubmit={submitSearch} style={{ ...styles.heroSearch, boxShadow: searchFocused ? '0 10px 36px rgba(0,0,0,0.32), 0 0 0 3px rgba(244,161,48,0.4)' : '0 10px 36px rgba(0,0,0,0.28)' }}>
          <Search size={17} color="var(--color-n500)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={isMobile ? 'Search tours…' : 'Search tours — try “Mostar” or “food”…'}
            aria-label="Search tours"
            style={styles.heroSearchInput}
          />
          {searchInput && (
            <button type="button" onClick={clearSearch} aria-label="Clear search" style={styles.heroSearchClear}>
              <X size={15} />
            </button>
          )}
          <button type="submit" className="btn-lift btn-glow-green" style={styles.heroSearchSubmit}>Search</button>
        </form>
        {activeCity && (
          <button
            onClick={clearCity}
            className="hero-chip"
            style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, height: 38, padding: '0 16px', background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 999, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background-color var(--t-fast), border-color var(--t-fast)' }}
          >
            <X size={14} /> Show all day tours
          </button>
        )}
      </PageHero>

      {/* ── FLOATING FILTER CARD ── */}
      <div style={{
        ...styles.filterOuter,
        padding: isMobile ? '0 12px' : '0 40px',
        marginTop: isMobile ? '-24px' : '-60px',
      }}>
        <div style={{
          ...styles.filterCard,
          padding: isMobile ? '14px 16px' : '16px 22px',
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

                {/* Scrollable duration segmented control */}
                <div
                  className="chips-scroll"
                  style={{ display: 'flex', alignItems: 'center', flex: 1 }}
                >
                  <div style={styles.segmented}>
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
                      <div className="menu-appear" style={{ ...styles.sortDropdown, right: 0, left: 'auto' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={styles.filterLabel}>Category</span>
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
                </div>
                <span style={styles.resultCount}>
                  <strong style={styles.resultCountNumber}>{sorted.length}</strong>{' '}
                  {sorted.length === 1 ? 'tour' : 'tours'}
                </span>
              </div>

              {/* Divider */}
              <div style={styles.filterDivider} />

              {/* DESKTOP: Row 2 — Duration | Time | Sort */}
              <div style={{ ...styles.controlsRow, flexDirection: 'row', alignItems: 'center' }}>

                <div style={{ ...styles.filterGroup, flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                  <span style={styles.filterLabel}>Duration</span>
                  <div style={styles.segmented}>
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
                      <div className="menu-appear" style={styles.sortDropdown}>
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
                oldPrice={tour.oldPrice}
                rating={tour.rating}
                reviews={tour.reviews}
                duration={tour.duration}
                groupSize={tour.groupSize}
                highlights={tour.highlights}
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
    borderRadius: 'var(--radius-pill)',
    border: active ? '1.5px solid var(--color-forest-green)' : '1.5px solid var(--color-n200)',
    backgroundColor: active ? 'var(--color-forest-green)' : 'var(--color-n000)',
    color: active ? 'var(--color-n000)' : 'var(--color-n700)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: compact ? '12px' : '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background-color var(--t-fast), color var(--t-fast), border-color var(--t-fast)',
  }
}

// Segment inside the styles.segmented track — active gets the raised white
// pill, inactive stays quiet on the n100 track.
function chipStyle(active, compact = false) {
  return {
    height: compact ? '26px' : '28px',
    padding: compact ? '0 12px' : '0 14px',
    borderRadius: 'var(--radius-pill)',
    border: 'none',
    backgroundColor: active ? 'var(--color-n000)' : 'transparent',
    color: active ? 'var(--color-n900)' : 'var(--color-n500)',
    fontFamily: 'var(--font-body)',
    fontWeight: active ? '600' : '500',
    fontSize: compact ? '12px' : '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    boxShadow: active ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
    transition: 'background-color var(--t-fast), color var(--t-fast), box-shadow var(--t-fast)',
  }
}

function sortBtnStyle(active, compact = false) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: compact ? '4px' : '6px',
    height: compact ? '30px' : '34px',
    padding: compact ? '0 10px' : '0 14px',
    borderRadius: 'var(--radius-pill)',
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
  heroSearch: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    maxWidth: '520px',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '999px',
    padding: '6px 6px 6px 18px',
    transition: 'box-shadow 0.2s ease',
  },

  heroSearchInput: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--color-n900)',
    padding: '9px 0',
  },

  heroSearchClear: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    border: 'none',
    background: 'transparent',
    color: 'var(--color-n500)',
    cursor: 'pointer',
    borderRadius: '50%',
    flexShrink: 0,
  },

  heroSearchSubmit: {
    flexShrink: 0,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '14px',
    padding: '11px 22px',
    borderRadius: '999px',
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

  resultCountNumber: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '14px',
    color: 'var(--color-forest-green)',
  },

  segmented: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    backgroundColor: 'var(--color-n100)',
    borderRadius: 'var(--radius-pill)',
    padding: '3px',
    flexShrink: 0,
  },

  filterDivider: {
    height: '1px',
    backgroundColor: 'var(--color-n200)',
    margin: '12px 0',
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
    fontSize: '12px',
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
