// Privacy.jsx
// The privacy and cookie policy. Same shape as BookingConditions.jsx — a
// plain-English summary first, then the numbered detail — because the two
// pages are read in the same frame of mind and there is no reason for a
// visitor to have to learn a second layout.
//
// ── Things that must stay true ────────────────────────────────────────
// • The cookie table in section 04 is the actual inventory of what the site
//   loads. If a script, embed or tile provider is added or removed, this
//   table changes with it — a policy that lists tags we don't run (or omits
//   ones we do) is worse than none.
// • The categories here ("Analytics", "Advertising") are the same two the
//   banner offers. Adding a third means adding it in CookieBanner.jsx and
//   bumping CONSENT_VERSION so everyone is asked again.
// • Card details genuinely never reach us: the gateway is not live and
//   Checkout defaults to bank invoice or cash. If a card gateway is wired
//   up, section 02 and section 05 both need revisiting.
import { useState, useEffect } from 'react'
import SEO from '../components/SEO'
import useWindowWidth from '../hooks/useWindowWidth'
import Button from '../components/Button'
import InfoHero from '../components/InfoHero'
import SectionNav from '../components/SectionNav'
import { CONTACT_EMAIL } from '../data/settings'
import { openConsentSettings } from '../utils/consent'

const NAVBAR_HEIGHT = 68

const LAST_UPDATED = 'August 2026'

// ── The short version ──────────────────────────────────────────────────────
const SHORT_POINTS = [
  'We ask for your name, email and phone only because a booking can\'t happen without them.',
  'We never see your card details — there is no card gateway on this site. You pay by bank transfer or in cash.',
  'Nothing that tracks you runs until you say yes. Decline and the site works exactly the same.',
  'We don\'t sell your data, and we don\'t send marketing email you didn\'t ask for.',
  'You can ask to see, correct or delete what we hold, any time, by writing to one address.',
]

