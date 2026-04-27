import { useState } from 'react'
import { Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useReviews } from '../hooks/useReviews'

const cardBgs = [
  'var(--color-n000)',
  '#f0f7f4',
  '#fdf8f0',
  '#f5f5f7',
  '#f0f5f9',
]

function StarDisplay({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          color="var(--color-amber)"
          fill={star <= Math.round(rating) ? 'var(--color-amber)' : 'none'}
        />
      ))}
    </div>
  )
}

function avatarColor(name) {
  const colors = [
    '#2E7D5E', '#4AA880', '#1A3D2B', '#3D5A52',
    '#5B8A70', '#2A6B53', '#1E5C45', '#447A64',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function ReviewCard({ r, index }) {
  return (
    <div style={{
      ...styles.card,
      backgroundColor: cardBgs[index % cardBgs.length],
    }}>
      {r.title && <p style={styles.cardTitle}>{r.title}</p>}

      <p style={styles.cardText}>{r.review}</p>

      <div style={styles.cardFooter}>
        <div style={styles.footerLeft}>
          <div
            style={{
              ...styles.avatar,
              backgroundColor: avatarColor(r.name),
            }}
          >
            {r.name.charAt(0).toUpperCase()}
          </div>
          <div style={styles.footerMeta}>
            <span style={styles.reviewerName}>
              {r.name}{r.country ? `, ${r.country}` : ''}
            </span>
            <StarDisplay rating={r.rating} size={12} />
          </div>
        </div>
        {r.date && (
          <span style={styles.reviewDate}>
            {new Date(r.date).toLocaleDateString('en-GB', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )}
      </div>
    </div>
  )
}

function TourReviews({ tourId, tourName, tourSlug }) {
  const { reviews, loading, error } = useReviews(tourId)
  const [showAll, setShowAll] = useState(false)

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const visible = showAll ? reviews : reviews.slice(0, 3)

  return (
    <div style={styles.wrapper}>

      {/* Summary row */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryLeft}>
          <h2 style={styles.sectionTitle}>What travellers say</h2>
          {avgRating && (
            <div style={styles.ratingRow}>
              <span style={styles.bigRating}>{avgRating}</span>
              <div style={styles.ratingMeta}>
                <StarDisplay rating={parseFloat(avgRating)} size={18} />
                <span style={styles.reviewCount}>
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>
          )}
        </div>
        {tourSlug && (
          <Link to={`/review/${tourSlug}`} style={styles.leaveBtn} className="btn-lift btn-glow-amber">
            Leave a review
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <p style={styles.mutedText}>Loading reviews…</p>
      )}

      {/* Error */}
      {!loading && error && (
        <p style={styles.mutedText}>Reviews unavailable right now.</p>
      )}

      {/* Empty */}
      {!loading && !error && reviews.length === 0 && (
        <div style={styles.emptyBox}>
          <p style={styles.mutedText}>
            No reviews yet — be the first to share your experience.
          </p>
        </div>
      )}

      {/* Cards */}
      {!loading && reviews.length > 0 && (
        <>
          <div style={styles.cardList}>
            {visible.map((r, i) => (
              <ReviewCard key={r.id} r={r} index={i} />
            ))}
          </div>

          {reviews.length > 3 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              style={styles.showAllBtn}
            >
              {showAll
                ? 'Show fewer reviews'
                : `Show all ${reviews.length} reviews`}
            </button>
          )}
        </>
      )}

    </div>
  )
}

const styles = {
  wrapper: {
    marginBottom: '16px',
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  summaryLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '22px',
    color: 'var(--color-n900)',
    margin: 0,
    letterSpacing: '-0.2px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  bigRating: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '42px',
    color: 'var(--color-n900)',
    lineHeight: 1,
  },
  ratingMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  reviewCount: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },
  leaveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '40px',
    padding: '0 20px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius-pill)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    borderRadius: '12px',
    border: '1px solid var(--color-n200)',
    padding: '20px',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '15px',
    color: 'var(--color-n900)',
    margin: '0 0 6px 0',
  },
  cardText: {
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--color-n600)',
    lineHeight: '1.7',
    margin: '0 0 16px 0',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '13px',
    flexShrink: 0,
  },
  footerMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  reviewerName: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--color-n900)',
  },
  reviewDate: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },
  emptyBox: {
    padding: '8px 0',
  },
  mutedText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    fontStyle: 'italic',
    lineHeight: '1.6',
    margin: 0,
  },
  showAllBtn: {
    display: 'block',
    margin: '20px auto 0',
    height: '36px',
    padding: '0 20px',
    borderRadius: 'var(--radius-pill)',
    border: '1.5px solid var(--color-n300)',
    backgroundColor: 'transparent',
    color: 'var(--color-n600)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    cursor: 'pointer',
    transition: 'border-color var(--t-fast), color var(--t-fast)',
  },
}

export default TourReviews
