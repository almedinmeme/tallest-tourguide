// BookingConditions.jsx
// The legal page, written to be read: a plain-English "short version" first,
// then the numbered fine print. All policy numbers come from src/data/policy.js
// so this page, the checkout, and the home trust bar can never disagree.
// The short-version content doubles as FAQPage JSON-LD (via FAQSchema).
import { useState, useEffect } from 'react'
import SEO from '../components/SEO'
import useWindowWidth from '../hooks/useWindowWidth'
import Button from '../components/Button'
import InfoHero from '../components/InfoHero'
import SectionNav from '../components/SectionNav'
import PaymentReassurance from '../components/PaymentReassurance'
import { FAQSchema } from '../schema/SchemaMarkup'
import { DEPOSIT_PERCENT, BALANCE_DUE_DAYS } from '../data/policy'

const NAVBAR_HEIGHT = 68

// ── The short version ──────────────────────────────────────────────────────
// Rendered as the plain-English panel AND (as Q&A) emitted as FAQPage schema.
const SHORT_TOURS = [
  'Pay in full when you book, or reserve now and pay later.',
  'Free cancellation up to 24 hours before — full refund, no questions.',
]
const SHORT_PACKAGES = [
  `A ${DEPOSIT_PERCENT}% deposit confirms your trip; the balance is due ${BALANCE_DUE_DAYS} days before departure.`,
  'Cancel more than 30 days out: full refund. 15–30 days: half back. Under 15 days: no refund.',
  'One free date change if you ask more than 30 days out.',
]
const SHORT_SHARED = [
  'If we cancel — weather, minimum numbers, force majeure — you always choose: full refund or free rebooking.',
  'Refunds go back promptly to the original payment method.',
  'A human answers within 48 hours.',
]

const FAQS = [
  {
    question: 'Can I cancel a day tour for free?',
    answer: 'Yes — cancel up to 24 hours before the start and you receive a full refund, no questions asked. Inside 24 hours we can\'t refund, but we\'ll always try to move you to another date first.',
  },
  {
    question: 'How much is the deposit on a multi-day journey?',
    answer: `A ${DEPOSIT_PERCENT}% deposit confirms your booking. The remaining balance is due ${BALANCE_DUE_DAYS} days before departure.`,
  },
  {
    question: 'What refund do I get if I cancel a multi-day journey?',
    answer: 'A full refund of everything paid if you cancel more than 30 days before departure, a 50% refund between 15 and 30 days, and no refund inside 15 days — by then the family-owned places we book are already committed.',
  },
  {
    question: 'Can I change my travel dates instead of cancelling?',
    answer: 'Yes. Every booking includes one free date change if you ask more than 30 days before departure, subject to availability.',
  },
  {
    question: 'What happens if Tallest Tourguide cancels my tour?',
    answer: 'You always choose between a full refund and a free rebooking on another date — whether we cancel for weather, safety, minimum numbers, or force majeure.',
  },
  {
    question: 'How do I pay, and how are refunds returned?',
    answer: 'You can pay by bank transfer (EUR), a secure card payment link, PayPal, or cash on the day for day tours. Refunds always go back promptly to the original payment method.',
  },
]

