# Tallest Tourguide — 12-Week Visibility Assignment

**Goal:** maximize search and social visibility for tallesttourguide.com in the USA/Canada, UK/Ireland, German-speaking Europe, and Scandinavia — while owning the local market ("tours in Sarajevo / Bosnia") outright.
**Budget:** ~10 hours/week for 12 weeks.
**Written:** July 2026.

Your weekly 10 hours, split the same way every week once the setup weeks are done:

| Bucket | Hours/week |
|---|---|
| Content (1 journal post) | 3.0 |
| Social (film, edit, post, engage) | 3.0 |
| Reviews + Google Business Profile | 1.5 |
| Outreach (links, listings, PR) | 1.5 |
| Measurement + admin | 1.0 |

---

## 0. Where you stand (audit summary)

The technical foundation is already better than most tour operators ever get: every page is prerendered with unique titles, descriptions and canonical URLs; sitemap and RSS are generated on every deploy; tours carry Product + FAQ + Breadcrumb structured data; the site is mobile-first and fast; GA4 is installed; GSC and GBP are set up.

Shipped in the July 2026 code batch (deploy before starting Week 1):

- One email everywhere: `hello@tallesttourguide.com` (footer previously showed the Gmail address — NAP consistency matters for local rankings).
- Business schema upgraded to `TravelAgency` with phone, email, full street address (Hamdije Kreševljakovića 61, 71000), map link, and Instagram + TripAdvisor profiles.
- New `Organization` + `WebSite` structured data site-wide.
- Checkout and review pages marked `noindex`; `/admin/` blocked in robots.txt.
- Every tour, package, and journal post now shares with its own hero image on WhatsApp/Facebook/iMessage/LinkedIn (previously a generic image, and journal share images were broken).
- Stale meta description on /multi-day-tours fixed.

**Your one rule for everything below:** every public URL you type anywhere on the internet uses the trailing-slash form, e.g. `https://tallesttourguide.com/tours/sarajevo-war-tour/` — that is the canonical form the site serves without a redirect.

---

## Week 1 — Command center (one-time setup, ~10h)

### 1.1 Google Search Console (you have it — now work it)

- [ ] **Sitemap check:** GSC → *Indexing → Sitemaps*. `sitemap.xml` should show status **Success** with **51 discovered URLs**. If it isn't submitted, type `sitemap.xml` and hit Submit.
- [ ] **Page indexing sweep:** *Indexing → Pages*. Work the "Why pages aren't indexed" table:
  - *Page with redirect* on `/blog/*` URLs is correct (they 301 to /journal/) — ignore.
  - *Crawled – currently not indexed* on a tour/package/journal page = a page Google saw but didn't think worth indexing. Improve that page's content (length, uniqueness) and interlink to it from other pages.
  - *Discovered – currently not indexed* = crawl scheduling; usually resolves alone. Recheck in 2 weeks.
- [ ] **Request indexing after the deploy:** *URL Inspection* (top bar) → paste each money URL (all 10 `/tours/…/`, all 7 `/packages/…/`, the homepage, `/tours/`, `/multi-day-tours/`) → "Request indexing". ~20 URLs, 10–15 min. This pushes the new schema live in Google's index days faster.
- [ ] **Baseline snapshot:** *Performance → Search results*, last 28 days. Export (top-right) to a spreadsheet. Record: total clicks, total impressions, average position, top 20 queries. This is your Week-0 number — every KPI below is measured against it.
- [ ] **Monthly ritual (put it in your calendar):** Performance report → filter *Position greater than 8* → sort by impressions. These "striking distance" queries (positions 8–20) are your cheapest wins: strengthen the page that ranks for them (add a paragraph answering the query verbatim, add it to a heading, interlink to it).

### 1.2 Google Business Profile (your local-market weapon)

Manage at business.google.com → "Tallest Tourguide & Friends".

