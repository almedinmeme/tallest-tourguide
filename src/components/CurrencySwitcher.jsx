// Currency switcher — a compact dropdown that lets the visitor override the
// auto-detected currency. `variant="light"` styles it for a dark background;
// `dropUp` opens the list upward, for when the switcher sits near the bottom
// of the viewport (the mobile nav sheet) and a downward list would be cut off.
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'

export default function CurrencySwitcher({ variant = 'default', dropUp = false }) {
  const { currency, setCurrency, currencies } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const light = variant === 'light'
  const active = currencies[currency]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change currency"
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          height: 34,
          padding: '0 10px',
          borderRadius: 'var(--radius-pill)',
          border: light ? '1px solid rgba(255,255,255,0.3)' : '1.5px solid var(--color-n200)',
          backgroundColor: light ? 'rgba(255,255,255,0.12)' : 'var(--color-n000)',
          color: light ? '#fff' : 'var(--color-n700)',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontWeight: 700 }}>{active.symbol}</span>
        {active.label}
        <ChevronDown size={13} style={{ transform: open !== dropUp ? 'rotate(180deg)' : 'none', transition: 'transform var(--t-fast)', opacity: 0.7 }} />
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            ...(dropUp ? { bottom: 'calc(100% + 6px)' } : { top: 'calc(100% + 6px)' }),
            right: 0,
            minWidth: 140,
            listStyle: 'none',
            margin: 0,
            padding: 6,
            backgroundColor: 'var(--color-n000)',
            borderRadius: 12,
            border: '1px solid var(--color-n200)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.16)',
            zIndex: 60,
          }}
        >
          {Object.values(currencies).map((c) => {
            const isActive = c.code === currency
            return (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => { setCurrency(c.code); setOpen(false) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '9px 10px',
                    border: 'none',
                    borderRadius: 8,
                    backgroundColor: isActive ? 'rgba(46,125,94,0.08)' : 'transparent',
                    color: isActive ? 'var(--color-forest-green)' : 'var(--color-n700)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 14,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {/* minWidth (not width) so the two-character "KM" isn't
                      crushed into the one-character symbols' slot, while all
                      four labels still line up. */}
                  <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 9 }}>
                    <span style={{ display: 'inline-block', minWidth: 20, fontWeight: 700 }}>{c.symbol}</span>
                    {c.label}
                  </span>
                  {isActive && <Check size={15} color="var(--color-forest-green)" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
