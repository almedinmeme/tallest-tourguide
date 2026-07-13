# Implementation Plan — Design System Scale-Up & Button/CTA Consolidation

**Target codebase:** `tallest-tourguide` (React 19 + Vite, `src/` with `components/`, `pages/`, `data/`, `index.css`)
**Prepared from:** the Tallest Tourguide Design System project (tokens, preview cards, UI kit) + a review of the live `tallesttourguide.com`.

---

## 0. About these files

The HTML files in this bundle are **design references**, not production code to paste. Your job is to apply the rules below to the **existing React codebase** using its established patterns — inline `styles` objects keyed off CSS variables in `src/index.css`. Nothing here changes the framework. Fonts stay as they are (Plus Jakarta Sans / Inter / Fraunces). This is a **consistency + structure** pass, not a re-skin.

Fidelity: **hi-fi** for the button system and tokens (use the exact values). **Structural** for the scaling/architecture sections (adapt to the codebase).

---

## 1. Why this work exists (the problem)

The design system was written for a single-guide Sarajevo day-tour site. The live site is now a multi-country boutique travel house (Journeys up to €4,490 / 15 days / 5 countries, a Destinations mega-nav, *Gostoprimstvo*, The Journal, For Travel Professionals). Three concrete symptoms:

1. **Too many buttons, no system.** Counted in the codebase: hero primary, hero secondary, nav Contact, `viewAllBtn`, TourCard `viewTourBtn`, CTABanner primary/secondary, About `primaryBtn`/`secondaryBtn`, Footer TripAdvisor card, PackagesPreview `ctaBtn`. Each is hand-styled inline. No shared component.
2. **Sizes drift.** Button heights observed: **34, 36, 44, 48, 52px** — five sizes, chosen ad hoc per file.
3. **Corner radius drifts page to page.** Most buttons use `--radius` (8px), but the TourCard CTA is a **100px pill**, the nav Contact mixes border treatments, and the "Redefined" explorations introduced more pills. The pill vs. 8px decision is currently made per-component, not by rule.

This plan fixes all three with one shared `<Button>` component and a locked token set, then sets up a folder/token structure that scales to the larger site.

---

## 2. THE BUTTON SYSTEM (do this first — highest impact)

### 2.1 The rules (memorise these)

- **3 variants only:** `primary` (amber fill), `secondary` (forest-green ghost → fills on hover), `tertiary` (text link with underline reveal).
- **3 sizes only:** `sm 44px`, `md 48px`, `lg 56px`. Default to `md`. `sm` in dense rows (cards, nav). `lg` for hero + page-level primary CTAs.
- **ONE radius: 8px (`--radius`) on every action button.** No pills for actions, ever. The 100px pill is reserved for **non-action chips only** (tags, filters, the live indicator, on-photo location/price overlays).
- **One `primary` per view.** If a screen has two amber buttons, one of them is wrong — demote it to `secondary`.
- **Icon + label gap is always `--btn-gap` (10px).** Arrow icon trails the label on forward actions (`Explore Tours →`).

### 2.2 Tokens (already added to the design system `index.css` — port these verbatim)

```css
/* RADII — action buttons ALWAYS use --radius */
--radius-sm:   4px;    /* badges, status chips */
--radius:      8px;    /* ALL buttons + inputs — canonical */
--radius-md:  12px;    /* cards */
--radius-lg:  14px;    /* dropdowns, panels */
--radius-pill:100px;   /* chips/tags/indicators — NOT buttons */

/* BUTTON SYSTEM */
--btn-sm: 44px;  --btn-pad-sm: 18px;  --btn-font-sm: 13px;
--btn-md: 48px;  --btn-pad-md: 24px;  --btn-font-md: 15px;
--btn-lg: 56px;  --btn-pad-lg: 32px;  --btn-font-lg: 16px;
--btn-radius: var(--radius);   /* 8px — single source of truth */
--btn-gap: 10px;

/* button shadows (amber primary only) */
--shadow-button-amber:       0 2px 8px  rgba(244,161,48,0.25);
--shadow-button-amber-hover: 0 8px 24px rgba(244,161,48,0.45);
```

### 2.3 Build one component: `src/components/Button.jsx`

Replace every hand-styled button with this. Signature:

```jsx
<Button variant="primary|secondary|tertiary"
        size="sm|md|lg"
        to="/tours"            // renders react-router <Link>
        href="https://…"       // renders <a> (external)
        onClick={fn}           // renders <button>
        iconRight={<ArrowRight size={16} />}
        iconLeft={null}
        disabled={false}
        fullWidth={false}
        onDark={false}>        // hero/footer surfaces
  Explore Tours
</Button>
```

