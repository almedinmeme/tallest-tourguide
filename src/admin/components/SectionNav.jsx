import { useEffect, useState } from 'react'
import { colors } from '../styles'

// Sticky in-page navigation. Pass an array of { id, label } that match
// the `id`s of section elements on the same page. Highlights the active
// section based on scroll position.
export default function SectionNav({ sections, topOffset = 110 }) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const targets = sections
      .map((sec) => document.getElementById(sec.id))
      .filter(Boolean)
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry whose top is closest to (but past) the offset line.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      {
        rootMargin: `-${topOffset}px 0px -65% 0px`,
        threshold: 0,
      },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [sections, topOffset])

  const onClick = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - topOffset + 4
    window.scrollTo({ top, behavior: 'smooth' })
    setActive(id)
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: topOffset,
        alignSelf: 'flex-start',
        fontSize: 13,
        paddingRight: 8,
      }}
    >
      <div
        style={{
          textTransform: 'uppercase',
          letterSpacing: 0.7,
          fontSize: 10,
          fontWeight: 700,
          color: colors.textMuted,
          marginBottom: 10,
          paddingLeft: 12,
        }}
      >
        On this page
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {sections.map((sec) => {
          const isActive = active === sec.id
          return (
            <li key={sec.id}>
              <a
                href={`#${sec.id}`}
                onClick={(e) => onClick(e, sec.id)}
                style={{
                  display: 'block',
                  padding: '7px 12px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: isActive ? colors.text : colors.textSubtle,
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? colors.primarySoft : 'transparent',
                  borderLeft: `2px solid ${isActive ? colors.primary : 'transparent'}`,
                  transition: 'background-color 120ms ease, color 120ms ease',
                }}
              >
                {sec.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
