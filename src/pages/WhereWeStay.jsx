import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import SEO from '../components/SEO'
import Img from '../components/Img'
import useWindowWidth from '../hooks/useWindowWidth'
import { Placeholder, EndCTA } from '../components/Editorial'
import { getPage } from '../data/pages'

// Fallback copy if the CMS page ("where-we-stay") has no types yet. The live
// content — including the photos — is edited in /admin under Pages.
const DEFAULT_TYPES = [
  {
    tag: 'The authentic end',
    name: 'Homestays',
    image: '',
    body: 'A room in a family home, a shared table, and a host who treats you as a guest of the house rather than a customer. The closest thing to living somewhere instead of visiting it.',
  },
  {
    tag: 'Authentic, with room to breathe',
    name: 'Agrotourism estates',
    image: '',
    body: 'Working farms and country estates with rooms of their own — home-grown food, quiet land, and mornings that begin with the place around you, not a buffet line.',
  },
  {
    tag: 'The comfort end',
    name: 'Boutique hotels',
    image: '',
    body: 'Locally owned three- and four-star hotels with genuine character. Never an international chain; always run by people from the place — comfort without losing the sense of where you are.',
  },
]

// The vetting standard, editable in /admin (extra.lookFor / extra.neverBook).
// Kept true to the philosophy copy above — no claims the site doesn't make.
const DEFAULT_LOOK_FOR = [
  'Family-owned and host-run',
  'Rooms with the character of the place',
  'Hosts who add to the trip, not just hand over keys',
  'Food that comes from the region — often the garden',
]
const DEFAULT_NEVER = [
  'International chains',
  'Generic rooms that could be anywhere',
  'Buffet-line mornings',
]