// ── The fine print ──────────────────────────────────────────────────────────
const sections = [
  {
    id: 'booking-payment',
    number: '01',
    title: 'Booking & payment',
    content: [
      {
        type: 'p',
        text: 'For day tours and experiences, you can pay in full when you book, or reserve your place and pay any time before the tour.',
      },
      {
        type: 'p',
        text: `For multi-day journeys, a ${DEPOSIT_PERCENT}% deposit confirms your booking. The remaining balance is due ${BALANCE_DUE_DAYS} days before departure — we'll remind you well in advance.`,
      },
      {
        type: 'p',
        text: 'Every booking is confirmed personally by email, with exact payment instructions and everything you need to know before the day.',
      },
    ],
  },
  {
    id: 'paying-refunds',
    number: '02',
    title: 'Paying us & refunds',
    content: [
      {
        type: 'p',
        text: 'We keep payment simple and transparent. You can pay in any of these ways:',
      },
      { type: 'payment' },
      {
        type: 'p',
        text: 'Refunds are always returned promptly, to the original payment method. If a refund is ever due to you, you will not have to chase it.',
      },
    ],
  },
  {
    id: 'cancellation-tours',
    number: '03',
    title: 'Cancelling a day tour',
    content: [
      {
        type: 'p',
        text: 'Day tours and experiences come with free cancellation: cancel up to 24 hours before the start time and you receive a full refund, no questions asked.',
      },
      {
        type: 'p',
        text: 'Inside 24 hours we can\'t offer a refund — your guide and any hosts have already committed their day. Tell us as soon as you know, and we will always try to move you to another date first.',
      },
    ],
  },
  {
    id: 'cancellation-packages',
    number: '04',
    title: 'Cancelling a multi-day journey',
    content: [
      {
        type: 'p',
        text: 'Multi-day journeys involve real commitments to the small, family-owned places we book — homestays, agrotourism estates, boutique hotels, drivers. The refund tiers reflect that:',
      },
      { type: 'timeline' },
      {
        type: 'bullets',
        items: [
          'More than 30 days before departure: full refund of everything paid',
          '15–30 days before departure: 50% refund',
          'Less than 15 days before departure: no refund',
        ],
      },
      {
        type: 'p',
        text: 'To cancel, write to us by email as soon as possible — the date we receive your message is the date that counts. We understand that circumstances change and will always try to help where we can.',
      },
    ],
  },
  {
    id: 'date-changes',
    number: '05',
    title: 'Date changes',
    content: [
      {
        type: 'p',
        text: 'Every booking includes one free date change, if you ask more than 30 days before departure and the new date is available. It is almost always the better option — for you, and for the hosts expecting you.',
      },
      {
        type: 'p',
        text: 'Changes requested closer to departure are treated as a cancellation and a new booking, under the tiers above.',
      },
    ],
  },
  {
    id: 'cancellation-us',
    number: '06',
    title: 'If we cancel',
    content: [
      {
        type: 'p',
        text: 'We reserve the right to cancel a tour if the minimum number of guests is not reached, if weather or safety conditions make it inadvisable, or in cases of force majeure — natural disasters, civil unrest, or government travel advisories.',
      },
      {
        type: 'p',
        text: 'If we ever cancel, you choose: a full refund, or a free rebooking on another date. Never a voucher you didn\'t ask for.',
      },
    ],
  },
  {
    id: 'whats-included',
    number: '07',
    title: 'What\'s included',
    content: [
      {
        type: 'p',
        text: 'What is included and excluded is detailed on each individual tour page. As a general rule, tips and gratuities are not included unless explicitly stated. Personal expenses, travel insurance, and costs arising from your own decisions during free time are not covered.',
      },
    ],
  },
  {
    id: 'health-fitness',
    number: '08',
    title: 'Health & fitness',
    content: [
      {
        type: 'p',
        text: 'You are responsible for ensuring that you are in suitable physical and mental health to participate in your chosen tour. Some tours involve hiking, long drives, or emotionally demanding content — please read the fitness advisory on each tour page carefully before booking.',
      },
      {
        type: 'p',
        text: 'If you have any health concerns, consult your doctor before travelling.',
      },
    ],
  },
  {
    id: 'travel-insurance',
    number: '09',
    title: 'Travel insurance',
    content: [
      {
        type: 'p',
        text: 'We strongly recommend that all guests hold comprehensive travel insurance covering medical expenses, trip cancellation, and personal liability before joining any of our tours. We are not responsible for any losses, costs, or expenses that would have been covered by adequate travel insurance.',
      },
    ],
  },
  {
    id: 'behaviour',
    number: '10',
    title: 'Behaviour',
    content: [
      {
        type: 'p',
        text: 'We expect all guests to behave respectfully towards fellow travellers, local communities, cultural sites, and our guide. We reserve the right to remove any guest from a tour whose behaviour is deemed dangerous, disruptive, or disrespectful. In such cases, no refund will be issued.',
      },
    ],
  },
  {
    id: 'photography',
    number: '11',
    title: 'Photography & marketing',
    content: [
      {
        type: 'p',
        text: 'Photographs and video taken during our tours may occasionally be used for marketing purposes on our website and social media. If you would prefer not to appear in such content, please let us know before or at the start of your tour and we will respect your wishes.',
      },
    ],
  },
  {
    id: 'liability',
    number: '12',
    title: 'Liability',
    content: [
      {
        type: 'p',
        text: 'Tallest Tourguide acts as a local tour operator and guide. We are not liable for losses arising from missed onward travel connections, injury or illness resulting from guest negligence, theft or loss of personal belongings, or events outside our reasonable control.',
      },
      {
        type: 'p',
        text: 'Our liability is limited to the cost of the tour booked.',
      },
    ],
  },
  {
    id: 'complaints',
    number: '13',
    title: 'Contact & complaints',
    content: [
      {
        type: 'p',
        text: 'For any questions, concerns, or complaints, please reach out via our contact page. We aim to respond to all enquiries within 48 hours.',
      },
      {
        type: 'p',
        text: 'If you have a complaint about a tour you have already completed, please contact us within 14 days and we will investigate and respond fairly.',
      },
    ],
  },
]

