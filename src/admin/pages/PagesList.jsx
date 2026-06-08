import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'

// Maps each editorial page slug to its public route, so the admin can jump
// straight to the live page.
export const PAGE_ROUTES = {
  'our-story': '/about',
  hospitality: '/hospitality',
  signature: '/signature',
  partners: '/partners',
  consult: '/consult',
  'where-we-stay': '/where-we-stay',
}

export default function PagesList() {
  const [items, setItems] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    api.pages.list().then(setItems).catch((e) => setErr(e.message))
  }, [])

  if (err) return <div style={{ color: colors.danger }}>{err}</div>

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Pages</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>Editorial content for the brand pages</div>
        </div>
      </div>

      {items == null ? (
        <div style={s.emptyState}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={s.emptyState}>No editorial pages found.</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Page</th>
              <th style={{ ...s.th, width: 220 }}>Public route</th>
              <th style={{ ...s.th, width: 140 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const route = PAGE_ROUTES[p.slug]
              return (
                <tr key={p.id}>
                  <td style={s.td}>
                    <Link to={`/admin/pages/${p.id}`} style={{ color: colors.text, textDecoration: 'none', fontWeight: 600, fontSize: 14.5 }}>
                      {p.title || p.slug}
                    </Link>
                    {p.hero?.heading && (
                      <div style={{ color: colors.textMuted, fontSize: 12.5, marginTop: 2, maxWidth: 520, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.hero.heading}
                      </div>
                    )}
                  </td>
                  <td style={s.td}>
                    {route ? <code style={{ fontSize: 12, color: colors.textMuted, fontFamily: 'ui-monospace, monospace' }}>{route}</code> : <span style={{ color: colors.textMuted }}>—</span>}
                  </td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {route && <a href={route} target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none' }} title="Open public page">↗</a>}
                      <Link to={`/admin/pages/${p.id}`} style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none' }}>Edit</Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
