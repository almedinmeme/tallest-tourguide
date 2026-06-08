// Editorial.jsx
// Shared building blocks for the brand/editorial pages (Our Story,
// Gostoprimstvo, Signature, For Travel Professionals). Keeps a single
// visual language — Fraunces display type, generous whitespace, the
// existing green/amber palette — so the long-form pages feel of a piece.

import { Link } from 'react-router-dom'
import RichContent from './RichContent'
import useWindowWidth from '../hooks/useWindowWidth'

const MAX = 1180
const MEASURE = 720

// A clearly-marked placeholder slot for photography that will be sourced
// later. Shows the intended aspect ratio and a content note.
export function Placeholder({ ratio = '16/9', label = 'Image', note, rounded = true, minHeight }) {
  return (
    <div
      style={{
        aspectRatio: minHeight ? undefined : ratio,
        minHeight,
        width: '100%',
        borderRadius: rounded ? 'var(--radius-lg)' : 0,
        backgroundColor: 'var(--color-amber-light)',
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(46,125,94,0.06) 0, rgba(46,125,94,0.06) 12px, transparent 12px, transparent 24px)',
        border: '1px dashed rgba(46,125,94,0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        color: 'var(--color-forest-green)',
        textAlign: 'center',
        padding: 16,
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.8 }}>
        {label} · {ratio}
      </span>
      {note && <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, opacity: 0.7, maxWidth: 320 }}>{note}</span>}
    </div>
  )
}

export function EditorialHero({ kicker, heading, subheading, image, variant = 'default', imageNote, backLink }) {
  const width = useWindowWidth()
  const isMobile = width <= 768

  // Big lowercase "word" hero — kept as-is for pages that use it.
  if (variant === 'word') {
    return (
      <header style={{ position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--color-n900)' }}>
        {image ? (
          <img src={image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 20% 0%, #245b46 0%, var(--color-n900) 70%)' }} />
        )}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: image ? 'linear-gradient(180deg, rgba(10,16,20,0.25) 0%, rgba(10,16,20,0.75) 100%)' : 'transparent' }} />
        <div style={{ position: 'relative', maxWidth: MAX, width: '100%', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          {kicker && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-amber)' }}>{kicker}</span>
          )}
          <h1 style={{ fontFamily: 'var(--font-hero)', fontWeight: 300, color: '#fff', margin: '14px 0 0', lineHeight: 1, fontSize: 'clamp(48px, 12vw, 132px)', letterSpacing: '-0.02em', textTransform: 'lowercase' }}>{heading}</h1>
          {subheading && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.86)', maxWidth: 640, margin: '20px auto 0', lineHeight: 1.55 }}>{subheading}</p>
          )}
        </div>
      </header>
    )
  }

  // Default — "framed cinematic": the photo is an inset, rounded frame on a
  // calm mat, with a light grade instead of a murky scrim. The headline sits
  // in its own solid card overlapping the lower edge, magazine-caption style.
  return (
    <header style={{ backgroundColor: 'transparent', padding: isMobile ? '16px 16px 0' : '28px 28px 0' }}>
      <div style={{ position: 'relative', maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: isMobile ? 'clamp(260px, 54vw, 360px)' : 'clamp(420px, 56vh, 560px)', backgroundColor: 'var(--color-n900)', boxShadow: 'var(--shadow-md)' }}>
          {image ? (
            <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 22% 0%, #2f7d5e 0%, var(--color-n900) 72%)' }} />
          )}
          {/* light grade — depth at the base only, no full-frame darkening */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,16,20,0) 58%, rgba(10,16,20,0.26) 100%)' }} />
          {/* thin inner frame line */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-xl)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)', pointerEvents: 'none' }} />
          {backLink && (
            <Link to={backLink.to} className="hero-back-pill" style={{ position: 'absolute', top: 14, left: 14, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, backgroundColor: 'rgba(10,16,20,0.42)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', color: '#fff', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)' }}>
              <span aria-hidden>←</span> {backLink.label}
            </Link>
          )}
          {!image && imageNote && (
            <span style={{ position: 'absolute', bottom: 12, right: 16, fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{imageNote}</span>
          )}
        </div>

        <div style={{ position: 'relative', marginTop: isMobile ? -32 : -72, marginLeft: isMobile ? 0 : 8, maxWidth: isMobile ? undefined : 700, backgroundColor: 'var(--color-forest-deep)', color: '#fff', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px 22px' : '34px 40px', boxShadow: 'var(--shadow-lg)' }}>
          {kicker && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-amber)' }}>{kicker}</span>
          )}
          <h1 style={{ fontFamily: 'var(--font-hero)', fontWeight: 400, color: '#fff', margin: kicker ? '12px 0 0' : 0, lineHeight: 1.08, fontSize: 'clamp(32px, 5vw, 54px)', letterSpacing: '-0.015em' }}>{heading}</h1>
          {subheading && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.82)', maxWidth: 560, margin: '16px 0 0', lineHeight: 1.6 }}>{subheading}</p>
          )}
        </div>
      </div>
    </header>
  )
}