// The package refund tiers as a visual timeline (time runs toward departure).
function CancellationTimeline({ isMobile }) {
  const stops = [
    { label: 'More than 30 days', value: 'Full refund', color: 'var(--color-forest-green)' },
    { label: '15–30 days', value: '50% refund', color: 'var(--color-amber)' },
    { label: 'Under 15 days', value: 'No refund', color: 'var(--color-n400)' },
  ]

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '4px 0' }}>
        {stops.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--color-n000)', border: `3px solid ${s.color}`, flexShrink: 0, boxSizing: 'border-box' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-n700)' }}>
              <strong style={{ color: 'var(--color-n900)' }}>{s.label}</strong> before departure · {s.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ margin: '8px 0 4px', paddingBottom: 58 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={styles.timelineEnd}>Booking</span>
        <span style={{ ...styles.timelineEnd, color: 'var(--color-warning)' }}>Departure</span>
      </div>
      <div style={{
        position: 'relative',
        height: 2,
        borderRadius: 2,
        background: 'linear-gradient(90deg, var(--color-forest-green), var(--color-amber) 60%, var(--color-n400))',
      }}>
        {stops.map((s, i) => {
          const pos = 10 + i * 40
          return (
            <span key={s.label} style={{
              position: 'absolute',
              left: `${pos}%`,
              top: '50%',
              transform: 'translate(-50%, -7px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 9,
              width: 150,
            }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: 'var(--color-n000)', border: `3px solid ${s.color}`, boxSizing: 'border-box' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: 'var(--color-n700)', textAlign: 'center', lineHeight: 1.35 }}>
                {s.label}
                <span style={{ display: 'block', fontWeight: 700, color: 'var(--color-n900)' }}>{s.value}</span>
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

function BookingConditions() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const [activeId, setActiveId] = useState('booking-payment')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = NAVBAR_HEIGHT + 44 + 16
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <div style={{ backgroundColor: 'var(--color-n000)', minHeight: '100vh' }}>
      <SEO
        title="Booking Conditions"
        description="Plain-English booking conditions for Tallest Tourguide — payment schedule, deposits, cancellation and refund policy for day tours and multi-day journeys in Bosnia."
        url="/booking-conditions"
      />
      <FAQSchema tour={{ faqs: FAQS }} />

      <InfoHero
        kicker="Booking with us"
        title="Booking conditions"
        lede="The short version first, in plain English. The full text below is the fine print — and there's nothing hiding in it."
        meta="Last updated July 2026 · 13 sections · 6 min read"
        overlap
      />

      {/* The short version — a card pulled up over the hero's lower edge */}
      <section style={{ padding: isMobile ? '0 24px 40px' : '0 24px 56px' }}>
        <div style={{ ...styles.shortPanel, marginTop: isMobile ? -64 : -92 }}>
          <span aria-hidden style={styles.shortRule} />
          <h2 style={styles.shortTitle}>The short version</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 22 : 40, marginTop: 20 }}>
            <div>
              <h3 style={styles.shortColHead}>Day tours &amp; experiences</h3>
              <ul style={styles.shortList}>
                {SHORT_TOURS.map((t) => (
                  <li key={t} style={styles.shortItem}><span style={styles.shortDot} />{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={styles.shortColHead}>Multi-day journeys</h3>
              <ul style={styles.shortList}>
                {SHORT_PACKAGES.map((t) => (
                  <li key={t} style={styles.shortItem}><span style={styles.shortDot} />{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <div style={styles.shortShared}>
            {SHORT_SHARED.map((t) => (
              <p key={t} style={styles.shortSharedItem}>{t}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky section nav + fine print */}
      <SectionNav sections={sections} activeId={activeId} onScrollTo={scrollTo} isMobile={isMobile} />

      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: isMobile ? '32px 20px 72px' : '48px 40px 96px',
      }}>
        <article style={{ minWidth: 0 }}>
          <p style={styles.finePrintIntro}>The fine print, section by section.</p>

          {sections.map(({ id, number, title, content }, idx) => (
            <section
              key={id}
              id={id}
              style={{
                scrollMarginTop: '120px',
                borderTop: idx === 0 ? 'none' : '1px solid var(--color-n200)',
                paddingTop: idx === 0 ? 0 : '36px',
                marginTop: idx === 0 ? 0 : '36px',
              }}
            >
              <div style={styles.sectionHeader}>
                <span style={styles.sectionNumber}>{number}</span>
                <h2 style={styles.sectionTitle}>{title}</h2>
              </div>

              <div style={{ ...styles.sectionBody, paddingLeft: isMobile ? 0 : '30px' }}>
                {content.map((block, j) => {
                  if (block.type === 'p') {
                    return <p key={j} style={styles.bodyText}>{block.text}</p>
                  }
                  if (block.type === 'payment') {
                    return <PaymentReassurance key={j} variant="compact" />
                  }
                  if (block.type === 'timeline') {
                    return <CancellationTimeline key={j} isMobile={isMobile} />
                  }
                  if (block.type === 'bullets') {
                    return (
                      <div key={j}>
                        {block.title && <p style={styles.bulletsTitle}>{block.title}</p>}
                        <ul style={styles.bulletList}>
                          {block.items.map((item, k) => (
                            <li key={k} style={styles.bulletItem}>
                              <span style={styles.bulletDot} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  }
                  if (block.type === 'callout') {
                    return (
                      <div key={j} style={styles.callout}>
                        <p style={styles.calloutText}>{block.text}</p>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </section>
          ))}

          {/* CTA — quiet hairline row, no box */}
          <div style={{
            ...styles.cta,
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: isMobile ? 'center' : 'left',
          }}>
            <div>
              <p style={styles.ctaTitle}>Questions about these conditions?</p>
              <p style={styles.ctaSubtitle}>We're happy to clarify anything before you book.</p>
            </div>
            <Button to="/contact" variant="secondary" style={{ flexShrink: 0 }}>
              Get in touch
            </Button>
          </div>

        </article>
      </div>
    </div>
  )
}

const styles = {
  shortPanel: {
    position: 'relative',
    maxWidth: 720,
    margin: '0 auto',
    backgroundColor: 'var(--color-n000)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-n200)',
    boxShadow: 'var(--shadow-lg)',
    padding: 'clamp(24px, 4vw, 36px)',
  },
  shortRule: { display: 'block', width: 40, height: 3, borderRadius: 2, backgroundColor: 'var(--color-amber)', marginBottom: 16 },
  shortTitle: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 'clamp(21px, 2.8vw, 26px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.01em' },
  shortColHead: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-forest-green)', margin: '0 0 12px' },
  shortList: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 },
  shortItem: { display: 'flex', gap: 10, fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.6, color: 'var(--color-n800)' },
  shortDot: { width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-amber)', flexShrink: 0, marginTop: 8 },
  shortShared: { marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-n200)', display: 'flex', flexDirection: 'column', gap: 8 },
  shortSharedItem: { fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6, color: 'var(--color-n700)', margin: 0 },

  finePrintIntro: { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-n500)', margin: '0 0 32px' },

  sectionHeader: { display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '18px' },
  sectionNumber: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: '15px', color: 'var(--color-amber)', flexShrink: 0 },
  sectionTitle: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 'clamp(20px, 2.6vw, 24px)', color: 'var(--color-n900)', margin: 0, lineHeight: 1.25, letterSpacing: '-0.01em' },
  sectionBody: { display: 'flex', flexDirection: 'column', gap: '16px' },
  bodyText: { fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-n700)', lineHeight: '1.8', margin: 0 },

  callout: { borderLeft: '2px solid var(--color-amber)', backgroundColor: 'var(--color-n100)', borderRadius: '0 10px 10px 0', padding: '14px 18px' },
  calloutText: { fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n700)', lineHeight: '1.75', margin: 0, fontStyle: 'italic' },

  bulletsTitle: { fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '14px', color: 'var(--color-n800)', margin: '0 0 10px 0' },
  bulletList: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' },
  bulletItem: { fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-n700)', lineHeight: '1.7', display: 'flex', alignItems: 'flex-start', gap: '10px' },
  bulletDot: { width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-forest-green)', flexShrink: 0, marginTop: '8px' },

  timelineEnd: { fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-forest-green)' },

  cta: {
    marginTop: '56px',
    paddingTop: '32px',
    borderTop: '1px solid var(--color-n200)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
  },
  ctaTitle: { fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '18px', color: 'var(--color-n900)', margin: '0 0 4px 0' },
  ctaSubtitle: { fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', margin: 0, lineHeight: '1.6' },
}

export default BookingConditions
