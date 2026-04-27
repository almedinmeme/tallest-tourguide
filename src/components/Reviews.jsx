// Reviews.jsx
// A cinematic full-viewport review section.
// Each review occupies the full screen height with a rich
// dark background — Forest Green or near-black alternating —
// creating a documentary-style reading experience.
//
// Animation: reviews transition with a fade + upward slide.
// The quote appears first, then the attribution fades in
// with a slight delay — like a signature being revealed.
//
// The effect is achieved with CSS keyframe animations injected
// via a <style> tag inside the component. This keeps all the
// animation logic self-contained in one file without needing
// an external CSS file or animation library.

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'

const reviews = [
  {
    id: 1,
    name: 'Michael P.',
    location: 'Cyprus',
    rating: 5,
    tour: 'Sarajevo Siege Tour',
    quote: 'Meme has enough knowledge to write a library, delivered with stunning detail. He has a great sense of humour, a sunny disposition, and is generally a lovely guy. He even got us some mandarines from the market — from Cyprus with love.',
    background: 'var(--color-forest-green)',
  },
  {
    id: 2,
    name: 'Marc J.',
    location: 'England',
    rating: 5,
    tour: 'Sarajevo Walking Tour',
    quote: 'Almedin takes you off the main touristy routes and shows you streets and workshops that could be in Marrakech or Istanbul. His astonishing level of knowledge never failed to answer my questions. I have done walking tours from Berlin to Lisbon and Marrakech. This was, easily, the best.',
    background: '#1A2E26',
  },
  {
    id: 3,
    name: 'Georgie K.',
    location: 'Adelaide, Australia',
    rating: 5,
    tour: 'Private Tour of Sarajevo',
    quote: 'There are some travel experiences that you treasure for life — that\'s what we had with Tallest Tourguide. Meme spent his Saturday evening helping plan my husband\'s 30th birthday, including a birthday cake in Bosnia\'s highest village. He came in on his day off to give us the best tour of our lives.',
    background: 'var(--color-n900)',
  },
]

// CSS keyframe animations as a string injected into a <style> tag.
// This approach keeps all animation code inside the component file
// rather than requiring a separate CSS file — self-contained and portable.
// fadeSlideIn: the incoming review fades in while sliding up from 30px below.
// fadeIn: a simple opacity fade used for the attribution line — 
// delayed slightly so the quote settles before the name appears.
const animationStyles = `
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
      @keyframes progressFill {
    from { width: 0%; }
    to { width: 100%; }
  }
`

