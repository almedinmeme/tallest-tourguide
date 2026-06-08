import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { Check } from 'lucide-react'
import SEO from '../components/SEO'
import { EditorialHero } from '../components/Editorial'
import { getPage } from '../data/pages'
import useWindowWidth from '../hooks/useWindowWidth'

// Reassurances shown beside the enquiry form. Kept truthful to the brand's
// core promise (year-round, local, one point of contact).
const REASSURANCES = [
  'We reply within two business days — to a real person, not a ticket queue.',
  'One local contact for the whole western Balkans.',
  'Year-round presence — we operate in the low season too, not just summer.',
  'Your margins stay yours. We are a ground partner, never a competitor to your brand.',
]

export default function Partners() {
  const page = getPage('partners') || {}
  const hero = page.hero || {}
  const extra = page.extra || {}
  const services = Array.isArray(extra.services) ? extra.services : []
  const tiers = Array.isArray(extra.tiers) ? extra.tiers : []
  const stats = Array.isArray(extra.stats) ? extra.stats : []
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
      <SEO
        title={page.seo?.title || 'For Travel Professionals — Balkans DMC'}
        description={page.seo?.description || 'A year-round destination management partner for agents and operators in the Balkans.'}
        url="/partners"
      />

      <EditorialHero kicker={hero.kicker} heading={hero.heading} subheading={hero.subheading} image={hero.image} imageNote="[Operational image slot — roads, maps, logistics]" />

      {/* Trust stats — credibility at a glance */}
      {stats.length > 0 && (
        <section style={{ padding: isMobile ? '34px 24px' : '48px 24px', borderBottom: '1px solid var(--color-n200)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : `repeat(${stats.length}, 1fr)`, gap: isMobile ? 28 : 0 }}>
            {stats.map((st, i) => (
              <div key={i} style={{ textAlign: 'center', padding: !isMobile && i > 0 ? '0 24px' : 0, borderLeft: !isMobile && i > 0 ? '1px solid var(--color-n200)' : 'none' }}>
                <div style={styles.statValue}>{st.value}</div>
                <div style={styles.statLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services — open capability layout, not boxes */}
      {services.length > 0 && (
        <section style={{ padding: isMobile ? '52px 24px' : '84px 24px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <span style={styles.eyebrow}>What we do on the ground</span>
            <h2 style={styles.h2}>A full destination-management partner</h2>
            <p style={styles.sectionIntro}>
              From a single transfer to an end-to-end programme, your travellers are handled by a local
              team that drives these roads year-round.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', columnGap: 56, rowGap: isMobile ? 28 : 40, marginTop: 40 }}>
              {services.map((sv, i) => (
                <div key={i} style={styles.service}>
                  <span aria-hidden style={styles.serviceBar} />
                  <h3 style={styles.serviceTitle}>{sv.title}</h3>
                  <p style={styles.serviceDetail}>{sv.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tiers — engagement models */}
      {tiers.length > 0 && (
        <section style={{ padding: isMobile ? '52px 24px' : '76px 24px', backgroundColor: 'var(--color-n100)', borderTop: '1px solid var(--color-n200)' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <span style={styles.eyebrow}>Ways to work together</span>
            <h2 style={styles.h2}>Choose the level of support you need</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(tiers.length, 3)}, 1fr)`, gap: isMobile ? 8 : 0, marginTop: 36 }}>
              {tiers.map((t, i) => (
                <div key={i} style={{ ...styles.tier, borderLeft: !isMobile && i > 0 ? '1px solid var(--color-n300)' : 'none', paddingLeft: !isMobile && i > 0 ? 36 : 0, paddingRight: !isMobile ? 36 : 0 }}>
                  <span style={styles.tierNum}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 style={styles.tierName}>{t.name}</h3>
                  <p style={styles.serviceDetail}>{t.detail}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 44 }}>
              {extra.pdfUrl ? (
                <a href={extra.pdfUrl} target="_blank" rel="noreferrer" className="btn-lift" style={styles.pdfBtn}>
                  Download our capability document (PDF)
                  <span aria-hidden style={{ fontSize: 17 }}>↓</span>
                </a>
              ) : (
                <p style={styles.pdfPlaceholder}>[Capability PDF slot — link a one-page DMC capability document here via the Pages editor.]</p>
              )}
            </div>
          </div>
        </section>
      )}

      <PartnerEnquiry isMobile={isMobile} ctaNote={page.cta?.note} />
    </main>
  )
}

function PartnerEnquiry({ isMobile, ctaNote }) {
  const [form, setForm] = useState({ company: '', name: '', email: '', destination: '', dates: '', groupSize: '', service: '', message: '' })
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = () => {
    if (!form.company || !form.name || !form.email) {
      alert('Please fill in your company, name, and email.')
      return
    }
    setIsSending(true)
    setIsError(false)
    const message = [
      `Company: ${form.company}`,
      `Destination(s): ${form.destination || '—'}`,
      `Dates: ${form.dates || '—'}`,
      `Group size: ${form.groupSize || '—'}`,
      `Service needed: ${form.service || '—'}`,
      '',
      form.message,
    ].join('\n')

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { type: 'DMC / Trade Enquiry', tour_name: `Trade enquiry — ${form.company}`, guest_name: form.name, guest_email: form.email, message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setIsSending(false)
        setIsSuccess(true)
      })
      .catch(() => {
        setIsSending(false)
        setIsError(true)
      })
  }

  return (
    <section id="partner-enquiry" style={{ padding: isMobile ? '56px 24px 80px' : '88px 24px 104px', scrollMarginTop: 90, backgroundColor: 'var(--color-n000)', borderTop: '1px solid var(--color-n200)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.85fr 1.15fr', gap: isMobile ? 36 : 64, alignItems: 'start' }}>
        {/* Left — reassurance */}
        <div>
          <span style={styles.eyebrow}>Let's talk</span>
          <h2 style={styles.h2}>Start a conversation</h2>
          <p style={styles.sectionIntro}>
            {ctaNote || 'B2B relationships begin with dialogue, not transactions. Tell us what you’re building and we’ll come back to you.'}
          </p>
          <ul style={styles.reassureList}>
            {REASSURANCES.map((r, i) => (
              <li key={i} style={styles.reassureItem}>
                <Check size={17} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div>
          {isSuccess ? (
            <div style={styles.success}>
              <span style={{ fontSize: 40, color: 'var(--color-success)' }}>✓</span>
              <h3 style={{ fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 24, color: 'var(--color-n900)', margin: '12px 0 8px' }}>Thank you, {form.name}.</h3>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-n600)' }}>We’ll be in touch at {form.email} within two business days.</p>
            </div>
          ) : (
            <div style={styles.formCard}>
              <Row isMobile={isMobile}>
                <Field label="Company name *"><input className="booking-input" style={styles.input} value={form.company} onChange={set('company')} /></Field>
                <Field label="Your name *"><input className="booking-input" style={styles.input} value={form.name} onChange={set('name')} /></Field>
              </Row>
              <Row isMobile={isMobile}>
                <Field label="Email *"><input type="email" className="booking-input" style={styles.input} value={form.email} onChange={set('email')} /></Field>
                <Field label="Destination(s)"><input className="booking-input" style={styles.input} value={form.destination} onChange={set('destination')} placeholder="Bosnia, Montenegro…" /></Field>
              </Row>
              <Row isMobile={isMobile}>
                <Field label="Travel dates"><input className="booking-input" style={styles.input} value={form.dates} onChange={set('dates')} placeholder="Sept 2026" /></Field>
                <Field label="Group size"><input className="booking-input" style={styles.input} value={form.groupSize} onChange={set('groupSize')} placeholder="12 pax" /></Field>
              </Row>
              <Field label="Service needed">
                <select className="booking-input" style={styles.input} value={form.service} onChange={set('service')}>
                  <option value="">Select…</option>
                  <option>Per-booking ground support</option>
                  <option>Seasonal retainer</option>
                  <option>Full itinerary design</option>
                  <option>Guiding & tour leading</option>
                  <option>Destination consultation</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Message">
                <textarea className="booking-input" style={styles.textarea} value={form.message} onChange={set('message')} placeholder="Tell us about the programme you're planning." />
              </Field>
              <button style={{ ...styles.submit, opacity: isSending ? 0.7 : 1 }} className="btn-lift" onClick={handleSubmit} disabled={isSending}>
                {isSending ? 'Sending…' : 'Start a conversation'}
              </button>
              {isError && <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-error)', marginTop: 10 }}>Something went wrong. Please email hello@tallesttourguide.com directly.</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Row({ children, isMobile }) {
  return <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16 }}>{children}</div>
}
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, flex: 1 }}>
      <label style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: 'var(--color-n900)' }}>{label}</label>
      {children}
    </div>
  )
}

const styles = {
  eyebrow: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-forest-green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 },
  h2: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(26px, 3.6vw, 38px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 },
  sectionIntro: { fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.65, color: 'var(--color-n600)', margin: '16px 0 0', maxWidth: 600 },

  statValue: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 'clamp(30px, 4vw, 40px)', color: 'var(--color-forest-green)', letterSpacing: '-0.01em', lineHeight: 1 },
  statLabel: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-n600)', marginTop: 8, letterSpacing: '0.02em' },

  service: {},
  serviceBar: { display: 'block', width: 34, height: 3, borderRadius: 2, backgroundColor: 'var(--color-forest-green)', marginBottom: 16 },
  serviceTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-n900)', margin: '0 0 8px' },
  serviceDetail: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-n600)', margin: 0 },

  tier: { paddingTop: 4 },
  tierNum: { fontFamily: 'var(--font-hero)', fontSize: 30, fontWeight: 500, color: 'var(--color-amber)', lineHeight: 1 },
  tierName: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-n900)', margin: '12px 0 8px' },

  pdfBtn: { display: 'inline-flex', alignItems: 'center', gap: 10, height: 52, padding: '0 28px', backgroundColor: 'var(--color-forest-green)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, borderRadius: 'var(--radius)', textDecoration: 'none' },
  pdfPlaceholder: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-n500)', fontStyle: 'italic', margin: 0 },

  reassureList: { listStyle: 'none', padding: 0, margin: '28px 0 0', display: 'flex', flexDirection: 'column', gap: 16 },
  reassureItem: { display: 'flex', gap: 12, fontFamily: 'var(--font-body)', fontSize: 15.5, lineHeight: 1.6, color: 'var(--color-n800)' },

  formCard: { backgroundColor: 'var(--color-n000)', border: '1px solid var(--color-n300)', borderRadius: 16, padding: 'clamp(22px, 4vw, 32px)', boxShadow: 'var(--shadow-sm)' },
  input: { height: 48, borderRadius: 'var(--radius)', border: '1.5px solid var(--color-n300)', padding: '0 12px', fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-n900)', backgroundColor: 'var(--color-n000)', width: '100%' },
  textarea: { minHeight: 130, borderRadius: 'var(--radius)', border: '1.5px solid var(--color-n300)', padding: 12, fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-n900)', backgroundColor: 'var(--color-n000)', width: '100%', resize: 'vertical', lineHeight: 1.6 },
  submit: { width: '100%', height: 52, backgroundColor: 'var(--color-forest-green)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer' },
  success: { textAlign: 'center', padding: '48px 24px', border: '1px solid var(--color-n300)', borderRadius: 16, backgroundColor: 'var(--color-n000)' },
}
