// Home.jsx
// This is your landing page — the first thing every visitor sees.
// It's made up of sections stacked vertically.
// Right now we're building the Hero section first.
// Each section will eventually become its own component,
// but we'll write everything here first so you can see it working
// before we break it apart.
import TourCard from '../components/TourCard'
import tours from '../data/tours'
import useWindowWidth from '../hooks/useWindowWidth'
import { Star, Users, UserCheck, ShieldCheck } from 'lucide-react'
import GuideSection from '../components/GuideSection'

function Home() {
  const width = useWindowWidth()
const isMobile = width <= 768
  return (
    // The outer div is your page wrapper.
    // As we add more sections below the hero, they'll stack here.
    <div>

      {/* ═══════════════════════════════
          HERO SECTION
          Full-width banner — first thing visitors see.
          ═══════════════════════════════ */}
      <section style={styles.heroOuter}>

        {/* Inner container constrains content width on large screens.
            Without this, your headline would stretch across a 4K monitor
            and become almost unreadable. */}
        <div style={styles.heroInner}>

          {/* The small label above the headline — called an "eyebrow" in design.
              It gives context before the visitor reads the main headline. */}
          <span style={styles.eyebrow}>Sarajevo & Beyond</span>

          {/* Your main headline — this is the largest text on the page.
              It uses your Display size from your design system: 48px. */}
          <h1 style={styles.headline}>
            Explore Bosnia With<br />
            Someone Who Calls<br />
            It Home
          </h1>

          {/* Supporting text — expands on the headline with one specific detail.
              Uses Body L size: 18px. Kept short intentionally.
              Visitors scan, they don't read. */}
          <p style={styles.subheading}>
            Small group tours led by a local guide. Real stories,
            hidden places, and memories that outlast any postcard.
          </p>

          {/* CTA button row — two buttons following your design system.
              Primary action: Book Now in Warm Amber.
              Secondary action: Explore Tours as a ghost/outline button. */}
          <div style={styles.ctaRow}>
            <a href="/tours" style={styles.btnPrimary}>Book Now</a>
            <a href="/tours" style={styles.btnSecondary}>Explore Tours</a>
          </div>

        </div>
      </section>
      {/* ═══════════════════════════════
          TRUST BAR
          Sits immediately below the hero.
          Four scannable credibility signals
          that collapse the "is this legitimate?"
          objection before the visitor has
          consciously asked it.
          ═══════════════════════════════ */}
      <section style={styles.trustBar}>
        <div style={{
          ...styles.trustBarInner,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '16px' : '0',
        }}>

          <div style={styles.trustItem}>
            <Star size={18} color="var(--color-amber)" fill="var(--color-amber)" />
            <span style={styles.trustText}>4.9 on TripAdvisor</span>
          </div>

          {!isMobile && <div style={styles.trustDivider} />}

          <div style={styles.trustItem}>
            <Users size={18} color="var(--color-forest-green)" />
            <span style={styles.trustText}>500+ Guests Guided</span>
          </div>

          {!isMobile && <div style={styles.trustDivider} />}

          <div style={styles.trustItem}>
            <UserCheck size={18} color="var(--color-forest-green)" />
            <span style={styles.trustText}>Small Groups — Max 8 People</span>
          </div>

          {!isMobile && <div style={styles.trustDivider} />}

          <div style={styles.trustItem}>
            <ShieldCheck size={18} color="var(--color-forest-green)" />
            <span style={styles.trustText}>Free Cancellation Available</span>
          </div>

        </div>
      </section>
      
      <GuideSection />
{/* ═══════════════════════════════
          FEATURED TOURS SECTION
          Three of your best tours shown immediately
          below the hero to keep scrollers engaged.
          ═══════════════════════════════ */}
      <section style={styles.toursSection}>

        {/* Section header */}
        <div style={styles.sectionHeader}>
          <span style={styles.sectionEyebrow}>What We Offer</span>
          <h2 style={styles.sectionTitle}>Our Most Popular Tours</h2>
          <p style={styles.sectionSubtitle}>
            Every tour is led personally by your guide. Small groups only —
            never more than 8 people — so every question gets answered.
          </p>
        </div>

        {/* Card grid — three cards side by side on desktop.
            Each TourCard receives its specific data via props.
            Notice we're not repeating the card design — just the data. */}
<div style={{
  ...styles.cardGrid,
  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
}}>
  {tours.slice(0, 3).map((tour) => (
    <TourCard
      key={tour.id}
      id={tour.id}
      title={tour.title}
      price={tour.price}
      rating={tour.rating}
      reviews={tour.reviews}
      duration={tour.duration}
      groupSize={tour.groupSize}
      badge={tour.badge}
      hero={tour.hero}
    />
  ))}
</div>


      </section>
    </div>
  )
}

