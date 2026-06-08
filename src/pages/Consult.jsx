import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import SEO from '../components/SEO'
import RichContent from '../components/RichContent'
import { getPage } from '../data/pages'
import useWindowWidth from '../hooks/useWindowWidth'

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

  const steps = [
    { title: 'Book your slot', detail: `Pick a time that suits you and pay the ${price} fee — that’s the whole commitment.` },
    { title: 'The 60-minute call', detail: 'A one-to-one video call with someone who has actually been on these roads recently.' },
    { title: 'Your written plan', detail: 'A personalised route and the local notes that aren’t online, sent through after the call.' },
  ]

  return (
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
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
            <a href="#book" style={styles.bookCta} className="btn-lift">Book a consultation →</a>
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
      <section id="book" style={{ padding: isMobile ? '48px 24px 56px' : '72px 24px', scrollMarginTop: 80, backgroundColor: 'var(--color-n100)', borderTop: '1px solid var(--color-n200)' }}>
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

      {/* FAQ */}
      {faqs.length > 0 && (
        <section style={{ padding: isMobile ? '52px 24px 16px' : '72px 24px 24px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2 style={{ ...styles.h2, marginBottom: 8 }}>Good to know</h2>
            {faqs.map((f, i) => (
              <details key={i} style={styles.faq}>
                <summary style={styles.faqQ}>{f.q}</summary>
                <p style={styles.faqA}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Cross-link — not a dead end */}
      <section style={{ padding: isMobile ? '32px 24px 72px' : '40px 24px 96px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-n600)' }}>
          Ready for more than advice?{' '}
          <Link to="/personalised" style={styles.inlineLink}>Request a personalised tour</Link>{' '}or{' '}
          <Link to="/destinations" style={styles.inlineLink}>explore the regions</Link>.
        </p>
      </section>
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
  bookCta: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 52, marginTop: 24, backgroundColor: 'var(--color-forest-green)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, borderRadius: 'var(--radius)', textDecoration: 'none' },

  eyebrow: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-forest-green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 },
  h2: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(24px, 3.2vw, 32px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 },

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
  faq: { borderBottom: '1px solid var(--color-n200)', padding: '16px 0' },
  faqQ: { fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--color-n900)', cursor: 'pointer' },
  faqA: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-n600)', margin: '10px 0 0' },
  inlineLink: { color: 'var(--color-forest-green)', fontWeight: 700, textDecoration: 'none' },
}
