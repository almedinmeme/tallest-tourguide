import { s, colors } from '../styles'

// How the "Private Tour" option on the tour page is priced. Stored on the
// tour as:
//   privatePricing: { mode: 'quote' }                                — default
//   privatePricing: { mode: 'fixed', fixedPrice: 250 }               — one group price
//   privatePricing: { mode: 'tiered', tiers: [{ maxPeople, price }] } — price by group size
// Tiered pricing picks the first tier the party fits into; a party larger
// than the biggest tier falls back to the quote flow on the site.
const MODES = [
  { id: 'quote', label: 'Quote', hint: 'Guests request a price — we reply within 24h (default)' },
  { id: 'fixed', label: 'Fixed price', hint: 'One price for the whole group, any size' },
  { id: 'tiered', label: 'By group size', hint: 'Price steps up with the number of guests' },
]

export default function PrivatePricingEditor({ value, onChange, error }) {
  const pp = value || { mode: 'quote' }
  const mode = pp.mode || 'quote'
  const tiers = Array.isArray(pp.tiers) ? pp.tiers : []

  const setMode = (m) => onChange({ ...pp, mode: m })
  const updateTier = (idx, patch) => {
    const copy = tiers.slice()
    copy[idx] = { ...copy[idx], ...patch }
    onChange({ ...pp, tiers: copy })
  }
  const removeTier = (idx) => {
    const copy = tiers.slice()
    copy.splice(idx, 1)
    onChange({ ...pp, tiers: copy })
  }
  const addTier = () => onChange({ ...pp, tiers: [...tiers, { maxPeople: '', price: '' }] })

  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: 8, padding: 14, margin: '4px 0 16px' }}>
      <h3 style={{ ...s.subheading, marginTop: 0 }}>Private tour price</h3>
      <p style={s.subheadingHint}>
        What the "Private Tour" option costs on the tour page. Quote keeps today's
        behaviour; the other two show a real price and let guests pay at checkout.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: mode === 'quote' ? 0 : 12 }}>
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            title={m.hint}
            onClick={() => setMode(m.id)}
            style={{
              ...s.btn,
              ...(mode === m.id ? {} : s.btnGhost),
              ...(mode === m.id ? { backgroundColor: colors.accent, borderColor: colors.accent, color: '#fff' } : {}),
              padding: '6px 12px',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 12, color: colors.textMuted, margin: '6px 0 0' }}>
        {MODES.find((m) => m.id === mode)?.hint}
      </p>

      {mode === 'fixed' && (
        <div style={{ marginTop: 12, maxWidth: 220 }}>
          <label style={fieldLabel}>Price for the whole group (€)</label>
          <input
            type="number"
            min="0"
            step="1"
            style={s.input}
            value={pp.fixedPrice ?? ''}
            onChange={(e) => onChange({ ...pp, fixedPrice: e.target.value })}
            placeholder="e.g. 250"
          />
        </div>
      )}

      {mode === 'tiered' && (
        <div style={{ marginTop: 12 }}>
          {tiers.length === 0 && (
            <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', margin: '0 0 8px' }}>
              No tiers yet. Example: up to 2 people → €150, up to 4 → €200, up to 8 → €260.
            </p>
          )}
          <div style={{ display: 'grid', gap: 8 }}>
            {tiers.map((tier, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '150px 150px auto', gap: 10, alignItems: 'end' }}>
                <div>
                  <label style={fieldLabel}>Up to … people</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    style={s.input}
                    value={tier.maxPeople ?? ''}
                    onChange={(e) => updateTier(idx, { maxPeople: e.target.value })}
                    placeholder="e.g. 4"
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Group price (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    style={s.input}
                    value={tier.price ?? ''}
                    onChange={(e) => updateTier(idx, { price: e.target.value })}
                    placeholder="e.g. 200"
                  />
                </div>
                <button
                  type="button"
                  style={{ ...s.btn, ...s.btnGhost, padding: '6px 10px', color: colors.danger, marginBottom: 2 }}
                  onClick={() => removeTier(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 10 }} onClick={addTier}>
            + Add tier
          </button>
          <p style={{ fontSize: 12, color: colors.textMuted, margin: '10px 0 0' }}>
            Guests pay the first tier their party fits into. A party larger than the
            biggest tier is asked to request a quote instead.
          </p>
        </div>
      )}

      {error && <p style={{ fontSize: 12, color: colors.danger, margin: '10px 0 0' }}>{error}</p>}
    </div>
  )
}

const fieldLabel = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  color: colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  marginBottom: 4,
}
