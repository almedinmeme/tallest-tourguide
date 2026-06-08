// RelatedTrips.jsx
// Renders compact, clickable cards for a set of tour and/or package slugs.
// Used to wire editorial pages back to bookable trips so no page is a dead end.

import { Link } from 'react-router-dom'
import { tours } from '../data/tours'
import { packages } from '../data/packages'

function resolve(slugs, collection, basePath, kind) {
  if (!Array.isArray(slugs)) return []
  return slugs
    .map((slug) => {
      const item = collection.find((c) => c.slug === slug)
      if (!item) return null
      return {
        kind,
        slug,
        to: `${basePath}/${slug}`,
        title: item.title || item.name,
        image: item.hero || item.detailHero || item.heroImage || '',
        price: item.price,
        duration: item.duration,
      }
    })
    .filter(Boolean)
}

export default function RelatedTrips({ tourSlugs = [], packageSlugs = [], heading = 'Travel here with us', intro }) {
  const items = [
    ...resolve(tourSlugs, tours, '/tours', 'Day tour'),
    ...resolve(packageSlugs, packages, '/packages', 'Multi-day'),
  ]
  if (items.length === 0) return null

  return (
    <section style={{ padding: '44px 0', backgroundColor: 'var(--color-n100)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
        <h2 style={styles.h2}>{heading}</h2>
        {intro && <p style={styles.intro}>{intro}</p>}
        <div style={styles.grid}>
          {items.map((it) => (
            <Link key={`${it.kind}-${it.slug}`} to={it.to} style={styles.card} className="card-lift">
              <div style={styles.photoWrap}>
                {it.image ? (
                  <img src={it.image} alt={it.title} loading="lazy" style={styles.photo} />
                ) : (
                  <div style={{ ...styles.photo, backgroundColor: 'var(--color-mid-green)' }} />
                )}
                <span style={styles.kind}>{it.kind}</span>
              </div>
              <div style={styles.body}>
                <h3 style={styles.title}>{it.title}</h3>
                <div style={styles.meta}>
                  {it.duration && <span>{it.duration}</span>}
                  {it.price != null && <span style={styles.price}>from €{it.price}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles = {
  h2: {
    fontFamily: 'var(--font-hero)',
    fontWeight: 400,
    fontSize: 'clamp(22px, 3vw, 30px)',
    color: 'var(--color-n900)',
    margin: '0 0 8px',
  },
  intro: {
    fontFamily: 'var(--font-body)',
    fontSize: 16,
    color: 'var(--color-n600)',
    margin: '0 0 24px',
    maxWidth: 640,
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 20,
  },
  card: {
    display: 'block',
    textDecoration: 'none',
    backgroundColor: 'var(--color-n000)',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid var(--color-n300)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  photoWrap: { position: 'relative', aspectRatio: '4/3', overflow: 'hidden' },
  photo: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  kind: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'var(--color-forest-green)',
    color: '#fff',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    padding: '4px 9px',
    borderRadius: 4,
  },
  body: { padding: '14px 16px 18px' },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 1.35,
    color: 'var(--color-n900)',
    margin: 0,
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--color-n600)',
  },
  price: { fontWeight: 700, color: 'var(--color-forest-green)' },
}
