// Home.jsx
// This is your landing page — the first thing every visitor sees.
// It's made up of sections stacked vertically.
// Right now we're building the Hero section first.
// Each section will eventually become its own component,
// but we'll write everything here first so you can see it working
// before we break it apart.
import SEO from '../components/SEO'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Compass, ArrowRight, Star, ChevronDown, Users, UserCheck, ShieldCheck, Heart } from 'lucide-react'
import TourCard from '../components/TourCard'
import Button from '../components/Button'
import HeroSearch from '../components/HeroSearch'
import Img from '../components/Img'
import { variantSrcset, variantUrl } from '../utils/imageVariants'
import tours from '../data/tours'
import { overallStats } from '../data/reviewStats'
import useWindowWidth from '../hooks/useWindowWidth'
import hero2 from '../assets/tour-2-hero.webp'
import hero3 from '../assets/tour-3-hero.webp'
import hero4 from '../assets/tour-5-hero.webp'
import hero5 from '../assets/tour-7-hero.webp'
import { getPage } from '../data/pages'

// Hero photos and the "Traveller favourites" cards are editable in the admin
// (Pages → Homepage). Empty admin fields fall back to the built-in set / the
// first tours in the admin-controlled tours order.
const homePage = getPage('home')
const ADMIN_HERO_IMAGES = (homePage?.extra?.heroImages || []).map((h) => h.image).filter(Boolean)
const HERO_IMAGES = ADMIN_HERO_IMAGES.length > 0 ? ADMIN_HERO_IMAGES : ['/hero-bg.webp', hero2, hero3, hero4, hero5]

// index.html used to hardcode a <link rel="preload"> for a single fixed hero
// image. Once the hero became admin-editable that preload silently stopped
// matching HERO_IMAGES[0] — the browser was preloading a decoy nobody sees
// while the real LCP image downloaded unassisted. Deriving the preload from
// the same HERO_IMAGES[0] the hero itself renders (passed to <SEO> below)
// makes that drift structurally impossible.
const heroPreloadSrc = HERO_IMAGES[0]
const heroPreloadSrcSet = variantSrcset(heroPreloadSrc)
// variantSrcset already returns undefined outside prod builds (variants only
// exist in dist/), so gating on it here — rather than isVariantEligible,
// which doesn't know about that — keeps the preload honest on the dev server.
const heroPreloadHref = heroPreloadSrcSet ? variantUrl(heroPreloadSrc, 960) : heroPreloadSrc

const FAVOURITE_SLUGS = homePage?.extra?.favouriteTours || []
const favouriteTours = FAVOURITE_SLUGS.map((slug) => tours.find((t) => t.slug === slug)).filter(Boolean)
const FEATURED_TOURS = (favouriteTours.length > 0 ? favouriteTours : tours).slice(0, favouriteTours.length > 0 ? 3 : 2)
import GuideSection from '../components/GuideSection'
import HowItWorks from '../components/HowItWorks'
import Reviews from '../components/Reviews'
import CTABanner from '../components/CTABanner'
import PackagesPreview from '../components/PackagesPreview'
import CarouselNav from '../components/CarouselNav'
import { useBlog } from '../hooks/useBlog'
import { TRUST_BAR_CANCEL } from '../data/policy'
import { useCurrency } from '../context/CurrencyContext'


