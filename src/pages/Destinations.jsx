import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { sortedDestinations } from '../data/destinations'
import useWindowWidth from '../hooks/useWindowWidth'

// On-brand gradient fallbacks for regions whose photography isn't sourced
// yet. They stay inside the forest/deep-green family so an imageless card
// reads as a designed title card, not an unfinished slot.
const FALLBACKS = [
  'radial-gradient(125% 125% at 18% 0%, #2f7d5e 0%, #143222 72%)',
  'radial-gradient(120% 120% at 82% 8%, #2a6e54 0%, #122a20 74%)',
  'radial-gradient(130% 120% at 30% 100%, #357a5e 0%, #102018 70%)',
  'radial-gradient(120% 130% at 70% 100%, #245b46 0%, #14241c 72%)',
  'radial-gradient(125% 120% at 50% 0%, #338065 0%, #122a20 75%)',
  'radial-gradient(120% 120% at 15% 60%, #2c7457 0%, #102018 72%)',
  'radial-gradient(130% 125% at 85% 40%, #2f7d5e 0%, #14241c 74%)',
]

const num = (n) => String(n).padStart(2, '0')
const placeNames = (d, max = 4) =>
  (Array.isArray(d.featured) ? d.featured : [])
    .map((f) => f && f.name)
    .filter(Boolean)
    .slice(0, max)

