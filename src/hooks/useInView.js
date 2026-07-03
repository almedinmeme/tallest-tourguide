// useInView.js
// Tracks whether a target element is currently visible in the viewport.
// Used by the sticky mobile action bars (Consult, Checkout) so the bar can
// hide itself once the in-flow button it mirrors is on screen.
import { useEffect, useRef, useState } from 'react'

export default function useInView(rootMargin = '0px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, inView]
}
