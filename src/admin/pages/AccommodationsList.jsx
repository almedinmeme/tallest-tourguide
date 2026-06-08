import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'

const TYPE_LABEL = {
  homestay: 'Homestay',
  agrotourism: 'Agrotourism',
  'boutique-hotel': 'Boutique hotel',
}

export default function AccommodationsList() {
  const [items, setItems] = useState(null)
  const [err, setErr] = useState(null)
  const [q, setQ] = useState('')
  const nav = useNavigate()

  const load = () =>
    api.accommodations
      .list()
      .then(setItems)
      .catch((e) => setErr(e.message))

  useEffect(() => {
    load()
  }, [])

  const onDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await api.accommodations.remove(id)
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  const filtered = useMemo(() => {
    if (!items) return null
    const query = q.trim().toLowerCase()
    const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    if (!query) return sorted
    return sorted.filter((a) =>
      [a.name, a.location, a.country, a.slug].filter(Boolean).some((v) => v.toLowerCase().includes(query)),
    )
  }, [items, q])

  if (err) return <div style={{ color: colors.danger }}>{err}</div>

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Accommodations</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            {items == null ? 'Loading…' : `${items.length} propert${items.length === 1 ? 'y' : 'ies'}`}
          </div>
        </div>
        <button style={s.btn} onClick={() => nav('/admin/accommodations/new')}>+ New accommodation</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, location, country…"
          style={s.searchInput}
        />
      </div>

      {items == null ? (
        <div style={s.emptyState}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>{q ? `No accommodations match "${q}".` : 'No accommodations yet.'}</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, width: 84 }}></th>
              <th style={s.th}>Property</th>
              <th style={{ ...s.th, width: 140 }}>Type</th>
              <th style={{ ...s.th, width: 200 }}>Location</th>
              <th style={{ ...s.th, width: 130 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td style={{ ...s.td, padding: '10px 16px' }}>
                  <Thumb src={a.image} alt={a.name} />
                </td>
                <td style={s.td}>
                  <Link to={`/admin/accommodations/${a.id}`} style={{ color: colors.text, textDecoration: 'none', fontWeight: 600, fontSize: 14.5 }}>
                    {a.name || <em style={{ color: colors.textMuted }}>untitled</em>}
                  </Link>
                </td>
                <td style={s.td}>{a.type && <span style={s.pillNeutral}>{TYPE_LABEL[a.type] || a.type}</span>}</td>
                <td style={s.td}>{a.location}{a.country ? <span style={{ color: colors.textMuted }}> · {a.country}</span> : null}</td>
                <td style={s.td}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <Link to={`/admin/accommodations/${a.id}`} style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>Edit</Link>
                    <button style={{ ...s.btn, ...s.btnGhost, color: colors.danger }} onClick={() => onDelete(a.id, a.name)}>Delete</button>
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

function Thumb({ src, alt }) {
  if (!src) {
    return <div style={{ width: 64, height: 44, borderRadius: 6, backgroundColor: colors.panelMuted, border: `1px solid ${colors.border}` }} />
  }
  return <img src={src} alt={alt || ''} style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 6, border: `1px solid ${colors.border}`, display: 'block' }} />
}
