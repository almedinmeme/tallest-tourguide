// Checkout.jsx
// A dedicated, distraction-free booking + payment screen (App.jsx strips the
// site navbar/footer for /checkout). The user lands here after pressing
// "Continue to Checkout" on a tour or package; the selection arrives via
// React Router location.state.
//
// Here the customer enters their contact details and chooses how to pay:
//   • Pay by card  → the (placeholder) card form; the booking confirms instantly.
//                    The Pay button calls processCardPayment() — the single
//                    seam to replace with a real gateway later.
//   • Reserve & pay later → the frictionless flow, full price.
//
// Both paths funnel through submitBooking(): the calendar write that holds
// the seats, then the guest and admin emails.
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
import CurrencySwitcher from '../components/CurrencySwitcher'
import logo from '../assets/logo.svg'
import { submitBooking, processCardPayment } from '../utils/booking'
import { findPromoCode, promoSavingFor } from '../utils/promo'
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
import { useCurrency } from '../context/CurrencyContext'

// Cosmetic card-field formatting — digits only, grouped like a real card.
const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d
}
const formatCvc = (v) => v.replace(/\D/g, '').slice(0, 4)

function Checkout() {
  const { format } = useCurrency()
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
  // Journeys can pay the full amount (default) or a deposit ('full' | 'deposit').
  const [payPlan, setPayPlan] = useState('full')

  // Placeholder card fields (cosmetic for now).
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  const [isSending, setIsSending] = useState(false)
  const [isError, setIsError] = useState(false)
  // Set only when the server rejects the booking because the seats went in
  // the meantime — the one failure the guest can actually act on.
  const [soldOut, setSoldOut] = useState('')
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
  const listTotal = base + extrasTotal
  // Promo code — validated live as the guest types, so a matching code shows
  // its discount immediately, while unknown codes stay quiet (they're still
  // forwarded on the booking as partner-attribution text, never rejected).
  const promo = useMemo(() => findPromoCode(discount), [discount])
  // Promo discounts apply to the tour price only — add-ons are charged in
  // full (owner decision, 2026-07).
  const promoSaving = isQuote ? 0 : promoSavingFor(promo, base)
  // Everything downstream (card discount, deposit split, totals) works from
  // the promo-reduced total.
  const total = listTotal - promoSaving
  // Journeys (booking.deposit) are card-only — there is no reserve option.
  // They pay the list total in full, or a deposit now with the balance due
  // before departure.
  const hasDeposit = Boolean(booking?.deposit) && !isQuote
  const payingByCard = (hasDeposit || method === 'card') && !isQuote
  const depositAmount = Math.round(total * (DEPOSIT_PERCENT / 100))
  const balanceAmount = total - depositAmount
  const paySplit = hasDeposit && payPlan === 'deposit'
  const dueNow = paySplit ? depositAmount : total

  // The real calendar date the balance falls due, when the departure ISO
  // date travelled with the booking (packages send bookingFields.tourDate).
  const departureISO = booking?.bookingFields?.tourDate
  const balanceDueLabel = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(departureISO || '')) return null
    const [y, m, d] = departureISO.split('-').map(Number)
    const due = new Date(y, m - 1, d)
    due.setDate(due.getDate() - BALANCE_DUE_DAYS)
    return due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }, [departureISO])

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
    // Phone stays optional, but when given it must be the full international
    // form — leading + and country code — so we can actually reach guests
    // on WhatsApp/Viber wherever they're from.
    if (phone.trim() && !/^\+\d{6,15}$/.test(phone.replace(/[\s\-().]/g, ''))) {
      e.phone = 'Include your country code, e.g. +387 62 123 456'
    }
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
      if (e.name || e.email || e.phone) window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setIsSending(true)
    setIsError(false)
    setSoldOut('')

    // A redeemed promo shows its effect on the booking record; any other
    // code travels as plain attribution text.
    const codeLine = promo && promoSaving > 0
      ? `${promo.code} — €${promoSaving} discount applied`
      : discount.trim()
    const guestTemplate = {
      guest_name: name.trim(),
      guest_email: email.trim(),
      guest_phone: phone.trim() || 'Not provided',
      discount_code: codeLine || 'None',
    }
    const guestFields = {
      guestName: name.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim(),
      discountCode: codeLine,
    }

    const isCard = payMethod === 'card'
    const payTotal = total
    const extrasSummary = selectedExtraItems.length
      ? selectedExtraItems.map((e) => `${e.label} (+€${e.amount})`).join(', ')
      : 'None'
    // Fold the payment plan into the free-text payment_method so the existing
    // email templates need no new fields.
    const planSuffix = hasDeposit
      ? paySplit
        ? ` · ${DEPOSIT_PERCENT}% deposit plan (€${depositAmount} now, €${balanceAmount} due ${BALANCE_DUE_DAYS} days before departure)`
        : ' · paying in full'
      : ''

    const payload = {
      bookingFields: {
        ...booking.bookingFields,
        ...guestFields,
        ...(isQuote ? {} : { totalPrice: payTotal }),
      },
      templateParams: {
        ...booking.templateParams,
        ...guestTemplate,
        extras: extrasSummary,
        ...(isQuote ? {} : { total_price: `€${payTotal}` }),
        payment_method: (isCard
          ? 'Card — charged at booking'
          : isQuote ? 'Quote requested' : 'Reserve & pay later') + planSuffix,
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
      .catch((err) => {
        setIsSending(false)
        // A sold-out date is actionable — say so and point them back to the
        // date picker. Everything else is the existing generic error.
        if (err?.code === 'SOLD_OUT') {
          setSoldOut(err.message)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          setIsError(true)
        }
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
              {done === 'card' ? 'Booking confirmed' : isQuote ? 'Request received' : 'Your place is reserved'}
            </h1>
            <p style={styles.successLead}>
              Thank you, {name.trim()}. Your booking for <strong>{booking.title}</strong>
              {summary?.date ? <> on {summary.date}</> : null} is confirmed in our system.
            </p>
            <p style={styles.successNote}>
              {done === 'card' ? (
                paySplit ? (
                  <>Your <strong>{format(depositAmount)}</strong> deposit has been charged
                  securely — a receipt is on its way to <strong>{email.trim()}</strong>. The
                  balance of <strong>{format(balanceAmount)}</strong> is due {BALANCE_DUE_DAYS}{' '}
                  days before departure; we'll email you well in advance.</>
                ) : (
                  <>Your payment of <strong>{format(total)}</strong> has
                  been charged securely — a receipt and your booking confirmation are on their
                  way to <strong>{email.trim()}</strong>.</>
                )
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
              <span style={styles.priceMuted}>{format(summary.unitPrice)} × {summary.numPeople}</span>
              <span style={styles.priceMuted}>{format(base)}</span>
            </div>
          )}
          {/* The promo line sits directly under the tour price — before any
              add-ons — because that's all it discounts. */}
          {promoSaving > 0 && (
            <div style={styles.priceRow}>
              <span style={styles.discountText}>
                Code {promo.code} ({promo.type === 'percent' ? `−${promo.value}%` : `−€${promo.value}`} on the tour)
              </span>
              <span style={styles.discountText}>−{format(promoSaving)}</span>
            </div>
          )}
          {selectedExtraItems.map((ex, i) => (
            <div key={i} style={styles.priceRow}>
              <span style={styles.priceMuted}>{ex.label}</span>
              <span style={styles.priceMuted}>+{format(ex.amount)}</span>
            </div>
          ))}
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>{paySplit ? 'Due today' : payingByCard ? 'Pay today' : 'Total'}</span>
            <span style={styles.totalValue}>{format(dueNow)}</span>
          </div>
          {paySplit && (
            <div style={{ ...styles.priceRow, marginTop: 6 }}>
              <span style={styles.priceMuted}>Balance, due {BALANCE_DUE_DAYS} days before departure</span>
              <span style={styles.priceMuted}>{format(balanceAmount)}</span>
            </div>
          )}
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
                <span style={styles.mobileTotalLabel}>{paySplit ? 'Due today' : payingByCard && !isQuote ? 'Pay today' : 'Total'}</span>
                <span style={styles.mobileTotal}>{isQuote ? 'On request' : format(dueNow)}</span>
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

            {/* The date filled up while this guest was on the form. Shown
                here rather than by the pay button because the fix is to go
                back and pick another date, not to try again. */}
            {soldOut && (
              <div style={styles.soldOutBanner}>
                <strong style={styles.soldOutTitle}>That date just filled up</strong>
                <span>{soldOut}</span>
                <Link to={booking.backLink} style={styles.soldOutLink}>
                  {booking.backLabel} to choose another date
                </Link>
              </div>
            )}

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
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </Field>

                <Field label="Email address" error={errors.email}>
                  <input
                    className="booking-input"
                    style={inputStyle(errors.email)}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError('email') }}
                    placeholder="john.doe@example.com"
                    type="email"
                    autoComplete="email"
                  />
                </Field>

                <Field label="Phone" hint="optional, with country code" error={errors.phone}>
                  <input
                    className="booking-input"
                    style={inputStyle(errors.phone)}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); clearError('phone') }}
                    placeholder="+387 62 123 456"
                    type="tel"
                    autoComplete="tel"
                  />
                </Field>

                {(showReferral || discount) && (
                  <Field label="Referral or promo code" hint="optional">
                    <input
                      className="booking-input"
                      style={inputStyle()}
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="e.g. HOTEL123"
                      autoFocus={showReferral}
                    />
                    {promo && !isQuote && (
                      <span style={styles.promoApplied}>
                        <Check size={13} strokeWidth={3} />
                        {promo.code} applied — {promo.type === 'percent' ? `${promo.value}% off` : `€${promo.value} off`} the tour price
                      </span>
                    )}
                  </Field>
                )}
              </div>

              {/* Kept behind a link so the field doesn't send everyone off
                  hunting for a code they don't have. */}
              {!showReferral && !discount && (
                <button type="button" onClick={() => setShowReferral(true)} style={styles.referralToggle}>
                  Have a referral or promo code?
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
                              <span style={styles.addonPrice}>+{format(ex.amount)}</span>
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
                  {hasDeposit && (
                    <>
                      {/* Plan: slim segmented toggle instead of option boxes */}
                      <div style={styles.planToggle} role="radiogroup" aria-label="How much to pay today">
                        <button
                          type="button"
                          role="radio"
                          aria-checked={!paySplit}
                          className="checkout-plan-seg"
                          onClick={() => setPayPlan('full')}
                          style={{ ...styles.planSeg, ...(!paySplit ? styles.planSegActive : {}) }}
                        >
                          <span style={{
                            ...styles.planRadio,
                            borderColor: !paySplit ? 'var(--color-forest-green)' : 'var(--color-n400)',
                            backgroundColor: !paySplit ? 'var(--color-forest-green)' : 'transparent',
                          }}>
                            {!paySplit && <Check size={10} color="var(--color-n000)" strokeWidth={3.5} />}
                          </span>
                          Pay in full
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={paySplit}
                          className="checkout-plan-seg"
                          onClick={() => { setPayPlan('deposit'); setMethod('card') }}
                          style={{ ...styles.planSeg, ...(paySplit ? styles.planSegActive : {}) }}
                        >
                          <span style={{
                            ...styles.planRadio,
                            borderColor: paySplit ? 'var(--color-forest-green)' : 'var(--color-n400)',
                            backgroundColor: paySplit ? 'var(--color-forest-green)' : 'transparent',
                          }}>
                            {paySplit && <Check size={10} color="var(--color-n000)" strokeWidth={3.5} />}
                          </span>
                          {DEPOSIT_PERCENT}% deposit today
                        </button>
                      </div>

                      {/* Payment timeline — when the money moves, in the same
                          dots-on-a-dashed-line language as the route strip */}
                      <div style={styles.payTimeline}>
                        <div style={styles.tlTrack}>
                          <span style={styles.tlDash} />
                          <span style={{ ...styles.tlDotFilled, position: 'absolute', left: 0 }} />
                          {paySplit || !payingByCard ? (
                            <span style={{ ...styles.tlDotHollow, position: 'absolute', right: 0 }} />
                          ) : (
                            <span style={{ ...styles.tlDotCheck, position: 'absolute', right: 0 }}>
                              <Check size={9} color="var(--color-n000)" strokeWidth={3.5} />
                            </span>
                          )}
                        </div>
                        <div style={styles.tlLabels}>
                          <div style={styles.tlCol}>
                            <span style={styles.tlWhen}>Today</span>
                            <span style={styles.tlAmount}>
                              {format(dueNow)}{paySplit ? ' deposit' : ''}
                            </span>
                          </div>
                          <div style={{ ...styles.tlCol, alignItems: 'flex-end', textAlign: 'right' }}>
                            {paySplit ? (
                              <>
                                <span style={styles.tlWhen}>{balanceDueLabel ? `By ${balanceDueLabel}` : `${BALANCE_DUE_DAYS} days before departure`}</span>
                                <span style={styles.tlAmountMuted}>{format(balanceAmount)} balance</span>
                              </>
                            ) : (
                              <>
                                <span style={styles.tlWhen}>After today</span>
                                <span style={styles.tlAmountMuted}>Nothing left to pay</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* Method choice is tours-only — journeys are card-only */}
                  {!hasDeposit && (
                    <div>
                      <MethodRow
                        active={method === 'card'}
                        onSelect={() => setMethod('card')}
                        title="Pay by card"
                        sub="Pay securely now — your booking is confirmed instantly."
                      />
                      <div style={styles.methodDivider} />
                      <MethodRow
                        active={method === 'reserve'}
                        onSelect={() => setMethod('reserve')}
                        title="Reserve & pay later"
                        sub="Hold your place now — pay before your trip."
                      />
                    </div>
                  )}

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
                        ? `Pay ${format(dueNow)}${paySplit ? ' deposit' : ''}`
                        : `Reserve now — pay ${format(total)} later`}
                </Button>
              </div>

              <p style={styles.secureLine}>
                <Lock size={13} style={{ verticalAlign: '-2px', marginRight: 6 }} />
                {isQuote
                  ? 'No payment is taken now.'
                  : payingByCard
                    ? `Your card is charged ${format(dueNow)}${paySplit ? ` today — the ${format(balanceAmount)} balance is due later` : ' immediately, securely encrypted'}. Card details are never stored.`
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
            <span style={styles.stickyTotal}>{isQuote ? 'On request' : format(dueNow)}</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => complete(isQuote ? 'reserve' : method)}
            disabled={isSending}
          >
            {isSending
              ? 'Working…'
              : isQuote ? 'Request booking' : payingByCard ? `Pay ${format(dueNow)}` : 'Reserve now'}
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

function MethodRow({ active, onSelect, title, sub, badge, disabled }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
      style={{
        ...styles.methodRow,
        ...(disabled ? { opacity: 0.5, cursor: 'default' } : {}),
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
        <span style={styles.optionSub}>{sub}</span>
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
      <Link to="/" style={styles.brand} aria-label="Tallest Tourguide — home">
        <img src={logo} alt="Tallest Tourguide" style={styles.brandLogo} />
      </Link>
      <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <CurrencySwitcher />
        <span style={styles.secureBadge}>
          <Lock size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Secure checkout
        </span>
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
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  brandLogo: {
    height: '32px',
    width: 'auto',
    display: 'block',
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
  promoApplied: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    marginTop: '6px',
    fontSize: 'var(--text-small)',
    fontWeight: 600,
    color: 'var(--color-forest-green)',
  },
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

  payGroupLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '12.5px',
    fontWeight: '600',
    color: 'var(--color-n600)',
    marginBottom: '8px',
  },

  planToggle: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n200)',
    borderRadius: 'var(--radius-pill)',
  },

  planSeg: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    height: '42px',
    borderRadius: 'var(--radius-pill)',
    border: 'none',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '13.5px',
    color: 'var(--color-n700)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
  },

  planSegActive: {
    backgroundColor: 'var(--color-n000)',
    color: 'var(--color-forest-green)',
    fontWeight: '700',
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
  },

  planRadio: {
    flexShrink: 0,
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid var(--color-n400)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
  },

  payTimeline: {
    margin: '18px 2px 0',
  },

  tlTrack: {
    position: 'relative',
    height: '13px',
    display: 'flex',
    alignItems: 'center',
  },

  tlDash: {
    width: '100%',
    borderTop: '2px dashed rgba(46,125,94,0.35)',
  },

  tlDotFilled: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-forest-green)',
    boxShadow: '0 0 0 3px rgba(46,125,94,0.15)',
  },

  tlDotHollow: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    border: '2px solid var(--color-n400)',
    backgroundColor: 'var(--color-n000)',
    boxSizing: 'border-box',
  },

  tlDotCheck: {
    width: '13px',
    height: '13px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-forest-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tlLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    marginTop: '7px',
  },

  tlCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },

  tlWhen: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-n800)',
  },

  tlAmount: {
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-forest-green)',
  },

  tlAmountMuted: {
    fontFamily: 'var(--font-body)',
    fontSize: '12.5px',
    fontWeight: '500',
    color: 'var(--color-n500)',
  },

  methodRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    width: '100%',
    padding: '13px 2px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },

  methodDivider: {
    height: '1px',
    backgroundColor: 'var(--color-n200)',
  },
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
    margin: '12px 0 0',
    paddingTop: '12px',
    borderTop: '1px solid var(--color-n200)',
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
  // Amber rather than red: nothing went wrong, the seats simply went.
  soldOutBanner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '24px',
    padding: '14px 16px',
    borderRadius: 'var(--radius)',
    backgroundColor: 'rgba(217,158,66,0.08)',
    border: '1px solid rgba(217,158,66,0.35)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-charcoal)',
  },
  soldOutTitle: { fontSize: 'var(--text-body)' },
  soldOutLink: {
    marginTop: '4px',
    color: 'var(--color-forest-green)',
    fontWeight: 600,
    textDecoration: 'underline',
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
