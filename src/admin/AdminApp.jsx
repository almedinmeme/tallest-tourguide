import { useEffect, useState } from 'react'
import { NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ToursList from './pages/ToursList'
import TourEditor from './pages/TourEditor'
import PackagesList from './pages/PackagesList'
import PackageEditor from './pages/PackageEditor'
import DestinationsList from './pages/DestinationsList'
import DestinationEditor from './pages/DestinationEditor'
import AccommodationsList from './pages/AccommodationsList'
import AccommodationEditor from './pages/AccommodationEditor'
import PagesList from './pages/PagesList'
import PageEditor from './pages/PageEditor'
import JournalList from './pages/JournalList'
import JournalEditor from './pages/JournalEditor'
import SettingsPage from './pages/SettingsPage'
import * as api from './api'
import { s, colors, adminGlobalCSS } from './styles'
import { ToastProvider } from './components/Toast'
import { useToast } from './hooks/useToast'
import DirtyProvider from './components/DirtyProvider'
import { useConfirmLeave } from './hooks/dirtyContext'

function NavItem({ to, end, icon, children }) {
  const navigate = useNavigate()
  const confirmLeave = useConfirmLeave()
  return (
    <NavLink
      to={to}
      end={end}
      onClick={(e) => {
        // Route through the dirty guard so unsaved editor changes prompt first.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        confirmLeave(() => navigate(to))
      }}
      style={({ isActive }) => ({
        ...s.navLink,
        ...(isActive ? s.navLinkActive : {}),
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      })}
    >
      <span style={{ display: 'inline-flex', width: 16, justifyContent: 'center', opacity: 0.85 }}>
        {icon}
      </span>
      <span>{children}</span>
    </NavLink>
  )
}

const Icon = {
  dashboard: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  tours: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  packages: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8.4v7.2a2 2 0 0 1-1 1.7l-7 4-7-4a2 2 0 0 1-1-1.7V8.4l8-4.4 8 4.4z" />
      <path d="M3.3 8.4 12 13l8.7-4.6" />
      <path d="M12 22V13" />
    </svg>
  ),
  destinations: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
    </svg>
  ),
  accommodations: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11v8M3 13h13a4 4 0 0 1 4 4v2M3 7h6a3 3 0 0 1 3 3v3" />
    </svg>
  ),
  pages: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  ),
  journal: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  settings: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  external: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  ),
}

// Editing writes to local JSON only; nothing is live until committed AND
// pushed (Netlify auto-builds on push). This pill surfaces both kinds of
// undeployed work — uncommitted files and unpushed commits — and can commit
// + deploy in one click (pathspec-scoped to src/data + public/uploads).
function GitStatusPill() {
  const [changed, setChanged] = useState(null)
  const [ahead, setAhead] = useState(0)
  const [files, setFiles] = useState([])
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(null) // 'deploy' | 'commit' | null
  const toast = useToast()

  const check = () =>
    fetch('/api/admin/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setChanged(data?.changedFiles ?? null)
        setFiles(data?.files ?? [])
        setAhead(data?.ahead ?? 0)
      })
      .catch(() => setChanged(null))

  useEffect(() => {
    check()
    window.addEventListener('focus', check)
    return () => window.removeEventListener('focus', check)
  }, [])

  const run = async (push) => {
    setBusy(push ? 'deploy' : 'commit')
    try {
      const result = await api.publish(message, { push })
      if (result.pushed) {
        toast.success('Deployed — Netlify is building; live in a few minutes')
      } else if (result.ok) {
        toast.success('Committed — not deployed yet')
      } else {
        toast.error(`Committed, but deploy failed: ${result.pushError} — your work is safe, try Deploy again later`)
      }
      setMessage('')
      setOpen(false)
      check()
    } catch (e) {
      toast.error(`Failed: ${e.message}`)
    } finally {
      setBusy(null)
    }
  }

  const hasWork = (changed ?? 0) > 0 || ahead > 0
  if (changed == null || !hasWork) return null

  const label =
    changed > 0
      ? `${changed} unpublished change${changed === 1 ? '' : 's'}`
      : `${ahead} commit${ahead === 1 ? '' : 's'} not deployed`
  const shown = files.slice(0, 8)
  const smallBtn = {
    width: '100%',
    marginTop: 6,
    padding: '6px 8px',
    fontSize: 11.5,
    borderRadius: 6,
    cursor: busy ? 'default' : 'pointer',
    opacity: busy ? 0.6 : 1,
  }

  return (
    <div style={{ margin: '8px 14px 0' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Work that is not on the live site yet. Deploy commits it and pushes — Netlify rebuilds automatically."
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 10px',
          fontSize: 11,
          fontWeight: 600,
          borderRadius: 999,
          backgroundColor: 'rgba(201,138,43,0.16)',
          color: '#e0b060',
          border: '1px solid rgba(201,138,43,0.35)',
          cursor: 'pointer',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: '#e0b060' }} />
        {label}
        <span style={{ opacity: 0.7 }}>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div style={{ marginTop: 8 }}>
          {files.length > 0 && (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {shown.map((f) => (
                <li
                  key={f}
                  title={f}
                  style={{
                    fontSize: 10.5,
                    fontFamily: 'ui-monospace, monospace',
                    color: colors.textOnDarkMuted,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.replace(/^(src\/data|public\/uploads)\//, '')}
                </li>
              ))}
              {files.length > shown.length && (
                <li style={{ fontSize: 10.5, color: colors.textOnDarkMuted, opacity: 0.7 }}>
                  +{files.length - shown.length} more
                </li>
              )}
            </ul>
          )}
          {changed > 0 && (
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !busy) run(true) }}
              placeholder="Commit message (optional)"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                marginTop: 8,
                padding: '6px 8px',
                fontSize: 11.5,
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.15)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#fff',
                outline: 'none',
              }}
            />
          )}
          <button
            onClick={() => run(true)}
            disabled={!!busy}
            style={{ ...smallBtn, fontWeight: 700, border: 'none', backgroundColor: colors.primary, color: '#fff' }}
          >
            {busy === 'deploy'
              ? 'Deploying…'
              : changed > 0
                ? `Commit & deploy ${changed} change${changed === 1 ? '' : 's'}`
                : 'Deploy now'}
          </button>
          {changed > 0 && (
            <button
              onClick={() => run(false)}
              disabled={!!busy}
              style={{ ...smallBtn, fontWeight: 600, backgroundColor: 'transparent', color: colors.textOnDarkMuted, border: '1px solid rgba(255,255,255,0.18)' }}
            >
              {busy === 'commit' ? 'Committing…' : 'Commit only (no deploy)'}
            </button>
          )}
          <p style={{ margin: '6px 0 0', fontSize: 10, lineHeight: 1.5, color: colors.textOnDarkMuted, opacity: 0.75 }}>
            Commits only content files (src/data, public/uploads). Deploy pushes to GitHub — Netlify rebuilds the live site automatically.
          </p>
        </div>
      )}
    </div>
  )
}

