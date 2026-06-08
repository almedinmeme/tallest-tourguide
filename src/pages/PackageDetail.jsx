import SEO from '../components/SEO'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'
import {
  ChevronDown, ChevronUp,
  CheckCircle, XCircle, MapPin, ShieldCheck,
  Calendar, Star, Sunset, History, Coffee,
  Utensils, Home, Footprints,
  Waves, Wine, Shield, Anchor, X,
  Compass, Clock, Users, AlertTriangle,
  BedDouble, Plus, Car, Shirt, Globe, Banknote,
  Gauge, ArrowRight,
  Swords, Mountain, Camera, Landmark, ShoppingBag,
  Moon, Bike, Tent, TreePine, Sailboat, Flame,
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import useWindowWidth from '../hooks/useWindowWidth'
import { useAvailability } from '../hooks/useAvailability'
import { usePackageDates } from '../hooks/usePackageDates'
import { useAllReviews } from '../hooks/useAllReviews'
import Gallery from '../components/Gallery'
import TourReviews from '../components/TourReviews'
import RichContent from '../components/RichContent'
import AccessibilitySection from '../components/AccessibilitySection'
const RouteMap = lazy(() => import('../components/RouteMap'))
import { PackageSchema, PackageBreadcrumbSchema } from '../schema/SchemaMarkup'

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

function formatSelectedDate(dateStr) {
  if (!dateStr) return 'Select a date'
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatDepartureDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
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

const activityIconMap = {
  sunset:    Sunset,
  history:   History,
  war:       Swords,
  food:      Utensils,
  coffee:    Coffee,
  family:    Home,
  home:      Home,
  hike:      Mountain,
  mountain:  Mountain,
  sea:       Waves,
  waterfall: Waves,
  wine:      Wine,
  walk:      Footprints,
  car:       Car,
  shield:    Shield,
  bunker:    Shield,
  rafting:   Sailboat,
  boat:      Sailboat,
  camera:    Camera,
  landmark:  Landmark,
  market:    ShoppingBag,
  night:     Moon,
  bike:      Bike,
  tent:      Tent,
  forest:    TreePine,
  fire:      Flame,
}

import { packages } from '../data/packages'

const BREAKDOWN_CARDS = [
  { key: 'accommodation', label: 'Accommodation',        Icon: BedDouble,  color: '#2e7d5e', bg: 'rgba(46,125,94,0.09)' },
  { key: 'meals',         label: 'Meals',                Icon: Utensils,   color: '#2e7d5e', bg: 'rgba(46,125,94,0.09)' },
  { key: 'transport',     label: 'Transport',            Icon: Car,        color: '#2e7d5e', bg: 'rgba(46,125,94,0.09)' },
  { key: 'destinations',  label: 'Destinations',         Icon: MapPin,     color: '#2e7d5e', bg: 'rgba(46,125,94,0.09)' },
  { key: 'activities',    label: 'Included activities',  Icon: CheckCircle, color: '#2e7d5e', bg: 'rgba(46,125,94,0.09)' },
  { key: 'optional',      label: 'Optional activities',  Icon: Plus,       color: '#b8860b', bg: 'rgba(212,175,55,0.1)' },
]

const DEFAULT_NAV_TABS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'itinerary',   label: 'Itinerary' },
  { id: 'included',    label: "What's Included" },
  { id: 'suitability', label: 'Is This For You?' },
  { id: 'info',        label: 'Important Info' },
  { id: 'reviews',     label: 'Reviews' },
]

const NAVBAR_HEIGHT = 68

function SectionNav({ isMobile, tabs = DEFAULT_NAV_TABS }) {
  const [activeId, setActiveId] = useState('overview')
  const [navbarVisible, setNavbarVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavbarVisible(false)
      } else {
        setNavbarVisible(true)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-10% 0px -80% 0px' }
    )
    tabs.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [tabs])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = (navbarVisible ? NAVBAR_HEIGHT : 0) + 48 + 8
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const sectionNavTop = navbarVisible ? NAVBAR_HEIGHT : 0

  return (
    <nav style={{
      ...navStyles.bar,
      top: `${sectionNavTop}px`,
      transition: 'top 0.3s ease',
    }}>
      <div style={{
        ...navStyles.inner,
        padding: isMobile ? '0 20px' : '0 40px',
      }}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              ...navStyles.tab,
              padding: isMobile ? '0 12px' : '0 16px',
              fontSize: isMobile ? '13px' : '14px',
              color: activeId === id ? 'var(--color-forest-green)' : 'var(--color-n500)',
              borderBottom: activeId === id
                ? '2px solid var(--color-forest-green)'
                : '2px solid transparent',
              fontWeight: activeId === id ? '600' : '400',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}

const navStyles = {
  bar: {
    position: 'sticky',
    zIndex: 95,
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n300)',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  inner: {
    display: 'flex',
    alignItems: 'stretch',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 40px',
    gap: '0',
    minWidth: 'max-content',
  },
  tab: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '0 16px',
    height: '48px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s, border-bottom-color 0.15s',
    flexShrink: 0,
  },
}

function getInfoIcon(title) {
  const t = title.toLowerCase()
  if (t.includes('wear') || t.includes('cloth')) return Shirt
  if (t.includes('visa')) return Globe
  if (t.includes('accommodation') || t.includes('hotel') || t.includes('stay')) return BedDouble
  if (t.includes('cancel')) return Calendar
  if (t.includes('joining') || t.includes('departure') || t.includes('point')) return MapPin
  if (t.includes('physical') || t.includes('fitness') || t.includes('demand')) return Footprints
  if (t.includes('currency') || t.includes('money') || t.includes('payment')) return Banknote
  if (t.includes('border') || t.includes('crossing')) return Compass
  if (t.includes('group') || t.includes('size')) return Users
  if (t.includes('segment') || t.includes('available')) return Clock
  if (t.includes('consider') || t.includes('booking')) return AlertTriangle
  return ShieldCheck
}

const PKG_BADGES = {
  'sarajevo-essential':      { badge: 'Most Popular', badgeStyle: 'amber' },
  'bosnia-deep-dive':        { badge: 'Best Value',   badgeStyle: 'green' },
  'sarajevo-to-dubrovnik':   { badge: 'New',          badgeStyle: 'dark'  },
  'balkans-full-arc':        { badge: 'Epic Journey', badgeStyle: 'green' },
  'empires-and-edge':        { badge: 'New',          badgeStyle: 'amber' },
  'mountains-of-the-balkans':{ badge: 'Active',       badgeStyle: 'green' },
  'adriatic-crossings':      { badge: 'New',          badgeStyle: 'dark'  },
}

