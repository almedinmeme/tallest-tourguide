// SafeTravels.jsx
// Safety — and trust — before, during and after every tour. The page anxious
// guests read before committing real money to a multi-day trip, so alongside
// the physical/emotional safety content it carries the PaymentReassurance
// block and the where-you-sleep vetting note.
import { Link } from 'react-router-dom'
import { Mountain, HeartHandshake, Umbrella } from 'lucide-react'
import SEO from '../components/SEO'
import useWindowWidth from '../hooks/useWindowWidth'
import Button from '../components/Button'
import InfoHero from '../components/InfoHero'
import PaymentReassurance from '../components/PaymentReassurance'

import guide2   from '../assets/guide-2.webp'
import guide5   from '../assets/guide-5.webp'
import lukomir5 from '../assets/lukomir-5.webp'

// Declared before GROUND_ROWS — the rows' JSX is evaluated at module load,
// so it can't reach into the `styles` object defined at the bottom.
const inlineLink = { color: 'var(--color-forest-green)', fontWeight: 700, textDecoration: 'none' }

// The on-tour story — alternating photo + text rows.
const GROUND_ROWS = [
  {
    img: guide2,
    tag: 'Our promise',
    title: 'Our commitment to you',
    body: (
      <>
        Your safety — and the safety of the communities we visit — comes first. Every
        guide knows this terrain personally: not from a manual, but from living here.
        And we keep every group genuinely small on purpose — small enough to change
        plans in minutes, not hours, and light enough not to overwhelm the villages,
        trails and living rooms we're welcomed into.
      </>
    ),
  },
  {
    img: guide5,
    tag: 'On tour',
    title: 'If something goes wrong on tour',
    body: (
      <>
        Tell your guide immediately if you feel unwell, unsafe, or uncomfortable — we
        would rather stop, adapt, or end the day early than push through. Practically:
        your guide carries a phone with the local emergency numbers saved — 112
        (general), 124 (ambulance) — and speaks the language needed to get you help
        fast. In Sarajevo, the main hospital for visitors needing urgent care is Koševo
        University Clinical Center, and pharmacies (apoteka) throughout the centre are
        used to helping tourists. On multi-day trips, your guide knows the nearest
        clinic for that specific route before you leave — ask, if it would put your
        mind at ease.
      </>
    ),
  },
  {
    img: lukomir5,
    tag: 'Conditions',
    title: 'Reading the mountain',
    body: (
      <>
        Weather in the Bosnian mountains can change faster than the forecast updates —
        especially in Lukomir and on Trebević in spring and autumn. A route gets adjusted
        or postponed when visibility drops enough that marked trails become hard to
        follow, when temperatures make exposed sections genuinely risky, or when local
        shepherds and rangers flag conditions we can't see from the trailhead. That call
        isn't made from an office — it's made on the ground, the morning of. If a tour is
        called off for safety, we reschedule or issue a full refund —{' '}
        <Link to="/booking-conditions" style={inlineLink}>see how refunds work</Link>.
        The mountain will still be there next time.
      </>
    ),
  },
]

// The honest-preparation columns — deliberately quiet, icon-anchored.
const BEFORE_COLUMNS = [
  {
    icon: Mountain,
    title: 'Know before you go',
    body: 'Some tours involve mountain terrain, uneven paths, or long drives. Every tour page that needs one carries an honest fitness advisory — written by the guide who leads it, not marketing copy. If you\'re unsure whether a tour suits you, ask before booking. You\'ll get a straight answer, not a sales pitch.',
  },
  {
    icon: HeartHandshake,
    title: 'Difficult history, handled with care',
    body: 'Several tours engage directly with trauma — the Siege of Sarajevo, the Srebrenica genocide, the Yugoslav wars. These are subjects real people in this city lived through, and they\'re handled with the weight they deserve, not performed for effect. They are also emotionally demanding by nature. Read the tour description carefully, and know that it\'s fine to ask questions beforehand — including "is this too much for my kids" or "will there be time to step away if I need to."',
  },
  {
    icon: Umbrella,
    title: 'Travel insurance',
    body: 'We strongly recommend comprehensive travel insurance before joining any tour — medical expenses, emergency evacuation, trip cancellation, personal liability. One detail worth knowing: EU/UK health cards (EHIC/GHIC) do not cover Bosnia, since it isn\'t in the EU. Standard travel insurance is genuinely necessary here, not just a formality. Please arrange it before you travel.',
  },
]

