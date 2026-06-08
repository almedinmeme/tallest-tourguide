import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { EditorialHero, ProseSection, PullQuote, EndCTA } from '../components/Editorial'
import { getPage } from '../data/pages'
import useWindowWidth from '../hooks/useWindowWidth'

// Founder photo — bundled asset, used as the hero fallback if the CMS
// hero image is empty.
import aboutPhoto from '../assets/about-me.webp'

export default function About() {
  const page = getPage('our-story') || {}
  const hero = page.hero || {}
  const sections = Array.isArray(page.sections) ? page.sections : []
  const quotes = Array.isArray(page.pullQuotes) ? page.pullQuotes : []
  const extra = page.extra || {}
  const credentials = Array.isArray(extra.credentials) ? extra.credentials : []
  const areas = Array.isArray(extra.areasOfDepth) ? extra.areasOfDepth : []
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
      <SEO
        title={page.seo?.title || 'Our Story'}
        description={page.seo?.description || 'We live and travel these Balkan roads year-round. Meet Almedin and the story behind Tallest Tourguide.'}
        url="/about"
      />

      <EditorialHero
        kicker={hero.kicker}
        heading={hero.heading}
        subheading={hero.subheading}
        image={hero.image || aboutPhoto}
      />

      {/* The letter */}
      {sections.map((sec, i) => (
        <div key={sec.id || i}>
          <ProseSection section={sec} />
          {i === 1 && quotes[0] && <PullQuote quote={quotes[0].quote} attribution={quotes[0].attribution} />}
        </div>
      ))}

      {/* Credentials — the substance behind the story */}
      {credentials.length > 0 && (
        <section style={{ padding: '76px 0', backgroundColor: 'var(--color-n100)', borderTop: '1px solid var(--color-n200)', borderBottom: '1px solid var(--color-n200)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
            <h2 style={styles.credHeading}>What fourteen years gives you</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', columnGap: 64, rowGap: isMobile ? 24 : 40, marginTop: isMobile ? 28 : 44 }}>
              {credentials.map((c, i) => (
                <div key={i}>
                  <span aria-hidden style={styles.credRule} />
                  <h3 style={styles.credTitle}>{c.title}</h3>
                  <p style={styles.credBody}>{c.body}</p>
                </div>
              ))}
            </div>
            {areas.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <span style={styles.eyebrow}>Areas of depth</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {areas.map((a) => <span key={a} style={styles.tag}>{a}</span>)}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {quotes[1] && <PullQuote quote={quotes[1].quote} attribution={quotes[1].attribution} />}

      {/* No dead ends — point onward */}
      <section style={{ padding: '8px 24px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-n600)' }}>
          The philosophy behind all of it is{' '}
          <Link to="/hospitality" style={styles.inlineLink}>gostoprimstvo</Link> — the Balkan art of hosting.
        </p>
      </section>

      <EndCTA label={page.cta?.label || 'See how we travel'} href={page.cta?.href || '/destinations'} note={page.cta?.note} />
    </main>
  )
}

const styles = {
  eyebrow: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-forest-green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 },
  credHeading: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(24px, 3.4vw, 34px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 },
  credRule: { display: 'block', height: 2, width: 28, backgroundColor: 'var(--color-amber)', marginBottom: 16 },
  credTitle: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 'clamp(19px, 2.2vw, 23px)', color: 'var(--color-n900)', margin: '0 0 10px', letterSpacing: '-0.01em', lineHeight: 1.2 },
  credBody: { fontFamily: 'var(--font-body)', fontSize: 15.5, lineHeight: 1.75, color: 'var(--color-n600)', margin: 0 },
  tag: { fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--color-n800)', backgroundColor: 'var(--color-n000)', border: '1px solid var(--color-n300)', borderRadius: 100, padding: '5px 13px' },
  inlineLink: { color: 'var(--color-forest-green)', fontWeight: 700, textDecoration: 'none' },
}
