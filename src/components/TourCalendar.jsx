import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toDateString(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getTodayString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function TourCalendar({
  slug,
  groupSize,
  tourType,
  selectedDate,
  onChange,
  isBlocked,
  bookings,
  language,
}) {
  const today = getTodayString()
  const now = new Date()

  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const startDow = (firstDay.getDay() + 6) % 7 // Mon-first: Mon=0, Sun=6
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    const result = []
    for (let i = 0; i < startDow; i++) result.push(null)
    for (let d = 1; d <= daysInMonth; d++) result.push(d)
    while (result.length % 7 !== 0) result.push(null)
    return result
  }, [viewYear, viewMonth])

  const baseYear = now.getFullYear()
  const baseMonth = now.getMonth()
  const monthOffset = (viewYear - baseYear) * 12 + (viewMonth - baseMonth)
  const canGoPrev = monthOffset > 0
  const canGoNext = monthOffset < 12

  function prevMonth() {
    if (!canGoPrev) return
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (!canGoNext) return
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
  }

  function getCellState(day) {
    if (!day) return 'empty'
    const dateStr = toDateString(viewYear, viewMonth, day)
    if (dateStr <= today) return 'past'
    if (isBlocked(slug, dateStr)) return 'blocked'

    if (tourType === 'shared' && groupSize) {
      const booked = (bookings && bookings[`${slug}_${dateStr}_${(language || '').toLowerCase()}`]) || 0
      const left = Math.max(0, groupSize - booked)
      if (left === 0) return 'full'
      if (left <= 3) return 'low'
      if (left <= 6) return 'medium'
    }

    return 'available'
  }

  function getSpots(day) {
    if (!day || !groupSize) return null
    const dateStr = toDateString(viewYear, viewMonth, day)
    const booked = (bookings && bookings[`${slug}_${dateStr}_${(language || '').toLowerCase()}`]) || 0
    return Math.max(0, groupSize - booked)
  }

  function handleClick(day) {
    if (!day) return
    const state = getCellState(day)
    if (state === 'past' || state === 'blocked' || state === 'full') return
    onChange(toDateString(viewYear, viewMonth, day))
  }

  return (
    <div style={{ userSelect: 'none' }}>

      {/* Month header */}
      <div style={styles.monthHeader}>
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          style={{ ...styles.navBtn, opacity: canGoPrev ? 1 : 0.25, cursor: canGoPrev ? 'pointer' : 'not-allowed' }}
          aria-label="Previous month"
        >
          <ChevronLeft size={15} />
        </button>
        <span style={styles.monthLabel}>{monthLabel}</span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          style={{ ...styles.navBtn, opacity: canGoNext ? 1 : 0.25, cursor: canGoNext ? 'pointer' : 'not-allowed' }}
          aria-label="Next month"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div style={styles.dayHeaders}>
        {DAY_LABELS.map((d) => (
          <div key={d} style={styles.dayHeader}>{d}</div>
        ))}
      </div>

      {/* Date grid */}
      <div style={styles.grid}>
        {cells.map((day, i) => {
          const state = getCellState(day)
          const dateStr = day ? toDateString(viewYear, viewMonth, day) : null
          const isSelected = dateStr === selectedDate
          const isToday = dateStr === today
          const spots = tourType === 'shared' && day ? getSpots(day) : null
          const isClickable = day && state !== 'past' && state !== 'blocked' && state !== 'full'

          return (
            <div
              key={i}
              onClick={() => handleClick(day)}
              onMouseEnter={() => isClickable && setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={getCellStyle(state, isSelected, isToday, !!day, isClickable, hoveredIdx === i)}
            >
              {day && (
                <>
                  <span style={getDateNumStyle(state, isSelected)}>{day}</span>

                  {state === 'blocked' && (
                    <span style={{ ...styles.badge, color: 'var(--color-n400)' }}>Off</span>
                  )}
                  {state === 'full' && (
                    <span style={{ ...styles.badge, color: 'var(--color-n400)' }}>Full</span>
                  )}
                  {state === 'low' && spots !== null && !isSelected && (
                    <span style={{ ...styles.badge, color: '#c0392b', fontWeight: '700' }}>
                      {spots} left
                    </span>
                  )}
                  {state === 'medium' && spots !== null && !isSelected && (
                    <span style={{ ...styles.badge, color: 'var(--color-amber)', fontWeight: '600' }}>
                      {spots} left
                    </span>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}

function getCellStyle(state, isSelected, isToday, hasDay, isClickable, isHovered) {
  const base = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '36px',
    borderRadius: '6px',
    transition: 'background-color 0.15s',
    position: 'relative',
    cursor: isClickable ? 'pointer' : 'default',
  }

  if (!hasDay) return base

  if (isSelected) {
    return {
      ...base,
      backgroundColor: 'var(--color-forest-green)',
    }
  }

  if (state === 'past') {
    return { ...base, opacity: 0.28, cursor: 'not-allowed' }
  }

  if (state === 'blocked' || state === 'full') {
    return {
      ...base,
      backgroundColor: 'var(--color-n200)',
      cursor: 'not-allowed',
    }
  }

  // available / low / medium — clickable
  let bgColor = 'transparent'
  if (isHovered) bgColor = 'rgba(46,125,94,0.1)'
  else if (state === 'low') bgColor = 'rgba(231,76,60,0.07)'
  else if (state === 'medium') bgColor = 'rgba(241,196,15,0.1)'

  return {
    ...base,
    backgroundColor: bgColor,
    outline: isToday ? '2px solid var(--color-forest-green)' : 'none',
    outlineOffset: '-2px',
    transition: 'background-color 0.15s ease',
  }
}

function getDateNumStyle(state, isSelected) {
  const base = {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: '600',
    lineHeight: 1,
  }

  if (isSelected) return { ...base, color: 'var(--color-n000)' }
  if (state === 'past') return { ...base, color: 'var(--color-n600)' }
  if (state === 'blocked') return { ...base, color: 'var(--color-n400)', textDecoration: 'line-through' }
  if (state === 'full') return { ...base, color: 'var(--color-n400)' }
  return { ...base, color: 'var(--color-n800)' }
}

const styles = {
  monthHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },

  navBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    padding: '6px',
    color: 'var(--color-n600)',
    borderRadius: '6px',
  },

  monthLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '14px',
    color: 'var(--color-n800)',
  },

  dayHeaders: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '4px',
  },

  dayHeader: {
    textAlign: 'center',
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--color-n500)',
    paddingBottom: '4px',
    letterSpacing: '0.03em',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
  },

  badge: {
    fontFamily: 'var(--font-body)',
    fontSize: '9px',
    lineHeight: 1,
    marginTop: '2px',
  },

}
