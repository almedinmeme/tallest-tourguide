import SEO from '../components/SEO'
import { EditorialHero, ProseSection, EndCTA, Placeholder } from '../components/Editorial'
import { getPage } from '../data/pages'
import useWindowWidth from '../hooks/useWindowWidth'

export default function Signature() {
  const page = getPage('signature') || {}
  const hero = page.hero || {}
  const sections = Array.isArray(page.sections) ? page.sections : []
  const extra = page.extra || {}
  const journeys = Array.isArray(extra.journeys) ? extra.journeys : []
  const process = Array.isArray(extra.process) ? extra.process : []
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
      <SEO
        title={page.seo?.title || 'Signature Experiences'}
        description={page.seo?.description || 'Private, expert-led Balkan journeys designed around you. A maximum of six guests.'}
        url="/signature"
      />

      <EditorialHero kicker={hero.kicker} heading={hero.heading} subheading={hero.subheading} image={hero.image} />

      {extra.scarcity && (
        <div style={styles.scarcity}>{extra.scarcity}</div>
      )}

      {sections.map((sec, i) => <ProseSection key={sec.id || i} section={sec} />)}

      {/* Journeys — narrative, not a grid of tours */}
      {journeys.map((j, i) => (
        <section key={i} style={{ padding: isMobile ? '32px 0' : '56px 0' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: isMobile ? 24 : 56, alignItems: 'center' }}>
            <div style={{ order: isMobile ? 1 : i % 2 === 0 ? 1 : 2 }}>
              <span style={styles.journeyKicker}>Signature journey {String(i + 1).padStart(2, '0')}</span>
              <h2 style={styles.journeyTitle}>{j.title}</h2>
              <p style={styles.journeyBlurb}>{j.blurb}</p>
              <div style={styles.journeyMeta}>
                {j.duration && <Meta label="Length" value={j.duration} />}
                {j.maxGuests && <Meta label="Group" value={j.maxGuests} />}
                {j.expert && <Meta label="Led by" value={j.expert} />}
                {j.fromPrice && <Meta label="From" value={j.fromPrice === 'On request' ? 'On request' : `€${j.fromPrice} pp`} />}
              </div>
            </div>
            <div style={{ order: isMobile ? 0 : i % 2 === 0 ? 2 : 1 }}>
              {j.image ? (
                <img src={j.image} alt={j.title} loading="lazy" style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'block' }} />
              ) : (
                <Placeholder ratio="4/3" label="Journey photo" note="Large, slow, unhurried photography" />
              )}
            </div>
          </div>
        </section>
      ))}

      {/* The design process */}
      {process.length > 0 && (
        <section style={{ padding: '64px 0', backgroundColor: 'var(--color-n100)' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
            <h2 style={styles.processHeading}>How a signature journey gets built</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(process.length, 3)}, 1fr)`, gap: 28, marginTop: 32 }}>
              {process.map((p, i) => (
                <div key={i}>
                  <span style={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 style={styles.stepTitle}>{p.step}</h3>
                  <p style={styles.stepDetail}>{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <EndCTA label={page.cta?.label || 'Start a conversation'} href={page.cta?.href || '/contact'} note={page.cta?.note} outlined />
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

const styles = {
  scarcity: { textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--color-amber)', padding: '40px 24px 0' },
  journeyKicker: { fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--color-forest-green)' },
  journeyTitle: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(26px, 3.6vw, 40px)', lineHeight: 1.15, color: 'var(--color-n900)', margin: '12px 0 16px' },
  journeyBlurb: { fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.7, color: 'var(--color-n700)', margin: '0 0 24px' },
  journeyMeta: { display: 'flex', flexWrap: 'wrap', gap: 24 },
  processHeading: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(24px, 3.4vw, 34px)', color: 'var(--color-n900)', margin: 0, textAlign: 'center' },
  stepNum: { fontFamily: 'var(--font-hero)', fontSize: 40, color: 'var(--color-amber)', lineHeight: 1 },
  stepTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-n900)', margin: '12px 0 8px' },
  stepDetail: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-n600)', margin: 0 },
}
