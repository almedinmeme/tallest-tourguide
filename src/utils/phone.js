// phone.js
// Everything the checkout phone field knows about turning what a guest typed
// into a number we can actually ring. Deliberately free of JSX so it can be
// exercised straight from node — see `npm run test:phone`.
//
// ── Why this exists ───────────────────────────────────────────────────────
// The old check was one regex over `phone.replace(/[\s\-().]/g, '')`, and it
// rejected numbers that were completely valid. The worst offender: iOS and
// macOS wrap a phone number in an invisible U+202A … U+202C pair (LEFT-TO-
// RIGHT EMBEDDING / POP DIRECTIONAL FORMATTING) when you copy it out of
// Contacts. Paste that in and you get a number that looks perfect, fails
// validation, and gives the guest an error they cannot possibly act on —
// on the very last screen before they pay. Same story for the non-breaking
// and narrow spaces browsers leave behind, and for the dozen ways people
// write the country code (+49, 0049, 49, or none at all).
//
// So: never reject what a human would read as a number. Strip the noise,
// work out which country the number belongs to, and only refuse if the
// digit count can't be a phone number at all (ITU-T E.164 caps it at 15).

// The .js is explicit so plain node can import this file for the test script.
import { COUNTRIES, COUNTRY_BY_ISO, MAX_DIAL_LENGTH } from '../data/countries.js'

// Zero-width and directional formatting characters. Invisible in the input,
// fatal to a naive regex. U+202A/U+202C are the Apple copy-paste pair.
const INVISIBLE = /[\u00ad\u200b-\u200f\u2028\u2029\u202a-\u202e\u2060-\u2064\u2066-\u2069\ufeff]/g

// Every space-ish and dash-ish character that isn't the ASCII one.
const ODD_SPACE = /[\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]/g
const ODD_DASH = /[\u2010-\u2015\u2212\uff0d]/g

// Non-ASCII digit systems, mapped back to 0-9 by offset from each block's zero.
const DIGIT_BLOCKS = [0x0660, 0x06f0, 0x0966, 0x09e6, 0xff10]

// What a phone number is allowed to contain once cleaned up. Anything else
// (letters from a pasted "Mobile: ", stray commas) is dropped rather than
// held against the guest.
const ALLOWED = /[^\d+\s()./-]/g

/**
 * Make a pasted or typed string safe to reason about: no invisible
 * characters, ASCII digits, ASCII spaces and dashes, nothing exotic left.
 */
export function sanitisePhoneText(raw) {
  return String(raw ?? '')
    .replace(INVISIBLE, '')
    .replace(ODD_SPACE, ' ')
    .replace(ODD_DASH, '-')
    .replace(/\P{ASCII}/gu, (ch) => {
      const cp = ch.codePointAt(0)
      for (const zero of DIGIT_BLOCKS) {
        if (cp >= zero && cp <= zero + 9) return String(cp - zero)
      }
      return ch
    })
    .replace(ALLOWED, '')
}

/** Just the digits of a string, after sanitising. */
export const digitsOf = (raw) => sanitisePhoneText(raw).replace(/\D/g, '')

/**
 * Which country owns this dialling code? Several countries can share one
 * (+1, +44, +7), so ties go to the country marked primary, then to the
 * first in table order.
 */
function countryForDial(dial) {
  const matches = COUNTRIES.filter((c) => c.dial === dial)
  if (!matches.length) return null
  return matches.find((c) => c.primary) || matches[0]
}

/**
 * Clean up what's left after the dialling code has been taken off the front.
 * Scanning for the code consumes any separators it passes, so "+1 (415) …"
 * leaves an orphaned ")" behind — tidy the loose punctuation at both ends
 * and drop closing brackets that lost their opener.
 */
function tidyRemainder(rest) {
  let out = rest.replace(/^[\s()./-]+/, '').replace(/[\s()./-]+$/, '')
  let opens = 0
  return [...out]
    .filter((ch) => {
      if (ch === '(') opens++
      else if (ch === ')') {
        if (opens === 0) return false
        opens--
      }
      return true
    })
    .join('')
}

/**
 * Read a string written in international form ("+49 178 …", "0049 178 …")
 * and split it into the country it names and the rest of the number.
 * Returns null when the string isn't international, or when its code
 * doesn't match any country yet — the half-typed "+3" case.
 *
 * Separators inside the national part are preserved, so pasting
 * "+49 178 6961924" leaves "178 6961924" in the box rather than a
 * run-together blob.
 */
