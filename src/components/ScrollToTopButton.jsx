// ScrollToTopButton.jsx
// A floating button that appears after the visitor has
// scrolled past 50% of the page height.
//
// It uses two pieces of state:
// - isVisible: whether to show the button at all
// - isHovered: whether the mouse is over it (for hover style)
//
// The scroll position is tracked via a useEffect that adds
// a scroll event listener — same pattern as useWindowWidth.
// The listener is cleaned up on unmount to prevent memory leaks.
//
// Semi-transparent backdrop blur gives it the frosted glass
// look you asked for — present but not intrusive.

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button when visitor has scrolled past
      // 50% of the total page height.
      // document.documentElement.scrollHeight is the full
      // page height including content below the fold.
      // window.innerHeight is the visible viewport height.
      // scrollY is how far down the visitor has scrolled.
      const scrolled = window.scrollY
      const halfPage = (document.documentElement.scrollHeight - window.innerHeight) / 2

      setIsVisible(scrolled > halfPage)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // passive: true tells the browser this listener will never
    // call preventDefault() — allowing the browser to optimise
    // scroll performance significantly on mobile devices.

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Don't render anything if not visible —
  // keeps the DOM clean when the button isn't needed.
  if (!isVisible) return null

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles.button,
        // Hover state increases opacity and lifts slightly —
        // subtle but clear feedback that this is interactive.
        opacity: isHovered ? 1 : 0.85,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 8px 24px rgba(0,0,0,0.2)'
          : '0 4px 16px rgba(0,0,0,0.12)',
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={18} color="var(--color-forest-green)" />
    </button>
  )
}

const styles = {
  button: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    zIndex: 200,
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
    // Entrance animation — plays every time the button appears
    animation: 'fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
  },
}

export default ScrollToTopButton