const sections = [
  {
    id: 'who-we-are',
    number: '01',
    title: 'Who we are',
    content: [
      {
        type: 'p',
        text: 'Tallest Tourguide is a small guiding business based in Sarajevo. When you book a tour, send an enquiry or simply read this site, we are the "data controller" for the information involved — meaning we decide what is collected and why, and we are the ones answerable for it.',
      },
      {
        type: 'bullets',
        items: [
          'Tallest Tourguide, Hamdije Kreševljakovića 61, 71000 Sarajevo, Bosnia and Herzegovina',
          `Email: ${CONTACT_EMAIL}`,
          'Phone: +387 62 664 244',
        ],
      },
      {
        type: 'p',
        text: 'We are a two-person operation, not a company with a privacy department. Everything below describes what actually happens to your information — not a template we copied.',
      },
      {
        type: 'p',
        text: 'Bosnia and Herzegovina is outside the European Union, but most of our guests are not. Where we offer tours to people in the EU and UK, we treat their information according to the GDPR, which is what this policy is written to.',
      },
    ],
  },
  {
    id: 'what-we-collect',
    number: '02',
    title: 'What we collect',
    content: [
      {
        type: 'p',
        text: 'Only what a given interaction actually needs. There is no account to create and no profile building in the background.',
      },
      {
        type: 'subhead',
        text: 'When you book a tour',
      },
      {
        type: 'bullets',
        items: [
          'Your name, email address and phone number',
          'The tour, date, number of guests, and any promotional code',
          'Anything you choose to write in the notes field — dietary needs, mobility requirements, who you\'re travelling with',
          'A booking reference we generate',
        ],
      },
      {
        type: 'callout',
        text: 'Payment card details are not collected, not stored, and never reach us. The online card gateway is not live: you pay by bank transfer against an invoice we email you, or in cash on the day. If you write card numbers into a message to us, we will ask you to stop and will delete the message.',
      },
      {
        type: 'subhead',
        text: 'When you send an enquiry or request a personalised trip',
      },
      {
        type: 'bullets',
        items: [
          'Your name, email, and whatever you tell us about the trip you have in mind',
          'Your phone number, if you give one',
        ],
      },
      {
        type: 'subhead',
        text: 'When you leave a review',
      },
      {
        type: 'bullets',
        items: [
          'The name you choose to publish under, your rating, and your words',
          'Reviews left on Google or Tripadvisor are governed by those platforms\' own policies, not this one',
        ],
      },
      {
        type: 'subhead',
        text: 'When you simply read the site',
      },
      {
        type: 'p',
        text: 'Our host records standard server logs — IP address, browser, and which page was requested — for security and to keep the site running. If, and only if, you accept analytics cookies, we also learn which pages you read and roughly where in the world you are. Details are in section 04.',
      },
      {
        type: 'p',
        text: 'We do not ask for, and have no use for, special category data — health, religion, politics. Some of our tours cover the siege of Sarajevo and the war; if you tell a guide something personal about your own connection to it, that stays a conversation, not a record.',
      },
    ],
  },
  {
    id: 'why-and-basis',
    number: '03',
    title: 'Why we use it, and our legal basis',
    content: [
      {
        type: 'p',
        text: 'Under the GDPR every use of your information needs a stated justification. Ours:',
      },
      {
        type: 'table',
        head: ['What we do', 'Why we\'re allowed to'],
        rows: [
          ['Take and confirm your booking, hold your seat, email you the details', 'Performance of our contract with you'],
          ['Answer an enquiry or quote a personalised trip', 'Steps taken at your request before a contract'],
          ['Email you an invoice and keep the payment record', 'Contract, and our legal obligations for tax and accounting'],
          ['Keep records required by Bosnian tax and accounting law', 'Legal obligation'],
          ['Publish a review you submitted', 'Your consent, which you can withdraw'],
          ['Analytics and advertising cookies', 'Your consent, which you can withdraw'],
          ['Keep the site secure and working; defend a legal claim if one arises', 'Our legitimate interests'],
          ['Use tour photographs in marketing', 'Our legitimate interests — tell a guide and we won\'t use yours'],
        ],
      },
      {
        type: 'p',
        text: 'We do not send marketing emails to people who have not asked for them, and we do not add booking guests to a mailing list as a side effect of booking.',
      },
    ],
  },
  {
    id: 'cookies',
    number: '04',
    title: 'Cookies & similar technologies',
    content: [
      {
        type: 'p',
        text: 'When you first arrive, a banner asks what you are willing to allow. Until you answer, nothing that identifies you is written — the analytics and advertising tags load in a restricted mode that cannot set identifiers. Choosing "Essential only" keeps them that way permanently. Nothing on this site is withheld from you for declining.',
      },
      {
        type: 'p',
        text: 'This is the complete inventory of what the site loads:',
      },
      {
        type: 'table',
        head: ['What', 'Category', 'What it does'],
        rows: [
          ['Consent record', 'Strictly necessary', 'Stores your answer to the banner so you aren\'t asked on every page. Held in your browser; never sent to us.'],
          ['Booking state', 'Strictly necessary', 'Keeps a half-finished booking and your chosen currency alive while you move around the site.'],
          ['Google Analytics (GA4)', 'Analytics', 'Counts page views and tells us where readers lose interest. Set by Google. Off unless you accept.'],
          ['Google Ads', 'Advertising', 'Tells us which advert led to a booking, and can be used for remarketing. Set by Google. Off unless you accept.'],
          ['Google Fonts', 'Strictly necessary', 'Serves the site\'s typefaces. Sets no cookies, but Google receives your IP address as part of the request.'],
          ['CARTO map tiles', 'Strictly necessary', 'Draws the maps on route and accommodation pages. Loads only on pages with a map.'],
          ['Calendly', 'Strictly necessary', 'The scheduling window on the consultation page only. Sets its own cookies when you interact with it — see Calendly\'s policy.'],
        ],
      },
      {
        type: 'p',
        text: 'Changed your mind? Reopen the banner and set it differently — the link is below and in the footer of every page. Withdrawing is as easy as agreeing was, which is the point.',
      },
      { type: 'consent-button' },
      {
        type: 'p',
        text: 'You can also clear or block cookies in your browser settings. If you clear them, our record of your choice goes too, and the banner will ask again.',
      },
    ],
  },
  {
    id: 'who-we-share-with',
    number: '05',
    title: 'Who else touches it',
    content: [
      {
        type: 'p',
        text: 'We do not sell your information, and we do not share it for anyone else\'s marketing. A small number of service providers process it on our behalf, under their terms:',
      },
      {
        type: 'table',
        head: ['Who', 'What they handle', 'Where'],
        rows: [
          ['Google (Workspace)', 'Your booking is written to our Bookings calendar and a booking ledger; our email runs through it', 'EU / US'],
          ['EmailJS', 'Delivers your confirmation email and our notification', 'US'],
          ['Netlify', 'Hosts the site; keeps standard server logs', 'US / global'],
          ['Google (Analytics & Ads)', 'Only if you accepted those cookies', 'EU / US'],
          ['Calendly', 'Only if you book a consultation slot', 'US'],
          ['Our guides and local hosts', 'Your first name, group size and any access or dietary needs — the minimum to look after you on the day', 'Bosnia and Herzegovina'],
        ],
      },
      {
        type: 'p',
        text: 'We will also disclose information where the law requires it — but we have never been asked to, and we would tell you if we could.',
      },
    ],
  },
  {
    id: 'transfers',
    number: '06',
    title: 'Sending data outside the EU',
    content: [
      {
        type: 'p',
        text: 'We are in Bosnia and Herzegovina, and some of our providers are in the United States. If you are in the EU or UK, that means your information leaves the area your law protects it in. We would rather say this plainly than bury it.',
      },
      {
        type: 'p',
        text: 'Bosnia and Herzegovina does not have an EU adequacy decision — the EU has not formally ruled that our data protection law matches its own. For your booking, the transfer is permitted because it is necessary to perform the contract you asked us to enter into: we cannot guide you around Sarajevo without knowing who is arriving and when.',
      },
      {
        type: 'p',
        text: 'For our US providers, transfers rely on the European Commission\'s Standard Contractual Clauses, and — for Google — its certification under the EU–US Data Privacy Framework.',
      },
      {
        type: 'p',
        text: 'For anything not necessary to your booking, such as analytics and advertising, the transfer happens only because you consented, and stops if you withdraw.',
      },
    ],
  },
  {
    id: 'retention',
    number: '07',
    title: 'How long we keep it',
    content: [
      {
        type: 'table',
        head: ['What', 'How long'],
        rows: [
          ['Booking and payment records', 'For the period Bosnian tax and accounting law requires us to keep financial records'],
          ['Enquiries that never became bookings', '24 months, then deleted'],
          ['Calendar entries for completed tours', '24 months, then deleted'],
          ['Published reviews', 'Until you ask us to remove them'],
          ['Your cookie choice', '12 months, then the banner asks again'],
          ['Analytics data', 'Held by Google on its own retention schedule, no longer than 14 months'],
        ],
      },
      {
        type: 'p',
        text: 'When a retention period ends we delete the record rather than archiving it indefinitely. If you ask us to delete something sooner, see section 08.',
      },
    ],
  },
  {
    id: 'your-rights',
    number: '08',
    title: 'Your rights',
    content: [
      {
        type: 'p',
        text: 'If you are in the EU or UK these are rights in law; if you are elsewhere, we extend the same ones to you anyway, because running two standards would be worse for everybody.',
      },
      {
        type: 'bullets',
        items: [
          'See what we hold about you, and get a copy',
          'Have anything wrong corrected',
          'Have it deleted, where we have no obligation to keep it',
          'Ask us to pause using it while a dispute is sorted out',
          'Receive it in a portable, machine-readable form',
          'Object to any use we justify by our own legitimate interests — including tour photography',
          'Withdraw consent at any time, without it affecting anything done before you withdrew',
        ],
      },
      {
        type: 'p',
        text: `To exercise any of these, write to ${CONTACT_EMAIL}. There is no form. We will reply within 30 days, and there is no charge. We may ask you to confirm your identity first — only so that we don't hand your booking history to someone who isn't you.`,
      },
      {
        type: 'p',
        text: 'If you are unhappy with how we have handled it, you can complain to the data protection authority where you live, or to Bosnia\'s Personal Data Protection Agency (Agencija za zaštitu ličnih podataka u BiH). We would much rather you told us first and gave us the chance to fix it.',
      },
    ],
  },
  {
    id: 'security',
    number: '09',
    title: 'Keeping it safe',
    content: [
      {
        type: 'p',
        text: 'The site is served entirely over HTTPS. Booking data goes to accounts protected by two-factor authentication, accessible only to the two of us. We keep the number of places your information lives deliberately small — the strongest protection available to an operation our size is simply not spreading data around.',
      },
      {
        type: 'p',
        text: 'No system is perfect. If a breach ever affected your information and put you at real risk, we would tell you and the relevant authority, without waiting to be asked.',
      },
    ],
  },
  {
    id: 'children',
    number: '10',
    title: 'Children',
    content: [
      {
        type: 'p',
        text: 'Our tours are open to families, and children are welcome on them. This website, though, is aimed at the adult making the booking: we don\'t knowingly collect information directly from children, and a child\'s details reach us only through the parent or guardian booking for them. If you believe we hold information a child gave us directly, tell us and we will delete it.',
      },
    ],
  },
  {
    id: 'changes',
    number: '11',
    title: 'Changes to this policy',
    content: [
      {
        type: 'p',
        text: `This policy was last updated in ${LAST_UPDATED}. When we change it we update that date. If a change materially affects what you agreed to — a new category of tracking, a new provider handling your booking — we will ask for your consent again rather than relying on you to re-read this page.`,
      },
    ],
  },
]

