// Shared inline styles for admin UI — kept in one place for consistency.
// Palette is tuned to feel related to the public site (forest green accents)
// but visually distinct so it reads as an internal tool.

export const colors = {
  // Surfaces
  appBg: '#f6f5f1',          // warm off-white, distinct from the public site
  panel: '#ffffff',
  panelMuted: '#fafaf7',
  panelHover: '#f4f3ee',

  // Borders
  border: '#e7e5df',
  borderStrong: '#d6d3cc',

  // Text
  text: '#1a1f1c',
  textSubtle: '#5b5e57',
  textMuted: '#8a8d85',
  textOnDark: '#f3f1ea',
  textOnDarkMuted: '#a3a59c',

  // Brand
  primary: '#2e7d5e',         // forest green (matches site)
  primaryHover: '#266a4e',
  primaryActive: '#1f5a42',
  primarySoft: '#e8f2ec',
  primaryRing: 'rgba(46,125,94,0.22)',

  // Accent (amber, used sparingly)
  accent: '#c98a2b',

  // Semantic
  danger: '#b8332a',
  dangerSoft: '#fbecea',
  warning: '#a16207',
  warningSoft: '#fef6e1',
  success: '#0f7a4a',
  successSoft: '#e6f4ed',

  // Sidebar
  sidebarBg: '#1f2a25',
  sidebarBgAccent: '#2a3a32',
}

const radius = {
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14,
}

const shadow = {
  sm: '0 1px 2px rgba(20,28,24,0.04), 0 0 0 1px rgba(20,28,24,0.03)',
  md: '0 1px 2px rgba(20,28,24,0.05), 0 4px 14px rgba(20,28,24,0.05)',
  lg: '0 4px 12px rgba(20,28,24,0.06), 0 12px 32px rgba(20,28,24,0.07)',
  focus: `0 0 0 3px ${colors.primaryRing}`,
}

const font = {
  body: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "JetBrains Mono", monospace',
}

const t = {
  fast: '120ms cubic-bezier(0.2, 0, 0, 1)',
  base: '180ms cubic-bezier(0.2, 0, 0, 1)',
}

