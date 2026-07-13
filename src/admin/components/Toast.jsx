import { useCallback, useMemo, useRef, useState } from 'react'
import { colors } from '../styles'
import { ToastContext } from '../hooks/useToast'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (kind, message) => {
      const id = ++idRef.current
      setToasts((list) => [...list, { id, kind, message }])
      if (kind === 'success') setTimeout(() => dismiss(id), 2500)
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          maxWidth: 380,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.kind === 'error' ? 'alert' : 'status'}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '11px 14px',
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 500,
              lineHeight: 1.4,
              backgroundColor: toast.kind === 'error' ? colors.dangerSoft : colors.successSoft,
              color: toast.kind === 'error' ? colors.danger : colors.success,
              border: `1px solid ${toast.kind === 'error' ? colors.danger : colors.success}33`,
              boxShadow: '0 4px 12px rgba(20,28,24,0.08), 0 12px 32px rgba(20,28,24,0.1)',
              animation: 'admin-toast-in 180ms cubic-bezier(0.2, 0, 0, 1)',
            }}
          >
            <span style={{ flexShrink: 0, marginTop: 1 }}>
              {toast.kind === 'error' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8.5 12 2.5 2.5 4.5-5" />
                </svg>
              )}
            </span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            {toast.kind === 'error' && (
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss"
                style={{
                  appearance: 'none',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  padding: 0,
                  fontSize: 15,
                  lineHeight: 1,
                  opacity: 0.7,
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
