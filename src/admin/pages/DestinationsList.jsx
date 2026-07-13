import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../hooks/useToast'
import { copySlug } from '../utils/duplicate'

export default function DestinationsList() {
  const [items, setItems] = useState(null)
  const [err, setErr] = useState(null)
  const [q, setQ] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const nav = useNavigate()
  const toast = useToast()

  const load = () =>
    api.destinations
      .list()
      .then(setItems)
      .catch((e) => setErr(e.message))

  useEffect(() => {
    load()
  }, [])

  const confirmDelete = async () => {
    const { id, name } = pendingDelete
    setPendingDelete(null)
    try {
      await api.destinations.remove(id)
      toast.success(`Deleted “${name}”`)
      load()
    } catch (e) {
      toast.error(`Delete failed: ${e.message}`)
    }
  }

  const duplicate = async (d) => {
    try {
      const { id, ...rest } = d
      const created = await api.destinations.create({
        ...rest,
        slug: copySlug(d.slug, items.map((i) => i.slug)),
        name: `${d.name} (copy)`,
      })
      toast.success('Duplicated — you are editing the copy now')
      nav(`/admin/destinations/${created.id}`)
    } catch (e) {
      toast.error(`Duplicate failed: ${e.message}`)
    }
  }

  const filtered = useMemo(() => {
    if (!items) return null
    const query = q.trim().toLowerCase()
    const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    if (!query) return sorted
    return sorted.filter((d) =>
      [d.name, d.country, d.slug].filter(Boolean).some((v) => v.toLowerCase().includes(query)),
    )
  }, [items, q])

  if (err) return <div style={{ color: colors.danger }}>{err}</div>

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Destinations</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            {items == null ? 'Loading…' : `${items.length} region${items.length === 1 ? '' : 's'}`}
          </div>
        </div>
        <button style={s.btn} onClick={() => nav('/admin/destinations/new')}>+ New destination</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, country, slug…"
          style={s.searchInput}
        />
      </div>

      {items == null ? (
        <div style={s.emptyState}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>{q ? `No destinations match "${q}".` : 'No destinations yet.'}</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, width: 84 }}></th>
              <th style={s.th}>Region</th>
              <th style={{ ...s.th, width: 180 }}>Country</th>
              <th style={{ ...s.th, width: 90 }}>Featured</th>
              <th style={{ ...s.th, width: 160 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td style={{ ...s.td, padding: '10px 16px' }}>
                  <Thumb src={d.hero} alt={d.name} />
                </td>
                <td style={s.td}>
                  <Link to={`/admin/destinations/${d.id}`} style={{ color: colors.text, textDecoration: 'none', fontWeight: 600, fontSize: 14.5 }}>
                    {d.name || <em style={{ color: colors.textMuted }}>untitled</em>}
                  </Link>
                  <div style={{ marginTop: 4 }}>
                    <code style={{ fontSize: 11, color: colors.textMuted, fontFamily: 'ui-monospace, monospace' }}>
                      /destinations/{d.slug}
                    </code>
                  </div>
                </td>
                <td style={s.td}>{d.country && <span style={s.pillNeutral}>{d.country}</span>}</td>
                <td style={s.td}>{Array.isArray(d.featured) ? d.featured.length : 0}</td>
                <td style={s.td}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <a href={`/destinations/${d.slug}`} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }} title="Open public page">↗</a>
                    <button style={{ ...s.btn, ...s.btnGhost, padding: '6px 8px' }} title="Duplicate this destination" onClick={() => duplicate(d)}>⧉</button>
                    <Link to={`/admin/destinations/${d.id}`} style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>Edit</Link>
                    <button style={{ ...s.btn, ...s.btnGhost, color: colors.danger }} onClick={() => setPendingDelete({ id: d.id, name: d.name })}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete destination?"
        body={<>“{pendingDelete?.name}” will be removed from the site. This cannot be undone.</>}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

function Thumb({ src, alt }) {
  if (!src) {
    return <div style={{ width: 64, height: 44, borderRadius: 6, backgroundColor: colors.panelMuted, border: `1px solid ${colors.border}` }} />
  }
  return <img src={src} alt={alt || ''} style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 6, border: `1px solid ${colors.border}`, display: 'block' }} />
}
