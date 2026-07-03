import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronDown, ArrowRight, Compass, Map as MapIcon } from 'lucide-react'
import SEO from '../components/SEO'
import RichContent from '../components/RichContent'
import Img from '../components/Img'
import { Placeholder } from '../components/Editorial'
import { getPage } from '../data/pages'
import useWindowWidth from '../hooks/useWindowWidth'
import useInView from '../hooks/useInView'
import Button from '../components/Button'

// Short trust signals for the hero — all true to the offer / FAQ.
const TRUST_CHIPS = ['60-min video call', 'Written summary included', 'Reschedule free up to 24h', 'Fee credited to a tour']

export default function Consult() {
  const page = getPage('consult') || {}
  const hero = page.hero || {}
  const extra = page.extra || {}
  const includes = Array.isArray(extra.includes) ? extra.includes : []
  const forWho = Array.isArray(extra.forWho) ? extra.forWho : []
  const testimonials = Array.isArray(extra.testimonials) ? extra.testimonials : []
  const faqs = Array.isArray(extra.faqs) ? extra.faqs : []
  const width = useWindowWidth()
  const isMobile = width <= 768
  const price = extra.price || '€90'
  const [openFaq, setOpenFaq] = useState(null)

  // People book people: the host block is CMS-editable (extra.hostName etc.)
  // and falls back to grounded copy until a portrait is uploaded in /admin.
  const hostName = extra.hostName || 'Almedin'
  const hostRole = extra.hostRole || 'The guide behind Tallest Tourguide'
  const hostBio = extra.hostBio || 'The person on the call is the person who runs these trips — on Balkan roads year-round, recommending only routes and places he has driven himself. No script, no call centre; just recent, first-hand knowledge and a plan built around you.'

  // Sticky mobile book bar hides itself while the booking widget is on screen.
  const [bookRef, bookInView] = useInView('-40px')

  const steps = [
    { title: 'Book your slot', detail: `Pick a time that suits you and pay the ${price} fee — that’s the whole commitment.` },
    { title: 'The 60-minute call', detail: 'A one-to-one video call with someone who has actually been on these roads recently.' },
    { title: 'Your written plan', detail: 'A personalised route and the local notes that aren’t online, sent through after the call.' },
  ]

  return (
    <main style={{ backgroundColor: 'var(--color-n000)', paddingBottom: isMobile ? 72 : 0 }}>
      <SEO
        title={page.seo?.title || 'Plan Your Trip — A Balkans Consultation'}
        description={page.seo?.description || '60 minutes with someone who has been on these roads recently. Leave with a plan you can trust.'}
        url="/consult"
      />

      {/* Hero — pitch + booking card */}
      <section style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-n900)', color: '#fff', padding: isMobile ? '56px 24px 64px' : '88px 24px' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(115% 115% at 15% 0%, #245b46 0%, var(--color-n900) 66%)' }} />
        <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.08fr 0.92fr', gap: isMobile ? 36 : 56, alignItems: 'center' }}>
          {/* Pitch */}
          <div>
            {hero.kicker && <span style={styles.kicker}>{hero.kicker}</span>}
            <h1 style={styles.h1}>{hero.heading}</h1>
            {hero.subheading && <p style={styles.lede}>{hero.subheading}</p>}
            <ul style={styles.chips}>
              {TRUST_CHIPS.map((c) => (
                <li key={c} style={styles.chip}><Check size={14} color="var(--color-amber)" style={{ flexShrink: 0 }} />{c}</li>
              ))}
            </ul>
          </div>

          {/* Booking card */}
          <div style={styles.bookCard}>
            <span style={styles.bookCardLabel}>The consultation</span>
            <div style={styles.bookPriceRow}>
              <span style={styles.bookPrice}>{price}</span>
              {extra.priceNote && <span style={styles.bookPriceNote}>{extra.priceNote}</span>}
            </div>
            {/* The risk-reversal, front and centre: book a tour and the fee costs nothing */}
            <div style={styles.creditNote}>
              <Check size={15} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span><strong>Credited in full</strong> toward any tour you book with us.</span>
            </div>
            {includes.length > 0 && (
              <>
                <div style={styles.bookDivider} />
                <ul style={styles.bookList}>
                  {includes.slice(0, 4).map((it, i) => (
                    <li key={i} style={styles.bookListItem}>
                      <Check size={16} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Button href="#book" variant="primary" size="lg" full arrow style={{ marginTop: 24 }}>Book a consultation</Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: isMobile ? '52px 24px' : '76px 24px', backgroundColor: 'var(--color-n100)', borderBottom: '1px solid var(--color-n200)' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <span style={styles.eyebrow}>How it works</span>
          <h2 style={styles.h2}>Three steps to a plan you can trust</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 28 : 44, marginTop: 36 }}>
            {steps.map((s, i) => (
              <div key={i} style={styles.step}>
                <span style={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDetail}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who you'll talk to — a €90 one-to-one is bought on trust in a person */}
      <section style={{ padding: isMobile ? '52px 24px 0' : '76px 24px 0' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: isMobile ? 28 : 56, alignItems: 'center' }}>
          <div style={{ maxWidth: isMobile ? 300 : undefined }}>
            {extra.hostImage ? (
              <Img
                src={extra.hostImage}
                alt={hostName}
                sizes="(max-width: 768px) 300px, 280px"
                style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'block' }}
              />
            ) : (
              <Placeholder ratio="4/5" label="Portrait" note="A real photo of the person on the call" />
            )}
          </div>
          <div>
            <span style={styles.eyebrow}>Who you'll talk to</span>
            <h2 style={styles.h2}>{hostName}</h2>
            <p style={styles.hostRole}>{hostRole}</p>
            <p style={styles.hostBio}>{hostBio}</p>
          </div>
        </div>
      </section>

      {/* Includes + who it's for */}
      <section style={{ padding: isMobile ? '52px 24px' : '76px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 64 }}>
          <div>
            <h2 style={styles.h2}>What the session includes</h2>
            <ul style={styles.list}>
              {includes.map((it, i) => (
                <li key={i} style={styles.listItem}>
                  <Check size={18} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 style={styles.h2}>Who it's for</h2>
            <ul style={styles.list}>
              {forWho.map((it, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.dot} />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            {extra.worthIt && (
              <div style={styles.worthIt}>
                <span style={styles.worthItLabel}>Why it’s worth it</span>
                <RichContent value={extra.worthIt} paragraphStyle={{ fontFamily: 'var(--font-body)', fontSize: 15.5, lineHeight: 1.7, color: 'var(--color-n800)', margin: 0 }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Social proof — open quotes, not boxes */}
      {testimonials.length > 0 && (
        <section style={{ padding: isMobile ? '8px 24px 48px' : '16px 24px 64px' }}>
          <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(testimonials.length, 3)}, 1fr)`, gap: isMobile ? 28 : 48 }}>
            {testimonials.map((t, i) => (
              <blockquote key={i} style={styles.testimonial}>
                <span aria-hidden style={styles.quoteMark}>“</span>
                <p style={styles.testimonialQuote}>{t.quote}</p>
                <cite style={styles.testimonialName}>{t.name}</cite>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Booking widget */}
      <section id="book" ref={bookRef} style={{ padding: isMobile ? '48px 24px 56px' : '72px 24px', scrollMarginTop: 80, backgroundColor: 'var(--color-n100)', borderTop: '1px solid var(--color-n200)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ ...styles.h2, textAlign: 'center', marginBottom: 24 }}>Book your slot</h2>
          {extra.calendlyUrl ? (
            <iframe
              title="Book a consultation"
              src={extra.calendlyUrl}
              style={{ width: '100%', maxWidth: 560, margin: '0 auto', height: isMobile ? 'min(460px, 62vh)' : 500, border: '1px solid var(--color-n300)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-n000)', display: 'block' }}
            />
          ) : (
            <div style={styles.calendlyPlaceholder}>
              <strong style={{ fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 20, color: 'var(--color-n900)' }}>Calendar embed slot</strong>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-n600)', maxWidth: 460, lineHeight: 1.6 }}>
                Add your Calendly (or equivalent) booking URL in the Pages editor under
                <code style={{ fontSize: 13 }}> extra.calendlyUrl</code> and the live scheduler will appear here.
                Configure the event as a paid booking so the {price} fee is collected on confirmation.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Good to know — card accordion */}
      {faqs.length > 0 && (
        <section style={{ padding: isMobile ? '52px 24px' : '72px 24px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span style={styles.eyebrow}>Before you book</span>
            <h2 style={{ ...styles.h2, marginBottom: 24 }}>Good to know</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((f, i) => {
                const open = openFaq === i
                return (
                  <div
                    key={i}
                    style={{
                      ...styles.faqCard,
                      borderColor: open ? 'rgba(46,125,94,0.35)' : 'var(--color-n200)',
                      backgroundColor: open ? 'rgba(46,125,94,0.04)' : 'var(--color-n000)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      style={styles.faqQRow}
                      aria-expanded={open}
                    >
                      <span style={styles.faqQ}>{f.q}</span>
                      <ChevronDown
                        size={18}
                        color={open ? 'var(--color-forest-green)' : 'var(--color-n500)'}
                        style={{ flexShrink: 0, marginLeft: 16, transition: 'transform 0.22s', transform: open ? 'rotate(180deg)' : 'none' }}
                      />
                    </button>
                    {open && <p style={styles.faqA}>{f.a}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Where to next — real options, not a one-line dead end */}
      <section style={{ padding: isMobile ? '52px 24px 64px' : '80px 24px 96px', backgroundColor: 'var(--color-n100)', borderTop: '1px solid var(--color-n200)' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}>
            <span style={styles.eyebrow}>Keep planning</span>
            <h2 style={styles.h2}>Want more than advice?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24 }}>
            <Link to="/personalised" style={styles.nextCard} className="btn-lift">
              <span style={{ ...styles.nextIcon, backgroundColor: 'rgba(46,125,94,0.1)' }}>
                <Compass size={22} color="var(--color-forest-green)" />
              </span>
              <h3 style={styles.nextTitle}>Request a personalised tour</h3>
              <p style={styles.nextText}>Hand us your dates and interests and we’ll build a complete, custom itinerary — start to finish.</p>
              <span style={styles.nextCta}>Start your request <ArrowRight size={16} /></span>
            </Link>
            <Link to="/destinations" style={styles.nextCard} className="btn-lift">
              <span style={{ ...styles.nextIcon, backgroundColor: 'rgba(244,161,48,0.14)' }}>
                <MapIcon size={22} color="var(--color-amber)" />
              </span>
              <h3 style={styles.nextTitle}>Explore the regions</h3>
              <p style={styles.nextText}>Browse Bosnia, Herzegovina and the wider Balkans to see where your trip could take you.</p>
              <span style={styles.nextCta}>Browse destinations <ArrowRight size={16} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky mobile book bar — the widget lives far down the page */}
      {isMobile && !bookInView && (
        <div style={styles.stickyBar}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={styles.stickyPrice}>{price}</span>
            <span style={styles.stickyNote}>60 min · credited to a tour</span>
          </div>
          <Button href="#book" variant="primary" size="sm">Book a consultation</Button>
        </div>
      )}
    </main>
  )
}

const styles = {
  kicker: { display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-amber)' },
  h1: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.1, margin: '14px 0 0', letterSpacing: '-0.015em', color: '#fff' },
  lede: { fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.9vw, 19px)', color: 'rgba(255,255,255,0.82)', margin: '18px 0 0', maxWidth: 520, lineHeight: 1.6 },
  chips: { listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '10px 18px', padding: 0, margin: '26px 0 0' },
  chip: { display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 500, color: 'rgba(255,255,255,0.9)' },

  bookCard: { backgroundColor: 'var(--color-n000)', borderRadius: 'var(--radius-lg)', padding: 'clamp(24px, 3vw, 32px)', boxShadow: 'var(--shadow-lg)' },
  bookCardLabel: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-forest-green)', marginBottom: 12 },
  bookPriceRow: { display: 'flex', flexDirection: 'column', gap: 4 },
  bookPrice: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 44, color: 'var(--color-n900)', lineHeight: 1, letterSpacing: '-0.01em' },
  bookPriceNote: { fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--color-n600)' },
  bookDivider: { height: 1, backgroundColor: 'var(--color-n200)', margin: '20px 0' },
  bookList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 },
  bookListItem: { display: 'flex', gap: 10, fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.5, color: 'var(--color-n800)' },

  eyebrow: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-forest-green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 },
  h2: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(24px, 3.2vw, 32px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 },

  creditNote: { display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 14, padding: '10px 12px', borderRadius: 'var(--radius)', backgroundColor: 'var(--color-amber-light)', fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-n800)' },

  hostRole: { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-warning)', margin: '10px 0 0' },
  hostBio: { fontFamily: 'var(--font-body)', fontSize: 16.5, lineHeight: 1.75, color: 'var(--color-n700)', margin: '14px 0 0', maxWidth: 520 },

  stickyBar: { position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 16px calc(10px + env(safe-area-inset-bottom))', backgroundColor: 'var(--color-n000)', borderTop: '1px solid var(--color-n200)', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' },
  stickyPrice: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 22, color: 'var(--color-n900)', lineHeight: 1.1 },
  stickyNote: { fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'var(--color-n600)', marginTop: 2 },

  step: { paddingTop: 4 },
  stepNum: { fontFamily: 'var(--font-hero)', fontSize: 30, fontWeight: 500, color: 'var(--color-amber)', lineHeight: 1 },
  stepTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-n900)', margin: '12px 0 8px' },
  stepDetail: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-n600)', margin: 0 },

  list: { listStyle: 'none', padding: 0, margin: '4px 0 0', display: 'flex', flexDirection: 'column', gap: 14 },
  listItem: { display: 'flex', gap: 12, fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, color: 'var(--color-n800)' },
  dot: { width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--color-amber)', flexShrink: 0, marginTop: 8 },
  worthIt: { marginTop: 28, paddingLeft: 18, borderLeft: '2px solid var(--color-amber)' },
  worthItLabel: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-warning)', marginBottom: 8 },

  testimonial: { margin: 0, position: 'relative', paddingTop: 14, borderTop: '2px solid var(--color-n200)' },
  quoteMark: { position: 'absolute', top: 2, left: 0, fontFamily: 'var(--font-hero)', fontSize: 40, lineHeight: 1, color: 'var(--color-amber)', opacity: 0.6 },
  testimonialQuote: { fontFamily: 'var(--font-hero)', fontStyle: 'italic', fontWeight: 400, fontSize: 18, lineHeight: 1.5, color: 'var(--color-n800)', margin: '8px 0 12px' },
  testimonialName: { fontFamily: 'var(--font-body)', fontStyle: 'normal', fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--color-forest-green)' },

  calendlyPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', padding: '56px 24px', border: '1px dashed rgba(46,125,94,0.4)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-amber-light)' },

  faqCard: { border: '1px solid var(--color-n200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'border-color 0.2s, background-color 0.2s' },
  faqQRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '18px 20px' },
  faqQ: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--color-n900)', lineHeight: 1.4 },
  faqA: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-n700)', margin: 0, padding: '0 20px 20px' },

  nextCard: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: 'var(--color-n000)', border: '1px solid var(--color-n200)', borderRadius: 'var(--radius-lg)', padding: 28, textDecoration: 'none', boxShadow: 'var(--shadow-sm)' },
  nextIcon: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 14, marginBottom: 18 },
  nextTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--color-n900)', margin: '0 0 8px' },
  nextText: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.6, color: 'var(--color-n600)', margin: '0 0 20px' },
  nextCta: { display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: 'var(--color-forest-green)', marginTop: 'auto' },
}
