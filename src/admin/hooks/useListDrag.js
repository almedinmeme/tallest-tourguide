// Minimal HTML5 drag-to-reorder for short vertical lists. The handle is the
// draggable element; rows are drop targets. Keyboard users keep the ↑/↓
// buttons the callers render alongside.
import { useRef, useState } from 'react'
import { colors } from '../styles'

export function useListDrag(items, onChange) {
  const dragIndexRef = useRef(null)
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const reset = () => {
    dragIndexRef.current = null
    setDragIndex(null)
    setOverIndex(null)
  }

  const handleProps = (idx) => ({
    draggable: true,
    onDragStart: (e) => {
      dragIndexRef.current = idx
      setDragIndex(idx)
      e.dataTransfer.effectAllowed = 'move'
      // Firefox needs data set for the drag to start at all.
      e.dataTransfer.setData('text/plain', String(idx))
    },
    onDragEnd: reset,
  })

  const rowProps = (idx) => ({
    onDragOver: (e) => {
      if (dragIndexRef.current == null) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (idx !== overIndex) setOverIndex(idx)
    },
    onDrop: (e) => {
      e.preventDefault()
      const from = dragIndexRef.current
      reset()
      if (from == null || from === idx) return
      const next = items.slice()
      const [moved] = next.splice(from, 1)
      next.splice(idx, 0, moved)
      onChange(next)
    },
    'data-dragging': dragIndex === idx ? 'true' : undefined,
    style:
      overIndex === idx && dragIndex !== idx
        ? { boxShadow: `inset 0 ${overIndex < dragIndex ? 2 : -2}px 0 0 ${colors.primary}` }
        : undefined,
  })

  return { handleProps, rowProps, dragIndex, overIndex, active: dragIndex != null }
}
