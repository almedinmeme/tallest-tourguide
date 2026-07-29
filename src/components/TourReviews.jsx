// Reviews on a tour or journey page.
//
// Two jobs, and the second one matters even when the first has nothing to
// show. Most tours don't have a curated quote attached yet, so a section that
// only renders quotes collapses into a lonely line of text — which is exactly
// what this looked like before.
//
//   1. VOICES — the curated highlights from /admin → Reviews that are pinned
//      to THIS tour, set as open editorial rows rather than boxed cards.
//   2. THE ASK — a mat that always carries real proof (the company-wide
//      rating and where it comes from) and the two platform links. A review
//      left on Google or Tripadvisor grows the public rating that wins
//      bookings; one collected into our own database only decorates our site.
//
// Which reviews belong here is an EXPLICIT link (r.tourSlug, set in
// /admin → Reviews), never a name match. Guests write the name they remember —
// "Sarajevo Siege Tour" for what the catalogue calls "Sarajevo War Tour" — so
// matching on text would attach real people's words to the wrong tour.
// A review with no tourSlug stays on the homepage, the right default for a
// general one ("best guide in Bosnia").

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { publishedFeaturedReviews } from '../data/featuredReviews'
import { googleStats, tripadvisorStats, overallStats } from '../data/reviewFeed'
import tours from '../data/tours'
import { packages } from '../data/packages'
import ReviewSourceMark from './ReviewSourceMark'

const SOURCE_LABEL = { google: 'Google', tripadvisor: 'Tripadvisor', direct: 'Sent to us' }
const INITIAL = 4
const CLAMP_AT = 280

const css = `
  .tr { margin-top: 56px; }
  .tr__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--color-n200);
  }
  .tr__title {
    font-family: var(--font-display);
    font-size: var(--text-h2);
    font-weight: 700;
    color: var(--color-n900);
    margin: 0;
  }
  .tr__score {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    font-family: var(--font-body);
    font-size: var(--text-small);
    color: var(--color-n500);
  }
  .tr__scoreNum { font-weight: 700; color: var(--color-n900); }

  /* ── Voices ───────────────────────────────────────────────────── */
  /* Column count comes from the space this section actually has, not from the
     viewport: it sits in the detail page's ~690px text column on a 1440
     screen, where a viewport media query would have split it into two
     unreadably narrow columns. */
  .tr__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
    column-gap: 44px;
  }
  .tr__entry {
    position: relative;
    margin: 0;
    padding: 26px 0 28px;
    border-bottom: 1px solid var(--color-n200);
  }
  /* The amber tick marks where each voice starts — the same cue the homepage
     reviews use, so the two sections read as one family. */
  .tr__entry::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 26px;
    height: 1px;
    background: var(--color-amber);
  }
  .tr__meta { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .tr__src {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    font-weight: 600;
    color: var(--color-n500);
  }
  .tr__quote {
    margin: 0;
    max-width: 62ch;
    font-family: var(--font-hero);
    font-weight: 300;
    font-size: 18px;
    line-height: 1.62;
    color: var(--color-n800);
    /* Reviews written in paragraphs keep them. */
    white-space: pre-line;
  }
  .tr__clamped {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .tr__by {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
  }
  .tr__monogram {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-amber-light);
    color: var(--color-forest-green);
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 14px;
  }
  .tr__name {
    font-family: var(--font-body);
    font-size: var(--text-small);
    font-weight: 700;
    color: var(--color-n900);
  }
  .tr__sub {
    display: block;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    color: var(--color-n500);
  }
  .tr__link {
    background: none;
    border: none;
    padding: 4px 0 0;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: var(--text-small);
    font-weight: 600;
    color: var(--color-forest-green);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .tr__more { margin-top: 18px; }

  /* ── The ask ──────────────────────────────────────────────────── */
  /* A mat, deliberately: this is a thing you act on, not a thing you read. */
  /* Wrap rather than a breakpoint, for the same reason as the grid: the panel
     goes side-by-side when its own width allows it and stacks when it can't. */
  .tr__ask {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 22px 32px;
    margin-top: 28px;
    padding: 24px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-n200);
    background:
      radial-gradient(120% 140% at 0% 0%, rgba(244,161,48,0.10) 0%, rgba(244,161,48,0) 60%),
      var(--color-n100);
  }
  .tr__askLead {
    font-family: var(--font-display);
    font-size: var(--text-h3);
    font-weight: 700;
    color: var(--color-n900);
    margin: 0 0 6px;
  }
  .tr__askText {
    font-family: var(--font-body);
    font-size: var(--text-small);
    line-height: 1.6;
    color: var(--color-n600);
    margin: 0;
    max-width: 46ch;
  }
  .tr__proof {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    font-family: var(--font-body);
    font-size: var(--text-small);
    color: var(--color-n600);
  }
  .tr__proof b { color: var(--color-n900); }
  .tr__askInfo { flex: 1 1 300px; min-width: 260px; }
  .tr__askActions { display: flex; flex-wrap: wrap; gap: 10px; flex: 0 1 auto; }
  .tr__platform {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 16px;
    border-radius: var(--radius);
    border: 1px solid var(--color-n300);
    background-color: var(--color-n000);
    font-family: var(--font-body);
    font-size: var(--text-small);
    font-weight: 700;
    color: var(--color-n900);
    text-decoration: none;
    transition: border-color var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
  }
  .tr__platform:hover {
    border-color: var(--color-forest-green);
    box-shadow: 0 4px 14px rgba(26,26,46,0.07);
    transform: translateY(-1px);
  }
  .tr__platformArrow { margin-left: auto; color: var(--color-n400); }
  /* The quiet other half of the ask, kept inside the mat so it reads as the
     alternative to the two buttons rather than as orphaned page furniture. */
  .tr__askFoot { flex: 1 0 100%; margin: -4px 0 0; }
  .tr__private {
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    color: var(--color-n500);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .tr__private:hover { color: var(--color-forest-green); }
  .tr a:focus-visible, .tr button:focus-visible {
    outline: 2px solid var(--color-forest-green);
    outline-offset: 3px;
    border-radius: 2px;
  }

`

