// The action group at the end of a list row. Six labelled buttons needed
// 325px and pushed the tours table past the window; the same six actions as
// icon buttons fit in 175px, so the table stops forcing the page sideways.
// Every button keeps a title + aria-label, so nothing is icon-only to a
// screen reader or on hover.
import { Link } from 'react-router-dom'
import { s, colors } from '../styles'

const icons = {
  up: <path d="M12 19V5M5 12l7-7 7 7" />,
  down: <path d="M12 5v14M19 12l-7 7-7-7" />,
  view: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  duplicate: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </>
  ),
  delete: (
    <>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
    </>
  ),
}

function Glyph({ name }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {icons[name]}
    </svg>
  )
}

function IconButton({ icon, label, onClick, disabled, danger, href, to }) {
  const common = {
    'data-row-action': true,
    title: label,
    'aria-label': label,
    style: s.iconBtn,
  }
  if (to) {
    return <Link to={to} {...common}><Glyph name={icon} /></Link>
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...common}>
        <Glyph name={icon} />
      </a>
    )
  }
  // Delete stays neutral until hover (data-danger) — a red trash icon on every
  // row of a 16-row table shouts, and the confirm dialog is the real guardrail.
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...common}
      {...(danger ? { 'data-danger': true } : {})}
    >
      <Glyph name={icon} />
    </button>
  )
}

const divider = {
  width: 1,
  height: 16,
  margin: '0 4px',
  backgroundColor: colors.border,
  flexShrink: 0,
}

// `name` is the row's title — it goes into every label so the actions of a
// given row are distinguishable ("Delete Mostar Day Trip", not "Delete").
export default function RowActions({
  name,
  noun = 'item',
  editTo,
  viewHref,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  reorderHint,
}) {
  const of = name ? ` ${name}` : ''
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
      <IconButton
        icon="up"
        label={canMoveUp ? `Move${of} up` : reorderHint || 'Move up'}
        onClick={onMoveUp}
        disabled={!canMoveUp}
      />
      <IconButton
        icon="down"
        label={canMoveDown ? `Move${of} down` : reorderHint || 'Move down'}
        onClick={onMoveDown}
        disabled={!canMoveDown}
      />
      <span style={divider} aria-hidden />
      <IconButton icon="view" label={`Open${of} on the public site`} href={viewHref} />
      <IconButton icon="duplicate" label={`Duplicate this ${noun}`} onClick={onDuplicate} />
      <IconButton icon="edit" label={`Edit${of}`} to={editTo} />
      <IconButton icon="delete" label={`Delete${of}`} onClick={onDelete} danger />
    </div>
  )
}
