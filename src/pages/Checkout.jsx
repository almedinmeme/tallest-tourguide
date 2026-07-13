// Checkout.jsx
// A dedicated, distraction-free booking + payment screen (App.jsx strips the
// site navbar/footer for /checkout). The user lands here after pressing
// "Continue to Checkout" on a tour or package; the selection arrives via
// React Router location.state.
//
// Here the customer enters their contact details and chooses how to pay:
//   • Pay by card  → the (placeholder) card form, with a 5% incentive discount.
//                    The Pay button calls processCardPayment() — the single
//                    seam to replace with a real gateway later.
//   • Reserve & pay later → the frictionless flow, full price.
//
// Both paths funnel through submitBooking() (Airtable save + emails).
//
// Conversion furniture: on mobile the trip summary sits above the form (you
// see what you're paying for before you're asked to pay), a sticky total bar
// mirrors the pay button while it's off screen, and the real cancellation
// policy is stated next to the CTA — sourced from src/data/policy.js so it
// always matches /booking-conditions (day tours: 24h free cancellation;
// packages: full refund >30 days out).
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useLocation } from 'react-router-dom'
import {
  Lock, ShieldCheck, CheckCircle, ArrowLeft, ChevronDown,
  Mail, Star, Users, Check, MessageCircle,
} from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'
import useInView from '../hooks/useInView'
import Button from '../components/Button'
import {
  submitBooking,
  processCardPayment,
  applyCardDiscount,
} from '../utils/booking'
import {
  CANCEL_LINE_TOUR,
  CANCEL_LINE_PACKAGE,
  DEPOSIT_PERCENT,
  BALANCE_DUE_DAYS,
} from '../data/policy'

// Checkout is a transactional flow — keep it out of search results.
const NoIndexMeta = () => (
  <Helmet>
    <meta name="robots" content="noindex" />
  </Helmet>
)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
import { WHATSAPP_URL, CONTACT_EMAIL } from '../data/settings'

// Cosmetic card-field formatting — digits only, grouped like a real card.
const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d
}
const formatCvc = (v) => v.replace(/\D/g, '').slice(0, 4)

