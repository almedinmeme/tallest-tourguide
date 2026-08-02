// TourDetail.jsx
// Fully redesigned individual tour page.
// Structure:
// - Full photo hero with overlap content card (same as PackageDetail)
// - Two column layout: details left, booking card right
// - Desktop: sticky booking card on right
// - Mobile: fixed bottom bar with drawer booking form
import SEO from '../components/SEO'
import {
  TourActivitySchema,
  FAQSchema,
} from '../schema/SchemaMarkup'
import Breadcrumbs from '../components/Breadcrumbs'
import FromTheJournal from '../components/FromTheJournal'
import Img from '../components/Img'
import { useCurrency } from '../context/CurrencyContext'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { trackEvent } from '../utils/analytics'
import { parseDuration } from '../utils/duration'
import {
  Star, Clock, Users, MapPin, CheckCircle,
  XCircle, ShieldCheck, ChevronDown, ChevronUp,
  X, Globe, Timer, AlertTriangle, Accessibility,
  Calendar,
} from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'
import tours from '../data/tours'
import { CANCEL_LINE_TOUR } from '../data/policy'
import { getTourLanguages } from '../data/tourLanguages'
import Gallery from '../components/Gallery'
import Button from '../components/Button'
import TourReviews from '../components/TourReviews'
import TourCard from '../components/TourCard'
import RichContent from '../components/RichContent'
import AccessibilitySection from '../components/AccessibilitySection'
const RouteMap = lazy(() => import('../components/RouteMap'))

// Decorative hero language pills — re-enable when multi-language ships.
// (The booking form's language selector is functional and stays regardless.)
const SHOW_LANGUAGE_PILLS = false

// Mirror of AccessibilitySection's internal check so we can conditionally
// show the in-page nav tab without importing internals.
function hasAccessibilityContent(acc) {
  if (!acc) return false
  const numericKeys = [
    'walkingDistanceKm', 'drivingDistanceKm',
    'walkingDurationMin', 'drivingDurationMin', 'durationMin',
    'elevationGainM',
  ]
  if (numericKeys.some((k) => typeof acc[k] === 'number' && acc[k] > 0)) return true
  if (acc.effortLevel) return true
  if (Array.isArray(acc.requirements) && acc.requirements.some((r) => (r?.label || '').trim())) return true
  if ((acc.terrain || '').trim() || (acc.notes || '').trim()) return true
  if (acc.suitability && Object.values(acc.suitability).some((v) => v === 'yes' || v === 'partial' || v === 'no')) return true
  return false
}
import { useAvailability } from '../hooks/useAvailability'
import { useBlockedDates } from '../hooks/useBlockedDates'
import TourCalendar from '../components/TourCalendar'

const NAVBAR_HEIGHT = 68

