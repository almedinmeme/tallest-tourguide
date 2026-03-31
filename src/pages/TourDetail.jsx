// TourDetail.jsx
// Fully redesigned individual tour page.
// Structure:
// - Full photo hero with overlap content card (same as PackageDetail)
// - Two column layout: details left, booking card right
// - Desktop: sticky booking card on right
// - Mobile: fixed bottom bar with drawer booking form

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star, Clock, Users, MapPin, CheckCircle,
  XCircle, ShieldCheck, ChevronDown, ChevronUp,
  X, Calendar, Phone, Mail, ArrowRight
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import useWindowWidth from '../hooks/useWindowWidth'
import tours from '../data/tours'

function TourDetail() {
  const { id } = useParams()
  const tour = tours.find((t) => t.id === Number(id))
  const width = useWindowWidth()
  const isMobile = width <= 768

  // Booking form state
  const [selectedDate, setSelectedDate] = useState('')
  const [numPeople, setNumPeople] = useState(1)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [tourType, setTourType] = useState('shared')
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null)

  const totalPrice = tour
    ? tourType === 'private'
      ? 0
      : tour.price * numPeople
    : 0

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
      tour_name: tour.title,
      tour_date: selectedDate,
      num_people: numPeople,
      total_price: tourType === 'private'
        ? 'Private tour — quote requested'
        : `€${totalPrice}`,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone || 'Not provided',
      tour_type: tourType === 'private'
        ? 'Private Tour'
        : 'Shared Tour',
    }

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => { setIsSending(false); setIsSuccess(true) })
    .catch(() => { setIsSending(false); setIsError(true) })
  }

  // The booking form JSX is extracted into a variable
  // so it can be rendered in both the desktop right column
  // AND the mobile drawer without duplicating code.
  // This is the DRY principle applied to JSX.
  const bookingForm = (
    <div style={styles.bookingCard}>
      {isSuccess ? (
        <div style={styles.successMessage}>
          <span style={styles.successIcon}>✓</span>
          <h3 style={styles.successTitle}>Request Received!</h3>
          <p style={styles.successText}>
            Thanks {guestName}. Your{' '}
            {tourType === 'private' ? 'private tour' : ''} booking
            request for <strong>{tour.title}</strong> on {selectedDate}
            {tourType === 'shared'
              ? ` for ${numPeople} ${numPeople === 1 ? 'person' : 'people'}`
              : ''
            } has been received. You'll hear back within 24 hours.
          </p>
        </div>
      ) : (
        <>
          {/* Tour type toggle — shared vs private.
              Private tour sends a quote request rather than
              a fixed price booking — correct behaviour since
              private pricing depends on group size and specifics. */}
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Your Name</label>
            <input
              type="text"
              placeholder="Ana Kovačević"
              style={styles.input}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="ana@example.com"
              style={styles.input}
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone (optional)</label>
            <input
              type="tel"
              placeholder="+387 61 000 000"
              style={styles.input}
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Date</label>
            <input
              type="date"
              style={styles.input}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {tourType === 'shared' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Number of People</label>
              <select
                style={styles.input}
                value={numPeople}
                onChange={(e) => setNumPeople(Number(e.target.value))}
              >
                {Array.from(
                  { length: tour.groupSize },
                  (_, i) => i + 1
                ).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {tourType === 'shared' && (
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalPrice}>€{totalPrice}</span>
            </div>
          )}

          <button
            style={{
              ...styles.bookBtn,
              opacity: isSending ? 0.7 : 1,
              cursor: isSending ? 'not-allowed' : 'pointer',
            }}
            onClick={handleBooking}
            disabled={isSending}
          >
            {isSending
              ? 'Sending...'
              : tourType === 'private'
                ? 'Request Private Tour Quote'
                : `Book Now — €${totalPrice}`
            }
          </button>

          {isError && (
            <p style={styles.errorMessage}>
              Something went wrong. Please try again or
              email us directly.
            </p>
          )}

          <div style={styles.cancellationRow}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <p style={styles.freeCancellation}>
              Free cancellation available
            </p>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div>

      {/* ── HERO PHOTO ──────────────────────────────────── */}
      <div style={styles.heroWrapper}>
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

      {/* ── CONTENT CARD ────────────────────────────────── */}
      <div style={{
        ...styles.contentCard,
        padding: isMobile
          ? '28px 20px 100px 20px'
          : '48px 40px 80px 40px',
      }}>

        {/* Title block */}
        <div style={styles.titleBlock}>
          <div style={styles.titleLeft}>
            <span style={styles.eyebrow}>
              {tour.duration} · Max {tour.groupSize} people
            </span>
            <h1 style={{
              ...styles.tourTitle,
              fontSize: isMobile ? '28px' : '44px',
            }}>
              {tour.title}
            </h1>
            <div style={styles.ratingRow}>
              <Star
                size={15}
                color="var(--color-amber)"
                fill="var(--color-amber)"
              />
              <span style={styles.ratingNumber}>{tour.rating}</span>
              <span style={styles.ratingCount}>
                ({tour.reviews} reviews)
              </span>
              <span style={styles.ratingDot}>·</span>
              <Clock size={14} color="var(--color-n600)" />
              <span style={styles.ratingMeta}>{tour.duration}</span>
              <span style={styles.ratingDot}>·</span>
              <Users size={14} color="var(--color-n600)" />
              <span style={styles.ratingMeta}>
                Max {tour.groupSize}
              </span>
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

            {/* Tour description */}
            <div style={styles.section}>
              <p style={styles.bodyText}>{tour.description}</p>
            </div>

            {/* Tour Highlights — styled numbered steps */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Tour Highlights</h2>
              <div style={styles.highlightsList}>
                {tour.highlights.map((highlight, index) => (
                  <div key={index} style={styles.highlightItem}>

                    {/* Step circle with number */}
                    <div style={styles.highlightNumber}>
                      <span style={styles.highlightNumberText}>
                        {index + 1}
                      </span>
                    </div>

                    {/* Highlight content — title and subtext.
                        We split on ' — ' to separate the location
                        name from its description, giving each
                        highlight a title and a subtext line.
                        If no ' — ' exists, the whole string
                        is the title with no subtext. */}
                    <div style={styles.highlightContent}>
                      {highlight.includes(' — ') ? (
                        <>
                          <span style={styles.highlightTitle}>
                            {highlight.split(' — ')[0]}
                          </span>
                          <span style={styles.highlightSubtext}>
                            {highlight.split(' — ')[1]}
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
              </div>
            </div>

            {/* Inclusions & Exclusions — side by side */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>What's Included</h2>
              <div style={{
                ...styles.inclusionsGrid,
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              }}>

                <div>
                  <h3 style={styles.inclusionSubtitle}>Included</h3>
                  <div style={styles.inclusionsList}>
                    {tour.includes.map((item, i) => (
                      <div key={i} style={styles.inclusionItem}>
                        <CheckCircle
                          size={15}
                          color="var(--color-success)"
                        />
                        <span style={styles.inclusionText}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exclusions — if your tour data has them,
                    otherwise we show a sensible default set */}
                <div>
                  <h3 style={styles.exclusionSubtitle}>
                    Not Included
                  </h3>
                  <div style={styles.inclusionsList}>
                    {(tour.excludes || [
                      'Food and drinks',
                      'Entrance fees to museums',
                      'Gratuities',
                      'Personal expenses',
                    ]).map((item, i) => (
                      <div key={i} style={styles.inclusionItem}>
                        <XCircle
                          size={15}
                          color="var(--color-n300)"
                        />
                        <span style={{
                          ...styles.inclusionText,
                          color: 'var(--color-n600)',
                        }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* FAQ section — only renders if tour has faqs */}
            {tour.faqs && tour.faqs.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Frequently Asked Questions
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

            {/* Important Info — meeting point, what to wear,
                cancellation. Always last in the left column. */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Good to Know
              </h2>
              <div style={styles.infoGrid}>

                <div style={styles.infoItem}>
                  <div style={styles.infoIconWrapper}>
                    <MapPin
                      size={16}
                      color="var(--color-forest-green)"
                    />
                  </div>
                  <div>
                    <span style={styles.infoLabel}>
                      Meeting Point
                    </span>
                    <span style={styles.infoValue}>
                      {tour.meetingPoint}
                    </span>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoIconWrapper}>
                    <ShieldCheck
                      size={16}
                      color="var(--color-forest-green)"
                    />
                  </div>
                  <div>
                    <span style={styles.infoLabel}>
                      Cancellation
                    </span>
                    <span style={styles.infoValue}>
                      Free cancellation up to 24 hours before
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN — Desktop Booking Card ──────── */}
          {!isMobile && (
            <div style={{
              position: 'sticky',
              top: '88px',
              alignSelf: 'start',
            }}>
              {/* Price display above the card */}
              <div style={styles.desktopPriceRow}>
                <span style={styles.desktopPrice}>
                  €{tour.price}
                </span>
                <span style={styles.desktopPerPerson}>
                  per person
                </span>
              </div>
              {bookingForm}
            </div>
          )}

        </div>
      </div>

      {/* ── MOBILE BOTTOM BAR ────────────────────────────
          Fixed bar at the bottom of the screen on mobile.
          Shows price and a "Choose a Date" button.
          Tapping opens the booking drawer from below.
          The 100px bottom padding on contentCard ensures
          the last content section isn't hidden behind this bar. */}
      {isMobile && (
        <div style={styles.mobileBottomBar}>
          <div style={styles.mobileBottomBarLeft}>
            <span style={styles.mobilePrice}>€{tour.price}</span>
            <span style={styles.mobilePricePer}>per person</span>
          </div>
          <button
            style={styles.mobileBookBtn}
            onClick={() => setDrawerOpen(true)}
          >
            Choose a Date
          </button>
        </div>
      )}

      {/* ── MOBILE BOOKING DRAWER ────────────────────────
          Slides up from the bottom when the visitor taps
          "Choose a Date". A dark overlay covers the page
          behind it — tapping the overlay closes the drawer.
          The drawer itself slides up via CSS transform
          controlled by the drawerOpen state. */}
      {isMobile && (
        <>
          {/* Overlay — dark background behind the drawer */}
          <div
            style={{
              ...styles.drawerOverlay,
              opacity: drawerOpen ? 1 : 0,
              pointerEvents: drawerOpen ? 'all' : 'none',
            }}
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer — slides up from bottom */}
          <div style={{
            ...styles.drawer,
            transform: drawerOpen
              ? 'translateY(0)'
              : 'translateY(100%)',
          }}>

            {/* Drawer handle and close button */}
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

            {/* Scrollable drawer content */}
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
    backgroundColor: 'var(--color-n100)',
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
    marginBottom: '12px',
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

  ratingDot: {
    color: 'var(--color-n300)',
  },

  ratingMeta: {
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
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
    border: '1px solid var(--color-n300)',
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

  // Highlights — styled numbered steps
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

  // Numbered circle — Forest Green filled circle
  // with white number inside. Consistent with the
  // How It Works section design language.
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

  // Highlight title — the location or landmark name
  highlightTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    lineHeight: '1.3',
  },

  // Highlight subtext — the description after the dash
  highlightSubtext: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    lineHeight: '1.5',
  },

  // Inclusions
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

  // FAQ
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

  // Good to Know
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

  // Desktop booking card
  desktopPriceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    marginBottom: '12px',
    paddingLeft: '4px',
  },

  desktopPrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '36px',
    color: 'var(--color-forest-green)',
  },

  desktopPerPerson: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  bookingCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '1px solid var(--color-n300)',
  },

  // Tour type toggle
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

  input: {
    height: 'var(--touch-target)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '0 12px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
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
  },

  cancellationRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },

  freeCancellation: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-success)',
    margin: 0,
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

  // Mobile bottom bar
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

  // Drawer overlay
  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    transition: 'opacity 0.3s ease',
  },

  // Drawer — slides up from bottom.
  // Max height 85vh so it never fully covers the screen —
  // the visitor can always see the page behind it
  // and knows they can dismiss it.
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

  // Visual handle at top of drawer —
  // the universal mobile drawer affordance.
  // Tells visitors they can swipe down to dismiss.
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

export default TourDetail