function Checkout() {
  const location = useLocation()
  const booking = location.state?.booking
  const isMobile = useWindowWidth() <= 768

  // Contact details (collected here now, not on the detail page).
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [discount, setDiscount] = useState('')
  const [showReferral, setShowReferral] = useState(false)
  const [errors, setErrors] = useState({})

  // Optional add-ons chosen here (indices into booking.availableExtras).
  const [selectedExtras, setSelectedExtras] = useState([])

  // Payment method: default to card so the payment UI is shown immediately.
  const [method, setMethod] = useState('card')

  // Placeholder card fields (cosmetic for now).
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  const [isSending, setIsSending] = useState(false)
  const [isError, setIsError] = useState(false)
  const [done, setDone] = useState(null) // null | 'card' | 'reserve'

  // Mobile-only UI state: expandable top summary + sticky total bar.
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [payRef, payInView] = useInView('-20px')

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Secure checkout · Tallest Tour Guide'
  }, [])

  const summary = booking?.summary
  const isQuote = booking?.isQuote
  // Base = the tour/package price before any optional add-ons.
  const base = summary?.total ?? 0
  // Optional add-ons the guest can toggle here; each carries a pre-computed amount.
  const availableExtras = booking?.availableExtras || []
  const selectedExtraItems = selectedExtras.map((i) => availableExtras[i]).filter(Boolean)
  const extrasTotal = selectedExtraItems.reduce((s, ex) => s + (ex.amount || 0), 0)
  const total = base + extrasTotal
  const discounted = useMemo(() => applyCardDiscount(total), [total])
  const saving = total - discounted
  // Card discount only applies to a real priced total (not private-tour quotes).
  const payingByCard = method === 'card' && !isQuote
  const dueNow = payingByCard ? discounted : total

  const toggleExtra = (i) =>
    setSelectedExtras((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))

  const clearError = (key) => setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))

  // No booking in state (direct visit / refresh) — send them back.
  if (!booking) return <Navigate to="/tours" replace />

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Please enter your name'
    if (!email.trim()) e.email = 'Please enter your email'
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Please enter a valid email'
    if (payingByCard) {
      if (!cardName.trim()) e.cardName = 'Please enter the name on the card'
      const digits = cardNumber.replace(/\D/g, '')
      if (digits.length < 13) e.cardNumber = 'Please enter a valid card number'
      const exp = cardExpiry.replace(/\D/g, '')
      if (exp.length !== 4 || Number(exp.slice(0, 2)) < 1 || Number(exp.slice(0, 2)) > 12) e.cardExpiry = 'Use MM / YY'
      if (cardCvc.replace(/\D/g, '').length < 3) e.cardCvc = '3–4 digits'
    }
    setErrors(e)
    return e
  }

  function complete(payMethod) {
    if (isSending) return
    const e = validate()
    if (Object.keys(e).some((k) => e[k])) {
      // Contact fields live at the top of the page; card errors are already
      // next to the button, so only scroll when the top fields are wrong.
      if (e.name || e.email) window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setIsSending(true)
    setIsError(false)

    const guestTemplate = {
      guest_name: name.trim(),
      guest_email: email.trim(),
      guest_phone: phone.trim() || 'Not provided',
      discount_code: discount.trim() || 'None',
    }
    const guestAirtable = {
      GuestName: name.trim(),
      GuestEmail: email.trim(),
      GuestPhone: phone.trim(),
      DiscountCode: discount.trim(),
    }

    const isCard = payMethod === 'card'
    const payTotal = isCard ? discounted : total
    const extrasSummary = selectedExtraItems.length
      ? selectedExtraItems.map((e) => `${e.label} (+€${e.amount})`).join(', ')
      : 'None'

    const payload = {
      airtableFields: {
        ...booking.airtableFields,
        ...guestAirtable,
        ...(isQuote ? {} : { TotalPrice: payTotal }),
      },
      templateParams: {
        ...booking.templateParams,
        ...guestTemplate,
        extras: extrasSummary,
        ...(isQuote ? {} : { total_price: `€${payTotal}` }),
        payment_method: isCard
          ? 'Card — 5% discount (payment to follow)'
          : isQuote ? 'Quote requested' : 'Reserve & pay later',
      },
      analytics: booking.analytics
        ? { ...booking.analytics, value: isQuote ? 0 : payTotal }
        : null,
    }

    const gate = payMethod === 'card' ? processCardPayment() : Promise.resolve()
    gate
      .then(() => submitBooking(payload))
      .then(() => {
        setIsSending(false)
        setDone(payMethod)
        window.scrollTo(0, 0)
      })
      .catch(() => {
        setIsSending(false)
        setIsError(true)
      })
  }

  // ---- Success screen -----------------------------------------------------
  if (done) {
    return (
      <div style={styles.page}>
        <NoIndexMeta />
        <TopBar />
        <main style={styles.successWrap}>
          <div style={styles.successCard}>
            <span style={styles.successIcon}>
              <CheckCircle size={46} color="var(--color-forest-green)" strokeWidth={1.6} />
            </span>
            <h1 style={styles.successTitle}>
              {done === 'card' ? 'Your place is reserved' : isQuote ? 'Request received' : 'Your place is reserved'}
            </h1>
            <p style={styles.successLead}>
              Thank you, {name.trim()}. Your booking for <strong>{booking.title}</strong>
              {summary?.date ? <> on {summary.date}</> : null} is confirmed in our system.
            </p>
            <p style={styles.successNote}>
              {done === 'card' ? (
                <>Online card payment isn't live yet, so nothing was charged. We've held
                your place at the discounted total of <strong>€{discounted}</strong> and
                will email <strong>{email.trim()}</strong> to take payment securely before
                your trip.</>
              ) : (
                <>We've emailed a confirmation to <strong>{email.trim()}</strong> and will be
                in touch shortly to finalise the details{isQuote ? ' and send your tailored quote' : ''}.</>
              )}
            </p>
            <Button to="/tours" variant="secondary">
              Explore more tours
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Shared summary fragments — used by the desktop side panel and the
  // collapsible mobile summary so the two never drift apart.
  const summaryRows = (
    <dl style={styles.summaryList}>
      {summary?.date && <Row label="Date" value={summary.date} />}
      {summary?.startTime && <Row label="Start time" value={summary.startTime} />}
      {summary?.tourType && <Row label="Type" value={summary.tourType} />}
      {summary?.accommodation && <Row label="Accommodation" value={summary.accommodation} />}
      {summary?.language && <Row label="Language" value={summary.language} />}
      {summary?.numPeople != null && (
        <Row label="Travellers" value={`${summary.numPeople} ${summary.numPeople === 1 ? 'person' : 'people'}`} />
      )}
    </dl>
  )

  const priceBlock = (
    <div style={styles.priceBlock}>
      {isQuote ? (
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total</span>
          <span style={styles.totalValue}>Quote on request</span>
        </div>
      ) : (
        <>
          {summary?.unitPrice != null && summary?.numPeople != null && (
            <div style={styles.priceRow}>
              <span style={styles.priceMuted}>€{summary.unitPrice} × {summary.numPeople}</span>
              <span style={styles.priceMuted}>€{base}</span>
            </div>
          )}
          {selectedExtraItems.map((ex, i) => (
            <div key={i} style={styles.priceRow}>
              <span style={styles.priceMuted}>{ex.label}</span>
              <span style={styles.priceMuted}>+€{ex.amount}</span>
            </div>
          ))}
          {payingByCard && saving > 0 && (
            <div style={styles.priceRow}>
              <span style={styles.discountText}>Card discount (−5%)</span>
              <span style={styles.discountText}>−€{saving}</span>
            </div>
          )}
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>{payingByCard ? 'Pay today' : 'Total'}</span>
            <span style={styles.totalValue}>€{dueNow}</span>
          </div>
        </>
      )}
    </div>
  )

  const mobileMeta = [
    summary?.date,
    summary?.numPeople != null
      ? `${summary.numPeople} ${summary.numPeople === 1 ? 'person' : 'people'}`
      : null,
  ].filter(Boolean).join(' · ')

  // ---- Checkout screen ----------------------------------------------------
  return (
    <div style={styles.page}>
      <NoIndexMeta />
      <TopBar />

      <main style={{ ...styles.main, padding: isMobile ? '18px 16px 110px' : '28px 32px 96px' }}>
        <Link to={booking.backLink || '/tours'} style={styles.backLink} className="checkout-back">
          <ArrowLeft size={16} /> {booking.backLabel || 'Back'}
        </Link>

        {/* Mobile: the trip you're buying, before any form asks for anything */}
        {isMobile && (
          <section style={styles.mobileSummary} aria-label="Your trip">
            <div style={styles.mobileSummaryHead}>
              <div style={{ minWidth: 0 }}>
                <span style={styles.summaryEyebrow}>Your trip</span>
                <h2 style={styles.mobileSummaryTitle}>{booking.title}</h2>
                {mobileMeta && <span style={styles.mobileMeta}>{mobileMeta}</span>}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={styles.mobileTotalLabel}>{payingByCard && !isQuote ? 'Pay today' : 'Total'}</span>
                <span style={styles.mobileTotal}>{isQuote ? 'On request' : `€${dueNow}`}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSummaryOpen((o) => !o)}
              style={styles.summaryToggle}
              aria-expanded={summaryOpen}
            >
              {summaryOpen ? 'Hide details' : 'View details'}
              <ChevronDown size={15} style={{ transition: 'transform 0.2s', transform: summaryOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            {summaryOpen && (
              <div style={{ marginTop: 6 }}>
                {summaryRows}
                {priceBlock}
              </div>
            )}
          </section>
        )}

        <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 360px', gap: isMobile ? '28px' : '56px' }}>
          {/* ── Left: details + payment ── */}
          <div style={styles.formCol}>
            <header style={styles.head}>
              <h1 style={styles.h1}>Complete your booking</h1>
              <p style={styles.sub}>
                You're moments away. Enter your details and choose how you'd like to pay.
              </p>
            </header>

            {/* Your details */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Your details</div>

              <div style={{ ...styles.detailsGrid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                <Field label="Full name" error={errors.name}>
                  <input
                    className="booking-input"
                    style={inputStyle(errors.name)}
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearError('name') }}
                    placeholder="e.g. Amila Hodžić"
                    autoComplete="name"
                  />
                </Field>

                <Field label="Email address" error={errors.email}>
                  <input
                    className="booking-input"
                    style={inputStyle(errors.email)}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError('email') }}
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                  />
                </Field>

                <Field label="Phone" hint="optional">
                  <input
                    className="booking-input"
                    style={inputStyle()}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+387 ..."
                    type="tel"
                    autoComplete="tel"
                  />
                </Field>

                {(showReferral || discount) && (
                  <Field label="Referral code" hint="optional">
                    <input
                      className="booking-input"
                      style={inputStyle()}
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="e.g. HOTEL123"
                      autoFocus={showReferral}
                    />
                  </Field>
                )}
              </div>

              {/* Kept behind a link so the field doesn't send everyone off
                  hunting for a code they don't have. */}
              {!showReferral && !discount && (
                <button type="button" onClick={() => setShowReferral(true)} style={styles.referralToggle}>
                  Have a referral code?
                </button>
              )}
            </div>

            <div style={styles.divider} />

            {/* Optional add-ons */}
            {!isQuote && availableExtras.length > 0 && (
              <>
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Add to your experience</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {availableExtras.map((ex, i) => {
                      const checked = selectedExtras.includes(i)
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleExtra(i)}
                          style={{
                            ...styles.option,
                            borderColor: checked ? 'var(--color-forest-green)' : 'var(--color-n300)',
                            backgroundColor: checked ? 'rgba(46,125,94,0.05)' : 'var(--color-n000)',
                          }}
                        >
                          <span style={{
                            ...styles.checkbox,
                            borderColor: checked ? 'var(--color-forest-green)' : 'var(--color-n400)',
                            backgroundColor: checked ? 'var(--color-forest-green)' : 'var(--color-n000)',
                          }}>
                            {checked && <Check size={13} color="var(--color-n000)" strokeWidth={3} />}
                          </span>
                          <span style={styles.optionBody}>
                            <span style={styles.optionTitleRow}>
                              <span style={styles.optionTitle}>{ex.label}</span>
                              <span style={styles.addonPrice}>+€{ex.amount}</span>
                            </span>
                            {ex.description && <span style={styles.optionSub}>{ex.description}</span>}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div style={styles.divider} />
              </>
            )}

            {/* Payment */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Payment</div>

              {isQuote ? (
                <p style={styles.quoteNote}>
                  Private tours are priced individually. Send your request and we'll reply
                  with a tailored quote within 24 hours — no payment is taken now.
                </p>
              ) : (
                <>
                  <div style={{ ...styles.options, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                    <PayOption
                      active={method === 'card'}
                      onSelect={() => setMethod('card')}
                      title="Pay by card"
                      subtitle="Pay securely now and save 5%."
                      badge={`Save 5% · €${discounted}`}
                    />
                    <PayOption
                      active={method === 'reserve'}
                      onSelect={() => setMethod('reserve')}
                      title="Reserve & pay later"
                      subtitle="Hold your place now at full price — pay before your trip."
                    />
                  </div>

                  {method === 'card' && (
                    <div style={styles.cardFields}>
                      <Field label="Cardholder name" error={errors.cardName}>
                        <input className="booking-input" style={inputStyle(errors.cardName)} value={cardName}
                          onChange={(e) => { setCardName(e.target.value); clearError('cardName') }}
                          placeholder="Name on card" autoComplete="cc-name" />
                      </Field>
                      <Field label="Card number" error={errors.cardNumber}>
                        <input className="booking-input" style={inputStyle(errors.cardNumber)} value={cardNumber}
                          onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); clearError('cardNumber') }}
                          placeholder="1234 5678 9012 3456" inputMode="numeric" autoComplete="cc-number" />
                      </Field>
                      <div style={styles.cardRow}>
                        <Field label="Expiry" error={errors.cardExpiry}>
                          <input className="booking-input" style={inputStyle(errors.cardExpiry)} value={cardExpiry}
                            onChange={(e) => { setCardExpiry(formatExpiry(e.target.value)); clearError('cardExpiry') }}
                            placeholder="MM / YY" inputMode="numeric" autoComplete="cc-exp" />
                        </Field>
                        <Field label="CVC" error={errors.cardCvc}>
                          <input className="booking-input" style={inputStyle(errors.cardCvc)} value={cardCvc}
                            onChange={(e) => { setCardCvc(formatCvc(e.target.value)); clearError('cardCvc') }}
                            placeholder="123" inputMode="numeric" autoComplete="cc-csc" />
                        </Field>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div ref={payRef}>
                <Button
                  variant="primary"
                  size="lg"
                  full
                  style={{ marginTop: 20 }}
                  onClick={() => complete(isQuote ? 'reserve' : method)}
                  disabled={isSending}
                >
                  {isSending
                    ? (payingByCard ? 'Processing…' : 'Reserving…')
                    : isQuote
                      ? 'Request booking'
                      : payingByCard
                        ? `Pay €${discounted}`
                        : `Reserve now — pay €${total} later`}
                </Button>
              </div>

              <p style={styles.secureLine}>
                <Lock size={13} style={{ verticalAlign: '-2px', marginRight: 6 }} />
                {isQuote
                  ? 'No payment is taken now.'
                  : payingByCard
                    ? 'Nothing is charged today — we confirm your booking, then take payment securely. Card details are never stored.'
                    : 'No payment is taken now — pay any time before your trip.'}
              </p>
              {!isQuote && (
                <p style={styles.cancelLine}>
                  {booking.kind === 'package' ? CANCEL_LINE_PACKAGE : CANCEL_LINE_TOUR}{' '}
                  <Link to="/booking-conditions" style={styles.cancelLink}>Booking conditions</Link>
                </p>
              )}

              {isError && (
                <p style={styles.errorBanner}>
                  Something went wrong. Please try again, or email us at
                  {CONTACT_EMAIL}.
                </p>
              )}
            </div>
          </div>

          {/* ── Right: order summary + trust ── */}
          <aside style={styles.summaryCol}>
            {!isMobile && (
              <div style={styles.summaryPanel}>
                <span style={styles.summaryEyebrow}>Your trip</span>
                <h3 style={styles.summaryTitle}>{booking.title}</h3>
                {summaryRows}
                {priceBlock}
                {booking.deposit && !isQuote && (
                  <p style={styles.depositNote}>
                    A {DEPOSIT_PERCENT}% deposit secures your place; the balance is due{' '}
                    {BALANCE_DUE_DAYS} days before departure.
                  </p>
                )}
              </div>
            )}

            <ul style={styles.trustList}>
              <Trust icon={<ShieldCheck size={17} color="var(--color-forest-green)" strokeWidth={1.8} />}>
                Secure, encrypted checkout
              </Trust>
              <Trust icon={<Mail size={17} color="var(--color-forest-green)" strokeWidth={1.8} />}>
                Instant booking confirmation by email
              </Trust>
              {booking.rating ? (
                <Trust icon={<Star size={17} color="var(--color-forest-green)" strokeWidth={1.8} />}>
                  Rated {booking.rating}{booking.reviews ? ` · ${booking.reviews} reviews` : ''}
                </Trust>
              ) : null}
              <Trust icon={<Users size={17} color="var(--color-forest-green)" strokeWidth={1.8} />}>
                Real local guides, small groups
              </Trust>
            </ul>

            {/* The human escape hatch — unanswered questions stall payments */}
            <p style={styles.helpLine}>
              <MessageCircle size={17} color="var(--color-forest-green)" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                Question before you book?{' '}
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={styles.helpLink}>WhatsApp us</a>
                {' '}— quick answers from the guide.
              </span>
            </p>
          </aside>
        </div>
      </main>

      {/* Sticky mobile total bar — mirrors the pay button while it's off screen */}
      {isMobile && !payInView && (
        <div style={styles.stickyBar}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={styles.stickyLabel}>{payingByCard && !isQuote ? 'Pay today' : 'Total'}</span>
            <span style={styles.stickyTotal}>{isQuote ? 'On request' : `€${dueNow}`}</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => complete(isQuote ? 'reserve' : method)}
            disabled={isSending}
          >
            {isSending
              ? 'Working…'
              : isQuote ? 'Request booking' : payingByCard ? `Pay €${discounted}` : 'Reserve now'}
          </Button>
        </div>
      )}
    </div>
  )
}

/* ---- small presentational helpers ---- */

function Field({ label, hint, error, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
        {hint && <span style={styles.hint}> · {hint}</span>}
      </label>
      {children}
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  )
}

function PayOption({ active, onSelect, title, subtitle, badge }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        ...styles.option,
        borderColor: active ? 'var(--color-forest-green)' : 'var(--color-n300)',
        backgroundColor: active ? 'rgba(46,125,94,0.05)' : 'var(--color-n000)',
        boxShadow: active ? '0 0 0 1px var(--color-forest-green)' : 'none',
      }}
    >
      <span style={{
        ...styles.radio,
        borderColor: active ? 'var(--color-forest-green)' : 'var(--color-n400)',
        backgroundColor: active ? 'var(--color-forest-green)' : 'var(--color-n000)',
      }}>
        {active && <Check size={13} color="var(--color-n000)" strokeWidth={3} />}
      </span>
      <span style={styles.optionBody}>
        <span style={styles.optionTitleRow}>
          <span style={styles.optionTitle}>{title}</span>
          {badge && <span style={styles.badge}>{badge}</span>}
        </span>
        <span style={styles.optionSub}>{subtitle}</span>
      </span>
    </button>
  )
}

function Row({ label, value }) {
  return (
    <div style={styles.row}>
      <dt style={styles.rowLabel}>{label}</dt>
      <dd style={styles.rowValue}>{value}</dd>
    </div>
  )
}

function Trust({ icon, children }) {
  return (
    <li style={styles.trustItem}>
      <span style={{ flexShrink: 0, marginTop: '1px', display: 'inline-flex' }}>{icon}</span>
      <span>{children}</span>
    </li>
  )
}

function TopBar() {
  return (
    <header style={styles.topBar}>
      <Link to="/" style={styles.brand}>Tallest Tour Guide</Link>
      <span style={styles.secureBadge}>
        <Lock size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
        Secure checkout
      </span>
    </header>
  )
}

const inputStyle = (error) => ({
  height: '46px',
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 'var(--radius)',
  border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-n300)'}`,
  padding: '0 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body)',
  color: 'var(--color-n900)',
  backgroundColor: 'var(--color-n000)',
  outline: 'none',
})

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-n100)',
    fontFamily: 'var(--font-body)',
    color: 'var(--color-n900)',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '64px',
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n200)',
    position: 'sticky',
    top: 0,
    zIndex: 20,
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '17px',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
    letterSpacing: '-0.01em',
  },
  secureBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 'var(--text-small)',
    fontWeight: 600,
    color: 'var(--color-n600)',
  },
  main: { maxWidth: '1040px', margin: '0 auto', padding: '28px 24px 96px' },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: 'var(--text-small)',
    fontWeight: 600,
    color: 'var(--color-n600)',
    textDecoration: 'none',
    marginBottom: '22px',
  },
  grid: { display: 'grid', gap: '32px', alignItems: 'start' },

  // mobile top summary — the compact "what you're buying" panel
  mobileSummary: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-n200)',
    boxShadow: 'var(--shadow-sm)',
    padding: '16px 16px 12px',
    marginBottom: '24px',
  },
  mobileSummaryHead: { display: 'flex', justifyContent: 'space-between', gap: '14px' },
  mobileSummaryTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '16.5px',
    lineHeight: 1.3,
    margin: '2px 0 3px',
    color: 'var(--color-n900)',
  },
  mobileMeta: { fontSize: 'var(--text-small)', color: 'var(--color-n500)' },
  mobileTotalLabel: {
    display: 'block',
    fontSize: 'var(--text-tiny)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: 'var(--color-n500)',
    marginBottom: '2px',
  },
  mobileTotal: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '19px', color: 'var(--color-n900)', whiteSpace: 'nowrap' },
  summaryToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    marginTop: '8px',
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    fontWeight: 600,
    color: 'var(--color-forest-green)',
  },

  // form column — open on the page (no card) so the left side feels airy
  formCol: { minWidth: 0 },
  head: { marginBottom: '28px' },
  h1: {
    fontFamily: 'var(--font-hero)',
    fontWeight: 600,
    fontSize: 'clamp(26px, 4vw, 34px)',
    lineHeight: 1.15,
    letterSpacing: '-0.01em',
    margin: '0 0 8px',
    color: 'var(--color-n900)',
  },
  sub: {
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    lineHeight: 1.5,
    margin: 0,
    maxWidth: '46ch',
  },
  section: { marginTop: '4px' },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 'var(--text-small)',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    color: 'var(--color-n500)',
    margin: '0 0 18px',
  },
  field: { marginBottom: '16px' },
  label: {
    display: 'block',
    fontSize: 'var(--text-small)',
    fontWeight: 600,
    color: 'var(--color-n800)',
    marginBottom: '7px',
  },
  hint: { color: 'var(--color-n400)', fontWeight: 500 },
  errorText: {
    display: 'block',
    marginTop: '6px',
    fontSize: 'var(--text-small)',
    color: 'var(--color-error)',
  },
  detailsGrid: { display: 'grid', columnGap: '16px' },
  referralToggle: {
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    fontWeight: 600,
    color: 'var(--color-forest-green)',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
  divider: { height: '1px', backgroundColor: 'var(--color-n200)', margin: '20px 0 28px' },

  // payment options — two cards side by side (stacked on mobile)
  options: { display: 'grid', gap: '12px' },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    width: '100%',
    textAlign: 'left',
    padding: '16px',
    borderRadius: 'var(--radius-lg)',
    border: '1.5px solid var(--color-n300)',
    backgroundColor: 'var(--color-n000)',
    cursor: 'pointer',
    transition: 'border-color var(--t-fast), background-color var(--t-fast), box-shadow var(--t-fast)',
  },
  radio: {
    flexShrink: 0,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid var(--color-n400)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1px',
  },
  optionBody: { display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 },
  optionTitleRow: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  optionTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-body)', color: 'var(--color-n900)' },
  badge: {
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-forest-darker)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-tiny)',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 'var(--radius-pill)',
    letterSpacing: '0.2px',
  },
  optionSub: { fontSize: 'var(--text-small)', color: 'var(--color-n600)', lineHeight: 1.45 },
  checkbox: {
    flexShrink: 0,
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    border: '2px solid var(--color-n400)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1px',
  },
  addonPrice: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 'var(--text-body)',
    color: 'var(--color-forest-green)',
    whiteSpace: 'nowrap',
  },
  cardFields: {
    marginTop: '12px',
    padding: '16px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n200)',
  },
  cardRow: { display: 'flex', gap: '12px' },

  secureLine: {
    margin: '12px 0 0',
    textAlign: 'center',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n500)',
    lineHeight: 1.5,
  },
  cancelLine: {
    margin: '8px 0 0',
    textAlign: 'center',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n500)',
  },
  cancelLink: { color: 'var(--color-forest-green)', fontWeight: 600, textDecoration: 'none' },
  quoteNote: {
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 1.6,
    margin: '0 0 22px',
  },
  errorBanner: {
    marginTop: '16px',
    padding: '12px 14px',
    borderRadius: 'var(--radius)',
    backgroundColor: 'rgba(229,62,62,0.06)',
    border: '1px solid rgba(229,62,62,0.25)',
    color: 'var(--color-error)',
    fontSize: 'var(--text-small)',
    textAlign: 'center',
  },

  // summary column
  summaryCol: { display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '88px' },
  summaryPanel: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-n200)',
    boxShadow: 'var(--shadow-sm)',
    padding: '24px',
  },
  summaryEyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1.4px',
    color: 'var(--color-mid-green)',
    marginBottom: '8px',
  },
  summaryTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 'var(--text-h3)',
    lineHeight: 1.25,
    margin: '0 0 18px',
    color: 'var(--color-n900)',
  },
  summaryList: { margin: 0 },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '9px 0',
    borderBottom: '1px solid var(--color-n100)',
  },
  rowLabel: { margin: 0, color: 'var(--color-n500)', fontSize: 'var(--text-small)' },
  rowValue: { margin: 0, color: 'var(--color-n800)', fontWeight: 600, fontSize: 'var(--text-small)', textAlign: 'right' },
  priceBlock: { marginTop: '16px' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '5px 0' },
  priceMuted: { color: 'var(--color-n500)', fontSize: 'var(--text-small)' },
  discountText: { color: 'var(--color-forest-green)', fontWeight: 600, fontSize: 'var(--text-small)' },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: '8px',
    paddingTop: '14px',
    borderTop: '1.5px solid var(--color-n200)',
  },
  totalLabel: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-body)' },
  totalValue: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h3)', color: 'var(--color-n900)' },
  depositNote: { marginTop: '14px', fontSize: 'var(--text-small)', color: 'var(--color-n500)', lineHeight: 1.5 },

  trustList: {
    listStyle: 'none',
    margin: 0,
    padding: '0 4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n700)',
    lineHeight: 1.4,
  },
  helpLine: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    margin: 0,
    padding: '14px 4px 0',
    borderTop: '1px solid var(--color-n200)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    lineHeight: 1.5,
  },
  helpLink: { color: 'var(--color-forest-green)', fontWeight: 700, textDecoration: 'none' },

  // sticky mobile total bar
  stickyBar: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
    backgroundColor: 'var(--color-n000)',
    borderTop: '1px solid var(--color-n200)',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
  },
  stickyLabel: {
    fontSize: 'var(--text-tiny)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: 'var(--color-n500)',
  },
  stickyTotal: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '19px', color: 'var(--color-n900)', whiteSpace: 'nowrap' },

  // success
  successWrap: { maxWidth: '560px', margin: '0 auto', padding: '72px 24px' },
  successCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-n200)',
    boxShadow: 'var(--shadow-md)',
    padding: '44px 36px',
    textAlign: 'center',
  },
  successIcon: { display: 'flex', justifyContent: 'center', marginBottom: '18px' },
  successTitle: {
    fontFamily: 'var(--font-hero)',
    fontWeight: 600,
    fontSize: 'var(--text-h2)',
    margin: '0 0 12px',
    color: 'var(--color-n900)',
  },
  successLead: { fontSize: 'var(--text-body-l)', color: 'var(--color-n700)', lineHeight: 1.55, margin: '0 0 12px' },
  successNote: { fontSize: 'var(--text-body)', color: 'var(--color-n600)', lineHeight: 1.6, margin: '0 0 28px' },
}

export default Checkout
