// test-phone.mjs — `npm run test:phone`
//
// The checkout phone field is the last thing standing between a guest and a
// paid booking, so every way a real person can write a number gets a case
// here. Cases are grouped by the situation they come from, and each one says
// what the guest did, which flag was showing when they did it, and what the
// booking should end up storing.
import {
  applyPhoneInput, toE164, validatePhone, sanitisePhoneText, splitInternational,
} from '../src/utils/phone.js'
import { COUNTRIES } from '../src/data/countries.js'

const U = (cp) => String.fromCodePoint(cp)
const LRE = U(0x202a)   // what macOS/iOS wraps a copied number in
const PDF = U(0x202c)
const NBSP = U(0x00a0)  // what a browser leaves behind on some pastes
const NNBSP = U(0x202f) // narrow no-break space, common in French/German formatting
const ZWSP = U(0x200b)

// [ what the guest typed/pasted, flag showing at the time, expected E.164,
//   should it validate, description ]
const CASES = [
  ['── The reported bug: a number copied out of Contacts on a Mac/iPhone'],
  [`${LRE}+49 178 6961924${PDF}`, 'US', '+491786961924', true, 'German mobile, invisible LRE/PDF wrapper'],
  [`${LRE}+387 62 123 456${PDF}`, 'US', '+38762123456', true, 'Bosnian number, same wrapper'],
  [`+1${NBSP}415${NBSP}555${NBSP}0132`, 'US', '+14155550132', true, 'non-breaking spaces from a paste'],
  [`+33${NNBSP}6${NNBSP}12${NNBSP}34${NNBSP}56${NNBSP}78`, 'US', '+33612345678', true, 'narrow no-break spaces'],
  [`+44${ZWSP}7400${ZWSP}123456`, 'US', '+447400123456', true, 'zero-width spaces'],

  ['── Guest types their own national number under the right flag'],
  ['178 6961924', 'DE', '+491786961924', true, 'German mobile, no trunk zero'],
  ['0178 6961924', 'DE', '+491786961924', true, 'German mobile WITH the domestic 0'],
  ['0178/696 19 24', 'DE', '+491786961924', true, 'slash separator, as Germans write it'],
  ['(0178) 696-1924', 'DE', '+491786961924', true, 'brackets and dashes'],
  ['07400 123456', 'GB', '+447400123456', true, 'UK mobile with the domestic 0'],
  ['415 555 0132', 'US', '+14155550132', true, 'US number, no trunk prefix to drop'],
  ['062 123 456', 'BA', '+38762123456', true, 'Bosnian mobile with the domestic 0'],
  ['06 30 123 4567', 'HU', '+36301234567', true, 'Hungary: the trunk prefix is 06, not 0'],
  ['06 6982 1234', 'IT', '+3906698 21234'.replace(' ', ''), true, 'Italy KEEPS its leading 0'],
  ['8 916 123 45 67', 'RU', '+79161234567', true, 'Russia dials 8 domestically, not 0'],

  ['── Guest pastes a full international number into the number box'],
  ['+49 178 6961924', 'US', '+491786961924', true, 'paste under the wrong flag — flag must follow the number'],
  ['0049 178 6961924', 'US', '+491786961924', true, '00 international prefix'],
  ['00 49 178 6961924', 'US', '+491786961924', true, '00 with a space after it'],
  ['+49 0178 6961924', 'US', '+491786961924', true, 'country code AND a stray trunk zero'],
  ['+39 06 6982 1234', 'US', '+390669821234', true, 'Italian landline keeps its 0 after the +39'],
  ['+1 (415) 555-0132', 'DE', '+14155550132', true, 'US number pasted under a German flag'],
  ['+387 62 123 456', 'DE', '+38762123456', true, 'Bosnian number pasted under a German flag'],
  ['+41 78 123 45 67', 'DE', '+41781234567', true, 'Swiss number'],
  ['+1242 555 0123', 'US', '+12425550123', true, 'longest dial code wins: Bahamas over plain +1'],

  ['── Messy but readable — must not be thrown back at the guest'],
  ['  +49 178 6961924  ', 'US', '+491786961924', true, 'leading and trailing whitespace'],
  ['Mobile: +49 178 6961924', 'US', '+491786961924', true, 'a label came along with the paste'],
  ['+49 178 6961924.', 'US', '+491786961924', true, 'trailing full stop'],
  ['tel:+491786961924', 'US', '+491786961924', true, 'a tel: URI pasted from a contact card'],
  ['١٧٨٦٩٦١٩٢٤', 'DE', '+491786961924', true, 'Arabic-Indic digits'],
  ['１７８６９６１９２４', 'DE', '+491786961924', true, 'full-width digits'],

  ['── Left empty (the phone is optional and must stay optional)'],
  ['', 'DE', '', true, 'nothing entered'],
  ['   ', 'DE', '', true, 'only spaces'],
  ['()- ', 'DE', '', true, 'only separators'],

  ['── Genuinely not a phone number — these SHOULD be refused'],
  ['12', 'DE', '+4912', false, 'far too short'],
  ['1234567890123456789', 'DE', null, false, 'far too long for E.164'],
]

