// AnnouncementBar.jsx
// A dismissible strip above the nav for site-wide news that isn't part of any
// one page — a discount, a hiring call, an hours change. Content lives in
// src/data/announcement.json, edited via /admin → Promotions.
//
// Styled like the homepage's closing CTA section: deep forest ground with
// candlelight-amber accents, so the bar reads as part of the brand rather
// than a bolted-on alert. The tone picks the accent — amber for promos
// (kicker + solid white CTA), green for calmer informational notices.
//
// When the admin fills in the "More details" text, a Details trigger appears
// in the bar's right corner and opens a modal with the full story (hiring
// requirements, promo conditions, new opening hours, …).
//
// Dismissal is remembered per message: closing it stores the exact message
// text, so editing the announcement in admin makes it reappear for visitors
// who already dismissed the old one.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ArrowRight, Info, Copy, Check } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'
import Button from './Button'
import announcement from '../data/announcement.json'

const STORAGE_KEY = 'tt-announcement-dismissed'

function isWithinSchedule(a, today) {
  if (a.startDate && today < a.startDate) return false
  if (a.endDate && today > a.endDate) return false
  return true
}

// The details body is plain admin text: blank-line-separated paragraphs,
// with consecutive lines starting with "-" grouped into a bullet list.
function parseDetailsBody(text) {
  const blocks = []
  for (const raw of text.split(/\n{2,}/)) {
    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!lines.length) continue
    const bullets = lines.filter((l) => l.startsWith('- ') || l.startsWith('• '))
    if (bullets.length === lines.length) {
      blocks.push({ type: 'list', items: lines.map((l) => l.replace(/^[-•]\s*/, '')) })
    } else {
      blocks.push({ type: 'p', text: lines.join(' ') })
    }
  }
  return blocks
}

// If the announcement's text mentions one of the active promo codes, that
// code gets a click-to-copy chip in the modal — no extra admin field needed.
function findFeaturedCode() {
  const codes = Array.isArray(announcement.promoCodes) ? announcement.promoCodes : []
  const today = new Date().toISOString().slice(0, 10)
  const hay = [announcement.message, announcement.detailsTitle, announcement.detailsBody]
    .filter(Boolean).join(' ').toUpperCase()
  return codes.find((c) => {
    const code = String(c.code || '').trim()
    if (!code || c.enabled === false) return false
    if (c.startDate && today < c.startDate) return false
    if (c.endDate && today > c.endDate) return false
    return hay.includes(code.toUpperCase())
  }) || null
}

