// Home.jsx
// This is your landing page — the first thing every visitor sees.
// It's made up of sections stacked vertically.
// Right now we're building the Hero section first.
// Each section will eventually become its own component,
// but we'll write everything here first so you can see it working
// before we break it apart.
import SEO from '../components/SEO'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight, Star, ChevronDown, Users, UserCheck, ShieldCheck } from 'lucide-react'
import TourCard from '../components/TourCard'
import tours from '../data/tours'
import useWindowWidth from '../hooks/useWindowWidth'
import heroBg from '../assets/hero-bg.webp'
import GuideSection from '../components/GuideSection'
import HowItWorks from '../components/HowItWorks'
import Reviews from '../components/Reviews'
import CTABanner from '../components/CTABanner'
import PackagesPreview from '../components/PackagesPreview'


function Home() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const [primaryHovered, setPrimaryHovered] = useState(false)
  const [secondaryHovered, setSecondaryHovered] = useState(false)

  return (

    
    
    // The outer div is your page wrapper.
    // As we add more sections below the hero, they'll stack here.
    <div>
<SEO
  title="Guided Tours in Sarajevo"
  description="Small group tours in Sarajevo and Bosnia led by a local guide. War history, food tours, day trips to Mostar and more. Max 12 people. Book online."
  url="/"
  image="https://tallesttourguide.com/og-image.jpg"
/>
     {/* ═══════════════════════════════
          HERO SECTION — Redesigned
          Full-viewport photo hero with
          directional gradient overlay,
          left-aligned typographic headline,
          and animated scroll indicator.
          ═══════════════════════════════ */}
      <section style={{
          ...styles.hero,
          height: isMobile ? '80vh' : '100vh',
          minHeight: isMobile ? '480px' : '600px',
        }}>

        {/* Background photo layer —
            sits behind everything else via z-index.
            objectFit cover fills the entire section
            regardless of the photo's original dimensions. */}
        <img
          src={heroBg}
          alt="Sarajevo guided tour experience"
          style={{
            ...styles.heroBg,
            objectPosition: isMobile ? 'left center' : 'center',
          }}
        />

        {/* Gradient overlay — runs left to right.
            Left side is dark for text readability.
            Right side fades to transparent so the
            photo breathes and stays visually present.
            A second subtle bottom gradient ensures
            the scroll indicator is always readable. */}
        <div style={styles.heroGradient} />
        <div style={styles.heroGradientBottom} />

        {/* Main content — anchored to the left middle */}
        <div style={{
          ...styles.heroContent,
          padding: isMobile ? '0 24px' : '0 72px',
        }}>

          {/* Location tag — small pill above the headline.
              Grounded in place immediately — visitors know
              exactly where this is before they read anything else. */}
          <div style={styles.locationTag}>
            <MapPin size={12} color="var(--color-amber)" />
            <span style={styles.locationText}>
              Sarajevo, Bosnia & Herzegovina
            </span>
          </div>

          {/* Typographic contrast headline —
              first line lighter weight, second line heavy bold.
              The weight contrast creates visual energy and
              makes the headline feel designed rather than typed.
              This is the technique that gives the hero its
              bold, energetic character without needing
              to make everything big and loud simultaneously. */}
          <h1 style={{
            ...styles.heroHeadline,
            fontSize: isMobile ? '32px' : '56px',
          }}>
            <span style={styles.heroHeadlineThin}>
              You Won't Just See Bosnia.
            </span>
            <br />
            <span style={styles.heroHeadlineBold}>
              You'll Understand It.
            </span>
          </h1>

          {/* Subheading — kept to one line on desktop.
              Short and punchy rather than descriptive —
              the sections below handle the detail. */}
          <p style={{
            ...styles.heroSub,
            fontSize: isMobile ? '14px' : '14px',
            maxWidth: isMobile ? '100%' : '420px',
          }}>
            Small groups. Trusted guides. Experiences that stay with you.
          </p>

          {/* CTA row — primary and secondary buttons.
              Buttons are slightly larger than the rest of
              the site to match the hero's bold energy. */}
          <div style={{
            ...styles.heroCtas,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
          }}>

            <Link
              to="/tours"
              style={{
                ...styles.heroPrimaryBtn,
                backgroundColor: primaryHovered ? '#e8920a' : 'var(--color-amber)',
                transform: primaryHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: primaryHovered ? '0 8px 24px rgba(244,161,48,0.45)' : '0 2px 8px rgba(244,161,48,0.2)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={() => setPrimaryHovered(true)}
              onMouseLeave={() => setPrimaryHovered(false)}
            >
              <span>Explore Tours</span>
              <ArrowRight size={18} color="var(--color-n900)" />
            </Link>

            <Link
              to="/packages"
              style={{
                ...styles.heroSecondaryBtn,
                backgroundColor: secondaryHovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)',
                transform: secondaryHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: secondaryHovered ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
                borderColor: secondaryHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={() => setSecondaryHovered(true)}
              onMouseLeave={() => setSecondaryHovered(false)}
            >
              <span>Plan a Full Trip</span>
            </Link>

          </div>

          {/* Social proof micro-line —
              a single line of hard numbers directly
              below the CTAs. Visitors who hover over
              the buttons before clicking will see this.
              Numbers build confidence at the moment
              of highest decision anxiety. */}
          <div style={styles.heroproof}>
            <Star
              size={14}
              color="var(--color-amber)"
              fill="var(--color-amber)"
            />
            <span style={styles.heroProofText}>
              4.9 · 180 reviews · 5000+ guests guided
            </span>
          </div>

        </div>

        {/* Scroll indicator — animated bouncing arrow
            at the bottom center of the hero.
            Signals to visitors that there is more below —
            particularly important on mobile where the hero
            fills the entire screen and scrolling isn't obvious.
            The bounce animation is defined in index.css. */}
        <div style={styles.scrollIndicator}>
          <ChevronDown
            size={24}
            color="rgba(255,255,255,0.6)"
            style={{ animation: 'bounce 2s infinite' }}
          />
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

        {/* Desktop trust bar — horizontal strip with dividers */}
        {!isMobile && (
          <div style={styles.trustBarInner}>

            <div style={styles.trustItem}>
              <div style={styles.trustIconWrapper}>
                <Star size={15} color="var(--color-amber)" fill="var(--color-amber)" />
              </div>
              <div style={styles.trustContent}>
                <span style={styles.trustLabel}>TripAdvisor</span>
                <span style={styles.trustValue}>4.9 out of 5</span>
              </div>
            </div>

            <div style={styles.trustDivider} />

            <div style={styles.trustItem}>
              <div style={styles.trustIconWrapper}>
                <Users size={15} color="var(--color-forest-green)" />
              </div>
              <div style={styles.trustContent}>
                <span style={styles.trustLabel}>Happy Guests</span>
                <span style={styles.trustValue}>5000+ guided</span>
              </div>
            </div>

            <div style={styles.trustDivider} />

            <div style={styles.trustItem}>
              <div style={styles.trustIconWrapper}>
                <UserCheck size={15} color="var(--color-forest-green)" />
              </div>
              <div style={styles.trustContent}>
                <span style={styles.trustLabel}>Group Size</span>
                <span style={styles.trustValue}>Max 12 people</span>
              </div>
            </div>

            <div style={styles.trustDivider} />

            <div style={styles.trustItem}>
              <div style={styles.trustIconWrapper}>
                <ShieldCheck size={15} color="var(--color-forest-green)" />
              </div>
              <div style={styles.trustContent}>
                <span style={styles.trustLabel}>Cancellation</span>
                <span style={styles.trustValue}>24 hours before</span>
              </div>
            </div>

          </div>
        )}

        {/* Mobile trust bar — 2x2 grid.
            Far more designed than a vertical list —
            two items per row creates visual balance
            and feels intentional rather than default. */}
        {isMobile && (
          <div style={styles.trustBarMobile}>

            <div style={styles.trustItemMobile}>
              <Star size={20} color="var(--color-amber)" fill="var(--color-amber)" />
              <span style={styles.trustValueMobile}>4.9 / 5</span>
              <span style={styles.trustLabelMobile}>TripAdvisor</span>
            </div>

            <div style={styles.trustItemMobile}>
              <Users size={20} color="var(--color-forest-green)" />
              <span style={styles.trustValueMobile}>5000+</span>
              <span style={styles.trustLabelMobile}>Guests Guided</span>
            </div>

            <div style={styles.trustItemMobile}>
              <UserCheck size={20} color="var(--color-forest-green)" />
              <span style={styles.trustValueMobile}>Max 12</span>
              <span style={styles.trustLabelMobile}>Per Group</span>
            </div>

            <div style={styles.trustItemMobile}>
              <ShieldCheck size={20} color="var(--color-forest-green)" />
              <span style={styles.trustValueMobile}>24h before</span>
              <span style={styles.trustLabelMobile}>Cancellation</span>
            </div>

          </div>
        )}

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
            Every tour runs with a maximum of 12 guests. Small enough to feel personal. Guided closely enough to feel private.
          </p>
        </div>

        {/* Card grid — three cards side by side on desktop.
            Each TourCard receives its specific data via props.
            Notice we're not repeating the card design — just the data. */}
<div style={{
  ...styles.cardGrid,
  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
}}>
  {tours.slice(0, 6).map((tour) => (
  <TourCard
  key={tour.id}
  id={tour.id}
  slug={tour.slug}
  title={tour.title}
  price={tour.price}
  rating={tour.rating}
  reviews={tour.reviews}
  duration={tour.duration}
  groupSize={tour.groupSize}
  badge={tour.badge}
  hero={tour.hero}
  startingTimes={tour.startingTimes}
  languages={tour.languages}
/>

  ))}
</div>

        {/* View all tours button */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link
            to="/tours"
            style={styles.viewAllBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-forest-green)'
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--color-forest-green)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            View All Tours
            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </Link>
        </div>


      </section>
       {/* Packages Preview — surfaces multi-day packages
          to visitors who've just browsed individual tours */}
      <HowItWorks />
      <PackagesPreview />
      <Reviews />
      <CTABanner />
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
// Featured Tours section
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

  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '28px',
    maxWidth: '1100px',
    margin: '0 auto',
  },

  viewAllBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '52px',
    padding: '0 32px',
    backgroundColor: 'transparent',
    color: 'var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    border: '2px solid var(--color-forest-green)',
    transition: 'all 0.2s ease',
  },
  // Trust Bar styles
trustBar: {
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n300)',
  },

  trustBarInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '1000px',
    margin: '0 auto',
    height: '72px',
    padding: '0 40px',
  },

  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    justifyContent: 'center',
    padding: '0 16px',
  },

  trustIconWrapper: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-n100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  trustContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },

  trustLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    fontWeight: '500',
    color: 'var(--color-n600)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },

  trustValue: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--color-n900)',
    whiteSpace: 'nowrap',
  },

  trustDivider: {
    width: '1px',
    height: '36px',
    backgroundColor: 'var(--color-n300)',
    flexShrink: 0,
  },

  // Mobile 2x2 grid — icon on top, bold number in middle,
  // label at bottom. Each item is a small card-like block
  // centered within its grid cell.
  trustBarMobile: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    backgroundColor: 'var(--color-n300)',  // Gap color creates grid lines
    margin: '0',
    borderBottom: 'none',
  },

  trustItemMobile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '20px 16px',
    backgroundColor: 'var(--color-n000)',
    textAlign: 'center',
  },

  trustValueMobile: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '20px',
    color: 'var(--color-n900)',
    lineHeight: 1,
  },

  trustLabelMobile: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: '500',
    color: 'var(--color-n600)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  // The outer hero container spans the full width of the page.
  // min-height of 88vh means it takes up 88% of the visible screen height —
  // tall enough to feel immersive, but leaving a hint of content below
  // so visitors know there's more to scroll to.