function Stars({ rating = 5, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, rating - (star - 1)))
        return (
          // line-height 0 on the box, display:block on the marks: an inline
          // SVG otherwise sits on the text baseline, which drops it far enough
          // for the clipped overlay to cut the bottom off the star.
          <span key={star} style={{ position: 'relative', display: 'block', width: size, height: size, lineHeight: 0 }}>
            <Star size={size} color="rgba(244,161,48,0.4)" aria-hidden style={{ display: 'block' }} />
            {fill > 0 && (
              <span style={{ position: 'absolute', inset: 0, width: `${fill * 100}%`, overflow: 'hidden' }} aria-hidden>
                <Star size={size} color="var(--color-amber)" fill="var(--color-amber)" style={{ display: 'block' }} />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}

function Entry({ review }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = (review.text || '').length > CLAMP_AT
  const when = review.date
    ? new Date(`${review.date}-01`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : ''
  const sub = [review.location, when].filter(Boolean).join(' · ')

  return (
    <figure className="tr__entry">
      <div className="tr__meta">
        <Stars rating={review.rating || 5} />
        <span className="tr__src">
          <ReviewSourceMark source={review.source} size={13} />
          {SOURCE_LABEL[review.source] || SOURCE_LABEL.direct}
        </span>
      </div>

      <blockquote className={`tr__quote${isLong && !expanded ? ' tr__clamped' : ''}`}>
        {review.text}
      </blockquote>

      {isLong && (
        <button className="tr__link" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
          {expanded ? 'Show less' : 'Read full review'}
        </button>
      )}

      <figcaption className="tr__by">
        <span className="tr__monogram" aria-hidden>{(review.name || '?').charAt(0).toUpperCase()}</span>
        <span>
          <span className="tr__name">{review.name}</span>
          {sub && <span className="tr__sub">{sub}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

export default function TourReviews({ tourSlug }) {
  const [showAll, setShowAll] = useState(false)
  const reviews = publishedFeaturedReviews.filter((r) => r.tourSlug && r.tourSlug === tourSlug)
  const platforms = [googleStats, tripadvisorStats].filter((p) => p.url)

  // The catalogue's own count for this tour — the honest local number, next to
  // the company-wide one further down.
  const bookable =
    tours.find((t) => t.slug === tourSlug) || packages.find((p) => p.slug === tourSlug)
  const localCount = Number(bookable?.reviews) || 0
  const localRating = Number(bookable?.rating) || 0

  const visible = showAll ? reviews : reviews.slice(0, INITIAL)

  return (
    <section className="tr">
      <style>{css}</style>

      <div className="tr__head">
        <h2 className="tr__title">What guests say</h2>
        {localCount > 0 && localRating > 0 && (
          <span className="tr__score">
            <Stars rating={localRating} size={15} />
            <span>
              <span className="tr__scoreNum">{localRating.toFixed(1)}</span> from {localCount}{' '}
              {localCount === 1 ? 'review' : 'reviews'} of this trip
            </span>
          </span>
        )}
      </div>

      {reviews.length > 0 && (
        <>
          <div className="tr__grid">
            {visible.map((r) => (
              <Entry key={r.id} review={r} />
            ))}
          </div>
          {reviews.length > INITIAL && !showAll && (
            <button className="tr__link tr__more" onClick={() => setShowAll(true)}>
              Show {reviews.length - INITIAL} more {reviews.length - INITIAL === 1 ? 'review' : 'reviews'}
            </button>
          )}
        </>
      )}

      {/* Always present, quotes or not: proof plus the one thing we want asked
          of a guest who has just come back. */}
      <aside className="tr__ask">
        <div className="tr__askInfo">
          <p className="tr__askLead">
            {reviews.length > 0 ? 'Been on this tour too?' : 'Been on this tour?'}
          </p>
          <p className="tr__askText">
            A public review is how the next traveller decides — it takes a minute, and it
            counts for far more than anything we could write about ourselves.
          </p>
          {overallStats.rating > 0 && (
            <span className="tr__proof">
              <Stars rating={overallStats.rating} size={14} />
              <span>
                <b>{overallStats.rating.toFixed(1)}</b> from{' '}
                {overallStats.count.toLocaleString('en-GB')} travellers on{' '}
                {platforms.map((p) => p.label).join(' and ')}
              </span>
            </span>
          )}
        </div>

        <div className="tr__askActions">
          {platforms.map((p) => (
            <a
              key={p.source}
              className="tr__platform"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ReviewSourceMark source={p.source} size={18} />
              Review us on {p.label}
              <span className="tr__platformArrow" aria-hidden>↗</span>
            </a>
          ))}
        </div>

        {tourSlug && (
          <div className="tr__askFoot">
            <Link to={`/review/${tourSlug}`} className="tr__private">
              Rather tell us privately? Send us feedback instead
            </Link>
          </div>
        )}
      </aside>
    </section>
  )
}
