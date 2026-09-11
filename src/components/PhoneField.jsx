// PhoneField.jsx
// The phone input on /checkout: a country picker carrying the flag and the
// dialling code, joined to a plain box for the rest of the number.
//
// Splitting the two is the point. When it was one free-text field, the guest
// had to know we wanted the international form, and any of the dozen ways a
// human writes a number could bounce them off the last screen before paying
// (see utils/phone.js for the one that prompted this). With the code chosen
// from a list there is nothing to get wrong: pick your country, type the
// number the way you'd tell it to a friend, and the line underneath shows
// exactly what we're about to save.
//
// The number box still accepts a full international number — pasting
// "+49 178 6961924" moves the flag to Germany and keeps the rest — because
// that is what people actually do with a phone field.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'
import { COUNTRIES, COUNTRY_BY_ISO, SUGGESTED } from '../data/countries'
import { applyPhoneInput, validatePhone } from '../utils/phone'
import useWindowWidth from '../hooks/useWindowWidth'

const SUGGESTED_SET = new Set(SUGGESTED)
const suggestedCountries = SUGGESTED.map((iso) => COUNTRY_BY_ISO[iso]).filter(Boolean)
const otherCountries = COUNTRIES.filter((c) => !SUGGESTED_SET.has(c.iso))

// Match on name, ISO code and dial code, with or without the +, so "49",
// "+49", "de" and "germ" all find Germany.
function searchCountries(query) {
  const q = query.trim().toLowerCase().replace(/^\+/, '')
  if (!q) return null
  return COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.iso.toLowerCase() === q ||
      c.dial.startsWith(q),
  )
}

