import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import { SearchBox, Thumb, SkeletonRows } from '../components/ListChrome'
import DragHandle from '../components/DragHandle'
import RowActions from '../components/RowActions'
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
        <div style={s.tableWrap}>
        {/* Fixed layout — see ToursList: columns are sized here so a long slug
            or subtitle truncates instead of widening the page. */}
        <table style={{ ...s.table, tableLayout: 'fixed', minWidth: 830 }}>
          <colgroup>
            <col style={{ width: 34 }} />
            <col style={{ width: 84 }} />
            <col />
            <col style={{ width: 110 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 210 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={s.th}></th>
              <th style={s.th}></th>
              <th style={s.th}>Package</th>
              <th style={s.th}>Duration</th>
              <th style={s.th}>Difficulty</th>
              <th style={s.th}>Price</th>
              <th style={s.th}></th>
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
                  <td style={{ ...s.td, overflow: 'hidden' }}>
                    <Link to={`/admin/packages/${p.id}`} style={{ color: colors.text, textDecoration: 'none', fontWeight: 600, fontSize: 14.5, overflowWrap: 'anywhere' }}>
                      {p.name || <em style={{ color: colors.textMuted }}>untitled</em>}
                    </Link>
                    {p.subtitle && (
                      <div title={p.subtitle} style={{ color: colors.textMuted, fontSize: 12.5, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.subtitle}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 5, minWidth: 0 }}>
                      <code
                        title={`/multi-day-tours/${p.slug}`}
                        style={{ fontSize: 11, color: colors.textMuted, fontFamily: 'ui-monospace, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        /multi-day-tours/{p.slug}
                      </code>
                      {p.badge && <span style={{ ...s.pill, flexShrink: 0 }}>{p.badge}</span>}
                      {days != null && (
                        <span style={{ fontSize: 11, color: colors.textMuted, flexShrink: 0 }}>{days} day{days === 1 ? '' : 's'}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ ...s.td, overflow: 'hidden' }}>{p.duration ? <span style={s.pillNeutral}>{p.duration}</span> : <span style={{ color: colors.textMuted }}>—</span>}</td>
                  <td style={{ ...s.td, overflow: 'hidden' }}>{p.difficulty ? <span style={s.pillNeutral}>{p.difficulty}</span> : <span style={{ color: colors.textMuted }}>—</span>}</td>
                  <td style={{ ...s.td, fontWeight: 600 }}>
                    {p.price != null ? `€${p.price}` : p.priceWithout != null ? `€${p.priceWithout}` : <span style={{ color: colors.textMuted }}>—</span>}
                  </td>
                  <td style={s.td}>
                    <RowActions
                      name={p.name}
                      noun="package"
                      editTo={`/admin/packages/${p.id}`}
                      viewHref={`/multi-day-tours/${p.slug}`}
                      onDuplicate={() => duplicate(p)}
                      onDelete={() => setPendingDelete({ id: p.id, name: p.name })}
                      onMoveUp={() => move(idx, -1)}
                      onMoveDown={() => move(idx, 1)}
                      canMoveUp={canReorder && idx > 0}
                      canMoveDown={canReorder && idx < filtered.length - 1}
                      reorderHint={canReorder ? undefined : 'Clear the search to reorder'}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
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
