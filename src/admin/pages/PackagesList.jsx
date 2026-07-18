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

export default function PackagesList() {
  const [items, setItems] = useState(null)
  const [err, setErr] = useState(null)
  const [q, setQ] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const nav = useNavigate()
  const toast = useToast()

  const load = () =>
    api.packages
      .list()
      .then(setItems)
      .catch((e) => setErr(e.message))

  useEffect(() => {
    load()
  }, [])

  // The JSON array order is what /packages and the homepage preview render.
  const canReorder = q.trim() === ''

  const duplicate = async (pkg) => {
    try {
      const { id, ...rest } = pkg
      const created = await api.packages.create({
        ...rest,
        slug: copySlug(pkg.slug, items.map((i) => i.slug)),
        name: `${pkg.name} (copy)`,
      })
      toast.success('Duplicated — you are editing the copy now')
      nav(`/admin/packages/${created.id}`)
    } catch (e) {
      toast.error(`Duplicate failed: ${e.message}`)
    }
  }

  const persistOrder = async (next) => {
    setItems(next)
    try {
      await api.packages.reorder(next.map((p) => p.id))
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
    const { id, name } = pendingDelete
    setPendingDelete(null)
    try {
      await api.packages.remove(id)
      toast.success(`Deleted “${name}”`)
      load()
    } catch (e) {
      toast.error(`Delete failed: ${e.message}`)
    }
  }

  const filtered = useMemo(() => {
    if (!items) return null
    const query = q.trim().toLowerCase()
    if (!query) return items
    return items.filter((p) =>
      [p.name, p.subtitle, p.slug, p.difficulty].filter(Boolean).some((s) => s.toLowerCase().includes(query)),
    )
  }, [items, q])

  if (err) return <div style={{ color: colors.danger }}>{err}</div>

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Packages</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            {items == null ? 'Loading…' : `${items.length} total${q ? ` · ${filtered.length} matching` : ''}`}
          </div>
        </div>
        <button style={s.btn} onClick={() => nav('/admin/packages/new')}>+ New package</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <SearchBox value={q} onChange={setQ} placeholder="Search packages by name, slug, difficulty…" />
        <span style={{ fontSize: 12.5, color: colors.textMuted }}>
          {canReorder ? 'Drag rows to set the order shown on /packages and the homepage.' : 'Clear the search to reorder packages.'}
        </span>
      </div>

      {items == null ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>
          {q ? `No packages match "${q}".` : 'No packages yet. Create your first one.'}
        </div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, width: 34 }}></th>
              <th style={{ ...s.th, width: 84 }}></th>
              <th style={s.th}>Package</th>
              <th style={{ ...s.th, width: 110 }}>Duration</th>
              <th style={{ ...s.th, width: 110 }}>Difficulty</th>
              <th style={{ ...s.th, width: 90 }}>Price</th>
              <th style={{ ...s.th, width: 210 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => {
              const cover = p.heroImage || p.hero
              const days = Array.isArray(p.days) ? p.days.length : null
              return (
                <tr key={p.id} {...(canReorder ? drag.rowProps(idx) : {})}>
                  <td style={{ ...s.td, padding: '10px 4px 10px 12px' }}>
                    <DragHandle disabled={!canReorder} title="Clear search to reorder" {...(canReorder ? drag.handleProps(idx) : {})} />
                  </td>
                  <td style={{ ...s.td, padding: '10px 16px' }}>
                    <Thumb src={cover} alt={p.name} />
                  </td>
                  <td style={s.td}>
                    <Link to={`/admin/packages/${p.id}`} style={{ color: colors.text, textDecoration: 'none', fontWeight: 600, fontSize: 14.5 }}>
                      {p.name || <em style={{ color: colors.textMuted }}>untitled</em>}
                    </Link>
                    {p.subtitle && (
                      <div style={{ color: colors.textMuted, fontSize: 12.5, marginTop: 2, maxWidth: 520, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.subtitle}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 5 }}>
                      <code style={{ fontSize: 11, color: colors.textMuted, fontFamily: 'ui-monospace, monospace' }}>
                        /multi-day-tours/{p.slug}
                      </code>
                      {p.badge && <span style={s.pill}>{p.badge}</span>}
                      {days != null && (
                        <span style={{ fontSize: 11, color: colors.textMuted }}>{days} day{days === 1 ? '' : 's'}</span>
                      )}
                    </div>
                  </td>
                  <td style={s.td}>{p.duration ? <span style={s.pillNeutral}>{p.duration}</span> : <span style={{ color: colors.textMuted }}>—</span>}</td>
                  <td style={s.td}>{p.difficulty ? <span style={s.pillNeutral}>{p.difficulty}</span> : <span style={{ color: colors.textMuted }}>—</span>}</td>
                  <td style={{ ...s.td, fontWeight: 600 }}>
                    {p.price != null ? `€${p.price}` : p.priceWithout != null ? `€${p.priceWithout}` : <span style={{ color: colors.textMuted }}>—</span>}
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
                      <a href={`/multi-day-tours/${p.slug}`} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }} title="Open public page">↗</a>
                      <button style={{ ...s.btn, ...s.btnGhost, padding: '6px 8px' }} title="Duplicate this package" onClick={() => duplicate(p)}>⧉</button>
                      <Link to={`/admin/packages/${p.id}`} style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>Edit</Link>
                      <button style={{ ...s.btn, ...s.btnGhost, color: colors.danger }} onClick={() => setPendingDelete({ id: p.id, name: p.name })}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete package?"
        body={<>“{pendingDelete?.name}” will be removed from the site and from <code>packages.json</code>. This cannot be undone.</>}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