function SafeTravels() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
      <SEO
        title="Safe Travels"
        description="How we look after guests on small-group tours in Sarajevo and Bosnia — honest fitness advisories, difficult history handled with care, weather calls, travel insurance, and how your payment is handled."
        url="/safe-travels"
      />

      <InfoHero
        kicker="Safety & peace of mind"
        title="Safe travels"
        lede="We take your safety — and your trust — seriously, before, during and after every tour. Here is exactly how."
        chips={['Genuinely small groups', 'Guide-led emergency response, not a call center', 'Full refund if we ever cancel']}
      />

      {/* On the ground — alternating photo + text rows */}
      <section style={{ padding: isMobile ? '40px 24px 8px' : '56px 24px 16px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <span style={styles.eyebrow}>On the ground</span>
          <h2 style={styles.h2}>How we look after you</h2>

          <div style={{ marginTop: isMobile ? 24 : 16 }}>
            {GROUND_ROWS.map((row, i) => {
              const imageRight = i % 2 === 1
              const Photo = (
                <div style={styles.rowImgWrap}>
                  <img src={row.img} alt={row.title} loading={i === 0 ? 'eager' : 'lazy'} style={styles.rowImg} />
                </div>
              )
              const Text = (
                <div>
                  <span style={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={styles.rowTag}>{row.tag}</span>
                  <h3 style={styles.rowTitle}>{row.title}</h3>
                  <p style={styles.rowBody}>{row.body}</p>
                </div>
              )
              return (
                <article
                  key={row.title}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? 18 : 56,
                    alignItems: 'center',
                    padding: isMobile ? '32px 0' : '44px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--color-n200)',
                  }}
                >
                  {isMobile || !imageRight ? (<>{Photo}{Text}</>) : (<>{Text}{Photo}</>)}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Before you book — quiet text columns */}
      <section style={{ padding: isMobile ? '44px 24px 52px' : '60px 24px 72px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ paddingTop: isMobile ? 28 : 36, borderTop: '1px solid var(--color-n200)' }}>
            <span style={styles.eyebrow}>Before you book</span>
            <h2 style={styles.h2}>Honesty is part of safety</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 28 : 44, marginTop: 32 }}>
              {BEFORE_COLUMNS.map((col) => {
                const Icon = col.icon
                return (
                  <div key={col.title}>
                    <Icon size={20} color="var(--color-forest-green)" strokeWidth={1.8} style={{ marginBottom: 12 }} />
                    <h3 style={styles.colTitle}>{col.title}</h3>
                    <p style={styles.colBody}>{col.body}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Your money, handled properly */}
      <PaymentReassurance variant="full" />

      {/* Where you sleep is part of safety */}
      <section style={{ padding: isMobile ? '48px 24px 16px' : '64px 24px 24px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', textAlign: 'center' }}>
          <span aria-hidden style={styles.rule} />
          <p style={styles.note}>
            Safety includes where you sleep. We only book family-owned places — homestays,
            agrotourism estates and locally owned boutique hotels, never international
            chains — hosts we know by name. Read about{' '}
            <Link to="/where-we-stay" style={inlineLink}>where we stay</Link>.
          </p>
        </div>
      </section>

      {/* End CTA */}
      <section style={{ padding: '24px 24px 96px', textAlign: 'center' }}>
        <Button to="/contact" variant="secondary" size="lg" arrow>
          Ask us anything before you book
        </Button>
        <p style={styles.ctaNote}>
          Fitness requirements, tour content, local conditions — straight answers, not a
          sales pitch.
        </p>
      </section>
    </main>
  )
}

const styles = {
  eyebrow: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-forest-green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 },
  h2: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(24px, 3.4vw, 34px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 },

  rowNum: { display: 'block', fontFamily: 'var(--font-hero)', fontSize: 15, fontWeight: 500, color: 'var(--color-amber)', letterSpacing: 1, marginBottom: 10 },
  rowTag: { display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-forest-green)', marginBottom: 6 },
  rowTitle: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 'clamp(22px, 2.6vw, 27px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 },
  rowBody: { fontFamily: 'var(--font-body)', fontSize: 16.5, lineHeight: 1.75, color: 'var(--color-n700)', margin: '12px 0 0', maxWidth: 520 },
  rowImgWrap: { position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' },
  rowImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },

  colTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--color-n900)', margin: '0 0 10px', lineHeight: 1.3 },
  colBody: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.75, color: 'var(--color-n600)', margin: 0 },

  rule: { display: 'inline-block', width: 40, height: 2, backgroundColor: 'var(--color-amber)', marginBottom: 24 },
  note: { fontFamily: 'var(--font-body)', fontSize: 'clamp(17px, 2vw, 19px)', lineHeight: 1.7, color: 'var(--color-n700)', margin: 0 },

  ctaNote: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-n500)', marginTop: 16, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' },
}

export default SafeTravels