- [ ] **Category:** primary **Tour operator**; add secondary "Tour agency" and "Walking tour organizer" if offered.
- [ ] **Confirm NAP exactly matches the site:** Hamdije Kreševljakovića 61, Sarajevo 71000 · +387 62 664 244 · website `https://tallesttourguide.com/` · hours 08:00–20:00 daily. Identical everywhere, always.
- [ ] **Services:** add every tour as a Service (name, € price, 2–3 sentence description) and link each to its page with UTM, e.g. `https://tallesttourguide.com/tours/sarajevo-war-tour/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
- [ ] **Photos:** upload 20+ real ones — guests on tours (with permission), Baščaršija, the Tunnel of Hope group shots, food from the cooking class, and a straight-to-camera portrait of Almedin. Listings with 100+ photos get dramatically more direction requests; add ~5/week forever.
- [ ] **Q&A:** with a personal Google account, ask the 6 questions guests always ask (Do tours run in winter? Where do we meet? Is the war tour appropriate for kids? Do you do private tours? Card or cash? How far ahead should I book?) — then answer each from the business account.
- [ ] **Review link:** GBP dashboard → *Ask for reviews* → copy the short `g.page/r/…` link. You need this for §2.
- [ ] **Weekly Update post** (recurring, 15 min/week): one photo + 100–150 words + "Learn more" button to a tour page (with the UTM). Repurpose the week's best Instagram post.

### 1.3 The other engines (do once, mostly forgotten afterwards)

- [ ] **Bing Webmaster Tools** (bing.com/webmasters): sign in → **Import from Google Search Console** → done in 10 minutes. This covers Bing, DuckDuckGo, and — importantly — **ChatGPT and Copilot web answers**, which use Bing's index. Verify the sitemap imported.
- [ ] **Bing Places** (bingplaces.com): "Import from Google Business Profile". Syncs your listing into Bing Maps.
- [ ] **Apple Business Connect** (businessconnect.apple.com): claim the Sarajevo place card. Apple Maps is the default maps app for the majority of your US/UK/Scandinavian guests' iPhones. Match NAP exactly.
- [ ] **GA4 Key Events:** GA4 → *Admin → Events* → toggle **Mark as key event** for `begin_checkout` and `purchase` (the site already fires `view_item`, `begin_checkout`, `purchase`, `scroll_depth`, `cta_click`). Now every report can show which channels produce bookings, not just visits.
- [ ] **Ahrefs Webmaster Tools** (free, ahrefs.com/webmaster-tools): verify via GSC. Gives you a free backlink profile and technical crawl. Check monthly.
- [ ] **Schema validation:** run `https://tallesttourguide.com/tours/sarajevo-war-tour/` and one package through search.google.com/test/rich-results — you should see Product, FAQ, and Breadcrumb eligibility. Re-run after any schema change.
- [ ] **Speed baseline:** pagespeed.web.dev on the homepage and one tour page, mobile. Record the scores with your Week-0 snapshot.

---

## 2. The review engine (Week 1 setup, then automatic) — highest-leverage item in this plan

You have **4.9★ / 180 reviews on TripAdvisor** and far fewer on Google. Google reviews are the #1 local-pack ranking factor and your social proof in the knowledge panel. Mirror the TripAdvisor velocity onto Google.