export default function Destinations() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const [featured, ...rest] = sortedDestinations

  return (
    <main style={{ backgroundColor: 'var(--color-n100)' }}>
      <SEO
        title="Destinations — The Balkans, Region by Region"
        description="Bosnia, Herzegovina, Montenegro, Albania, Serbia, North Macedonia and Kosovo — the regions we travel year-round, and what you actually feel when you're there."
        url="/destinations"
      />

      {/* Header */}
      <section style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-n900)', color: '#fff', padding: isMobile ? '64px 24px 56px' : '96px 24px 80px' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 18% 0%, #245b46 0%, var(--color-n900) 68%)' }} />
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto' }}>
          <span style={styles.kicker}>Destinations</span>
          <h1 style={styles.h1}>We know every road in this region. Here's the proof.</h1>
          <p style={styles.lede}>
            We don't just operate in Sarajevo. We travel the whole western Balkans year-round — seven
            regions, each with its own character, its own roads, and its own reasons to go slow.
          </p>
          <ul style={styles.stats}>
            {['Seven regions', 'Travelled year-round', 'Roads we drive ourselves'].map((s, i) => (
              <li key={s} style={styles.stat}>
                {i > 0 && <span aria-hidden style={styles.statDot} />}
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured region — the most complete, used to set the tone */}
      <section style={{ padding: isMobile ? '40px 24px 8px' : '64px 24px 16px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <Link to={`/destinations/${featured.slug}`} className="card-lift" style={{ ...styles.featureCard, gridTemplateColumns: isMobile ? '1fr' : '1.05fr 0.95fr' }}>
            <div style={{ ...styles.featurePhoto, aspectRatio: isMobile ? '16/10' : 'auto', minHeight: isMobile ? undefined : 360 }}>
              {featured.hero ? (
                <img src={featured.hero} alt={featured.name} loading="eager" style={styles.photo} />
              ) : (
                <div aria-hidden style={{ position: 'absolute', inset: 0, background: FALLBACKS[0] }} />
              )}
              <span style={styles.index}>{num(featured.order ?? 1)}</span>
            </div>
            <div style={styles.featureBody}>
              <span style={styles.featureKicker}>Start here</span>
              <h2 style={styles.featureName}>{featured.name}</h2>
              <p style={styles.featureTeaser}>{featured.teaser}</p>
              {placeNames(featured).length > 0 && (
                <p style={styles.places}>{placeNames(featured).join('   ·   ')}</p>
              )}
              <span className="btn-lift btn-glow-green" style={styles.featureCta}>
                Explore {featured.name}
                <span aria-hidden style={{ fontSize: 17, lineHeight: 1 }}>→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* The rest of the regions */}
      <section style={{ padding: isMobile ? '32px 24px 24px' : '48px 24px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <header style={styles.gridHead}>
            <span style={styles.gridKicker}>Keep going</span>
            <h2 style={styles.gridHeading}>Six more regions, every one led on the ground</h2>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {rest.map((d, i) => {
              const places = placeNames(d, 3)
              const showCountry = d.country && d.country !== d.name
              return (
                <Link key={d.slug} to={`/destinations/${d.slug}`} className="card-lift region-card" style={styles.card}>
                  <div style={styles.posterWrap}>
                    {d.hero ? (
                      <img src={d.hero} alt={d.name} loading="lazy" style={styles.photo} />
                    ) : (
                      <div aria-hidden style={{ position: 'absolute', inset: 0, background: FALLBACKS[(i + 1) % FALLBACKS.length] }} />
                    )}
                    <div aria-hidden style={styles.scrim} />
                    <span style={styles.index}>{num(d.order ?? i + 2)}</span>
                    <div style={styles.posterText}>
                      {showCountry && <span style={styles.country}>{d.country}</span>}
                      <h3 style={styles.name}>{d.name}</h3>
                    </div>
                  </div>
                  <div style={styles.body}>
                    <p style={styles.teaser}>{d.teaser}</p>
                    {places.length > 0 && <p style={styles.places}>{places.join('   ·   ')}</p>}
                    <span style={styles.explore}>
                      Explore {d.name}
                      <span aria-hidden className="explore-arrow" style={{ display: 'inline-block', marginLeft: 6 }}>→</span>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* No dead ends */}
      <section style={{ padding: isMobile ? '24px 24px 72px' : '40px 24px 96px' }}>
        <div style={styles.closer}>
          <p style={styles.closerText}>Not sure where to start? Tell us how you like to travel, or see the trips already on the calendar.</p>
          <div style={styles.closerBtns}>
            <Link to="/tours" className="btn-outline-green" style={styles.closerBtn}>Browse our tours</Link>
            <Link to="/about" className="btn-outline-green" style={styles.closerBtn}>Why we travel this way</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

const styles = {
  kicker: { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-amber)' },
  h1: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1, margin: '14px 0 0', letterSpacing: '-0.01em' },
  lede: { fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 2vw, 19px)', color: 'rgba(255,255,255,0.82)', maxWidth: 620, margin: '20px 0 0', lineHeight: 1.6 },
  stats: { listStyle: 'none', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, margin: '28px 0 0', padding: 0 },
  stat: { display: 'inline-flex', alignItems: 'center', gap: 18, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' },
  statDot: { width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--color-amber)' },

  // Featured region
  featureCard: { display: 'grid', gap: 0, textDecoration: 'none', backgroundColor: 'var(--color-n000)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-n300)', boxShadow: 'var(--shadow-sm)' },
  featurePhoto: { position: 'relative', overflow: 'hidden' },
  featureBody: { padding: 'clamp(24px, 4vw, 44px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' },
  featureKicker: { fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-amber)' },
  featureName: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(28px, 3.6vw, 42px)', lineHeight: 1.1, color: 'var(--color-n900)', margin: '12px 0 0', letterSpacing: '-0.01em' },
  featureTeaser: { fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.65, color: 'var(--color-n600)', margin: '16px 0 0', maxWidth: 520 },
  featureCta: { display: 'inline-flex', alignItems: 'center', gap: 9, height: 50, padding: '0 26px', marginTop: 26, backgroundColor: 'var(--color-forest-green)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, borderRadius: 'var(--radius)' },

  // Grid header
  gridHead: { marginBottom: 24 },
  gridKicker: { fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-forest-green)' },
  gridHeading: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(24px, 3.2vw, 34px)', lineHeight: 1.15, color: 'var(--color-n900)', margin: '8px 0 0', letterSpacing: '-0.01em' },

  // Poster cards
  card: { display: 'block', textDecoration: 'none', backgroundColor: 'var(--color-n000)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-n300)', boxShadow: 'var(--shadow-sm)' },
  posterWrap: { position: 'relative', aspectRatio: '4/3', overflow: 'hidden' },
  photo: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  scrim: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,16,20,0.05) 30%, rgba(10,16,20,0.72) 100%)' },
  index: { position: 'absolute', top: 14, left: 16, fontFamily: 'var(--font-hero)', fontSize: 15, fontWeight: 500, color: 'var(--color-amber)', letterSpacing: 1, textShadow: '0 1px 6px rgba(0,0,0,0.4)' },
  posterText: { position: 'absolute', left: 18, right: 18, bottom: 16 },
  country: { display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)', marginBottom: 4 },
  name: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 26, color: '#fff', margin: 0, lineHeight: 1.1, textShadow: '0 1px 12px rgba(0,0,0,0.35)' },
  body: { padding: '18px 20px 22px' },
  teaser: { fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.6, color: 'var(--color-n600)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  places: { fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, letterSpacing: 0.3, color: 'var(--color-forest-green)', margin: '14px 0 0' },
  explore: { display: 'inline-block', marginTop: 16, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--color-forest-green)', letterSpacing: 0.2 },

  // Closer
  closer: { maxWidth: 760, margin: '0 auto', textAlign: 'center', padding: '40px 28px', backgroundColor: 'var(--color-n000)', border: '1px solid var(--color-n200)', borderRadius: 'var(--radius-lg)' },
  closerText: { fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--color-n600)', margin: 0 },
  closerBtns: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 22 },
  closerBtn: { display: 'inline-flex', alignItems: 'center', height: 46, padding: '0 22px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--color-forest-green)', textDecoration: 'none', border: '1.5px solid var(--color-forest-green)', borderRadius: 'var(--radius)' },
}
