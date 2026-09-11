// CookieBanner.jsx
// The consent prompt that decides whether Google Analytics and the Google Ads
// conversion tag may write identifiers. The tags themselves default to denied
// for EEA/UK/CH visitors in index.html; this is the UI that lifts that.
//
// ── The glass, and why it's 84% and not 15% ───────────────────────────
// Textbook glassmorphism is a 10–20% translucent fill. That cannot work here:
// this card floats over a dark photo hero on the homepage AND over white
// article pages, so the backdrop is unknowable and the text contrast would
// swing with it. At 84% the frosted character survives — you still see colour
// and movement blur through it — while the worst realistic backdrop (a near
// black photo) still leaves every piece of text above its WCAG floor:
//
//   title    n900  on worst-case glass   9.4:1
//   body     n700  on worst-case glass   5.3:1
//   links    #17492F                     5.7:1   (see .btn--on-glass note)
//   Accept   n900 on amber               8.1:1
//
// Standard forest green measured 3.35:1 here and was replaced — that's what
// the deeper #17492F is for, not a whim. If the fill opacity ever drops,
// re-measure all four; they scale with it.
//
// ── Other decisions worth knowing about ───────────────────────────────
// • Bottom-centred, no scrim. A modal would block a photo-led homepage until
//   answered — a real bounce cost for no legal gain.
// • Accept is the solid amber primary; "Essential only" is the outline
//   secondary. Same height, same minimum width, side by side, one click each.
//   Only the fill differs, and that is the deliberate limit: what actually
//   invalidates consent is refusal costing an extra click or dropping to a
//   text link. Whoever edits this next — the two keep matching geometry and
//   click count, whatever the fills become.
// • No close button, and dismissing is not consent.
// • Shown to everyone, not just the EEA. Geo-detecting would need an IP
//   lookup we don't have, and getting it wrong means an EU visitor silently
//   never sees a prompt. The tag defaults are already region-scoped.
// • Renders nothing under the prerenderer (isPrerender). Puppeteer is a real
//   browser and runs effects, so without that check the card is baked into
//   all 59 static pages and flashes on load for visitors who answered months
//   ago.

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import useWindowWidth from '../hooks/useWindowWidth'
import {
  readConsent,
  writeConsent,
  isPrerender,
  ALL_GRANTED,
  ALL_DENIED,
  CONSENT_REOPEN_EVENT,
} from '../utils/consent'

// Deep forest — the brand green darkened until it clears 4.5:1 on the glass.
// See the .btn--on-glass rule in index.css for the measurement.
const GLASS_GREEN = '#17492F'

// Terse by design — this is a card, not a page. The full detail is one click
// away in /privacy, which is where anyone who actually wants it goes.
const CATEGORIES = [
  {
    key: 'necessary',
    title: 'Strictly necessary',
    body: 'Remembers this choice and keeps your booking in progress. Never used to track you.',
    locked: true,
  },
  {
    key: 'analytics',
    title: 'Analytics',
    body: 'Google Analytics — which pages people read. Totals, never individuals.',
  },
  {
    key: 'marketing',
    title: 'Advertising',
    body: 'Google Ads — which adverts led to a real booking.',
  },
]

function Toggle({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      // The visible track is 38×22, but the hit area is padded out to the
      // 44px minimum touch target. Shrinking the target to match the artwork
      // is the most common way switches become unusable on a phone.
      style={{
        width: 44,
        height: 44,
        margin: '-11px 0 -11px -3px',
        flexShrink: 0,
        background: 'none',
        border: 'none',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <span style={{
        width: 38,
        height: 22,
        borderRadius: 999,
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: checked ? 'flex-end' : 'flex-start',
        // A translucent "off" track disappears against the glass, so both
        // states are solid.
        backgroundColor: checked ? GLASS_GREEN : 'rgba(90,70,40,0.30)',
        transition: 'background-color var(--t-base)',
      }}>
        <span style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(60,40,10,0.35)',
        }} />
      </span>
    </button>
  )
}