**The system:** the evening after every tour, send each guest (or the group's booker) this WhatsApp message — you already have every guest on WhatsApp:

> Hi {name}, Almedin here. It was a pleasure showing you {Sarajevo / Mostar / …} today — I hope the rest of your trip is wonderful. If you have two minutes, a Google review helps a small local operation like ours more than you'd believe: {g.page/r/… link}
> If you're more of a TripAdvisor person, that works too: {TripAdvisor link}. Safe travels! 🇧🇦

Rules that make it work:

- Send it the **same evening** (memory fresh, trip ongoing, phone in hand).
- **One person, one ask, one link first** — Google first because that's where you're behind; alternate to TripAdvisor once Google passes ~100.
- **Reply to every review within 48h**, named and specific ("Glad the Tunnel visit landed, Sarah"). Replies are a ranking signal and read by every future guest.
- Never incentivize reviews (against Google policy; risks the whole profile).
- Track in a simple sheet: date, guest, sent Y/N, review appeared Y/N. Target: **10+ new Google reviews per month** in season.

---

## 3. Listings & citations (Weeks 2–4, ~1.5h/week from the outreach bucket)

Consistency matters more than volume: same name, address, phone, and `https://tallesttourguide.com/` everywhere.

- [ ] **TripAdvisor polish:** refresh the listing description to mirror the site's positioning, confirm the website URL is present, upload 10 recent photos, and check every tour you sell is listed as an offering.
- [ ] **GetYourGuide + Viator (decision made: do it with 2–3 hero tours).** List the Mostar day trip, the war tour, and the walking tour. Yes, commission is ~20–30% — treat it as paid marketing: the listings rank on page 1 for "Sarajevo tours" in every one of your target markets (the *billboard effect*), reviews accumulate fast, and OTA guests convert to direct bookers for their next trip via your WhatsApp relationship. Keep your best sellers' *premium variants* (home-hosted dinner, Srebrenica, signature journeys) **direct-only** so the site keeps exclusive inventory.
- [ ] **Local BiH citations:** Visit Sarajevo / Sarajevo tourism board directory, Sarajevo Navigator, Canton Sarajevo tourism association, visitbih / national tourism portals — request listing or correction on each. These .ba links are also your strongest local relevance signals.
- [ ] **Partner links (ongoing):** every hotel/hostel/guesthouse you already work with in Sarajevo has a "recommendations" or "things to do" page. Ask each (you know them personally) to link "guided tours: Tallest Tourguide". Aim for 5–10 over the 12 weeks — these are genuinely good backlinks.
- [ ] **Facebook Page** (needed here, not just for social): create it with full NAP so it works as a citation + lets you join Balkan travel groups as the brand. One hour, once.

---

## 4. Content engine — one journal post per week (Weeks 2–12, 3h/week)

Every post: 1,200–1,800 words, written in your voice (the existing journal's tone is exactly right — keep it), one target query in the title and H1, 3-question FAQ block at the end, 2–3 internal links to tour/package pages and 1 to a destination page, hero image with descriptive alt text. Publish via the admin CMS; the build pipeline handles sitemap, RSS, schema, and share images automatically.

The calendar (titles are the target Google query — verify each in GSC/autocomplete before writing and adjust wording to what people actually type):

| Week | Post | Target query / market note |
|---|---|---|
| 2 | Is Bosnia and Herzegovina Safe to Visit in 2026? An Honest Local Answer | "is bosnia safe to visit" — the #1 hesitation in all four markets; your Safe Travels page links into it |
| 3 | Sarajevo in Two Days: A Local Guide's Perfect Itinerary | "2 days in sarajevo", "sarajevo itinerary" |
| 4 | Day Trips from Sarajevo, Ranked by the Guide Who Runs Them | "day trips from sarajevo" — links to all day-tour pages |
| 5 | Sarajevo to Mostar: Tour vs Bus vs Train vs Driving (2026 prices) | "sarajevo to mostar" — huge comparison query; be genuinely fair to the bus |
| 6 | What to Eat in Sarajevo: 15 Dishes and Exactly Where to Find Them | "sarajevo food", feeds the cooking-class tour |
| 7 | How Many Days Do You Need in Bosnia? 3, 5, 7 and 10-Day Routes | "bosnia itinerary" — links to all packages |
| 8 | Visiting Srebrenica: How to Do It, and How to Do It Respectfully | supports the Srebrenica tour; handle with the same care as the existing Srebrenica post |
| 9 | The Best Time to Visit Bosnia, Month by Month | "best time to visit bosnia" — evergreen; Scandinavian/DACH summer planners |
| 10 | Sarajevo Airport to the City: Every Option (2026) | "sarajevo airport to city centre" — high intent, zero competition |
| 11 | Bosnia in Winter: What's Open, What's Worth It, What to Skip | "bosnia in winter" — fills your low season |
| 12 | Ten Things I Tell Every Guest Before They Land in Sarajevo | shareable; your email/WhatsApp pre-arrival asset too |

Also in this bucket: when a post is live, spend 10 minutes adding an internal link **to it** from the 2–3 most related existing pages (old posts, tour pages, the Bosnia guide). Orphan posts don't rank.

**DACH/Scandinavia note:** both markets read English travel content comfortably — no translated site needed this quarter. The German experiment (one `/de/` landing page) is a P2 item for after Week 12 if GSC shows meaningful German-language impressions.

---

## 5. Social media system (3h/week)

**Architecture: film once, publish four times.** Instagram (@tallest.tourguide) is the hub; every vertical video is exported and uploaded natively to TikTok, Facebook Reels, and YouTube Shorts (same caption, platform-native upload — never cross-post with watermarks).

**Cadence:**

- 3 vertical videos/week (30–60s), filmed on tour days on your phone.
- Stories 3–4×/week (behind-the-scenes, guest moments, polls).
- 1 GBP Update/week (from §1.2, reusing the best video's photo + text).
- Pinterest: one batch session per month — 10–15 pins from journal-post images linking to the posts ("Bosnia itinerary", "Sarajevo food guide" boards). Pinterest is search, not social: pins compound for years and skew to your US market.

**Five content pillars (rotate; never invent a sixth):**

1. **Place, told properly** — 45 seconds on the Mostar bridge divers, the Sarajevo roses, Baščaršija at dawn. Your existing footage archive is the asset.
2. **Guide to camera** — one historical mini-story ("WWI started on this corner. Here's the part the textbooks skip."). This is the differentiator; nobody can copy your delivery.
3. **Food** — burek, ćevapi, Bosnian coffee ritual. Highest share-rate travel content there is.
4. **Guests** — reactions, group moments, review screenshots (with permission). Social proof.
5. **Practical answers** — the same queries as the journal calendar in 30 seconds ("Is Bosnia safe? I've guided here 14 years — here's the honest answer."). These convert.

**Timing:** post **18:00–20:00 CET weekdays** — that's evening for UK/IE/DACH/Scandinavia and lunchtime on the US East Coast. Sunday 10:00 CET is your second slot (trip-planning time).

**Community (counts as social time, 20 min/day max):** join r/travel, r/Sarajevo, r/Balkans and the big "Bosnia & Herzegovina Travel" / "Balkan Travel Tips" Facebook groups **as a helpful local, not an advertiser**. Answer questions thoroughly; mention the site only when someone literally asks for a guide, or in your profile. One genuinely helpful Reddit answer about Sarajevo outranks weeks of self-promotion — and these threads are exactly what ChatGPT and Google's AI answers quote when someone asks "best tour guide in Sarajevo".

---

## 6. Backlinks & digital PR (Weeks 4–12, ~2 pitches/week)

- **Travel bloggers who already wrote about Bosnia** (search `"things to do in sarajevo" blog` and `bosnia itinerary blog`): pitch a correction/addition ("your Mostar post is great — the bridge-diving fee changed this year, happy to fact-check as a local guide") or offer a hosted tour on their next visit. Goal: a mention + link as "local guide".
- **Journalist request platforms:** create free source profiles on **Qwoted**, **Source of Sources (SOS)**, and **Featured.com** (HARO's successors). Answer 2–3 travel/Balkans requests per week — 10 minutes each. One landed quote in a "where to go in 2027" listicle is a top-tier link.
- **Podcasts:** pitch 4–5 travel podcasts (history-of-travel and off-path-destination shows) with the angle "14 years guiding Sarajevo: what visitors get wrong about Bosnia". One booking = a link + an hour of trust-building audio.
- **Partner hotels/hostels** (from §3) — keep asking; this is the most reliable link source you have.
- **Track it:** one spreadsheet — date, target, angle, sent, reply, link URL. Target for the quarter: **8–12 new referring domains** (check in Ahrefs Webmaster Tools monthly).

---

## 7. Dev backlog (code work, scheduled around the marketing)

**P1 (weeks 3–6, ~1 session each):**

- CMS `metaTitle` / `metaDescription` fields for tours, packages, destinations, and journal posts (admin editors + wire into detail pages, falling back to today's auto-derived text). Unlocks per-page optimization driven by the GSC striking-distance ritual.
- FAQs for packages (data + reuse the existing `FAQSchema` on PackageDetail).
- Destination pages: expand each of the 8 from teaser-length to real 800+ word guides (one per week alongside the journal calendar, or fold into it).

**P2 (after Week 12 / as results justify):**

- Display real guest reviews on tour pages (the `/review/` flow already collects them) with `Review` schema.
- German landing-page experiment for DACH if GSC shows German queries.
- Populate `accommodations.json` and make Where We Stay data-driven when real content exists.

---

## 8. The 12-week calendar

| Week | Focus | Ship list |
|---|---|---|
| 1 | Command center | Deploy code batch → §1.1–1.3 complete, Week-0 baseline recorded, review message template saved, review link in hand |
| 2 | Reviews + first post | Review engine running after every tour · Post: *Is Bosnia Safe* · Facebook page live · 3 reels |
| 3 | Local citations | Post: *Sarajevo in Two Days* · BiH directories submitted · GBP services all linked · P1: CMS meta fields |
| 4 | OTA launch | Post: *Day Trips Ranked* · GetYourGuide/Viator listings live (3 tours) · first 2 PR pitches · **Checkpoint 1** (below) |
| 5 | Comparison content | Post: *Sarajevo to Mostar* · Qwoted/SOS/Featured profiles live · 2 pitches |
| 6 | Food + Pinterest | Post: *What to Eat* · first Pinterest batch (15 pins) · P1: package FAQs · 2 pitches |
| 7 | Itineraries | Post: *How Many Days* · hotel partner asks (batch of 5) · 2 pitches |
| 8 | Difficult history | Post: *Visiting Srebrenica* · **Checkpoint 2** · GSC striking-distance ritual #1 → pick 3 pages to strengthen |
| 9 | Seasonality | Post: *Best Time to Visit* · strengthen the 3 pages from Week 8 · podcast pitches |
| 10 | High-intent practical | Post: *Airport to City* · second Pinterest batch · 2 pitches |
| 11 | Low season | Post: *Bosnia in Winter* · destination-page expansion continues · 2 pitches |
| 12 | Wrap + compound | Post: *Ten Things I Tell Every Guest* · **Checkpoint 3 / quarter review** · write next quarter's calendar from GSC data |

**Weekly 30-minute Monday ritual (the measurement hour):** GSC Performance last 7 days vs. previous (clicks, new queries) → GA4 key events by channel → GBP performance (calls, direction requests, website clicks) → new reviews replied to → log one row in your KPI sheet.

---

## 9. KPIs

| Metric | Week 0 | Wk 4 target | Wk 8 target | Wk 12 target |
|---|---|---|---|---|
| Google reviews (count) | record it | +10 | +25 | +40 |
| GSC clicks / 28 days | record it | +15% | +40% | +100% |
| GSC impressions / 28 days | record it | +25% | +60% | +150% |
| Local pack for "sarajevo tours" (incognito) | record it | top 3 | top 3 | #1 |
| Referring domains (Ahrefs) | record it | +2 | +6 | +10 |
| GA4 `begin_checkout` from organic+GBP / month | record it | +20% | +50% | +100% |
| IG followers / avg reel views | record it | trend up | trend up | 2× views |
| Every tour page indexed w/ rich result (GSC Enhancements) | check | ✔ | ✔ | ✔ |

Judge weeks 1–4 on **activity** (everything shipped?), weeks 5–12 on **trend** (every line moving?). SEO compounds: the quarter's work keeps paying out in months 4–12.

---

## 10. Tips, tricks, and things not to do

- **AI search is already sending you guests.** ChatGPT/Perplexity/Google AI answers assemble from Bing's index, Reddit, TripAdvisor, and review counts. Your levers: Bing Webmaster (done Week 1), genuine Reddit/forum answers (§5), review volume (§2), and FAQ schema (done). No tricks required — the honest version wins here.
- **Never buy links or reviews.** One penalty erases the quarter. The partner-hotel and PR links above are the safe, durable kind.
- **Don't touch the SEO invariants** in the README: every new page needs `<SEO>` + a route in `scripts/routes.mjs`; changed URLs need a 301 in `_redirects`; never add static meta to `index.html`.
- **UTM discipline:** tag every off-site link you control (`?utm_source=gbp|instagram|tiktok|pinterest|newsletter&utm_medium=organic&utm_campaign=<what>`), never tag internal links. Otherwise Week-12 attribution is guesswork.
- **Season reality:** July–September is your high season — content written now ranks by next spring's planning wave. The winter post (Week 11) and low-season GBP activity are what smooth revenue.
- **One prerender warning:** the weekly Monday auto-rebuild only refreshes content; if a build ever fails on Netlify, the last good deploy stays live — check Netlify deploy notifications weekly in your measurement hour.
