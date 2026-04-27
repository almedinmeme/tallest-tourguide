import SEO from '../components/SEO'
import { Link } from 'react-router-dom'
import useWindowWidth from '../hooks/useWindowWidth'

import guide2      from '../assets/guide-2.webp'
import guide4      from '../assets/guide-4.webp'
import guide5      from '../assets/guide-5.webp'
import lukomir1    from '../assets/lukomir-1.webp'
import lukomir5    from '../assets/lukomir-5.webp'
import srebrenica3 from '../assets/srebrenica-3.webp'

const cards = [
  {
    img: guide2,
    tag: 'Our Promise',
    title: 'Our Commitment to You',
    body: 'Your safety — and the safety of the communities we visit — is our first priority. Every tour is led by a local guide with 14+ years of experience who knows the terrain, the culture, and the people. Groups are capped at 12 guests: faster decisions, more personal attention, and a smaller footprint on the places we love.',
  },
  {
    img: lukomir1,
    tag: 'Physical',
    title: 'Know Before You Go',
    body: 'Some of our tours involve mountain terrain, uneven paths, or long drives. We include honest fitness advisories on every tour page that requires one. If you have doubts about whether a tour suits your needs, reach out — we will give you a straight answer, not a sales pitch.',
  },
  {
    img: srebrenica3,
    tag: 'Emotional',
    title: 'Difficult History, Handled With Care',
    body: 'Several of our tours engage directly with trauma — the Siege of Sarajevo, the Srebrenica genocide, the Yugoslav wars. These are handled with full respect and depth. But they are emotionally demanding by nature. We encourage guests to review tour descriptions carefully and consider this before booking.',
  },
  {
    img: guide4,
    tag: 'Preparedness',
    title: 'Travel Insurance',
    body: 'We strongly recommend comprehensive travel insurance before joining any of our tours — covering medical expenses, emergency evacuation, trip cancellation, and personal liability. If something unexpected happens, insurance protects you in ways we simply cannot. Please arrange this before you travel.',
  },
  {
    img: guide5,
    tag: 'On Tour',
    title: 'We Are Here the Whole Way',
    body: 'Our guide carries emergency contacts at all times. If you feel unwell, unsafe, or uncomfortable at any point, tell us immediately. We would rather pause, adapt the route, or end the day early than push through something that is not working for you. Your comfort matters more than any itinerary.',
  },
  {
    img: lukomir5,
    tag: 'Conditions',
    title: 'Reading the Mountain',
    body: "Bosnia's mountain weather can shift quickly — especially in spring and autumn. We monitor forecasts closely and will adjust routes or timing when safety demands it. In rare cases where conditions make a tour genuinely unsafe, we reschedule or issue a full refund. The mountain will still be there next time.",
  },
]

function SafeTravels() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const isTablet = width > 768 && width <= 1024

  const cols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'

  return (
    <div style={{ backgroundColor: 'var(--color-n100)', minHeight: '100vh' }}>
      <SEO
        title="Safe Travels — Tallest Tourguide"
        description="How we keep guests safe on tours in Sarajevo and Bosnia. Travel insurance, fitness advisories, emotional preparedness, and our safety commitment."
      />

      {/* Header */}
      <section style={styles.pageHeader}>
        <div style={styles.headerInner}>
          <span style={styles.eyebrow}>Safety First</span>
          <h1 style={styles.headline}>Safe Travels</h1>
          <p style={styles.subheading}>
            We take your safety seriously — before, during, and after every tour. Here is how we think about it.
          </p>
        </div>
      </section>

      {/* Card grid */}
      <section style={{ padding: isMobile ? '40px 16px 64px' : '56px 40px 80px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '24px' }}>
            {cards.map((card) => (
              <div key={card.title} style={styles.card} className="card-lift">

                {/* Photo */}
                <div style={styles.photoWrap}>
                  <img
                    src={card.img}
                    alt={card.title}
                    loading="lazy"
                    style={styles.photo}
                  />
                  <span style={styles.tag}>{card.tag}</span>
                </div>

                {/* Body */}
                <div style={styles.cardBody}>
                  <h2 style={styles.cardTitle}>{card.title}</h2>
                  <p style={styles.cardText}>{card.body}</p>
                </div>

              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ ...styles.cta, flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
            <div>
              <p style={styles.ctaTitle}>Have a specific question?</p>
              <p style={styles.ctaSubtitle}>Ask us anything about fitness requirements, tour content, or local conditions before you book.</p>
            </div>
            <Link to="/contact" style={styles.ctaBtn} className="btn-lift btn-glow-green">
              Get in Touch
            </Link>
          </div>

        </div>
      </section>
    </div>
  )
}

const styles = {
  pageHeader: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '36px 40px',
  },
  headerInner: {
    maxWidth: '1160px',
    margin: '0 auto',
  },
  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '36px',
    color: '#fff',
    margin: '0 0 10px 0',
    lineHeight: 1.2,
  },
  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '560px',
  },
  card: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
  },
  photoWrap: {
    position: 'relative',
    height: '210px',
    flexShrink: 0,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform var(--t-lift)',
  },
  tag: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(6px)',
    color: '#fff',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '100px',
  },
  cardBody: {
    padding: '22px 24px 28px',
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '17px',
    color: 'var(--color-n900)',
    margin: '0 0 10px 0',
    lineHeight: 1.3,
  },
  cardText: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n600)',
    lineHeight: '1.75',
    margin: 0,
  },
  cta: {
    marginTop: '40px',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    padding: '28px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  ctaTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '17px',
    color: 'var(--color-n900)',
    margin: '0 0 4px 0',
  },
  ctaSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n600)',
    margin: 0,
    lineHeight: '1.6',
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'var(--color-forest-green)',
    color: '#fff',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '15px',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
}

export default SafeTravels
