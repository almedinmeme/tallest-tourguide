// Reviews on a tour or journey page.
//
// This used to render whatever the Airtable sync had returned for this tour,
// plus a form to leave a new one. Both are gone: the synced file had been
// empty for months (so these blocks were already rendering nothing), and
// reviews collected into our own database only decorate our own site. A
// review left on Google or Tripadvisor grows the public rating that actually
// wins bookings, so that's where guests are pointed instead.
//
// What's left is the part with real value: the curated highlights from
// /admin → Reviews that mention THIS tour, plus the two platform links. It's
// the first time those curated reviews appear anywhere but the homepage.

import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { publishedFeaturedReviews } from '../data/featuredReviews'
import { googleStats, tripadvisorStats } from '../data/reviewFeed'
import ReviewSourceMark from './ReviewSourceMark'

// Which reviews belong here is an EXPLICIT link (r.tourSlug, set in
// /admin → Reviews), never a name match. Guests write the name they
// remember — "Sarajevo Siege Tour" for what the catalogue calls "Sarajevo
// War Tour" — so matching on text would attach real people's words to the
// wrong tour. Showing nothing is much better than showing that.
//
// A review with no tourSlug simply stays on the homepage, which is the
// right default for a general one ("best guide in Bosnia").

export default function TourReviews({ tourSlug }) {
  const reviews = publishedFeaturedReviews.filter((r) => r.tourSlug && r.tourSlug === tourSlug)
  const platforms = [googleStats, tripadvisorStats].filter((p) => p.url)

  return (
    <section style={styles.wrap}>
      <h2 style={styles.title}>What guests say</h2>

      {reviews.length > 0 && (
        <div style={styles.quotes}>
          {reviews.map((r) => (
            <figure key={r.id} style={styles.quote}>
              <div style={styles.stars} aria-label={`${r.rating || 5} out of 5`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    color="var(--color-amber)"
                    fill={star <= Math.round(r.rating || 5) ? 'var(--color-amber)' : 'none'}
                  />
                ))}
              </div>
              <blockquote style={styles.text}>{r.text}</blockquote>
              <figcaption style={styles.byline}>
                <ReviewSourceMark source={r.source} size={14} />
                <span style={styles.name}>{r.name}</span>
                {r.location && <span>· {r.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <div style={styles.cta}>
        <span style={styles.ctaLead}>
          {reviews.length > 0
            ? 'Been on this tour? Tell others where it counts.'
            : 'Been on this tour? Be the first to say so.'}
        </span>
        <div style={styles.ctaLinks}>
          {platforms.map((p) => (
            <a
              key={p.source}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.ctaLink}
            >
              <ReviewSourceMark source={p.source} size={16} />
              Review us on {p.label}
            </a>
          ))}
        </div>
        {tourSlug && (
          <Link to={`/review/${tourSlug}`} style={styles.quietLink}>
            Or send us private feedback
          </Link>
        )}
      </div>
    </section>
  )
}

const styles = {
  wrap: { marginTop: '48px' },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-charcoal)',
    marginBottom: '24px',
  },
  quotes: { display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '36px' },
  // Deliberately not cards: this is reading material, and a border around a
  // paragraph makes it look like a widget rather than something a person said.
  quote: { margin: 0, maxWidth: '62ch' },
  stars: { display: 'flex', gap: '3px', alignItems: 'center', marginBottom: '10px' },
  text: {
    margin: 0,
    fontSize: 'var(--text-body)',
    lineHeight: 1.7,
    color: 'var(--color-charcoal)',
  },
  byline: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    marginTop: '12px',
    fontSize: 'var(--text-small)',
    color: 'var(--color-stone)',
  },
  name: { fontWeight: 600, color: 'var(--color-charcoal)' },
  cta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
    paddingTop: '24px',
    borderTop: '1px solid var(--color-border)',
  },
  ctaLead: { fontSize: 'var(--text-body)', color: 'var(--color-charcoal)' },
  ctaLinks: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  ctaLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 14px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-charcoal)',
    textDecoration: 'none',
  },
  quietLink: {
    fontSize: 'var(--text-small)',
    color: 'var(--color-stone)',
    textDecoration: 'underline',
  },
}