export default function AdminApp() {
  return (
    <div style={s.page}>
      <style>{adminGlobalCSS}</style>
      <ToastProvider>
      <DirtyProvider>
      <div style={s.shell}>
        <aside style={s.sidebar}>
          <div style={s.sidebarTitle}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                backgroundColor: colors.primary,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              T
            </span>
            Tallest Admin
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <NavItem to="/admin" end icon={Icon.dashboard}>Dashboard</NavItem>
            <NavItem to="/admin/tours" icon={Icon.tours}>Tours</NavItem>
            <NavItem to="/admin/packages" icon={Icon.packages}>Packages</NavItem>
            <NavItem to="/admin/destinations" icon={Icon.destinations}>Destinations</NavItem>
            <NavItem to="/admin/accommodations" icon={Icon.accommodations}>Accommodations</NavItem>
            <NavItem to="/admin/pages" icon={Icon.pages}>Pages</NavItem>
            <NavItem to="/admin/journal" icon={Icon.journal}>Journal</NavItem>
            <NavItem to="/admin/settings" icon={Icon.settings}>Settings</NavItem>
          </nav>
          <div style={{ marginTop: 'auto', borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: 14, marginLeft: -2, marginRight: -2 }}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                fontSize: 12,
                color: colors.textOnDarkMuted,
                textDecoration: 'none',
                borderRadius: 6,
              }}
            >
              View public site {Icon.external}
            </a>
            <GitStatusPill />
            <p style={{ margin: '10px 14px 0', fontSize: 11, lineHeight: 1.5, color: colors.textOnDarkMuted, opacity: 0.75 }}>
              Local editor — changes are saved to this project's files. Commit &amp; deploy to publish.
            </p>
          </div>
        </aside>
        <main style={s.main}>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="tours" element={<ToursList />} />
            <Route path="tours/new" element={<TourEditor />} />
            <Route path="tours/:id" element={<TourEditor />} />
            <Route path="packages" element={<PackagesList />} />
            <Route path="packages/new" element={<PackageEditor />} />
            <Route path="packages/:id" element={<PackageEditor />} />
            <Route path="destinations" element={<DestinationsList />} />
            <Route path="destinations/new" element={<DestinationEditor />} />
            <Route path="destinations/:id" element={<DestinationEditor />} />
            <Route path="accommodations" element={<AccommodationsList />} />
            <Route path="accommodations/new" element={<AccommodationEditor />} />
            <Route path="accommodations/:id" element={<AccommodationEditor />} />
            <Route path="pages" element={<PagesList />} />
            <Route path="pages/:id" element={<PageEditor />} />
            <Route path="journal" element={<JournalList />} />
            <Route path="journal/new" element={<JournalEditor />} />
            <Route path="journal/:id" element={<JournalEditor />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
      </DirtyProvider>
      </ToastProvider>
    </div>
  )
}
