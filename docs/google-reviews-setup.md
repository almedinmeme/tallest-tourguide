# Connecting Google Business reviews

The homepage reviews section can show your Google rating, your total Google
review count, and the review texts Google exposes — pulled fresh on every
build by `scripts/sync-google-reviews.mjs`.

The code is already in place. It stays dormant until you give it two things:

1. a **Google Maps Platform API key** (a build-time secret), and
2. your **Place ID** (a public identifier for your business listing).

Until then the section shows your curated reviews only, and the build logs
`[sync-google-reviews] Missing GOOGLE_MAPS_API_KEY` and carries on. Nothing
breaks.

Set aside about 20 minutes. Console screens change wording occasionally — if a
button is named slightly differently than below, look for the nearest match.

---

## Before you start

- You need to be signed in with the Google account that **owns or manages the
  Tallest Tourguide Business Profile**.
- You need a **credit card** for Google Cloud billing. Google requires one on
  the account even when your usage sits inside the free monthly allowance.
- **Cost, realistically:** one API call per site build. Publishing from /admin
  triggers a build, plus the weekly scheduled rebuild — call it 20–100 calls a
  month. Google gives each Places API SKU a free monthly allowance far above
  that, so the expected bill is €0. Check the current rates on Google's Places
  API pricing page before you finish, since Google has changed this model
  before, and set a budget alert in step A6 either way.

---

## Part A — Create the API key

**A1.** Go to <https://console.cloud.google.com/> and sign in.

**A2.** Create a project to keep this separate from anything else:
top bar → the project dropdown → **New project**. Name it something like
`tallest-tourguide-site`. Create it, then make sure that project is the one
selected in the top bar before continuing.

**A3.** Enable billing: left menu → **Billing** → link or create a billing
account for this project. The API returns errors until billing is attached,
even inside the free allowance.

**A4.** Enable the right API: left menu → **APIs & Services** → **Library** →
search for **Places API (New)** → open it → **Enable**.

> Take care here. There are two similarly named products: the legacy
> "Places API" and **"Places API (New)"**. The sync script uses the *new* one
> (`places.googleapis.com`). Enabling only the legacy one gives you a
> 403 later.

**A5.** Create the key: **APIs & Services** → **Credentials** →
**+ Create credentials** → **API key**. Copy the key it shows you and keep it
somewhere safe for a minute — you'll paste it into `.env` in Part C.

**A6.** Restrict the key (do this now, not later) — click **Edit API key**:

- **API restrictions** → *Restrict key* → tick **Places API (New)** only.
- **Application restrictions** → leave as **None**.
  This key is used from a build server whose IP changes, so a referrer or IP
  restriction would break the build. The API restriction above is what keeps
  the key useful only for this one purpose.
- Rename it to something recognisable, e.g. `places-reviews-build`.
- **Save.**

While you're here: **Billing → Budgets & alerts → Create budget**, set it to a
few euros, so you're emailed if usage ever behaves unexpectedly.

**Never** paste this key into site code, a component, or any variable starting
with `VITE_` — that prefix ships it to every visitor's browser. It belongs only
in `.env` and the Netlify environment.

---

## Part B — Find your Place ID

A Place ID looks like `ChIJrTLr-GyuEmsRBfy61i59si0` — a public identifier, not
a secret. Any of these work:

**Option 1 — Place ID Finder (most reliable).**
Open <https://developers.google.com/maps/documentation/places/web-service/place-id>,
scroll to the *Place ID Finder* map, search for **Tallest Tourguide** in its
search box, click your listing, and copy the ID from the popup.

**Option 2 — from your Business Profile.**
Search your business name on Google while signed in as its manager, open the
profile, and use *Share* → the resulting link. If the link is a short
`maps.app.goo.gl` URL, open it first so it expands; you're looking for a value
starting with `ChIJ`.

**Option 3 — ask me.** Paste the API key into `.env` (Part C), tell me, and I
can run a lookup by business name and confirm the exact ID.

Verify you've got the right listing — the one with your real review count on
it, not a duplicate or an unclaimed copy.

---

## Part C — Wire it up locally and test

