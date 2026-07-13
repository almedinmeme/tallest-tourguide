// FromTheJournal.jsx
// Compact list of journal posts related to a tour or package, rendered on
// detail pages. Completes the internal-link loop: journal posts already link
// to tours (related/inline cards); this links back, so link equity flows both
// ways and readers can hop between planning and booking.

import { Link } from 'react-router-dom'
import { posts } from '../data/journal'
import { postPromoRefs } from '../data/journalBlocks'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

// `pinned` (post slugs, from the tour/package's journalPosts field) is the
// hand-picked list, shown in that order. When empty, fall back to the
// automatic reverse lookup: posts that link to this trip.
export default function FromTheJournal({ tourSlug, packageSlug, pinned, max = 3 }) {
  const pinnedPosts = (pinned || [])
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter(Boolean)

  const related =
    pinnedPosts.length > 0
      ? pinnedPosts
      : posts
          .filter((p) => {
            const promos = postPromoRefs(p)
            return (
              (tourSlug && (p.relatedTourSlug === tourSlug || promos.some((r) => r.type === 'tour' && r.slug === tourSlug))) ||
              (packageSlug &&
                (p.relatedPackageSlug === packageSlug || promos.some((r) => r.type === 'package' && r.slug === packageSlug)))
            )
          })
          .slice(0, max)

  if (related.length === 0) return null

  return (
    <section style={styles.section}>
      <div style={styles.inner}>
        <span style={styles.eyebrow}>From the Journal</span>
        <h2 style={styles.heading}>Stories from this trip</h2>
        <div style={styles.list}>
          {related.map((p) => (
            <Link key={p.slug} to={`/journal/${p.slug}`} style={styles.row} className="blog-row">
              <div style={styles.thumb}>
                {p.heroImage ? (
                  <img src={p.heroImage} alt={p.title} loading="lazy" width="72" height="72" style={styles.thumbImg} />
                ) : (
                  <div style={styles.thumbPlaceholder} />
                )}
              </div>
              <div style={styles.text}>
                <div style={styles.meta}>
                  {p.category && <span style={styles.category}>{p.category}</span>}
                  {p.publishedDate && <span style={styles.date}>{formatDate(p.publishedDate)}</span>}
                </div>
                <h3 style={styles.title}>{p.title}</h3>
                {p.excerpt && <p style={styles.excerpt}>{p.excerpt}</p>}
              </div>
              <span style={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    backgroundColor: 'var(--color-n000)',
    borderTop: '1px solid var(--color-n300)',
    padding: '48px 24px',
  },
  inner: {
    maxWidth: '760px',
    margin: '0 auto',
  },
  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    color: 'var(--color-forest-green)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '6px',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '24px',
    color: 'var(--color-n900)',
    margin: '0 0 20px 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 12px',
    textDecoration: 'none',
    borderRadius: 'var(--radius)',
  },
  thumb: {
    width: '72px',
    height: '72px',
    borderRadius: '8px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-mid-green)',
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  category: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '10px',
    color: 'var(--color-forest-green)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  date: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--color-n600)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '15px',
    color: 'var(--color-n900)',
    lineHeight: '1.3',
    margin: '0 0 4px 0',
  },
  excerpt: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
    lineHeight: '1.4',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  arrow: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '16px',
    color: 'var(--color-n300)',
    flexShrink: 0,
  },
}
