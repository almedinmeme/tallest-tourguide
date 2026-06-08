import { useParams, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import RichContent from '../components/RichContent'
import RelatedTrips from '../components/RelatedTrips'
import { EditorialHero } from '../components/Editorial'
import { getDestination, sortedDestinations } from '../data/destinations'
import useWindowWidth from '../hooks/useWindowWidth'

const MEASURE = 700

// Soft on-brand fallback for places whose photography isn't sourced yet —
// keeps the public page looking finished instead of showing a dashed slot.
const PLACE_FALLBACKS = [
  'radial-gradient(120% 120% at 25% 8%, #2f7d5e 0%, #143222 76%)',
  'radial-gradient(120% 120% at 75% 16%, #2a6e54 0%, #122a20 78%)',
  'radial-gradient(120% 120% at 40% 100%, #357a5e 0%, #102018 74%)',
]

export default function DestinationDetail() {
  const { slug } = useParams()
  const d = getDestination(slug)
  const width = useWindowWidth()
  const isMobile = width <= 768

  if (!d) {
    return (
      <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center', backgroundColor: 'var(--color-n100)' }}>
        <SEO title="Destination not found" description="This destination doesn't exist." url={`/destinations/${slug}`} />
        <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 32, color: 'var(--color-n900)' }}>We don't have that region yet</h1>
        <Link to="/destinations" style={{ marginTop: 16, color: 'var(--color-forest-green)', fontWeight: 700, textDecoration: 'none' }}>← All destinations</Link>
      </main>
    )
  }

  const others = sortedDestinations.filter((x) => x.slug !== d.slug).slice(0, 6)
  const featured = Array.isArray(d.featured) ? d.featured : []
  const kicker = d.country && d.country !== d.name ? d.country : 'Western Balkans'

  return (
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
      <SEO
        title={`${d.name} — Where to Go & What It's Really Like`}
        description={d.teaser || `Travel ${d.name} with people who know its roads year-round.`}
        url={`/destinations/${d.slug}`}
      />

      <EditorialHero kicker={kicker} heading={d.name} subheading={d.teaser} image={d.hero} imageNote="[Hero image slot — 16/9 landscape]" backLink={{ to: '/destinations', label: 'All destinations' }} />

      {/* Intro + what makes it distinct — one continuous read */}
      <section style={{ padding: isMobile ? '36px 0 8px' : '52px 0 8px' }}>
        <div style={{ maxWidth: MEASURE, margin: '0 auto', padding: '0 24px' }}>
          <RichContent value={d.intro} paragraphStyle={styles.lede} />
          {d.distinct && (
            <>
              <h2 style={{ ...styles.h2, marginTop: isMobile ? 28 : 40 }}>What makes {d.name} distinct</h2>
              <RichContent value={d.distinct} paragraphStyle={styles.p} />
            </>
          )}
          {d.bestTime && (
            <div style={{ ...styles.bestTime, marginTop: isMobile ? 28 : 36 }}>
              <span style={styles.bestTimeLabel}>Best time to visit</span>
              <p style={styles.bestTimeValue}>{d.bestTime}</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured places — open editorial rows, no boxes, so the eye scans down */}
      {featured.length > 0 && (
        <section style={{ padding: isMobile ? '40px 0 8px' : '64px 0 16px', borderTop: '1px solid var(--color-n200)', marginTop: isMobile ? 32 : 56 }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
            <span style={styles.kicker}>On the ground</span>
            <h2 style={{ ...styles.h2, marginTop: 8, marginBottom: 4 }}>Where we take you</h2>

            {featured.map((f, i) => {
              const imageRight = i % 2 === 1
              const Img = (
                <div style={styles.rowImgWrap}>
                  {f.image ? (
                    <img src={f.image} alt={f.name} loading="lazy" style={styles.rowImg} />
                  ) : (
                    <div aria-hidden style={{ position: 'absolute', inset: 0, background: PLACE_FALLBACKS[i % PLACE_FALLBACKS.length] }} />
                  )}
                </div>
              )
              const Text = (
                <div>
                  <span style={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 style={styles.placeName}>{f.name}</h3>
                  <p style={styles.placeBlurb}>{f.blurb}</p>
                </div>
              )
              return (
                <article
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? 18 : 60,
                    alignItems: 'center',
                    padding: isMobile ? '32px 0' : '44px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--color-n200)',
                  }}
                >
                  {isMobile || !imageRight ? (
                    <>{Img}{Text}</>
                  ) : (
                    <>{Text}{Img}</>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Sparse regions: no day tours yet, but they feature in our Journeys */}
      {(!d.relatedTours || d.relatedTours.length === 0) && Array.isArray(d.relatedPackages) && d.relatedPackages.length > 0 && (
        <section style={{ padding: isMobile ? '8px 0 0' : '12px 0 0' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
            <p style={styles.comingSoon}>
              Standalone day tours in {d.name} are coming soon. For now, this region is part of our multi-day{' '}
              <Link to="/multi-day-tours" style={styles.comingSoonLink}>Journeys</Link>.
            </p>
          </div>
        </section>
      )}

      {/* Related bookable trips — no dead ends */}
      <RelatedTrips
        tourSlugs={d.relatedTours}
        packageSlugs={d.relatedPackages}
        heading={`Travel ${d.name} with us`}
        intro="These are the trips that run through this region. Every one is led by someone who drives these roads year-round."
      />

      {/* Other regions */}
      <section style={{ padding: isMobile ? '48px 24px 72px' : '64px 24px 96px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={styles.h2}>Keep exploring the Balkans</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
            {others.map((o) => (
              <Link key={o.slug} to={`/destinations/${o.slug}`} style={styles.chip} className="region-chip">{o.name} →</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

const styles = {
  crumb: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-n500)', textDecoration: 'none' },
  lede: { fontFamily: 'var(--font-body)', fontSize: 'clamp(19px, 2.2vw, 22px)', lineHeight: 1.65, color: 'var(--color-n900)', fontWeight: 400 },
  p: { fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.8, color: 'var(--color-n800)' },
  h2: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(26px, 3.4vw, 36px)', color: 'var(--color-n900)', margin: '0 0 16px', letterSpacing: '-0.015em', lineHeight: 1.15 },
  kicker: { fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-forest-green)' },

  bestTime: { borderLeft: '2px solid var(--color-amber)', paddingLeft: 20 },
  bestTimeLabel: { display: 'block', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--color-warning)', marginBottom: 6 },
  bestTimeValue: { fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--color-n800)', lineHeight: 1.65, margin: 0 },

  rowImgWrap: { position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' },
  rowImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  rowNum: { display: 'block', fontFamily: 'var(--font-hero)', fontSize: 15, fontWeight: 500, letterSpacing: 1, color: 'var(--color-amber)', marginBottom: 10 },
  placeName: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 'clamp(24px, 3vw, 30px)', color: 'var(--color-n900)', margin: '0 0 12px', letterSpacing: '-0.015em', lineHeight: 1.15 },
  placeBlurb: { fontFamily: 'var(--font-body)', fontSize: 16.5, lineHeight: 1.75, color: 'var(--color-n600)', margin: 0, maxWidth: 480 },

  chip: { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-forest-green)', textDecoration: 'none', padding: '10px 16px', border: '1px solid var(--color-n300)', borderRadius: 999, backgroundColor: 'var(--color-n000)' },

  comingSoon: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.6, color: 'var(--color-n500)', margin: 0 },
  comingSoonLink: { color: 'var(--color-forest-green)', fontWeight: 700, textDecoration: 'none' },
}
