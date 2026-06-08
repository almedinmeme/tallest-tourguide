import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
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
import { s, colors, adminGlobalCSS } from './styles'

function NavItem({ to, end, icon, children }) {
  return (
    <NavLink
      to={to}
      end={end}
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
  external: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  ),
}

export default function AdminApp() {
  return (
    <div style={s.page}>
      <style>{adminGlobalCSS}</style>
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
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
