// PaymentReassurance.jsx
// The money-trust block. Guests wire real money to a small company in
// another country — this states, plainly, what they pay and when, how they
// pay, and what happens if plans change. Every fact comes from
// src/data/policy.js so the claims can't drift from the booking conditions.
//
//   <PaymentReassurance variant="full" />     — banded section (Safe Travels)
//   <PaymentReassurance variant="compact" />  — stacked rows for the 720px
//                                               legal article (Booking Conditions)
//
// Copy rule: truthful only. No "licensed/bonded/escrow/protected" language;
// online card payment on the site itself is not live.

import { Link } from 'react-router-dom'
import { Wallet, CalendarClock, Receipt, Umbrella } from 'lucide-react'
import {
  DEPOSIT_PERCENT,
  BALANCE_DUE_DAYS,
  CANCEL_LINE_TOUR,
  CANCEL_LINE_PACKAGE,
  REFUND_TIMING,
  PAYMENT_METHODS,
} from '../data/policy'
import useWindowWidth from '../hooks/useWindowWidth'

const ROW_SCHEDULE = {
  icon: Wallet,
  title: 'What you pay, and when',
  body: `Day tours: pay in full when you book, or reserve now and pay before the tour. Multi-day packages: a ${DEPOSIT_PERCENT}% deposit confirms your trip, and the balance is due ${BALANCE_DUE_DAYS} days before departure. You always see the full price before you commit.`,
}
const ROW_CHANGES = {
  icon: CalendarClock,
  title: 'If plans change',
  body: `${CANCEL_LINE_TOUR} ${CANCEL_LINE_PACKAGE} Refunds go back ${REFUND_TIMING}.`,
  termsLink: true,
}
const ROW_NO_FEES = {
  icon: Receipt,
  title: 'No hidden fees',
  body: 'The price you see is the price you pay — no booking fees, no card surcharges, no surprise "local payments". Anything not included, like entrance fees or tips, is listed on the tour page before you book.',
}
const ROW_INSURANCE = {
  icon: Umbrella,
  title: 'Insurance, honestly',
  body: "We're a small local operator, not an insurance company. Comprehensive travel insurance — medical, evacuation, cancellation — protects you in ways we genuinely can't. Please arrange it before you travel.",
}

const ROWS = [ROW_SCHEDULE, ROW_CHANGES, ROW_NO_FEES, ROW_INSURANCE]

function MethodList({ compact }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(210px, 1fr))',
      gap: compact ? 12 : '18px 28px',
    }}>
      {PAYMENT_METHODS.map((m) => (
        <div key={m.title}>
          <span style={styles.methodTitle}>{m.title}</span>
          <p style={styles.methodBody}>{m.body}</p>
        </div>
      ))}
    </div>
  )
}

function TrustRow({ row, compact }) {
  const Icon = row.icon
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <Icon size={compact ? 18 : 20} color="var(--color-forest-green)" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 3 }} />
      <div>
        <h3 style={{ ...styles.rowTitle, fontSize: compact ? 15 : 16 }}>{row.title}</h3>
        <p style={styles.rowBody}>
          {row.body}
          {row.termsLink && (
            <>
              {' '}<Link to="/booking-conditions" style={styles.inlineLink}>Full cancellation terms →</Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default function PaymentReassurance({ variant = 'full' }) {
  const isMobile = useWindowWidth() <= 768
  const compact = variant === 'compact'

  if (compact) {
    // Embedded inside the Booking Conditions article: only the payment
    // methods and the no-hidden-fees promise — the schedule, cancellation
    // and insurance rows would duplicate the surrounding legal sections.
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <MethodList compact />
        <TrustRow row={{ ...ROW_NO_FEES, termsLink: false }} compact />
      </div>
    )
  }

  return (
    <section style={{
      padding: isMobile ? '48px 24px' : '68px 24px',
      backgroundColor: 'var(--color-n100)',
      borderTop: '1px solid var(--color-n200)',
      borderBottom: '1px solid var(--color-n200)',
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <span style={styles.eyebrow}>Payments &amp; refunds</span>
        <h2 style={styles.h2}>Your money, handled properly</h2>
        <p style={styles.intro}>
          Booking a trip like this means sending real money to a small company in another
          country. We know exactly how that feels — so here is how it works, in full.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 26 : '32px 64px',
          marginTop: 32,
        }}>
          {ROWS.map((row) => <TrustRow key={row.title} row={row} />)}
        </div>

        <div style={{ marginTop: isMobile ? 34 : 44, paddingTop: isMobile ? 26 : 32, borderTop: '1px solid var(--color-n200)' }}>
          <h3 style={{ ...styles.rowTitle, fontSize: 16, marginBottom: 18 }}>How you can pay</h3>
          <MethodList />
        </div>
      </div>
    </section>
  )
}

const styles = {
  eyebrow: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-forest-green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 },
  h2: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(24px, 3.4vw, 34px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 },
  intro: { fontFamily: 'var(--font-body)', fontSize: 16.5, lineHeight: 1.7, color: 'var(--color-n600)', margin: '16px 0 0', maxWidth: 620 },

  rowTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-n900)', margin: '0 0 6px', lineHeight: 1.3 },
  rowBody: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-n700)', margin: 0 },
  inlineLink: { color: 'var(--color-forest-green)', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' },

  methodTitle: { display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--color-forest-green)', marginBottom: 4 },
  methodBody: { fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.6, color: 'var(--color-n600)', margin: 0 },
}
