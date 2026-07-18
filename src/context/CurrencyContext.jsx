// Currency system. All prices in the data are stored in EUR (the base
// currency the owner enters in the admin). This context converts them for
// display: it auto-detects the visitor's currency from their timezone
// (US → USD, UK → GBP, everything else — EU and the rest of the world —
// → EUR, matching the business rule), lets them override it with a switcher,
// and remembers the choice. Exchange rates are admin-editable in Settings.
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CURRENCY_RATES } from '../data/settings'

// Symbol + label per currency. Rates live in settings (see rateFor); EUR is
// always the base at 1.0. `suffix` puts the symbol after the amount — the
// Bosnian mark is written "150 KM", not "KM 150".
export const CURRENCIES = {
  EUR: { code: 'EUR', symbol: '€', label: 'EUR' },
  USD: { code: 'USD', symbol: '$', label: 'USD' },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP' },
  BAM: { code: 'BAM', symbol: 'KM', label: 'BAM', suffix: true },
}

const STORAGE_KEY = 'ttg_currency'

// Only the US and the UK need precise detection — every other timezone
// (EU and rest of world) falls through to EUR, which is exactly the rule.
const UK_ZONES = new Set([
  'Europe/London', 'Europe/Belfast', 'Europe/Guernsey', 'Europe/Jersey', 'Europe/Isle_of_Man',
])
const US_ZONES = new Set([
  'America/New_York', 'America/Detroit', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello',
  'America/Indiana/Indianapolis', 'America/Indiana/Vincennes', 'America/Indiana/Winamac',
  'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Vevay',
  'America/Chicago', 'America/Indiana/Tell_City', 'America/Indiana/Knox', 'America/Menominee',
  'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/North_Dakota/Beulah',
  'America/Denver', 'America/Boise', 'America/Phoenix', 'America/Los_Angeles',
  'America/Anchorage', 'America/Juneau', 'America/Sitka', 'America/Metlakatla',
  'America/Yakutat', 'America/Nome', 'America/Adak', 'Pacific/Honolulu',
])

function detectCurrency() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (UK_ZONES.has(tz)) return 'GBP'
    if (US_ZONES.has(tz)) return 'USD'
  } catch {
    /* fall through */
  }
  return 'EUR'
}

function initialCurrency() {
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved && CURRENCIES[saved]) return saved
    } catch {
      /* private mode etc. */
    }
  }
  return detectCurrency()
}

function rateFor(code) {
  if (code === 'EUR') return 1
  const r = Number(CURRENCY_RATES?.[code])
  return r > 0 ? r : 1
}

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(initialCurrency)

  const setCurrency = useCallback((code) => {
    if (!CURRENCIES[code]) return
    setCurrencyState(code)
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* ignore */
    }
  }, [])

  // Convert a EUR amount to the active currency and format it, e.g.
  // format(1490) → "$1,609" (or "2,914 KM"). Rounds to whole units; returns
  // '' for nullish.
  const format = useCallback((eur) => {
    if (eur == null || eur === '' || isNaN(Number(eur))) return ''
    const c = CURRENCIES[currency]
    const amount = Math.round(Number(eur) * rateFor(currency)).toLocaleString('en-US')
    return c.suffix ? `${amount} ${c.symbol}` : `${c.symbol}${amount}`
  }, [currency])

  const value = useMemo(
    () => ({ currency, setCurrency, format, currencies: CURRENCIES }),
    [currency, setCurrency, format],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  // A safe fallback keeps prices rendering (in EUR) even if a component ends
  // up outside the provider — no crashes on any surface.
  if (!ctx) {
    return {
      currency: 'EUR',
      setCurrency: () => {},
      format: (eur) => (eur == null || isNaN(Number(eur)) ? '' : '€' + Number(eur).toLocaleString('en-US')),
      currencies: CURRENCIES,
    }
  }
  return ctx
}
