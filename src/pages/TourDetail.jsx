// TourDetail.jsx
// This single page handles ALL of your individual tour pages.
// It reads the tour ID from the URL, finds the matching tour
// in the data array, and renders that tour's full details.
// One page component — six different tours.

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'

// useParams is a React Router hook — a hook is a special function
// that gives your component access to something it couldn't otherwise reach.
// useParams specifically reaches into the current URL and pulls out
// the named parameters — in our case, the "id" from /tours/:id.
// Think of it like asking React Router: "hey, what's in that URL slot?"

// This is the same tour data from Tours.jsx.
// In a later step we'll move this to a shared file so you
// don't maintain it in two places — a principle called DRY:
// Don't Repeat Yourself. For now, keeping it here gets us moving.
import tours from '../data/tours'

function TourDetail() {
  const { id } = useParams()
  const tour = tours.find((t) => t.id === Number(id))

  // ── REACT STATE ──────────────────────────────────────────────────
  // Each useState call declares one piece of information React should
  // remember and watch. The first value is the current state, the second
  // is the function you call to update it.
  //
  // Think of it like this:
  // [currentValue, functionToChangeTheValue] = useState(startingValue)
  //
  // The moment you call the update function with a new value,
  // React redraws every part of the UI that uses that value.
  // That's how the total price updates instantly when you change
  // the number of people — no page reload, no manual DOM manipulation.

  const [selectedDate, setSelectedDate] = useState('')
  const [numPeople, setNumPeople] = useState(1)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')

  // These three states manage the submission process itself —
  // giving the visitor feedback while their request is being sent.
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  // This derived value recalculates automatically every time
  // numPeople changes — no extra code needed, it just works
  // because React rerenders the component when state changes.
  const totalPrice = tour ? tour.price * numPeople : 0

  if (!tour) {
    return (
      <div style={styles.notFound}>
        <h2>Tour not found</h2>
        <Link to="/tours" style={styles.backLink}>← Back to all tours</Link>
      </div>
    )
  }

  // ── EMAIL HANDLER ─────────────────────────────────────────────────
  // This function runs when the visitor clicks Book Now.
  // It validates that the required fields are filled,
  // then sends the booking data to EmailJS which forwards
  // a formatted email to your inbox.
  const handleBooking = () => {

    // Basic validation — make sure the essential fields are filled
    // before attempting to send. In a production app you'd give
    // more specific feedback per field, but this is clean and clear
    // for a pre-launch operation.
    if (!selectedDate || !guestName || !guestEmail) {
      alert('Please fill in your name, email, and select a date.')
      return
    }

    // Tell React we're in the sending state so the button
    // can show a loading message and disable itself.
    setIsSending(true)
    setIsError(false)

    // This object maps your booking data to the placeholder names
    // you set up in your EmailJS template.
    // {{tour_name}} in the template becomes tour.title here.
    // The names must match exactly — EmailJS is case-sensitive.
    const templateParams = {
      tour_name: tour.title,
      tour_date: selectedDate,
      num_people: numPeople,
      total_price: totalPrice,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone || 'Not provided',
    }

    // Replace these three strings with your actual IDs from EmailJS.
    // We'll do this together once you have your EmailJS account set up.
   emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  templateParams,
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
)
    .then(() => {
      // Success — show the confirmation message
      setIsSending(false)
      setIsSuccess(true)
    })
    .catch(() => {
      // Something went wrong — show the error message
      setIsSending(false)
      setIsError(true)
    })
  }

  return (
    <div>

      <div style={styles.photoBanner}>
        {tour.badge && (
          <span style={styles.badge}>{tour.badge}</span>
        )}
      </div>

      <div style={styles.contentWrapper}>
        <div style={styles.contentGrid}>

          {/* ── LEFT COLUMN — unchanged from before ────── */}
          <div style={styles.leftColumn}>
            <div style={styles.breadcrumb}>
              <Link to="/tours" style={styles.breadcrumbLink}>← All Tours</Link>
            </div>

            <h1 style={styles.tourTitle}>{tour.title}</h1>

            <div style={styles.ratingRow}>
              <span style={styles.star}>★</span>
              <span style={styles.ratingNumber}>{tour.rating}</span>
              <span style={styles.ratingCount}>({tour.reviews} reviews)</span>
              <span style={styles.dot}>·</span>
              <span style={styles.meta}>⏱ {tour.duration}</span>
              <span style={styles.dot}>·</span>
              <span style={styles.meta}>👥 Max {tour.groupSize} people</span>
            </div>

            <p style={styles.description}>{tour.description}</p>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>What's Included</h2>
              <div style={styles.includesList}>
                {tour.includes.map((item, index) => (
                  <div key={index} style={styles.includeItem}>
                    <span style={styles.checkmark}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Tour Highlights</h2>
              <ul style={styles.highlightsList}>
                {tour.highlights.map((highlight, index) => (
                  <li key={index} style={styles.highlightItem}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Meeting Point</h2>
              <p style={styles.meetingPoint}>📍 {tour.meetingPoint}</p>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Booking Card ────────────── */}
          <div style={styles.rightColumn}>
            <div style={styles.bookingCard}>

              {/* If the booking was sent successfully, replace the
                  entire form with a confirmation message.
                  This pattern — conditionally rendering different UI
                  based on state — is one of the most common patterns
                  in React. The ternary operator works like:
                  condition ? "show this if true" : "show this if false" */}
              {isSuccess ? (

                <div style={styles.successMessage}>
                  <span style={styles.successIcon}>✓</span>
                  <h3 style={styles.successTitle}>Request Received!</h3>
                  <p style={styles.successText}>
                    Thanks {guestName}. Your booking request for the{' '}
                    <strong>{tour.title}</strong> on {selectedDate} for{' '}
                    {numPeople} {numPeople === 1 ? 'person' : 'people'} has
                    been received. You'll hear back within 24 hours.
                  </p>
                </div>

              ) : (

                <>
                  <div style={styles.priceRow}>
                    <span style={styles.price}>€{tour.price}</span>
                    <span style={styles.perPerson}>per person</span>
                  </div>

                  <div style={styles.divider} />

                  {/* Guest details — new fields we're adding */}
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

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Number of People</label>
                    <select
                      style={styles.input}
                      value={numPeople}
                      onChange={(e) => setNumPeople(Number(e.target.value))}
                    >
                      {Array.from({ length: tour.groupSize }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'person' : 'people'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Total price — this updates live as numPeople changes
                      because totalPrice is derived from state.
                      React rerenders this number automatically. */}
                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Total</span>
                    <span style={styles.totalPrice}>€{totalPrice}</span>
                  </div>

                  <button
                    style={{
                      ...styles.bookBtn,
                      // Visually dim the button while sending
                      opacity: isSending ? 0.7 : 1,
                      cursor: isSending ? 'not-allowed' : 'pointer',
                    }}
                    onClick={handleBooking}
                    disabled={isSending}
                  >
                    {isSending ? 'Sending Request...' : `Request to Book — €${totalPrice}`}
                  </button>

                  {/* Error state — only shown if EmailJS call failed */}
                  {isError && (
                    <p style={styles.errorMessage}>
                      Something went wrong. Please try again or email us directly.
                    </p>
                  )}

                  <p style={styles.freeCancellation}>
                    ✓ Free cancellation available
                  </p>
                </>

              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  )

  if (!tour) {
    return (
      <div style={styles.notFound}>
        <h2>Tour not found</h2>
        <Link to="/tours" style={styles.backLink}>← Back to all tours</Link>
      </div>
    )
  }

  return (
    <div>

      {/* ── PHOTO PLACEHOLDER ─────────────────────────────
          This green banner represents your hero photo area.
          We'll replace it with a real image in a later step.
          The height gives it the visual weight a hero photo needs. */}
<div style={styles.photoBanner}>
  {tour.hero ? (
    <img
      src={tour.hero}
      alt={tour.title}
      style={styles.heroPho}
    />
  ) : (
    <div style={styles.photoFallback} />
  )}
  {tour.badge && (
    <span style={styles.badge}>{tour.badge}</span>
  )}
</div>

      {/* ── MAIN CONTENT ──────────────────────────────────
          Two-column layout: tour details on the left,
          booking widget on the right.
          This is the standard layout for every major booking site —
          GetYourGuide, Airbnb Experiences, Viator all use this pattern
          because it keeps the booking action always visible
          while the visitor reads the details. */}
      <div style={styles.contentWrapper}>
        <div style={styles.contentGrid}>

          {/* ── LEFT COLUMN — Tour Details ─────────────── */}
          <div style={styles.leftColumn}>

            {/* Breadcrumb navigation — tells visitors where they are
                and gives them a one-click path back to the tours list */}
            <div style={styles.breadcrumb}>
              <Link to="/tours" style={styles.breadcrumbLink}>← All Tours</Link>
            </div>

            {/* Tour title and rating */}
            <h1 style={styles.tourTitle}>{tour.title}</h1>

            <div style={styles.ratingRow}>
              <span style={styles.star}>★</span>
              <span style={styles.ratingNumber}>{tour.rating}</span>
              <span style={styles.ratingCount}>({tour.reviews} reviews)</span>
              <span style={styles.dot}>·</span>
              <span style={styles.meta}>⏱ {tour.duration}</span>
              <span style={styles.dot}>·</span>
              <span style={styles.meta}>👥 Max {tour.groupSize} people</span>
            </div>

            {/* Tour description */}
            <p style={styles.description}>{tour.description}</p>

            {/* What's included */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>What's Included</h2>
              <div style={styles.includesList}>
                {tour.includes.map((item, index) => (
                  <div key={index} style={styles.includeItem}>
                    <span style={styles.checkmark}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tour highlights */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Tour Highlights</h2>
              <ul style={styles.highlightsList}>
                {tour.highlights.map((highlight, index) => (
                  <li key={index} style={styles.highlightItem}>{highlight}</li>
                ))}
              </ul>
            </div>

            {/* Meeting point */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Meeting Point</h2>
              <p style={styles.meetingPoint}>📍 {tour.meetingPoint}</p>
            </div>

          </div>

          {/* ── RIGHT COLUMN — Booking Widget ──────────── */}
          <div style={styles.rightColumn}>
            <div style={styles.bookingCard}>

              {/* Price display */}
              <div style={styles.priceRow}>
                <span style={styles.price}>€{tour.price}</span>
                <span style={styles.perPerson}>per person</span>
              </div>

              <div style={styles.divider} />

              {/* Booking form — date picker and group size.
                  This is a placeholder UI for now.
                  In the next step we'll replace the date input
                  with a proper booking calendar integration. */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Date</label>
                <input
                  type="date"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Number of People</label>
                <select style={styles.input}>
                  {/* Generates options 1 through groupSize dynamically */}
                  {Array.from({ length: tour.groupSize }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>

              {/* Total price calculation — updates based on group size.
                  We'll make this dynamic with React state in the next step. */}
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalPrice}>€{tour.price}</span>
              </div>

              {/* Primary CTA — the most important button on the page */}
              <button style={styles.bookBtn}>
                Book Now — €{tour.price}
              </button>

              <p style={styles.freeCancellation}>
                ✓ Free cancellation available
              </p>

            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

const styles = {
  notFound: {
    padding: '80px 40px',
    textAlign: 'center',
  },

  backLink: {
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
    fontFamily: 'var(--font-body)',
  },

photoBanner: {
    width: '100%',
    height: '420px',
    position: 'relative',
    overflow: 'hidden',
  },

  heroPho: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  photoFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-mid-green)',
  },

  badge: {
    position: 'absolute',
    top: '24px',
    left: '40px',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '6px 12px',
    borderRadius: '4px',
  },

  contentWrapper: {
    backgroundColor: 'var(--color-n100)',
    padding: '48px 40px 80px 40px',
  },

  // Two-column grid: left column takes up more space for content,
  // right column is fixed-width for the booking card.
  // 1fr means "take up one fraction of available space."
  // 380px is a fixed width chosen to fit the booking card comfortably.
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '48px',
    maxWidth: '1100px',
    margin: '0 auto',
    alignItems: 'start',  // Keeps both columns aligned to the top
  },

  leftColumn: {
    minWidth: 0,  // Prevents text from overflowing the grid column
  },

  breadcrumb: {
    marginBottom: '20px',
  },

  breadcrumbLink: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
    fontWeight: '500',
  },

  tourTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h1)',
    color: 'var(--color-n900)',
    marginBottom: '16px',
    lineHeight: 'var(--leading-h1)',
  },

  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },

  star: {
    color: 'var(--color-amber)',
    fontSize: '16px',
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

  dot: {
    color: 'var(--color-n300)',
  },

  meta: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
  },

  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    marginBottom: '40px',
  },

  section: {
    marginBottom: '40px',
  },

  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '16px',
  },

  includesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  includeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
  },

  checkmark: {
    color: 'var(--color-success)',
    fontWeight: '700',
    fontSize: '16px',
  },

  highlightsList: {
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  highlightItem: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
  },

  meetingPoint: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
  },

  // The booking card is sticky — it stays visible on screen
  // as the visitor scrolls through the tour details on the left.
  // This is critical for conversion: the Book Now button should
  // always be one click away, never requiring a scroll back up.
  rightColumn: {
    position: 'sticky',
    top: '88px',    // Clears the navbar height so it doesn't overlap
  },

  bookingCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    border: '1px solid var(--color-n300)',
  },

  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '20px',
  },

  price: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-display)',
    color: 'var(--color-forest-green)',
  },

  perPerson: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
  },

  divider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    marginBottom: '20px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },

  label: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },

  // Input styling matches your design system exactly:
  // 44px height, 8px border radius, 1.5px border.
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
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    marginBottom: '16px',
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

  // Full-width Amber booking button — your highest-priority CTA.
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
    cursor: 'pointer',
    marginBottom: '12px',
  },

  freeCancellation: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-success)',
    textAlign: 'center',
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

  errorMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-error)',
    textAlign: 'center',
    marginTop: '8px',
  },
}

export default TourDetail