export default function CookieBanner() {
  const isMobile = useWindowWidth() <= 768

  // Ask only if they've never answered (or answered under an older policy
  // version). Decided in the initial render rather than an effect: main.jsx
  // uses createRoot, not hydrateRoot, so there's no server markup to match
  // and no reason to pay for a second render.
  const [open, setOpen] = useState(() => !isPrerender() && readConsent() === null)
  const [customising, setCustomising] = useState(false)
  const [draft, setDraft] = useState(ALL_DENIED)

  // The footer's "Cookie settings" link, so a choice can always be changed.
  useEffect(() => {
    const reopen = () => {
      setDraft(readConsent() || ALL_DENIED)
      setCustomising(true)
      setOpen(true)
    }
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen)
  }, [])

  if (!open) return null

  const decide = (choice) => {
    writeConsent(choice)
    setOpen(false)
    setCustomising(false)
  }

  // Copy beside the buttons while collapsed; stacked once the category list
  // opens, which needs the full width.
  const horizontal = !isMobile && !customising

  return (
    <div
      className="consent-card"
      role="region"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        left: isMobile ? 12 : '50%',
        right: isMobile ? 12 : 'auto',
        bottom: isMobile ? 12 : 24,
        transform: isMobile ? 'none' : 'translateX(-50%)',
        width: isMobile ? 'auto' : 'min(580px, calc(100vw - 48px))',
        // Above the WhatsApp and scroll-to-top buttons (both z-index 200).
        zIndex: 400,
        maxHeight: isMobile ? 'calc(100vh - 24px)' : 'calc(100vh - 48px)',
        overflowY: 'auto',

        // ── The glass ──
        backgroundColor: 'rgba(253, 233, 195, 0.84)',
        backdropFilter: 'blur(24px) saturate(175%)',
        WebkitBackdropFilter: 'blur(24px) saturate(175%)',
        borderRadius: 20,
        // A bright top edge and a darker underside is what reads as a pane of
        // glass catching light, rather than a flat translucent rectangle.
        border: '1px solid rgba(255,255,255,0.55)',
        boxShadow: [
          '0 24px 64px rgba(60,40,10,0.26)',
          '0 4px 12px rgba(60,40,10,0.10)',
          'inset 0 1px 0 rgba(255,255,255,0.75)',
          'inset 0 -1px 0 rgba(140,100,40,0.12)',
        ].join(', '),
        // fadeInUp carries a translateY that would overwrite the centring
        // transform above, so the desktop card fades and mobile slides.
        animation: isMobile
          ? 'fadeInUp var(--t-base) ease-out'
          : 'consentFadeIn var(--t-base) ease-out',
      }}
    >
      {/* Light-source sheen — the reflection that sells the glass. Purely
          decorative and pointer-transparent so it can never eat a click. */}
      <div aria-hidden style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)',
      }} />
      {/* Brand hairline across the top edge, amber fading into green. */}
      <div aria-hidden style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        pointerEvents: 'none',
        background: `linear-gradient(90deg, var(--color-amber) 0%, ${GLASS_GREEN} 65%, rgba(23,73,47,0) 100%)`,
      }} />

      <div style={{
        position: 'relative',
        padding: isMobile ? '20px 18px' : '22px 24px',
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        alignItems: horizontal ? 'center' : 'stretch',
        gap: horizontal ? 24 : 0,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={styles.title}>Cookies</p>
          <p style={styles.body}>
            Some cookies run bookings. Analytics and advertising only if you agree.
          </p>
          <div style={styles.links}>
            <Link to="/privacy" style={styles.link} onClick={() => setOpen(false)}>
              Privacy &amp; cookies
            </Link>
            {!customising && (
              <button type="button" style={styles.textAction} onClick={() => {
                setDraft(readConsent() || ALL_DENIED)
                setCustomising(true)
              }}>
                Choose what you allow
              </button>
            )}
          </div>

          {customising && (
            <ul style={styles.categoryList}>
              {CATEGORIES.map((c) => (
                <li key={c.key} style={styles.category}>
                  <Toggle
                    label={c.title}
                    checked={c.locked ? true : draft[c.key]}
                    disabled={c.locked}
                    onChange={(next) => setDraft((d) => ({ ...d, [c.key]: next }))}
                  />
                  <div style={{ minWidth: 0 }}>
                    <p style={styles.categoryTitle}>
                      {c.title}
                      {c.locked && <span style={styles.always}>Always on</span>}
                    </p>
                    <p style={styles.categoryBody}>{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Matching geometry, one click each — see the header comment.
            A two-column grid rather than flex on purpose: `1fr 1fr` forces
            both columns to the wider label's width, so "Essential only"
            being a longer string than "Accept" can't quietly make the
            refusal a different size. Copy edits and translation stay safe. */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          flexShrink: 0,
          marginTop: horizontal ? 0 : 18,
        }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => decide(customising ? draft : ALL_GRANTED)}
          >
            {customising ? 'Save choices' : 'Accept'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="btn--on-glass"
            onClick={() => decide(ALL_DENIED)}
          >
            Essential only
          </Button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  title: {
    fontFamily: 'var(--font-hero)',
    fontWeight: 500,
    fontSize: 19,
    color: 'var(--color-n900)',
    margin: '0 0 6px',
    letterSpacing: '-0.01em',
  },
  body: {
    fontFamily: 'var(--font-body)',
    fontSize: 13.5,
    lineHeight: 1.6,
    color: 'var(--color-n700)',
    margin: 0,
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '4px 18px',
    marginTop: 10,
  },
  link: {
    fontFamily: 'var(--font-body)',
    fontSize: 12.5,
    fontWeight: 600,
    color: GLASS_GREEN,
    textDecoration: 'underline',
    textUnderlineOffset: 3,
    whiteSpace: 'nowrap',
  },
  textAction: {
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'var(--font-body)',
    fontSize: 12.5,
    fontWeight: 600,
    color: GLASS_GREEN,
    textDecoration: 'underline',
    textUnderlineOffset: 3,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  categoryList: {
    listStyle: 'none',
    margin: '16px 0 0',
    padding: '15px 0 0',
    borderTop: '1px solid rgba(140,100,40,0.22)',
    display: 'grid',
    gap: 10,
  },
  category: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  categoryTitle: {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: 13,
    color: 'var(--color-n900)',
    margin: '0 0 2px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  always: {
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: GLASS_GREEN,
  },
  categoryBody: {
    fontFamily: 'var(--font-body)',
    fontSize: 12.5,
    lineHeight: 1.55,
    // n600 measured 4.11:1 on the worst-case glass — just under the floor.
    // n700 clears it.
    color: 'var(--color-n700)',
    margin: 0,
  },
}