export const s = {
  page: {
    fontFamily: font.body,
    color: colors.text,
    fontSize: 14,
    lineHeight: 1.45,
    backgroundColor: colors.appBg,
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased',
  },

  shell: {
    display: 'grid',
    gridTemplateColumns: '232px 1fr',
    minHeight: '100vh',
  },

  // Sidebar
  sidebar: {
    backgroundColor: colors.sidebarBg,
    color: colors.textOnDark,
    padding: '24px 14px 24px',
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(0,0,0,0.2)',
  },
  sidebarTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    margin: '4px 12px 22px',
    letterSpacing: 0.2,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  navLink: {
    display: 'block',
    padding: '9px 12px',
    borderRadius: radius.md,
    color: colors.textOnDarkMuted,
    textDecoration: 'none',
    fontSize: 13.5,
    fontWeight: 500,
    marginBottom: 2,
    transition: `background-color ${t.fast}, color ${t.fast}`,
  },
  navLinkActive: {
    backgroundColor: colors.sidebarBgAccent,
    color: '#fff',
  },

  // Main area
  main: {
    padding: '32px 44px 56px',
    maxWidth: 1240,
    width: '100%',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `1px solid ${colors.border}`,
  },
  // Sticky variant: wrap the page header so it stays visible on scroll.
  stickyHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    margin: '-32px -44px 24px',
    padding: '20px 44px 16px',
    backgroundColor: `${colors.appBg}f0`, // 94% opacity for a hint of see-through
    backdropFilter: 'saturate(140%) blur(8px)',
    WebkitBackdropFilter: 'saturate(140%) blur(8px)',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
  },
  h1: {
    fontSize: 26,
    fontWeight: 700,
    margin: 0,
    letterSpacing: -0.3,
    color: colors.text,
  },
  h2: {
    fontSize: 17,
    fontWeight: 600,
    margin: '28px 0 12px',
    letterSpacing: -0.1,
    color: colors.text,
  },
  // Heading for a sub-block inside a card (e.g. "Highlights", "Includes").
  // Larger and darker than s.label so it reads as a true title.
  subheading: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.text,
    margin: '0 0 4px',
    letterSpacing: -0.05,
  },
  subheadingHint: {
    fontSize: 12,
    color: colors.textMuted,
    margin: '0 0 10px',
    lineHeight: 1.45,
  },
  subtle: {
    color: colors.textSubtle,
    fontSize: 13,
  },

  // Cards
  card: {
    backgroundColor: colors.panel,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    padding: 22,
    marginBottom: 16,
    boxShadow: shadow.sm,
  },

  // Tables
  table: {
    width: '100%',
    backgroundColor: colors.panel,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    borderCollapse: 'separate',
    borderSpacing: 0,
    overflow: 'hidden',
    boxShadow: shadow.sm,
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 11,
    fontWeight: 600,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.panelMuted,
  },
  td: {
    padding: '14px 16px',
    borderBottom: `1px solid ${colors.border}`,
    fontSize: 14,
    color: colors.text,
  },

  // Buttons
  btn: {
    appearance: 'none',
    border: 'none',
    backgroundColor: colors.primary,
    color: '#fff',
    padding: '8px 16px',
    borderRadius: radius.md,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    lineHeight: 1.2,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: `background-color ${t.fast}, box-shadow ${t.fast}, transform ${t.fast}`,
    boxShadow: shadow.sm,
  },
  btnSecondary: {
    backgroundColor: colors.panel,
    color: colors.text,
    border: `1px solid ${colors.borderStrong}`,
    boxShadow: 'none',
  },
  btnDanger: {
    backgroundColor: colors.danger,
    color: '#fff',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    color: colors.textSubtle,
    border: `1px solid ${colors.border}`,
    boxShadow: 'none',
  },

  // Forms
  input: {
    width: '100%',
    padding: '9px 12px',
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: radius.md,
    fontSize: 14,
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    color: colors.text,
    transition: `border-color ${t.fast}, box-shadow ${t.fast}`,
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: radius.md,
    fontSize: 14,
    fontFamily: 'inherit',
    minHeight: 90,
    resize: 'vertical',
    boxSizing: 'border-box',
    color: colors.text,
    lineHeight: 1.5,
    transition: `border-color ${t.fast}, box-shadow ${t.fast}`,
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  fieldRow: { marginBottom: 16 },

  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },

  toolbar: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },

  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 9px',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    border: `1px solid ${colors.primary}1f`,
    lineHeight: 1.4,
  },
  pillNeutral: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 9px',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 999,
    backgroundColor: colors.panelMuted,
    color: colors.textSubtle,
    border: `1px solid ${colors.border}`,
    lineHeight: 1.4,
  },

  // Editor layout: TOC sidebar + content
  editorLayout: {
    display: 'grid',
    gridTemplateColumns: '188px 1fr',
    gap: 32,
    alignItems: 'flex-start',
  },

  // Search/filter bar at the top of list pages
  searchInput: {
    width: '100%',
    maxWidth: 340,
    padding: '9px 12px 9px 36px',
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    color: colors.text,
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
  },

  // Quick-action card on the dashboard
  statCard: {
    backgroundColor: colors.panel,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: '20px 22px',
    boxShadow: shadow.sm,
    transition: 'transform 120ms ease, box-shadow 120ms ease',
    display: 'block',
    color: 'inherit',
    textDecoration: 'none',
  },

  // Loading / empty state
  emptyState: {
    border: `1px dashed ${colors.borderStrong}`,
    borderRadius: 12,
    padding: '40px 24px',
    textAlign: 'center',
    color: colors.textSubtle,
    backgroundColor: colors.panel,
  },
  skeleton: {
    backgroundColor: colors.panelMuted,
    borderRadius: 6,
    animation: 'admin-skeleton 1.4s ease-in-out infinite',
  },
}

// Global focus + hover styles injected once. Inline styles can't express
// pseudo-states, so this one-time stylesheet covers them. Imported by AdminApp.
export const adminGlobalCSS = `
  body { background-color: ${colors.appBg}; }

  /* Buttons */
  button[type="button"]:not(:disabled):hover {
    transform: translateY(-1px);
  }
  button[type="button"]:not(:disabled):active {
    transform: translateY(0);
  }

  /* Inputs / textareas — focus ring */
  input[type="text"]:focus,
  input[type="number"]:focus,
  input[type="email"]:focus,
  input[type="url"]:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: ${colors.primary} !important;
    box-shadow: ${shadow.focus} !important;
  }

  /* Tables — row hover */
  table tbody tr:hover td {
    background-color: ${colors.panelHover};
  }
  table tbody tr:last-child td {
    border-bottom: none;
  }

  /* Sidebar links — subtle hover */
  aside a:hover {
    background-color: ${colors.sidebarBgAccent} !important;
    color: ${colors.textOnDark} !important;
  }

  /* Selection */
  ::selection {
    background-color: ${colors.primaryRing};
    color: ${colors.text};
  }

  /* Scrollbar (webkit) */
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb {
    background-color: ${colors.borderStrong};
    border-radius: 8px;
    border: 2px solid ${colors.appBg};
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: ${colors.textMuted};
  }

  /* Dashboard stat-card hover lift */
  a[data-stat-card]:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20,28,24,0.06), 0 12px 28px rgba(20,28,24,0.08);
  }

  /* Skeleton shimmer */
  @keyframes admin-skeleton {
    0%   { opacity: 1; }
    50%  { opacity: 0.55; }
    100% { opacity: 1; }
  }

  /* Smooth-scroll anchor jumps */
  html { scroll-behavior: smooth; }
`
