import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import { SearchBox, Thumb, SkeletonRows } from '../components/ListChrome'
import DragHandle from '../components/DragHandle'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../hooks/useToast'
import { useListDrag } from '../hooks/useListDrag'
import { copySlug } from '../utils/duplicate'

export default function ToursList() {
  const [items, setItems] = useState(null)
  const [err, setErr] = useState(null)
  const [q, setQ] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const nav = useNavigate()
  const toast = useToast()

  const load = () =>
    api.tours
      .list()
      .then(setItems)
      .catch((e) => setErr(e.message))

  useEffect(() => {
    load()
  }, [])

  // The JSON array order is exactly what /tours and the homepage render, so
  // reordering here is the site-wide ordering control.
  const canReorder = q.trim() === ''

  const persistOrder = async (next) => {
    setItems(next)
    try {
      await api.tours.reorder(next.map((t) => t.id))
      toast.success('Order saved — this is the order shown on the site')
    } catch (e) {
      toast.error(`Couldn't save the new order: ${e.message}`)
      load()
    }
  }

  const drag = useListDrag(items || [], persistOrder)

  const move = (idx, dir) => {
    const target = idx + dir
    if (!items || target < 0 || target >= items.length) return
    const next = items.slice()
    const [it] = next.splice(idx, 1)
    next.splice(target, 0, it)
    persistOrder(next)
  }

  const confirmDelete = async () => {
    const { id, title } = pendingDelete
    setPendingDelete(null)
    try {
      await api.tours.remove(id)
      toast.success(`Deleted “${title}”`)
      load()
    } catch (e) {
      toast.error(`Delete failed: ${e.message}`)
    }
  }

  const duplicate = async (t) => {
    try {
      const { id, ...rest } = t
      const created = await api.tours.create({
        ...rest,
        slug: copySlug(t.slug, items.map((i) => i.slug)),
        title: `${t.title} (copy)`,
      })
      toast.success('Duplicated — you are editing the copy now')
      nav(`/admin/tours/${created.id}`)
    } catch (e) {
      toast.error(`Duplicate failed: ${e.message}`)
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
        <span style={{ fontSize: 12.5, color: colors.textMuted }}>
          {canReorder ? 'Drag rows to set the order shown on /tours and the homepage.' : 'Clear the search to reorder tours.'}
        </span>
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
              <th style={{ ...s.th, width: 34 }}></th>
              <th style={{ ...s.th, width: 84 }}></th>
              <th style={s.th}>Tour</th>
              <th style={{ ...s.th, width: 130 }}>Category</th>
              <th style={{ ...s.th, width: 90 }}>Price</th>
              <th style={{ ...s.th, width: 90 }}>Rating</th>
              <th style={{ ...s.th, width: 210 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => (
              <tr key={t.id} {...(canReorder ? drag.rowProps(idx) : {})}>
                <td style={{ ...s.td, padding: '10px 4px 10px 12px' }}>
                  <DragHandle disabled={!canReorder} title="Clear search to reorder" {...(canReorder ? drag.handleProps(idx) : {})} />
                </td>
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
                    <button
                      style={{ ...s.btn, ...s.btnGhost, padding: '6px 8px' }}
                      title="Move up"
                      disabled={!canReorder || idx === 0}
                      onClick={() => move(idx, -1)}
                    >↑</button>
                    <button
                      style={{ ...s.btn, ...s.btnGhost, padding: '6px 8px' }}
                      title="Move down"
                      disabled={!canReorder || idx === filtered.length - 1}
                      onClick={() => move(idx, 1)}
                    >↓</button>
                    <a href={`/tours/${t.slug}`} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }} title="Open public page">↗</a>
                    <button style={{ ...s.btn, ...s.btnGhost, padding: '6px 8px' }} title="Duplicate this tour" onClick={() => duplicate(t)}>⧉</button>
                    <Link to={`/admin/tours/${t.id}`} style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>Edit</Link>
                    <button style={{ ...s.btn, ...s.btnGhost, color: colors.danger }} onClick={() => setPendingDelete({ id: t.id, title: t.title })}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete tour?"
        body={<>“{pendingDelete?.title}” will be removed from the site and from <code>tours.json</code>. This cannot be undone.</>}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