Behavioural spec (port exactly):

| Variant | Default | Hover | Notes |
|---|---|---|---|
| primary | `--color-amber` bg, `--color-n900` text, amber shadow | bg `#E8920A`, `translateY(-2px)`, deeper amber shadow | disabled → `--color-n300` bg, `--fg-3` text, no shadow |
| secondary | transparent, `1.5px` forest border, forest text | fill forest green, text `#fff` | on dark: white 30% border/text → translucent-white fill |
| tertiary | no box, forest text, weight 700 | underline grows in (`box-shadow: inset 0 -1.5px 0`) | for inline/card-footer links |

All variants: `height: var(--btn-{size})`, `padding: 0 var(--btn-pad-{size})`, `border-radius: var(--btn-radius)`, `gap: var(--btn-gap)`, `transition: all 250ms var(--ease-out-quart)`.

### 2.4 Migration map (replace these, file by file)

| File | Current button | New |
|---|---|---|
| `pages/Home.jsx` | hero `heroPrimaryBtn` (52px) | `<Button variant="primary" size="lg" iconRight>` |
| `pages/Home.jsx` | hero `heroSecondaryBtn` | `<Button variant="secondary" size="lg" onDark>` |
| `pages/Home.jsx` | `viewAllBtn` (52px, 2px border) | `<Button variant="secondary" size="md">` |
| `components/TourCard.jsx` | `viewTourBtn` **(100px pill, 34px)** | `<Button variant="tertiary" size="sm">` — **kills the pill** |
| `components/CTABanner.jsx` | `primaryBtn` / `secondaryBtn` (48px) | `primary md` / `secondary md` |
| `components/PackagesPreview.jsx` | `ctaBtn` (44px) | `primary sm` or `md` |
| `components/Navbar.jsx` | `contactBtn` (36px amber outline) | this is the **nav CTA** → `primary sm`, becomes "Plan Your Trip" (see §4) |
| `pages/About.jsx` | `primaryBtn` / `secondaryBtn` | `primary md` / `secondary md` |
| `pages/Contact.jsx`, `PersonalisedTour.jsx` | submit buttons | `primary lg`, `fullWidth` |

After migration, grep the codebase for `borderRadius: '100px'` and `borderRadius: 'var(--radius-pill)'` — every remaining hit must be a chip/tag/indicator, not an action.

---

## 3. RADIUS & SHAPE CONSISTENCY (second pass)

Audit every `borderRadius` in `src/`. Map each to the canonical scale — there should be **no raw pixel radii left**:

- `4px` → `--radius-sm` (badges only)
- `6px` → consolidate **up to `--radius` (8px)** for inputs / price pills, OR down to `--radius-sm` for tiny chips. Pick one per element type and document it.
- `8px` → `--radius` (buttons, inputs)
- `12px` → `--radius-md` (cards)
- `14px` → `--radius-lg` (dropdowns)
- `100px` → `--radius-pill` (chips/tags/indicators **only**)

Specific fixes: TourCard outer card is `12px` ✓ keep; its CTA pill → 8px (done in §2). Footer TripAdvisor card `12px` ✓. Inputs across Contact/Personalised vary `6px`/`8px` → standardise to `8px`.

---

## 4. NAVIGATION — align to the live IA

The codebase nav is `Home · Tours ▾ · Packages ▾ · About · Blog · Contact`. The live site has outgrown it. Restructure `components/Navbar.jsx`:

- `Home` → fold into logo click (logo always routes `/`).
- **Where to Go** ▾ — Destinations mega-menu (Sarajevo · Mostar & Herzegovina · The Mountains · Beyond Bosnia). New 2-col mega panel with 38px thumbnails (see `preview/nav-item.html`).
- **Day Tours** ▾ — the current Tours dropdown, renamed.
- **Journeys** ▾ — was "Packages". Needs the new Journey data model (§5).
- **The Journal** — was "Blog".
- **Discover** ▾ — Our Story · *Gostoprimstvo* · Where We Stay · Signature Experiences · Plan Your Trip · For Travel Professionals.
- Nav CTA: **"Plan Your Trip"** (`<Button variant="primary" size="sm">`), replaces "Contact".

Keep the existing hover-intent timing logic and the `nav-trigger` underline animation — those are good. Just restructure the items and swap the CTA to the shared `<Button>`.

