import SEO from '../components/SEO'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Star, Languages, Heart } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'

// Import your about photo — add this file to src/assets
// Name it about-me.webp and compress under 300KB
import aboutPhoto from '../assets/about-me.webp'

function About() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <div>
<SEO
  title="About Your Guide"
  description="Meet Almedin — born and raised in Sarajevo, guiding since day one. 500+ guests, 4.9 TripAdvisor rating, maximum 8 people per tour."
  url="/about"
/>
      {/* ── PAGE HEADER ─────────────────────────────────── */}
      <section style={styles.pageHeader}>
        <div style={styles.headerInner}>
          <span style={styles.eyebrow}>Your Guide</span>
          <h1 style={{
            ...styles.headline,
            fontSize: isMobile ? '32px' : '48px',
          }}>
            Born Here.<br />
            Still Here.<br />
            Proudly Here.
          </h1>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <section style={{
        ...styles.contentSection,
        padding: isMobile ? '48px 24px 64px 24px' : '72px 40px 80px 40px',
      }}>
        <div style={{
          ...styles.contentGrid,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 420px',
          gap: isMobile ? '40px' : '72px',
        }}>

          {/* ── LEFT — Text ─────────────────────────────── */}
          <div style={{ ...styles.textColumn, order: isMobile ? 2 : 1 }}>

  <p style={styles.leadText}>
    Some careers are planned. Mine was built conversation by conversation.
  </p>

  <p style={styles.bodyText}>
    I came to tourism the way most good things happen — accidentally.
    During my university years, I started working the front desk at a
    local hostel, partly for the income, mostly because I have never
    been someone who could sit still. I am outgoing by nature, always
    have been, and a hostel lobby turned out to be the perfect place
    for someone like me. Guests came through from everywhere, and I
    was always ready to talk.
  </p>

  <p style={styles.bodyText}>
    The guiding started quietly. A few tours here and there in the
    early months, nothing serious. But as my English sharpened and my
    confidence grew, so did the work. What I had going for me was
    never a textbook — it was a lifetime of listening. Stories from
    my father, my family, neighbors, friends — people who remembered
    Sarajevo in ways no guidebook ever captured. I had been collecting
    those stories long before I knew what to do with them. Later, I
    filled in the gaps with proper research and the knowledge of
    colleagues who had worked in tourism for decades. The result was
    a voice that felt lived-in, not recited.
  </p>

  <p style={styles.bodyText}>
    After years splitting my time between the hostel desk and the
    streets of Sarajevo, one of the leading agencies in the region
    took a chance on me as a young prospect. I spent nearly three
    years there, growing into the role, learning the industry from
    the inside. Then, at 24, I opened my own tour agency — Tallest
    Tourguide — and it became the first real proof that I could build
    something from scratch.
  </p>

  <p style={styles.bodyText}>
    Tallest Tourguide was never just a tour company. It was an attempt
    to do tourism differently — cooking classes, alternative routes,
    experiences that felt personal rather than packaged. It worked.
    And then COVID came, and like so much else, it stopped.
  </p>

  <p style={styles.bodyText}>
    Rather than wait, I pivoted. I turned to something I had always
    been drawn to visually — UX/UI design. Over the next four years,
    I built genuine expertise in how people navigate digital spaces,
    what makes an experience feel intuitive, and how design decisions
    shape the way people feel. Skills that, as it turns out, are not
    so different from guiding a stranger through an unfamiliar city.
  </p>

  <blockquote style={styles.pullQuote}>
    "Now I am back. Tallest Tourguide & Friends is back. This is not
    a return. It is a second chapter, built on everything the first
    one taught me."
  </blockquote>


