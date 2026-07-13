import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../hooks/useToast'
import { copySlug } from '../utils/duplicate'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function JournalList() {
  const [items, setItems] = useState(null)
  const [err, setErr] = useState(null)
  const [q, setQ] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const nav = useNavigate()
  const toast = useToast()

  const load = () =>
    api.journal
      .list()
      .then(setItems)
      .catch((e) => setErr(e.message))

  useEffect(() => {
    load()
  }, [])

  const confirmDelete = async () => {
    const { id, title } = pendingDelete
    setPendingDelete(null)
    try {
      await api.journal.remove(id)
      toast.success(`Deleted “${title}”`)
      load()
    } catch (e) {
      toast.error(`Delete failed: ${e.message}`)
    }
  }

  // Copies start as drafts so a half-edited duplicate never leaks onto the
  // live journal.
  const duplicate = async (post) => {
    try {
      const { id, ...rest } = post
      const created = await api.journal.create({
        ...rest,
        slug: copySlug(post.slug, items.map((i) => i.slug)),
        title: `${post.title} (copy)`,
        published: false,
      })
      toast.success('Duplicated as a draft — you are editing the copy now')
      nav(`/admin/journal/${created.id}`)
    } catch (e) {
      toast.error(`Duplicate failed: ${e.message}`)
    }
  }

  const filtered = useMemo(() => {
    if (!items) return null
    const query = q.trim().toLowerCase()
    const sorted = [...items].sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''))
    if (!query) return sorted
    return sorted.filter((p) =>
      [p.title, p.category, p.slug].filter(Boolean).some((v) => v.toLowerCase().includes(query)),
    )
  }, [items, q])

  if (err) return <div style={{ color: colors.danger }}>{err}</div>

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Journal</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            {items == null ? 'Loading…' : `${items.length} post${items.length === 1 ? '' : 's'}`}
          </div>
        </div>
        <button style={s.btn} onClick={() => nav('/admin/journal/new')}>+ New post</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, category, slug…"
          style={s.searchInput}
        />
      </div>

      {items == null ? (
        <div style={s.emptyState}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>{q ? `No posts match "${q}".` : 'No posts yet.'}</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, width: 84 }}></th>
              <th style={s.th}>Post</th>
              <th style={{ ...s.th, width: 130 }}>Category</th>
              <th style={{ ...s.th, width: 130 }}>Published</th>
              <th style={{ ...s.th, width: 90 }}>Status</th>
              <th style={{ ...s.th, width: 130 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td style={{ ...s.td, padding: '10px 16px' }}>
                  <Thumb src={p.heroImage} alt={p.title} />
                </td>
                <td style={s.td}>
                  <Link to={`/admin/journal/${p.id}`} style={{ color: colors.text, textDecoration: 'none', fontWeight: 600, fontSize: 14.5 }}>
                    {p.title || <em style={{ color: colors.textMuted }}>untitled</em>}
                  </Link>
                  <div style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>/journal/{p.slug}</div>
                </td>
                <td style={s.td}>{p.category && <span style={s.pillNeutral}>{p.category}</span>}</td>
                <td style={s.td}>{formatDate(p.publishedDate)}</td>
                <td style={s.td}>
                  <span style={{ ...s.pillNeutral, ...(p.published === false ? { opacity: 0.6 } : {}) }}>
                    {p.published === false ? 'Draft' : 'Live'}
                  </span>
                </td>
                <td style={s.td}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button style={{ ...s.btn, ...s.btnGhost, padding: '6px 8px' }} title="Duplicate as draft" onClick={() => duplicate(p)}>⧉</button>
                    <Link to={`/admin/journal/${p.id}`} style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>Edit</Link>
                    <button style={{ ...s.btn, ...s.btnGhost, color: colors.danger }} onClick={() => setPendingDelete({ id: p.id, title: p.title })}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete post?"
        body={<>“{pendingDelete?.title}” will be removed from the journal. This cannot be undone.</>}
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
