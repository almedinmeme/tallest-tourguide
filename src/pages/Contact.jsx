// Contact.jsx
// Channels-first contact page: WhatsApp and email are presented as
// first-class ways to reach us, with the form as the third option.
// Topic chips replace the free-text subject so messages arrive
// pre-triaged (they feed the same EmailJS template via tour_name).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { MapPin, Mail, Clock, Globe, CheckCircle, ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'
import Button from '../components/Button'
import useWindowWidth from '../hooks/useWindowWidth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WHATSAPP_URL = 'https://wa.me/38762664244'

const TOPICS = ['Booking question', 'Private group', 'Partnership', 'Something else']

// Official WhatsApp glyph (Simple Icons path) — same artwork as the
// floating WhatsAppButton, sized for an inline channel row.
function WhatsAppIcon({ size = 20, color = '#fff' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function Contact() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  const [topic, setTopic] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})

  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const clearError = (key) => setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Please enter your name'
    if (!email.trim()) e.email = 'Please enter your email'
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Please enter a valid email'
    if (!message.trim()) e.message = 'Tell us a little about what you need'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (isSending || !validate()) return

    setIsSending(true)
    setIsError(false)

    const templateParams = {
      type: 'Contact',
      tour_name: topic || 'General Enquiry',
      guest_name: name.trim(),
      guest_email: email.trim(),
      message: message.trim(),
    }

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
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
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
      <SEO
        title="Contact Us"
        description="Get in touch with Tallest Tourguide. Questions about tours, private groups, or custom itineraries — we respond within 24 hours."
        url="/contact"
        image="https://tallesttourguide.com/og-image.jpg"
      />

      {/* Editorial header — light, serif, same entrance as the brand pages */}
      <section style={{ padding: isMobile ? '56px 24px 8px' : '80px 24px 16px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <span style={styles.kicker}>Get in touch</span>
          <h1 style={styles.h1}>Talk to a human in Sarajevo.</h1>
          <p style={styles.lede}>
            A question before booking, a private group, a partnership idea — every message
            is read by the people who run the tours, and you'll hear back within 24 hours.
          </p>
        </div>
      </section>

      {/* Channels + form */}
      <section style={{ padding: isMobile ? '36px 24px 72px' : '56px 24px 104px' }}>
        <div
          style={{
            maxWidth: 1040,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '0.85fr 1.15fr',
            gap: isMobile ? 44 : 72,
            alignItems: 'start',
          }}
        >
          {/* ── Direct channels ── */}
          <div>
            <span style={styles.eyebrow}>Fastest ways in</span>

            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="contact-channel" style={styles.channel}>
              <span style={{ ...styles.channelIcon, backgroundColor: '#25D366' }}>
                <WhatsAppIcon size={20} />
              </span>
              <span style={styles.channelBody}>
                <span style={styles.channelLabel}>WhatsApp</span>
                <span style={styles.channelValue}>+387 62 664 244</span>
                <span style={styles.channelNote}>Usually the quickest reply</span>
              </span>
              <ArrowRight size={16} color="var(--color-n400)" style={{ flexShrink: 0 }} />
            </a>

            <a href="mailto:hello@tallesttourguide.com" className="contact-channel" style={styles.channel}>
              <span style={{ ...styles.channelIcon, backgroundColor: 'rgba(46,125,94,0.1)' }}>
                <Mail size={19} color="var(--color-forest-green)" />
              </span>
              <span style={styles.channelBody}>
                <span style={styles.channelLabel}>Email</span>
                <span style={styles.channelValue}>hello@tallesttourguide.com</span>
                <span style={styles.channelNote}>For longer plans and attachments</span>
              </span>
              <ArrowRight size={16} color="var(--color-n400)" style={{ flexShrink: 0 }} />
            </a>

            <div style={styles.factsDivider} />

            <ul style={styles.facts}>
              <li style={styles.fact}>
                <MapPin size={16} color="var(--color-forest-green)" style={{ flexShrink: 0 }} />
                Sarajevo, Bosnia &amp; Herzegovina
              </li>
              <li style={styles.fact}>
                <Clock size={16} color="var(--color-forest-green)" style={{ flexShrink: 0 }} />
                Replies within 24 hours
              </li>
              <li style={styles.fact}>
                <Globe size={16} color="var(--color-forest-green)" style={{ flexShrink: 0 }} />
                English &amp; Bosnian
              </li>
            </ul>

            {/* Cross-sell: planning help is a product, not an email thread */}
            <div style={styles.planBlock}>
              <span style={styles.planLabel}>Planning a whole trip?</span>
              <p style={styles.planText}>
                For proper route planning, book a 60-minute consultation — the fee is
                credited if you book a tour.
              </p>
              <Link to="/consult" style={styles.planLink}>
                Plan your trip with us <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* ── Message form ── */}
          <div style={{ ...styles.formCard, padding: isMobile ? '26px 20px' : '34px 36px' }}>
            {isSuccess ? (
              <div style={styles.success}>
                <CheckCircle size={44} color="var(--color-forest-green)" strokeWidth={1.6} />
                <h2 style={styles.successTitle}>Message received</h2>
                <p style={styles.successText}>
                  Thanks {name.trim()} — we'll reply to <strong>{email.trim()}</strong> within 24 hours.
                </p>
                <Button to="/tours" variant="secondary" style={{ marginTop: 8 }}>
                  Browse tours while you wait
                </Button>
              </div>
            ) : (
              <>
                <span style={styles.eyebrow}>Or send a message</span>

                {/* Topic chips — optional, pre-triage the enquiry */}
                <div style={styles.chipRow} role="group" aria-label="What is this about?">
                  {TOPICS.map((t) => {
                    const active = topic === t
                    return (
                      <button
                        key={t}
                        type="button"
                        className="contact-chip"
                        onClick={() => setTopic(active ? null : t)}
                        aria-pressed={active}
                        style={{
                          ...styles.chip,
                          borderColor: active ? 'var(--color-forest-green)' : 'var(--color-n300)',
                          backgroundColor: active ? 'rgba(46,125,94,0.07)' : 'var(--color-n000)',
                          color: active ? 'var(--color-forest-green)' : 'var(--color-n700)',
                        }}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', gap: 16, flexDirection: isMobile ? 'column' : 'row' }}>
                  <div style={styles.formGroup}>
                    <label htmlFor="contact-name" style={styles.label}>Your name</label>
                    <input
                      id="contact-name"
                      type="text"
                      className="contact-input"
                      style={inputStyle(errors.name)}
                      placeholder="e.g. Amila Hodžić"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); clearError('name') }}
                    />
                    {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="contact-email" style={styles.label}>Email address</label>
                    <input
                      id="contact-email"
                      type="email"
                      className="contact-input"
                      style={inputStyle(errors.email)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError('email') }}
                    />
                    {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="contact-message" style={styles.label}>Message</label>
                  <textarea
                    id="contact-message"
                    className="contact-input"
                    style={{ ...styles.textarea, ...(errors.message ? { borderColor: 'var(--color-error)' } : {}) }}
                    placeholder="Tell us about your group, travel dates, or any questions you have..."
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); clearError('message') }}
                  />
                  {errors.message && <span style={styles.errorText}>{errors.message}</span>}
                </div>

                <Button variant="primary" full onClick={handleSubmit} disabled={isSending}>
                  {isSending ? 'Sending…' : 'Send message'}
                </Button>

                <p style={styles.replyNote}>You'll hear back within 24 hours.</p>

                {isError && (
                  <p style={styles.errorBanner}>
                    Something went wrong. Please try again, or email us directly at hello@tallesttourguide.com.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

const inputStyle = (error) => ({
  height: 'var(--touch-target)',
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 'var(--radius)',
  border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-n300)'}`,
  padding: '0 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body)',
  color: 'var(--color-n900)',
  backgroundColor: 'var(--color-n000)',
})

const styles = {
  kicker: { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-forest-green)' },
  h1: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(30px, 4.4vw, 48px)', lineHeight: 1.12, color: 'var(--color-n900)', margin: '14px 0 0', letterSpacing: '-0.015em' },
  lede: { fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--color-n600)', margin: '18px 0 0', lineHeight: 1.7 },

  eyebrow: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-forest-green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 },

  channel: { display: 'flex', alignItems: 'center', gap: 16, padding: '14px 12px', margin: '0 -12px', borderRadius: 'var(--radius-lg)', textDecoration: 'none' },
  channelIcon: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, flexShrink: 0 },
  channelBody: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 },
  channelLabel: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-n900)' },
  channelValue: { fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 600, color: 'var(--color-forest-green)', overflowWrap: 'anywhere' },
  channelNote: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-n500)' },

  factsDivider: { height: 1, backgroundColor: 'var(--color-n200)', margin: '22px 0' },
  facts: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 },
  fact: { display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-body)', fontSize: 14.5, color: 'var(--color-n700)' },

  planBlock: { marginTop: 30, paddingLeft: 18, borderLeft: '2px solid var(--color-amber)' },
  planLabel: { display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--color-n900)', marginBottom: 6 },
  planText: { fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.6, color: 'var(--color-n600)', margin: '0 0 10px' },
  planLink: { display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14.5, color: 'var(--color-forest-green)', textDecoration: 'none' },

  formCard: { backgroundColor: 'var(--color-n000)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-n200)', boxShadow: 'var(--shadow-sm)' },

  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  chip: { height: 40, padding: '0 16px', borderRadius: 'var(--radius-pill)', border: '1.5px solid var(--color-n300)', backgroundColor: 'var(--color-n000)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, cursor: 'pointer' },

  formGroup: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, flex: 1 },
  label: { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-small)', color: 'var(--color-n800)' },
  textarea: {
    height: 150,
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: 12,
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    lineHeight: 1.6,
  },
  errorText: { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--color-error)' },

  replyNote: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-n500)', textAlign: 'center', margin: '12px 0 0' },
  errorBanner: {
    marginTop: 14,
    padding: '12px 14px',
    borderRadius: 'var(--radius)',
    backgroundColor: 'rgba(229,62,62,0.06)',
    border: '1px solid rgba(229,62,62,0.25)',
    color: 'var(--color-error)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    textAlign: 'center',
  },

  success: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, padding: '28px 0' },
  successTitle: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 26, color: 'var(--color-n900)', margin: '6px 0 0' },
  successText: { fontFamily: 'var(--font-body)', fontSize: 15.5, lineHeight: 1.6, color: 'var(--color-n600)', margin: 0, maxWidth: 380 },
}
