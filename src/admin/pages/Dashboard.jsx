import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import { s, colors } from '../styles'

export default function Dashboard() {
  const [tours, setTours] = useState(null)
  const [packages, setPackages] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    Promise.all([api.tours.list(), api.packages.list()])
      .then(([t, p]) => { setTours(t); setPackages(p) })
      .catch((e) => setErr(e.message))
  }, [])

  if (err) return <div style={{ color: colors.danger }}>{err}</div>

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Dashboard</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>Edit the live content of the public site.</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard
          to="/admin/tours"
          eyebrow="Tours"
          value={tours == null ? null : tours.length}
          caption="Manage tours →"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          }
        />
        <StatCard
          to="/admin/packages"
          eyebrow="Packages"
          value={packages == null ? null : packages.length}
          caption="Manage packages →"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8.4v7.2a2 2 0 0 1-1 1.7l-7 4-7-4a2 2 0 0 1-1-1.7V8.4l8-4.4 8 4.4z" />
              <path d="M3.3 8.4 12 13l8.7-4.6" />
              <path d="M12 22V13" />
            </svg>
          }
        />
        <StatCard
          eyebrow="Total days planned"
          value={
            packages == null
              ? null
              : packages.reduce((acc, p) => acc + (Array.isArray(p.days) ? p.days.length : 0), 0)
          }
          caption="Across all packages"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9h18M9 3v4M15 3v4" />
            </svg>
          }
        />
      </div>

      {/* Two-column: Recent items + How it works */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div style={{ ...s.card, padding: 0 }}>
          <div style={{ padding: '18px 22px 10px' }}>
            <h2 style={{ ...s.h2, margin: 0, fontSize: 15 }}>Tours</h2>
            <div style={{ ...s.subtle, marginTop: 2 }}>Latest entries in your data file.</div>
          </div>
          <RecentList items={tours} kind="tours" />
        </div>
        <div>
          <div style={{ ...s.card }}>
            <h2 style={{ ...s.h2, margin: '0 0 8px', fontSize: 15 }}>How it works</h2>
            <p style={{ fontSize: 13, color: colors.textSubtle, lineHeight: 1.6, margin: 0 }}>
              Edits here write to{' '}
              <code style={codeStyle}>src/data/tours.json</code> and{' '}
              <code style={codeStyle}>src/data/packages.json</code>. Uploaded images go to{' '}
              <code style={codeStyle}>public/uploads/</code> as compressed WebP. When you're happy,
              commit the changes — the public site reads the same JSON.
            </p>
          </div>
          <div style={{ ...s.card }}>
            <h2 style={{ ...s.h2, margin: '0 0 10px', fontSize: 15 }}>Quick actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/admin/tours/new" style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none', justifyContent: 'flex-start' }}>+ New tour</Link>
              <Link to="/admin/packages/new" style={{ ...s.btn, ...s.btnSecondary, textDecoration: 'none', justifyContent: 'flex-start' }}>+ New package</Link>
              <a href="/" target="_blank" rel="noreferrer" style={{ ...s.btn, ...s.btnGhost, textDecoration: 'none', justifyContent: 'flex-start' }}>
                Open public site ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, ...s.card, padding: 0 }}>
        <div style={{ padding: '18px 22px 10px' }}>
          <h2 style={{ ...s.h2, margin: 0, fontSize: 15 }}>Packages</h2>
          <div style={{ ...s.subtle, marginTop: 2 }}>Multi-day itineraries.</div>
        </div>
        <RecentList items={packages} kind="packages" />
      </div>
    </div>
  )
}

const codeStyle = {
  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
  fontSize: 12,
  backgroundColor: colors.panelMuted,
  padding: '1px 6px',
  borderRadius: 4,
  border: `1px solid ${colors.border}`,
  color: colors.text,
}

function StatCard({ to, eyebrow, value, caption, icon }) {
  const Inner = to ? Link : 'div'
  const props = to ? { to } : {}
  return (
    <Inner
      {...props}
      data-stat-card={to ? '' : undefined}
      style={{
        ...s.statCard,
        cursor: to ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 6, letterSpacing: -0.5 }}>
            {value == null ? <span style={{ ...s.skeleton, display: 'inline-block', width: 36, height: 24, verticalAlign: 'middle' }} /> : value}
          </div>
          <div style={{ fontSize: 12, color: colors.textSubtle, marginTop: 6 }}>{caption}</div>
        </div>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            backgroundColor: colors.primarySoft,
            color: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>
    </Inner>
  )
}

function RecentList({ items, kind }) {
  if (items == null) {
    return (
      <div style={{ padding: '4px 22px 18px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderTop: i ? `1px solid ${colors.border}` : 'none' }}>
            <div style={{ ...s.skeleton, width: 48, height: 32 }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...s.skeleton, width: '50%', height: 12, marginBottom: 5 }} />
              <div style={{ ...s.skeleton, width: '30%', height: 10 }} />
            </div>
          </div>
        ))}
      </div>
    )
  }
  if (!items.length) {
    return (
      <div style={{ padding: '20px 22px 22px', fontSize: 13, color: colors.textMuted }}>
        Nothing yet. Use the “+ New” button to create one.
      </div>
    )
  }
  const recent = [...items].slice(-5).reverse()
  return (
    <div style={{ padding: '4px 22px 18px' }}>
      {recent.map((it, i) => {
        const title = kind === 'tours' ? it.title : it.name
        const cover = kind === 'tours' ? it.hero : it.heroImage || it.hero
        const href = `/admin/${kind}/${it.id}`
        return (
          <Link
            key={it.id}
            to={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderTop: i ? `1px solid ${colors.border}` : 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {cover ? (
              <img src={cover} alt="" style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4, border: `1px solid ${colors.border}` }} />
            ) : (
              <div style={{ width: 48, height: 32, borderRadius: 4, backgroundColor: colors.panelMuted, border: `1px solid ${colors.border}` }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {title || <em style={{ color: colors.textMuted, fontWeight: 500 }}>untitled</em>}
              </div>
              <div style={{ fontSize: 11.5, color: colors.textMuted, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>
                /{kind}/{it.slug}
              </div>
            </div>
            <span style={{ fontSize: 18, color: colors.textMuted }}>›</span>
          </Link>
        )
      })}
    </div>
  )
}