export function splitInternational(raw) {
  const text = sanitisePhoneText(raw).trim()

  let body
  if (text.startsWith('+')) body = text.slice(1)
  else if (/^0\s*0/.test(text)) body = text.replace(/^0\s*0/, '')
  else return null

  // Walk the string collecting digits until they spell a known dialling
  // code, longest first so +1242 (Bahamas) wins over +1 (US).
  for (let len = MAX_DIAL_LENGTH; len >= 1; len--) {
    let seen = ''
    let i = 0
    for (; i < body.length && seen.length < len; i++) {
      if (/\d/.test(body[i])) seen += body[i]
    }
    if (seen.length < len) continue
    const country = countryForDial(seen)
    if (!country) continue

    // A 0 written straight after the country code is the domestic trunk
    // prefix left in by mistake ("+49 0178 …"); drop it where the country
    // drops it, keep it where the country keeps it (Italy).
    let rest = tidyRemainder(body.slice(i))
    if (country.trunkPrefix === '0') rest = rest.replace(/^0(?=[\s()./-]*\d)/, '')
    return { iso: country.iso, national: rest }
  }
  return null
}

/**
 * The brain behind the number input's onChange. Takes whatever is now in the
 * box plus the country currently showing on the flag, and returns the state
 * the field should move to.
 *
 * The one case that rewrites the field is a full international number being
 * typed or pasted into it: that moves the flag to the right country and
 * keeps only the national part, so "+49 178 6961924" pasted under a US flag
 * becomes 🇩🇪 + "178 6961924" instead of the nonsense "+1 +49178…".
 *
 * A domestic trunk 0 is left alone on screen — deleting characters out from
 * under someone as they type is how these fields earn their reputation. It
 * gets dropped later, in toE164, and the preview under the field shows the
 * guest exactly what we ended up with.
 */
export function applyPhoneInput(raw, currentIso) {
  const split = splitInternational(raw)
  if (split) return split
  return { iso: currentIso, national: sanitisePhoneText(raw) }
}

/**
 * Compose the stored number: E.164, digits only, no spaces — the form every
 * dialler, WhatsApp link and CRM accepts without argument.
 * Returns '' when there's nothing to compose.
 */
export function toE164({ iso, national }) {
  const country = COUNTRY_BY_ISO[iso]
  let digits = digitsOf(national)
  if (!country || !digits) return ''

  // Drop the domestic trunk prefix, but never so far that nothing is left —
  // a half-typed number should stay half-typed, not become garbage.
  const trunk = country.trunkPrefix
  if (trunk && digits.startsWith(trunk) && digits.length - trunk.length >= 4) {
    digits = digits.slice(trunk.length)
  }
  return `+${country.dial}${digits}`
}

// ITU-T E.164: 15 digits maximum including the country code. The floor is
// set at 7 because the shortest real numbers in the table (Niue, Tokelau)
// land there — anything under that is a typo, not a phone number.
const MIN_E164_DIGITS = 7
const MAX_E164_DIGITS = 15

/**
 * Validate the field. Empty is fine — the phone is optional and always has
 * been; making it a hard requirement is a bounce, not a lead.
 */
export function validatePhone({ iso, national }) {
  if (!digitsOf(national)) return { ok: true, e164: '' }

  const country = COUNTRY_BY_ISO[iso]
  if (!country) return { ok: false, message: 'Please choose your country' }

  const e164 = toE164({ iso, national })
  const count = e164.length - 1 // drop the leading +

  if (count < MIN_E164_DIGITS) {
    return { ok: false, message: `That looks too short for a +${country.dial} number` }
  }
  if (count > MAX_E164_DIGITS) {
    return { ok: false, message: 'That looks too long — check for an extra digit' }
  }
  return { ok: true, e164 }
}

/**
 * Best guess at the guest's country from their browser locale, so the flag
 * is usually right before they touch it. Falls back rather than throwing on
 * anything unexpected, including a prerender pass with no navigator.
 */
export function detectCountry(fallback = 'US') {
  try {
    if (typeof navigator === 'undefined') return fallback
    const tags = navigator.languages?.length ? navigator.languages : [navigator.language]
    for (const tag of tags) {
      if (!tag) continue
      const region = new Intl.Locale(tag).maximize().region
      if (region && COUNTRY_BY_ISO[region]) return region
    }
  } catch {
    /* locale parsing is a nicety — never let it break the field */
  }
  return fallback
}
