import SEO from '../components/SEO'
import { EditorialHero, ProseSection, EndCTA, Placeholder } from '../components/Editorial'
import Button from '../components/Button'
import { getPage } from '../data/pages'
import useWindowWidth from '../hooks/useWindowWidth'

export default function Signature() {
  const page = getPage('signature') || {}
  const hero = page.hero || {}
  const sections = Array.isArray(page.sections) ? page.sections : []
  const extra = page.extra || {}
  const journeys = Array.isArray(extra.journeys) ? extra.journeys : []
  const process = Array.isArray(extra.process) ? extra.process : []
  const forWho = Array.isArray(extra.forWho) ? extra.forWho : []
  const notFor = Array.isArray(extra.notFor) ? extra.notFor : []
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
      <SEO
        title={page.seo?.title || 'Signature Experiences'}
        description={page.seo?.description || 'Private, expert-led Balkan journeys designed around you. A maximum of six guests.'}
        url="/signature"
      />

      <EditorialHero
        variant="cinematic"
        kicker={hero.kicker}
        heading={hero.heading}
        subheading={hero.subheading}
        image={hero.image}
        scarcity={extra.scarcity}
      />

      {sections.map((sec, i) => <ProseSection key={sec.id || i} section={sec} />)}

      {/* Who this is for — two quiet text columns, no boxes */}
      {forWho.length > 0 && (
        <section style={{ padding: isMobile ? '8px 0 40px' : '8px 0 64px' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ borderTop: '1px solid var(--color-n200)', paddingTop: isMobile ? 32 : 44, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 72 }}>
              <FitList heading="This is for you if" items={forWho} />
              {notFor.length > 0 && <FitList heading="This is probably not for you if" items={notFor} muted />}
            </div>
          </div>
        </section>
      )}

      {/* Journeys — narrative, not a grid of tours */}
      {journeys.map((j, i) => {
        const imageFirst = i % 2 === 1
        const Images = (
          <div style={{ position: 'relative', paddingBottom: j.secondImage && !isMobile ? 56 : 0 }}>
            {j.image ? (
              <img src={j.image} alt={j.title} loading="lazy" style={{ width: j.secondImage && !isMobile ? '82%' : '100%', marginLeft: !isMobile && j.secondImage && imageFirst ? '18%' : 0, aspectRatio: '4/3', objectFit: 'cover', borderRadius: 'var(--radius-lg)', display: 'block' }} />
            ) : (
              <Placeholder ratio="4/3" label="Journey photo" note="Large, slow, unhurried photography" />
            )}
            {j.secondImage && (
              isMobile ? (
                <img src={j.secondImage} alt="" loading="lazy" style={{ width: '62%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 'var(--radius-lg)', display: 'block', marginTop: 12, marginLeft: 'auto' }} />
              ) : (
                <img src={j.secondImage} alt="" loading="lazy" style={{ position: 'absolute', bottom: 0, [imageFirst ? 'left' : 'right']: 0, width: '42%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '5px solid var(--color-n000)', display: 'block' }} />
              )
            )}
          </div>
        )
        return (
          <section key={i} style={{ padding: isMobile ? '32px 0' : '56px 0', borderTop: i > 0 ? '1px solid var(--color-n200)' : 'none' }}>
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 64, alignItems: 'center' }}>
              <div style={{ order: isMobile ? 1 : imageFirst ? 2 : 1 }}>
                <span style={styles.journeyKicker}>Signature journey {String(i + 1).padStart(2, '0')}</span>
                <h2 style={styles.journeyTitle}>{j.title}</h2>
                <p style={styles.journeyBlurb}>{j.blurb}</p>
                <div style={styles.journeyMeta}>
                  {j.duration && <Meta label="Length" value={j.duration} />}
                  {j.maxGuests && <Meta label="Group" value={j.maxGuests} />}
                  {j.expert && <Meta label="Led by" value={j.expert} />}
                  {j.fromPrice && <Meta label="From" value={j.fromPrice === 'On request' ? 'On request' : `€${j.fromPrice} pp`} />}
                </div>
                {j.route && (
                  <div style={{ marginTop: 26 }}>
                    <span style={styles.routeLabel}>The shape of it</span>
                    <p style={styles.route}>
                      {j.route.split('→').map((stop, k, arr) => (
                        <span key={k}>
                          {stop.trim()}
                          {k < arr.length - 1 && <span aria-hidden style={styles.routeArrow}> → </span>}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
                {j.rhythm && <p style={styles.rhythm}>{j.rhythm}</p>}
                {j.expertNote && <p style={styles.expertNote}>{j.expertNote}</p>}
                <div style={{ marginTop: 28 }}>
                  <Button to="/contact" variant="secondary" size="sm" arrow>Enquire about this journey</Button>
                </div>
              </div>
              <div style={{ order: isMobile ? 0 : imageFirst ? 1 : 2 }}>
                {Images}
              </div>
            </div>
          </section>
        )
      })}

      {/* The design process — open air, hairline top, amber numerals */}
      {process.length > 0 && (
        <section style={{ padding: isMobile ? '56px 0 40px' : '88px 0 56px' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ borderTop: '1px solid var(--color-n200)', paddingTop: isMobile ? 44 : 64 }}>
              <h2 style={styles.processHeading}>How a signature journey gets built</h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(process.length, 3)}, 1fr)`, gap: isMobile ? 36 : 48, marginTop: isMobile ? 36 : 52, maxWidth: 1040, marginLeft: 'auto', marginRight: 'auto' }}>
                {process.map((p, i) => (
                  <div key={i}>
                    <span style={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 style={styles.stepTitle}>{p.step}</h3>
                    <p style={styles.stepDetail}>{p.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <EndCTA
        label={page.cta?.label || 'Start a conversation'}
        href={page.cta?.href || '/contact'}
        note={page.cta?.note}
        variant="primary"
      />
    </main>
  )
}

function Meta({ label, value }) {
  return (
    <div style={{ minWidth: 90 }}>
      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--color-n500)' }}>{label}</span>
      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--color-n900)', marginTop: 2 }}>{value}</span>
    </div>
  )
}

function FitList({ heading, items, muted = false }) {
  return (
    <div style={{ maxWidth: 520 }}>
      <h2 style={styles.fitHeading}>{heading}</h2>
      <ul style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'grid', gap: 12 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: muted ? 'var(--color-n400)' : 'var(--color-amber)', flexShrink: 0, position: 'relative', top: -2 }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.65, color: muted ? 'var(--color-n600)' : 'var(--color-n800)' }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const styles = {
  journeyKicker: { fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--color-forest-green)' },
  journeyTitle: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(26px, 3.6vw, 40px)', lineHeight: 1.15, color: 'var(--color-n900)', margin: '12px 0 16px' },
  journeyBlurb: { fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.7, color: 'var(--color-n700)', margin: '0 0 24px' },
  journeyMeta: { display: 'flex', flexWrap: 'wrap', gap: 24 },
  routeLabel: { display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--color-n500)', marginBottom: 8 },
  route: { fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, lineHeight: 1.9, color: 'var(--color-n800)', margin: 0 },
  routeArrow: { color: 'var(--color-amber)', fontWeight: 700 },
  rhythm: { fontFamily: 'var(--font-hero)', fontStyle: 'italic', fontWeight: 300, fontSize: 19, lineHeight: 1.55, color: 'var(--color-n700)', margin: '20px 0 0' },
  expertNote: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-n600)', margin: '20px 0 0', paddingLeft: 16, borderLeft: '2px solid var(--color-amber)' },
  fitHeading: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(22px, 2.8vw, 28px)', lineHeight: 1.2, color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.01em' },
  processHeading: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(24px, 3.4vw, 34px)', color: 'var(--color-n900)', margin: 0, textAlign: 'center' },
  stepNum: { fontFamily: 'var(--font-hero)', fontSize: 44, color: 'var(--color-amber)', lineHeight: 1 },
  stepTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-n900)', margin: '14px 0 8px' },
  stepDetail: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-n600)', margin: 0 },
}