function Reviews() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  // activeReview tracks which review is currently displayed.
  const [activeReview, setActiveReview] = useState(0)

  // animationKey is used to retrigger CSS animations when the
  // review changes. By incrementing this key every time we
  // change the active review, React remounts the animated
  // elements — which restarts their CSS animations from the beginning.
  // Without this trick, animations only play once on first render.
  const [animationKey, setAnimationKey] = useState(0)

  // Auto-advance the carousel every 6 seconds.
  // useEffect with a cleanup function prevents memory leaks —
  // the interval is cleared when the component unmounts or
  // when the user manually navigates (which resets the timer).
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length)
      setAnimationKey((prev) => prev + 1)
    }, 10000)

    // Cleanup — clears the interval when component unmounts
    // or when the effect reruns due to dependency changes.
    return () => clearInterval(timer)
  }, [activeReview])

  const handlePrev = () => {
    setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length)
    setAnimationKey((prev) => prev + 1)
  }

  const handleNext = () => {
    setActiveReview((prev) => (prev + 1) % reviews.length)
    setAnimationKey((prev) => prev + 1)
  }

  const review = reviews[activeReview]

  return (
    <>
      {/* Inject animation keyframes into the document head.
          This is a clean, library-free way to use CSS animations
          inside a React component without a separate stylesheet. */}
      <style>{animationStyles}</style>

      <section style={{
        ...styles.section,
        backgroundColor: review.background,
        // Background color transitions smoothly between reviews —
        // a 0.8s ease gives it a slow, cinematic feel rather than
        // a jarring instant switch.
        transition: 'background-color 0.8s ease',
      }}>

        {/* ── TOP BAR ─────────────────────────────────────
            TripAdvisor rating and link — sits at the top of
            the section so visitors see the overall rating
            before they read the individual reviews. */}
        <div style={styles.topBar}>
          <div style={styles.tripAdvisorRow}>
            <div style={styles.starsRow}>
              {[1,2,3,4,5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  color="var(--color-amber)"
                  fill="var(--color-amber)"
                />
              ))}
            </div>
            <span style={styles.ratingText}>
              4.9 · 180 reviews on TripAdvisor
            </span>
          </div>
        </div>

        {/* ── MAIN REVIEW CONTENT ─────────────────────────
            Centered vertically and horizontally in the section.
            The animationKey prop forces React to remount this
            div on every review change — restarting the CSS
            animation cleanly each time. */}
        <div style={styles.content}>

          {/* Opening quotation mark — decorative, large, semi-transparent.
              It frames the quote visually without competing with
              the text itself. Classic editorial typography treatment. */}
          <div style={styles.quoteMarkWrapper}>
            <span style={styles.quoteMark}>"</span>
          </div>

          {/* The review quote — the main animated element.
              key={animationKey} forces remount on review change.
              The CSS animation fadeSlideIn runs on every remount. */}
          <div
            key={`quote-${animationKey}`}
            style={styles.quoteWrapper}
          >
            <blockquote style={{
              ...styles.quote,
              fontSize: isMobile ? '20px' : review.quote.length > 200
                ? 'var(--text-h3)'
                : 'var(--text-h2)',
              // Shorter quotes get a larger font size —
              // longer quotes scale down to maintain readability.
              // This keeps every review feeling balanced on screen
              // regardless of word count.
            }}>
              {review.quote}
            </blockquote>
          </div>

          {/* Attribution — reviewer name, location, tour, stars.
              Delayed animation so the quote settles first. */}
          <div
            key={`attribution-${animationKey}`}
            style={styles.attribution}
          >
            {/* Star rating for this specific review */}
            <div style={styles.reviewStars}>
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  color="var(--color-amber)"
                  fill="var(--color-amber)"
                />
              ))}
            </div>

            {/* Reviewer name and location */}
            <p style={styles.reviewerName}>
              {review.name}
              <span style={styles.reviewerLocation}>
                {' '}· {review.location}
              </span>
            </p>

            {/* Which tour they took */}
            <p style={styles.tourTaken}>
              {review.tour}
            </p>

          </div>

        </div>

        {/* ── BOTTOM BAR ──────────────────────────────────
            Navigation controls on the left, TripAdvisor CTA
            on the right. Sits at the bottom of the section. */}
        <div style={{
          ...styles.bottomBar,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '20px' : '0',
          alignItems: isMobile ? 'center' : 'center',
        }}>

          {/* Navigation — prev/next arrows + dot indicators */}
          <div style={styles.navigation}>

            <button
              style={styles.navBtn}
              onClick={handlePrev}
              aria-label="Previous review"
              className="btn-overlay"
            >
              <ChevronLeft size={20} color="rgba(255,255,255,0.8)" />
            </button>

            {/* Dot indicators — one per review.
                Active dot is full white, inactive are semi-transparent.
                Width animates on the active dot — it becomes a short
                pill shape instead of a circle, a modern indicator pattern
                used by Apple and Google in their carousels. */}
            <div style={styles.dots}>
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveReview(index)
                    setAnimationKey((prev) => prev + 1)
                  }}
                  style={{
                    ...styles.dot,
                    width: activeReview === index ? '24px' : '8px',
                    backgroundColor: activeReview === index
                      ? 'var(--color-n000)'
                      : 'rgba(255,255,255,0.35)',
                  }}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>

            <button
              style={styles.navBtn}
              onClick={handleNext}
              aria-label="Next review"
              className="btn-overlay"
            >
              <ChevronRight size={20} color="rgba(255,255,255,0.8)" />
            </button>

          </div>

          {/* TripAdvisor CTA — links to your TripAdvisor page.
              Outlined white button keeps it visible on any of
              the three dark backgrounds without using Amber —
              saving Amber exclusively for primary booking CTAs
              maintains the colour's conversion signal value. */}
          
            <a href="https://www.tripadvisor.com/Attraction_Review-g294450-d14011605-Reviews-Tallest_Tourguide_Tours_and_Excursions-Sarajevo_Sarajevo_Canton_Federation_of_Bo.html"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.tripAdvisorBtn}
            className="btn-outline-light"
          >
            <span>Read all 180 reviews</span>
            <ExternalLink size={14} color="var(--color-n000)" />
          </a>

        </div>

        {/* Auto-advance progress bar — a thin line at the very
            bottom of the section that fills from left to right
            over 6 seconds, visually signalling when the next
            review will appear automatically.
            Resets on every review change via the animationKey. */}
        <div style={styles.progressBarTrack}>
          <div
            key={`progress-${animationKey}`}
            style={styles.progressBar}
          />
        </div>

      </section>
    </>
  )
}

// Progress bar animation — fills from 0% to 100% over 6 seconds.
// Defined here so the duration matches the useEffect interval exactly.
const progressAnimation = `
  @keyframes progressFill {
    from { width: 0%; }
    to { width: 100%; }
  }
`

const styles = {
  section: {
    minHeight: '520px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '40px 40px 32px',
    position: 'relative',
    overflow: 'hidden',
  },

  topBar: {
    display: 'flex',
    justifyContent: 'center',
  },

  tripAdvisorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  starsRow: {
    display: 'flex',
    gap: '2px',
  },

  ratingText: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.7)',
  },

  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '860px',
    margin: '0 auto',
    padding: '24px 0',
    gap: '24px',
  },

  quoteMarkWrapper: {
    lineHeight: 1,
    marginBottom: '-16px',
  },

  // Large decorative opening quotation mark.
  // 120px and semi-transparent — present but not dominant.
  quoteMark: {
    fontFamily: 'var(--font-display)',
    fontSize: '120px',
    color: 'rgba(255,255,255,0.15)',
    lineHeight: 1,
    display: 'block',
  },

  quoteWrapper: {
    animation: 'fadeSlideIn 0.7s ease forwards',
  },

  quote: {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    color: 'var(--color-n000)',
    lineHeight: '1.5',
    fontStyle: 'italic',
    margin: 0,
  },

  attribution: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    animation: 'fadeIn 0.6s ease 0.4s forwards',
    // opacity: 0 as starting state — the animation brings it to 1.
    // The 0.4s delay means the quote finishes animating first.
    opacity: 0,
  },

  reviewStars: {
    display: 'flex',
    gap: '2px',
    marginBottom: '4px',
  },

  reviewerName: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n000)',
    margin: 0,
  },

  reviewerLocation: {
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
  },

  tourTaken: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    margin: 0,
  },

  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  navigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  navBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },

  dots: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  dot: {
    height: '8px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'width 0.3s ease, background-color 0.3s ease',
  },

  tripAdvisorBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: 'var(--touch-target)',
    padding: '0 20px',
    border: '1.5px solid rgba(255,255,255,0.4)',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n000)',
    textDecoration: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
  },

  progressBarTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  progressBar: {
    height: '100%',
    backgroundColor: 'var(--color-amber)',
    animation: 'progressFill 10s linear forwards',
  },
}

export default Reviews