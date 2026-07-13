// Unsaved-changes tracking. The app mounts under a plain <BrowserRouter>
// (src/main.jsx), so react-router's useBlocker is unavailable — instead
// DirtyProvider (components/DirtyProvider.jsx) intercepts the known in-admin
// exits (sidebar nav, back/Cancel links) via confirmLeave(), and
// useDirtyTracker adds a beforeunload guard for reloads/closes. Known gap:
// the browser back button skips the in-app dialog (beforeunload still covers
// full unloads).
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

export const DirtyContext = createContext(null)

// Wraps a navigation callback: runs it immediately when clean, otherwise
// shows the shared discard dialog first.
export function useConfirmLeave() {
  const ctx = useContext(DirtyContext)
  return ctx ? ctx.confirmLeave : (fn) => fn()
}

// Editors call this with their item state. Snapshots the first non-null
// value; any later divergence marks the editor dirty. markSaved(nextItem?)
// resets the snapshot (to nextItem when the server response replaces state).
export function useDirtyTracker(item) {
  const ctx = useContext(DirtyContext)
  const snapRef = useRef(null)
  const latestRef = useRef(null)
  const [dirty, setDirtyLocal] = useState(false)

  const serialized = item != null ? JSON.stringify(item) : null

  useEffect(() => {
    latestRef.current = serialized
  })

  useEffect(() => {
    if (serialized == null) return
    if (snapRef.current == null) {
      snapRef.current = serialized
      return
    }
    const d = serialized !== snapRef.current
    setDirtyLocal(d)
    ctx?.setDirty(d)
  }, [serialized, ctx])

  useEffect(() => {
    return () => ctx?.setDirty(false)
  }, [ctx])

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const markSaved = useCallback(
    (nextItem) => {
      snapRef.current = nextItem !== undefined ? JSON.stringify(nextItem) : latestRef.current
      setDirtyLocal(false)
      ctx?.setDirty(false)
    },
    [ctx],
  )

  return { dirty, markSaved }
}
