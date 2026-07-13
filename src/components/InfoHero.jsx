// InfoHero.jsx
// Shared entrance for the information cluster (Safe Travels, Booking
// Conditions, Practical Info, the Bosnia guide): the deep-green radial field
// the brand heroes use (Consult, Signature) with the amber kicker-and-rule
// signature. Gives these text-led pages a brand moment without photography.
//
//   <InfoHero kicker="…" title="…" lede="…" chips={[…]} meta="…" overlap />
//
// `chips` renders a row of amber-ticked trust facts; `meta` a quiet byline
// row; `overlap` adds bottom padding so the next section can pull a card up
// over the hero's lower edge (Booking Conditions' "short version").

import { Check } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'

export default function InfoHero({ kicker, title, lede, chips, meta, overlap = false }) {
  const isMobile = useWindowWidth() <= 768

  return (
    <header style={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'var(--color-n900)',
      padding: isMobile
        ? `52px 24px ${overlap ? 96 : 56}px`
        : `76px 24px ${overlap ? 136 : 84}px`,
    }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(115% 115% at 15% 0%, #245b46 0%, var(--color-n900) 66%)' }} />
      <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
        {kicker && <span style={styles.kicker}>{kicker}</span>}
        <div aria-hidden style={styles.rule} />
        <h1 style={styles.h1}>{title}</h1>
        {lede && <p style={styles.lede}>{lede}</p>}
        {chips?.length > 0 && (
          <ul style={styles.chips}>
            {chips.map((c) => (
              <li key={c} style={styles.chip}>
                <Check size={14} color="var(--color-amber)" style={{ flexShrink: 0 }} />
                {c}
              </li>
            ))}
          </ul>
        )}
        {meta && <p style={styles.meta}>{meta}</p>}
      </div>
    </header>
  )
}

const styles = {
  kicker: { display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-amber)' },
  rule: { width: 40, height: 2, backgroundColor: 'var(--color-amber)', margin: '14px 0 18px' },
  h1: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(30px, 4.6vw, 50px)', lineHeight: 1.1, letterSpacing: '-0.015em', color: '#fff', margin: 0 },
  lede: { fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.9vw, 19px)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, margin: '18px 0 0', maxWidth: 620 },
  chips: { listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '10px 18px', padding: 0, margin: '24px 0 0' },
  chip: { display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 500, color: 'rgba(255,255,255,0.9)' },
  meta: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '20px 0 0' },
}