// ─────────────────────────────────────────────
// STYLES
// Written as JavaScript objects because we're in JSX.
// Every property is camelCase (backgroundColor not background-color).
// We reference your CSS variables with var(--variable-name)
// so everything stays connected to your design system.
// ─────────────────────────────────────────────
const styles = {

  // The outer hero container spans the full width of the page.
  // min-height of 88vh means it takes up 88% of the visible screen height —
  // tall enough to feel immersive, but leaving a hint of content below
  // so visitors know there's more to scroll to.
  heroOuter: {
    minHeight: '88vh',
    backgroundColor: 'var(--color-forest-green)',
    display: 'flex',
    alignItems: 'center',        // Vertically centers the inner content
    padding: '80px 40px',
  },

  // The inner container caps the content width at 680px.
  // This is a deliberate readability decision — lines of text that are
  // too wide are harder for the eye to track back to the next line.
  heroInner: {
    maxWidth: '680px',
  },

  // The eyebrow sits above the headline in a small, spaced-out style.
  // The letter spacing (tracked out) signals "category label" to the reader.
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

  // The main headline uses your Display size — the biggest text on the page.
  // White on Forest Green gives maximum contrast and warmth.
  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-display)',
    lineHeight: 'var(--leading-display)',
    color: 'var(--color-n000)',
    marginBottom: '24px',
  },

  // The subheading is calmer — lighter weight, more breathing room.
  // It reassures rather than sells.
  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    lineHeight: 'var(--leading-body)',
    color: 'var(--color-amber-light)',
    marginBottom: '40px',
    maxWidth: '520px',       // Slightly narrower than the headline for visual rhythm
  },

  // The CTA row uses flexbox to place the two buttons side by side
  // with a comfortable gap between them.
  ctaRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',        // On mobile, buttons stack vertically automatically
  },

  // Primary button — Warm Amber, your highest-converting color.
  // Height is exactly 44px to match your design system's touch target rule.
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 'var(--touch-target)',
    padding: '0 28px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
  },

  // Secondary button — transparent background with a white border.
  // This is your Ghost / Outline button from the design system.
  // It offers a lower-commitment alternative to Book Now.
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    height: 'var(--touch-target)',
    padding: '0 28px',
    backgroundColor: 'transparent',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    border: '1.5px solid rgba(255,255,255,0.4)',
  },
toursSection: {
    padding: '80px 40px',
    backgroundColor: 'var(--color-n100)',
  },

  sectionHeader: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto 56px auto',
  },

  sectionEyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h1)',
    color: 'var(--color-n900)',
    marginBottom: '16px',
  },

  sectionSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
  },

  // CSS Grid creates the three-column layout automatically.
  // repeat(3, 1fr) means: make 3 columns of equal width.
  // The gap adds breathing room between the cards.
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '28px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  trustBar: {
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n300)',
    padding: '20px 40px',
  },

  trustBarInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '900px',
    margin: '0 auto',
  },

  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 40px',
    flex: 1,
    justifyContent: 'center',
  },

  trustIcon: {
    fontSize: '18px',
    color: 'var(--color-amber)',
  },

  trustText: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
    whiteSpace: 'nowrap',
  },

  trustDivider: {
    width: '1px',
    height: '32px',
    backgroundColor: 'var(--color-n300)',
    flexShrink: 0,
  },
}

export default Home