function Home() {
  const { format } = useCurrency()
  const width = useWindowWidth()
  const isMobile = width <= 768
  const { posts } = useBlog()
  const [blogPage, setBlogPage] = useState(0)
  const [tourPage, setTourPage] = useState(0)
  const tourTouchStartX = React.useRef(null)
  const touchStartX = React.useRef(null)
  const [heroIndex, setHeroIndex] = useState(0)
  // Only the first hero photo mounts on initial render — it's the LCP
  // element and is already <link rel="preload">'d in index.html. The other
  // 4 carousel frames (roughly 1.5MB combined) used to mount eagerly too,
  // which made them compete with the LCP image for bandwidth on a throttled
  // connection. They're brought in only once the first photo has actually
  // finished loading (not just "the main thread is idle" — on a slow
  // connection those aren't the same moment), well before the 6s interval
  // below ever needs them. A capped timeout is a fallback in case onLoad
  // never fires (e.g. the image errors).
  const [mountedHeroCount, setMountedHeroCount] = useState(1)
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 6000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!heroLoaded || mountedHeroCount >= HERO_IMAGES.length) return
    const revealRest = () => setMountedHeroCount(HERO_IMAGES.length)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(revealRest, { timeout: 2000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(revealRest, 300)
    return () => clearTimeout(id)
  }, [heroLoaded, mountedHeroCount])

  useEffect(() => {
    const fallback = setTimeout(() => setHeroLoaded(true), 8000)
    return () => clearTimeout(fallback)
  }, [])

  return (

    
    
    // The outer div is your page wrapper.
    // As we add more sections below the hero, they'll stack here.
    <div>
<SEO
  title={homePage?.seo?.title || 'Guided Tours in Sarajevo'}
  description={homePage?.seo?.description || 'Small group tours in Sarajevo and Bosnia led by a local guide. War history, food tours, day trips to Mostar and more. Genuinely small groups. Book online.'}
  url="/"
  image="https://tallesttourguide.com/og-image.jpg"
  preloadImage={{ href: heroPreloadHref, srcSet: heroPreloadSrcSet, sizes: '100vw' }}
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
          height: isMobile ? '85vh' : '100vh',
          minHeight: isMobile ? '540px' : '600px',
          justifyContent: isMobile ? 'center' : 'flex-start',
          paddingTop: isMobile ? '15vh' : '12vh',
          alignItems: isMobile ? 'center' : 'center',
          boxSizing: 'border-box',
        }}>

        {/* Background photo layer —
            sits behind everything else via z-index.
            objectFit cover fills the entire section
            regardless of the photo's original dimensions. */}
        {HERO_IMAGES.slice(0, mountedHeroCount).map((img, i) => (
          <Img
            key={i}
            src={img}
            alt=""
            eager={i === 0}
            onLoad={i === 0 ? () => setHeroLoaded(true) : undefined}
            style={{
              ...styles.heroBg,
              opacity: i === heroIndex ? 1 : 0,
              transition: 'opacity 1.2s ease',
              objectPosition: isMobile ? 'center 30%' : 'center',
            }}
          />
        ))}

        <div style={isMobile ? styles.heroGradientMobile : styles.heroGradient} />
        <div style={styles.heroGradientBottom} />

        {/* Main content */}
        <div style={{
          ...styles.heroContent,
          padding: isMobile ? '0 28px' : '0 72px',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
          gap: isMobile ? '20px' : '24px',
          width: isMobile ? '100%' : undefined,
          // Wide enough for the headline to sit on a single line on desktop.
          maxWidth: isMobile ? '480px' : '1200px',
        }}>

          {/* Positioning tag — small pill above the headline. Plain-language
              category recognition ("what is this site?"); no trade jargon
              like "DMC" — that vocabulary lives on the Partners page. */}
          <div style={styles.locationTag}>
            <Compass size={12} color="var(--color-amber)" />
            <span style={styles.locationText}>
              {isMobile ? 'Tours & tailor-made journeys' : 'Small-group tours & tailor-made journeys'}
            </span>
          </div>

          {/* Typographic contrast headline —
              first line lighter weight, second line heavy bold.
              The weight contrast creates visual energy and
              makes the headline feel designed rather than typed.
              This is the technique that gives the hero its
              bold, energetic character without needing
              to make everything big and loud simultaneously. */}
          {/* One sentence per line — the quiet italic setup and the bold
              payoff each own a line, so the weight contrast reads as designed
              rather than wherever the container happens to wrap. */}
          <h1 style={{
            ...styles.heroHeadline,
            fontSize: isMobile ? '30px' : '42px',
          }}>
            <span style={{ ...styles.heroHeadlineThin, display: 'block' }}>
              You Won't Just See the Balkans.
            </span>
            <span style={{ ...styles.heroHeadlineBold, display: 'block' }}>
              You'll Understand Them.
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            ...styles.heroSub,
            fontSize: isMobile ? '13px' : '14px',
            maxWidth: isMobile ? '320px' : '560px',
          }}>
            Small groups. Trusted guides. Rooted in <strong style={{ color: '#fff', fontWeight: 700 }}>Bosnia</strong>, at home across the Balkans.
          </p>

          {/* Search-first CTA — the hero doubles as the booking entry point.
              A prominent search bar with live results replaces the old
              button pair; the quick-link chips underneath cover the same
              destinations ("Explore tours") and the multi-day journeys
              ("Plan a full trip") in one tap. Extra top margin gives the
              headline room to breathe before the search bar. */}
          <div style={{ marginTop: isMobile ? '8px' : '14px', width: '100%', display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <HeroSearch isMobile={isMobile} />
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
              {overallStats.rating.toFixed(1)} · {overallStats.count.toLocaleString('en-GB')} reviews · 5000+ guests guided
            </span>
          </div>

        </div>

        {/* Featured tours — desktop only. Two compact glassy cards on the
            hero's right side promote the top of the tours list (the order
            set by drag-reorder in the admin), so the hero sells concrete,
            bookable trips — not just a mood. Mobile skips this: the tours
            rail sits right below the fold there. */}
        {!isMobile && (
          <div style={styles.heroFeatured}>
            <span style={{ ...styles.heroFeaturedLabel, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Heart size={12} color="var(--color-amber)" fill="var(--color-amber)" />
              Traveller favourites
            </span>
            {FEATURED_TOURS.map((t) => (
              <Link key={t.slug} to={`/tours/${t.slug}`} style={styles.heroFeaturedCard} className="hero-featured-card">
                <img src={t.hero} alt="" style={styles.heroFeaturedThumb} />
                <div style={{ minWidth: 0 }}>
                  <span style={styles.heroFeaturedTitle}>{t.title.split(/[:|]/)[0].trim()}</span>
                  <span style={styles.heroFeaturedMeta}>
                    <Star size={11} color="var(--color-amber)" fill="var(--color-amber)" style={{ flexShrink: 0 }} />
                    {t.rating} · {t.duration} · from {format(t.price)}
                  </span>
                </div>
                <ArrowRight size={15} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0, marginLeft: 'auto' }} />
              </Link>
            ))}
          </div>
        )}

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
                <span style={styles.trustValue}>Genuinely small</span>
              </div>
            </div>

            <div style={styles.trustDivider} />

            <div style={styles.trustItem}>
              <div style={styles.trustIconWrapper}>
                <ShieldCheck size={15} color="var(--color-forest-green)" />
              </div>
              <div style={styles.trustContent}>
                <span style={styles.trustLabel}>Cancellation</span>
                <span style={styles.trustValue}>{TRUST_BAR_CANCEL.desktop}</span>
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
              <Star size={15} color="var(--color-amber)" fill="var(--color-amber)" />
              <span style={styles.trustValueMobile}>4.9 / 5</span>
              <span style={styles.trustLabelMobile}>TripAdvisor</span>
            </div>

            <div style={styles.trustItemMobile}>
              <Users size={15} color="var(--color-forest-green)" />
              <span style={styles.trustValueMobile}>5000+</span>
              <span style={styles.trustLabelMobile}>Guests Guided</span>
            </div>

            <div style={styles.trustItemMobile}>
              <UserCheck size={15} color="var(--color-forest-green)" />
              <span style={styles.trustValueMobile}>Small groups</span>
              <span style={styles.trustLabelMobile}>Every Tour</span>
            </div>

            <div style={styles.trustItemMobile}>
              <ShieldCheck size={15} color="var(--color-forest-green)" />
              <span style={styles.trustValueMobile}>{TRUST_BAR_CANCEL.mobile}</span>
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
            Every tour runs as a genuinely small group. Small enough to feel personal. Guided closely enough to feel private.
          </p>
        </div>

        {/* Tour carousel */}
        {(() => {
          const tourList = tours
          const visibleCount = isMobile ? 1 : 6
          const totalPages = Math.ceil(tourList.length / visibleCount)
          return (
            <>
              <div style={styles.carouselOuter}>
                <div
                  style={{ ...styles.carouselWrapper, ...(isMobile ? null : styles.carouselBreathe) }}
                  onTouchStart={(e) => { tourTouchStartX.current = e.touches[0].clientX }}
                  onTouchEnd={(e) => {
                    if (tourTouchStartX.current === null) return
                    const delta = tourTouchStartX.current - e.changedTouches[0].clientX
                    if (Math.abs(delta) > 40) {
                      if (delta > 0) setTourPage((p) => Math.min(totalPages - 1, p + 1))
                      else setTourPage((p) => Math.max(0, p - 1))
                    }
                    tourTouchStartX.current = null
                  }}
                >
                  <div style={{
                    ...styles.carouselTrack,
                    transform: `translateX(calc(${tourPage} * (-100% - 24px)))`,
                  }}>
                    {Array.from({ length: totalPages }).map((_, pageIdx) => (
                      <div key={pageIdx} style={{
                        ...styles.carouselPage,
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                      }}>
                        {tourList.slice(pageIdx * visibleCount, (pageIdx + 1) * visibleCount).map((tour) => (
                          <TourCard
                            key={tour.id}
                            id={tour.id}
                            slug={tour.slug}
                            title={tour.title}
                            price={tour.price}
                            oldPrice={tour.oldPrice}
                            rating={tour.rating}
                            reviews={tour.reviews}
                            duration={tour.duration}
                            groupSize={tour.groupSize}
                            highlights={tour.highlights}
                            badge={tour.badge}
                            hero={tour.hero}
                            startingTimes={tour.startingTimes}
                            languages={tour.languages}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <CarouselNav
                page={tourPage}
                total={totalPages}
                onChange={setTourPage}
                label="tours"
              />
            </>
          )
        })()}

        {/* View all tours */}
        <div style={styles.bottomRow}>
          <p style={styles.bottomText}>Looking for something else? Browse every tour we run.</p>
          <Button to="/tours" variant="secondary" arrow>View All Tours</Button>
        </div>


      </section>
      <Divider />
      <PackagesPreview />
      <Divider />
      <Reviews />
      <Divider />

      {/* ═══════════════════════════════
          BLOG PREVIEW — latest 3 posts
          Only renders when the Journal
          has published posts to show.
          ═══════════════════════════════ */}
      {posts.length > 0 && (() => {
        const blogPosts = posts.slice(0, 6)
        const visibleCount = isMobile ? 1 : 3
        const totalPages = Math.ceil(blogPosts.length / visibleCount)
        return (
          <>
            <section style={blogStyles.section}>
              <div style={blogStyles.header}>
                <div>
                  <span style={blogStyles.eyebrow}>From the Guide</span>
                  <h2 style={blogStyles.title}>The Journal</h2>
                </div>
                <Link to="/journal" style={blogStyles.viewAll}>
                  View all posts →
                </Link>
              </div>

              {/* Carousel track */}
              <div style={blogStyles.carouselOuter}>
              <div
                style={{ ...blogStyles.carouselWrapper, ...(isMobile ? null : blogStyles.carouselBreathe) }}
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
                onTouchEnd={(e) => {
                  if (touchStartX.current === null) return
                  const delta = touchStartX.current - e.changedTouches[0].clientX
                  if (Math.abs(delta) > 40) {
                    if (delta > 0) setBlogPage((p) => Math.min(totalPages - 1, p + 1))
                    else setBlogPage((p) => Math.max(0, p - 1))
                  }
                  touchStartX.current = null
                }}
              >
                <div style={{
                  ...blogStyles.carouselTrack,
                  transform: `translateX(calc(${blogPage} * (-100% - 24px)))`,
                }}>
                  {Array.from({ length: totalPages }).map((_, pageIdx) => (
                    <div key={pageIdx} style={{
                      ...blogStyles.carouselPage,
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    }}>
                      {blogPosts.slice(pageIdx * visibleCount, (pageIdx + 1) * visibleCount).map((post) => (
                        <Link key={post.id} to={`/journal/${post.slug}`} style={blogStyles.card} className="card-lift">
                          <div style={blogStyles.cardImageWrapper}>
                            {post.heroImage
                              ? <img src={post.heroImage} alt={post.title} loading="lazy" style={blogStyles.cardImage} />
                              : <div style={blogStyles.cardImagePlaceholder} />
                            }
                            {post.category && (
                              <span style={blogStyles.categoryPill}>{post.category}</span>
                            )}
                          </div>
                          <div style={blogStyles.cardBody}>
                            {post.publishedDate && (
                              <span style={blogStyles.cardDate}>
                                {new Date(post.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </span>
                            )}
                            <h3 style={blogStyles.cardTitle}>{post.title}</h3>
                            {post.excerpt && <p style={blogStyles.cardExcerpt}>{post.excerpt}</p>}
                            <span style={blogStyles.readMore}>Read more →</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              </div>

              <CarouselNav
                page={blogPage}
                total={totalPages}
                onChange={setBlogPage}
                label="journal posts"
              />
            </section>
            <Divider />
          </>
        )
      })()}

      <HowItWorks />
      <Divider />
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
    // --text-h2, like the Journeys and Journal section titles below it. This
    // was --text-h1 (a page-title size on a section heading), which made the
    // three peer sections disagree — and disagree by different amounts at
    // different widths: 40 vs 32 on a desktop reads as a deliberate step,
    // 28.5 vs 26.2 on a phone just reads as sloppy.
    fontSize: 'var(--text-h2)',
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

  carouselOuter: {
    position: 'relative',
  },

  // Matches the Journeys carousel's width (PackagesPreview) — standardized
  // so the two sections don't visibly differ in card size.
  carouselWrapper: {
    maxWidth: '1160px',
    margin: '0 auto',
    overflow: 'hidden',
  },

  // Desktop: the wrapper clips (overflow hidden) flush against the cards,
  // amputating the hover lift's shadow. Pad the clip box (12px sides, more
  // vertically) and cancel it with negative margins + wider max-width so the
  // cards sit exactly where they were. The 24px gap between carousel pages
  // (carouselPage marginRight + the calc() stride on the track) keeps the
  // next page fully outside the padded clip window — no peeking.
  carouselBreathe: {
    maxWidth: '1184px',
    padding: '24px 12px 32px',
    margin: '-24px auto -32px',
  },

  carouselTrack: {
    display: 'flex',
    // Cross-axis default (stretch) is kept intentionally: every page div
    // fills the height of the tallest page so switching pages doesn't jump
    // the carousel's height. alignContent below handles a partial page's
    // own content inside that shared height.
    transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  carouselPage: {
    display: 'grid',
    gap: '28px',
    minWidth: '100%',
    alignItems: 'stretch',
    // center, not the stretch default — a partial last row (e.g. 1 card of
    // a 3-column grid) would otherwise stretch tall to fill the page div's
    // full height (which itself is held to the tallest page — see
    // carouselTrack). Centering lets it float in that space instead.
    alignContent: 'center',
    // Spacer between pages — paired with the track's calc() stride, it keeps
    // the next page fully outside the padded clip window (carouselBreathe).
    marginRight: '24px',
  },

  // Standardized with the "View All Journeys" row on PackagesPreview —
  // same pitch-line + shared <Button> pattern on both sections.
  bottomRow: {
    textAlign: 'center',
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },

  bottomText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    margin: 0,
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
    fontSize: '12px',
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
    gap: '3px',
    padding: '12px 10px',
    backgroundColor: 'var(--color-n000)',
    textAlign: 'center',
  },

  trustValueMobile: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '15px',
    color: 'var(--color-n900)',
    lineHeight: 1,
  },

  trustLabelMobile: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
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
    // Pull the hero up underneath the nav's own row (Navbar.jsx's .bar is a
    // fixed 68px) rather than starting after it. The nav itself doesn't
    // move — it's still `position: sticky` and reserves that space — this
    // just lets the hero photo occupy it too, so the nav's transparent
    // state (see Navbar.jsx's `transparent`) has something to be
    // transparent over instead of showing a gap of plain page background.
    marginTop: '-68px',
  },

  // Right-side featured tour cards (desktop only) — glassy, over the photo.
  heroFeatured: {
    position: 'absolute',
    right: '72px',
    bottom: '96px',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '340px',
  },

  heroFeaturedLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.6px',
    color: 'var(--color-amber)',
    marginBottom: '2px',
    textShadow: '0 1px 3px rgba(0,0,0,0.6), 0 1px 10px rgba(0,0,0,0.4)',
  },

  // Dark enough (0.6) that the white title stays readable over the lightest
  // of the rotating hero photos — this corner is where the left-dark gradient
  // has fully faded out, so the card supplies its own contrast.
  heroFeaturedCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    borderRadius: '14px',
    textDecoration: 'none',
    backgroundColor: 'rgba(12, 22, 17, 0.6)',
    border: '1px solid rgba(255,255,255,0.16)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
  },

  heroFeaturedThumb: {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '10px',
    flexShrink: 0,
    display: 'block',
  },

  heroFeaturedTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.3,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    textShadow: '0 1px 3px rgba(0,0,0,0.45)',
  },

  heroFeaturedMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.78)',
    marginTop: '4px',
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

  heroGradientMobile: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.65) 100%)',
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
    borderRadius: 'var(--radius-pill)',
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
    fontFamily: 'var(--font-hero)',
    color: 'var(--color-n000)',
    lineHeight: '1.1',
    margin: 0,
  },

  // First line — lighter weight creates contrast
  // with the bold line below it.
  heroHeadlineThin: {
    fontWeight: '300',
    fontStyle: 'italic',
    opacity: 0.9,
  },

  // Second line — maximum weight, full opacity.
  // This is the line the eye lands on first.
  heroHeadlineBold: {
    fontWeight: '800',
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

function Divider() {
  return (
    <div style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent 0%, var(--color-amber) 50%, transparent 100%)',
      opacity: 0.55,
    }} />
  )
}

const blogStyles = {
  section: {
    backgroundColor: 'var(--color-n100)',
    padding: '80px 40px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    maxWidth: '1100px',
    margin: '0 auto 40px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n900)',
    margin: 0,
  },
  viewAll: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  carouselOuter: {
    position: 'relative',
  },

  carouselWrapper: {
    maxWidth: '1100px',
    margin: '0 auto',
    overflow: 'hidden',
  },

  // Desktop: the wrapper clips (overflow hidden) flush against the cards,
  // amputating the hover lift's shadow. Pad the clip box (12px sides, more
  // vertically) and cancel it with negative margins + wider max-width so the
  // cards sit exactly where they were. The 24px gap between carousel pages
  // (carouselPage marginRight + the calc() stride on the track) keeps the
  // next page fully outside the padded clip window — no peeking.
  carouselBreathe: {
    maxWidth: '1124px',
    padding: '24px 12px 32px',
    margin: '-24px auto -32px',
  },

  carouselTrack: {
    display: 'flex',
    transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  carouselPage: {
    display: 'grid',
    gap: '24px',
    minWidth: '100%',
    alignItems: 'stretch',
    // Same page-spacer as the tour carousel — see carouselBreathe.
    marginRight: '24px',
  },

  card: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    border: '1px solid var(--color-n300)',
    overflow: 'hidden',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },
  cardImageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    flexShrink: 0,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-mint-wash, #F0F7F4)',
  },
  categoryPill: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    padding: '4px 10px',
    borderRadius: 'var(--radius-pill)',
  },
  cardBody: {
    padding: '20px 20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  cardDate: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '18px',
    color: 'var(--color-n900)',
    lineHeight: '1.3',
    margin: 0,
  },
  cardExcerpt: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    lineHeight: '1.6',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  readMore: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    marginTop: 'auto',
    paddingTop: '4px',
  },
}

export default Home