// One long-form block. Layout switches between text-only, image beside text,
// and a full-bleed image with the copy below.
export function ProseSection({ section }) {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const { heading, body, image, imageCaption, layout = 'text' } = section || {}

  const Heading = heading ? (
    <h2 style={styles.h2}>{heading}</h2>
  ) : null

  const Body = (
    <div style={{ maxWidth: layout === 'text' ? MEASURE : undefined }}>
      {Heading}
      <RichContent value={body} htmlClassName="editorial-prose" paragraphStyle={styles.p} />
    </div>
  )

  const Img = image ? (
    <figure style={{ margin: 0 }}>
      <img src={image} alt={imageCaption || ''} style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'block', objectFit: 'cover' }} />
      {imageCaption && <figcaption style={styles.caption}>{imageCaption}</figcaption>}
    </figure>
  ) : (
    <figure style={{ margin: 0 }}>
      <Placeholder ratio="4/5" label="Photo" note={imageCaption || 'Real, documentary-style image'} />
      {imageCaption && <figcaption style={styles.caption}>{imageCaption}</figcaption>}
    </figure>
  )

  if (layout === 'full-image') {
    return (
      <section style={styles.section}>
        <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: 28 }}>
            {image ? (
              <img src={image} alt={imageCaption || ''} style={{ width: '100%', maxHeight: 560, objectFit: 'cover', borderRadius: 'var(--radius-lg)', display: 'block' }} />
            ) : (
              <Placeholder ratio="21/9" label="Full-width photo" note={imageCaption || 'Documentary-style interior / table / hands'} />
            )}
            {imageCaption && <p style={styles.caption}>{imageCaption}</p>}
          </div>
          <div style={{ maxWidth: MEASURE, margin: '0 auto' }}>{Heading}<RichContent value={body} paragraphStyle={styles.p} /></div>
        </div>
      </section>
    )
  }

  if (layout === 'text') {
    return (
      <section style={styles.section}>
        <div style={{ maxWidth: MEASURE, margin: '0 auto', padding: '0 24px' }}>{Body}</div>
      </section>
    )
  }

  // image-left / image-right two-column
  const imageFirst = layout === 'image-left'
  return (
    <section style={styles.section}>
      <div
        style={{
          maxWidth: MAX,
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 24 : 56,
          alignItems: 'center',
        }}
      >
        {!isMobile && imageFirst && <div>{Img}</div>}
        <div>{Body}</div>
        {(isMobile || !imageFirst) && <div>{Img}</div>}
      </div>
    </section>
  )
}

export function PullQuote({ quote, attribution }) {
  if (!quote) return null
  return (
    <section style={{ padding: '40px 24px' }}>
      <blockquote style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', borderTop: '1px solid var(--color-amber)', borderBottom: '1px solid var(--color-amber)', padding: '36px 0' }}>
        <p style={{ fontFamily: 'var(--font-hero)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(22px, 3.4vw, 34px)', lineHeight: 1.35, color: 'var(--color-n900)', margin: 0 }}>
          “{quote}”
        </p>
        {attribution && (
          <cite style={{ display: 'block', marginTop: 18, fontFamily: 'var(--font-body)', fontStyle: 'normal', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--color-forest-green)' }}>
            {attribution}
          </cite>
        )}
      </blockquote>
    </section>
  )
}

export function EndCTA({ label, href, note, outlined = false }) {
  if (!label || !href) return null
  const isHash = href.startsWith('#')
  const isExternal = href.startsWith('http')
  const style = outlined
    ? { ...styles.cta, backgroundColor: 'transparent', color: 'var(--color-forest-green)', border: '1.5px solid var(--color-forest-green)' }
    : styles.cta
  const content = (
    <>
      <span>{label}</span>
      <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>→</span>
    </>
  )
  return (
    <section style={{ padding: '24px 24px 96px', textAlign: 'center' }}>
      {isHash || isExternal ? (
        <a href={href} style={style} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}>{content}</a>
      ) : (
        <Link to={href} style={style}>{content}</Link>
      )}
      {note && <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-n500)', marginTop: 16, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>{note}</p>}
    </section>
  )
}

// Shared wrapper that gives a page its background and a consistent measure.
export function EditorialContainer({ children, max = MAX }) {
  return <div style={{ maxWidth: max, margin: '0 auto', padding: '0 24px' }}>{children}</div>
}

const styles = {
  section: { padding: '44px 0' },
  h2: {
    fontFamily: 'var(--font-hero)',
    fontWeight: 400,
    fontSize: 'clamp(24px, 3.4vw, 36px)',
    lineHeight: 1.2,
    color: 'var(--color-n900)',
    margin: '0 0 20px',
    letterSpacing: '-0.01em',
  },
  p: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    lineHeight: 1.75,
    color: 'var(--color-n800)',
  },
  caption: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--color-n500)',
    margin: '10px 0 0',
    fontStyle: 'italic',
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    height: 54,
    padding: '0 32px',
    backgroundColor: 'var(--color-forest-green)',
    color: '#fff',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: 16,
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
}
