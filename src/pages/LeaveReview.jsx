import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, CheckCircle, ArrowLeft } from 'lucide-react'
import tours from '../data/tours'
import countries from '../data/countries'
import useWindowWidth from '../hooks/useWindowWidth'

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TABLE = 'Reviews'

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 1 }}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={36}
            color="var(--color-amber)"
            fill={star <= display ? 'var(--color-amber)' : 'none'}
            style={{ transition: 'fill 0.1s ease' }}
          />
        </button>
      ))}
    </div>
  )
}

function slugToTitle(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function LeaveReview() {
  const { slug } = useParams()
  const width = useWindowWidth()
  const isMobile = width <= 768
  const tour = tours.find((t) => t.slug === slug)
  const displayName = tour ? tour.title : slugToTitle(slug)
  const backPath = tour ? `/tours/${slug}` : `/packages/${slug}`

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [title, setTitle] = useState('')
  const [review, setReview] = useState('')
  const [rating, setRating] = useState(0)
  const [status, setStatus] = useState('idle')
  const [errorDetail, setErrorDetail] = useState('')

  const handleSubmit = async () => {
    if (!name.trim() || !review.trim() || rating === 0) {
      alert('Please fill in your name, review text, and a star rating.')
      return
    }

    setStatus('sending')
    setErrorDetail('')

    const payload = {
      fields: {
        Name: name.trim(),
        ...(country.trim() ? { Country: country.trim() } : {}),
        ...(title.trim() ? { Title: title.trim() } : {}),
        Review: review.trim(),
        Rating: Number(rating),
        TourId: tour ? Number(tour.id) : slug,
        TourName: displayName,
        Date: new Date().toISOString().slice(0, 10),
        Approved: true,
      },
    }

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
        const msg = data?.error?.message || data?.message || `HTTP ${res.status}`
        setErrorDetail(msg)
        throw new Error(msg)
      }

      setStatus('success')
    } catch (err) {
      console.error('LeaveReview submit error:', err)
      setStatus('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-n100)' }}>

      {/* Green header band */}
      <div style={styles.heroBand}>
        <div style={styles.heroInner}>
          <span style={styles.heroEyebrow}>Share your experience</span>
          <h1 style={styles.heroTitle}>{displayName}</h1>
        </div>
      </div>

      {/* Form card */}
      <div style={{ ...styles.cardWrap, padding: isMobile ? '24px 16px 48px' : '40px 24px 64px' }}>
        <div style={styles.card}>

          {status === 'success' ? (
            <div style={styles.successBox}>
              <div style={styles.successIcon}>
                <CheckCircle size={40} color="var(--color-forest-green)" />
              </div>
              <h2 style={styles.successTitle}>Thank you!</h2>
              <p style={styles.successText}>
                Your review has been submitted. We appreciate you taking the time to share your experience.
              </p>
              <Link to={backPath} style={styles.backLink}>
                <ArrowLeft size={14} />
                Back to {displayName}
              </Link>
            </div>
          ) : (
            <>
              <h2 style={styles.formTitle}>How was your tour?</h2>
              <p style={styles.formSubtitle}>
                Your honest feedback helps future travellers choose the right experience.
              </p>

              <div style={styles.field}>
                <label style={styles.label}>Your Rating <span style={styles.required}>*</span></label>
                <StarInput value={rating} onChange={setRating} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Your Name <span style={styles.required}>*</span></label>
                <input
                  type="text"
                  placeholder="Sarah M."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  className="booking-input"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Country <span style={styles.optional}>(optional)</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{ ...styles.input, color: country ? 'var(--color-n900)' : 'var(--color-n600)' }}
                  className="booking-input"
                >
                  <option value="">Select your country…</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Review Title <span style={styles.optional}>(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Best tour in Sarajevo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={styles.input}
                  className="booking-input"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Your Review <span style={styles.required}>*</span></label>
                <textarea
                  placeholder="Tell future travellers what made this experience special..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={5}
                  style={styles.textarea}
                  className="booking-input"
                />
              </div>

              {status === 'error' && (
                <div style={styles.errorBox}>
                  <p style={styles.errorText}>
                    Something went wrong. Please try again or contact us directly.
                  </p>
                  {errorDetail && <p style={styles.errorDetail}>{errorDetail}</p>}
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
                className="btn-lift btn-glow-amber"
              >
                {status === 'sending' ? 'Submitting…' : 'Submit My Review'}
              </button>

            </>
          )}

        </div>
      </div>

    </div>
  )
}

const styles = {
  heroBand: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '48px 24px 52px',
    textAlign: 'center',
  },
  heroInner: {
    maxWidth: '560px',
    margin: '0 auto',
  },
  heroEyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  heroTitle: {
    fontFamily: 'var(--font-hero)',
    fontWeight: '700',
    fontSize: '32px',
    color: '#fff',
    margin: 0,
    lineHeight: 1.25,
  },
  cardWrap: {
    maxWidth: '560px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '36px 32px',
    boxShadow: 'var(--shadow-md)',
  },
  formTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '22px',
    color: 'var(--color-n900)',
    marginBottom: '6px',
  },
  formSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    lineHeight: '1.6',
    marginBottom: '28px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },
  required: {
    color: 'var(--color-error)',
    marginLeft: '2px',
  },
  optional: {
    fontWeight: '400',
    color: 'var(--color-n600)',
    fontSize: '12px',
    marginLeft: '4px',
  },
  input: {
    height: '44px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '0 14px',
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
    padding: '12px 14px',
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
    height: '48px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    border: 'none',
    marginTop: '4px',
  },
  disclaimer: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
    textAlign: 'center',
    marginTop: '14px',
  },
  errorBox: {
    marginBottom: '12px',
    padding: '12px 14px',
    backgroundColor: 'rgba(229,62,62,0.06)',
    borderRadius: 'var(--radius)',
    border: '1px solid rgba(229,62,62,0.2)',
  },
  errorText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-error)',
    margin: 0,
  },
  errorDetail: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--color-n600)',
    margin: '4px 0 0',
    fontStyle: 'italic',
  },
  successBox: {
    textAlign: 'center',
    padding: '16px 0',
  },
  successIcon: {
    marginBottom: '16px',
  },
  successTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '24px',
    color: 'var(--color-n900)',
    marginBottom: '10px',
  },
  successText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },
}

export default LeaveReview
