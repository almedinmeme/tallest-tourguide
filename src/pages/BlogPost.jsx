import { useParams, Link } from 'react-router-dom'
import { Star, Clock, Users, ArrowRight } from 'lucide-react'
import { trackEvent } from '../utils/analytics'
import { marked } from 'marked'
import SEO from '../components/SEO'
import { BlogPostingSchema } from '../schema/SchemaMarkup'
import { useBlog } from '../hooks/useBlog'
import useWindowWidth from '../hooks/useWindowWidth'
import tours from '../data/tours'
import package1Hero from '../assets/package-1-hero.webp'
import package2Hero from '../assets/package-2-hero.webp'

// Minimal package data needed for the recommendation card.
// Full data lives in PackageDetail.jsx.
const packages = [
  {
    slug: 'sarajevo-essential',
    name: '3-Day Complete Sarajevo Experience: Let us show you our home',
    subtitle: 'Stories, Survival & Soul',
    duration: '3 Days',
    groupSize: 8,
    price: 99,
    rating: 5.0,
    reviews: 1,
    badge: 'Most Popular',
    heroImage: package1Hero,
  },
  {
    slug: 'bosnia-deep-dive',
    name: 'Bosnia Deep Dive',
    subtitle: 'Real Bosnia, Deeply Experienced',
    duration: '5 Days',
    groupSize: 8,
    price: 480,
    rating: 4.9,
    reviews: 31,
    badge: 'Best Value',
    heroImage: package2Hero,
  },
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function BlogPost() {
  const { slug } = useParams()
  const { posts, loading, error } = useBlog()
  const width = useWindowWidth()
  const isMobile = width <= 768

  const post = posts.find((p) => p.slug === slug)

  // Related posts: same category first, then most recent — max 2, excluding current
  const relatedPosts = post
    ? [
        ...posts.filter((p) => p.slug !== slug && p.category === post.category),
        ...posts.filter((p) => p.slug !== slug && p.category !== post.category),
      ].slice(0, 2)
    : []

  const relatedTour = post?.relatedTourSlug
    ? tours.find((t) => t.slug === post.relatedTourSlug)
    : null

  const relatedPackage = post?.relatedPackageSlug
    ? packages.find((p) => p.slug === post.relatedPackageSlug)
    : null

  const inlineCard = post?.inlineCardSlug
    ? post.inlineCardType === 'package'
      ? packages.find((p) => p.slug === post.inlineCardSlug)
      : tours.find((t) => t.slug === post.inlineCardSlug)
    : null
  const inlineCardIsPackage = post?.inlineCardType === 'package'

  if (loading) {
    return (
      <div style={styles.stateWrapper}>
        <p style={styles.stateText}>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.stateWrapper}>
        <p style={styles.errorText}>Could not load this post.</p>
        <Link to="/blog" style={styles.backLink}>← Back to Blog</Link>
      </div>
    )
  }

  if (!loading && !post) {
    return (
      <div style={styles.stateWrapper}>
        <p style={styles.stateText}>Post not found.</p>
        <Link to="/blog" style={styles.backLink}>← Back to Blog</Link>
      </div>
    )
  }

  if (!post) return null

  return (
    <div>
      <SEO
        title={post.title}
        description={post.excerpt || post.title}
        image={post.heroImage || undefined}
        url={`/blog/${post.slug}`}
        type="article"
        publishedDate={post.publishedDate}
      />
      <BlogPostingSchema post={post} />

      {/* ── HERO IMAGE ──────────────────────────────────── */}
      <div style={styles.heroWrapper}>
        {post.heroImage ? (
          <img
            src={post.heroImage}
            alt={post.title}
            style={styles.heroPhoto}
          />
        ) : (
          <div style={styles.heroPlaceholder} />
        )}
        <div style={styles.heroGradient} />
        <div style={styles.heroGradientTop} />
        <div style={styles.heroBackLink}>
          <Link to="/blog" style={styles.backLinkPill}>
            ← All Posts
          </Link>
        </div>
      </div>

      {/* ── CONTENT CARD ────────────────────────────────── */}
      <div style={{
        ...styles.contentCard,
        padding: isMobile ? '32px 20px 64px 20px' : '56px 40px 64px 40px',
      }}>
        <div style={styles.contentInner}>

          {/* Meta — category + date */}
          <div style={styles.metaRow}>
            {post.category && (
              <span style={styles.categoryPill}>{post.category}</span>
            )}
            {post.publishedDate && (
              <span style={styles.dateMeta}>
                {formatDate(post.publishedDate)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            ...styles.title,
            fontSize: isMobile ? '28px' : '44px',
          }}>
            {post.title}
          </h1>

          {/* Excerpt as lead paragraph */}
          {post.excerpt && (
            <p style={styles.lead}>{post.excerpt}</p>
          )}

          <div style={styles.divider} />

          {/* Body — alternating text blocks and images */}
          {post.content && (
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
          )}
          {post.inlineImage1 && (
            <figure style={styles.figure}>
              <img src={post.inlineImage1} alt={post.inlineImage1Caption || post.title} loading="lazy" style={styles.inlineImage} />
              {post.inlineImage1Caption && (
                <figcaption style={styles.figcaption}>{post.inlineImage1Caption}</figcaption>
              )}
            </figure>
          )}
          {post.content2 && (
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: marked(post.content2) }} />
          )}
          {post.inlineImage2 && (
            <figure style={styles.figure}>
              <img src={post.inlineImage2} alt={post.inlineImage2Caption || post.title} loading="lazy" style={styles.inlineImage} />
              {post.inlineImage2Caption && (
                <figcaption style={styles.figcaption}>{post.inlineImage2Caption}</figcaption>
              )}
            </figure>
          )}
          {inlineCard && (
            <InlinePromoCard
              card={inlineCard}
              isPackage={inlineCardIsPackage}
              isMobile={isMobile}
            />
          )}
          {post.content3 && (
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: marked(post.content3) }} />
          )}
          {post.inlineImage3 && (
            <figure style={styles.figure}>
              <img src={post.inlineImage3} alt={post.inlineImage3Caption || post.title} loading="lazy" style={styles.inlineImage} />
              {post.inlineImage3Caption && (
                <figcaption style={styles.figcaption}>{post.inlineImage3Caption}</figcaption>
              )}
            </figure>
          )}
          {post.content4 && (
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: marked(post.content4) }} />
          )}
          {post.inlineImage4 && (
            <figure style={styles.figure}>
              <img src={post.inlineImage4} alt={post.inlineImage4Caption || post.title} loading="lazy" style={styles.inlineImage} />
              {post.inlineImage4Caption && (
                <figcaption style={styles.figcaption}>{post.inlineImage4Caption}</figcaption>
              )}
            </figure>
          )}
          {post.content5 && (
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: marked(post.content5) }} />
          )}

          {/* Back link */}
          <div style={styles.footer}>
            <Link to="/blog" style={styles.backLinkBottom}>
              ← Back to all posts
            </Link>
          </div>

        </div>
      </div>

      {/* ── RELATED SECTION ─────────────────────────────── */}
      <div style={styles.relatedSection}>
        <div style={styles.relatedInner}>

          {/* More posts */}
          {relatedPosts.length > 0 && (
            <div style={styles.relatedBlock}>
              <div style={styles.relatedBlockHeader}>
                <span style={styles.relatedEyebrow}>Keep Reading</span>
                <h2 style={styles.relatedHeading}>More from the Blog</h2>
              </div>
              <div style={styles.relatedPostsList}>
                {relatedPosts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.slug}`}
                    style={styles.postRow}
                    className="blog-row"
                  >
                    {/* Small square thumbnail */}
                    <div style={styles.postRowThumb}>
                      {p.heroImage ? (
                        <img src={p.heroImage} alt={p.title} loading="lazy" style={styles.postRowThumbImg} />
                      ) : (
                        <div style={styles.postRowThumbPlaceholder} />
                      )}
                    </div>
                    {/* Text */}
                    <div style={styles.postRowText}>
                      <div style={styles.postRowMeta}>
                        {p.category && (
                          <span style={styles.postRowCategory}>{p.category}</span>
                        )}
                        {p.publishedDate && (
                          <span style={styles.postRowDate}>{formatDate(p.publishedDate)}</span>
                        )}
                      </div>
                      <h3 style={styles.postRowTitle}>{p.title}</h3>
                      {p.excerpt && (
                        <p style={styles.postRowExcerpt}>{p.excerpt}</p>
                      )}
                    </div>
                    <span style={styles.postRowArrow}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related tour + package */}
          {(relatedTour || relatedPackage) && (
            <div style={styles.relatedBlock}>
              <div style={styles.relatedBlockHeader}>
                <span style={styles.relatedEyebrow}>Plan Your Visit</span>
                <h2 style={styles.relatedHeading}>Book Your Next Experience</h2>
              </div>
              <div style={{
                ...styles.experiencesGrid,
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              }}>

                {/* Tour card */}
                {relatedTour && (
                  <Link
                    to={`/tours/${relatedTour.slug}`}
                    style={styles.experienceCard}
                    className="card-lift"
                  >
                    <div style={styles.experienceImageWrapper}>
                      <img src={relatedTour.hero} alt={relatedTour.title} loading="lazy" style={styles.experienceImage} />
                      {relatedTour.badge && (
                        <span style={styles.experienceBadge}>{relatedTour.badge}</span>
                      )}
                      <span style={styles.experienceTypeTag}>Tour</span>
                    </div>
                    <div style={styles.experienceBody}>
                      <div style={styles.experienceRating}>
                        <Star size={12} color="var(--color-amber)" fill="var(--color-amber)" />
                        <span style={styles.experienceRatingNum}>{relatedTour.rating}</span>
                        <span style={styles.experienceRatingCount}>({relatedTour.reviews} reviews)</span>
                      </div>
                      <h3 style={styles.experienceTitle}>{relatedTour.title}</h3>
                      <div style={styles.experienceMeta}>
                        <span style={styles.experienceMetaItem}>{relatedTour.duration}</span>
                        <span style={styles.experienceMetaDot}>·</span>
                        <span style={styles.experienceMetaItem}>Max {relatedTour.groupSize}</span>
                      </div>
                      <div style={styles.experienceFooter}>
                        <div>
                          <span style={styles.experiencePrice}>€{relatedTour.price}</span>
                          <span style={styles.experiencePricePer}> /person</span>
                        </div>
                        <span style={styles.experienceBookBtn}>Book now →</span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Package card */}
                {relatedPackage && (
                  <Link
                    to={`/packages/${relatedPackage.slug}`}
                    style={styles.experienceCard}
                    className="card-lift"
                  >
                    <div style={styles.experienceImageWrapper}>
                      <img src={relatedPackage.heroImage} alt={relatedPackage.name} loading="lazy" style={styles.experienceImage} />
                      {relatedPackage.badge && (
                        <span style={styles.experienceBadge}>{relatedPackage.badge}</span>
                      )}
                      <span style={styles.experienceTypeTag}>Package</span>
                    </div>
                    <div style={styles.experienceBody}>
                      <div style={styles.experienceRating}>
                        <Star size={12} color="var(--color-amber)" fill="var(--color-amber)" />
                        <span style={styles.experienceRatingNum}>{relatedPackage.rating}</span>
                        <span style={styles.experienceRatingCount}>({relatedPackage.reviews} reviews)</span>
                      </div>
                      <h3 style={styles.experienceTitle}>{relatedPackage.name}</h3>
                      <div style={styles.experienceMeta}>
                        <span style={styles.experienceMetaItem}>{relatedPackage.duration}</span>
                        <span style={styles.experienceMetaDot}>·</span>
                        <span style={styles.experienceMetaItem}>Max {relatedPackage.groupSize}</span>
                      </div>
                      <div style={styles.experienceFooter}>
                        <div>
                          <span style={styles.experiencePrice}>€{relatedPackage.price}</span>
                          <span style={styles.experiencePricePer}> /person</span>
                        </div>
                        <span style={styles.experienceBookBtn}>View package →</span>
                      </div>
                    </div>
                  </Link>
                )}

              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

const styles = {
  stateWrapper: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '80px 40px',
  },

  stateText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
  },

  errorText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-error)',
  },

  backLink: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },

  heroWrapper: {
    position: 'relative',
    height: '65vh',
    minHeight: '380px',
    maxHeight: '620px',
    overflow: 'hidden',
  },

  heroPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },

  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-mid-green)',
  },

  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(to top, var(--color-n100) 0%, transparent 100%)',
  },

  heroGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
  },

  heroBackLink: {
    position: 'absolute',
    top: '24px',
    left: '40px',
    zIndex: 2,
  },

  backLinkPill: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n000)',
    textDecoration: 'none',
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    padding: '6px 14px',
    borderRadius: '100px',
    border: '1px solid rgba(255,255,255,0.2)',
  },

  contentCard: {
    backgroundColor: 'var(--color-n100)',
    marginTop: '-60px',
    borderRadius: '20px 20px 0 0',
    position: 'relative',
    zIndex: 1,
  },

  contentInner: {
    maxWidth: '720px',
    margin: '0 auto',
  },

  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },

  categoryPill: {
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    padding: '4px 12px',
    borderRadius: '100px',
  },

  dateMeta: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  title: {
    fontFamily: 'var(--font-hero)',
    fontWeight: '700',
    color: 'var(--color-n900)',
    lineHeight: '1.1',
    letterSpacing: '-0.5px',
    marginBottom: '24px',
  },

  lead: {
    fontFamily: 'var(--font-hero)',
    fontSize: '20px',
    color: 'var(--color-n600)',
    lineHeight: '1.75',
    fontStyle: 'italic',
    fontWeight: '300',
    margin: 0,
  },

  divider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    margin: '32px 0',
  },

  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  paragraph: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    lineHeight: '1.8',
    margin: '0 0 4px 0',
  },

  mdH2: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '26px',
    color: 'var(--color-n900)',
    lineHeight: '1.25',
    marginTop: '12px',
    marginBottom: '4px',
  },

  mdH3: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '20px',
    color: 'var(--color-n900)',
    lineHeight: '1.3',
    marginTop: '8px',
    marginBottom: '4px',
  },

  mdBold: {
    fontWeight: '700',
    color: 'var(--color-n900)',
  },

  mdItalic: {
    fontStyle: 'italic',
    color: 'var(--color-n600)',
  },

  mdImageWrapper: {
    margin: '24px 0 4px 0',
    padding: 0,
    borderRadius: '12px',
    overflow: 'hidden',
  },

  mdImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: '12px',
  },

  mdImageCaption: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
    textAlign: 'center',
    marginTop: '8px',
    fontStyle: 'italic',
  },

  mdUl: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    lineHeight: '1.8',
    paddingLeft: '24px',
    margin: '0 0 4px 0',
  },

  mdOl: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    lineHeight: '1.8',
    paddingLeft: '24px',
    margin: '0 0 4px 0',
  },

  mdLi: {
    marginBottom: '6px',
  },

  mdBlockquote: {
    borderLeft: '3px solid var(--color-forest-green)',
    paddingLeft: '20px',
    margin: '8px 0',
    fontStyle: 'italic',
    color: 'var(--color-n600)',
  },

  mdHr: {
    border: 'none',
    borderTop: '1px solid var(--color-n300)',
    margin: '16px 0',
  },

  figure: {
    margin: '8px 0',
  },

  inlineImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: '12px',
  },

  figcaption: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n500)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: '8px',
    lineHeight: '1.5',
  },

  footer: {
    marginTop: '48px',
    paddingTop: '32px',
    borderTop: '1px solid var(--color-n300)',
  },

  backLinkBottom: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },

  // ── Related section ──────────────────────────────────
  relatedSection: {
    backgroundColor: 'var(--color-n000)',
    borderTop: '1px solid var(--color-n300)',
    padding: '64px 40px 80px 40px',
  },

  relatedInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '64px',
  },

  relatedBlock: {},

  relatedBlockHeader: {
    marginBottom: '28px',
  },

  relatedEyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    color: 'var(--color-forest-green)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '6px',
  },

  relatedHeading: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '24px',
    color: 'var(--color-n900)',
    margin: 0,
  },

  // Blog post rows — compact horizontal layout
  relatedPostsList: {
    display: 'flex',
    flexDirection: 'column',
  },

  postRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 12px',
    textDecoration: 'none',
    borderRadius: 'var(--radius)',
  },

  postRowThumb: {
    width: '72px',
    height: '72px',
    borderRadius: '8px',
    overflow: 'hidden',
    flexShrink: 0,
  },

  postRowThumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  postRowThumbPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-mid-green)',
  },

  postRowText: {
    flex: 1,
    minWidth: 0,
  },

  postRowMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },

  postRowCategory: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '10px',
    color: 'var(--color-forest-green)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },

  postRowDate: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--color-n600)',
  },

  postRowTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '15px',
    color: 'var(--color-n900)',
    lineHeight: '1.3',
    margin: '0 0 4px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  postRowExcerpt: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
    lineHeight: '1.4',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  postRowArrow: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '16px',
    color: 'var(--color-n300)',
    flexShrink: 0,
  },

  // Tour + package experience cards
  experiencesGrid: {
    display: 'grid',
    gap: '20px',
  },

  experienceCard: {
    backgroundColor: 'var(--color-n100)',
    borderRadius: '14px',
    border: '1px solid var(--color-n300)',
    overflow: 'hidden',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
  },

  experienceImageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    flexShrink: 0,
  },

  experienceImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  experienceBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    padding: '3px 8px',
    borderRadius: '100px',
  },

  experienceTypeTag: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(4px)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    padding: '3px 8px',
    borderRadius: '100px',
  },

  experienceBody: {
    padding: '16px 18px 20px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },

  experienceRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  experienceRatingNum: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--color-n900)',
  },

  experienceRatingCount: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },

  experienceTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '16px',
    color: 'var(--color-n900)',
    lineHeight: '1.3',
    margin: 0,
  },

  experienceMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  experienceMetaItem: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },

  experienceMetaDot: {
    color: 'var(--color-n300)',
    fontSize: '12px',
  },

  experienceFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '10px',
  },

  experiencePrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '18px',
    color: 'var(--color-forest-green)',
  },

  experiencePricePer: {
    fontFamily: 'var(--font-body)',
    fontWeight: '400',
    fontSize: '12px',
    color: 'var(--color-n600)',
    marginLeft: '2px',
  },

  experienceBookBtn: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--color-forest-green)',
  },
}

function InlinePromoCard({ card, isPackage, isMobile }) {
  const href = isPackage ? `/packages/${card.slug}` : `/tours/${card.slug}`
  const title = isPackage ? card.name : card.title
  const image = isPackage ? card.heroImage : card.hero
  const typeLabel = isPackage ? 'Package' : 'Tour'
  const ctaLabel = isPackage ? 'View Package' : 'View Tour'

  return (
    <Link
      to={href}
      style={cardStyles.wrapper}
      className="card-lift"
      onClick={() => trackEvent('cta_click', { type: 'inline_card', card_slug: card.slug, card_type: isPackage ? 'package' : 'tour' })}
    >
      <div style={{ ...cardStyles.imageCol, width: isMobile ? '140px' : '260px', flexShrink: 0 }}>
        {image
          ? <img src={image} alt={title} loading="lazy" style={cardStyles.image} />
          : <div style={cardStyles.imagePlaceholder} />
        }
        {card.badge && <span style={cardStyles.badge}>{card.badge}</span>}
      </div>

      <div style={cardStyles.body}>
        <span style={cardStyles.typeTag}>{typeLabel}</span>
        <div style={cardStyles.ratingRow}>
          <Star size={12} color="var(--color-amber)" fill="var(--color-amber)" />
          <span style={cardStyles.ratingNum}>{card.rating}</span>
          <span style={cardStyles.ratingCount}>({card.reviews} reviews)</span>
        </div>
        <h3 style={{ ...cardStyles.title, fontSize: isMobile ? '15px' : '18px' }}>{title}</h3>
        <div style={cardStyles.metaRow}>
          <div style={cardStyles.metaItem}>
            <Clock size={12} color="var(--color-n600)" />
            <span style={cardStyles.metaText}>{card.duration}</span>
          </div>
          <div style={cardStyles.metaItem}>
            <Users size={12} color="var(--color-n600)" />
            <span style={cardStyles.metaText}>Max {card.groupSize}</span>
          </div>
        </div>
        <div style={cardStyles.footer}>
          <div style={cardStyles.priceBlock}>
            <span style={cardStyles.priceAmount}>€{card.price}</span>
            <span style={cardStyles.pricePer}>/person</span>
          </div>
          <div style={cardStyles.cta}>
            <span style={cardStyles.ctaText}>Book Now</span>
            <ArrowRight size={13} color="var(--color-n900)" />
          </div>
        </div>
      </div>
    </Link>
  )
}

const cardStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    textDecoration: 'none',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid var(--color-n300)',
    backgroundColor: 'var(--color-n000)',
    boxShadow: 'var(--shadow-sm)',
    margin: '32px 0',
    transition: 'transform var(--t-lift), box-shadow var(--t-lift)',
  },

  imageCol: {
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-mid-green)',
  },

  badge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '9px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '3px 8px',
    borderRadius: '4px',
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '4px',
  },

  priceBlock: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '3px',
  },

  priceAmount: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '18px',
    color: 'var(--color-forest-green)',
  },

  pricePer: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--color-n600)',
  },

  body: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },

  typeTag: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10px',
    color: 'var(--color-forest-green)',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
  },

  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  ratingNum: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-n900)',
  },

  ratingCount: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },

  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: 'var(--color-n900)',
    lineHeight: '1.25',
    margin: 0,
  },

  metaRow: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
  },

  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  metaText: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },

  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: 'var(--color-amber)',
    padding: '8px 14px',
    borderRadius: 'var(--radius)',
  },

  ctaText: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--color-n900)',
  },
}

export default BlogPost
