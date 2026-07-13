# Design System ← Site Sync (reverse hand-off)

**Direction:** _site → design system_ (the opposite of `design_handoff_design_system_scaleup/`, which goes system → site).
**Captured:** 2026-06-24, from the live `tallest-tourguide` codebase.
**Compared against:** `design_handoff_design_system_scaleup/colors_and_type.css` (the design system's stated source of truth).
**Purpose:** paste this into the Claude design-system project so the system is re-baselined on what the site **actually** is today, *before* any further scale-up work. Read-only audit — no site code was changed to produce this.

Source files read: `src/index.css` (token layer), `index.html` (font loading), plus a full `borderRadius` / button-height grep across `src/components` and `src/pages`.

---

## TL;DR — what actually drifted

1. **Hero/editorial font changed: Fraunces → Newsreader.** Deliberate (the CSS comment says so). The design system still says Fraunces. This is the single most visible divergence.
2. **`--text-display` is 48px on the site, not 56px.** Several other type metrics shifted too (line-heights up, micro/h2/tight leading + all tracking tokens absent).
3. **The whole button-token system in the design system does not exist on the site.** No `--btn-*` tokens, no shared `<Button>`. Buttons are utility classes + per-component inline styles, and heights sprawl across **11 values** (30–52px). The design system's canonical `56px lg` is used **nowhere**.
4. **Radius scale diverged both ways.** Site adds `--radius-xl: 20px`, redefines `--radius-lg` as **16px** (system says 14px), and never declares `--radius-sm` (4px) or `--radius-md` (12px) — yet `12px` is hardcoded 25× and `4px` 9×. Pills are hardcoded `100px` (48×) far more than the `--radius-pill` token (4×).
5. **Neutral scale expanded** on the site (added `n200/n400/n500/n800`).
6. **Shadows and motion use a different model** on the site (numeric `--shadow-sm…xl` + combined duration-easing `--t-fast/base/lift`) than the design system's named/semantic tokens.
7. **`--color-deep-green` and `--color-mint-wash` aren't tokens on the site.** Mint-wash (`#F0F7F4`) is hardcoded; the dark surface uses `--color-forest-deep/--color-forest-darker` instead of `deep-green`.
8. The site's `index.css` also carries a **large component-CSS layer** the design system file doesn't model at all (nav mega-menu, blog/rich-text editorial typography, itinerary cards, focus rings, hover utilities).

Legend used below: ✅ match · ✏️ changed value · ➕ new on site (system should adopt) · ⬜ in system, absent on site (system should drop or the site should adopt).

---

## 1. Colors

| Token | Design system | Live site | Status |
|---|---|---|---|
| `--color-forest-green` | `#2E7D5E` | `#2E7D5E` | ✅ |
| `--color-mid-green` | `#4AA880` | `#4AA880` | ✅ |
| `--color-amber` | `#F4A130` | `#F4A130` | ✅ |
| `--color-amber-light` | `#FDE9C3` | `#FDE9C3` | ✅ |
| `--color-n900` | `#1A1A2E` | `#1A1A2E` | ✅ |
| `--color-n600` | `#4A5568` | `#4A5568` | ✅ |
| `--color-n300` | `#CBD5E0` | `#CBD5E0` | ✅ |
| `--color-n100` | `#F7F9FC` | `#F7F9FC` | ✅ |
| `--color-n000` | `#FFFFFF` | `#FFFFFF` | ✅ |
| `--color-n800` | — | `#2D3748` | ➕ |
| `--color-n500` | — | `#718096` | ➕ |
| `--color-n400` | — | `#A0AEC0` | ➕ |
| `--color-n200` | — | `#E2E8F0` | ➕ |
| `--color-forest-deep` | — | `#1A3D2B` | ➕ (dark cards) |
| `--color-forest-darker` | — | `#143222` | ➕ |
| `--color-deep-green` | `#0D1F18` | — | ⬜ site uses `forest-deep`/`forest-darker` instead |
| `--color-mint-wash` | `#F0F7F4` | — | ⬜ present, but hardcoded `#F0F7F4` (e.g. CTABanner) not tokenised |
| `--fg-1/2/3`, `--bg-1/2` | aliases | — | ⬜ no fg/bg alias layer on site |
| semantic `success/warning/error/info` | `#38A169 / #DD6B20 / #E53E3E / #3182CE` | identical | ✅ |

**Reconcile:** add `n200/n400/n500/n800` + `forest-deep/forest-darker` to the system; map `deep-green` → `forest-deep` (or retire it); decide whether `mint-wash` becomes a real token (recommended — it's used as a section tint) ; decide whether to keep the `fg/bg` alias layer (site never adopted it).

---

## 2. Typography

### Fonts actually loaded (`index.html`)
- **Newsreader** `opsz 6..72`, wght `300,400,500,600,700` + italic `300,400` — **editorial/hero face (was Fraunces).**
- **Plus Jakarta Sans** wght `400,600,700` (system claimed `400;500;600;700;800` — site loads fewer).
- **Inter** wght `400,500` (system claimed `400;500;600;700` — site loads only `400,500`).

| Token | Design system | Live site | Status |
|---|---|---|---|
| `--font-display` | Plus Jakarta Sans | Plus Jakarta Sans | ✅ |
| `--font-body` | Inter | Inter | ✅ |
| `--font-hero` | **Fraunces** | **Newsreader** | ✏️ deliberate change |
| `--text-display` | `56px` | `48px` | ✏️ |
| `--text-h1` | `40px` | `40px` | ✅ |
| `--text-h2` | `32px` | `32px` | ✅ |
| `--text-h3` | `22px` | `22px` | ✅ |
| `--text-body-l` | `18px` | `18px` | ✅ |
| `--text-body` | `16px` | `16px` | ✅ |
| `--text-small` | `14px` | `14px` | ✅ |
| `--text-tiny` | `12px` | `12px` | ✅ |
| `--text-micro` | `11px` | — | ⬜ |
| `--leading-display` | `1.1` | `1.2` | ✏️ |
| `--leading-h1` | `1.2` | `1.25` | ✏️ |
| `--leading-body` | `1.6` | `1.6` | ✅ |
| `--leading-h2` | `1.25` | — | ⬜ |
| `--leading-tight` | `1.3` | — | ⬜ |
| `--tracking-eyebrow` / `-wide` / `--tracking-label` | `2px / 3px / 0.5px` | — | ⬜ eyebrow/letter-spacing values live inline in components, not tokenised |

**Note:** the design system's `.tt-editorial` / `.tt-eyebrow` / `.tt-column-label` helper classes don't exist in `src/index.css`; the equivalents are inline `styles` objects per component.

---

## 3. Spacing

The design system defines a full 8-pt scale (`--space-1 … --space-24` = 4/8/12/16/20/24/32/40/48/64/80/96).
**The site declares none of these tokens.** Spacing is literal px in component style objects (section padding observed as `80/88/96/72px` etc.). Status: ⬜ entire scale unadopted — either drop from the system or commit to retrofitting it (the scale-up plan §6.4 wants the latter).

---

## 4. Radii

| Token | Design system | Live site | Status |
|---|---|---|---|
| `--radius-sm` | `4px` | — | ⬜ (but `4px` hardcoded 9×) |
| `--radius` | `8px` | `8px` | ✅ (most-used: `var(--radius)` 58×) |
| `--radius-md` | `12px` | — | ⬜ (but `12px` hardcoded 25× for cards) |
| `--radius-lg` | `14px` | `16px` | ✏️ value differs |
| `--radius-xl` | — | `20px` | ➕ |
| `--radius-pill` | `100px` | `100px` | ✅ token — but pills are mostly hardcoded `100px` (48×) / `999px` (1×) vs token (4×) |

**Raw `borderRadius` literals still in components/pages (top hits):** `100px`×48, `12px`×25, `16px`×15, `14px`×10, `10px`×13, `8px`×12, `6px`×10, `4px`×9, `2px`×6, `20px`×3, `18px`×1, `3px`×2, `999px`×1.
**Reconcile:** set `--radius-lg` to whichever is real (site is 16px), add `--radius-md: 12px` and keep `--radius-sm: 4px` (both are clearly in use), add `--radius-xl: 20px`. The pill drift (`100px`/`999px` literals) is a usage cleanup, not a token change.

---

## 5. Elevation / shadows

Two different models — they don't line up 1:1.

| Live site (numeric scale) | Value |
|---|---|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,.06)` |
| `--shadow-md` | `0 4px 24px rgba(0,0,0,.08)` |
| `--shadow-lg` | `0 12px 40px rgba(0,0,0,.14)` |
| `--shadow-xl` | `0 20px 60px rgba(0,0,0,.16)` |

| Design system (named/semantic) | Value | On site? |
|---|---|---|
| `--shadow-card` | `0 2px 16px rgba(0,0,0,.08)` | ⬜ (TourCard hardcodes this exact value inline) |
| `--shadow-card-hover` | `0 12px 40px rgba(0,0,0,.16)` | ≈ `--shadow-lg`/`xl` |
| `--shadow-dropdown` | `0 12px 40px rgba(0,0,0,.12)` | ⬜ |
| `--shadow-nav` | `0 8px 24px rgba(0,0,0,.10)` | ⬜ |
| `--shadow-button-amber` / `-hover` | amber glows | ⬜ (amber glow exists as `.btn-glow-amber` class instead) |

**Reconcile:** pick one model. The site's numeric scale is what's actually wired up; the amber-button glow lives in a utility class (`.btn-glow-amber`) rather than a shadow token.

---

## 6. Motion

| Design system | Live site | Note |
|---|---|---|
| `--ease-out-quart: cubic-bezier(.25,.46,.45,.94)` | baked into each `--t-*` | site doesn't expose the curve standalone |
| `--dur-fast .15` | `--t-fast: 0.15s …` | ✅ value |
| `--dur-base .2` | `--t-base: 0.22s …` | ✏️ 0.22 vs 0.20 |
| `--dur-slow .35` | `--t-lift: 0.32s …` | ✏️ 0.32 vs 0.35 |

Site **combines duration + easing** into one token (`--t-fast/base/lift`); the design system keeps them separate. Same easing curve in both.

---

## 7. Button system — the biggest gap

**The design system's entire `--btn-*` token block and shared-`<Button>` premise do not exist on the site.** There is no `src/components/ui/Button.jsx`; buttons are built two ways:

- **Utility classes in `index.css`:** `.btn-lift`, `.btn-glow-amber`, `.btn-glow-green`, `.btn-outline-light`, `.btn-outline-green`, `.btn-overlay`.
- **Per-component inline `styles` objects** (e.g. `CTABanner.primaryBtn/secondaryBtn` at 44px; `TourCard.viewTourBtn` at **34px, `borderRadius: '100px'`** — the exact pill the scale-up plan wants killed).

**Actual button-ish heights in the wild (grep):** `44px`×25, `36px`×12, `34px`×9, `40px`×7, `52px`×6, `48px`×6, `32px`×2, `46/42/38/30px`×1 each → **11 distinct heights.** The design system's canonical `sm/md/lg = 44/48/56` only partially matches: `44` and `48` exist, **`56` is used nowhere**, and `34/36/40/52` are the common off-system sizes.

| Design system token | Value | Reality on site |
|---|---|---|
| `--btn-sm` `/-pad-sm` `/-font-sm` | `44 / 18 / 13` | 44px common; pad/font ad hoc |
| `--btn-md` … | `48 / 24 / 15` | 48px exists |
| `--btn-lg` … | `56 / 32 / 16` | **56px absent**; hero/large CTAs are 52px |
| `--btn-radius` | `var(--radius)` 8px | buttons mix 8px **and** `100px` pills |
| `--btn-gap` | `10px` | inline `6/8px` gaps |

**Reconcile:** this is the one area where the site is *behind* the design system, not ahead of it. Keep the `--btn-*` tokens in the system as the target, but note in the system that `lg` should be **56px** (currently 52px on site) and that the pill on the day-tour card is non-conforming. (This is exactly scale-up plan §2.)

---

## 8. Tokens the design system defines but the site never adopted

Drop from the system, or schedule for adoption — currently dead on the site:
`--space-1…24` · `--text-micro` · `--leading-h2` · `--leading-tight` · `--tracking-eyebrow` / `-wide` / `--tracking-label` · `--fg-1/2/3` · `--bg-1/2` · `--color-mint-wash` (hardcoded instead) · `--color-deep-green` · all `--btn-*` · `--shadow-card/-hover/-dropdown/-nav/-button-amber/-hover` · `.tt-editorial` / `.tt-eyebrow` / `.tt-column-label` helper classes.

---

## 9. Design realities the system file doesn't model yet

`src/index.css` carries a substantial component-CSS layer with no representation in `colors_and_type.css`. If the design system is meant to mirror the site, these are real and should be documented:

- **Nav:** `.nav-trigger` animated underline, `dropdownAppear` / `megaAppear` / `accordionIn` keyframes, `.nav-mega` + `.mega-rail-item` / `.mega-row` (the Destinations mega-menu).
- **Editorial typography:** full `.blog-content` system (Newsreader headings/blockquotes/italics, custom list bullets) and `.rich-content` (TipTap admin output).
- **Cards & interaction:** `.card-lift`, `.tour-card-link` hover, `.pkg-card` poster hover, `.itinerary-card` open/closed states, `.region-card`/`.region-chip`, `.hero-back-pill`, `.chips-scroll`.
- **Forms:** `.contact-input` / `.booking-input` focus rings, global `:focus-visible` ring (`2px forest-green`, offset 3).

---

## 10. Ready-to-paste — site as source of truth

This block is the **site's actual token layer today**, cleaned up for the design system to re-baseline on. Inline comments flag the deltas vs the old design-system file. (Where the site is genuinely behind — the button tokens — I've kept the design system's target values and marked them, so you don't lose that intent.)

```css
:root {
  /* ── BRAND ───────────────────────────── */
  --color-forest-green:  #2E7D5E;
  --color-mid-green:     #4AA880;
  --color-forest-deep:   #1A3D2B;   /* NEW — dark cards (replaces deep-green #0D1F18) */
  --color-forest-darker: #143222;   /* NEW */
  --color-amber:         #F4A130;
  --color-amber-light:   #FDE9C3;
  --color-mint-wash:     #F0F7F4;   /* RE-TOKENISE — currently hardcoded on site */

  /* ── NEUTRALS (expanded on site) ─────── */
  --color-n900: #1A1A2E;
  --color-n800: #2D3748;   /* NEW */
  --color-n600: #4A5568;
  --color-n500: #718096;   /* NEW */
  --color-n400: #A0AEC0;   /* NEW */
  --color-n300: #CBD5E0;
  --color-n200: #E2E8F0;   /* NEW */
  --color-n100: #F7F9FC;
  --color-n000: #FFFFFF;

  /* ── SEMANTIC ────────────────────────── */
  --color-success: #38A169;
  --color-warning: #DD6B20;
  --color-error:   #E53E3E;
  --color-info:    #3182CE;

  /* ── TYPE ────────────────────────────── */
  --font-display: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-hero:    'Newsreader', Georgia, serif;   /* CHANGED from Fraunces */

  --text-display: 48px;   /* CHANGED from 56px */
  --text-h1: 40px;
  --text-h2: 32px;
  --text-h3: 22px;
  --text-body-l: 18px;
  --text-body: 16px;
  --text-small: 14px;
  --text-tiny: 12px;

  --leading-display: 1.2;   /* CHANGED from 1.1 */
  --leading-h1: 1.25;       /* CHANGED from 1.2  */
  --leading-body: 1.6;

  /* ── RADII ───────────────────────────── */
  --radius:      8px;
  --radius-lg:  16px;   /* CHANGED from 14px */
  --radius-xl:  20px;   /* NEW */
  --radius-pill:100px;
  /* RECOMMEND re-adding (in active use, just untokenised): */
  --radius-sm:   4px;   /* badges — hardcoded 9× today */
  --radius-md:  12px;   /* cards  — hardcoded 25× today */

  /* ── ELEVATION (site numeric scale) ──── */
  --shadow-sm: 0 2px 8px  rgba(0,0,0,0.06);
  --shadow-md: 0 4px 24px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.14);
  --shadow-xl: 0 20px 60px rgba(0,0,0,0.16);

  /* ── MOTION (duration+easing combined) ─ */
  --t-fast: 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --t-base: 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94);   /* base 0.22 (was 0.20) */
  --t-lift: 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94);   /* lift 0.32 (was 0.35) */

  --touch-target: 44px;

  /* ── BUTTON SYSTEM — TARGET, not yet built on site ──
     Keep as the to-do: no shared <Button> exists; heights sprawl 30–52px.
     NOTE: site's largest is 52px; design-system lg target is 56px. */
  --btn-sm: 44px;  --btn-pad-sm: 18px;  --btn-font-sm: 13px;
  --btn-md: 48px;  --btn-pad-md: 24px;  --btn-font-md: 15px;
  --btn-lg: 56px;  --btn-pad-lg: 32px;  --btn-font-lg: 16px;
  --btn-radius: var(--radius);
  --btn-gap: 10px;
}
```

---

## How to use this

1. Drop this file into the Claude design-system project as the new baseline input.
2. Have it regenerate `colors_and_type.css` from **§10** so tokens match the live site (Newsreader, 48px display, 16px `--radius-lg`, expanded neutrals, numeric shadows, combined motion tokens).
3. Then re-run the scale-up hand-off (`design_handoff_design_system_scaleup`) **on top of the corrected baseline** — most usefully the button system in §7, which is the only place the site is behind the system rather than ahead of it.
4. Items in **§8** are decisions for you: adopt-on-site or drop-from-system (spacing scale, fg/bg aliases, tracking tokens, `.tt-*` helpers).

_No site code was modified to produce this report. To remove it: delete `design-system-from-site.md`._
