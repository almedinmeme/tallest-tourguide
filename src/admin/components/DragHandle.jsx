import { colors } from '../styles'

// Six-dot grip. Spread the handleProps from useListDrag onto it.
export default function DragHandle({ disabled = false, title = 'Drag to reorder', ...rest }) {
  return (
    <span
      title={disabled ? title : 'Drag to reorder'}
      aria-hidden
      {...(disabled ? {} : rest)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 26,
        borderRadius: 5,
        cursor: disabled ? 'default' : 'grab',
        color: colors.textMuted,
        opacity: disabled ? 0.35 : 1,
        touchAction: 'none',
        flexShrink: 0,
      }}
    >
      <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
        <circle cx="2.5" cy="2.5" r="1.5" />
        <circle cx="7.5" cy="2.5" r="1.5" />
        <circle cx="2.5" cy="8" r="1.5" />
        <circle cx="7.5" cy="8" r="1.5" />
        <circle cx="2.5" cy="13.5" r="1.5" />
        <circle cx="7.5" cy="13.5" r="1.5" />
      </svg>
    </span>
  )
}
