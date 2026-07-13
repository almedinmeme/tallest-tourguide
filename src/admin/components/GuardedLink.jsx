import { Link, useNavigate } from 'react-router-dom'
import { useConfirmLeave } from '../hooks/dirtyContext'

// A Link that runs through the unsaved-changes guard before navigating.
export default function GuardedLink({ to, style, children }) {
  const navigate = useNavigate()
  const confirmLeave = useConfirmLeave()
  return (
    <Link
      to={to}
      style={style}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        confirmLeave(() => navigate(to))
      }}
    >
      {children}
    </Link>
  )
}