export default function PhoneField({ value, onChange, error }) {
  const { iso, national } = value
  const country = COUNTRY_BY_ISO[iso] || COUNTRIES[0]
  const isMobile = useWindowWidth() <= 768

  const [open, setOpen] = useState(false)
  // Opens downward unless that would push the list under the fold.
  const [dropUp, setDropUp] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const wrapRef = useRef(null)
  const fieldRef = useRef(null)
  const buttonRef = useRef(null)
  const numberRef = useRef(null)
  const searchRef = useRef(null)
  const listRef = useRef(null)

  // Flat list backing keyboard navigation; the rendered list is grouped, so
  // both are built from the same array to keep the indices honest.
  const results = useMemo(() => searchCountries(query), [query])
  const flatList = results || [...suggestedCountries, ...otherCountries]

  // Close on an outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Opening puts the cursor in the search box on desktop. On a phone that
  // would throw up the keyboard over the list before anyone has looked at
  // it, so there the list opens plain and search is a tap away.
  useEffect(() => {
    if (!open) return
    setQuery('')
    setActiveIndex(Math.max(0, flatList.findIndex((c) => c.iso === iso)))
    if (!isMobile) searchRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // A 13" laptop puts this field low enough that a list dropping down can
  // land under the fold, which reads as "the picker is broken". Flip it above
  // the field when there genuinely isn't room below.
  useLayoutEffect(() => {
    if (!open) return
    const r = fieldRef.current?.getBoundingClientRect()
    if (!r) return
    const PANEL_HEIGHT = 310
    const below = window.innerHeight - r.bottom
    setDropUp(below < PANEL_HEIGHT && r.top > below)
  }, [open])

  // Keep the highlighted row on screen while arrowing through 221 countries.
  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector(`[data-idx="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const pick = (next) => {
    onChange({ iso: next.iso, national })
    setOpen(false)
    // Straight on to the number — the guest opened this to finish a booking.
    requestAnimationFrame(() => numberRef.current?.focus())
  }

  const onListKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((i) => (i + step + flatList.length) % flatList.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flatList[activeIndex]) pick(flatList[activeIndex])
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const check = validatePhone(value)
  const preview = !error && check.ok && check.e164 ? check.e164 : ''

  // Rows are rendered from the same flat array so a row's index always
  // matches the one keyboard navigation is pointing at.
  let cursor = -1
  const renderRow = (c) => {
    cursor += 1
    const idx = cursor
    const selected = c.iso === iso
    return (
      <button
        key={c.iso}
        type="button"
        role="option"
        aria-selected={selected}
        data-idx={idx}
        className="phone-country-option"
        onMouseEnter={() => setActiveIndex(idx)}
        onClick={() => pick(c)}
        style={{
          ...S.option,
          backgroundColor: idx === activeIndex ? 'var(--color-n100)' : 'transparent',
        }}
      >
        <span style={S.optionFlag} aria-hidden="true">{c.flag}</span>
        <span style={S.optionName}>{c.name}</span>
        <span style={S.optionDial}>+{c.dial}</span>
        {selected && <Check size={14} strokeWidth={3} color="var(--color-forest-green)" />}
      </button>
    )
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div
        ref={fieldRef}
        className="phone-field"
        style={{
          ...S.wrap,
          borderColor: error ? 'var(--color-error)' : 'var(--color-n300)',
        }}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country code: ${country.name}, plus ${country.dial}. Change`}
          style={S.trigger}
        >
          <span style={S.flag} aria-hidden="true">{country.flag}</span>
          <span style={S.dial}>+{country.dial}</span>
          <ChevronDown
            size={14}
            style={{ color: 'var(--color-n500)', transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none' }}
          />
        </button>

        <input
          ref={numberRef}
          className="phone-field__input"
          style={S.input}
          value={national}
          onChange={(e) => onChange(applyPhoneInput(e.target.value, iso))}
          placeholder={country.example || '123 456 789'}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-label="Phone number, without the country code"
          aria-invalid={error ? 'true' : undefined}
        />
      </div>

      {/* What we'll actually store. Shown rather than explained, so a guest
          whose flag is wrong can see it before they submit. */}
      {preview && (
        <span style={S.preview}>
          We’ll save this as <strong style={{ fontWeight: 600, color: 'var(--color-n600)' }}>{preview}</strong>
        </span>
      )}

      {open && (
        <div
          style={{
            ...S.panel,
            width: isMobile ? '100%' : '340px',
            ...(dropUp ? { top: 'auto', bottom: 'calc(100% + 6px)' } : null),
          }}
        >
          <div style={S.searchRow}>
            <Search size={15} style={{ color: 'var(--color-n400)', flexShrink: 0 }} />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
              onKeyDown={onListKeyDown}
              placeholder="Search country or code"
              style={S.search}
              aria-label="Search countries"
            />
          </div>

          <div ref={listRef} role="listbox" aria-label="Country codes" style={S.list} onKeyDown={onListKeyDown}>
            {results ? (
              results.length ? (
                results.map(renderRow)
              ) : (
                <p style={S.empty}>No country matches “{query.trim()}”</p>
              )
            ) : (
              <>
                <div style={S.groupLabel}>Frequently booked</div>
                {suggestedCountries.map(renderRow)}
                <div style={S.groupLabel}>All countries</div>
                {otherCountries.map(renderRow)}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const S = {
  wrap: {
    display: 'flex',
    alignItems: 'stretch',
    height: '46px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    backgroundColor: 'var(--color-n000)',
    overflow: 'hidden',
  },
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0 10px 0 12px',
    border: 'none',
    borderRight: '1.5px solid var(--color-n200)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    flexShrink: 0,
  },
  flag: { fontSize: '18px', lineHeight: 1 },
  dial: { fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  input: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    padding: '0 14px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'transparent',
  },
  preview: {
    display: 'block',
    marginTop: '6px',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n500)',
  },
  panel: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    zIndex: 40,
    backgroundColor: 'var(--color-n000)',
    border: '1px solid var(--color-n200)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 12px 32px rgba(16, 32, 24, 0.16)',
    overflow: 'hidden',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderBottom: '1px solid var(--color-n200)',
  },
  search: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
    backgroundColor: 'transparent',
  },
  list: { maxHeight: '260px', overflowY: 'auto', padding: '4px 0' },
  groupLabel: {
    padding: '8px 14px 4px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--color-n400)',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '8px 14px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },
  optionFlag: { fontSize: '17px', lineHeight: 1, flexShrink: 0 },
  optionName: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  optionDial: { color: 'var(--color-n500)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 },
  empty: { padding: '18px 14px', margin: 0, fontSize: 'var(--text-small)', color: 'var(--color-n500)' },
}