function Privacy() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const [activeId, setActiveId] = useState('who-we-are')

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
        title="Privacy & Cookies"
        description="What Tallest Tourguide collects when you book a tour in Bosnia, why, who else sees it, and how to have it deleted. Plain English, no template."
        url="/privacy"
      />

      <InfoHero
        kicker="Privacy"
        title="Privacy & cookies"
        lede="What we collect, why we need it, and how to get rid of it. Written to be read once and understood, not to be scrolled past."
        meta={`Last updated ${LAST_UPDATED} · 11 sections · 7 min read`}
        overlap
      />

      {/* The short version — a card pulled up over the hero's lower edge */}
      <section style={{ padding: isMobile ? '0 24px 40px' : '0 24px 56px' }}>
        <div style={{ ...styles.shortPanel, marginTop: isMobile ? -64 : -92 }}>
          <span aria-hidden style={styles.shortRule} />
          <h2 style={styles.shortTitle}>The short version</h2>
          <ul style={styles.shortList}>
            {SHORT_POINTS.map((t) => (
              <li key={t} style={styles.shortItem}><span style={styles.shortDot} />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <SectionNav sections={sections} activeId={activeId} onScrollTo={scrollTo} isMobile={isMobile} />

      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: isMobile ? '32px 20px 72px' : '48px 40px 96px',
      }}>
        <article style={{ minWidth: 0 }}>
          <p style={styles.finePrintIntro}>The detail, section by section.</p>

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
                  if (block.type === 'subhead') {
                    return <h3 key={j} style={styles.subhead}>{block.text}</h3>
                  }
                  if (block.type === 'bullets') {
                    return (
                      <ul key={j} style={styles.bulletList}>
                        {block.items.map((item, k) => (
                          <li key={k} style={styles.bulletItem}>
                            <span style={styles.bulletDot} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  if (block.type === 'table') {
                    return (
                      <div key={j} style={styles.tableScroll}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              {block.head.map((h) => (
                                <th key={h} style={styles.th}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map((row, k) => (
                              <tr key={k}>
                                {row.map((cell, l) => (
                                  <td key={l} style={{
                                    ...styles.td,
                                    color: l === 0 ? 'var(--color-n900)' : 'var(--color-n700)',
                                    fontWeight: l === 0 ? 600 : 400,
                                  }}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
                  if (block.type === 'consent-button') {
                    return (
                      <div key={j} style={{ margin: '4px 0' }}>
                        <Button variant="secondary" size="sm" onClick={openConsentSettings}>
                          Change your cookie choices
                        </Button>
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
              <p style={styles.ctaTitle}>Want to know what we hold about you?</p>
              <p style={styles.ctaSubtitle}>Ask, and we'll tell you — no form, no charge.</p>
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
  shortList: { listStyle: 'none', margin: '20px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 11 },
  shortItem: { display: 'flex', gap: 10, fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.6, color: 'var(--color-n800)' },
  shortDot: { width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-amber)', flexShrink: 0, marginTop: 8 },

  finePrintIntro: { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-n500)', margin: '0 0 32px' },

  sectionHeader: { display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '18px' },
  sectionNumber: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: '15px', color: 'var(--color-amber)', flexShrink: 0 },
  sectionTitle: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 'clamp(20px, 2.6vw, 24px)', color: 'var(--color-n900)', margin: 0, lineHeight: 1.25, letterSpacing: '-0.01em' },
  sectionBody: { display: 'flex', flexDirection: 'column', gap: '16px' },
  bodyText: { fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-n700)', lineHeight: '1.8', margin: 0 },
  subhead: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-forest-green)', margin: '8px 0 -4px' },

  callout: { borderLeft: '2px solid var(--color-amber)', backgroundColor: 'var(--color-n100)', borderRadius: '0 10px 10px 0', padding: '14px 18px' },
  calloutText: { fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n700)', lineHeight: '1.75', margin: 0 },

  bulletList: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' },
  bulletItem: { fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-n700)', lineHeight: '1.7', display: 'flex', alignItems: 'flex-start', gap: '10px' },
  bulletDot: { width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-forest-green)', flexShrink: 0, marginTop: '8px' },

  // Tables carry the cookie, processor and retention inventories. They're the
  // one place a policy earns its keep by being scannable, so they get a real
  // table — with its own horizontal scroll so the page body never does.
  tableScroll: { overflowX: 'auto', margin: '2px 0', WebkitOverflowScrolling: 'touch' },
  table: { borderCollapse: 'collapse', width: '100%', minWidth: 460 },
  th: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    color: 'var(--color-n500)',
    textAlign: 'left',
    padding: '0 14px 9px 0',
    borderBottom: '1px solid var(--color-n300)',
    whiteSpace: 'nowrap',
  },
  td: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    lineHeight: 1.6,
    padding: '11px 14px 11px 0',
    borderBottom: '1px solid var(--color-n200)',
    verticalAlign: 'top',
  },

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

export default Privacy
