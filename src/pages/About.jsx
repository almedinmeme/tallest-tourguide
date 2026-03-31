import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Star, Users } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'

// Import your about photo — add this file to src/assets
// Name it about-me.webp and compress under 300KB
import aboutPhoto from '../assets/about-me.webp'

function About() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <div>

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
          <div style={styles.textColumn}>

            <p style={styles.leadText}>
              Sarajevo isn't just where I work — it's everything I have.
              My family, my people, and the stories that built me are
              all rooted in this city. I was born here, raised here,
              and I chose to stay here — not because I had to, but
              because I genuinely believe there is no better place
              to build a life.
            </p>

            <p style={styles.bodyText}>
              Tallest Tourguide started as a mission. I wanted
              travellers to feel seen — not processed. I wanted them
              to leave Bosnia carrying something real. A conversation
              they didn't expect. A story that surprised them. A meal
              that had nothing to do with any menu they'd ever seen.
            </p>

            <p style={styles.bodyText}>
              What makes a tour here different isn't the itinerary —
              it's the approach. You won't be a number in a group of
              forty. You'll be a guest, welcomed the way we welcome
              people in Bosnia — like a friend arriving at our door.
              The history, the culture, the complexity of this place —
              I know it deeply, and I'll share all of it with you.
            </p>

            <p style={styles.bodyText}>
              I started this because I wanted every traveller who comes
              here to feel free, to feel connected, and to feel like
              Bosnia was made for them. I started it to become an
              ambassador for my people. After 500+ guests and 180
              TripAdvisor reviews, I still feel exactly the same way
              about every single tour I guide.
            </p>

            {/* Pull quote */}
            <blockquote style={styles.pullQuote}>
              "I want every traveller who comes here to feel free,
              to feel connected, and to feel like Bosnia was made
              for them."
            </blockquote>

            {/* Stats row */}
            <div style={{
              ...styles.statsRow,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '16px' : '32px',
            }}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>500+</span>
                <span style={styles.statLabel}>Guests Guided</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <span style={styles.statNumber}>180</span>
                <span style={styles.statLabel}>
                  TripAdvisor Reviews
                </span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <span style={styles.statNumber}>4.9</span>
                <span style={styles.statLabel}>Average Rating</span>
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
          <div style={styles.photoColumn}>

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
                  size={15}
                  color="var(--color-forest-green)"
                />
                <span style={styles.infoCardText}>
                  Born and raised in Sarajevo
                </span>
              </div>
              <div style={styles.infoCardItem}>
                <Star
                  size={15}
                  color="var(--color-amber)"
                  fill="var(--color-amber)"
                />
                <span style={styles.infoCardText}>
                  4.9 rating across 180+ reviews
                </span>
              </div>
              <div style={styles.infoCardItem}>
                <Users
                  size={15}
                  color="var(--color-forest-green)"
                />
                <span style={styles.infoCardText}>
                  Max 8 people per tour
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
    fontSize: 'var(--text-body-l)',
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
    position: 'sticky',
    top: '100px',
  },

  photoWrapper: {
    borderRadius: '16px',
    overflow: 'hidden',
    aspectRatio: '4/3',
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