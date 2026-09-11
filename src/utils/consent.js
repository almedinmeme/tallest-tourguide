// consent.js
// The single source of truth for what the visitor has agreed to be tracked
// with. Two consumers: CookieBanner.jsx (the UI) and index.html (which
// replays a stored choice inline, before gtag.js boots, so a returning
// visitor isn't briefly treated as denied).
//
// ── Why localStorage and not a cookie ──────────────────────────────────
// The consent record is read only by our own JavaScript, never by a server,
// so a cookie would buy nothing and would itself need to travel on every
// request. Storing the record is "strictly necessary" either way — it exists
// solely to honour a choice the visitor made, which is the textbook
// exemption. Nothing else is written until they opt in.
//
// IMPORTANT: CONSENT_KEY and CONSENT_VERSION are duplicated as literals in
// index.html's inline bootstrap. That script runs before any module loads,
// so it can't import them. Change one, change the other.

export const CONSENT_KEY = 'tt_consent'

// Bump when the categories change or the policy materially changes what the
// existing categories cover — every stored record below this version is
// treated as absent, and the banner asks again.
export const CONSENT_VERSION = 1

// What a visitor who has agreed to everything looks like. `necessary` isn't
// listed: it is never optional and never gated, so storing it would only
// invite the impression that it could be switched off.
export const ALL_GRANTED = { analytics: true, marketing: true }
export const ALL_DENIED = { analytics: false, marketing: false }

/**
 * The stored choice, or null if this visitor has never answered (or answered
 * under an older version). Never throws — Safari private mode and hardened
 * browser profiles both make localStorage access itself fail.
 */
export function readConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.v !== CONSENT_VERSION) return null
    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      at: parsed.at || null,
    }
  } catch {
    return null
  }
}

/**
 * Record a choice and tell Google about it in the same breath — the two must
 * never drift, so this is the only place that writes either.
 *
 * `at` is an audit trail: under the GDPR the burden of proving consent is on
 * us, and "when" is the half of that a client-side record can actually carry.
 */
export function writeConsent({ analytics, marketing }) {
  const record = {
    v: CONSENT_VERSION,
    analytics: analytics === true,
    marketing: marketing === true,
    at: new Date().toISOString(),
  }
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record))
  } catch {
    // Storage unavailable: the choice still applies to this page view via the
    // gtag update below, we just can't remember it. Asking again next visit
    // is the correct failure mode — the alternative is assuming consent.
  }
  applyConsent(record)
  return record
}

/**
 * Push a consent state into gtag. Safe to call before gtag.js has finished
 * loading: `gtag` is the dataLayer shim defined inline in index.html, so the
 * call queues and replays on load.
 */
export function applyConsent({ analytics, marketing }) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('consent', 'update', {
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
    analytics_storage: analytics ? 'granted' : 'denied',
  })
}

/**
 * Withdrawing has to be as easy as giving (GDPR Art. 7(3)), which in practice
 * means a permanent way back to the banner. The footer's "Cookie settings"
 * link dispatches this; CookieBanner listens for it.
 */
export const CONSENT_REOPEN_EVENT = 'tt:consent:reopen'

export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent(CONSENT_REOPEN_EVENT))
}

/**
 * True while scripts/prerender.mjs is capturing the page. The prerenderer is
 * a real headless browser, so gating the banner on "after mount" isn't enough
 * to keep it out of the static HTML — without this it renders into all 59
 * prerendered pages and flashes on every load until React hydrates and
 * removes it. The flag is set via evaluateOnNewDocument in prerender.mjs.
 */
export function isPrerender() {
  return typeof window !== 'undefined' && window.__PRERENDER__ === true
}
