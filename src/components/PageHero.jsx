// PageHero.jsx
// Photo-led entrance for the listing pages (Tours, Journal, Journeys) — the
// editorial counterpart to InfoHero's flat green field. A full-bleed photo
// under a deep-green scrim, with the brand's amber kicker-and-rule signature
// and a Newsreader headline, left-aligned to the same 1100px column as the
// content grids below.
//
//   <PageHero image="/uploads/…" kicker="…" title="…" lede="…" overlap>
//     {…optional row under the lede: search bar, chips…}
//   </PageHero>
//
// `overlap` adds bottom padding so the floating filter card on Tours/Journeys
// can pull up over the photo's lower edge. `focal` tunes the crop
// (objectPosition) per photo.

import Img from './Img'
import useWindowWidth from '../hooks/useWindowWidth'

export default function PageHero({ image, imageAlt = '', focal = 'center', kicker, title, lede, overlap = false, children }) {
  const isMobile = useWindowWidth() <= 768

  return (
    <header style={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'var(--color-forest-deep)',
    }}>
      <Img
        src={image}
        alt={imageAlt}
        eager
        sizes="100vw"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: focal,
        }}
      />

      {/* Directional scrim — heavy over the text column, easing off so the
          photo stays legible on the right; vertical on mobile where the text
          spans the full width. */}
      <div aria-hidden style={{
        position: 'absolute',
        inset: 0,
        background: isMobile
          ? 'linear-gradient(to bottom, rgba(10,24,18,0.72) 0%, rgba(10,24,18,0.58) 55%, rgba(10,24,18,0.78) 100%)'
          : 'linear-gradient(100deg, rgba(10,24,18,0.88) 0%, rgba(10,24,18,0.66) 42%, rgba(10,24,18,0.30) 72%, rgba(10,24,18,0.18) 100%)',
      }} />
      {/* Bottom anchor — grounds the overlapping filter card and keeps the
          hero's lower edge from clipping bright photo areas. */}
      <div aria-hidden style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(10,24,18,0.6) 0%, transparent 38%)',
      }} />

      <div style={{
        position: 'relative',
        maxWidth: 1100,
        margin: '0 auto',
        // Kept deliberately compact on desktop: on a 13" laptop the filter
        // card and the top of the results grid must stay inside the first
        // viewport, or filtering looks like it does nothing.
        padding: isMobile
          ? `48px 24px ${overlap ? 88 : 48}px`
          : `60px 40px ${overlap ? 116 : 72}px`,
      }}>
        {kicker && <span style={styles.kicker}>{kicker}</span>}
        <div aria-hidden style={styles.rule} />
        <h1 style={styles.h1}>{title}</h1>
        {lede && <p style={styles.lede}>{lede}</p>}
        {children && <div style={{ marginTop: 22 }}>{children}</div>}
      </div>
    </header>
  )
}

const styles = {
  kicker: { display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-amber)', textShadow: '0 1px 12px rgba(0,0,0,0.35)' },
  rule: { width: 40, height: 2, backgroundColor: 'var(--color-amber)', margin: '14px 0 18px' },
  h1: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(32px, 4.6vw, 50px)', lineHeight: 1.08, letterSpacing: '-0.015em', color: '#fff', margin: 0, maxWidth: 720, textShadow: '0 2px 24px rgba(0,0,0,0.3)' },
  lede: { fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.9vw, 18.5px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, margin: '14px 0 0', maxWidth: 560, textShadow: '0 1px 16px rgba(0,0,0,0.3)' },
}
