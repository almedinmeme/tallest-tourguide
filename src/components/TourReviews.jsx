// TourReviews.jsx
// Displays approved reviews for a specific tour/package.
// Shows average rating, review count, individual review cards,
// and the submission form below.

import { useState } from 'react'
import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import { useReviews } from '../hooks/useReviews'
import ReviewForm from './ReviewForm'

// Renders filled, half, and empty stars based on a numeric rating
function StarDisplay({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
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

function TourReviews({ tourId, tourName }) {
  const { reviews, loading, error } = useReviews(tourId)
  const [showForm, setShowForm] = useState(false)

  // Average rating
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={styles.wrapper}>

      {/* Section header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.sectionTitle}>Traveller Reviews</h2>
          {avgRating && (
            <div style={styles.avgRow}>
              <span style={styles.avgNumber}>{avgRating}</span>
              <StarDisplay rating={parseFloat(avgRating)} size={16} />
              <span style={styles.reviewCount}>
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {/* Toggle write review form */}
        <button
          onClick={() => setShowForm((v) => !v)}
          style={styles.writeBtn}
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Review submission form */}
      {showForm && (
        <ReviewForm tourId={tourId} tourName={tourName} />
      )}

      {/* Loading state */}
      {loading && (
        <div style={styles.loadingRow}>
          <span style={styles.loadingText}>Loading reviews…</span>
        </div>
      )}

      {/* Error state — silent fail, just show empty */}
      {!loading && error && (
        <p style={styles.emptyText}>Reviews unavailable right now.</p>
      )}

      {/* Empty state */}
      {!loading && !error && reviews.length === 0 && (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>
            No reviews yet. Be the first to share your experience.
          </p>
        </div>
      )}

      {/* Review cards */}
      {!loading && reviews.length > 0 && (
        <div style={styles.reviewList}>
          {reviews.map((r) => (
            <div key={r.id} style={styles.reviewCard}>

              {/* Top row — stars + date */}
              <div style={styles.cardTop}>
                <StarDisplay rating={r.rating} size={13} />
                {r.date && (
                  <span style={styles.reviewDate}>
                    {new Date(r.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              {/* Title */}
              {r.title && (
                <h4 style={styles.reviewTitle}>{r.title}</h4>
              )}

              {/* Review text */}
              <p style={styles.reviewText}>{r.review}</p>

              {/* Reviewer name */}
              <span style={styles.reviewerName}>— {r.name}</span>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid var(--color-n300)',
    marginBottom: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    margin: 0,
  },
  avgRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avgNumber: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '22px',
    color: 'var(--color-n900)',
    lineHeight: 1,
  },
  reviewCount: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },
  writeBtn: {
    height: '36px',
    padding: '0 18px',
    borderRadius: '100px',
    border: '1.5px solid var(--color-forest-green)',
    backgroundColor: 'transparent',
    color: 'var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
  loadingRow: {
    padding: '24px 0',
    textAlign: 'center',
  },
  loadingText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    fontStyle: 'italic',
  },
  emptyBox: {
    padding: '24px 0 8px 0',
  },
  emptyText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    margin: 0,
    lineHeight: '1.6',
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '8px',
  },
  reviewCard: {
    backgroundColor: 'var(--color-n100)',
    borderRadius: '10px',
    padding: '18px 20px',
    border: '1px solid var(--color-n300)',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  reviewDate: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },
  reviewTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    margin: '0 0 8px 0',
  },
  reviewText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: '0 0 12px 0',
  },
  reviewerName: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },
}

export default TourReviews