function SectionNav({ tabs, isMobile }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '')
  const [navbarVisible, setNavbarVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 80) {
        setNavbarVisible(true)
      } else if (y > lastScrollY.current) {
        setNavbarVisible(false)
      } else {
        setNavbarVisible(true)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (tabs.length === 0) return
    const observers = []
    tabs.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: '-10% 0px -80% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((obs) => obs.disconnect())
  }, [tabs])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = (navbarVisible ? NAVBAR_HEIGHT : 0) + 48 + 8
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <nav style={{
      position: 'sticky',
      top: navbarVisible ? `${NAVBAR_HEIGHT}px` : '0px',
      transition: 'top 0.3s ease',
      zIndex: 95,
      backgroundColor: 'var(--color-n000)',
      borderBottom: '1px solid var(--color-n300)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      whiteSpace: 'nowrap',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        height: '48px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '0 20px' : '0 40px',
        minWidth: 'max-content',
      }}>
        {tabs.map(({ id, label }) => {
          const isActive = activeId === id
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                height: '100%',
                padding: isMobile ? '0 12px' : '0 16px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--color-forest-green)' : '2px solid transparent',
                color: isActive ? 'var(--color-forest-green)' : 'var(--color-n500)',
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: isActive ? '600' : '400',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatSelectedDate(dateStr) {
  if (!dateStr) return 'Select a date'
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

const showMoreBtnStyle = {
  display: 'block',
  margin: '12px auto 0',
  height: '34px',
  padding: '0 18px',
  borderRadius: 'var(--radius-pill)',
  border: '1.5px solid var(--color-n300)',
  backgroundColor: 'transparent',
  color: 'var(--color-n600)',
  fontFamily: 'var(--font-body)',
  fontWeight: '600',
  fontSize: '13px',
  cursor: 'pointer',
}

function TourDetail() {
  const { format } = useCurrency()
  const { slug } = useParams()
  const navigate = useNavigate()
  const tour = tours.find((t) => t.slug === slug)
  const width = useWindowWidth()
  const isMobile = width <= 768
  const supportedLanguages = getTourLanguages(tour?.languages)
  const { getSpotsLeft, bookings } = useAvailability()
  const { isBlocked } = useBlockedDates()

  // Booking form state
  const [selectedDate, setSelectedDate] = useState(getTomorrow())
  const [dateError, setDateError] = useState(false)
  const [startTime, setStartTime] = useState(tour?.startingTimes?.[0] ?? '')
  const [selectedLanguage, setSelectedLanguage] = useState(
    supportedLanguages[0]?.id ?? 'english'
  )
  const [numPeople, setNumPeople] = useState(1)
  const [tourType, setTourType] = useState('shared')

  // Calendar dropdown state
  const [calendarOpen, setCalendarOpen] = useState(false)
  const calendarWrapperRef = useRef(null)

  useEffect(() => {
    if (!calendarOpen) return
    function handleOutsideClick(e) {
      if (calendarWrapperRef.current && !calendarWrapperRef.current.contains(e.target)) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [calendarOpen])

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null)

  // Highlights expand state
  const [highlightsExpanded, setHighlightsExpanded] = useState(false)

  // Inclusions expand state
  const [includedExpanded, setIncludedExpanded] = useState(false)
  const [excludedExpanded, setExcludedExpanded] = useState(false)

  useEffect(() => {
    setSelectedLanguage(supportedLanguages[0]?.id ?? 'english')
    setSelectedDate(getTomorrow())
    setStartTime(tour?.startingTimes?.[0] ?? '')
  }, [tour?.id])

  useEffect(() => {
    if (!tour) return
    trackEvent('view_item', {
      currency: 'EUR',
      value: tour.price,
      items: [{ item_id: tour.slug, item_name: tour.title, item_category: tour.category, price: tour.price }],
    })
  }, [tour?.slug])

  const scrollFired = useRef(new Set())
  useEffect(() => {
    if (!tour) return
    scrollFired.current = new Set()
    const thresholds = [25, 50, 75, 90]
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const pct = Math.round((window.scrollY / scrollable) * 100)
      thresholds.forEach((t) => {
        if (pct >= t && !scrollFired.current.has(t)) {
          scrollFired.current.add(t)
          trackEvent('scroll_depth', { page: tour.slug, depth: t })
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [tour?.slug])

  const selectedLanguageLabel =
    supportedLanguages.find((language) => language.id === selectedLanguage)?.label
      ?? supportedLanguages[0]?.label
      ?? 'English'

  // Optional booking add-ons (pick-up, tickets, …) defined per tour in the admin.
  // Guests now choose them on the /checkout screen; here we just compute the
  // amount each would cost for the selected party size and pass them along.
  const tourExtras = tour?.extras || []
  const extraAmount = (ex) =>
    ex?.perPerson ? (Number(ex.price) || 0) * numPeople : (Number(ex?.price) || 0)

  // Private pricing set per tour in the admin (Basics → Private tour price):
  // quote (default), one fixed group price, or tiers by group size. A party
  // larger than the biggest tier falls back to the quote flow.
  const privatePricing = tour?.privatePricing || { mode: 'quote' }
  const privateTiers = [...(privatePricing.tiers || [])]
    .filter((t) => Number(t.maxPeople) >= 1 && Number(t.price) > 0)
    .sort((a, b) => Number(a.maxPeople) - Number(b.maxPeople))
  const privateTotal =
    privatePricing.mode === 'fixed' && Number(privatePricing.fixedPrice) > 0
      ? Number(privatePricing.fixedPrice)
      : privatePricing.mode === 'tiered'
        ? (privateTiers.find((t) => numPeople <= Number(t.maxPeople))?.price ?? null)
        : null
  // What the Private Tour toggle shows before a party size is relevant.
  const privateToggleLabel =
    privatePricing.mode === 'fixed' && Number(privatePricing.fixedPrice) > 0
      ? format(privatePricing.fixedPrice)
      : privatePricing.mode === 'tiered' && privateTiers.length > 0
        ? `From ${format(privateTiers[0].price)}`
        : 'Quote'

  const totalPrice = tour ? (tourType === 'private' ? (privateTotal ?? 0) : tour.price * numPeople) : 0
  const bookingPriceLabel = tourType === 'private'
    ? (privateTotal != null ? format(privateTotal) : 'Quote')
    : format(totalPrice)
  const spotsLeft = tour ? getSpotsLeft(tour.slug, selectedDate, selectedLanguage, tour.groupSize) : null
  const isDateBlocked = tour ? isBlocked(tour.slug, selectedDate) : false
  // The shared slot is sold out, or we're not running shared groups this
  // day — neither is "closed", so we still let the guest ask about it
  // instead of dead-ending the booking form.
  const isRequestOnly = tourType === 'shared' && (spotsLeft === 0 || isDateBlocked)
  const maxPeople = tourType === 'private'
    ? 20
    : isRequestOnly
      ? tour.groupSize
      : (spotsLeft != null ? Math.min(tour.groupSize, spotsLeft) : tour.groupSize)

  if (!tour) {
    return (
      <div style={styles.notFound}>
        <h2>Tour not found</h2>
        <Link to="/tours" style={styles.backLinkDark}>
          ← Back to all tours
        </Link>
      </div>
    )
  }

  // Collect the tour selection and hand off to the dedicated /checkout screen,
  // where the customer enters their details and chooses to pay by bank
  // invoice or reserve & pay cash later. The calendar save + emails happen there.
  const handleBooking = () => {
    if (!selectedDate) {
      setDateError(true)
      return
    }

    // Only an unpriced private booking is a quote — a private tour with a
    // fixed or tiered price goes through the normal payment flow.
    const isPrivateQuote = tourType === 'private' && privateTotal == null
    // A private quote, a sold-out date, and a blocked date all skip payment
    // and go through Checkout's "we'll be in touch" flow — they just need
    // different wording so admin can tell them apart.
    const isQuote = isPrivateQuote || isRequestOnly
    const requestReason = isDateBlocked ? 'Date Blocked' : 'Date Full'

    // Available add-ons, with the amount each costs for this party size. The
    // guest selects/deselects them on the /checkout screen. A request-only
    // booking is still a normal shared tour pending confirmation, so it
    // keeps offering extras — only a true private quote skips them.
    const availableExtras = isPrivateQuote
      ? []
      : tourExtras.map((ex) => ({
          label: ex.label,
          description: ex.description || '',
          amount: extraAmount(ex),
          perPerson: !!ex.perPerson,
        }))

    trackEvent('begin_checkout', {
      currency: 'EUR',
      value: totalPrice,
      items: [{ item_id: tour.slug, item_name: tour.title, item_category: tour.category, price: tour.price, quantity: numPeople }],
    })

    // Base submission data — guest contact, chosen extras and the final total
    // are filled in on the checkout screen.
    // Same key set as the journey flow in PackageDetail.jsx — the two
    // booking email templates (docs/email-templates/booking-*.html) render
    // one shared layout, so both flows must fill every key.
    const templateParams = {
      type: 'Booking',
      tour_name: tour.title,
      tour_date: selectedDate,
      start_time: startTime || 'Not specified',
      num_people: numPeople,
      total_price: isPrivateQuote
        ? 'Private tour — quote requested'
        : isRequestOnly
          ? `Requested — €${totalPrice} if confirmed`
          : `€${totalPrice}`,
      tour_type: tourType === 'private'
        ? 'Private Tour'
        : isRequestOnly
          ? `Shared Tour — ${requestReason} (Requested)`
          : 'Shared Tour',
      language: selectedLanguageLabel,
    }

    // What gets written to the Bookings calendar. groupSize lets the server
    // re-check capacity at the moment of writing, which is the last defence
    // against two people taking the same final seat; bookingId makes a
    // retried submit (double-click, flaky mobile) reuse the same event
    // instead of burning a second set of seats.
    const bookingFields = {
      bookingId: nanoid(12),
      tourSlug: tour.slug,
      tourName: tour.title,
      tourDate: selectedDate,
      startTime: startTime || '',
      numPeople,
      tourType,
      language: selectedLanguageLabel,
      totalPrice: isPrivateQuote ? 0 : totalPrice,
      groupSize: tour.groupSize,
      durationMinutes: parseDuration(tour.duration),
    }

    const analytics = {
      transaction_id: `${tour.slug}-${Date.now()}`,
      currency: 'EUR',
      value: totalPrice,
      items: [{ item_id: tour.slug, item_name: tour.title, item_category: tour.category, price: tour.price, quantity: numPeople }],
    }

    navigate('/checkout', {
      state: {
        booking: {
          kind: 'tour',
          title: tour.title,
          backLink: `/tours/${tour.slug}`,
          backLabel: 'Back to tour',
          isQuote,
          summary: {
            date: formatSelectedDate(selectedDate),
            startTime: startTime || null,
            tourType: tourType === 'private'
              ? 'Private tour'
              : isRequestOnly
                ? `Shared tour — ${requestReason.toLowerCase()}, requested`
                : 'Shared tour',
            language: selectedLanguageLabel,
            numPeople,
            // A private group price has no per-person unit — the summary just
            // shows the group total.
            unitPrice: tourType === 'private' ? null : tour.price,
            total: totalPrice,
          },
          availableExtras,
          rating: tour.rating,
          reviews: tour.reviews,
          templateParams,
          bookingFields,
          analytics,
        },
      },
    })
  }

  const bookingForm = (
    <div style={{ ...styles.bookingCard, padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '17px', color: 'var(--color-n900)', margin: 0 }}>
          Book this tour
        </h3>
      </div>

          <>
              {/* Tour type toggle */}
              <div style={styles.tourTypeSection}>
                <span style={styles.toggleLabel}>Tour Type</span>
                <div style={styles.tourTypeGrid}>

                  <button
                    style={{
                      ...styles.typeOption,
                      borderColor: tourType === 'shared'
                        ? 'var(--color-forest-green)'
                        : 'var(--color-n300)',
                      backgroundColor: tourType === 'shared'
                        ? 'rgba(46,125,94,0.06)'
                        : 'var(--color-n000)',
                    }}
                    onClick={() => setTourType('shared')}
                  >
                    <span style={{
                      ...styles.typeOptionTitle,
                      color: tourType === 'shared'
                        ? 'var(--color-forest-green)'
                        : 'var(--color-n900)',
                    }}>
                      Shared Tour
                    </span>
                    <span style={styles.typeOptionPrice}>
                      {Number(tour.oldPrice) > Number(tour.price) && (
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-n400)', textDecoration: 'line-through', marginRight: '5px' }}>
                          {format(tour.oldPrice)}
                        </span>
                      )}
                      {format(tour.price)}
                      <span style={styles.typePerPerson}>/person</span>
                    </span>
                  </button>

                  <button
                    style={{
                      ...styles.typeOption,
                      borderColor: tourType === 'private'
                        ? 'var(--color-forest-green)'
                        : 'var(--color-n300)',
                      backgroundColor: tourType === 'private'
                        ? 'rgba(46,125,94,0.06)'
                        : 'var(--color-n000)',
                    }}
                    onClick={() => setTourType('private')}
                  >
                    <span style={{
                      ...styles.typeOptionTitle,
                      color: tourType === 'private'
                        ? 'var(--color-forest-green)'
                        : 'var(--color-n900)',
                    }}>
                      Private Tour
                    </span>
                    <span style={styles.typeOptionPrice}>
                      {privateToggleLabel}
                      <span style={styles.typePerPerson}>/group</span>
                    </span>
                  </button>

                </div>

                {tourType === 'private' && (
                  <p style={styles.privateNote}>
                    {privateTotal == null
                      ? privatePricing.mode === 'tiered'
                        ? 'For a group this size we\'ll send a custom quote within 24 hours.'
                        : 'We\'ll send you a custom quote within 24 hours based on your group size and dates.'
                      : privatePricing.mode === 'tiered'
                        ? 'One price for your whole private group — it updates with the number of guests.'
                        : 'One fixed price for your whole private group, whatever the size.'}
                  </p>
                )}
              </div>

              <div style={styles.formDivider} />

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '10px', alignItems: 'start' }}>
              <div style={{ ...styles.formGroup, marginBottom: 0, position: 'relative' }} ref={calendarWrapperRef}>
                <label style={styles.label}>Select Date</label>
                <button
                  type="button"
                  style={{
                    ...styles.input,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--color-n800)',
                  }}
                  onClick={() => { setDateError(false); setCalendarOpen((v) => !v) }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                    <Calendar size={14} color="var(--color-n500)" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {formatSelectedDate(selectedDate)}
                    </span>
                  </span>
                  <ChevronDown
                    size={14}
                    color="var(--color-n500)"
                    style={{ flexShrink: 0, transform: calendarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  />
                </button>

                {/* Mobile backdrop */}
                {isMobile && calendarOpen && (
                  <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 299 }}
                    onMouseDown={(e) => { e.stopPropagation(); setCalendarOpen(false) }}
                  />
                )}

                {calendarOpen && (
                  <div style={{
                    ...(isMobile ? {
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 'min(360px, calc(100vw - 32px))',
                      zIndex: 300,
                    } : {
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      right: 0,
                      minWidth: '300px',
                      zIndex: 200,
                    }),
                    backgroundColor: 'var(--color-n000)',
                    border: '1px solid var(--color-n300)',
                    borderRadius: '14px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
                    padding: '16px',
                  }}>
                    {isMobile && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '15px', color: 'var(--color-n800)' }}>
                          Choose a date
                        </span>
                        <button
                          type="button"
                          onClick={() => setCalendarOpen(false)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-n500)' }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                    <TourCalendar
                      slug={tour.slug}
                      groupSize={tour.groupSize}
                      tourType={tourType}
                      selectedDate={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date)
                        setCalendarOpen(false)
                        const spots = getSpotsLeft(tour.slug, date, selectedLanguage, tour.groupSize)
                        // A sold-out date (spots === 0) is a request, not a
                        // hard cap — don't collapse the party size to zero.
                        if (spots) setNumPeople((n) => Math.min(n, spots))
                      }}
                      isBlocked={isBlocked}
                      bookings={bookings}
                      language={selectedLanguage}
                    />
                  </div>
                )}
              </div>

              <div style={{ ...styles.formGroup, marginBottom: 0 }}>
                <label style={styles.label}>Start Time</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{
                      ...styles.input,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      paddingRight: '32px',
                      cursor: 'pointer',
                      color: 'var(--color-n800)',
                    }}
                  >
                    {tour.startingTimes.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    color="var(--color-n500)"
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>
              </div>
              </div>

              {isRequestOnly && (
                <p style={styles.soldOutNote}>
                  {isDateBlocked
                    ? "We're not running shared groups on this date, but send a request and we'll see what we can arrange for your group."
                    : "This date is fully booked as a shared tour. Send a request and we'll get back to you if a spot opens up or arrange another option for your group."}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '16px', marginBottom: '8px' }}>
                <label style={styles.label}>Number of People</label>
                <div style={{ ...styles.stepper, width: '160px' }}>
                  <button
                    type="button"
                    disabled={numPeople <= 1}
                    onClick={() => setNumPeople((n) => Math.max(1, n - 1))}
                    style={{
                      ...styles.stepperBtn,
                      opacity: numPeople <= 1 ? 0.35 : 1,
                      cursor: numPeople <= 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    −
                  </button>
                  <span style={styles.stepperValue}>
                    {numPeople} {numPeople === 1 ? 'person' : 'people'}
                  </span>
                  <button
                    type="button"
                    disabled={numPeople >= maxPeople}
                    onClick={() => setNumPeople((n) => Math.min(maxPeople, n + 1))}
                    style={{
                      ...styles.stepperBtn,
                      opacity: numPeople >= maxPeople ? 0.35 : 1,
                      cursor: numPeople >= maxPeople ? 'not-allowed' : 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {(tourType === 'shared' || (tourType === 'private' && privateTotal != null)) && (
                <div style={styles.receiptPanel}>
                  <div style={{ ...styles.totalRow, padding: 0, marginBottom: 0 }}>
                    <div>
                      <span style={styles.totalLabel}>Total</span>
                      {tourType === 'shared' && numPeople > 1 && (
                        <span style={styles.totalBreakdown}>
                          {format(tour.price)} × {numPeople} people
                        </span>
                      )}
                      {tourType === 'private' && (
                        <span style={styles.totalBreakdown}>
                          Private group · {numPeople} {numPeople === 1 ? 'person' : 'people'}
                        </span>
                      )}
                    </div>
                    <span style={styles.totalPrice}>{format(totalPrice)}</span>
                  </div>
                </div>
              )}

              {dateError && (
                <p style={styles.dateErrorText}>Please choose a date first.</p>
              )}

              <Button
                variant="primary"
                full
                style={{ marginBottom: 10 }}
                onClick={handleBooking}
              >
                {tourType === 'private' && privateTotal == null
                  ? 'Request a private quote'
                  : isRequestOnly
                    ? 'Request this date'
                    : `Continue to checkout — ${bookingPriceLabel}`}
              </Button>

              <div style={styles.trustRows}>
                <div style={styles.trustRow}>
                  <CheckCircle size={13} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{CANCEL_LINE_TOUR}</span>
                </div>
                <div style={styles.trustRow}>
                  <ShieldCheck size={13} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Secure checkout — pay by bank invoice, or reserve and pay cash</span>
                </div>
              </div>
          </>
    </div>
  )

  // Highlights rendering with progressive disclosure
  const highlights = tour.highlights
  const needsDisclosure = highlights.length > 5
  const visibleHighlights = needsDisclosure && !highlightsExpanded
    ? highlights.slice(0, 4)
    : highlights
  const lastHighlight = needsDisclosure && !highlightsExpanded
    ? highlights[highlights.length - 1]
    : null

  // Inclusions slicing
  const includesItems = tour.includes
  const excludesItems = tour.excludes || [
    'Food and drinks',
    'Entrance fees to museums',
    'Gratuities',
    'Personal expenses',
  ]
  const visibleIncludes = includedExpanded ? includesItems : includesItems.slice(0, 4)
  const visibleExcludes = excludedExpanded ? excludesItems : excludesItems.slice(0, 4)

  const relatedTours = tours
    .filter((t) => t.slug !== tour.slug && t.category === tour.category)
    .concat(tours.filter((t) => t.slug !== tour.slug && t.category !== tour.category))
    .slice(0, 3)

  return (
    <div>

      <SEO
  title={tour.title}
  description={`${(tour.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 155)}...`}
  image={tour.hero || undefined}
  url={`/tours/${tour.slug}`}
/>

      <TourActivitySchema tour={tour} />
      <FAQSchema tour={tour} />

      {/* ── HERO PHOTO ──────────────────────────────────── */}
      <div style={{ ...styles.heroWrapper, height: isMobile ? '52vh' : '65vh' }}>
        {tour.detailHero ? (
          <Img
            src={tour.detailHero}
            alt={tour.title}
            sizes="100vw"
            eager
            style={styles.heroPhoto}
          />
        ) : (
          <div style={styles.heroPlaceholder} />
        )}
        <div style={styles.heroGradient} />
        <div style={styles.heroGradientTop} />
        <div style={styles.heroBackLink}>
          <Breadcrumbs items={[
            { name: 'Tours', path: '/tours' },
            { name: tour.title, path: `/tours/${tour.slug}` },
          ]} />
        </div>
      </div>

      {/* ── SECTION NAV ─────────────────────────────────── */}
      <SectionNav isMobile={isMobile} tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'highlights', label: 'Highlights' },
        { id: 'included', label: "What's included" },
        ...(tour.rightFor || tour.notRightFor ? [{ id: 'suitability', label: 'Is this for you?' }] : []),
        { id: 'info', label: 'Important information' },
        ...(hasAccessibilityContent(tour.accessibility) ? [{ id: 'accessibility', label: 'Accessibility' }] : []),
        { id: 'reviews', label: 'Reviews' },
      ]} />

      {/* ── CONTENT CARD ────────────────────────────────── */}
      <div style={{
        ...styles.contentCard,
        padding: isMobile
          ? '80px 20px 100px 20px'
          : '96px 40px 48px',
      }}>

        {/* Title block */}
        <div style={styles.titleBlock}>
          <div style={styles.titleLeft}>

            {/* Rating — above the title */}
            <div style={{ ...styles.ratingRow, marginBottom: '12px' }}>
              <Star size={15} color="var(--color-amber)" fill="var(--color-amber)" />
              <span style={styles.ratingNumber}>{tour.rating}</span>
              <span style={styles.ratingCount}>({tour.reviews} reviews)</span>
            </div>

            {/* Title */}
            <h1 style={{
              ...styles.tourTitle,
              fontSize: isMobile ? '28px' : '44px',
            }}>
              {tour.title}
            </h1>

            {/* Subtitle */}
            {tour.subtitle && (
              <p style={styles.tourSubtitle}>{tour.subtitle}</p>
            )}

            {/* Language pills — parked, not deleted: every tour currently runs
                in English and Bosnian, so the pills add noise rather than
                information. Flip back on when multi-language tours ship. */}
            {SHOW_LANGUAGE_PILLS && supportedLanguages.length > 0 && (
              <div style={styles.pillRow}>
                {supportedLanguages.map((language) => (
                  <span key={language.id} style={styles.languagePill}>
                    {language.flag} {language.label}
                  </span>
                ))}
              </div>
            )}

            {/* Meta pills — start time, duration, group size */}
            <div style={styles.metaPillRow}>
              {tour.startingTimes && tour.startingTimes.length > 0 && (
                <div style={styles.metaPill}>
                  <Clock size={13} color="var(--color-n600)" />
                  <span>{tour.startingTimes.join(' / ')}</span>
                </div>
              )}
              <div style={styles.metaPill}>
                <Timer size={13} color="var(--color-n600)" />
                <span>{tour.duration}</span>
              </div>
              <div style={styles.metaPill}>
                <Users size={13} color="var(--color-n600)" />
                <span>Small group</span>
              </div>
            </div>

          </div>
        </div>

        {/* Two column layout */}
        <div style={{
          ...styles.contentGrid,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 360px',
          gap: isMobile ? '32px' : '48px',
          marginTop: '32px',
        }}>

          {/* ── LEFT COLUMN ──────────────────────────────── */}
          <div style={styles.leftColumn}>

            {/* Gallery — full-bleed carousel, no card wrapper */}
            {tour.gallery && tour.gallery.length > 0 && (
              <Gallery images={tour.gallery} alt={tour.title} />
            )}

            {/* Tour description */}
<div id="overview" style={styles.section}>
  <RichContent value={tour.description} paragraphStyle={styles.bodyText} htmlStyle={styles.bodyText} />
</div>

            {/* Route map — only if tour has waypoints */}
            {tour.mapWaypoints && tour.mapWaypoints.length > 0 && (
              <Suspense fallback={null}>
                <RouteMap waypoints={tour.mapWaypoints} profile={tour.mapProfile} />
              </Suspense>
            )}

            {/* Tour Highlights — styled numbered steps with progressive disclosure */}
            <div id="highlights" style={styles.section}>
              <h2 style={styles.sectionTitle}>Tour highlights</h2>
              <div style={styles.highlightsList}>
                {visibleHighlights.map((highlight, index) => (
                  <div key={index} style={styles.highlightItem}>
                    <div style={styles.highlightNumber}>
                      <span style={styles.highlightNumberText}>
                        {index + 1}
                      </span>
                    </div>
                    <div style={styles.highlightContent}>
                      {highlight.includes(' — ') ? (
                        <>
                          <span style={styles.highlightTitle}>
                            {highlight.split(' — ')[0]}
                          </span>
                          <span style={styles.highlightSubtext}>
                            {(() => {
                              const t = highlight.split(' — ')[1]
                              return t.charAt(0).toUpperCase() + t.slice(1)
                            })()}
                          </span>
                        </>
                      ) : (
                        <span style={styles.highlightTitle}>
                          {highlight}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Progressive disclosure: dots + last item when collapsed */}
                {needsDisclosure && !highlightsExpanded && (
                  <>
                    <div style={{ paddingLeft: '48px' }}>
                      <span style={{ ...styles.highlightSubtext, color: 'var(--color-n400)' }}>…</span>
                    </div>
                    <div style={styles.highlightItem}>
                      <div style={styles.highlightNumber}>
                        <span style={styles.highlightNumberText}>
                          {highlights.length}
                        </span>
                      </div>
                      <div style={styles.highlightContent}>
                        {lastHighlight.includes(' — ') ? (
                          <>
                            <span style={styles.highlightTitle}>
                              {lastHighlight.split(' — ')[0]}
                            </span>
                            <span style={styles.highlightSubtext}>
                              {(() => {
                                const t = lastHighlight.split(' — ')[1]
                                return t.charAt(0).toUpperCase() + t.slice(1)
                              })()}
                            </span>
                          </>
                        ) : (
                          <span style={styles.highlightTitle}>{lastHighlight}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {needsDisclosure && (
                <button
                  style={showMoreBtnStyle}
                  onClick={() => setHighlightsExpanded(v => !v)}
                >
                  {highlightsExpanded
                    ? 'Show less'
                    : `See all ${highlights.length} highlights`}
                </button>
              )}
            </div>

            {/* Fitness / Emotional warning — only for tours with fitnessNote */}
            {tour.fitnessNote && (
              <div style={styles.section}>
                <div style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  backgroundColor: tour.fitnessNote.type === 'emotional' ? 'rgba(221,107,32,0.06)' : 'rgba(46,125,94,0.06)',
                  borderLeft: `3px solid ${tour.fitnessNote.type === 'emotional' ? 'var(--color-warning)' : 'var(--color-forest-green)'}`,
                  borderRadius: '0 var(--radius) var(--radius) 0',
                  padding: '16px 20px',
                }}>
                  <AlertTriangle
                    size={18}
                    color={tour.fitnessNote.type === 'emotional' ? 'var(--color-warning)' : 'var(--color-forest-green)'}
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <div>
                    <span style={{
                      display: 'block',
                      fontFamily: 'var(--font-display)',
                      fontWeight: '700',
                      fontSize: '14px',
                      color: tour.fitnessNote.type === 'emotional' ? 'var(--color-warning)' : 'var(--color-forest-green)',
                      marginBottom: '6px',
                    }}>
                      {tour.fitnessNote.level}
                    </span>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      color: 'var(--color-n600)',
                      lineHeight: '1.65',
                      margin: 0,
                    }}>
                      {tour.fitnessNote.detail}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions — side by side */}
            <div id="included" style={styles.section}>
              <h2 style={styles.sectionTitle}>What's included</h2>
              <div style={{
                ...styles.inclusionsGrid,
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              }}>

                <div>
                  <h3 style={styles.inclusionSubtitle}>Included</h3>
                  <div style={styles.inclusionsList}>
                    {visibleIncludes.map((item, i) => (
                      <div key={i} style={styles.inclusionItem}>
                        <CheckCircle size={15} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={styles.inclusionText}>{item}</span>
                      </div>
                    ))}
                  </div>
                  {includesItems.length > 4 && (
                    <button style={showMoreBtnStyle} onClick={() => setIncludedExpanded(v => !v)}>
                      {includedExpanded ? 'Show less' : `See ${includesItems.length - 4} more`}
                    </button>
                  )}
                </div>

                <div>
                  <h3 style={styles.exclusionSubtitle}>Not included</h3>
                  <div style={styles.inclusionsList}>
                    {visibleExcludes.map((item, i) => (
                      <div key={i} style={styles.inclusionItem}>
                        <XCircle size={15} color="var(--color-n300)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ ...styles.inclusionText, color: 'var(--color-n600)' }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                  {excludesItems.length > 4 && (
                    <button style={showMoreBtnStyle} onClick={() => setExcludedExpanded(v => !v)}>
                      {excludedExpanded ? 'Show less' : `See ${excludesItems.length - 4} more`}
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Is This Right for You — only renders when tour has rightFor / notRightFor */}
            {(tour.rightFor || tour.notRightFor) && (
              <div id="suitability" style={styles.section}>
                <h2 style={styles.sectionTitle}>Is this tour right for you?</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '16px',
                }}>
                  {tour.rightFor && (
                    <div style={{
                      backgroundColor: 'rgba(46,125,94,0.06)',
                      border: '1px solid rgba(46,125,94,0.2)',
                      borderRadius: 'var(--radius)',
                      padding: '16px 18px',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: '700',
                        fontSize: '13px',
                        color: 'var(--color-forest-green)',
                        margin: '0 0 12px 0',
                      }}>This tour is for you if…</p>
                      {tour.rightFor.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < tour.rightFor.length - 1 ? '8px' : 0 }}>
                          <CheckCircle size={15} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', lineHeight: '1.55', margin: 0 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {tour.notRightFor && (
                    <div style={{
                      backgroundColor: 'var(--color-n100)',
                      border: '1px solid var(--color-n300)',
                      borderRadius: 'var(--radius)',
                      padding: '16px 18px',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: '700',
                        fontSize: '13px',
                        color: 'var(--color-n600)',
                        margin: '0 0 12px 0',
                      }}>This tour may not be right if…</p>
                      {tour.notRightFor.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < tour.notRightFor.length - 1 ? '8px' : 0 }}>
                          <XCircle size={15} color="var(--color-n300)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', lineHeight: '1.55', margin: 0 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Important information — meeting point, starting times, accessibility */}
            <div id="info" style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Important information
              </h2>
              <div style={styles.infoGrid}>

                <div style={styles.infoItem}>
                  <div style={styles.infoIconWrapper}>
                    <MapPin size={16} color="var(--color-forest-green)" />
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Meeting point</span>
                    <span style={styles.infoValue}>{tour.meetingPoint}</span>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoIconWrapper}>
                    <Clock size={16} color="var(--color-forest-green)" />
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Starting times</span>
                    <span style={styles.infoValue}>
                      {Array.isArray(tour.startingTimes)
                        ? tour.startingTimes.join(' / ')
                        : tour.startingTimes}
                    </span>
                  </div>
                </div>

                {hasAccessibilityContent(tour.accessibility) && (
                  <div style={styles.infoItem}>
                    <div style={styles.infoIconWrapper}>
                      <Accessibility size={16} color="var(--color-forest-green)" />
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Accessibility</span>
                      <a
                        href="#accessibility"
                        style={{ ...styles.infoValue, color: 'var(--color-forest-green)', textDecoration: 'none', fontWeight: 600 }}
                      >
                        See full details ↓
                      </a>
                    </div>
                  </div>
                )}

              </div>
            </div>

            <AccessibilitySection accessibility={tour.accessibility} />

            {/* FAQ section — only renders if tour has faqs */}
            {tour.faqs && tour.faqs.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Frequently asked questions
                </h2>
                <div style={styles.faqList}>
                  {tour.faqs.map((faq, index) => {
                    const isOpen = openFaq === index
                    return (
                      <div
                        key={index}
                        style={{
                          ...styles.faqItem,
                          borderLeft: isOpen
                            ? '3px solid var(--color-forest-green)'
                            : '3px solid transparent',
                        }}
                      >
                        <button
                          style={styles.faqHeader}
                          onClick={() =>
                            setOpenFaq(isOpen ? null : index)
                          }
                        >
                          <span style={styles.faqQuestion}>
                            {faq.question}
                          </span>
                          {isOpen
                            ? <ChevronUp
                                size={16}
                                color="var(--color-forest-green)"
                              />
                            : <ChevronDown
                                size={16}
                                color="var(--color-n600)"
                              />
                          }
                        </button>
                        {isOpen && (
                          <div style={styles.faqBody}>
                            <RichContent value={faq.answer} paragraphStyle={styles.faqAnswer} htmlStyle={styles.faqAnswer} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Curated highlights for this tour + links to review us on
                Google/Tripadvisor, where a review actually counts. */}
            <div id="reviews">
              <TourReviews tourSlug={tour.slug} />
            </div>

          </div>

          {/* ── RIGHT COLUMN — Desktop Booking Card ──────── */}
          {!isMobile && (
            <div style={{
              position: 'sticky',
              top: '104px',
              alignSelf: 'start',
            }}>
              {bookingForm}
            </div>
          )}

        </div>
      </div>

      {/* ── FROM THE JOURNAL ───────────────────────────── */}
      <FromTheJournal tourSlug={tour.slug} pinned={tour.journalPosts} />

      {/* ── RELATED TOURS ──────────────────────────────── */}
      {relatedTours.length > 0 && (
        <div style={{
          backgroundColor: 'var(--color-n100)',
          padding: isMobile ? '40px 0' : '56px 40px',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '8px',
              padding: isMobile ? '0 20px' : '0',
            }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: isMobile ? '22px' : '28px', color: 'var(--color-n900)', margin: 0 }}>
                More tours you'll love
              </h2>
              <Link to="/tours" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-forest-green)', fontWeight: 600, textDecoration: 'none' }}>
                View all tours →
              </Link>
            </div>
            {isMobile ? (
              <div style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                padding: '0 20px 8px',
              }}>
                {relatedTours.map((t) => (
                  <div key={t.id} style={{ flex: '0 0 84vw', maxWidth: '340px', scrollSnapAlign: 'start' }}>
                    <TourCard
                      id={t.id}
                      slug={t.slug}
                      title={t.title}
                      price={t.price}
                      oldPrice={t.oldPrice}
                      rating={t.rating}
                      reviews={t.reviews}
                      duration={t.duration}
                      highlights={t.highlights}
                      badge={t.badge}
                      hero={t.hero}
                      startingTimes={t.startingTimes}
                      languages={t.languages}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {relatedTours.map((t) => (
                  <TourCard
                    key={t.id}
                    id={t.id}
                    slug={t.slug}
                    title={t.title}
                    price={t.price}
                    rating={t.rating}
                    reviews={t.reviews}
                    duration={t.duration}
                    groupSize={t.groupSize}
                    badge={t.badge}
                    hero={t.hero}
                    startingTimes={t.startingTimes}
                    languages={t.languages}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM BAR ──────────────────────────── */}
      {isMobile && (
        <div style={styles.mobileBottomBar}>
          <div style={styles.mobileBottomBarLeft}>
            {Number(tour.oldPrice) > Number(tour.price) && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-n400)', textDecoration: 'line-through', marginRight: '2px' }}>
                {format(tour.oldPrice)}
              </span>
            )}
            <span style={styles.mobilePrice}>{format(tour.price)}</span>
            <span style={styles.mobilePricePer}>per person</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)}>
            Book now
          </Button>
        </div>
      )}

      {/* ── MOBILE BOOKING DRAWER ────────────────────────*/}
      {isMobile && (
        <>
          <div
            style={{
              ...styles.drawerOverlay,
              opacity: drawerOpen ? 1 : 0,
              pointerEvents: drawerOpen ? 'all' : 'none',
            }}
            onClick={() => setDrawerOpen(false)}
          />

          <div style={{
            ...styles.drawer,
            transform: drawerOpen
              ? 'translateY(0)'
              : 'translateY(100%)',
          }}>

            <div style={styles.drawerHeader}>
              <div style={styles.drawerHandle} />
              <button
                style={styles.drawerClose}
                onClick={() => setDrawerOpen(false)}
                aria-label="Close booking form"
              >
                <X size={20} color="var(--color-n600)" />
              </button>
            </div>

            <div style={styles.drawerContent}>
              {bookingForm}
            </div>

          </div>
        </>
      )}

    </div>
  )
}

const styles = {
  notFound: {
    padding: '80px 40px',
    textAlign: 'center',
  },

  backLinkDark: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },

  heroWrapper: {
    position: 'relative',
    height: '65vh',
    minHeight: '380px',
    maxHeight: '620px',
    overflow: 'hidden',
  },

  heroPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },

  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-mid-green)',
  },

  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(to top, var(--color-n100) 0%, transparent 100%)',
  },

  heroGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
  },

  heroBackLink: {
    position: 'absolute',
    top: '24px',
    left: '40px',
    zIndex: 2,
  },

  backLink: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n000)',
    textDecoration: 'none',
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid rgba(255,255,255,0.2)',
  },

  contentCard: {
    backgroundColor: 'var(--color-n000)',
    marginTop: '-60px',
    borderRadius: '20px 20px 0 0',
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
  },

  titleBlock: {
    maxWidth: '1100px',
    margin: '0 auto',
  },

  titleLeft: {
    maxWidth: '680px',
  },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '12px',
    color: 'var(--color-forest-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },

  tourTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: 'var(--color-n900)',
    lineHeight: '1.15',
    marginBottom: '10px',
  },

  tourSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: '1.6',
    marginBottom: '16px',
    marginTop: 0,
    maxWidth: '560px',
  },

  pillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },

  languagePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: 'var(--color-n000)',
    border: '1.5px solid var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '13px',
    color: 'var(--color-forest-green)',
  },

  metaPillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px',
  },

  metaPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n300)',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '13px',
    color: 'var(--color-n900)',
  },

  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },

  ratingNumber: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
  },

  ratingCount: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
  },

  contentGrid: {
    display: 'grid',
    maxWidth: '1100px',
    margin: '0 auto',
    alignItems: 'start',
  },

  leftColumn: {
    minWidth: 0,
  },

  section: {
    paddingBottom: '36px',
    marginBottom: '36px',
    borderBottom: '1px solid var(--color-n300)',
  },

  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '20px',
  },

  bodyText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
  },

  highlightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  highlightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },

  highlightNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-forest-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },

  highlightNumberText: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--color-n000)',
  },

  highlightContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    flex: 1,
  },

  highlightTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    lineHeight: '1.3',
  },

  highlightSubtext: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    lineHeight: '1.5',
  },

  inclusionsGrid: {
    display: 'grid',
    gap: '24px',
    marginTop: '8px',
  },

  inclusionSubtitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-success)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  exclusionSubtitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-n600)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  inclusionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  inclusionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },

  inclusionText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    lineHeight: '1.5',
  },

  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  faqItem: {
    backgroundColor: 'var(--color-n100)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'border-left 0.2s ease',
  },

  faqHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    gap: '12px',
  },

  faqQuestion: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    flex: 1,
  },

  faqBody: {
    padding: '0 16px 16px 16px',
  },

  faqAnswer: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
  },

  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },

  infoIconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'rgba(46,125,94,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  infoLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '12px',
    color: 'var(--color-n600)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },

  infoValue: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    lineHeight: '1.5',
  },

  bookingCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
    border: '1px solid var(--color-n300)',
  },

  tourTypeSection: {
    marginBottom: '4px',
  },

  toggleLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '12px',
    color: 'var(--color-n900)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
  },

  tourTypeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '8px',
  },

  typeOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    padding: '12px',
    borderRadius: '10px',
    border: '1.5px solid',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },

  typeOptionTitle: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    // Sentence-case control label, not a micro-caption — it names the thing
    // you're choosing, so it reads at control size.
    fontSize: '13px',
    lineHeight: '1.3',
    transition: 'color 0.15s ease',
  },

  typeOptionPrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '18px',
    color: 'var(--color-n900)',
  },

  typePerPerson: {
    fontFamily: 'var(--font-body)',
    fontWeight: '400',
    fontSize: '13px',
    color: 'var(--color-n600)',
    marginLeft: '2px',
  },

  privateNote: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-forest-green)',
    backgroundColor: 'rgba(46,125,94,0.06)',
    borderRadius: '6px',
    padding: '8px 10px',
    margin: '0 0 8px 0',
    lineHeight: '1.5',
  },

  soldOutNote: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: '#8a5a00',
    backgroundColor: 'rgba(244,161,48,0.1)',
    borderRadius: '6px',
    padding: '8px 10px',
    margin: '12px 0 0 0',
    lineHeight: '1.5',
  },

  formDivider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    margin: '12px 0 16px 0',
  },

  pillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },

  stepper: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--color-n300)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    height: '36px',
  },

  stepperBtn: {
    flexShrink: 0,
    width: '40px',
    height: '100%',
    border: 'none',
    backgroundColor: 'var(--color-n100)',
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: '400',
    color: 'var(--color-n800)',
    lineHeight: 1,
  },

  stepperValue: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-n900)',
    borderLeft: '1px solid var(--color-n300)',
    borderRight: '1px solid var(--color-n300)',
    userSelect: 'none',
  },

  pillOption: {
    height: '36px',
    padding: '0 14px',
    borderRadius: 'var(--radius-pill)',
    border: '1.5px solid',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'border-color 0.15s, background-color 0.15s, color 0.15s',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '12px',
  },

  label: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },

  optional: {
    fontWeight: '400',
    color: 'var(--color-n600)',
  },

  input: {
    height: '36px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '0 10px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    boxSizing: 'border-box',
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    marginBottom: '10px',
  },

  totalLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
  },

  totalPrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-forest-green)',
  },

  totalBreakdown: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n500)',
    marginTop: '2px',
  },

  receiptPanel: {
    backgroundColor: 'var(--color-n100)',
    borderRadius: '12px',
    padding: '12px 14px',
    margin: '4px 0 14px',
  },

  trustRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    marginTop: '4px',
  },

  trustRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '7px',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    lineHeight: '1.45',
    color: 'var(--color-n600)',
  },

  dateErrorText: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-error, #C0392B)',
    margin: '0 0 8px',
  },

  buttonRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },

  secondaryActionBtn: {
    height: 'var(--touch-target)',
    padding: '0 18px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    backgroundColor: 'var(--color-n000)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    cursor: 'pointer',
    flexShrink: 0,
  },

  errorMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-error)',
    textAlign: 'center',
    marginTop: '8px',
  },

  successMessage: {
    textAlign: 'center',
    padding: '16px 0',
  },

  successIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '12px',
  },

  successTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '12px',
  },

  successText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
  },

  mobileBottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 150,
    backgroundColor: 'var(--color-n000)',
    borderTop: '1px solid var(--color-n300)',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
  },

  mobileBottomBarLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },

  mobilePrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '24px',
    color: 'var(--color-forest-green)',
  },

  mobilePricePer: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    transition: 'opacity 0.3s ease',
  },

  drawer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 201,
    backgroundColor: 'var(--color-n000)',
    borderRadius: '20px 20px 0 0',
    maxHeight: '85vh',
    overflowY: 'auto',
    transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 20px 8px 20px',
    position: 'relative',
    flexShrink: 0,
  },

  drawerHandle: {
    width: '40px',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: 'var(--color-n300)',
  },

  drawerClose: {
    position: 'absolute',
    right: '16px',
    top: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  drawerContent: {
    padding: '8px 20px 36px 20px',
    overflowY: 'auto',
  },
}

export default TourDetail
