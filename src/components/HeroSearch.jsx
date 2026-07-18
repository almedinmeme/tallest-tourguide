// HeroSearch.jsx
// The homepage hero's search + quick links: a prominent search bar with live
// tour/package/journal results, and a row of one-tap chips into the most
// searched-for places and themes. Enter (or the Search button) lands on
// /tours?search=… .

import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import tours from '../data/tours'
import { searchPackageLinks } from '../data/navigation'
import { posts } from '../data/journal'
import { SearchGroup, SearchResult } from './nav/SearchResults'
import { useCurrency } from '../context/CurrencyContext'

function match(query, ...fields) {
  const q = query.toLowerCase()
  return fields.some((f) => f && f.toLowerCase().includes(q))
}

const QUICK_LINKS = [
  { label: 'Sarajevo', href: '/tours?city=Sarajevo' },
  { label: 'Mostar', href: '/tours?city=Mostar' },
  { label: 'Day trips', href: '/tours?category=day-trips' },
  { label: 'Food & culture', href: '/tours?category=food-culture' },
  { label: 'War history', href: '/tours?category=history' },
  { label: 'Multi-day journeys', href: '/multi-day-tours' },
]

export default function HeroSearch({ isMobile = false }) {
  const { format } = useCurrency()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setFocused(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const q = query.trim()
  const tourResults = q ? tours.filter((t) => match(q, t.title, t.badge, t.duration, t.category, t.city)).slice(0, 4) : []
  const packageResults = q ? searchPackageLinks.filter((p) => match(q, p.name, p.meta)).slice(0, 3) : []
  const blogResults = q ? posts.filter((p) => match(q, p.title, p.excerpt, p.category)).slice(0, 2) : []
  const hasResults = tourResults.length + packageResults.length + blogResults.length > 0
  const open = focused && q.length > 0

  const submit = () => {
    if (!q) {
      navigate('/tours')
      return
    }
    // One clear winner → go straight to it; otherwise the filtered list.
    if (tourResults.length === 1 && packageResults.length === 0) navigate(`/tours/${tourResults[0].slug}`)
    else navigate(`/tours?search=${encodeURIComponent(q)}`)
  }

  return (
    <div ref={rootRef} style={{ width: '100%', maxWidth: isMobile ? '100%' : '520px' }}>
      {/* Search bar */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--color-n000)',
            borderRadius: '14px',
            padding: '6px 6px 6px 18px',
            boxShadow: focused
              ? '0 8px 32px rgba(0,0,0,0.35), 0 0 0 3px rgba(244,161,48,0.35)'
              : '0 8px 32px rgba(0,0,0,0.30)',
            transition: 'box-shadow 0.2s ease',
          }}
        >
          <Search size={17} color="var(--color-n600)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
              if (e.key === 'Escape') setFocused(false)
            }}
            placeholder={isMobile ? 'Where to? Try “Mostar”…' : 'Where to? Try “Mostar” or “food tour”…'}
            aria-label="Search tours and journeys"
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-n900)',
              padding: '8px 0',
            }}
          />
          <button
            type="button"
            onClick={submit}
            style={{
              flexShrink: 0,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: 'var(--color-amber)',
              color: 'var(--color-n900)',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '14px',
              padding: '11px 22px',
              borderRadius: '10px',
            }}
          >
            Search
          </button>
        </div>

        {/* Live results */}
        {open && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              backgroundColor: 'var(--color-n000)',
              borderRadius: '14px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
              // Capped to the viewport so the list scrolls internally instead
              // of running past the hero section's clipped bottom edge.
              maxHeight: 'min(300px, 26vh)',
              overflowY: 'auto',
              zIndex: 30,
              padding: '6px 0',
              textAlign: 'left',
            }}
          >
            {!hasResults && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--color-n600)',
                  padding: '14px 16px',
                  margin: 0,
                }}
              >
                No matches for “{q}” — press Enter to search all tours.
              </p>
            )}
            {tourResults.length > 0 && (
              <SearchGroup label="Day tours">
                {tourResults.map((t) => (
                  <SearchResult key={t.id} to={`/tours/${t.slug}`} title={t.title} meta={`${t.duration} · ${format(t.price)}`} />
                ))}
              </SearchGroup>
            )}
            {packageResults.length > 0 && (
              <SearchGroup label="Multi-day journeys">
                {packageResults.map((p) => (
                  <SearchResult key={p.slug} to={p.href} title={p.name} meta={p.price != null ? `${p.meta} · from ${format(p.price)}` : p.meta} />
                ))}
              </SearchGroup>
            )}
            {blogResults.length > 0 && (
              <SearchGroup label="From the Journal">
                {blogResults.map((p) => (
                  <SearchResult key={p.id} to={`/journal/${p.slug}`} title={p.title} meta={p.category || 'Journal'} />
                ))}
              </SearchGroup>
            )}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '14px',
          justifyContent: isMobile ? 'center' : 'flex-start',
        }}
      >
        {(isMobile ? QUICK_LINKS.slice(0, 4) : QUICK_LINKS).map((chip) => (
          <Link
            key={chip.label}
            to={chip.href}
            className="hero-chip"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.92)',
              textDecoration: 'none',
              padding: '7px 14px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255,255,255,0.13)',
              border: '1px solid rgba(255,255,255,0.28)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              whiteSpace: 'nowrap',
            }}
          >
            {chip.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
