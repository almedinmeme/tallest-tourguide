// Breadcrumbs — visible trail + matching BreadcrumbList JSON-LD.
//
// Google shows breadcrumbs in search results when the page carries BOTH a
// real linked trail and the schema; emitting them from one `items` array
// means the two can never disagree.
//
// Rendered as a glass pill designed to sit ON the hero photo (same visual
// language as EditorialHero's back pill: dark translucent fill + blur +
// hairline border, so it stays readable on any image). Pages position it
// inside their hero's absolute-positioned corner container, where it
// replaces the old "← All …" back link — Home › Tours › (current page)
// covers the same navigation and more.
//
// Usage (last item = current page, rendered as plain text):
//   <Breadcrumbs items={[
//     { name: 'Tours', path: '/tours' },
//     { name: tour.title, path: `/tours/${tour.slug}` },
//   ]} />
// Home is prepended automatically.

import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { siteUrl } from '../utils/seo'

function Breadcrumbs({ items = [] }) {
  if (!items.length) return null
  const trail = [{ name: 'Home', path: '/' }, ...items]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" style={styles.nav}>
        <ol style={styles.list}>
          {trail.map((item, i) => {
            const isLast = i === trail.length - 1
            return (
              <li key={item.path} style={styles.item}>
                {isLast ? (
                  <span aria-current="page" style={styles.current}>{item.name}</span>
                ) : (
                  <>
                    <Link to={item.path} className="crumb-link" style={styles.link}>{item.name}</Link>
                    <span aria-hidden="true" style={styles.separator}>›</span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

const styles = {
  nav: {
    display: 'inline-flex',
    maxWidth: 'calc(100vw - 48px)',
    padding: '7px 14px',
    borderRadius: 999,
    backgroundColor: 'rgba(10,16,20,0.42)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.25)',
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    minWidth: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    minWidth: 0,
  },
  link: {
    fontFamily: 'var(--font-body)',
    fontSize: '12.5px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.82)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    textShadow: '0 1px 2px rgba(0,0,0,0.25)',
  },
  separator: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.55)',
    flexShrink: 0,
  },
  current: {
    fontFamily: 'var(--font-body)',
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 'min(52vw, 340px)',
    textShadow: '0 1px 2px rgba(0,0,0,0.25)',
  },
}

export default Breadcrumbs
