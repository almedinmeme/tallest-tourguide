// Reviews.jsx
// Homepage social proof, designed as the one dark break in a page of light
// sections — you scroll into it and stop. The rhythm is: the score, huge and
// unarguable, then six voices set as an open editorial grid (hairlines and
// gutters, no boxes), then the way out to the platforms themselves.
//
// Six is the cap, on every breakpoint. Past six, testimonial walls stop being
// read and start being wallpaper; anyone who wants more goes to Google or
// Tripadvisor, where the full history lives and we can't touch it.
//
// The cards mix Google (synced at build time by scripts/sync-google-reviews.mjs)
// and hand-picked Tripadvisor highlights; every entry is attributed to its
// platform and the Google ones keep the author photo, name and relative time
// Google's terms require, linking back to the review itself.
//
// Data comes from src/data/reviewFeed.js. Before the Google Place ID is set,
// the Google side is simply absent and the Tripadvisor highlights stand alone.

import { useRef, useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import Button from './Button'
import ReviewSourceMark from './ReviewSourceMark'
import useInView from '../hooks/useInView'
import {
  reviewCards,
  platforms,
  overallStats,
  googleStats,
  tripadvisorStats,
  SOURCE_LABEL,
} from '../data/reviewFeed'

// Hard cap — see the note above. Not a "show first N" with an expander.
const MAX_CARDS = 6
// Longer reviews clamp to six lines so the grid rows stay level; the rest is
// one click away rather than a scroll wall.
const CLAMP_AT = 260

const css = `
  .rv {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: 64px 20px 60px;
    color: #fff;
    background:
      radial-gradient(70% 55% at 8% -10%, rgba(244,161,48,0.16) 0%, rgba(244,161,48,0) 68%),
      radial-gradient(120% 95% at 18% 0%, #1F5540 0%, #143222 52%, #0F281B 100%);
  }
  /* A fine film grain over the flat green — at 4% it reads as paper stock
     rather than as an effect, and it kills the banding in the gradient. */
  .rv::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: 0.045;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>");
  }
  .rv__inner { position: relative; max-width: 1180px; margin: 0 auto; }

  /* ── Headline lockup ──────────────────────────────────────────── */
  .rv__head { display: flex; flex-direction: column; gap: 32px; margin-bottom: 44px; }
  .rv__lockup { position: relative; min-width: 0; }
  /* The oversized quote glyph is the section's one flourish: set in the
     literary serif, amber at 9%, sitting behind the score. */
  .rv__glyph {
    position: absolute;
    top: 6px;
    left: -30px;
    font-family: var(--font-hero);
    font-size: 200px;
    line-height: 1;
    color: rgba(244,161,48,0.13);
    pointer-events: none;
    user-select: none;
  }
  .rv__eyebrow {
    display: block;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-amber);
    margin-bottom: 14px;
  }
  .rv__h2 {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0 16px;
    margin: 0;
    font-weight: 400;
  }
  .rv__figure {
    font-family: var(--font-hero);
    font-weight: 300;
    font-size: clamp(68px, 11vw, 108px);
    line-height: 0.82;
    letter-spacing: -0.03em;
    color: #fff;
    background: linear-gradient(170deg, #ffffff 25%, rgba(255,255,255,0.58) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .rv__h2text {
    font-family: var(--font-hero);
    font-weight: 300;
    font-style: italic;
    font-size: clamp(19px, 2.4vw, 27px);
    line-height: 1.35;
    color: rgba(255,255,255,0.9);
    max-width: 22ch;
  }
  .rv__h2plain {
    font-family: var(--font-hero);
    font-weight: 300;
    font-size: clamp(30px, 5vw, 46px);
    line-height: 1.15;
    color: #fff;
    margin: 0;
  }
  .rv__attest {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 20px;
    font-family: var(--font-body);
    font-size: var(--text-small);
    color: rgba(255,255,255,0.62);
  }

  /* ── Platform proof: hairline rows, not tiles ─────────────────── */
  .rv__plats { display: flex; flex-direction: column; align-self: flex-start; min-width: 0; width: 100%; }
  .rv__plat {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 4px;
    border-top: 1px solid rgba(255,255,255,0.16);
    text-decoration: none;
    color: #fff;
    transition: background-color var(--t-fast), padding-left var(--t-fast);
  }
  .rv__plats > .rv__plat:last-child { border-bottom: 1px solid rgba(255,255,255,0.16); }
  a.rv__plat:hover { background-color: rgba(255,255,255,0.05); padding-left: 10px; }
  .rv__platName {
    font-family: var(--font-body);
    font-size: var(--text-small);
    font-weight: 600;
    letter-spacing: 0.2px;
  }
  .rv__platScore {
    margin-left: auto;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    color: rgba(255,255,255,0.58);
    white-space: nowrap;
  }
  .rv__platScore b { font-size: var(--text-small); font-weight: 700; color: var(--color-amber); }
  .rv__arrow { font-size: 13px; color: rgba(255,255,255,0.45); transition: transform var(--t-fast), color var(--t-fast); }
  a.rv__plat:hover .rv__arrow { transform: translate(2px, -2px); color: var(--color-amber); }

  /* ── The six ──────────────────────────────────────────────────── */
  /* Mobile first: one snap-scrolling row that bleeds to both edges. */
  .rv__grid {
    display: flex;
    gap: 0;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 20px;
    margin: 0 -20px;
    padding: 0 20px;
    scrollbar-width: none;
  }
  .rv__grid::-webkit-scrollbar { display: none; }
  .rv__entry {
    position: relative;
    flex: 0 0 86%;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
    padding: 26px 22px 28px;
    border-top: 1px solid rgba(255,255,255,0.16);
  }
  .rv__entry + .rv__entry { border-left: 1px solid rgba(255,255,255,0.13); }
  /* Mandatory snapping would otherwise strand the last card half off-screen:
     its start-aligned snap point sits past the end of the scroll range. */
  .rv__grid > .rv__entry:last-child { scroll-snap-align: end; }
  /* A short amber tick riding the hairline marks where each voice starts,
     and grows on hover — the only decoration an entry gets. */
  .rv__entry::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 22px;
    width: 26px;
    height: 1px;
    background: var(--color-amber);
    transition: width var(--t-base);
  }
  .rv__entry:hover::before { width: 52px; }

  .rv__meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .rv__src {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    font-weight: 600;
    color: rgba(255,255,255,0.58);
    text-decoration: none;
    transition: color var(--t-fast);
  }
  a.rv__src:hover { color: #fff; }
  a.rv__src:hover .rv__arrow { color: var(--color-amber); transform: translate(2px, -2px); }

  /* Serif quotes. Reviews are the one place on the page where someone else is
     talking, and the change of voice should be audible in the type. */
  .rv__quote {
    flex: 1;
    margin: 0;
    font-family: var(--font-hero);
    font-weight: 300;
    font-size: 17.5px;
    line-height: 1.62;
    letter-spacing: 0.1px;
    color: rgba(255,255,255,0.88);
  }
  .rv__clamped {
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .rv__more {
    align-self: flex-start;
    margin-top: -6px;
    padding: 2px 0;
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: var(--text-small);
    font-weight: 600;
    color: rgba(255,255,255,0.72);
    border-bottom: 1px solid rgba(255,255,255,0.28);
    transition: color var(--t-fast), border-color var(--t-fast);
  }
  .rv__more:hover { color: var(--color-amber); border-color: var(--color-amber); }

  .rv__by { display: flex; align-items: center; gap: 11px; margin-top: 4px; }
  .rv__avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    flex-shrink: 0;
    object-fit: cover;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.22);
  }
  .rv__monogram {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(244,161,48,0.16);
    color: var(--color-amber);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 15px;
  }
  .rv__byText { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .rv__name {
    font-family: var(--font-body);
    font-size: var(--text-small);
    font-weight: 600;
    color: #fff;
  }
  .rv__sub {
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    line-height: 1.45;
    color: rgba(255,255,255,0.62);
  }

  /* Mobile-only swipe progress: track the width of the text column, thumb
     sized to how much of the row is on screen. */
  .rv__progress {
    position: relative;
    height: 2px;
    margin-top: 22px;
    border-radius: 2px;
    background-color: rgba(255,255,255,0.14);
    overflow: hidden;
  }
  .rv__progressThumb {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: 2px;
    width: 20%;
    background-color: var(--color-amber);
    transition: transform 0.1s linear;
  }

  /* ── Footer ───────────────────────────────────────────────────── */
  .rv__foot {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    margin-top: 40px;
    padding-top: 26px;
    border-top: 1px solid rgba(255,255,255,0.14);
  }
  .rv__note {
    flex: 1 1 300px;
    margin: 0;
    max-width: 46ch;
    font-family: var(--font-body);
    font-size: var(--text-small);
    line-height: 1.6;
    color: rgba(255,255,255,0.55);
  }
  .rv__actions { display: flex; gap: 12px; flex-wrap: wrap; flex-shrink: 0; width: 100%; }

  .rv a:focus-visible,
  .rv button:focus-visible {
    outline: 2px solid var(--color-amber);
    outline-offset: 3px;
    border-radius: 2px;
  }

  /* ── Reveal ───────────────────────────────────────────────────── */
  /* Nothing is hidden by default — the resting state is the visible one, so
     prerendered HTML and any browser without IntersectionObserver ships the
     reviews as-is. The animation only exists once the section has said it is
     entering the viewport, and its "both" fill supplies the hidden start
     frame during each entry's stagger delay. */
  @keyframes rvRise {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: none; }
  }
  .rv--in .rv__lockup,
  .rv--in .rv__plats,
  .rv--in .rv__entry {
    animation: rvRise 0.7s cubic-bezier(0.22,0.61,0.36,1) both;
  }

  /* ── Tablet: two columns ──────────────────────────────────────── */
  @media (min-width: 769px) {
    .rv { padding: 96px 40px 88px; }
    .rv__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      overflow: visible;
      margin: 0 -34px;
      padding: 0;
    }
    .rv__entry {
      padding: 32px 34px 34px;
      border-left: none;
    }
    .rv__entry::before { left: 34px; }
    .rv__entry:nth-child(2n) { border-left: 1px solid rgba(255,255,255,0.13); }
    .rv__entry:hover { background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0) 70%); }
    .rv__progress { display: none; }
    .rv__foot { flex-direction: row; align-items: center; justify-content: space-between; gap: 28px; }
    .rv__actions { width: auto; }
  }

  /* ── Desktop: header side by side, three columns ──────────────── */
  @media (min-width: 1000px) {
    .rv__head {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 48px;
      margin-bottom: 56px;
    }
    .rv__plats { width: auto; min-width: 340px; align-self: flex-end; }
    .rv__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .rv__entry:nth-child(2n) { border-left: none; }
    .rv__entry:not(:nth-child(3n+1)) { border-left: 1px solid rgba(255,255,255,0.13); }
  }

  @media (prefers-reduced-motion: reduce) {
    .rv--in .rv__lockup,
    .rv--in .rv__plats,
    .rv--in .rv__entry { animation: none; }
    .rv__entry::before, .rv__progressThumb { transition: none; }
  }
`

// Partial fill on the last star, so 4.9 doesn't get rounded up to a claim of 5.
function Stars({ rating = 5, size = 15 }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, rating - (star - 1)))
        return (
          <span key={star} style={{ position: 'relative', display: 'block', width: size, height: size }}>
            <Star size={size} color="rgba(244,161,48,0.35)" aria-hidden />
            {fill > 0 && (
              <span
                style={{ position: 'absolute', inset: 0, width: `${fill * 100}%`, overflow: 'hidden' }}
                aria-hidden
              >
                <Star size={size} color="var(--color-amber)" fill="var(--color-amber)" />
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}

// Google author photos are remote and can 404 — fall back to a monogram.
function Avatar({ name, photo }) {
  const [failed, setFailed] = useState(false)
  if (photo && !failed) {
    return (
      <img
        className="rv__avatar"
        src={photo}
        alt=""
        width={38}
        height={38}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    )
  }
  return <div className="rv__avatar rv__monogram" aria-hidden>{(name || '?').charAt(0).toUpperCase()}</div>
}

function ReviewEntry({ review, index }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = review.text.length > CLAMP_AT
  const label = SOURCE_LABEL[review.source] || SOURCE_LABEL.direct
  // Curated cards know the tour and where the traveller came from. Google
  // gives neither, so those fall back to the relative time it requires.
  const sub = review.tour || review.location
    ? [review.tour, review.location].filter(Boolean).join(' · ')
    : review.meta

  // Attribution doubles as the link back to the review on its platform, which
  // is what Google's terms ask for and what makes the claim checkable.
  const srcInner = (
    <>
      <ReviewSourceMark source={review.source} size={14} />
      {label}
      {review.url && <span className="rv__arrow" aria-hidden>↗</span>}
    </>
  )

  return (
    <figure className="rv__entry" style={{ animationDelay: `${80 + index * 70}ms` }}>
      <div className="rv__meta">
        <Stars rating={review.rating} size={14} />
        {review.url ? (
          <a
            className="rv__src"
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read ${review.name}'s review on ${label}`}
          >
            {srcInner}
          </a>
        ) : (
          <span className="rv__src">{srcInner}</span>
        )}
      </div>

      <blockquote className={`rv__quote${isLong && !expanded ? ' rv__clamped' : ''}`}>
        {review.text}
      </blockquote>

      {isLong && (
        <button
          className="rv__more"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read full review'}
        </button>
      )}

      <figcaption className="rv__by">
        <Avatar name={review.name} photo={review.photo} />
        <div className="rv__byText">
          <span className="rv__name">{review.name}</span>
          {sub && <span className="rv__sub">{sub}</span>}
        </div>
      </figcaption>
    </figure>
  )
}

function PlatformRow({ platform }) {
  const inner = (
    <>
      <ReviewSourceMark source={platform.source} size={18} />
      <span className="rv__platName">{platform.label}</span>
      <span className="rv__platScore">
        <b>{platform.rating.toFixed(1)}</b> · {platform.count.toLocaleString('en-GB')} reviews
      </span>
      {platform.url && <span className="rv__arrow" aria-hidden>↗</span>}
    </>
  )

  if (!platform.url) return <div className="rv__plat">{inner}</div>
  return (
    <a
      className="rv__plat"
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${platform.label}: ${platform.rating.toFixed(1)} out of 5 from ${platform.count} reviews — opens in a new tab`}
    >
      {inner}
    </a>
  )
}

function Reviews() {
  // No rootMargin: the reveal fires the instant the section's top edge meets
  // the fold, so the animation runs on content that is not on screen yet
  // rather than blinking something the reader was already looking at.
  const [sectionRef, inView] = useInView()
  const scrollerRef = useRef(null)
  const thumbRef = useRef(null)

  // Latched on purpose, and written straight to the node: the entries animate
  // in once and then stay put. Replaying it every time the section re-enters
  // the viewport is a tic, not a transition.
  useEffect(() => {
    if (inView) sectionRef.current?.classList.add('rv--in')
  }, [inView, sectionRef])

  // Swipe indicator, written straight to the node — it changes on every
  // scroll frame and nothing else in the tree depends on it.
  const measure = () => {
    const el = scrollerRef.current
    const thumb = thumbRef.current
    if (!el || !thumb) return
    const track = el.scrollWidth - el.clientWidth
    // Grid layout (tablet up) has nothing to scroll — the bar is hidden there.
    const width = track > 0 ? el.clientWidth / el.scrollWidth : 1
    const offset = track > 0 ? (el.scrollLeft / track) * (1 - width) : 0
    thumb.style.width = `${width * 100}%`
    thumb.style.transform = `translateX(${(offset / width) * 100}%)`
  }

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  if (reviewCards.length === 0) return null

  const visible = reviewCards.slice(0, MAX_CARDS)
  const sourceNames = platforms.map((p) => p.label).join(' and ')

  return (
    <section
      ref={sectionRef}
      className="rv"
      aria-labelledby="reviews-heading"
    >
      <style>{css}</style>

      <div className="rv__inner">

        {/* ── HEADLINE ────────────────────────────────────
            The score at display size, then who verified it —
            the two things a fast scroller needs before any
            review text. */}
        <div className="rv__head">
          <div className="rv__lockup">
            <span className="rv__glyph" aria-hidden>&ldquo;</span>
            <span className="rv__eyebrow">Guest reviews</span>
            {overallStats.rating ? (
              <>
                <h2 className="rv__h2" id="reviews-heading">
                  <span className="rv__figure">{overallStats.rating.toFixed(1)}</span>
                  <span className="rv__h2text">
                    out of 5, from {overallStats.count.toLocaleString('en-GB')} travellers
                  </span>
                </h2>
                <div className="rv__attest">
                  <Stars rating={overallStats.rating} size={17} />
                  <span>Verified on {sourceNames}</span>
                </div>
              </>
            ) : (
              <h2 className="rv__h2plain" id="reviews-heading">What travellers say</h2>
            )}
          </div>

          {platforms.length > 0 && (
            <div className="rv__plats" style={{ animationDelay: '120ms' }}>
              {platforms.map((p) => (
                <PlatformRow key={p.source} platform={p} />
              ))}
            </div>
          )}
        </div>

        {/* ── THE SIX ─────────────────────────────────────
            An open editorial grid — shared hairlines and wide
            gutters, no card boxes — that collapses to one
            snap-scrolling row on phones. */}
        <div className="rv__grid" ref={scrollerRef} onScroll={measure}>
          {visible.map((review, i) => (
            <ReviewEntry key={review.id} review={review} index={i} />
          ))}
        </div>

        <div className="rv__progress" aria-hidden>
          <div className="rv__progressThumb" ref={thumbRef} />
        </div>

        {/* ── FOOTER ──────────────────────────────────────
            Six is all we show; the rest lives where we can't
            edit it. Outline buttons only — amber stays
            reserved for the booking CTAs. */}
        <div className="rv__foot">
          <p className="rv__note">
            Every review here was written by a traveller after their tour, on {sourceNames}.
          </p>
          <div className="rv__actions">
            {googleStats.url && (
              <Button href={googleStats.url} variant="secondary" size="sm" onDark>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <ReviewSourceMark source="google" size={16} />
                  All Google reviews
                </span>
              </Button>
            )}
            {tripadvisorStats.url && (
              <Button href={tripadvisorStats.url} variant="secondary" size="sm" onDark>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <ReviewSourceMark source="tripadvisor" size={16} />
                  All Tripadvisor reviews
                </span>
              </Button>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Reviews
