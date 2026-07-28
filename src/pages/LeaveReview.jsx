// /review/:slug — where a guest is sent after their tour.
//
// This used to be a star-rating form that wrote to the Airtable Reviews
// table. It now points guests at Google and Tripadvisor instead, because a
// review left there builds the public rating that wins future bookings,
// while one collected into our own database only decorates our own site.
//
// The private-feedback form below is the honest other half: not every guest
// wants to say a thing in public, and the ones who had a bad time should be
// able to reach us directly rather than being funnelled onto a review page.
// It goes out over the existing EmailJS `enquiry` template — no new account,
// no new store.
//
// The route is kept (rather than removed with the form) so links already
// printed on cards, in emails and in the wild still land somewhere useful.

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react'
import tours from '../data/tours'
import { packages } from '../data/packages'
import useWindowWidth from '../hooks/useWindowWidth'
import Button from '../components/Button'
import ReviewSourceMark from '../components/ReviewSourceMark'
import { googleStats, tripadvisorStats } from '../data/reviewFeed'
import { sendEmail } from '../utils/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function slugToTitle(slug) {
  return (slug || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function LeaveReview() {
  const { slug } = useParams()
  const width = useWindowWidth()
  const isMobile = width <= 768

  const tour = tours.find((t) => t.slug === slug)
  const pkg = !tour ? packages.find((p) => p.slug === slug) : null
  const displayName = tour ? tour.title : pkg ? pkg.name : slugToTitle(slug)
  const backPath = tour ? `/tours/${slug}` : `/multi-day-tours/${slug}`

  const platforms = [googleStats, tripadvisorStats].filter((p) => p.url)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — humans never see it
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = async () => {
    if (website.trim()) { setStatus('success'); return } // bot — fake success
    if (!name.trim() || !message.trim()) {
      setError('Please add your name and a message.')
      return
    }
    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      setError('That email address doesn’t look right.')
      return
    }

    setError('')
    setStatus('sending')
    try {
      await sendEmail('enquiry', {
        enquiry_type: 'Private feedback',
        subject: `Feedback — ${displayName}`,
        from_name: name.trim(),
        from_email: email.trim() || 'Not provided',
        message: message.trim(),
      })
      setStatus('success')
    } catch (err) {
      console.error('LeaveReview feedback error:', err)
      setStatus('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-n100)' }}>
      {/* Guest-only page — keep it out of search results. */}
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div style={styles.heroBand}>
        <div style={styles.heroInner}>
          <span style={styles.heroEyebrow}>Share your experience</span>
          <h1 style={styles.heroTitle}>{displayName}</h1>
        </div>
      </div>

      <div style={{ ...styles.cardWrap, padding: isMobile ? '24px 16px 48px' : '40px 24px 64px' }}>
        <div style={styles.card}>
          {status === 'success' ? (
            <div style={styles.successBox}>
              <div style={styles.successIcon}>
                <CheckCircle size={40} color="var(--color-forest-green)" />
              </div>
              <h2 style={styles.successTitle}>Thank you</h2>
              <p style={styles.successText}>
                Your message has reached us directly and we read every one.
              </p>
              <Link to={backPath} style={styles.backLink}>
                <ArrowLeft size={14} />
                Back to {displayName}
              </Link>
            </div>
          ) : (
            <>
              <h2 style={styles.formTitle}>How was your tour?</h2>
              <p style={styles.formSubtitle}>
                If you enjoyed it, a public review is the single most useful thing you can
                leave us — it&rsquo;s how the next traveller decides. It takes a minute.
              </p>

              <div style={styles.platformList}>
                {platforms.map((p) => (
                  <a
                    key={p.source}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.platformBtn}
                  >
                    <ReviewSourceMark source={p.source} size={20} />
                    <span style={styles.platformLabel}>Review us on {p.label}</span>
                    <ExternalLink size={14} color="var(--color-n600)" />
                  </a>
                ))}
              </div>

              <div style={styles.divider} />

              {!showForm ? (
                <button type="button" onClick={() => setShowForm(true)} style={styles.disclosure}>
                  Rather tell us privately?
                </button>
              ) : (
                <>
                  <p style={styles.privateLead}>
                    This comes straight to us and goes nowhere public.
                  </p>

                  {error && (
                    <div style={styles.errorBox}>
                      <p style={styles.errorText}>{error}</p>
                    </div>
                  )}
                  {status === 'error' && (
                    <div style={styles.errorBox}>
                      <p style={styles.errorText}>
                        That didn&rsquo;t send. Please try again, or email us directly.
                      </p>
                    </div>
                  )}

                  <div style={styles.field}>
                    <label style={styles.label}>Your name <span style={styles.required}>*</span></label>
                    <input
                      type="text"
                      placeholder="Sarah M."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={styles.input}
                      className="booking-input"
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>
                      Email <span style={styles.optional}>(optional, if you&rsquo;d like a reply)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.input}
                      className="booking-input"
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Your message <span style={styles.required}>*</span></label>
                    <textarea
                      placeholder="What worked, what didn't, anything we should know…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      style={styles.textarea}
                      className="booking-input"
                    />
                  </div>

                  {/* Honeypot — hidden from humans; bots that fill it get a fake success */}
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                  />

                  <Button
                    variant="secondary"
                    onClick={handleSubmit}
                    disabled={status === 'sending'}
                    style={{ width: '100%' }}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send feedback'}
                  </Button>
                </>
              )}

              <Link to={backPath} style={{ ...styles.backLink, marginTop: '24px' }}>
                <ArrowLeft size={14} />
                Back to {displayName}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  heroBand: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '48px 24px 52px',
    textAlign: 'center',
  },
  heroInner: {
    maxWidth: '560px',
    margin: '0 auto',
  },
  heroEyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  heroTitle: {
    fontFamily: 'var(--font-hero)',
    fontWeight: '700',
    fontSize: '32px',
    color: '#fff',
    margin: 0,
    lineHeight: 1.25,
  },
  cardWrap: {
    maxWidth: '560px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '36px 32px',
    boxShadow: 'var(--shadow-md)',
  },
  formTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '22px',
    color: 'var(--color-n900)',
    marginBottom: '6px',
  },
  formSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  platformList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  platformBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    backgroundColor: 'var(--color-n000)',
    textDecoration: 'none',
  },
  platformLabel: {
    flex: 1,
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    margin: '28px 0 20px',
  },
  disclosure: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    textDecoration: 'underline',
  },
  privateLead: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },
  required: {
    color: 'var(--color-error)',
    marginLeft: '2px',
  },
  optional: {
    fontWeight: '400',
    color: 'var(--color-n600)',
    fontSize: '12px',
    marginLeft: '4px',
  },
  input: {
    height: '44px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '0 14px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  },
  textarea: {
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '12px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    lineHeight: '1.6',
    outline: 'none',
  },
  errorBox: {
    marginBottom: '16px',
    padding: '12px 14px',
    backgroundColor: 'rgba(229,62,62,0.06)',
    borderRadius: 'var(--radius)',
    border: '1px solid rgba(229,62,62,0.2)',
  },
  errorText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-error)',
    margin: 0,
  },
  successBox: {
    textAlign: 'center',
    padding: '16px 0',
  },
  successIcon: {
    marginBottom: '16px',
  },
  successTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '24px',
    color: 'var(--color-n900)',
    marginBottom: '10px',
  },
  successText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },
}

export default LeaveReview