const DIFF_COLOR = {
  Easy:        { color: 'var(--color-forest-green)', bg: 'rgba(46,125,94,0.10)',  border: 'rgba(46,125,94,0.20)'  },
  Moderate:    { color: '#b45309',                   bg: 'rgba(180,83,9,0.08)',   border: 'rgba(180,83,9,0.18)'   },
  Challenging: { color: '#c0392b',                   bg: 'rgba(192,57,43,0.08)', border: 'rgba(192,57,43,0.18)'  },
}

function PackageDetail() {
  const { slug } = useParams()
  const pkg = packages.find((p) => p.slug === slug)
  const width = useWindowWidth()
  const isMobile = width <= 768
  const { stats } = useAllReviews()

  const [expandedBreakdown, setExpandedBreakdown] = useState(new Set())
  const toggleBreakdown = (key) => setExpandedBreakdown(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s })
  const [openDay, setOpenDay] = useState(1)
  const dayRefs = useRef({})
  const toggleDay = (id) => {
    setOpenDay(prev => prev === id ? null : id)
    setTimeout(() => {
      const el = dayRefs.current[id]
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - 136
      window.scrollTo({ top, behavior: 'smooth' })
    }, 260)
  }
  const [openInfo, setOpenInfo] = useState(null)
  const [includedExpanded, setIncludedExpanded] = useState(false)
  const [excludedExpanded, setExcludedExpanded] = useState(false)
  const { bookings, getSpotsLeft } = useAvailability()
  const { dates: departureDates, loading: datesLoading } = usePackageDates(pkg?.slug)

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

  const [formMode, setFormMode] = useState('booking') // 'booking' | 'enquiry'
  const [bookingStep, setBookingStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [numPeople, setNumPeople] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [withAccommodation, setWithAccommodation] = useState('without')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [enquiryName, setEnquiryName] = useState('')
  const [enquiryEmail, setEnquiryEmail] = useState('')
  const [enquiryText, setEnquiryText] = useState('')
  const [isEnquirySending, setIsEnquirySending] = useState(false)
  const [isEnquirySuccess, setIsEnquirySuccess] = useState(false)
  const [isEnquiryError, setIsEnquiryError] = useState(false)

  const dayIncluded = [...new Set((pkg?.days || []).flatMap(d => d.includedActivities || []).filter(Boolean))]
  const dayOptional = [...new Set((pkg?.days || []).flatMap(d => d.optionalActivities || []).filter(Boolean))]

  useEffect(() => {
    if (!pkg) return
    trackEvent('view_item', {
      currency: 'EUR',
      value: pkg.price,
      items: [{ item_id: pkg.slug, item_name: pkg.name, item_category: 'package', price: pkg.price }],
    })
  }, [pkg?.slug])

  const scrollFired = useRef(new Set())
  useEffect(() => {
    if (!pkg) return
    scrollFired.current = new Set()
    const thresholds = [25, 50, 75, 90]
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const pct = Math.round((window.scrollY / scrollable) * 100)
      thresholds.forEach((t) => {
        if (pct >= t && !scrollFired.current.has(t)) {
          scrollFired.current.add(t)
          trackEvent('scroll_depth', { page: pkg.slug, depth: t })
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pkg?.slug])

  if (!pkg) {
    return (
      <div style={styles.notFound}>
        <h2>Package not found</h2>
        <Link to="/multi-day-tours" style={styles.backLinkDark}>← Back to packages</Link>
      </div>
    )
  }

  const activePrice = withAccommodation === 'with' ? pkg.priceWith : pkg.priceWithout
  const totalPrice = activePrice * numPeople
  const spotsLeft = selectedDate ? getSpotsLeft(pkg.slug, selectedDate, selectedLanguage, pkg.groupSize) : null
  const maxPeople = spotsLeft != null ? Math.min(pkg.groupSize, spotsLeft) : pkg.groupSize

  const handleEnquiry = () => {
    if (!enquiryName || !enquiryEmail || !enquiryText) {
      alert('Please fill in all fields.')
      return
    }
    setIsEnquirySending(true)
    setIsEnquiryError(false)
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        tour_name: `${pkg.name} — ${pkg.subtitle}`,
        guest_name: enquiryName,
        guest_email: enquiryEmail,
        message: enquiryText,
        type: 'Enquiry',
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => { setIsEnquirySending(false); setIsEnquirySuccess(true) })
    .catch(() => { setIsEnquirySending(false); setIsEnquiryError(true) })
  }

  const handleBooking = () => {
    if (!selectedDate || !guestName || !guestEmail) {
      alert('Please fill in your name, email, and select a date.')
      return
    }
    setIsSending(true)
    setIsError(false)

    trackEvent('begin_checkout', {
      currency: 'EUR',
      value: totalPrice,
      items: [{ item_id: pkg.slug, item_name: pkg.name, item_category: 'package', price: pkg.price, quantity: numPeople }],
    })

    const templateParams = {
      type: 'Booking',
      tour_name: `${pkg.name} — ${pkg.subtitle}`,
      tour_date: selectedDate,
      num_people: numPeople,
      total_price: totalPrice,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone || 'Not provided',
      discount_code: discountCode || 'None',
      language: selectedLanguage,
      accommodation: withAccommodation === 'with' ? 'With accommodation' : 'Without accommodation',
    }

    fetch(`https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/Bookings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          TourSlug: pkg.slug || pkg.id || '',
          TourName: `${pkg.name} — ${pkg.subtitle}`,
          TourDate: selectedDate,
          NumPeople: numPeople,
          TourType: 'package',
          TotalPrice: totalPrice,
          GuestName: guestName,
          GuestEmail: guestEmail,
          GuestPhone: guestPhone || '',
          DiscountCode: discountCode || '',
          Language: selectedLanguage,
          Accommodation: withAccommodation === 'with' ? 'With accommodation' : 'Without accommodation',
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
        transaction_id: `${pkg.slug}-${Date.now()}`,
        currency: 'EUR',
        value: totalPrice,
        items: [{ item_id: pkg.slug, item_name: pkg.name, item_category: 'package', price: pkg.price, quantity: numPeople }],
      })
    })
    .catch(() => { setIsSending(false); setIsError(true) })
  }

  const bookingForm = (
    <div style={styles.bookingCard}>
      {isSuccess ? (
        <div style={styles.successMessage}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <CheckCircle size={40} color="var(--color-success)" />
          </div>
          <h3 style={styles.successTitle}>Request Received!</h3>
          <p style={styles.successText}>
            Thanks {guestName}. Your request for{' '}
            <strong>{pkg.name}</strong> on {selectedDate} for{' '}
            {numPeople} {numPeople === 1 ? 'person' : 'people'} has been
            received. You'll hear back within 24 hours.
          </p>
        </div>
      ) : isEnquirySuccess ? (
        <div style={styles.successMessage}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <CheckCircle size={40} color="var(--color-success)" />
          </div>
          <h3 style={styles.successTitle}>Enquiry Sent!</h3>
          <p style={styles.successText}>
            Thanks {enquiryName}. We've received your enquiry about <strong>{pkg.name}</strong> and will reply within 24 hours.
          </p>
        </div>
      ) : (
        <>
          {/* Mode toggle */}
          <div style={styles.modeToggle}>
            <button
              type="button"
              onClick={() => setFormMode('booking')}
              style={{
                ...styles.modeBtn,
                borderBottom: formMode === 'booking' ? '2px solid var(--color-forest-green)' : '2px solid transparent',
                color: formMode === 'booking' ? 'var(--color-forest-green)' : 'var(--color-n500)',
                fontWeight: formMode === 'booking' ? '700' : '500',
              }}
            >
              Book
            </button>
            <button
              type="button"
              onClick={() => setFormMode('enquiry')}
              style={{
                ...styles.modeBtn,
                borderBottom: formMode === 'enquiry' ? '2px solid var(--color-forest-green)' : '2px solid transparent',
                color: formMode === 'enquiry' ? 'var(--color-forest-green)' : 'var(--color-n500)',
                fontWeight: formMode === 'enquiry' ? '700' : '500',
              }}
            >
              Enquiry
            </button>
          </div>

          {/* ── ENQUIRY MODE ── */}
          {formMode === 'enquiry' ? (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  style={styles.input}
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@email.com"
                  style={styles.input}
                  value={enquiryEmail}
                  onChange={(e) => setEnquiryEmail(e.target.value)}
                />
              </div>
              <div style={{ ...styles.formGroup, marginBottom: '16px' }}>
                <label style={styles.label}>Your Enquiry</label>
                <textarea
                  placeholder="Tell us what you'd like to know — dates, group size, customisations, anything."
                  style={{ ...styles.input, height: '110px', resize: 'vertical', paddingTop: '10px', lineHeight: '1.5' }}
                  value={enquiryText}
                  onChange={(e) => setEnquiryText(e.target.value)}
                />
              </div>
              <button
                style={{
                  ...styles.bookBtn,
                  opacity: isEnquirySending ? 0.7 : 1,
                  cursor: isEnquirySending ? 'not-allowed' : 'pointer',
                }}
                onClick={handleEnquiry}
                disabled={isEnquirySending}
                className="btn-lift btn-glow-amber"
              >
                {isEnquirySending ? 'Sending...' : 'Send Enquiry'}
              </button>
              {isEnquiryError && (
                <p style={styles.errorMessage}>Something went wrong. Please try again or email us directly.</p>
              )}
            </>
          ) : (
          <>
          {/* ── BOOKING MODE ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600', color: 'var(--color-n700)' }}>
              Book a package
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: '600', color: 'var(--color-n600)' }}>
              Step {bookingStep} of 2
            </span>
          </div>

          {bookingStep === 1 ? (
            <>
              <div style={{ ...styles.formGroup, marginBottom: '12px' }}>
                <div style={styles.accomGrid}>
                  <button
                    type="button"
                    onClick={() => setWithAccommodation('without')}
                    style={{
                      ...styles.accomOption,
                      borderColor: withAccommodation === 'without' ? 'var(--color-forest-green)' : 'var(--color-n300)',
                      backgroundColor: withAccommodation === 'without' ? 'rgba(46,125,94,0.06)' : 'var(--color-n000)',
                    }}
                  >
                    <span style={{ ...styles.accomOptionTitle, color: withAccommodation === 'without' ? 'var(--color-forest-green)' : 'var(--color-n900)' }}>
                      Accommodation excluded
                    </span>
                    <span style={styles.accomOptionPrice}>
                      €{pkg.priceWithout}<span style={styles.accomPerPerson}>/person</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithAccommodation('with')}
                    style={{
                      ...styles.accomOption,
                      borderColor: withAccommodation === 'with' ? 'var(--color-forest-green)' : 'var(--color-n300)',
                      backgroundColor: withAccommodation === 'with' ? 'rgba(46,125,94,0.06)' : 'var(--color-n000)',
                    }}
                  >
                    <span style={{ ...styles.accomOptionTitle, color: withAccommodation === 'with' ? 'var(--color-forest-green)' : 'var(--color-n900)' }}>
                      4★ Hotel included
                    </span>
                    <span style={styles.accomOptionPrice}>
                      €{pkg.priceWith}<span style={styles.accomPerPerson}>/person</span>
                    </span>
                  </button>
                </div>
              </div>


              <div style={{ ...styles.formGroup, position: 'relative' }} ref={calendarWrapperRef}>
                <label style={styles.label}>Select a Date</label>
                <button
                  type="button"
                  style={{
                    ...styles.input,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: datesLoading ? 'default' : 'pointer',
                    textAlign: 'left',
                    color: selectedDate ? 'var(--color-n800)' : 'var(--color-n500)',
                  }}
                  onClick={() => !datesLoading && setCalendarOpen((v) => !v)}
                >
                  <span>
                    {datesLoading
                      ? 'Loading dates…'
                      : selectedDate
                        ? formatDepartureDate(selectedDate)
                        : 'Select a departure date'}
                  </span>
                  <ChevronDown
                    size={14}
                    color="var(--color-n500)"
                    style={{ flexShrink: 0, transform: calendarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  />
                </button>

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
                      zIndex: 200,
                    }),
                    backgroundColor: 'var(--color-n000)',
                    border: '1px solid var(--color-n300)',
                    borderRadius: '14px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
                    overflow: 'hidden',
                    maxHeight: '320px',
                    overflowY: 'auto',
                  }}>
                    {isMobile && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 10px', borderBottom: '1px solid var(--color-n200)' }}>
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
                    {departureDates.length === 0 ? (
                      <div style={{ padding: '20px 16px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-n500)' }}>
                        No upcoming dates —{' '}
                        <button
                          type="button"
                          onClick={() => { setCalendarOpen(false); setFormMode('enquiry') }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-forest-green)', fontWeight: '600', padding: 0, fontFamily: 'inherit', fontSize: 'inherit' }}
                        >
                          send an enquiry
                        </button>
                      </div>
                    ) : (
                      departureDates.map((date) => {
                        const spots = getSpotsLeft(pkg.slug, date, selectedLanguage, pkg.groupSize)
                        const isFull = spots === 0
                        const isLow = spots != null && spots > 0 && spots <= 3
                        const isSelected = selectedDate === date
                        return (
                          <button
                            key={date}
                            type="button"
                            disabled={isFull}
                            onClick={() => {
                              setSelectedDate(date)
                              setCalendarOpen(false)
                              if (spots != null) setNumPeople((n) => Math.min(n, spots))
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              borderBottom: '1px solid var(--color-n200)',
                              backgroundColor: isSelected ? 'rgba(46,125,94,0.06)' : isFull ? 'var(--color-n050, #fafafa)' : 'transparent',
                              cursor: isFull ? 'default' : 'pointer',
                              fontFamily: 'var(--font-body)',
                              textAlign: 'left',
                            }}
                          >
                            <span style={{ fontSize: '14px', fontWeight: isSelected ? '600' : '500', color: isFull ? 'var(--color-n400)' : isSelected ? 'var(--color-forest-green)' : 'var(--color-n800)' }}>
                              {formatDepartureDate(date)}
                            </span>
                            {isFull && (
                              <span style={{ fontSize: '12px', color: 'var(--color-n400)', fontWeight: '500' }}>Full</span>
                            )}
                            {isLow && (
                              <span style={{ fontSize: '12px', color: 'var(--color-amber)', fontWeight: '600' }}>{spots} spot{spots > 1 ? 's' : ''} left</span>
                            )}
                          </button>
                        )
                      })
                    )}
                  </div>
                )}
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '12px' }}>
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

              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalPrice}>€{totalPrice}</span>
              </div>

              <button
                style={styles.bookBtn}
                className="btn-lift btn-glow-amber"
                onClick={() => {
                  if (!selectedDate) { alert('Please select a date.'); return }
                  setBookingStep(2)
                }}
              >
                Continue to Booking — €{totalPrice}
              </button>
            </>
          ) : (
            <>
              {/* Compact chip-style selection summary */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {[
                  { label: 'Date', value: selectedDate },
                  { label: 'Guests', value: `${numPeople} ${numPeople === 1 ? 'person' : 'people'}` },
                  { label: 'Accommodation', value: withAccommodation === 'with' ? 'With' : 'Without' },
                  { label: 'Language', value: selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1) },
                  { label: 'Total', value: `€${totalPrice}` },
                ].map(({ label, value }) => (
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

              <div style={styles.formGroup}>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  style={styles.input}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@email.com"
                  style={styles.input}
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone (optional)</label>
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  style={styles.input}
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '12px' }}>
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
                  onClick={handleBooking}
                  disabled={isSending}
                  className="btn-lift btn-glow-amber"
                >
                  {isSending ? 'Sending...' : `Confirm & Book — €${totalPrice}`}
                </button>
              </div>
            </>
          )}

          {isError && (
            <p style={styles.errorMessage}>
              Something went wrong. Please try again or email us directly.
            </p>
          )}

          </>
          )}
        </>
      )}
    </div>
  )

  const relatedPackages = packages.filter((p) => p.slug !== pkg.slug).slice(0, 3)

  return (
    <div>

<SEO
  title={`${pkg.name} — ${pkg.subtitle}`}
  description={(pkg.about || pkg.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 155)}
  url={`/packages/${pkg.slug}`}
/>
<PackageSchema pkg={pkg} />
<PackageBreadcrumbSchema pkg={pkg} />

      <div style={{ ...styles.heroWrapper, height: isMobile ? '56vh' : '70vh' }}>
        <img src={pkg.heroImage} alt={pkg.name} style={styles.heroPhoto} />
        <div style={styles.heroGradient} />
        <div style={styles.heroGradientTop} />
        <div style={styles.heroBackLink}>
          <Link to="/multi-day-tours" style={styles.backLink}>← All Packages</Link>
        </div>
      </div>

      <SectionNav
        isMobile={isMobile}
        tabs={[
          { id: 'overview',     label: 'Overview' },
          { id: 'itinerary',   label: 'Itinerary' },
          { id: 'included',    label: "What's Included" },
          { id: 'suitability', label: 'Is This For You?' },
          ...(hasAccessibilityContent(pkg.accessibility) ? [{ id: 'accessibility', label: 'Accessibility' }] : []),
          { id: 'info',        label: 'Important Info' },
          { id: 'reviews',     label: 'Reviews' },
        ]}
      />

      <div style={{
        ...styles.contentCard,
        padding: isMobile ? '80px 20px 100px 20px' : '96px 40px 48px',
      }}>

        <div style={styles.titleBlock}>
          <div style={styles.titleLeft}>

            {/* Rating — above the title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Star size={15} color="var(--color-amber)" fill="var(--color-amber)" />
              <span style={styles.ratingNumber}>{stats[pkg.slug]?.avgRating ?? pkg.rating}</span>
              <span style={styles.ratingCount}>({stats[pkg.slug]?.count ?? pkg.reviews} reviews)</span>
            </div>

            {/* Title */}
            <h1 style={{
              ...styles.packageTitle,
              fontSize: isMobile ? '28px' : '44px',
            }}>
              {pkg.name}
            </h1>

            {/* Subtitle */}
            {pkg.subtitle && (
              <p style={styles.packageSubtitleText}>{pkg.subtitle}</p>
            )}

            {/* Meta pills — difficulty, duration, group size */}
            <div style={styles.metaPillRow}>
              <span style={styles.metaPill}>
                <Compass size={13} color="var(--color-forest-green)" />
                {pkg.difficulty}
              </span>
              <span style={styles.metaPill}>
                <Clock size={13} color="var(--color-forest-green)" />
                {pkg.duration}
              </span>
              <span style={styles.metaPill}>
                <Users size={13} color="var(--color-forest-green)" />
                Max {pkg.groupSize} people
              </span>
            </div>

          </div>
        </div>

        <div style={{
          ...styles.contentGrid,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 360px',
          gap: isMobile ? '32px' : '48px',
          marginTop: '40px',
        }}>

          {/* ── LEFT COLUMN ── */}
          <div style={styles.leftColumn}>

           {/* Gallery — full-bleed carousel, no card wrapper */}
{pkg.gallery && pkg.gallery.length > 0 && (
  <Gallery images={pkg.gallery} alt={pkg.name} />
)}

            {/* Overview: About + Activities */}
            <div id="overview" style={styles.section}>
              <h2 style={styles.sectionTitle}>About this package</h2>
              <RichContent value={pkg.about} paragraphStyle={styles.bodyText} htmlStyle={styles.bodyText} />
            </div>

            {/* Activities & Experiences */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Activities & experiences</h2>
              <div style={{
                ...styles.activitiesGrid,
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              }}>
                {pkg.activities.map((activity, index, arr) => {
                  const Icon = activityIconMap[activity.icon]
                  const isLastInRow = isMobile
                    ? index === arr.length - 1
                    : index >= arr.length - (arr.length % 2 === 0 ? 2 : 1)
                  return (
                    <div key={index} style={{
                      ...styles.activityCard,
                      borderBottom: isLastInRow ? 'none' : '1px solid var(--color-n200)',
                    }}>
                      <div style={styles.activityIconWrapper}>
                        {Icon && <Icon size={16} color="var(--color-forest-green)" strokeWidth={2} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={styles.activityName}>{activity.name}</h4>
                        <p style={styles.activityDesc}>{activity.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Route map — only if package has waypoints */}
            {pkg.mapWaypoints && pkg.mapWaypoints.length > 0 && (
              <Suspense fallback={null}>
                <RouteMap waypoints={pkg.mapWaypoints} profile={pkg.mapProfile} />
              </Suspense>
            )}

            {/* Day by Day Itinerary */}
            <div id="itinerary" style={styles.section}>
              <h2 style={styles.sectionTitle}>Day by day itinerary</h2>
              <div style={styles.timelineList}>
                {pkg.days.map((day, index) => {
                  const isOpen = openDay === day.id
                  const isLast = index === pkg.days.length - 1
                  return (
                    <div key={day.id} ref={(el) => { dayRefs.current[day.id] = el }} style={{ ...styles.timelineItem, paddingBottom: isLast ? '0' : '12px' }}>
                      {/* Card */}
                      <div
                        className={`itinerary-card${isOpen ? ' is-open' : ''}`}
                        style={styles.timelineContent}
                        onClick={() => toggleDay(day.id)}
                      >
                        {/* Header */}
                        <div style={styles.timelineHeader}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                              <span style={styles.dayChip}>Day {index + 1}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={11} color="var(--color-n400)" />
                                <span style={styles.cityInline}>{day.city}</span>
                              </div>
                            </div>
                            <span style={styles.dayTitle}>{day.title}</span>
                            <p style={styles.daySummary}>{day.summary}</p>
                          </div>
                          <div style={{ flexShrink: 0, alignSelf: 'flex-start', paddingTop: '3px' }}>
                            {isOpen
                              ? <ChevronUp size={18} color="var(--color-forest-green)" />
                              : <ChevronDown size={18} color="var(--color-n600)" />
                            }
                          </div>
                        </div>

                        {/* Expanded body */}
                        {isOpen && (
                          <div className="itinerary-body" style={styles.timelineBody}>
                            {/* Divider */}
                            <div style={{ height: '1px', backgroundColor: 'var(--color-n200)', margin: '4px 0 4px' }} />

                            {/* Day photo */}
                            {day.photo && (
                              <div style={{ marginBottom: '12px' }}>
                                <img
                                  src={day.photo}
                                  alt={day.title}
                                  style={styles.dayPhoto}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    const ph = e.currentTarget.nextSibling
                                    if (ph) ph.style.display = 'flex'
                                  }}
                                />
                                <div style={{ ...styles.dayPhoto, display: 'none', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-n100)', color: 'var(--color-n400)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
                                  Photo coming soon
                                </div>
                              </div>
                            )}


                            {day.morning && (
                              <div style={styles.timeBlock}>
                                <div style={styles.timeLabelRow}>
                                  <span style={{ ...styles.timeDot, backgroundColor: 'rgba(241,196,15,0.7)' }} />
                                  <span style={styles.timeLabel}>Morning</span>
                                </div>
                                <RichContent value={day.morning} paragraphStyle={styles.timeContent} htmlStyle={styles.timeContent} />
                              </div>
                            )}
                            {day.afternoon && (
                              <div style={styles.timeBlock}>
                                <div style={styles.timeLabelRow}>
                                  <span style={{ ...styles.timeDot, backgroundColor: 'rgba(46,125,94,0.5)' }} />
                                  <span style={styles.timeLabel}>Afternoon</span>
                                </div>
                                <RichContent value={day.afternoon} paragraphStyle={styles.timeContent} htmlStyle={styles.timeContent} />
                              </div>
                            )}
                            {day.evening && (
                              <div style={styles.timeBlock}>
                                <div style={styles.timeLabelRow}>
                                  <span style={{ ...styles.timeDot, backgroundColor: 'rgba(99,102,241,0.5)' }} />
                                  <span style={styles.timeLabel}>Evening</span>
                                </div>
                                <RichContent value={day.evening} paragraphStyle={styles.timeContent} htmlStyle={styles.timeContent} />
                              </div>
                            )}
                            {day.note && (
                              <div style={styles.dayNote}>
                                <p style={styles.dayNoteText}>{day.note}</p>
                              </div>
                            )}

                            {/* Included & optional activities */}
                            {(day.includedActivities?.length > 0 || day.optionalActivities?.length > 0) && (
                              <>
                                <div style={{ height: '1px', backgroundColor: 'var(--color-n200)' }} />
                                {day.includedActivities?.length > 0 && (
                                  <div style={styles.activitiesBlock}>
                                    <span style={styles.activitiesLabel}>Included activities</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {day.includedActivities.map((act, i) => (
                                        <div key={i} style={styles.activityRow}>
                                          <CheckCircle size={12} color="var(--color-forest-green)" style={{ flexShrink: 0 }} />
                                          <span style={styles.activityText}>{act}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {day.optionalActivities?.length > 0 && (
                                  <div style={styles.activitiesBlock}>
                                    <span style={styles.activitiesLabelOptional}>Optional activities</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {day.optionalActivities.map((act, i) => (
                                        <div key={i} style={styles.activityRow}>
                                          <Plus size={12} color="var(--color-amber)" style={{ flexShrink: 0 }} />
                                          <span style={styles.activityText}>{act}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {(day.accommodation || day.meals?.length > 0) && (
                              <>
                                <div style={{ height: '1px', backgroundColor: 'var(--color-n200)' }} />
                                <div style={styles.logisticsBar}>
                                  {day.accommodation && (
                                    <div style={styles.logisticChip}>
                                      <BedDouble size={13} color="var(--color-forest-green)" style={{ flexShrink: 0 }} />
                                      <span style={styles.logisticText}>{day.accommodation}</span>
                                    </div>
                                  )}
                                  {day.meals?.length > 0 && (
                                    <div style={styles.logisticChip}>
                                      <Utensils size={13} color="var(--color-n600)" style={{ flexShrink: 0 }} />
                                      <span style={styles.logisticText}>{day.meals.join(' · ')}</span>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Fitness / content warnings */}
            {pkg.fitnessNotes && pkg.fitnessNotes.length > 0 && (
              <div style={styles.section}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pkg.fitnessNotes.map((note) => (
                    <div key={note.level} style={{
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start',
                      backgroundColor: note.type === 'emotional' ? 'rgba(221,107,32,0.06)' : 'rgba(46,125,94,0.06)',
                      borderLeft: `3px solid ${note.type === 'emotional' ? 'var(--color-warning)' : 'var(--color-forest-green)'}`,
                      borderRadius: '0 var(--radius) var(--radius) 0',
                      padding: '16px 20px',
                    }}>
                      <AlertTriangle
                        size={18}
                        color={note.type === 'emotional' ? 'var(--color-warning)' : 'var(--color-forest-green)'}
                        style={{ flexShrink: 0, marginTop: '2px' }}
                      />
                      <div>
                        <span style={{
                          display: 'block',
                          fontFamily: 'var(--font-display)',
                          fontWeight: '700',
                          fontSize: '14px',
                          color: note.type === 'emotional' ? 'var(--color-warning)' : 'var(--color-forest-green)',
                          marginBottom: '6px',
                        }}>
                          {note.level}
                        </span>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          color: 'var(--color-n600)',
                          lineHeight: '1.65',
                          margin: 0,
                        }}>
                          {note.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included */}
            <div id="included" style={styles.section}>
              <h2 style={styles.sectionTitle}>What's included</h2>

              {/* Breakdown rows — or fallback to flat inclusions list */}
              <div style={{ marginTop: '8px' }}>
                {pkg.breakdown
                  ? BREAKDOWN_CARDS.map(({ key, label, Icon, color }) => {
                      const base = pkg.breakdown[key] || []
                      const extra = key === 'activities' ? dayIncluded : key === 'optional' ? dayOptional : []
                      const items = [...new Set([...base, ...extra])]
                      if (!items.length) return null
                      const isOptional = key === 'optional'
                      const isExpanded = expandedBreakdown.has(key)
                      const visible = items.length > 5 && !isExpanded ? items.slice(0, 5) : items
                      return (
                        <div key={key} style={{
                          display: 'grid',
                          gridTemplateColumns: isMobile ? '1fr' : '148px 1fr',
                          gap: isMobile ? '4px' : '24px',
                          padding: '14px 0',
                          borderBottom: '1px solid var(--color-n200)',
                          alignItems: 'flex-start',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: isMobile ? '0' : '1px' }}>
                            <Icon size={14} color={isOptional ? '#b8860b' : 'var(--color-forest-green)'} style={{ flexShrink: 0 }} />
                            <span style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: '700',
                              fontSize: '13px',
                              color: isOptional ? '#b8860b' : 'var(--color-n700)',
                            }}>{label}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: isMobile ? '22px' : '0' }}>
                            {visible.map((item, i) => (
                              <span key={i} style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                color: 'var(--color-n600)',
                                lineHeight: '1.55',
                              }}>{item}</span>
                            ))}
                            {items.length > 5 && (
                              <button style={{ ...showMoreBtnStyle, margin: '6px 0 0', alignSelf: 'flex-start' }} onClick={() => toggleBreakdown(key)}>
                                {isExpanded ? 'Show less' : `See ${items.length - 5} more`}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  : (() => {
                      const allInclusions = [...new Set([...pkg.inclusions, ...dayIncluded])]
                      const visible = includedExpanded ? allInclusions : allInclusions.slice(0, 5)
                      return visible.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '12px 0',
                          borderBottom: '1px solid var(--color-n200)',
                        }}>
                          <CheckCircle size={14} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', lineHeight: '1.5' }}>{item}</span>
                        </div>
                      ))
                    })()
                }

                {/* Optional activities row (fallback path) */}
                {!pkg.breakdown && dayOptional.length > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--color-n200)',
                  }}>
                    <Plus size={14} color="#b8860b" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '12px', color: '#b8860b', marginBottom: '2px' }}>Optional</span>
                      {dayOptional.map((item, i) => (
                        <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', lineHeight: '1.5' }}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Not included row */}
                {pkg.exclusions?.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '148px 1fr',
                    gap: isMobile ? '4px' : '24px',
                    padding: '14px 0',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: isMobile ? '0' : '1px' }}>
                      <XCircle size={14} color="var(--color-n400)" style={{ flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '13px', color: 'var(--color-n500)' }}>Not included</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: isMobile ? '22px' : '0' }}>
                      {pkg.exclusions.map((item, i) => (
                        <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n500)', lineHeight: '1.55' }}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                {!pkg.breakdown && [...new Set([...pkg.inclusions, ...dayIncluded])].length > 5 && (
                  <button style={showMoreBtnStyle} onClick={() => setIncludedExpanded(v => !v)}>
                    {includedExpanded ? 'Show less' : `See ${[...new Set([...pkg.inclusions, ...dayIncluded])].length - 5} more`}
                  </button>
                )}
              </div>
            </div>

            {/* Is This For You? */}
            {pkg.suitability && (
              <div id="suitability" style={styles.section}>
                <h2 style={styles.sectionTitle}>Is this trip right for you?</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '16px',
                  marginTop: '16px',
                }}>
                  {/* Good for */}
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
                    }}>This trip is for you if…</p>
                    {pkg.suitability.goodFor.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < pkg.suitability.goodFor.length - 1 ? '8px' : 0 }}>
                        <CheckCircle size={15} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', lineHeight: '1.55', margin: 0 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  {/* Think twice */}
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
                    }}>This trip may not be right if…</p>
                    {pkg.suitability.thinkTwice.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < pkg.suitability.thinkTwice.length - 1 ? '8px' : 0 }}>
                        <XCircle size={15} color="var(--color-n300)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', lineHeight: '1.55', margin: 0 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <AccessibilitySection accessibility={pkg.accessibility} />

            {/* Important Information — Vertical sidebar tabs */}
            <div id="info" style={styles.section}>
              <h2 style={styles.sectionTitle}>Important Information</h2>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '0',
                marginTop: '24px',
              }}>
                {/* Tab labels */}
                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : 'column',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                  gap: isMobile ? '4px' : '4px',
                  flexShrink: 0,
                  width: isMobile ? '100%' : '200px',
                  borderRight: isMobile ? 'none' : '1px solid var(--color-n200)',
                  borderBottom: isMobile ? '1px solid var(--color-n200)' : 'none',
                  paddingRight: isMobile ? '0' : '0',
                  paddingBottom: isMobile ? '16px' : '0',
                  marginBottom: isMobile ? '24px' : '0',
                }}>
                  {pkg.importantInfo.map((info, index) => {
                    const isActive = openInfo === index || (openInfo === null && index === 0)
                    const Icon = getInfoIcon(info.title)
                    return (
                      <button
                        key={index}
                        onClick={() => setOpenInfo(index)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          textAlign: 'left',
                          background: isActive && !isMobile ? 'rgba(46,125,94,0.07)' : 'none',
                          border: 'none',
                          borderLeft: isMobile ? 'none' : `3px solid ${isActive ? 'var(--color-forest-green)' : 'transparent'}`,
                          borderBottom: isMobile ? `2px solid ${isActive ? 'var(--color-forest-green)' : 'transparent'}` : 'none',
                          borderRadius: isMobile ? '0' : '0 8px 8px 0',
                          padding: isMobile ? '6px 10px' : '10px 16px',
                          fontFamily: 'var(--font-body)',
                          fontWeight: isActive ? '600' : '400',
                          fontSize: 'var(--text-small)',
                          color: isActive ? 'var(--color-forest-green)' : 'var(--color-n500)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          whiteSpace: isMobile ? 'nowrap' : 'normal',
                          lineHeight: '1.4',
                          width: isMobile ? 'auto' : 'calc(100% + 0px)',
                          marginRight: isMobile ? '0' : '-1px',
                        }}
                      >
                        <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
                        {info.title}
                      </button>
                    )
                  })}
                </div>

                {/* Content */}
                {(() => {
                  const activeIndex = openInfo === null ? 0 : openInfo
                  const activeInfo = pkg.importantInfo[activeIndex]
                  return (
                    <div style={{ flex: 1, paddingLeft: isMobile ? '0' : '36px' }}>
                      <p style={styles.infoContent}>{activeInfo.content}</p>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Package Reviews — approved reviews from Airtable + submission form */}
       <div id="reviews">
  <TourReviews tourId={pkg.slug} tourName={pkg.name} tourSlug={pkg.slug} basePath="/packages" />
</div>

          </div>

          {/* ── RIGHT COLUMN — Desktop only ── */}
          {!isMobile && (
            <div style={{ position: 'sticky', top: '104px', alignSelf: 'start' }}>
              {bookingForm}
            </div>
          )}

        </div>
      </div>

      {/* ── RELATED PACKAGES ───────────────────────────── */}
      {relatedPackages.length > 0 && (
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
                More multi-day tours
              </h2>
              <Link to="/multi-day-tours" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-forest-green)', fontWeight: 600, textDecoration: 'none' }}>
                View all packages →
              </Link>
            </div>
            {isMobile ? (
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none', padding: '0 20px 8px' }}>
                {relatedPackages.map((p) => {
                  const { badge, badgeStyle } = PKG_BADGES[p.slug] || {}
                  const diffCol = DIFF_COLOR[p.difficulty] || DIFF_COLOR.Easy
                  return (
                    <Link key={p.id} to={`/packages/${p.slug}`} style={{ flex: '0 0 80vw', maxWidth: '340px', scrollSnapAlign: 'start', textDecoration: 'none', display: 'block', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
                      <div style={{ position: 'relative', width: '100%', height: '420px', overflow: 'hidden' }}>
                        <img src={p.heroImage} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} className="pkg-card-img" />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 28%, transparent 40%, rgba(0,0,0,0.88) 100%)' }} />
                        <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {badge && (
                            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 11px', borderRadius: '100px', backgroundColor: badgeStyle === 'amber' ? 'var(--color-amber)' : badgeStyle === 'green' ? 'var(--color-forest-green)' : 'rgba(0,0,0,0.55)', color: badgeStyle === 'amber' ? 'var(--color-n900)' : 'var(--color-n000)' }}>{badge}</span>
                          )}
                          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', color: 'var(--color-n000)', backgroundColor: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.18)', padding: '5px 12px', borderRadius: '100px', marginLeft: 'auto' }}>{p.duration}</span>
                        </div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px 18px' }}>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: 'var(--color-n000)', lineHeight: 1.2, letterSpacing: '-0.2px', margin: '0 0 4px' }}>{p.name}</h3>
                          {p.subtitle && <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.70)', margin: '0 0 10px', fontStyle: 'italic' }}>{p.subtitle}</p>}
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: 'rgba(255,255,255,0.92)', backgroundColor: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.16)', padding: '3px 9px', borderRadius: '100px' }}><Gauge size={11} />{p.difficulty}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: 'rgba(255,255,255,0.92)', backgroundColor: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.16)', padding: '3px 9px', borderRadius: '100px' }}><Users size={11} />Max {p.groupSize}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.60)', fontWeight: 500, letterSpacing: '0.3px' }}>from</span>
                              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: 'var(--color-n000)', lineHeight: 1 }}>€{p.priceWithout}</span>
                            </div>
                            <button className="pkg-card-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '34px', padding: '0 14px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.3px', borderRadius: '100px', whiteSpace: 'nowrap', cursor: 'pointer', border: 'none' }}>
                              View Package <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {relatedPackages.map((p) => {
                  const { badge, badgeStyle } = PKG_BADGES[p.slug] || {}
                  return (
                    <Link key={p.id} to={`/packages/${p.slug}`} style={{ display: 'block', textDecoration: 'none', borderRadius: '16px' }} className="pkg-card">
                      <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
                        <div style={{ position: 'relative', width: '100%', height: '420px', overflow: 'hidden' }}>
                          <img src={p.heroImage} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} className="pkg-card-img" />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 28%, transparent 40%, rgba(0,0,0,0.88) 100%)' }} />
                          <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {badge && (
                              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 11px', borderRadius: '100px', backgroundColor: badgeStyle === 'amber' ? 'var(--color-amber)' : badgeStyle === 'green' ? 'var(--color-forest-green)' : 'rgba(0,0,0,0.55)', color: badgeStyle === 'amber' ? 'var(--color-n900)' : 'var(--color-n000)' }}>{badge}</span>
                            )}
                            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', color: 'var(--color-n000)', backgroundColor: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.18)', padding: '5px 12px', borderRadius: '100px', marginLeft: 'auto' }}>{p.duration}</span>
                          </div>
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px 18px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: 'var(--color-n000)', lineHeight: 1.2, letterSpacing: '-0.2px', margin: '0 0 4px' }}>{p.name}</h3>
                            {p.subtitle && <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.70)', margin: '0 0 10px', fontStyle: 'italic' }}>{p.subtitle}</p>}
                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: 'rgba(255,255,255,0.92)', backgroundColor: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.16)', padding: '3px 9px', borderRadius: '100px' }}><Gauge size={11} />{p.difficulty}</span>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: 'rgba(255,255,255,0.92)', backgroundColor: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.16)', padding: '3px 9px', borderRadius: '100px' }}><Users size={11} />Max {p.groupSize}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.60)', fontWeight: 500, letterSpacing: '0.3px' }}>from</span>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: 'var(--color-n000)', lineHeight: 1 }}>€{p.priceWithout}</span>
                              </div>
                              <button className="pkg-card-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '34px', padding: '0 14px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.3px', borderRadius: '100px', whiteSpace: 'nowrap', cursor: 'pointer', border: 'none' }}>
                                View Package <ArrowRight size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM BAR ── */}
      {isMobile && (
        <div style={styles.mobileBottomBar}>
          <div style={styles.mobileBottomBarLeft}>
            <span style={styles.mobilePrice}>From €{pkg.priceWithout}</span>
            <span style={styles.mobilePricePer}>per person</span>
          </div>
          <button style={styles.mobileBookBtn} onClick={() => setDrawerOpen(true)} className="btn-lift btn-glow-amber">
            Book Now
          </button>
        </div>
      )}

      {/* ── MOBILE BOOKING DRAWER ── */}
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
            transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
          }}>
            <div style={styles.drawerHeader}>
              <div style={styles.drawerHandle} />
              <button style={styles.drawerClose} onClick={() => setDrawerOpen(false)} aria-label="Close booking form">
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
  notFound: { padding: '80px 40px', textAlign: 'center' },

  heroWrapper: {
    position: 'relative',
    height: '70vh',
    minHeight: '400px',
    maxHeight: '680px',
    overflow: 'hidden',
  },

  heroPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },

  heroGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '50%',
    background: 'linear-gradient(to top, rgba(247,249,252,1) 0%, transparent 100%)',
  },

  heroGradientTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '30%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
  },

  heroBackLink: { position: 'absolute', top: '24px', left: '40px', zIndex: 2 },

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

  backLinkDark: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },

  contentCard: {
    backgroundColor: 'var(--color-n000)',
    marginTop: '-60px',
    borderRadius: '24px 24px 0 0',
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
  },

  titleBlock: { maxWidth: '1100px', margin: '0 auto' },
  titleLeft: { maxWidth: '680px' },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '11px',
    color: 'var(--color-forest-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  packageTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: 'var(--color-n900)',
    lineHeight: '1.15',
    marginBottom: '10px',
  },

  packageSubtitleText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: '1.6',
    marginBottom: '16px',
    marginTop: 0,
    maxWidth: '560px',
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

  packageSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    marginBottom: '12px',
  },

  ratingRow: { display: 'flex', alignItems: 'center', gap: '5px' },

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

  leftColumn: { minWidth: 0 },

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
    marginBottom: '8px',
  },

  sectionSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    marginBottom: '16px',
  },

  bodyText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    marginBottom: '14px',
  },

  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '12px',
  },

  timelineItem: {
    paddingBottom: '10px',
  },


  timelineContent: {
    padding: '16px 18px',
    cursor: 'pointer',
  },

  timelineHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
  },

  timelineBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    paddingBottom: '4px',
  },

  cityTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(46,125,94,0.08)',
    padding: '3px 10px',
    borderRadius: '100px',
    flexShrink: 0,
  },

  cityLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    color: 'var(--color-forest-green)',
  },

  cityInline: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: '500',
    color: 'var(--color-n400)',
  },

  dayChip: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '22px',
    padding: '0 10px',
    borderRadius: '100px',
    backgroundColor: 'var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    color: '#fff',
    letterSpacing: '0.5px',
    flexShrink: 0,
  },

  cityInline: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--color-n500)',
  },

  dayTitle: {
    display: 'block',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '17px',
    color: 'var(--color-n900)',
    lineHeight: '1.25',
  },

  daySummary: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n500)',
    margin: '8px 0 0 0',
    lineHeight: '1.55',
  },

  timeBlock: { display: 'flex', flexDirection: 'column', gap: '6px' },

  timeLabelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },

  timeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },

  timeLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    color: 'var(--color-n700)',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },

  timeContent: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
    paddingLeft: '15px',
  },

  dayNote: {
    backgroundColor: 'rgba(241,196,15,0.08)',
    borderRadius: '8px',
    padding: '12px 14px',
    borderLeft: '3px solid var(--color-amber)',
  },

  dayNoteText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
    margin: 0,
    lineHeight: 'var(--leading-body)',
    fontStyle: 'italic',
  },

  highlightsList: { display: 'flex', flexDirection: 'column', gap: '7px' },
  highlightItem: { display: 'flex', alignItems: 'center', gap: '9px' },

  highlightText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  dayPhoto: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
  },

  logisticsBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },

  logisticChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n200)',
    borderRadius: '100px',
    padding: '4px 12px',
  },

  logisticText: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--color-n700)',
  },

  activitiesBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  activitiesLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: 'var(--color-forest-green)',
  },

  activitiesLabelOptional: {
    fontFamily: 'var(--font-display)',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: 'var(--color-amber)',
  },

  activityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  activityText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  inclusionsGrid: { display: 'grid', gap: '24px' },

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

  inclusionsList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  inclusionItem: { display: 'flex', alignItems: 'flex-start', gap: '10px' },

  inclusionText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    lineHeight: '1.5',
  },

  activitiesGrid: { display: 'grid', gap: '0 32px', marginTop: '4px' },

  activityCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 0',
  },

  activityIconWrapper: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(46,125,94,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '1px',
  },

  activityName: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    marginBottom: '3px',
  },

  activityDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    lineHeight: '1.5',
    margin: 0,
  },

  infoContent: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
  },

  suitabilityCard: {
    backgroundColor: 'var(--color-n000)',
    border: '1px solid var(--color-n300)',
    borderRadius: '12px',
    padding: '20px',
  },

  suitabilityCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '14px',
  },

  suitabilityCardLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '14px',
  },

  suitabilityList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  suitabilityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },

  suitabilityDotGreen: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-success)',
    flexShrink: 0,
    marginTop: '6px',
  },

  suitabilityDotAmber: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-warning)',
    flexShrink: 0,
    marginTop: '6px',
  },

  suitabilityText: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n600)',
    lineHeight: '1.65',
  },

  bookingCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    border: '1px solid var(--color-n300)',
  },

  modeToggle: {
    display: 'flex',
    gap: '0',
    marginBottom: '0',
  },

  modeBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '0 0 10px 0',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'color 0.15s, border-bottom-color 0.15s',
  },

  divider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    marginBottom: '12px',
    marginTop: '4px',
  },

  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },

  price: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '26px',
    color: 'var(--color-forest-green)',
  },

  perPerson: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px' },

  accomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },

  accomOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '4px',
    padding: '12px',
    borderRadius: '10px',
    border: '1.5px solid',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    width: '100%',
  },

  accomOptionTitle: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    lineHeight: '1.3',
    transition: 'color 0.15s ease',
    flex: 1,
  },

  accomOptionPrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '18px',
    color: 'var(--color-n900)',
  },

  accomPerPerson: {
    fontFamily: 'var(--font-body)',
    fontWeight: '400',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },

  pillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
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
    padding: '8px 0',
    marginBottom: '8px',
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

  cancellationRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },

  freeCancellation: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-success)',
    margin: 0,
  },

  successMessage: { textAlign: 'center', padding: '16px 0' },

  successIcon: {
    display: 'block',
    fontSize: '40px',
    color: 'var(--color-success)',
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

  errorMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-error)',
    textAlign: 'center',
    marginTop: '8px',
  },

  mobileBottomBar: {
    position: 'fixed',
    bottom: 0, left: 0, right: 0,
    zIndex: 150,
    backgroundColor: 'var(--color-n000)',
    borderTop: '1px solid var(--color-n300)',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
  },

  mobileBottomBarLeft: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' },

  mobilePrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '20px',
    color: 'var(--color-forest-green)',
    lineHeight: 1.1,
  },

  mobilePricePer: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--color-n500)',
    lineHeight: 1,
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
    bottom: 0, left: 0, right: 0,
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
    padding: '8px 20px 32px 20px',
    overflowY: 'auto',
  },
}

export default PackageDetail