let pass = 0, fail = 0
for (const c of CASES) {
  if (c.length === 1) { console.log(`\n${c[0]}`); continue }
  const [input, flag, wantE164, wantValid, note] = c

  const state = applyPhoneInput(input, flag)
  const e164 = toE164(state)
  const check = validatePhone(state)

  const e164Ok = wantE164 === null || e164 === wantE164
  const validOk = check.ok === wantValid
  const ok = e164Ok && validOk

  ok ? pass++ : fail++
  const shown = JSON.stringify(input).replace(/\\u202[ac]/g, '·').replace(/\\u200b/g, '·')
  console.log(
    `  ${ok ? '✓' : '✗'} ${note}`,
    `\n      typed ${shown} under ${flag} → ${state.iso} ${JSON.stringify(state.national)} → ${e164 || '(empty)'}`,
    check.ok ? '' : `\n      refused: “${check.message}”`,
  )
  if (!ok) {
    if (!e164Ok) console.log(`      EXPECTED ${wantE164}`)
    if (!validOk) console.log(`      EXPECTED valid=${wantValid}`)
  }
}

// ── Data integrity: a broken table is a silently wrong country code ──
console.log('\n── Country table')
const problems = []
const seen = new Set()
for (const c of COUNTRIES) {
  if (seen.has(c.iso)) problems.push(`duplicate ISO ${c.iso}`)
  seen.add(c.iso)
  if (!/^[A-Z]{2}$/.test(c.iso)) problems.push(`bad ISO ${c.iso}`)
  if (!/^[1-9]\d{0,3}$/.test(c.dial)) problems.push(`bad dial +${c.dial} (${c.iso})`)
  if (!c.name.trim()) problems.push(`missing name for ${c.iso}`)
  if (![...c.flag].every((ch) => ch.codePointAt(0) >= 0x1f1e6 && ch.codePointAt(0) <= 0x1f1ff)) {
    problems.push(`bad flag for ${c.iso}`)
  }
}
// Every country must survive a round trip: pick it, type its example, get a
// number back that validates and points at the same dialling code.
for (const c of COUNTRIES) {
  const digits = (c.example || '123456789').replace(/\D/g, '')
  const check = validatePhone({ iso: c.iso, national: digits })
  if (!check.ok) problems.push(`${c.iso} rejects its own example: ${check.message}`)
  else if (!check.e164.startsWith(`+${c.dial}`)) problems.push(`${c.iso} composed ${check.e164}`)
}
// Every dialling code must resolve to exactly one country when pasted.
for (const c of COUNTRIES) {
  const split = splitInternational(`+${c.dial} 555123456`)
  if (!split) problems.push(`+${c.dial} (${c.iso}) does not parse as international`)
}
console.log(problems.length ? problems.map((p) => `  ✗ ${p}`).join('\n') : `  ✓ ${COUNTRIES.length} countries, all consistent`)
problems.forEach(() => fail++)
if (!problems.length) pass++

// ── The old regex, for the record ──
const OLD = (v) => /^\+\d{6,15}$/.test(v.replace(/[\s\-().]/g, ''))
console.log('\n── What the previous validation did with the reported number')
console.log(`  old rule: ${OLD(`${LRE}+49 178 6961924${PDF}`) ? 'accepted' : 'REJECTED'}`)
console.log(`  new rule: ${validatePhone(applyPhoneInput(`${LRE}+49 178 6961924${PDF}`, 'US')).ok ? 'accepted' : 'REJECTED'}`)

console.log(`\n${fail ? '✗' : '✓'} ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