hero: {
    position: 'relative',
    height: '100vh',
    minHeight: '600px',
    maxHeight: '900px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },

  // Background image fills the entire hero section.
  // position absolute takes it out of document flow
  // so it sits behind all other hero elements.
  heroBg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    zIndex: 0,
  },

  // Primary gradient — left dark, right transparent.
  // The 60% stop means the gradient starts fading at
  // the horizontal midpoint — photo is fully visible
  // on the right third of the screen.
  heroGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(105deg, rgba(10,20,15,0.92) 0%, rgba(10,20,15,0.75) 40%, rgba(10,20,15,0.2) 70%, transparent 100%)',
    zIndex: 1,
  },

  // Secondary gradient — bottom dark, top transparent.
  // Ensures the scroll indicator at the bottom is
  // always readable regardless of photo content.
  heroGradientBottom: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 30%)',
    zIndex: 1,
  },

  // Content sits above both gradient layers via z-index.
  // Positioned at vertical center, left-aligned.
  heroContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '600px',
  },

  locationTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '100px',
    padding: '6px 14px',
    width: 'fit-content',
  },

  locationText: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: '0.5px',
  },

  heroHeadline: {
    fontFamily: "'Fraunces', Georgia, serif",
    color: 'var(--color-n000)',
    lineHeight: '1.1',
    margin: 0,
  },

  // First line — lighter weight creates contrast
  // with the bold line below it.
  heroHeadlineThin: {
    fontWeight: '300',
    fontStyle: 'italic',
    display: 'block',
    opacity: 0.9,
  },

  // Second line — maximum weight, full opacity.
  // This is the line the eye lands on first.
  heroHeadlineBold: {
    fontWeight: '800',
    display: 'block',
    color: 'var(--color-n000)',
  },

  heroSub: {
    fontFamily: 'var(--font-body)',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.6',
    margin: 0,
  },

  heroCtas: {
    display: 'flex',
    gap: '12px',
  },

  heroPrimaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '52px',
    padding: '0 28px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },

  heroSecondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '52px',
    padding: '0 28px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.2)',
    whiteSpace: 'nowrap',
  },

  heroproof: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },

  heroProofText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },

  // Scroll indicator — centered at the bottom of the hero.
  // position absolute keeps it pinned to the bottom
  // without affecting the main content layout.
  scrollIndicator: {
    position: 'absolute',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
}

export default Home