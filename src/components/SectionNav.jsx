// SectionNav.jsx
// Sticky in-page section navigation for long-form article pages
// (Booking Conditions, the Bosnia travel guide). Extracted from the two
// identical page-local StickyNav copies. Tucks under the site navbar and
// hides with it on scroll-down; scroll-spy (IntersectionObserver) stays in
// the owning page, which passes activeId down.

import { useState, useEffect, useRef } from 'react'

const NAVBAR_HEIGHT = 68

export default function SectionNav({ sections, activeId, onScrollTo, isMobile }) {
  const [navbarVisible, setNavbarVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 80) {
        setNavbarVisible(true)
      } else if (y > lastScrollY.current) {
        setNavbarVisible(false)
      } else {
        setNavbarVisible(true)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'sticky',
      top: navbarVisible ? `${NAVBAR_HEIGHT}px` : '0px',
      transition: 'top 0.3s ease',
      zIndex: 95,
      backgroundColor: 'var(--color-n000)',
      borderBottom: '1px solid var(--color-n200)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      whiteSpace: 'nowrap',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        height: '44px',
        maxWidth: '1060px',
        margin: '0 auto',
        padding: isMobile ? '0 16px' : '0 40px',
        minWidth: 'max-content',
      }}>
        {sections.map(({ id, number, title }) => {
          const isActive = activeId === id
          return (
            <button
              key={id}
              onClick={() => onScrollTo(id)}
              style={{
                height: '100%',
                padding: isMobile ? '0 10px' : '0 14px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--color-forest-green)' : '2px solid transparent',
                color: isActive ? 'var(--color-forest-green)' : 'var(--color-n500)',
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? '12px' : '13px',
                fontWeight: isActive ? '600' : '400',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-hero)',
                fontSize: '11px',
                fontWeight: 500,
                color: isActive ? 'var(--color-amber)' : 'var(--color-n400)',
              }}>{number}</span>
              {title}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
