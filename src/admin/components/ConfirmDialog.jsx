import { useEffect, useRef } from 'react'
import { s, colors } from '../styles'

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        backgroundColor: 'rgba(26,31,28,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          backgroundColor: colors.panel,
          borderRadius: 12,
          padding: '22px 24px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 24px rgba(20,28,24,0.14), 0 24px 64px rgba(20,28,24,0.18)',
          animation: 'admin-dialog-in 160ms cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: colors.text }}>{title}</h3>
        <div style={{ fontSize: 13.5, color: colors.textSubtle, lineHeight: 1.5, marginBottom: 20 }}>{body}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button ref={cancelRef} type="button" style={{ ...s.btn, ...s.btnGhost }} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            style={{ ...s.btn, ...(danger ? s.btnDanger : {}) }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
