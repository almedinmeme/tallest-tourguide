import { useCallback, useRef, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import { DirtyContext } from '../hooks/dirtyContext'

export default function DirtyProvider({ children }) {
  const dirtyRef = useRef(false)
  const [pending, setPending] = useState(null)

  const setDirty = useCallback((d) => {
    dirtyRef.current = d
  }, [])

  const confirmLeave = useCallback((fn) => {
    if (!dirtyRef.current) {
      fn()
      return
    }
    setPending(() => fn)
  }, [])

  return (
    <DirtyContext.Provider value={{ setDirty, confirmLeave }}>
      {children}
      <ConfirmDialog
        open={!!pending}
        title="Discard unsaved changes?"
        body="You have edits that haven't been saved. Leaving this page will discard them."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        danger
        onConfirm={() => {
          const fn = pending
          setPending(null)
          dirtyRef.current = false
          fn?.()
        }}
        onCancel={() => setPending(null)}
      />
    </DirtyContext.Provider>
  )
}
