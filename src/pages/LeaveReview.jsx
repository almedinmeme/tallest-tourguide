// /review/:slug — the link we send a guest after their tour. Also /review,
// with no tour, for a link that can be printed on a card and handed over.
//
// It has three jobs, in this order:
//   1. Thank them properly. This is the last thing they see from us.
//   2. Ask for the one thing that actually helps — a public review on Google
//      or Tripadvisor. A review collected into our own database only
//      decorates our own site; one left there builds the rating that wins the
//      next booking.
//   3. Give them somewhere to go next. Someone who just had a good day is the
//      likeliest person in the world to book a second trip or send a friend,
//      and a dead-end thank-you page wastes that.
//
// The private-feedback form is the honest other half: not everyone wants to
// say a thing in public, and someone who had a bad time should be able to
// reach us directly rather than being funnelled onto a review page. It goes
// out over the existing EmailJS `enquiry` template — no new account, no store.
//
// noindex: this is a guest-only page, not a landing page.

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Check, Link2, MessageCircle } from 'lucide-react'
import tours from '../data/tours'
import { packages } from '../data/packages'
import { posts } from '../data/journal'
import Button from '../components/Button'
import Img from '../components/Img'
import ReviewSourceMark from '../components/ReviewSourceMark'
import { googleStats, tripadvisorStats, overallStats } from '../data/reviewFeed'
import { WHATSAPP_URL } from '../data/settings'
import { sendEmail } from '../utils/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const css = `
  .lr { background-color: var(--color-n100); min-height: 100vh; }

  /* ── Thank you ────────────────────────────────────────────────── */
  /* Same forest-and-grain treatment as the homepage reviews section, so the
     page a guest lands on after the tour still looks like us. */
  .lr__hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: 56px 20px 60px;
    text-align: center;
    color: #fff;
    background:
      radial-gradient(70% 60% at 12% -10%, rgba(244,161,48,0.18) 0%, rgba(244,161,48,0) 66%),
      radial-gradient(120% 95% at 20% 0%, #1F5540 0%, #143222 55%, #0F281B 100%);
  }
  .lr__hero::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 0.05;
    pointer-events: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>");
  }
  .lr__heroInner { max-width: 640px; margin: 0 auto; }
  .lr__eyebrow {
    display: block;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-amber);
    margin-bottom: 16px;
  }
  .lr__heroTitle {
    font-family: var(--font-hero);
    font-weight: 300;
    font-size: clamp(30px, 5.5vw, 44px);
    line-height: 1.15;
    letter-spacing: -0.01em;
    color: #fff;
    margin: 0;
  }
  .lr__heroSub {
    font-family: var(--font-body);
    font-size: var(--text-body);
    line-height: 1.6;
    color: rgba(255,255,255,0.72);
    margin: 16px 0 0;
  }
  .lr__heroTour {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    padding: 7px 14px;
    border-radius: var(--radius-pill);
    border: 1px solid rgba(255,255,255,0.22);
    font-family: var(--font-body);
    font-size: var(--text-small);
    font-weight: 600;
    color: #fff;
  }

  /* ── Body ─────────────────────────────────────────────────────── */
  .lr__body { max-width: 640px; margin: 0 auto; padding: 28px 20px 8px; }
  .lr__card {
    background-color: var(--color-n000);
    border: 1px solid var(--color-n200);
    border-radius: var(--radius-lg);
    padding: 28px 24px;
    box-shadow: var(--shadow-sm);
  }
  .lr__stars { display: flex; justify-content: center; gap: 6px; margin-bottom: 18px; }
  .lr__title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-h3);
    color: var(--color-n900);
    text-align: center;
    margin: 0 0 8px;
  }
  .lr__lead {
    font-family: var(--font-body);
    font-size: var(--text-small);
    line-height: 1.65;
    color: var(--color-n600);
    text-align: center;
    margin: 0 auto 22px;
    max-width: 44ch;
  }
  .lr__platforms { display: flex; flex-direction: column; gap: 12px; }
  .lr__platform {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 15px 18px;
    border-radius: var(--radius);
    border: 1.5px solid var(--color-n300);
    background-color: var(--color-n000);
    text-decoration: none;
    transition: border-color var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
  }
  .lr__platform:hover {
    border-color: var(--color-forest-green);
    box-shadow: 0 6px 18px rgba(26,26,46,0.08);
    transform: translateY(-1px);
  }
  .lr__platformText { flex: 1; min-width: 0; }
  .lr__platformName {
    display: block;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: var(--text-body);
    color: var(--color-n900);
  }
  .lr__platformMeta {
    display: block;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    color: var(--color-n500);
    margin-top: 2px;
  }
  .lr__platformGo { color: var(--color-forest-green); flex-shrink: 0; }
  .lr__reassure {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 18px 0 0;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    line-height: 1.6;
    color: var(--color-n500);
  }
  .lr__rule { height: 1px; background-color: var(--color-n200); margin: 24px 0 18px; }
  .lr__disclosure {
    display: block;
    width: 100%;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: center;
    font-family: var(--font-body);
    font-size: var(--text-small);
    font-weight: 600;
    color: var(--color-n600);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .lr__disclosure:hover { color: var(--color-forest-green); }

  /* ── What's next ──────────────────────────────────────────────── */
  .lr__next { max-width: 880px; margin: 0 auto; padding: 40px 20px 64px; }
  .lr__nextHead {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--color-n200);
    margin-bottom: 8px;
  }
  .lr__nextTitle {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--text-h3);
    color: var(--color-n900);
    margin: 0;
  }
  .lr__nextHint {
    font-family: var(--font-body);
    font-size: var(--text-small);
    color: var(--color-n500);
  }
  .lr__trips { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 4px 24px; }
  .lr__trip {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid var(--color-n200);
    text-decoration: none;
    color: inherit;
  }
  .lr__trip img {
    width: 68px;
    height: 52px;
    object-fit: cover;
    border-radius: var(--radius);
    flex-shrink: 0;
  }
  .lr__tripText { min-width: 0; }
  .lr__tripName {
    display: block;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: var(--text-small);
    color: var(--color-n900);
    line-height: 1.35;
  }
  .lr__trip:hover .lr__tripName { color: var(--color-forest-green); }
  .lr__tripMeta {
    display: block;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    color: var(--color-n500);
    margin-top: 3px;
  }
  .lr__more { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
  .lr__chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 16px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--color-n300);
    background-color: var(--color-n000);
    font-family: var(--font-body);
    font-size: var(--text-small);
    font-weight: 600;
    color: var(--color-n800);
    text-decoration: none;
    cursor: pointer;
    transition: border-color var(--t-fast), color var(--t-fast);
  }
  .lr__chip:hover { border-color: var(--color-forest-green); color: var(--color-forest-green); }
  .lr__chipText {
    display: block;
    max-width: 30ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Form ─────────────────────────────────────────────────────── */
  .lr__field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
  .lr__label {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: var(--text-small);
    color: var(--color-n900);
  }
  .lr__optional { font-weight: 400; color: var(--color-n500); font-size: var(--text-tiny); }
  .lr__error {
    margin-bottom: 16px;
    padding: 12px 14px;
    border-radius: var(--radius);
    border: 1px solid rgba(229,62,62,0.22);
    background-color: rgba(229,62,62,0.06);
    font-family: var(--font-body);
    font-size: var(--text-small);
    color: var(--color-error);
  }
  .lr a:focus-visible, .lr button:focus-visible {
    outline: 2px solid var(--color-forest-green);
    outline-offset: 3px;
  }
`

const inputStyle = {
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
}

function BigStars() {
  return (
    <div className="lr__stars" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="26" height="26" viewBox="0 0 24 24" fill="var(--color-amber)">
          <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6-5.9-3.2-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z" />
        </svg>
      ))}
    </div>
  )
}

// Something to do next, from the same city where possible, never the trip
// they've just been on.
function suggestions(currentSlug) {
  const taken = tours.find((t) => t.slug === currentSlug)
  const pool = tours.filter((t) => t.slug !== currentSlug)
  const sameCity = taken ? pool.filter((t) => t.city === taken.city) : []
  const rest = pool.filter((t) => !sameCity.includes(t))
  return [...sameCity, ...rest].slice(0, 3)
}

function LeaveReview() {
  const { slug } = useParams()

  const tour = tours.find((t) => t.slug === slug)
  const pkg = !tour ? packages.find((p) => p.slug === slug) : null
  const tourName = tour ? tour.title : pkg ? pkg.name : ''
  const shortName = (tourName || '').split(':')[0].trim()

  const platforms = [googleStats, tripadvisorStats].filter((p) => p.url)
  const trips = suggestions(slug)
  const read = posts.slice(0, 1)

  const [showForm, setShowForm] = useState(false)
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — humans never see it
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle')

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${tour ? `/tours/${slug}/` : pkg ? `/multi-day-tours/${slug}/` : '/'}`
      : 'https://tallesttourguide.com/'

  const share = async () => {
    // Native share sheet on phones; clipboard everywhere else.
    if (navigator.share) {
      try {
        await navigator.share({ title: shortName || 'Tallest Tourguide & Friends', url: shareUrl })
        return
      } catch { /* dismissed — fall through to copying */ }
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* clipboard blocked — the link is visible in the address bar anyway */ }
  }

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
        subject: `Feedback — ${shortName || 'after a tour'}`,
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
    <div className="lr">
      <style>{css}</style>
      <Helmet>
        <title>Thank you — Tallest Tourguide &amp; Friends</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <header className="lr__hero">
        <div className="lr__heroInner">
          <span className="lr__eyebrow">Hvala</span>
          <h1 className="lr__heroTitle">Thank you for spending the day with us.</h1>
          <p className="lr__heroSub">
            We hope you go home with more of Bosnia than you arrived with.
          </p>
          {shortName && (
            <span className="lr__heroTour">
              <Check size={14} color="var(--color-amber)" />
              {shortName}
            </span>
          )}
        </div>
      </header>

      <div className="lr__body">
        <div className="lr__card">
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <CheckCircle size={40} color="var(--color-forest-green)" style={{ marginBottom: 14 }} />
              <h2 className="lr__title">Thank you — that reached us</h2>
              <p className="lr__lead">
                It comes straight to us and we read every one. If you left an email address,
                you&rsquo;ll hear back from us.
              </p>
            </div>
          ) : (
            <>
              <BigStars />
              <h2 className="lr__title">Would you say so publicly?</h2>
              <p className="lr__lead">
                A review is how the next traveller decides — it takes about a minute, and it
                counts for far more than anything we could say about ourselves.
              </p>

              <div className="lr__platforms">
                {platforms.map((p) => (
                  <a
                    key={p.source}
                    className="lr__platform"
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ReviewSourceMark source={p.source} size={24} />
                    <span className="lr__platformText">
                      <span className="lr__platformName">Review us on {p.label}</span>
                      <span className="lr__platformMeta">
                        {p.rating ? `${p.rating.toFixed(1)} from ${p.count.toLocaleString('en-GB')} reviews · ` : ''}
                        about a minute
                      </span>
                    </span>
                    <ArrowRight size={18} className="lr__platformGo" />
                  </a>
                ))}
              </div>

              <p className="lr__reassure">
                <Check size={14} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                In your own words, on your own account. We never see it before it&rsquo;s published,
                and we can&rsquo;t edit or remove it.
              </p>

              <div className="lr__rule" />

              {!showForm ? (
                <button type="button" className="lr__disclosure" onClick={() => setShowForm(true)}>
                  Something you&rsquo;d rather tell us privately?
                </button>
              ) : (
                <>
                  <p className="lr__lead" style={{ marginBottom: 18 }}>
                    This comes straight to us and goes nowhere public.
                  </p>

                  {error && <div className="lr__error">{error}</div>}
                  {status === 'error' && (
                    <div className="lr__error">
                      That didn&rsquo;t send. Please try again, or email us directly.
                    </div>
                  )}

                  <div className="lr__field">
                    <label className="lr__label" htmlFor="lr-name">Your name</label>
                    <input
                      id="lr-name"
                      type="text"
                      placeholder="Sarah M."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={inputStyle}
                      className="booking-input"
                    />
                  </div>

                  <div className="lr__field">
                    <label className="lr__label" htmlFor="lr-email">
                      Email <span className="lr__optional">(optional, if you&rsquo;d like a reply)</span>
                    </label>
                    <input
                      id="lr-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={inputStyle}
                      className="booking-input"
                    />
                  </div>

                  <div className="lr__field">
                    <label className="lr__label" htmlFor="lr-message">Your message</label>
                    <textarea
                      id="lr-message"
                      placeholder="What worked, what didn't, anything we should know…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      style={{ ...inputStyle, height: 'auto', padding: '12px 14px', lineHeight: 1.6, resize: 'vertical' }}
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

                  <Button variant="secondary" onClick={handleSubmit} disabled={status === 'sending'} full>
                    {status === 'sending' ? 'Sending…' : 'Send feedback'}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Somewhere to go next ──────────────────────────────────
          A guest who has just had a good day is the likeliest person
          to book a second one or send a friend. */}
      <section className="lr__next">
        <div className="lr__nextHead">
          <h2 className="lr__nextTitle">While you&rsquo;re still here</h2>
          {overallStats.rating > 0 && (
            <span className="lr__nextHint">
              {overallStats.rating.toFixed(1)} from {overallStats.count.toLocaleString('en-GB')} travellers
            </span>
          )}
        </div>

        <div className="lr__trips">
          {trips.map((t) => (
            <Link key={t.slug} className="lr__trip" to={`/tours/${t.slug}`}>
              <Img src={t.hero} alt="" width={68} height={52} sizes="68px" />
              <span className="lr__tripText">
                <span className="lr__tripName">{(t.title || '').split(':')[0].trim()}</span>
                <span className="lr__tripMeta">
                  {[t.city, t.duration].filter(Boolean).join(' · ')}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="lr__more">
          <button type="button" className="lr__chip" onClick={share}>
            {copied ? <Check size={15} /> : <Link2 size={15} />}
            {copied ? 'Link copied' : 'Send this to a friend'}
          </button>
          {read.map((p) => (
            <Link key={p.slug} className="lr__chip" to={`/journal/${p.slug}`}>
              <span className="lr__chipText">Read: {p.title}</span>
            </Link>
          ))}
          <a className="lr__chip" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={15} />
            Say hello on WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}

export default LeaveReview
