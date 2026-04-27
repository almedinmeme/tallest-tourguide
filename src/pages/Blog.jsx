import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useBlog } from '../hooks/useBlog'
import useWindowWidth from '../hooks/useWindowWidth'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Blog() {
  const { posts, loading, error } = useBlog()
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <div>
      <SEO
        title="Blog"
        description="Stories, tips, and local insights about Sarajevo and Bosnia from your tallest tourguide."
        url="/blog"
      />

      {/* ── PAGE HEADER ─────────────────────────────────── */}
      <section style={styles.pageHeader}>
        <div style={styles.headerInner}>
          <span style={styles.eyebrow}>From the Guide</span>
          <h1 style={styles.headline}>Stories & Insights</h1>
          <p style={styles.subheading}>
            Local knowledge, travel tips, and stories from the streets
            of Sarajevo and beyond.
          </p>
        </div>
      </section>

      {/* ── POST GRID ───────────────────────────────────── */}
      <section style={styles.section}>
        <div style={styles.inner}>

          {loading && (
            <p style={styles.stateText}>Loading posts…</p>
          )}

          {error && (
            <p style={styles.errorText}>
              Could not load posts. Please try again later.
            </p>
          )}

          {!loading && !error && posts.length === 0 && (
            <p style={styles.stateText}>No posts yet — check back soon.</p>
          )}

          {!loading && !error && posts.length > 0 && (
            <div style={{
              ...styles.grid,
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            }}>
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  style={styles.card}
                  className="card-lift"
                >
                  {/* Hero image */}
                  <div style={styles.cardImageWrapper}>
                    {post.heroImage ? (
                      <img
                        src={post.heroImage}
                        alt={post.title}
                        style={styles.cardImage}
                      />
                    ) : (
                      <div style={styles.cardImagePlaceholder} />
                    )}
                    {post.category && (
                      <span style={styles.categoryPill}>
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div style={styles.cardBody}>
                    {post.publishedDate && (
                      <span style={styles.cardDate}>
                        {formatDate(post.publishedDate)}
                      </span>
                    )}
                    <h2 style={styles.cardTitle}>{post.title}</h2>
                    {post.excerpt && (
                      <p style={styles.cardExcerpt}>{post.excerpt}</p>
                    )}
                    <span style={styles.readMore}>Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}

const styles = {
  pageHeader: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '36px 40px',
  },

  headerInner: {
    maxWidth: '680px',
    margin: '0 auto',
    textAlign: 'center',
  },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-mid-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h1)',
    color: 'var(--color-n000)',
    marginBottom: '12px',
  },

  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-amber-light)',
    lineHeight: 'var(--leading-body)',
  },

  section: {
    backgroundColor: 'var(--color-n100)',
    padding: '64px 40px 80px 40px',
  },

  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },

  grid: {
    display: 'grid',
    gap: '24px',
  },

  card: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    border: '1px solid var(--color-n300)',
    overflow: 'hidden',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
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
    backgroundColor: 'var(--color-mid-green)',
  },

  categoryPill: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    padding: '4px 10px',
    borderRadius: '100px',
  },

  cardBody: {
    padding: '20px 20px 24px 20px',
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

  stateText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    textAlign: 'center',
    padding: '48px 0',
  },

  errorText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-error)',
    textAlign: 'center',
    padding: '48px 0',
  },
}

export default Blog
