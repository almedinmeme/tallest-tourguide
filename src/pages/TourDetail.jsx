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
  BreadcrumbSchema,
  FAQSchema,
} from '../schema/SchemaMarkup'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'
import {
  Star, Clock, Users, MapPin, CheckCircle,
  XCircle, ShieldCheck, ChevronDown, ChevronUp,
  X, Globe, Timer, AlertTriangle, Accessibility
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import useWindowWidth from '../hooks/useWindowWidth'
import tours from '../data/tours'
import { getTourLanguages } from '../data/tourLanguages'
import Gallery from '../components/Gallery'
import TourReviews from '../components/TourReviews'
const RouteMap = lazy(() => import('../components/RouteMap'))
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
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  })
}

const showMoreBtnStyle = {
  display: 'block',
  margin: '12px auto 0',
  height: '34px',
  padding: '0 18px',
  borderRadius: '100px',
  border: '1.5px solid var(--color-n300)',
  backgroundColor: 'transparent',
  color: 'var(--color-n600)',
  fontFamily: 'var(--font-body)',
  fontWeight: '600',
  fontSize: '13px',
  cursor: 'pointer',
}

function TourDetail() {
  const { slug } = useParams()
  const tour = tours.find((t) => t.slug === slug)
  const width = useWindowWidth()
  const isMobile = width <= 768
  const supportedLanguages = getTourLanguages(tour?.languages)
  const { getSpotsLeft, bookings } = useAvailability()
  const { isBlocked } = useBlockedDates()

  // Booking form state
  const [selectedDate, setSelectedDate] = useState(getTomorrow())
  const [startTime, setStartTime] = useState(tour?.startingTimes?.[0] ?? '')
  const [selectedLanguage, setSelectedLanguage] = useState(
    supportedLanguages[0]?.id ?? 'english'
  )
  const [bookingStep, setBookingStep] = useState(1)
  const [numPeople, setNumPeople] = useState(1)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [tourType, setTourType] = useState('shared')
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

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
    setBookingStep(1)
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

  const totalPrice = tour
    ? tourType === 'private'
      ? 0
      : tour.price * numPeople
    : 0
  const bookingPriceLabel = tourType === 'private' ? 'Quote' : `€${totalPrice}`
  const spotsLeft = tour ? getSpotsLeft(tour.slug, selectedDate, selectedLanguage, tour.groupSize) : null
  const maxPeople = tourType === 'private'
    ? 20
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

  const handleBooking = () => {
    if (!selectedDate || !guestName || !guestEmail) {
      alert('Please fill in your name, email, and select a date.')
      return
    }
    setIsSending(true)
    setIsError(false)

    const templateParams = {
      type: 'Booking',
      tour_name: tour.title,
      tour_date: selectedDate,
      tour_start_time: startTime || 'Not specified',
      num_people: numPeople,
      total_price: tourType === 'private'
        ? 'Private tour — quote requested'
        : `€${totalPrice}`,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone || 'Not provided',
      discount_code: discountCode || 'None',
      tour_type: tourType === 'private'
        ? 'Private Tour'
        : 'Shared Tour',
      tour_language: selectedLanguageLabel,
    }

    fetch(`https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/Bookings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          TourSlug: tour.slug,
          TourName: tour.title,
          TourDate: selectedDate,
          StartTime: startTime || '',
          NumPeople: numPeople,
          TourType: tourType,
          Language: selectedLanguageLabel,
          TotalPrice: tourType === 'private' ? 0 : totalPrice,
          GuestName: guestName,
          GuestEmail: guestEmail,
          GuestPhone: guestPhone || '',
          DiscountCode: discountCode || '',
          Status: 'Pending',
        },
      }),
    }).catch((err) => console.warn('Airtable booking save failed:', err))

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).catch(() => {})

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setIsSending(false)
      setIsSuccess(true)
      trackEvent('purchase', {
        transaction_id: `${tour.slug}-${Date.now()}`,
        currency: 'EUR',
        value: totalPrice,
        items: [{ item_id: tour.slug, item_name: tour.title, item_category: tour.category, price: tour.price, quantity: numPeople }],
      })
    })
    .catch(() => { setIsSending(false); setIsError(true) })
  }

  const handleContinueToBooking = () => {
    if (!selectedDate) {
      alert('Please select a date before continuing.')
      return
    }

    trackEvent('begin_checkout', {
      currency: 'EUR',
      value: totalPrice,
      items: [{ item_id: tour.slug, item_name: tour.title, item_category: tour.category, price: tour.price, quantity: numPeople }],
    })

    setBookingStep(2)
    setIsError(false)
  }

  const bookingForm = (
    <div style={{ ...styles.bookingCard, padding: '16px' }}>
      {isSuccess ? (
        <div style={styles.successMessage}>
          <div style={styles.successIcon}>
            <CheckCircle size={40} color="var(--color-success)" />
          </div>
          <h3 style={styles.successTitle}>Request Received!</h3>
          <p style={styles.successText}>
            Thanks {guestName}. Your{' '}
            {tourType === 'private' ? 'private tour' : ''} booking
            request for <strong>{tour.title}</strong> on {selectedDate}
            {' '}in <strong>{selectedLanguageLabel}</strong>
            {tourType === 'shared'
              ? ` for ${numPeople} ${numPeople === 1 ? 'person' : 'people'}`
              : ''
            } has been received. You'll hear back within 24 hours.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '17px', color: 'var(--color-n900)', margin: 0 }}>
              {bookingStep === 1 ? 'Tour details' : 'Your details'}
            </h3>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: '600', color: 'var(--color-n600)' }}>
              Step {bookingStep} of 2
            </span>
          </div>

          {bookingStep === 1 ? (
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
                      €{tour.price}
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
                      Quote
                      <span style={styles.typePerPerson}>/group</span>
                    </span>
                  </button>

                </div>

                {tourType === 'private' && (
                  <p style={styles.privateNote}>
                    We'll send you a custom quote within 24 hours
                    based on your group size and dates.
                  </p>
                )}
              </div>

              <div style={styles.formDivider} />

              {supportedLanguages.length > 0 && (
                <div style={{ ...styles.formGroup, marginBottom: '8px' }}>
                  <label style={styles.label}>Tour Language</label>
                  <div style={styles.pillGroup}>
                    {supportedLanguages.map((language) => (
                      <button
                        key={language.id}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(language.id)
                          const spots = getSpotsLeft(tour.slug, selectedDate, language.id, tour.groupSize)
                          if (spots != null) setNumPeople((n) => Math.min(n, spots))
                        }}
                        style={{
                          ...styles.pillOption,
                          borderColor: selectedLanguage === language.id ? 'var(--color-forest-green)' : 'var(--color-n300)',
                          backgroundColor: selectedLanguage === language.id ? 'rgba(46,125,94,0.08)' : 'var(--color-n000)',
                          color: selectedLanguage === language.id ? 'var(--color-forest-green)' : 'var(--color-n700)',
                          fontWeight: selectedLanguage === language.id ? '600' : '500',
                        }}
                      >
                        {language.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ ...styles.formGroup, marginBottom: '8px', position: 'relative' }} ref={calendarWrapperRef}>
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
                  onClick={() => setCalendarOpen((v) => !v)}
                >
                  <span>{formatSelectedDate(selectedDate)}</span>
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
                        if (spots != null) setNumPeople((n) => Math.min(n, spots))
                      }}
                      isBlocked={isBlocked}
                      bookings={bookings}
                      language={selectedLanguage}
                    />
                  </div>
                )}
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '8px' }}>
                <label style={styles.label}>Preferred Start Time</label>
                <div style={styles.pillGroup}>
                  {tour.startingTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setStartTime(time)}
                      style={{
                        ...styles.pillOption,
                        borderColor: startTime === time ? 'var(--color-forest-green)' : 'var(--color-n300)',
                        backgroundColor: startTime === time ? 'rgba(46,125,94,0.08)' : 'var(--color-n000)',
                        color: startTime === time ? 'var(--color-forest-green)' : 'var(--color-n700)',
                        fontWeight: startTime === time ? '600' : '500',
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '8px' }}>
                <label style={styles.label}>Number of People</label>
                <div style={styles.stepper}>
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

              {tourType === 'shared' && (
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalPrice}>€{totalPrice}</span>
                </div>
              )}


              <button
                style={styles.bookBtn}
                className="btn-lift btn-glow-amber"
                onClick={handleContinueToBooking}
              >
                {`Continue to Booking - ${bookingPriceLabel}`}
              </button>
            </>
          ) : (
            <>
              {/* Chip-style selection summary */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {[
                  ['Type', tourType === 'private' ? 'Private' : 'Shared'],
                  ['Date', selectedDate],
                  ['Time', startTime || 'Any'],
                  ['Language', selectedLanguageLabel],
                  ['Guests', `${numPeople} ${numPeople === 1 ? 'person' : 'people'}`],
                  ...(tourType === 'shared' ? [['Total', `€${totalPrice}`]] : []),
                ].map(([label, value]) => (
                  <div key={label} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: 'rgba(46,125,94,0.07)',
                    border: '1px solid rgba(46,125,94,0.18)',
                    borderRadius: '100px',
                    padding: '3px 10px',
                  }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-n600)' }}>{label}:</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '11px', color: 'var(--color-forest-green)' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '8px' }}>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  style={styles.input}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '8px' }}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@email.com"
                  style={styles.input}
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '8px' }}>
                <label style={styles.label}>Phone (optional)</label>
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  style={styles.input}
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '8px' }}>
                <label style={styles.label}>
                  Referral Code
                  <span style={styles.optional}> — optional</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. HOTEL123"
                  style={styles.input}
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
              </div>

              {tourType === 'shared' && (
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalPrice}>€{totalPrice}</span>
                </div>
              )}

              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={styles.secondaryActionBtn}
                  className="btn-lift"
                  onClick={() => setBookingStep(1)}
                >
                  Back
                </button>

                <button
                  style={{
                    ...styles.bookBtn,
                    flex: 1,
                    marginBottom: 0,
                    opacity: isSending ? 0.7 : 1,
                    cursor: isSending ? 'not-allowed' : 'pointer',
                  }}
                  className="btn-lift btn-glow-amber"
                  onClick={handleBooking}
                  disabled={isSending}
                >
                  {isSending
                    ? 'Sending...'
                    : `Confirm & Book - ${bookingPriceLabel}`
                  }
                </button>
              </div>
            </>
          )}

          {isError && (
            <p style={styles.errorMessage}>
              Something went wrong. Please try again or
              email us directly.
            </p>
          )}
        </>
      )}
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

  return (
    <div>

      <SEO
  title={tour.title}
  description={`${tour.description.slice(0, 155)}...`}
  url={`/tours/${tour.slug}`}
/>

      <TourActivitySchema tour={tour} />
      <BreadcrumbSchema tour={tour} />
      <FAQSchema tour={tour} />

      {/* ── HERO PHOTO ──────────────────────────────────── */}
      <div style={{ ...styles.heroWrapper, height: isMobile ? '52vh' : '65vh' }}>
        {tour.detailHero ? (
          <img
            src={tour.detailHero}
            alt={tour.title}
            style={styles.heroPhoto}
          />
        ) : (
          <div style={styles.heroPlaceholder} />
        )}
        <div style={styles.heroGradient} />
        <div style={styles.heroGradientTop} />
        <div style={styles.heroBackLink}>
          <Link to="/tours" style={styles.backLink}>
            ← All Tours
          </Link>
        </div>
      </div>

      {/* ── SECTION NAV ─────────────────────────────────── */}
      <SectionNav isMobile={isMobile} tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'highlights', label: 'Highlights' },
        { id: 'included', label: "What's included" },
        ...(tour.rightFor || tour.notRightFor ? [{ id: 'suitability', label: 'Is this for you?' }] : []),
        { id: 'info', label: 'Important information' },
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

            {/* Language pills */}
            {supportedLanguages.length > 0 && (
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
                <span>Max {tour.groupSize} people</span>
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
  {tour.description.split('\n\n').map((paragraph, index) => (
    <p
      key={index}
      style={{
        ...styles.bodyText,
        marginBottom: index === tour.description.split('\n\n').length - 1 ? 0 : '16px',
      }}
    >
      {paragraph}
    </p>
  ))}
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
                        <CheckCircle size={15} color="var(--color-success)" />
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
                        <XCircle size={15} color="var(--color-n300)" />
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
                            <p style={styles.faqAnswer}>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
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

                {tour.accessibility && (
                  <div style={styles.infoItem}>
                    <div style={styles.infoIconWrapper}>
                      <Accessibility size={16} color="var(--color-forest-green)" />
                    </div>
                    <div>
                      <span style={styles.infoLabel}>Accessibility</span>
                      <span style={styles.infoValue}>{tour.accessibility.notes}</span>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Tour Reviews — approved reviews from Airtable + submission form */}
            <div id="reviews">
  <TourReviews tourId={tour.id} tourName={tour.title} tourSlug={tour.slug} basePath="/tours" />
</div>

          </div>

          {/* ── RIGHT COLUMN — Desktop Booking Card ──────── */}
          {!isMobile && (
            <div style={{
              position: 'sticky',
              top: '124px',
              alignSelf: 'start',
            }}>
              {bookingForm}
            </div>
          )}

        </div>
      </div>

      {/* ── MOBILE BOTTOM BAR ──────────────────────────── */}
      {isMobile && (
        <div style={styles.mobileBottomBar}>
          <div style={styles.mobileBottomBarLeft}>
            <span style={styles.mobilePrice}>€{tour.price}</span>
            <span style={styles.mobilePricePer}>per person</span>
          </div>
          <button
            style={styles.mobileBookBtn}
            className="btn-lift btn-glow-amber"
            onClick={() => setDrawerOpen(true)}
          >
            Book Now
          </button>
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
    borderRadius: '100px',
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
    fontSize: '11px',
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
    borderRadius: '100px',
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
    borderRadius: '100px',
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
    fontSize: '11px',
    color: 'var(--color-success)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  exclusionSubtitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '11px',
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
    fontSize: '11px',
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
    fontSize: '11px',
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
    fontSize: '11px',
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
    fontSize: '11px',
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
    borderRadius: '100px',
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

  bookBtn: {
    width: '100%',
    height: 'var(--touch-target)',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    border: 'none',
    marginBottom: '10px',
    boxSizing: 'border-box',
    cursor: 'pointer',
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

  mobileBookBtn: {
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    border: 'none',
    cursor: 'pointer',
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
