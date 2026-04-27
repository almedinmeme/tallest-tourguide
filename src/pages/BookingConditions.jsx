import { useState, useEffect, useRef } from 'react'
import SEO from '../components/SEO'
import { Link } from 'react-router-dom'
import useWindowWidth from '../hooks/useWindowWidth'

const NAVBAR_HEIGHT = 68

const sections = [
  {
    id: 'booking-payment',
    number: '01',
    title: 'Booking & payment',
    content: [
      {
        type: 'p',
        text: 'For day tours and experiences, full payment is required at the time of booking. For multi-day packages, a deposit may be required to secure your place, with the remaining balance due before the tour date.',
      },
      {
        type: 'p',
        text: 'Once payment is received, you will receive a booking confirmation by email with all relevant details.',
      },
    ],
  },
  {
    id: 'cancellation-you',
    number: '02',
    title: 'Cancellation by you',
    content: [
      {
        type: 'p',
        text: 'If you need to cancel your booking, please notify us in writing by email as soon as possible. The following cancellation policy applies:',
      },
      {
        type: 'bullets',
        items: [
          'More than 30 days before the tour: full refund',
          '14–30 days before the tour: 50% refund',
          'Less than 14 days before the tour: no refund',
        ],
      },
      {
        type: 'p',
        text: 'We understand that circumstances change and will always try to help where we can — please get in touch and we\'ll do our best.',
      },
    ],
  },
  {
    id: 'cancellation-us',
    number: '03',
    title: 'Cancellation by us',
    content: [
      {
        type: 'p',
        text: 'We reserve the right to cancel a tour in the following circumstances: the minimum group size is not reached; weather or safety conditions make the tour inadvisable; force majeure events beyond our control (including natural disasters, civil unrest, or government travel advisories).',
      },
      {
        type: 'p',
        text: 'If we cancel, you will be offered either a full refund or the option to rebook on an alternative date at no extra cost.',
      },
    ],
  },
  {
    id: 'whats-included',
    number: '04',
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
    number: '05',
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
    number: '06',
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
    number: '07',
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
    number: '08',
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
    number: '09',
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
    id: 'amendments',
    number: '10',
    title: 'Amendments',
    content: [
      {
        type: 'p',
        text: 'If you need to change your booking date or details, please contact us as early as possible. We will do our best to accommodate changes subject to availability. Changes made within 14 days of the tour date may not be possible.',
      },
    ],
  },
  {
    id: 'complaints',
    number: '11',
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

function StickyNav({ activeId, onScrollTo, isMobile }) {
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
        height: '44px',
        maxWidth: '1060px',
        margin: '0 auto',
        padding: isMobile ? '0 16px' : '0 40px',
        minWidth: 'max-content',
      }}>
        {sections.map(({ id, number, title }) => {
          const isActive = activeId === id
          return (
            <button
              key={id}
              onClick={() => onScrollTo(id)}
              style={{
                height: '100%',
                padding: isMobile ? '0 10px' : '0 14px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--color-forest-green)' : '2px solid transparent',
                color: isActive ? 'var(--color-forest-green)' : 'var(--color-n500)',
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? '12px' : '13px',
                fontWeight: isActive ? '600' : '400',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ fontSize: '10px', color: isActive ? 'var(--color-forest-green)' : 'var(--color-n400)', fontWeight: '600' }}>{number}</span>
              {title}
            </button>
          )
        })}
      </div>
    </nav>
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
    <div style={{ backgroundColor: 'var(--color-n100)', minHeight: '100vh' }}>
      <SEO
        title="Booking Conditions — Tallest Tourguide"
        description="Cancellation policy, payment terms, liability, and booking conditions for Tallest Tourguide tours and packages in Sarajevo, Bosnia."
      />

      {/* Header */}
      <section style={{
        backgroundColor: 'var(--color-forest-green)',
        padding: isMobile ? '36px 24px 44px' : '48px 40px 56px',
      }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <span style={styles.eyebrow}>Legal</span>
          <h1 style={{ ...styles.headline, fontSize: isMobile ? '30px' : '40px' }}>
            Booking conditions
          </h1>
          <p style={styles.subheading}>
            Everything you need to know before, during, and after booking with us.
          </p>
          <div style={styles.headerMeta}>
            <span style={styles.headerMetaItem}>11 sections</span>
            <span style={styles.headerMetaDot}>·</span>
            <span style={styles.headerMetaItem}>5 min read</span>
          </div>
        </div>
      </section>

      {/* Sticky Nav */}
      <StickyNav activeId={activeId} onScrollTo={scrollTo} isMobile={isMobile} />

      {/* Article */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: isMobile ? '32px 20px 72px' : '48px 40px 96px',
      }}>
        <article style={styles.article}>

          {sections.map(({ id, number, title, content }, idx) => (
            <section
              key={id}
              id={id}
              style={{
                ...styles.section,
                borderTop: idx === 0 ? 'none' : '1px solid var(--color-n300)',
                paddingTop: idx === 0 ? 0 : '40px',
                marginTop: idx === 0 ? 0 : '40px',
              }}
            >
              <div style={styles.sectionHeader}>
                <span style={styles.sectionNumber}>{number}</span>
                <h2 style={styles.sectionTitle}>{title}</h2>
              </div>

              <div style={styles.sectionBody}>
                {content.map((block, j) => {
                  if (block.type === 'p') {
                    return <p key={j} style={styles.bodyText}>{block.text}</p>
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
                        <div style={styles.calloutAccent} />
                        <p style={styles.calloutText}>{block.text}</p>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </section>
          ))}

          {/* CTA */}
          <div style={{
            ...styles.cta,
            flexDirection: isMobile ? 'column' : 'row',
            marginTop: '48px',
          }}>
            <div>
              <p style={styles.ctaTitle}>Questions about these conditions?</p>
              <p style={styles.ctaSubtitle}>We're happy to clarify anything before you book.</p>
            </div>
            <Link to="/contact" style={styles.ctaBtn} className="btn-lift btn-glow-green">
              Get in touch
            </Link>
          </div>

        </article>
      </div>
    </div>
  )
}

const styles = {
  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },

  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 12px 0',
    lineHeight: 1.15,
  },

  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    color: 'rgba(255,255,255,0.72)',
    lineHeight: '1.65',
    margin: '0 0 20px 0',
    maxWidth: '560px',
  },

  headerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },

  headerMetaItem: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
  },

  headerMetaDot: {
    color: 'rgba(255,255,255,0.25)',
  },

  article: {
    minWidth: 0,
  },

  section: {
    scrollMarginTop: '120px',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    marginBottom: '20px',
  },

  sectionNumber: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-forest-green)',
    opacity: 0.6,
    flexShrink: 0,
  },

  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '22px',
    color: 'var(--color-n900)',
    margin: 0,
    lineHeight: 1.25,
  },

  sectionBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingLeft: '28px',
  },

  bodyText: {
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--color-n700)',
    lineHeight: '1.8',
    margin: 0,
  },

  callout: {
    display: 'flex',
    gap: '16px',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '10px',
    padding: '16px 20px',
    boxShadow: 'var(--shadow-sm)',
  },

  calloutAccent: {
    width: '3px',
    borderRadius: '2px',
    backgroundColor: 'var(--color-forest-green)',
    flexShrink: 0,
    alignSelf: 'stretch',
  },

  calloutText: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n700)',
    lineHeight: '1.75',
    margin: 0,
    fontStyle: 'italic',
  },

  bulletsTitle: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '14px',
    color: 'var(--color-n800)',
    margin: '0 0 10px 0',
  },

  bulletList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  bulletItem: {
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--color-n700)',
    lineHeight: '1.7',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },

  bulletDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-forest-green)',
    flexShrink: 0,
    marginTop: '8px',
  },

  cta: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '14px',
    padding: '28px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    boxShadow: 'var(--shadow-sm)',
  },

  ctaTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '18px',
    color: 'var(--color-n900)',
    margin: '0 0 4px 0',
  },

  ctaSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n600)',
    margin: 0,
    lineHeight: '1.6',
  },

  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'var(--color-forest-green)',
    color: '#fff',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '15px',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
}

export default BookingConditions
