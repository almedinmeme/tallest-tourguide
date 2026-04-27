import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight } from 'lucide-react'
import { useBlog } from '../hooks/useBlog'
import tours from '../data/tours'

const packages = [
  {
    slug: 'sarajevo-essential',
    name: '3-Day Complete Sarajevo Experience: Let us show you our home',
    subtitle: 'Stories, Survival & Soul',
    description: '3 days · From €99',
    href: '/packages/sarajevo-essential',
  },
  {
    slug: 'bosnia-deep-dive',
    name: 'Bosnia Deep Dive',
    subtitle: 'Real Bosnia, Deeply Experienced',
    description: '5 days · From €759',
    href: '/packages/bosnia-deep-dive',
  },
  {
    slug: 'personalised',
    name: 'Personalised Tour Package',
    subtitle: 'Built entirely around you',
    description: 'Custom duration · Custom price',
    href: '/personalised',
  },
]

function match(query, ...fields) {
  const q = query.toLowerCase()
  return fields.some((f) => f && f.toLowerCase().includes(q))
}

function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const { posts } = useBlog()

  // Focus input when modal opens, clear query when it closes
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [open])

  // ESC closes modal
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const q = query.trim()

  const tourResults = q
    ? tours.filter((t) => match(q, t.title, t.badge, t.duration, t.subtitle))
    : []

  const packageResults = q
    ? packages.filter((p) => match(q, p.name, p.subtitle, p.description))
    : []

  const blogResults = q
    ? posts.filter((p) => match(q, p.title, p.excerpt, p.category))
    : []

  const hasResults = tourResults.length + packageResults.length + blogResults.length > 0
  const hasQuery = q.length > 0

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Search input row */}
        <div style={styles.inputRow}>
          <Search size={18} color="var(--color-n600)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tours, packages, blog posts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close search">
            <X size={18} color="var(--color-n600)" />
          </button>
        </div>

        {/* Results */}
        <div style={styles.results}>

          {/* Empty prompt */}
          {!hasQuery && (
            <p style={styles.hint}>
              Start typing to search across all tours, packages and blog posts.
            </p>
          )}

          {/* No results */}
          {hasQuery && !hasResults && (
            <p style={styles.noResults}>
              No results for "<strong>{q}</strong>"
            </p>
          )}

          {/* Tours */}
          {tourResults.length > 0 && (
            <ResultGroup label="Tours">
              {tourResults.map((tour) => (
                <ResultItem
                  key={tour.id}
                  to={`/tours/${tour.slug}`}
                  title={tour.title}
                  meta={`${tour.duration} · €${tour.price}`}
                  onClose={onClose}
                />
              ))}
            </ResultGroup>
          )}

          {/* Packages */}
          {packageResults.length > 0 && (
            <ResultGroup label="Multi-day tours">
              {packageResults.map((pkg) => (
                <ResultItem
                  key={pkg.slug}
                  to={pkg.href}
                  title={pkg.name}
                  meta={pkg.description}
                  onClose={onClose}
                />
              ))}
            </ResultGroup>
          )}

          {/* Blog */}
          {blogResults.length > 0 && (
            <ResultGroup label="Blog Posts">
              {blogResults.map((post) => (
                <ResultItem
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  title={post.title}
                  meta={post.category || 'Blog'}
                  onClose={onClose}
                />
              ))}
            </ResultGroup>
          )}

        </div>
      </div>
    </div>
  )
}

function ResultGroup({ label, children }) {
  return (
    <div style={styles.group}>
      <span style={styles.groupLabel}>{label}</span>
      <div style={styles.groupItems}>{children}</div>
    </div>
  )
}

function ResultItem({ to, title, meta, onClose }) {
  return (
    <Link to={to} style={styles.resultItem} onClick={onClose} className="search-result-item">
      <div style={styles.resultText}>
        <span style={styles.resultTitle}>{title}</span>
        <span style={styles.resultMeta}>{meta}</span>
      </div>
      <ArrowRight size={15} color="var(--color-forest-green)" style={{ flexShrink: 0 }} />
    </Link>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(10, 20, 15, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 500,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '80px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },

  modal: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '600px',
    overflow: 'hidden',
    border: '1px solid var(--color-n300)',
  },

  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderBottom: '1px solid var(--color-n300)',
  },

  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n900)',
    backgroundColor: 'transparent',
  },

  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    flexShrink: 0,
  },

  results: {
    maxHeight: '420px',
    overflowY: 'auto',
    padding: '8px 0',
  },

  hint: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    textAlign: 'center',
    padding: '32px 20px',
    margin: 0,
  },

  noResults: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    textAlign: 'center',
    padding: '32px 20px',
    margin: 0,
  },

  group: {
    padding: '8px 0',
  },

  groupLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10px',
    color: 'var(--color-n600)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    padding: '4px 20px 6px',
  },

  groupItems: {
    display: 'flex',
    flexDirection: 'column',
  },

  resultItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '10px 20px',
    textDecoration: 'none',
    transition: 'background-color 0.15s ease',
  },

  resultText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    minWidth: 0,
  },

  resultTitle: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  resultMeta: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },
}

export default SearchModal