function DetailsModal({ onClose, isMobile }) {
  const [copied, setCopied] = useState(false)

  // Escape closes; page scroll locks while open (same as SearchModal).
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const kicker = (announcement.kicker || '').trim() || 'Announcement'
  const title = (announcement.detailsTitle || '').trim() || (announcement.message || '').trim()
  const blocks = parseDetailsBody((announcement.detailsBody || '').trim())
  const featured = findFeaturedCode()

  const copyCode = () => {
    if (!featured) return
    navigator.clipboard?.writeText(String(featured.code).trim()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  const ctaHref = (announcement.ctaHref || '').trim()
  const hasCta = (announcement.ctaLabel || '').trim() && ctaHref
  const isExternal = ctaHref.startsWith('http')
  const ctaTo = ctaHref.startsWith('/') ? ctaHref : `/${ctaHref}`

  const endDateLabel = announcement.endDate
    ? new Date(`${announcement.endDate}T00:00:00`).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  const pad = isMobile ? '22px' : '36px'

  return (
    <div style={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="menu-appear" style={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header band — same deep forest + candlelight as the bar itself,
            so the modal reads as that bar, unfolded. */}
        <div style={{ ...styles.modalHeader, padding: isMobile ? '24px 22px 20px' : '30px 36px 26px' }}>
          <div style={styles.modalHeaderGlow} aria-hidden />
          <button
            style={styles.modalClose}
            className="announcement-dismiss"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={17} strokeWidth={2} />
          </button>
          <span style={styles.modalKicker}>{kicker}</span>
          <h2 style={{ ...styles.modalTitle, fontSize: isMobile ? '23px' : '27px' }}>{title}</h2>
        </div>

        <div style={{ padding: `${isMobile ? '20px' : '24px'} ${pad} ${isMobile ? '24px' : '30px'}` }}>

          {/* The advertised code, front and centre, one tap to copy. */}
          {featured && (
            <button
              type="button"
              onClick={copyCode}
              className="promo-code-chip"
              style={styles.codeChip}
              title="Copy this code"
            >
              <span style={styles.codeChipCode}>{String(featured.code).trim()}</span>
              <span style={{ ...styles.codeChipAction, color: copied ? 'var(--color-forest-green)' : 'var(--color-n600)' }}>
                {copied
                  ? <><Check size={14} strokeWidth={2.5} /> Copied</>
                  : <><Copy size={14} strokeWidth={2} /> Copy</>}
              </span>
            </button>
          )}
          {featured && (
            <p style={styles.codeChipHint}>
              Paste it at checkout under “Have a referral or promo code?” — the discount shows
              before you pay.
            </p>
          )}

          <div style={styles.modalBody}>
            {blocks.map((b, i) =>
              b.type === 'list' ? (
                <ul key={i} style={styles.modalList}>
                  {b.items.map((item, j) => (
                    <li key={j} style={styles.modalListItem}>
                      <Check size={15} color="var(--color-forest-green)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '4px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={i} style={styles.modalP}>{b.text}</p>
              )
            )}
          </div>

          {(hasCta || endDateLabel) && (
            <div style={styles.modalFooter}>
              {hasCta && (
                <Button
                  {...(isExternal ? { href: ctaHref } : { to: ctaTo })}
                  variant="primary"
                  size="sm"
                  onClick={onClose}
                >
                  {announcement.ctaLabel}
                  <ArrowRight size={15} color="var(--color-n900)" />
                </Button>
              )}
              {endDateLabel && (
                <span style={styles.modalValidity}>Runs until {endDateLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AnnouncementBar() {
  const width = useWindowWidth()
  const isMobile = width <= 640

  const message = (announcement.message || '').trim()
  const active = announcement.enabled && message.length > 0
    && isWithinSchedule(announcement, new Date().toISOString().slice(0, 10))

  const [dismissed, setDismissed] = useState(() =>
    active ? window.localStorage.getItem(STORAGE_KEY) === message : true
  )
  const [detailsOpen, setDetailsOpen] = useState(false)

  if (!active || dismissed) return null

  const onDismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, message)
    setDismissed(true)
  }

  const isAmber = announcement.tone !== 'green'
  const kicker = (announcement.kicker || '').trim()
  const hasDetails = Boolean((announcement.detailsBody || '').trim())
  const ctaHref = (announcement.ctaHref || '').trim()
  const hasCta = (announcement.ctaLabel || '').trim() && ctaHref
  const isExternal = ctaHref.startsWith('http')
  // Internal links go through the router; tolerate a missing leading slash
  // ("tours" → "/tours") since the admin field is free text.
  const ctaTo = ctaHref.startsWith('/') ? ctaHref : `/${ctaHref}`

  const detailsTrigger = hasDetails && (
    <button
      type="button"
      onClick={() => setDetailsOpen(true)}
      className="announcement-details"
      style={styles.detailsTrigger}
    >
      <Info size={13} strokeWidth={2.25} />
      Details
    </button>
  )

  return (
    <>
    <div className="menu-appear" style={{ ...styles.bar, padding: isMobile ? '10px 48px 11px 20px' : '9px 76px' }}>
      <div style={styles.glow} aria-hidden />

      <div style={{ ...styles.inner, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '8px' : '18px' }}>
        <span style={{ ...styles.messageRow, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '3px' : '12px' }}>
          {kicker && (
            <span style={{ ...styles.kicker, color: isAmber ? 'var(--color-amber)' : 'rgba(255,255,255,0.55)' }}>
              {kicker}
            </span>
          )}
          <span style={styles.message}>{message}</span>
        </span>

        {hasCta && (isExternal ? (
          <a
            href={ctaHref}
            className={isAmber ? 'btn-lift' : 'btn-outline-light'}
            target="_blank"
            rel="noreferrer"
            style={isAmber ? styles.ctaAmber : styles.ctaOutline}
          >
            {announcement.ctaLabel}
            <ArrowRight size={12} strokeWidth={2.5} />
          </a>
        ) : (
          <Link
            to={ctaTo}
            className={isAmber ? 'btn-lift' : 'btn-outline-light'}
            style={isAmber ? styles.ctaAmber : styles.ctaOutline}
          >
            {announcement.ctaLabel}
            <ArrowRight size={12} strokeWidth={2.5} />
          </Link>
        ))}

        {/* On mobile the corner is crowded by the dismiss button, so the
            Details trigger joins the stacked content instead. */}
        {isMobile && detailsTrigger}
      </div>

      {/* Right-corner cluster: Details, then dismiss. */}
      {!isMobile && hasDetails && (
        <div style={styles.cornerCluster}>{detailsTrigger}</div>
      )}
      <button
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        className="announcement-dismiss"
        style={styles.dismiss}
      >
        <X size={15} strokeWidth={2} />
      </button>
    </div>

    {detailsOpen && <DetailsModal onClose={() => setDetailsOpen(false)} isMobile={isMobile} />}
    </>
  )
}

const ctaBase = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  flexShrink: 0,
  height: '28px',
  padding: '0 14px',
  fontFamily: 'var(--font-body)',
  fontWeight: '700',
  fontSize: '12px',
  borderRadius: 'var(--radius-pill)',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
}

const styles = {
  bar: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-forest-deep)',
    borderBottom: '1px solid rgba(244,161,48,0.22)',
  },

  // Faint candlelight behind the message — same device as the homepage CTA.
  glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '560px',
    height: '160px',
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(244,161,48,0.13) 0%, transparent 70%)',
    pointerEvents: 'none',
  },

  inner: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    textAlign: 'center',
  },

  messageRow: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  kicker: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '10.5px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },

  message: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '13.5px',
    letterSpacing: '0.1px',
    lineHeight: '1.45',
    color: 'rgba(255,255,255,0.92)',
  },

  // Solid white, not amber — the nav's "Plan Your Trip" already holds the
  // one amber button this viewport gets; the kicker carries the amber note.
  ctaAmber: {
    ...ctaBase,
    backgroundColor: 'var(--color-n000)',
    color: 'var(--color-forest-deep)',
  },

  ctaOutline: {
    ...ctaBase,
    backgroundColor: 'transparent',
    color: 'var(--color-n000)',
    border: '1px solid rgba(255,255,255,0.45)',
  },

  cornerCluster: {
    position: 'absolute',
    right: '40px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
  },

  detailsTrigger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 6px',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    textDecorationColor: 'rgba(255,255,255,0.35)',
    whiteSpace: 'nowrap',
  },

  dismiss: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.75)',
    opacity: 0.9,
  },

  // ── Details modal ──────────────────────────────────────
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(10, 20, 15, 0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 500,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '10vh',
    paddingLeft: '16px',
    paddingRight: '16px',
  },

  modal: {
    position: 'relative',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '20px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '82vh',
    overflowY: 'auto',
  },

  modalHeader: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'var(--color-forest-deep)',
    borderBottom: '1px solid rgba(244,161,48,0.25)',
    flexShrink: 0,
  },

  modalHeaderGlow: {
    position: 'absolute',
    top: '-30%',
    right: '-10%',
    width: '340px',
    height: '220px',
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(244,161,48,0.16) 0%, transparent 65%)',
    pointerEvents: 'none',
  },

  modalClose: {
    position: 'absolute',
    top: '14px',
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    color: 'rgba(255,255,255,0.8)',
    zIndex: 1,
  },

  modalKicker: {
    display: 'block',
    position: 'relative',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    letterSpacing: '2.2px',
    textTransform: 'uppercase',
    color: 'var(--color-amber)',
    marginBottom: '8px',
  },

  modalTitle: {
    position: 'relative',
    fontFamily: 'var(--font-hero)',
    fontWeight: '700',
    color: 'var(--color-n000)',
    lineHeight: '1.18',
    margin: '0 28px 0 0',
  },

  // Click-to-copy promo code — a little ticket: dashed amber edge on a warm
  // ground, code on the left, copy affordance on the right.
  codeChip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(244,161,48,0.09)',
    border: '1.5px dashed rgba(244,161,48,0.55)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },

  codeChipCode: {
    fontWeight: '800',
    fontSize: '16px',
    letterSpacing: '1.5px',
    color: 'var(--color-n900)',
  },

  codeChipAction: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: '700',
    fontSize: '12px',
    flexShrink: 0,
    transition: 'color 0.15s ease',
  },

  codeChipHint: {
    fontFamily: 'var(--font-body)',
    fontSize: '12.5px',
    lineHeight: '1.6',
    color: 'var(--color-n500)',
    margin: '8px 2px 0',
  },

  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '18px',
  },

  modalP: {
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    lineHeight: '1.7',
    color: 'var(--color-n600)',
    margin: 0,
  },

  modalList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  modalListItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '9px',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    lineHeight: '1.6',
    color: 'var(--color-n600)',
  },

  modalFooter: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '14px',
    marginTop: '22px',
    paddingTop: '18px',
    borderTop: '1px solid var(--color-n200)',
  },

  modalValidity: {
    fontFamily: 'var(--font-body)',
    fontSize: '12.5px',
    color: 'var(--color-n500)',
  },
}

export default AnnouncementBar