---

## 5. DATA MODEL — Tours vs. Journeys

`src/data/tours.js` is a flat array. The site now has two distinct products that currently share one card treatment, which flattens a €4,490 journey into the same visual weight as a €30 walk.

1. Split into `src/data/tours.js` (day tours) and **`src/data/journeys.js`** (multi-day).
2. Journey object adds: `days`, `stops`, `countries` (array of country codes), `pace` (`Easy|Moderate|Challenging`), plus existing `price`, `hero`, `title`, `subtitle`.
3. Build **`src/components/JourneyCard.jsx`** — horizontal, more editorial, with a `specs` strip (Days · Stops · Pace · Max guests) and a country-flag row. Reference: `preview/journey-card.html`. Day tours keep the existing `TourCard`.
4. Update pricing to live values (Walking €30, Mostar €75, Lukomir €80, Cooking €55, Morning €15) and reconcile the mismatch between nav-dropdown prices and detail-page prices.

---

## 6. STRUCTURE FOR SCALING (the architecture pass)

Set the codebase up so adding pages/products doesn't reintroduce drift:

1. **Promote shared primitives into `src/components/ui/`:** `Button.jsx`, `Eyebrow.jsx` (the uppercase tracked label, repeated ~12×), `SectionHeader.jsx` (eyebrow + h2 + subtitle, repeated on every page), `Badge.jsx`, `Chip.jsx`, `Stat.jsx` (the number+label pair used in hero/About/trust bar). Each reads tokens only — no hard-coded hex.
2. **Stop re-declaring `const styles = {}` per file.** Move repeated section scaffolding (`pageHeader`, `eyebrow`, `sectionHeader`, `cardGrid`) into the shared primitives so a new page composes them instead of copy-pasting 80 lines of style objects.
3. **Token discipline:** no raw hex in components. Everything routes through `src/index.css` variables. Add a lint rule or a PR checklist item: "no `#hex`, no raw `px` radius, no new button height."
4. **One spacing rhythm:** section padding is currently `80px 40px` / `88px 40px` / `96px 40px` / `72px 40px` across files. Pick a scale (`--space-20`/`--space-24` vertical, `--space-10` horizontal) and apply uniformly.
5. **Mobile:** add an intermediate breakpoint (the codebase only has 768px). Journey/Destination pages are long — add a `~1024px` step and a sticky mobile "Plan Your Trip" bar.

---

## 7. CONTENT / BRAND MATURITY (lighter-touch, do alongside)

- Reserve amber strictly for the single primary action per view (it's currently also on stars, badges, pills, sparkles — see §2.1 + §3).
- Say the trust numbers (4.9 · 180 reviews · 5000+ guests · Max 12) **once, prominently**, not three times before the fold.
- British spelling stays (*Personalised*, *enquiry*). Use live nomenclature: *Journeys*, *The Journal*, *Day Tours*, *Plan Your Trip*. Keep *Gostoprimstvo* italic and untranslated.
- Keep Fraunces locked to hero/editorial only — don't let it leak into UI headings.

---

## 8. Suggested sequencing (PRs)

1. **PR1 — Tokens.** Port the button/radius tokens into `src/index.css`. No visual change yet.
2. **PR2 — `<Button>`.** Build it; migrate Home + CTABanner + TourCard first (highest traffic). Verify the pill is gone.
3. **PR3 — Radius audit.** Sweep all `borderRadius`, map to scale.
4. **PR4 — Shared primitives.** `ui/` folder: Eyebrow, SectionHeader, Badge, Chip, Stat.
5. **PR5 — Nav IA + Plan Your Trip CTA.**
6. **PR6 — Journeys data model + JourneyCard.**
7. **PR7 — Spacing rhythm + mobile breakpoint + sticky CTA.**

PR1–PR3 alone resolve the button/size/radius inconsistency you flagged. PR4–PR7 are the scaling structure.

---

## 9. Files in this bundle

- `colors_and_type.css` — the full token set (port relevant vars into `src/index.css`).
- `buttons.html` — canonical button spec (variants × sizes × states, dark variant).
- `nav-item.html` — target nav IA + Destinations mega-menu.
- `journey-card.html` — JourneyCard reference.
- `tour-card.html` — current day-tour card (keep).
- `README` of the design system project — full brand/voice/visual foundations, if you need deeper context.

Design tokens, exact hex, type scale, shadows and motion are all in `colors_and_type.css` — treat that file as the source of truth.