{/* Stats */}
  <div style={{
    ...styles.statsRow,
    display: isMobile ? 'grid' : 'flex',
    gridTemplateColumns: isMobile ? '1fr 1fr' : undefined,
    flexDirection: isMobile ? undefined : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
  }}>
    <div style={{ ...styles.stat, textAlign: isMobile ? 'center' : 'left', padding: isMobile ? '16px 8px' : '0' }}>
      <span style={styles.statNumber}>5000+</span>
      <span style={styles.statLabel}>Guests Guided</span>
    </div>
    {!isMobile && <div style={styles.statDivider} />}
    <div style={{ ...styles.stat, textAlign: isMobile ? 'center' : 'left', padding: isMobile ? '16px 8px' : '0' }}>
      <span style={styles.statNumber}>14</span>
      <span style={styles.statLabel}>Years in Tourism</span>
    </div>
    {!isMobile && <div style={styles.statDivider} />}
    <div style={{
      ...styles.stat,
      textAlign: isMobile ? 'center' : 'left',
      padding: isMobile ? '16px 8px' : '0',
      gridColumn: isMobile ? 'span 2' : 'auto',
      borderTop: isMobile ? '1px solid var(--color-n300)' : 'none',
    }}>
      <span style={styles.statNumber}>4.9</span>
      <span style={styles.statLabel}>TripAdvisor Rating</span>
    </div>
  </div>

 {/* CTA buttons */}
  <div style={{
    ...styles.ctaRow,
    flexDirection: isMobile ? 'column' : 'row',
  }}>
    <Link to="/tours" style={styles.primaryBtn}>
      <span>Browse Tours</span>
      <ArrowRight size={16} color="var(--color-n000)" />
    </Link>
    <Link to="/contact" style={styles.secondaryBtn}>
      Get in Touch
    </Link>
  </div>

</div>

          {/* ── RIGHT — Photo ────────────────────────────── */}
          <div style={{
            ...styles.photoColumn,
            order: isMobile ? 1 : 2,
            position: isMobile ? 'static' : 'sticky',
            top: isMobile ? 'auto' : '100px',
          }}>

            <div style={styles.photoWrapper}>
              <img
                src={aboutPhoto}
                alt="Almedin — Tallest Tourguide"
                style={styles.photo}
              />
            </div>

            {/* Small info card below photo */}
            <div style={styles.infoCard}>
              <div style={styles.infoCardItem}>
                <MapPin
                  size={18}
                  color="var(--color-forest-green)"
                />
                <span style={styles.infoCardText}>
                  Born and raised in Sarajevo
                </span>
              </div>
              <div style={styles.infoCardItem}>
                <Heart
                  size={18}
                  color="var(--color-forest-green)"
                />
                <span style={styles.infoCardText}>
                  Volleyball, painting, and reading
                </span>
              </div>
              <div style={styles.infoCardItem}>
                <Languages
                  size={18}
                  color="var(--color-forest-green)"
                />
                <span style={styles.infoCardText}>
                  English, Bosnian, and a bit of Spanish
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}

const styles = {
  pageHeader: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '72px 40px 80px 40px',
    position: 'relative',
    overflow: 'hidden',
  },

  headerInner: {
    maxWidth: '680px',
  },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-mid-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },

  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: 'var(--color-n000)',
    lineHeight: '1.15',
    margin: 0,
  },

  contentSection: {
    backgroundColor: 'var(--color-n100)',
  },

  contentGrid: {
    display: 'grid',
    maxWidth: '1100px',
    margin: '0 auto',
    alignItems: 'start',
  },

  textColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  leadText: {
    fontFamily: 'var(--font-body)',
    fontSize: '24px',
    color: 'var(--color-n900)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
    fontWeight: '500',
  },

  bodyText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
  },

  pullQuote: {
    borderLeft: '4px solid var(--color-forest-green)',
    backgroundColor: 'var(--color-amber-light)',
    padding: '16px 20px',
    borderRadius: '0 8px 8px 0',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n900)',
    fontStyle: 'italic',
    lineHeight: '1.5',
    margin: '4px 0',
  },

  statsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    padding: '24px',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    border: '1px solid var(--color-n300)',
  },

  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },

  statNumber: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-forest-green)',
  },

  statLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  statDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: 'var(--color-n300)',
    flexShrink: 0,
  },

  ctaRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },

  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '48px',
    padding: '0 24px',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
  },

  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '48px',
    padding: '0 24px',
    backgroundColor: 'transparent',
    color: 'var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    border: '1.5px solid var(--color-forest-green)',
  },

  photoColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

 photoWrapper: {
    borderRadius: '16px',
    overflow: 'hidden',
    aspectRatio: '2/3',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },

  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  infoCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid var(--color-n300)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  infoCardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  infoCardText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
  },
}

export default About