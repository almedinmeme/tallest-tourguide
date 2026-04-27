import SEO from '../components/SEO'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Languages, Heart, BookOpen, Users, Globe, Clock } from 'lucide-react'
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
  image="https://tallesttourguide.com/og-image.jpg"
/>
      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <section style={{
        ...styles.contentSection,
        padding: isMobile ? '48px 24px 64px 24px' : '72px 40px 80px 40px',
      }}>
        <div style={{
          ...styles.contentGrid,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 340px',
          gap: isMobile ? '40px' : '64px',
        }}>

          {/* ── LEFT — Text ─────────────────────────────── */}
          <div style={{ ...styles.textColumn, order: isMobile ? 2 : 1 }}>

  <p style={styles.leadText}>
    My name is Almedin Memović. I was born in Sarajevo in 1993 — in the first year of the Siege.
  </p>

  <p style={styles.bodyText}>
    I came to tourism the way most good things happen — accidentally.
    During my university years I started working the front desk at a local hostel,
    and a lobby full of guests from everywhere turned out to be the perfect place
    for someone who has never been able to sit still.
  </p>

  <p style={styles.bodyText}>
    The guiding grew from there. What I had going for me was never a textbook —
    it was a lifetime of listening. Stories from my father, my family, people who
    remembered Sarajevo in ways no guidebook captured. The Siege. Yugoslavia. The years
    after. I had been collecting those stories long before I knew what to do with them.
  </p>

  <p style={styles.bodyText}>
    One of the leading agencies in the region took a chance on me as a young prospect.
    Three years later I opened Tallest Tourguide at 24 — cooking classes, alternative routes,
    experiences that felt personal rather than packaged. Then COVID came, and like so much else, it stopped.
    I spent the next four years building expertise in UX and design. Now I am back.
  </p>

  <blockquote style={styles.pullQuote}>
    "Tallest Tourguide & Friends is back. This is not a return. It is a second chapter,
    built on everything the first one taught me."
  </blockquote>


 {/* CTA buttons */}
  <div style={{
    ...styles.ctaRow,
    flexDirection: isMobile ? 'column' : 'row',
  }}>
    <Link to="/tours" style={styles.primaryBtn} className="btn-lift btn-glow-green">
      <span>Browse Tours</span>
      <ArrowRight size={16} color="var(--color-n000)" />
    </Link>
    <Link to="/contact" style={styles.secondaryBtn} className="btn-lift">
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
                <MapPin size={14} color="var(--color-forest-green)" />
                <span style={styles.infoCardText}>Born in Sarajevo, 1993</span>
              </div>
              <div style={styles.infoCardItem}>
                <Clock size={14} color="var(--color-forest-green)" />
                <span style={styles.infoCardText}>14 years in tourism</span>
              </div>
              <div style={styles.infoCardItem}>
                <Users size={14} color="var(--color-forest-green)" />
                <span style={styles.infoCardText}>5,000+ guests guided</span>
              </div>
              <div style={styles.infoCardItem}>
                <Languages size={14} color="var(--color-forest-green)" />
                <span style={styles.infoCardText}>English · Bosnian · Spanish</span>
              </div>
              <div style={styles.infoCardItem}>
                <Heart size={14} color="var(--color-forest-green)" />
                <span style={styles.infoCardText}>Volleyball, painting, reading</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── GUIDE CREDENTIALS ───────────────────────────── */}
      <section style={{
        ...styles.credentialsSection,
        padding: isMobile ? '56px 24px 72px' : '80px 40px 96px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{
            ...styles.credentialsGrid,
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '40px' : '72px',
          }}>

            {/* LEFT — text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span style={styles.eyebrow}>Guide Credentials</span>
                <h2 style={styles.credentialsHeadline}>
                  History is personal here.
                </h2>
                <p style={styles.credentialsLead}>
                  My father remembers the Siege. My grandparents remember Yugoslavia. I grew up hearing
                  these stories long before I knew what to do with them. When I guide, I am not reading
                  from a script — I am translating decades of family memory, shaped by fourteen years of
                  work and learning from colleagues who built entire careers in this city.
                </p>
                <p style={styles.credentialsBody}>
                  The result is a voice that carries weight. Not performative. Not packaged. Just honest
                  proximity to events that shaped a continent — delivered to eight people at a time, at a
                  pace that actually lets you absorb what you are seeing.
                </p>
              </div>

              <div style={styles.specializationBlock}>
                <span style={styles.specializationLabel}>Areas of depth</span>
                <div style={styles.specializationTags}>
                  {[
                    'Ottoman Sarajevo',
                    'Austro-Hungarian era',
                    'WWII in Bosnia',
                    'The Siege (1992–1995)',
                    'Srebrenica',
                    'Dayton Agreement',
                    'Interreligious coexistence',
                    'Balkan politics',
                  ].map((tag) => (
                    <span key={tag} style={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — credential cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {[
                {
                  icon: Globe,
                  title: 'Languages',
                  body: 'English (fluent) · Bosnian / Croatian / Serbian (native) · Spanish (conversational). Every tour runs in English; local context is never lost in translation.',
                },
                {
                  icon: MapPin,
                  title: 'Born and Raised in Sarajevo',
                  body: 'Not a transplant, not a travel enthusiast who moved here. Sarajevo is home in the literal sense — the streets, the neighborhoods, the people. That depth does not come from a guidebook.',
                },
                {
                  icon: BookOpen,
                  title: 'Fourteen Years in the Industry',
                  body: 'Started at a hostel front desk during university. Moved to one of the leading regional agencies. Built and ran Tallest Tourguide from age 24. Every year added a layer that no certification replaces.',
                },
                {
                  icon: Users,
                  title: 'Maximum Eight Guests',
                  body: 'A deliberate limit, not a marketing line. Small groups move differently — through crowds, through conversations, through moments that a bus tour cannot reach.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} style={styles.credentialCard}>
                  <div style={styles.credentialCardIcon}>
                    <Icon size={18} color="var(--color-forest-green)" />
                  </div>
                  <div>
                    <h3 style={styles.credentialCardTitle}>{title}</h3>
                    <p style={styles.credentialCardBody}>{body}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

const styles = {
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
    borderRadius: '14px',
    overflow: 'hidden',
    aspectRatio: '3/4',
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
    borderRadius: '10px',
    padding: '14px 16px',
    border: '1px solid var(--color-n300)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  infoCardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  infoCardText: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
  },

  // ── Credentials strip ──────────────────────────────
  credentialsStrip: {
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n300)',
  },

  credentialsStripInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    overflowX: 'auto',
  },

  credentialsStripItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '18px 32px 18px 0',
    marginRight: '32px',
    borderRight: '1px solid var(--color-n300)',
    flexShrink: 0,
  },

  credentialsStripLabel: {
    display: 'block',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '15px',
    color: 'var(--color-n900)',
    lineHeight: 1.2,
  },

  credentialsStripSub: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
    marginTop: '2px',
  },

  // ── Credentials section ────────────────────────────
  credentialsSection: {
    backgroundColor: 'var(--color-n000)',
    borderTop: '1px solid var(--color-n300)',
  },

  credentialsGrid: {
    display: 'grid',
    alignItems: 'start',
  },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    color: 'var(--color-forest-green)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  credentialsHeadline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '32px',
    color: 'var(--color-n900)',
    margin: '0 0 16px 0',
    lineHeight: 1.2,
  },

  credentialsLead: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n700)',
    lineHeight: '1.75',
    margin: '0 0 16px 0',
  },

  credentialsBody: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: '1.75',
    margin: 0,
  },

  specializationBlock: {
    paddingTop: '8px',
  },

  specializationLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    color: 'var(--color-n500)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  specializationTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },

  tag: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--color-n700)',
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n300)',
    borderRadius: '100px',
    padding: '4px 12px',
  },

  // ── Credential cards ───────────────────────────────
  credentialCard: {
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n300)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },

  credentialCardIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'rgba(46,125,94,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  credentialCardTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '15px',
    color: 'var(--color-n900)',
    margin: '0 0 6px 0',
    lineHeight: 1.3,
  },

  credentialCardBody: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
    lineHeight: '1.7',
    margin: 0,
  },
}

export default About