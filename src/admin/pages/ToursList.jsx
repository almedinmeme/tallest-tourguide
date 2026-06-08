import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'

export default function ToursList() {
  const [items, setItems] = useState(null)
  const [err, setErr] = useState(null)
  const [q, setQ] = useState('')
  const nav = useNavigate()

  const load = () =>
    api.tours
      .list()
      .then(setItems)
      .catch((e) => setErr(e.message))

  useEffect(() => {
    load()
  }, [])

  const onDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await api.tours.remove(id)
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  const filtered = useMemo(() => {
    if (!items) return null
    const query = q.trim().toLowerCase()
    if (!query) return items
    return items.filter((t) =>
      [t.title, t.subtitle, t.slug, t.category].filter(Boolean).some((s) => s.toLowerCase().includes(query)),
    )
  }, [items, q])

  if (err) return <div style={{ color: colors.danger }}>{err}</div>

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Tours</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            {items == null ? 'Loading…' : `${items.length} total${q ? ` · ${filtered.length} matching` : ''}`}
          </div>
        </div>
        <button style={s.btn} onClick={() => nav('/admin/tours/new')}>+ New tour</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <SearchBox value={q} onChange={setQ} placeholder="Search tours by title, slug, category…" />
      </div>

      {items == null ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>
          {q ? `No tours match "${q}".` : 'No tours yet. Create your first one.'}
        </div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, width: 84 }}></th>
              <th style={s.th}>Tour</th>
              <th style={{ ...s.th, width: 130 }}>Category</th>
              <th style={{ ...s.th, width: 90 }}>Price</th>
              <th style={{ ...s.th, width: 90 }}>Rating</th>
              <th style={{ ...s.th, width: 160 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td style={{ ...s.td, padding: '10px 16px' }}>
                  <Thumb src={t.hero} alt={t.title} />
                </td>
                <td style={s.td}>
                  <Link to={`/admin/tours/${t.id}`} style={{ color: colors.text, textDecoration: 'none', fontWeight: 600, fontSize: 14.5 }}>
                    {t.title || <em style={{ color: colors.textMuted }}>untitled</em>}
                  </Link>
                  {t.subtitle && (
                    <div style={{ color: colors.textMuted, fontSize: 12.5, marginTop: 2, maxWidth: 520, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.subtitle}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 5 }}>
                    <code style={{ fontSize: 11, color: colors.textMuted, fontFamily: 'ui-monospace, monospace' }}>
                      /tours/{t.slug}
                    </code>
                    {t.badge && <span style={s.pill}>{t.badge}</span>}
                  </div>
                </td>
                <td style={s.td}>{t.category && <span style={s.pillNeutral}>{t.category}</span>}</td>
                <td style={{ ...s.td, fontWeight: 600 }}>{t.price != null ? `€${t.price}` : <span style={{ color: colors.textMuted }}>—</span>}</td>
                <td style={s.td}>
                  {t.rating ? (
                    <span style={{ fontSize: 13 }}>
                      <span style={{ color: colors.accent }}>★</span> {t.rating}
                      <span style={{ color: colors.textMuted, marginLeft: 4 }}>({t.reviews ?? 0})</span>
                    </span>
                  ) : (
                    <span style={{ color: colors.textMuted }}>—</span>
                  )}
                </td>
                <td style={s.td}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <a href={`/tours/${t.slug}`} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }} title="Open public page">↗</a>
                    <Link to={`/admin/tours/${t.id}`} style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>Edit</Link>
                    <button style={{ ...s.btn, ...s.btnGhost, color: colors.danger }} onClick={() => onDelete(t.id, t.title)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div style={{ position: 'relative', flex: '0 0 auto' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={s.searchInput}
      />
    </div>
  )
}

function Thumb({ src, alt }) {
  if (!src) {
    return (
      <div
        style={{
          width: 64,
          height: 44,
          borderRadius: 6,
          backgroundColor: colors.panelMuted,
          border: `1px solid ${colors.border}`,
        }}
      />
    )
  }
  return (
    <img
      src={src}
      alt={alt || ''}
      style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 6, border: `1px solid ${colors.border}`, display: 'block' }}
    />
  )
}

function SkeletonRows() {
  return (
    <div style={{ ...s.card, padding: 0 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 16px', borderBottom: i < 3 ? `1px solid ${colors.border}` : 'none' }}>
          <div style={{ ...s.skeleton, width: 64, height: 44 }} />
          <div style={{ flex: 1 }}>
            <div style={{ ...s.skeleton, width: '40%', height: 14, marginBottom: 6 }} />
            <div style={{ ...s.skeleton, width: '60%', height: 11 }} />
          </div>
        </div>
      ))}
    </div>
  )
}