export default function WhereWeStay() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const page = getPage('where-we-stay') || {}
  const hero = page.hero || {}
  const types = Array.isArray(page.extra?.types) && page.extra.types.length ? page.extra.types : DEFAULT_TYPES
  const lookFor = Array.isArray(page.extra?.lookFor) && page.extra.lookFor.length ? page.extra.lookFor : DEFAULT_LOOK_FOR
  const neverBook = Array.isArray(page.extra?.neverBook) && page.extra.neverBook.length ? page.extra.neverBook : DEFAULT_NEVER

  // Evenly spread the spectrum stops, inset from the ends of the line.
  const stopPos = (i) => (types.length <= 1 ? 50 : 8 + (i / (types.length - 1)) * 84)

  return (
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
      <SEO
        title={page.seo?.title || 'Where We Stay — Our Accommodation Philosophy'}
        description={page.seo?.description || 'No international chains. Family-owned homestays, agrotourism estates and locally owned boutique hotels — the kinds of places we use, and why.'}
        url="/where-we-stay"
      />

      {/* Philosophy header */}
      <section style={{ padding: isMobile ? '56px 24px 8px' : '80px 24px 16px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <span style={styles.kicker}>{hero.kicker || 'Where we stay'}</span>
          <h1 style={styles.h1}>{hero.heading || 'Every place we stay tells you something about where you are.'}</h1>
          <p style={styles.lede}>
            {hero.subheading || 'We work between two poles — agrotourism and homestays at the authentic end, and locally owned 3–4 star boutique hotels at the comfort end. No international chains. No generic rooms. We look for family-owned places with local character and hosts who add to the trip.'}
          </p>
        </div>
      </section>

      {/* Framed hero photo — the page has one in the CMS; let it set the scene */}
      {hero.image && (
        <section style={{ padding: isMobile ? '28px 16px 0' : '44px 24px 0' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', aspectRatio: isMobile ? '4/3' : '21/9', backgroundColor: 'var(--color-n900)' }}>
              <Img
                src={hero.image}
                alt=""
                eager
                sizes="(max-width: 768px) 100vw, 1080px"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </section>
      )}

      {/* The kinds of places — spectrum, then alternating photo + text rows */}
      <section style={{ padding: isMobile ? '40px 24px 8px' : '56px 24px 16px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <span style={styles.eyebrow}>The kinds of places we use</span>
          <h2 style={styles.h2}>Two ends of one spectrum</h2>

          {/* The spectrum itself — each stop jumps to its row below */}
          <div style={{ margin: isMobile ? '30px 0 0' : '38px 0 0', paddingBottom: isMobile ? 74 : 62 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ ...styles.spectrumEnd, color: 'var(--color-forest-green)' }}>Authentic</span>
              <span style={{ ...styles.spectrumEnd, color: 'var(--color-warning)' }}>Comfort</span>
            </div>
            <div style={styles.spectrumLine}>
              {types.map((t, i) => {
                const last = i === types.length - 1
                return (
                  <a
                    key={t.name}
                    href={`#stay-type-${i + 1}`}
                    aria-label={`Jump to ${t.name}`}
                    style={{ ...styles.spectrumStop, left: `${stopPos(i)}%`, width: isMobile ? 92 : 132 }}
                  >
                    <span style={{ ...styles.spectrumDot, borderColor: last ? 'var(--color-amber)' : 'var(--color-forest-green)' }} />
                    <span style={{ ...styles.spectrumLabel, fontSize: isMobile ? 11 : 12.5 }}>{t.name}</span>
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            {types.map((t, i) => {
              const imageRight = i % 2 === 1
              const Photo = t.image ? (
                <div style={styles.typeImgWrap}>
                  <Img src={t.image} alt={t.name} sizes="(max-width: 768px) 100vw, 512px" style={styles.typeImg} />
                </div>
              ) : (
                <Placeholder ratio="4/3" label={`${t.name} photo`} note="A representative photo of this kind of stay" />
              )
              const Text = (
                <div>
                  <span style={styles.typeNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={styles.typeTag}>{t.tag}</span>
                  <h3 style={styles.typeName}>{t.name}</h3>
                  <p style={styles.typeBody}>{t.body}</p>
                </div>
              )
              return (
                <article
                  key={t.name}
                  id={`stay-type-${i + 1}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? 18 : 56,
                    alignItems: 'center',
                    padding: isMobile ? '32px 0' : '44px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--color-n200)',
                    scrollMarginTop: 90,
                  }}
                >
                  {isMobile || !imageRight ? (<>{Photo}{Text}</>) : (<>{Text}{Photo}</>)}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* The standard — what gets a place onto our list, and what keeps it off */}
      <section style={{ padding: isMobile ? '48px 24px' : '68px 24px', backgroundColor: 'var(--color-n100)', borderTop: '1px solid var(--color-n200)', borderBottom: '1px solid var(--color-n200)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <span style={styles.eyebrow}>Our standard</span>
          <h2 style={styles.h2}>What we look for — and what we won't book</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 64, marginTop: 32 }}>
            <div>
              <h3 style={styles.standardHead}>We look for</h3>
              <ul style={styles.standardList}>
                {lookFor.map((it) => (
                  <li key={it} style={styles.standardItem}>
                    <Check size={18} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ ...styles.standardHead, color: 'var(--color-n500)' }}>We never book</h3>
              <ul style={styles.standardList}>
                {neverBook.map((it) => (
                  <li key={it} style={{ ...styles.standardItem, color: 'var(--color-n600)' }}>
                    <X size={18} color="var(--color-n400)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing note — matched to the trip */}
      <section style={{ padding: isMobile ? '48px 24px 16px' : '64px 24px 24px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', textAlign: 'center' }}>
          <span aria-hidden style={styles.rule} />
          <p style={styles.note}>
            Every place is matched to the trip — standard tours lean toward the authentic end, while our{' '}
            <Link to="/signature" style={styles.inlineLink}>Signature Experiences</Link> lean boutique. Different
            rooms, one principle: <Link to="/hospitality" style={styles.inlineLink}>gostoprimstvo</Link>, the
            Balkan art of hosting.
          </p>
        </div>
      </section>

      <EndCTA
        label={page.cta?.label || 'Our signature experiences'}
        href={page.cta?.href || '/signature'}
        note={page.cta?.note}
      />
    </main>
  )
}

const styles = {
  kicker: { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-forest-green)' },
  h1: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(28px, 4.4vw, 48px)', lineHeight: 1.12, color: 'var(--color-n900)', margin: '14px 0 0', letterSpacing: '-0.015em' },
  lede: { fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--color-n600)', margin: '20px 0 0', lineHeight: 1.7 },

  eyebrow: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-forest-green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 },
  h2: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(24px, 3.4vw, 34px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 },

  spectrumEnd: { fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' },
  spectrumLine: { position: 'relative', height: 2, borderRadius: 2, background: 'linear-gradient(90deg, var(--color-forest-green), var(--color-amber))' },
  spectrumStop: { position: 'absolute', top: '50%', transform: 'translate(-50%, -7px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textDecoration: 'none' },
  spectrumDot: { width: 14, height: 14, borderRadius: '50%', backgroundColor: 'var(--color-n000)', border: '3px solid var(--color-forest-green)', boxSizing: 'border-box' },
  spectrumLabel: { fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-n700)', textAlign: 'center', lineHeight: 1.3 },

  typeNum: { display: 'block', fontFamily: 'var(--font-hero)', fontSize: 15, fontWeight: 500, color: 'var(--color-amber)', letterSpacing: 1, marginBottom: 10 },
  typeTag: { display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-forest-green)', marginBottom: 6 },
  typeName: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 'clamp(22px, 2.6vw, 27px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 },
  typeBody: { fontFamily: 'var(--font-body)', fontSize: 16.5, lineHeight: 1.75, color: 'var(--color-n700)', margin: '12px 0 0', maxWidth: 520 },
  typeImgWrap: { position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' },
  typeImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },

  standardHead: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-forest-green)', margin: '0 0 16px', letterSpacing: '0.01em' },
  standardList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 13 },
  standardItem: { display: 'flex', gap: 12, fontFamily: 'var(--font-body)', fontSize: 15.5, lineHeight: 1.6, color: 'var(--color-n800)' },

  rule: { display: 'inline-block', width: 40, height: 2, backgroundColor: 'var(--color-amber)', marginBottom: 24 },
  note: { fontFamily: 'var(--font-body)', fontSize: 'clamp(17px, 2vw, 19px)', lineHeight: 1.7, color: 'var(--color-n700)', margin: 0 },
  inlineLink: { color: 'var(--color-forest-green)', fontWeight: 700, textDecoration: 'none' },
}