**C1.** Open `.env` in the project root (create it by copying `.env.example` if
it doesn't exist) and add the key on its own line:

```
GOOGLE_MAPS_API_KEY=AIza…your key…
```

`.env` is gitignored, so this never leaves your machine.

**C2.** Start the admin (`npm run dev`), go to
**<http://localhost:5173/admin/settings>** → *Social & review profiles* →
paste the Place ID into **Google Place ID**. Optionally set **Google reviews
URL** if you want the "Read reviews on Google" button to point somewhere
specific; left empty it uses your Google Maps listing. **Save**.

**C3.** In a terminal, run the sync:

```
npm run sync:google
```

Success looks like:

```
[sync-google-reviews] wrote 5 reviews, 4.9 ★ from 214 ratings → src/data/google/reviews.json
```

If instead you see a warning line, jump to *Troubleshooting* below. The script
never fails your build — it warns and keeps the previous file.

**C4.** Look at the result: open <http://localhost:5173/> and scroll to the
reviews section. You should now see a **Google** tile next to the Tripadvisor
one in the header, and Google review cards mixed in with your curated ones.

**C5.** Choose what shows: **/admin → Reviews** → the *From Google* section now
lists what was synced, each with a *Show on the site* tick. Untick any you'd
rather not feature. (Hiding a card never changes the rating or review count in
the headline — those stay Google's own numbers.)

**C6.** Publish from /admin as usual to commit and deploy.

---

## Part D — Add the key to Netlify

Local success only proves the key works. The live site rebuilds on Netlify,
which has its own environment.

**D1.** Netlify → your site → **Site configuration** → **Environment
variables** → **Add a variable**.

**D2.** Key: `GOOGLE_MAPS_API_KEY`. Value: the same key. Scope: leave all
deploy contexts selected.

Netlify will warn that *"one or more of the values you entered looks like it
may be a secret"* — that's expected, and you should **mark it as a secret**. It
masks the value in the UI, logs and CLI, and turns on secrets scanning, which
fails the build if that string ever appears in `dist/`. That's a useful alarm:
this key must never reach the browser. Note that once marked secret the value
can't be read back in Netlify, so keep the copy in your `.env`.

Save.

You do **not** need to add the Place ID here — it lives in `settings.json`,
which is committed with your content.

**D3.** Trigger a deploy (publishing from /admin does this). In Netlify's
**Deploy log**, search for `sync-google-reviews` and confirm you see the
`wrote N reviews` line rather than a warning.

**D4.** Open the live homepage and confirm the Google tile and cards are there.

---

## How it behaves from then on

- **Refresh cadence:** every build. Publishing from /admin refreshes the
  reviews; so does the weekly scheduled rebuild. Nothing is fetched from a
  visitor's browser — the reviews are baked into the HTML, which is why they
  also count for SEO.
- **Google returns at most five reviews, and Google picks which.** There is no
  API for your full review history and no way to request specific ones. Your
  curated reviews in /admin → Reviews are what fill the rest of the section.
- **Your rating and total review count are always complete and live** (e.g.
  "4.9 from 214 reviews") even though only five texts come through.
- **Attribution stays intact:** each Google card keeps the reviewer's name,
  photo, "2 months ago" timestamp, and a link back to the review on Google.
  That's required by Google's terms — please don't strip it.
- **If a fetch ever fails**, the build ships the last synced file and logs a
  warning, so a Google outage can't take your site down.

---

## Troubleshooting

| What you see | What it means | Fix |
|---|---|---|
| `Missing GOOGLE_MAPS_API_KEY` | The script can't see the key | Locally: is it in `.env`, spelled exactly, no `VITE_` prefix, no quotes? On Netlify: is the variable added to the right site and deploy context? |
| `No Place ID` | Settings has no `googlePlaceId` | Part B, then paste it in /admin → Settings and save |
| `403` / `PERMISSION_DENIED` | Wrong API enabled, key restricted too tightly, or billing not linked | Confirm **Places API (New)** is enabled (A4), the key's API restriction includes it (A6), Application restrictions is **None**, and billing is attached (A3) |
| `404` / `NOT_FOUND` | The Place ID doesn't resolve | Re-copy it from the Place ID Finder; make sure you didn't grab a CID or a truncated string |
| `400` / `INVALID_ARGUMENT` | Malformed Place ID or field mask | Check for stray spaces or quotes around the ID |
| `wrote 0 reviews` but a rating appears | Key and Place ID are right; Google simply returned no review text | Nothing to fix in the code — the rating and count still show, and your curated reviews fill the cards |
| Works locally, missing on the live site | The key isn't in Netlify's environment | Part D, then redeploy |

---

## If you'd rather not create a Google Cloud key

You can skip all of the above: in **/admin → Reviews**, add your best Google
reviews by hand and set *Where it was left* to **Google**. They'll render with
the Google logo, identical to the synced ones.

The trade-offs: copy them **verbatim** (they're real people's words), you
maintain them manually, and the Google rating tile in the header won't appear,
because that number can only come from Google itself.
