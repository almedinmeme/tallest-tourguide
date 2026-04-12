// ReviewForm.jsx
// Star rating + review submission form.
// Submits directly to Airtable. Approved defaults to false (unchecked).
// You tick Approved in Airtable → review appears on site instantly.

import { useState } from 'react'
import { Star } from 'lucide-react'

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TABLE = 'Reviews'

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            lineHeight: 1,
          }}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={28}
            color="var(--color-amber)"
            fill={star <= display ? 'var(--color-amber)' : 'none'}
            style={{ transition: 'fill 0.1s ease' }}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewForm({ tourId, tourName }) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [review, setReview] = useState('')
  const [rating, setRating] = useState(0)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorDetail, setErrorDetail] = useState('')

  const handleSubmit = async () => {
    // Temporary debug — add before the POST fetch

    if (!name.trim() || !review.trim() || rating === 0) {
      alert('Please fill in your name, review, and select a star rating.')
      return
    }

    setStatus('sending')
    setErrorDetail('')

    // Airtable requires the table name to be URL-encoded if it has spaces.
    // Checkbox fields: omit the field entirely rather than sending false —
    // Airtable treats a missing checkbox as unchecked automatically.
    const payload = {
      fields: {
        Name: name.trim(),
        Title: title.trim() || undefined,
        Review: review.trim(),
        Rating: Number(rating),
        TourId: Number(tourId),
        TourName: tourName,
        Date: new Date().toISOString().slice(0, 10),
        // Approved is intentionally omitted — Airtable defaults checkbox to false
      },
    }

    // Remove undefined fields (Title if empty)
    Object.keys(payload.fields).forEach(
      (k) => payload.fields[k] === undefined && delete payload.fields[k]
    )

    try {
      const res = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        // Log full Airtable error to console for debugging
        console.error('Airtable error response:', data)
        const msg = data?.error?.message || data?.message || `HTTP ${res.status}`
        setErrorDetail(msg)
        throw new Error(msg)
      }

      setStatus('success')
    } catch (err) {
      console.error('ReviewForm submit error:', err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={styles.successBox}>
        <div style={styles.successStar}>
          <Star size={36} color="var(--color-amber)" fill="var(--color-amber)" />
        </div>
        <h4 style={styles.successTitle}>Thank you for your review!</h4>
        <p style={styles.successText}>
          Your review is being verified and will appear here shortly.
        </p>
      </div>
    )
  }

  return (
    <div style={styles.formWrapper}>
      <h3 style={styles.formTitle}>Share Your Experience</h3>
      <p style={styles.formSubtitle}>
        Travelled with us? We'd love to hear about it.
      </p>

      <div style={styles.field}>
        <label style={styles.label}>Your Rating</label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Your Name</label>
        <input
          type="text"
          placeholder="Sarah M."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Review Title</label>
        <input
          type="text"
          placeholder="Best tour in Sarajevo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Your Review</label>
        <textarea
          placeholder="Tell future travellers what made this experience special..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          style={styles.textarea}
        />
      </div>

      {status === 'error' && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>
            Something went wrong. Please try again or contact us directly.
          </p>
          {errorDetail && (
            <p style={styles.errorDetail}>{errorDetail}</p>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={status === 'sending'}
        style={{
          ...styles.submitBtn,
          opacity: status === 'sending' ? 0.7 : 1,
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'sending' ? 'Submitting…' : 'Submit Review'}
      </button>
    </div>
  )
}

const styles = {
  formWrapper: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    padding: '28px',
    border: '1px solid var(--color-n300)',
    marginTop: '8px',
  },
  formTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '6px',
  },
  formSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },
  input: {
    height: '44px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '0 12px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  },
  textarea: {
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '12px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    lineHeight: '1.6',
    outline: 'none',
  },
  submitBtn: {
    width: '100%',
    height: '44px',
    backgroundColor: 'var(--color-forest-green)',
    color: '#fff',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    border: 'none',
    marginTop: '8px',
  },
  errorBox: {
    marginBottom: '8px',
  },
  errorText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-error)',
    margin: '0 0 4px 0',
  },
  errorDetail: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--color-n600)',
    margin: 0,
    fontStyle: 'italic',
  },
  successBox: {
    backgroundColor: 'rgba(56,161,105,0.06)',
    border: '1px solid rgba(56,161,105,0.2)',
    borderRadius: '12px',
    padding: '32px 24px',
    textAlign: 'center',
    marginTop: '8px',
  },
  successStar: {
    marginBottom: '12px',
    lineHeight: 1,
  },
  successTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '8px',
  },
  successText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: '1.6',
    margin: 0,
  },
}

export default ReviewForm