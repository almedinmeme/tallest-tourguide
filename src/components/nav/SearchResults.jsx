import { Link } from 'react-router-dom'

// Shared result-list pieces for the desktop search dropdown and the mobile
// sheet's search view.

export function SearchGroup({ label, children }) {
  return (
    <div style={styles.group}>
      <span style={styles.groupLabel}>{label}</span>
      {children}
    </div>
  )
}

export function SearchResult({ to, title, meta, onClick }) {
  return (
    <Link to={to} style={styles.result} className="search-result-item" onClick={onClick}>
      <div style={styles.resultText}>
        <span style={styles.resultTitle}>{title}</span>
        <span style={styles.resultMeta}>{meta}</span>
      </div>
    </Link>
  )
}

const styles = {
  group: {
    padding: '4px 0',
  },
  groupLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-n600)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    padding: '8px 14px 4px',
  },
  result: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 14px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  resultText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  resultTitle: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  resultMeta: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },
}
